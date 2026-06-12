import React, { createContext, useContext, useReducer, useCallback, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type {
  Product, ShoppingListItem, AppSettings, Toast, Page,
  Room, FilterOption, SortOption, StockStatus, UnitType
} from '@/types';
import { getTranslation, isRTLLanguage } from '@/lib/i18n';

// ─── Default Settings ───
const defaultSettings: AppSettings = {
  language: 'system',
  theme: 'dark',
  notificationsEnabled: true,
  dailyAlertTime: '09:00',
  defaultMinThreshold: 2,
  shoppingListReminderFreq: 'daily',
  defaultUnit: 'bottles',
  defaultExportFormat: 'pdf',
};

// ─── Storage Keys ───
const STORAGE_KEYS = {
  products: 'hc_products',
  shoppingList: 'hc_shopping_list',
  rooms: 'hc_rooms',
  settings: 'hc_settings',
  drafts: 'hc_drafts',
};

// ─── Default Rooms ───
const defaultRooms: Room[] = ['kitchen', 'bathroom', 'bedroom', 'living', 'laundry', 'storage', 'other'];

// ─── Helpers ───
function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch { /* ignore */ }
  return fallback;
}

function saveToStorage(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch { /* ignore */ }
}

function getStockStatus(product: Product): StockStatus {
  if (product.quantity <= 0) return 'out-of-stock';
  if (product.quantity <= product.minThreshold) return 'low-stock';
  return 'in-stock';
}

function daysUntilExpiry(expiryDate?: string): number | null {
  if (!expiryDate) return null;
  const diff = new Date(expiryDate).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// ─── State Type ───
interface AppState {
  products: Product[];
  shoppingList: ShoppingListItem[];
  customRooms: Room[];
  settings: AppSettings;
  currentPage: Page;
  selectedProductId: string | null;
  selectedRoom: Room | null;
  toasts: Toast[];
  filter: FilterOption;
  sort: SortOption;
  isLoaded: boolean;
}

type Action =
  | { type: 'INIT_STATE'; payload: Partial<AppState> }
  | { type: 'SET_PAGE'; page: Page; productId?: string | null; room?: Room | null }
  | { type: 'ADD_PRODUCT'; product: Product }
  | { type: 'UPDATE_PRODUCT'; product: Product }
  | { type: 'DELETE_PRODUCT'; id: string }
  | { type: 'ADJUST_QUANTITY'; id: string; delta: number }
  | { type: 'ADD_TO_SHOPPING_LIST'; productId: string }
  | { type: 'ADD_CUSTOM_SHOPPING_ITEM'; item: ShoppingListItem }
  | { type: 'MARK_PURCHASED'; itemId: string; qty: number }
  | { type: 'REMOVE_SHOPPING_ITEM'; id: string }
  | { type: 'CLEAR_COMPLETED_SHOPPING' }
  | { type: 'ADD_CUSTOM_ROOM'; room: Room }
  | { type: 'RENAME_ROOM'; oldRoom: Room; newRoom: Room }
  | { type: 'DELETE_ROOM'; room: Room }
  | { type: 'UPDATE_SETTINGS'; settings: Partial<AppSettings> }
  | { type: 'SET_FILTER'; filter: FilterOption }
  | { type: 'SET_SORT'; sort: SortOption }
  | { type: 'ADD_TOAST'; toast: Toast }
  | { type: 'REMOVE_TOAST'; id: string }
  | { type: 'RESET_DATA' }
  | { type: 'IMPORT_DATA'; products: Product[]; count: number };

// ─── Reducer ───
function appReducer(state: AppState, action: Action): AppState {
  let newState = { ...state };

  switch (action.type) {
    case 'INIT_STATE':
      newState = { ...newState, ...action.payload, isLoaded: true };
      break;

    case 'SET_PAGE':
      newState.currentPage = action.page;
      newState.selectedProductId = action.productId ?? null;
      newState.selectedRoom = action.room ?? null;
      break;

    case 'ADD_PRODUCT': {
      const products = [...state.products, action.product];
      newState.products = products;
      saveToStorage(STORAGE_KEYS.products, products);
      // Auto-add to shopping list if low stock
      if (getStockStatus(action.product) !== 'in-stock') {
        const existing = state.shoppingList.find(i => i.productId === action.product.id);
        if (!existing) {
          const item: ShoppingListItem = {
            id: uuidv4(),
            productId: action.product.id,
            name: action.product.name,
            category: action.product.category,
            room: action.product.rooms[0],
            suggestedQuantity: action.product.minThreshold + 2,
            pricePerUnit: action.product.pricePerUnit,
            isCustom: false,
            completed: false,
            createdAt: new Date().toISOString(),
          };
          newState.shoppingList = [...state.shoppingList, item];
          saveToStorage(STORAGE_KEYS.shoppingList, newState.shoppingList);
        }
      }
      break;
    }

    case 'UPDATE_PRODUCT': {
      const prods = state.products.map(p => p.id === action.product.id ? action.product : p);
      newState.products = prods;
      saveToStorage(STORAGE_KEYS.products, prods);
      // Update shopping list item if exists
      newState.shoppingList = state.shoppingList.map(item => {
        if (item.productId === action.product.id) {
          return { ...item, name: action.product.name, category: action.product.category, room: action.product.rooms[0], pricePerUnit: action.product.pricePerUnit };
        }
        return item;
      });
      saveToStorage(STORAGE_KEYS.shoppingList, newState.shoppingList);
      break;
    }

    case 'DELETE_PRODUCT': {
      const filtered = state.products.filter(p => p.id !== action.id);
      newState.products = filtered;
      saveToStorage(STORAGE_KEYS.products, filtered);
      // Remove from shopping list
      newState.shoppingList = state.shoppingList.filter(i => i.productId !== action.id);
      saveToStorage(STORAGE_KEYS.shoppingList, newState.shoppingList);
      break;
    }

    case 'ADJUST_QUANTITY': {
      const updated = state.products.map(p => {
        if (p.id === action.id) {
          const newQty = Math.max(0, p.quantity + action.delta);
          return { ...p, quantity: newQty, updatedAt: new Date().toISOString() };
        }
        return p;
      });
      newState.products = updated;
      saveToStorage(STORAGE_KEYS.products, updated);
      // Auto-add to shopping list if now low stock
      const product = updated.find(p => p.id === action.id);
      if (product && getStockStatus(product) !== 'in-stock' && action.delta < 0) {
        const existing = state.shoppingList.find(i => i.productId === action.id);
        if (!existing) {
          const item: ShoppingListItem = {
            id: uuidv4(),
            productId: product.id,
            name: product.name,
            category: product.category,
            room: product.rooms[0],
            suggestedQuantity: product.minThreshold + 2,
            pricePerUnit: product.pricePerUnit,
            isCustom: false,
            completed: false,
            createdAt: new Date().toISOString(),
          };
          newState.shoppingList = [...state.shoppingList, item];
          saveToStorage(STORAGE_KEYS.shoppingList, newState.shoppingList);
        }
      }
      break;
    }

    case 'ADD_TO_SHOPPING_LIST': {
      const product = state.products.find(p => p.id === action.productId);
      if (!product) break;
      const existing = state.shoppingList.find(i => i.productId === action.productId && !i.completed);
      if (existing) break;
      const item: ShoppingListItem = {
        id: uuidv4(),
        productId: product.id,
        name: product.name,
        category: product.category,
        room: product.rooms[0],
        suggestedQuantity: product.minThreshold + 2,
        pricePerUnit: product.pricePerUnit,
        isCustom: false,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      newState.shoppingList = [...state.shoppingList, item];
      saveToStorage(STORAGE_KEYS.shoppingList, newState.shoppingList);
      break;
    }

    case 'ADD_CUSTOM_SHOPPING_ITEM':
      newState.shoppingList = [...state.shoppingList, action.item];
      saveToStorage(STORAGE_KEYS.shoppingList, newState.shoppingList);
      break;

    case 'MARK_PURCHASED': {
      const item = state.shoppingList.find(i => i.id === action.itemId);
      if (item && item.productId) {
        const prods = state.products.map(p => {
          if (p.id === item.productId) {
            return { ...p, quantity: p.quantity + action.qty, updatedAt: new Date().toISOString() };
          }
          return p;
        });
        newState.products = prods;
        saveToStorage(STORAGE_KEYS.products, prods);
      }
      newState.shoppingList = state.shoppingList.filter(i => i.id !== action.itemId);
      saveToStorage(STORAGE_KEYS.shoppingList, newState.shoppingList);
      break;
    }

    case 'REMOVE_SHOPPING_ITEM':
      newState.shoppingList = state.shoppingList.filter(i => i.id !== action.id);
      saveToStorage(STORAGE_KEYS.shoppingList, newState.shoppingList);
      break;

    case 'CLEAR_COMPLETED_SHOPPING':
      newState.shoppingList = state.shoppingList.filter(i => !i.completed);
      saveToStorage(STORAGE_KEYS.shoppingList, newState.shoppingList);
      break;

    case 'ADD_CUSTOM_ROOM':
      if (!state.customRooms.includes(action.room) && !defaultRooms.includes(action.room)) {
        newState.customRooms = [...state.customRooms, action.room];
        saveToStorage(STORAGE_KEYS.rooms, newState.customRooms);
      }
      break;

    case 'RENAME_ROOM': {
      const newCustomRooms = state.customRooms.map(r => r === action.oldRoom ? action.newRoom : r);
      newState.customRooms = newCustomRooms;
      saveToStorage(STORAGE_KEYS.rooms, newCustomRooms);
      // Update products
      const renamedProducts = state.products.map(p => ({
        ...p,
        rooms: p.rooms.map(r => r === action.oldRoom ? action.newRoom : r),
      }));
      newState.products = renamedProducts;
      saveToStorage(STORAGE_KEYS.products, renamedProducts);
      // Update shopping list
      newState.shoppingList = state.shoppingList.map(i => ({
        ...i,
        room: i.room === action.oldRoom ? action.newRoom : i.room,
      }));
      saveToStorage(STORAGE_KEYS.shoppingList, newState.shoppingList);
      break;
    }

    case 'DELETE_ROOM': {
      newState.customRooms = state.customRooms.filter(r => r !== action.room);
      saveToStorage(STORAGE_KEYS.rooms, newState.customRooms);
      // Unassign from products
      const unassigned = state.products.map(p => ({
        ...p,
        rooms: p.rooms.filter(r => r !== action.room),
      }));
      newState.products = unassigned;
      saveToStorage(STORAGE_KEYS.products, unassigned);
      break;
    }

    case 'UPDATE_SETTINGS':
      newState.settings = { ...state.settings, ...action.settings };
      saveToStorage(STORAGE_KEYS.settings, newState.settings);
      break;

    case 'SET_FILTER':
      newState.filter = { ...state.filter, ...action.filter };
      break;

    case 'SET_SORT':
      newState.sort = action.sort;
      break;

    case 'ADD_TOAST':
      newState.toasts = [...state.toasts, action.toast];
      break;

    case 'REMOVE_TOAST':
      newState.toasts = state.toasts.filter(t => t.id !== action.id);
      break;

    case 'RESET_DATA':
      newState.products = [];
      newState.shoppingList = [];
      newState.customRooms = [];
      saveToStorage(STORAGE_KEYS.products, []);
      saveToStorage(STORAGE_KEYS.shoppingList, []);
      saveToStorage(STORAGE_KEYS.rooms, []);
      break;

    case 'IMPORT_DATA': {
      const merged = [...state.products];
      let added = 0;
      for (const p of action.products) {
        if (!merged.find(existing => existing.id === p.id)) {
          merged.push(p);
          added++;
        }
      }
      newState.products = merged;
      saveToStorage(STORAGE_KEYS.products, merged);
      break;
    }

    default:
      return state;
  }

  return newState;
}

// ─── Context Type ───
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  t: (key: import('@/lib/i18n').TranslationKey) => string;
  isRTL: boolean;
  navigate: (page: Page, productId?: string, room?: Room) => void;
  showToast: (message: string, type: Toast['type']) => void;
  getAllRooms: () => Room[];
  getFilteredProducts: () => Product[];
  getStockStatus: (product: Product) => StockStatus;
  getDaysUntilExpiry: (expiryDate?: string) => number | null;
}

const AppContext = createContext<AppContextType | null>(null);

// ─── Provider ───
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, {
    products: [],
    shoppingList: [],
    customRooms: [],
    settings: defaultSettings,
    currentPage: 'dashboard',
    selectedProductId: null,
    selectedRoom: null,
    toasts: [],
    filter: { category: 'all', room: 'all', stockStatus: 'all' },
    sort: 'name-asc',
    isLoaded: false,
  });

  // Load from localStorage on mount
  useEffect(() => {
    const products = loadFromStorage<Product[]>(STORAGE_KEYS.products, []);
    const shoppingList = loadFromStorage<ShoppingListItem[]>(STORAGE_KEYS.shoppingList, []);
    const customRooms = loadFromStorage<Room[]>(STORAGE_KEYS.rooms, []);
    const settings = loadFromStorage<AppSettings>(STORAGE_KEYS.settings, defaultSettings);

    dispatch({
      type: 'INIT_STATE',
      payload: { products, shoppingList, customRooms, settings },
    });

    // Apply theme
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else if (settings.theme === 'light') {
      root.classList.remove('dark');
    } else {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }

    // Apply RTL
    const isRTL = isRTLLanguage(settings.language);
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }, []);

  // Theme effect
  useEffect(() => {
    const root = document.documentElement;
    if (state.settings.theme === 'dark') {
      root.classList.add('dark');
    } else if (state.settings.theme === 'light') {
      root.classList.remove('dark');
    }
    const isRTL = isRTLLanguage(state.settings.language);
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }, [state.settings.theme, state.settings.language]);

  const t = useCallback(
    (key: import('@/lib/i18n').TranslationKey) => getTranslation(state.settings.language, key),
    [state.settings.language]
  );

  const isRTL = isRTLLanguage(state.settings.language);

  const navigate = useCallback((page: Page, productId?: string, room?: Room) => {
    dispatch({ type: 'SET_PAGE', page, productId: productId ?? null, room: room ?? null });
  }, []);

  const toastTimeouts = useRef<Record<string, number>>({});

  const showToast = useCallback((message: string, type: Toast['type']) => {
    const id = uuidv4();
    dispatch({ type: 'ADD_TOAST', toast: { id, message, type, duration: 3000 } });
    const timeoutId = window.setTimeout(() => {
      dispatch({ type: 'REMOVE_TOAST', id });
    }, 3000);
    toastTimeouts.current[id] = timeoutId;
  }, []);

  const getAllRooms = useCallback(() => {
    return [...defaultRooms, ...state.customRooms];
  }, [state.customRooms]);

  const getFilteredProducts = useCallback(() => {
    let result = [...state.products];
    const f = state.filter;

    if (f.search) {
      const q = f.search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        p.category.toLowerCase().includes(q) ||
        p.rooms.some(r => r.toLowerCase().includes(q))
      );
    }

    if (f.category && f.category !== 'all') {
      result = result.filter(p => p.category === f.category);
    }

    if (f.room && f.room !== 'all') {
      result = result.filter(p => p.rooms.includes(f.room as Room));
    }

    if (f.stockStatus && f.stockStatus !== 'all') {
      result = result.filter(p => getStockStatus(p) === f.stockStatus);
    }

    if (f.expiringSoon) {
      result = result.filter(p => {
        const days = daysUntilExpiry(p.expirationDate);
        return days !== null && days > 0 && days <= 30;
      });
    }

    if (f.expired) {
      result = result.filter(p => {
        const days = daysUntilExpiry(p.expirationDate);
        return days !== null && days <= 0;
      });
    }

    // Sort
    switch (state.sort) {
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'quantity-asc':
        result.sort((a, b) => a.quantity - b.quantity);
        break;
      case 'expiry-asc':
        result.sort((a, b) => {
          if (!a.expirationDate) return 1;
          if (!b.expirationDate) return -1;
          return new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime();
        });
        break;
      case 'date-added':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'category':
        result.sort((a, b) => a.category.localeCompare(b.category));
        break;
    }

    return result;
  }, [state.products, state.filter, state.sort]);

  const contextValue: AppContextType = {
    state,
    dispatch,
    t,
    isRTL,
    navigate,
    showToast,
    getAllRooms,
    getFilteredProducts,
    getStockStatus,
    getDaysUntilExpiry: daysUntilExpiry,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}

export { getStockStatus, daysUntilExpiry, defaultRooms };

// Convert StockStatus to TranslationKey
export function stockStatusToKey(status: StockStatus): import('@/lib/i18n').TranslationKey {
  const map: Record<StockStatus, import('@/lib/i18n').TranslationKey> = {
    'in-stock': 'inStock',
    'low-stock': 'lowStock',
    'out-of-stock': 'outOfStock',
  };
  return map[status];
}

// Map unit value to translation key
export function unitToKey(unit: UnitType): import('@/lib/i18n').TranslationKey {
  const map: Record<UnitType, import('@/lib/i18n').TranslationKey> = {
    'bottles': 'bottles_unit',
    'boxes': 'boxes_unit',
    'bags': 'bags_unit',
    'rolls': 'rolls_unit',
    'pieces': 'pieces_unit',
    'liters': 'liters_unit',
    'other': 'other_unit',
  };
  return map[unit];
}

// Map room value to translation key (some rooms have different keys than their values)
export function roomToKey(room: string): import('@/lib/i18n').TranslationKey {
  const map: Record<string, import('@/lib/i18n').TranslationKey> = {
    'kitchen': 'kitchenRoom',
    'bathroom': 'bathroom',
    'bedroom': 'bedroom',
    'living': 'living',
    'laundry': 'laundryRoom',
    'storage': 'storage',
    'other': 'otherRoom',
  };
  return map[room] || (room as import('@/lib/i18n').TranslationKey);
}

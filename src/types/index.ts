export type Category =
  | 'cleaning'
  | 'toiletries'
  | 'laundry'
  | 'kitchen'
  | 'medical'
  | 'baby'
  | 'pet'
  | 'other';

export type Room =
  | 'kitchen'
  | 'bathroom'
  | 'bedroom'
  | 'living'
  | 'laundry'
  | 'storage'
  | 'other'
  | string;

export type UnitType =
  | 'bottles'
  | 'boxes'
  | 'bags'
  | 'rolls'
  | 'pieces'
  | 'liters'
  | 'other';

export type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock';

export type Language = 'en' | 'ar' | 'fr' | 'system';

export type ThemeMode = 'dark' | 'light' | 'system';

export type ExportFormat = 'pdf' | 'txt' | 'json';

export type NotificationFrequency = 'daily' | 'weekly' | 'never';

export interface Product {
  id: string;
  name: string;
  photo?: string;
  category: Category;
  rooms: Room[];
  brand?: string;
  quantity: number;
  unit: UnitType;
  minThreshold: number;
  expirationDate?: string;
  purchaseDate?: string;
  pricePerUnit?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShoppingListItem {
  id: string;
  productId?: string;
  name: string;
  category?: Category;
  room?: Room;
  suggestedQuantity: number;
  pricePerUnit?: number;
  isCustom: boolean;
  completed: boolean;
  createdAt: string;
}

export interface AppSettings {
  language: Language;
  theme: ThemeMode;
  notificationsEnabled: boolean;
  dailyAlertTime: string;
  defaultMinThreshold: number;
  shoppingListReminderFreq: NotificationFrequency;
  defaultUnit: UnitType;
  defaultExportFormat: ExportFormat;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
  duration?: number;
}

export type Page =
  | 'dashboard'
  | 'products'
  | 'add-product'
  | 'edit-product'
  | 'product-detail'
  | 'rooms'
  | 'room-detail'
  | 'shopping-list'
  | 'settings'
  | 'export';

export type FilterOption = {
  category?: Category | 'all';
  room?: Room | 'all';
  stockStatus?: StockStatus | 'all';
  expiringSoon?: boolean;
  expired?: boolean;
  search?: string;
};

export type SortOption =
  | 'name-asc'
  | 'quantity-asc'
  | 'expiry-asc'
  | 'date-added'
  | 'category';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, Search, Plus, Minus, ShoppingCart, Pencil, Trash2,
  X, Filter
} from 'lucide-react';
import { useApp, getStockStatus, daysUntilExpiry, stockStatusToKey, roomToKey } from '@/hooks/useAppContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { Product, SortOption, Category, Room, StockStatus } from '@/types';

export default function Products() {
  const { state, dispatch, navigate, t, showToast, getAllRooms, getFilteredProducts } = useApp();
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const allRooms = getAllRooms();

  const handleSearch = (val: string) => {
    setSearchQuery(val);
    dispatch({ type: 'SET_FILTER', filter: { ...state.filter, search: val || undefined } });
  };

  const handleCategoryFilter = (cat: Category | 'all') => {
    dispatch({ type: 'SET_FILTER', filter: { ...state.filter, category: cat } });
  };

  const handleRoomFilter = (room: Room | 'all') => {
    dispatch({ type: 'SET_FILTER', filter: { ...state.filter, room: room as Room | 'all' } });
  };

  const handleStatusFilter = (status: StockStatus | 'all') => {
    dispatch({ type: 'SET_FILTER', filter: { ...state.filter, stockStatus: status } });
  };

  const handleSort = (sort: SortOption) => {
    dispatch({ type: 'SET_SORT', sort });
  };

  const handleQuickAdjust = (product: Product, delta: number) => {
    dispatch({ type: 'ADJUST_QUANTITY', id: product.id, delta });
    const newQty = Math.max(0, product.quantity + delta);
    if (delta < 0 && newQty <= product.minThreshold) {
      showToast(t('lowStockAlert'), 'warning');
    }
  };

  const handleAddToShopping = (product: Product) => {
    dispatch({ type: 'ADD_TO_SHOPPING_LIST', productId: product.id });
    showToast(t('itemAddedToList'), 'success');
  };

  const handleDelete = (product: Product) => {
    if (window.confirm(t('deleteProductConfirm'))) {
      dispatch({ type: 'DELETE_PRODUCT', id: product.id });
      showToast(t('productDeleted'), 'success');
    }
  };

  const products = getFilteredProducts();

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="p-4 md:p-6 space-y-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('products')}</h1>
        <Button
          size="sm"
          onClick={() => navigate('add-product')}
          className="rounded-full bg-gradient-to-r from-teal-500 to-cyan-500"
        >
          <Plus className="w-4 h-4 mr-1" />
          {t('addProduct')}
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder={t('search') + '...'}
          className="pl-10 h-11 rounded-xl"
        />
        {searchQuery && (
          <button onClick={() => handleSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Filter Toggle */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <Button
          variant={showFilters ? 'default' : 'outline'}
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="shrink-0 rounded-full"
        >
          <Filter className="w-4 h-4 mr-1" />
          {t('filter')}
        </Button>
        <div className="w-px h-8 bg-border shrink-0" />
        <Button
          variant={state.sort === 'name-asc' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleSort('name-asc')}
          className="shrink-0 rounded-full text-xs"
        >
          {t('sortByName')}
        </Button>
        <Button
          variant={state.sort === 'quantity-asc' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleSort('quantity-asc')}
          className="shrink-0 rounded-full text-xs"
        >
          {t('sortByQuantity')}
        </Button>
        <Button
          variant={state.sort === 'expiry-asc' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleSort('expiry-asc')}
          className="shrink-0 rounded-full text-xs"
        >
          {t('sortByExpiry')}
        </Button>
      </div>

      {/* Expanded Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 rounded-xl bg-card/50 border border-border/50 space-y-3">
              {/* Category filter */}
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">{t('filterByCategory')}</p>
                <div className="flex flex-wrap gap-2">
                  <FilterPill active={state.filter.category === 'all'} onClick={() => handleCategoryFilter('all')}>
                    {t('allCategories')}
                  </FilterPill>
                  {(['cleaning', 'toiletries', 'laundry', 'kitchen', 'medical', 'baby', 'pet', 'other'] as Category[]).map(cat => (
                    <FilterPill key={cat} active={state.filter.category === cat} onClick={() => handleCategoryFilter(cat)}>
                      {t(cat)}
                    </FilterPill>
                  ))}
                </div>
              </div>
              {/* Room filter */}
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">{t('filterByRoom')}</p>
                <div className="flex flex-wrap gap-2">
                  <FilterPill active={state.filter.room === 'all'} onClick={() => handleRoomFilter('all')}>
                    {t('allRooms')}
                  </FilterPill>
                  {allRooms.map(room => (
                    <FilterPill key={room} active={state.filter.room === room} onClick={() => handleRoomFilter(room)}>
                      {t(roomToKey(room)) || room}
                    </FilterPill>
                  ))}
                </div>
              </div>
              {/* Status filter */}
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">{t('filterByStatus')}</p>
                <div className="flex flex-wrap gap-2">
                  <FilterPill active={state.filter.stockStatus === 'all'} onClick={() => handleStatusFilter('all')}>
                    {t('allStatuses')}
                  </FilterPill>
                  <FilterPill active={state.filter.stockStatus === 'in-stock'} onClick={() => handleStatusFilter('in-stock')}>
                    {t('inStock')}
                  </FilterPill>
                  <FilterPill active={state.filter.stockStatus === 'low-stock'} onClick={() => handleStatusFilter('low-stock')}>
                    {t('lowStock')}
                  </FilterPill>
                  <FilterPill active={state.filter.stockStatus === 'out-of-stock'} onClick={() => handleStatusFilter('out-of-stock')}>
                    {t('outOfStock')}
                  </FilterPill>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Grid */}
      {products.length === 0 ? (
        <EmptyState />
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              variants={item}
              onNavigate={() => navigate('product-detail', product.id)}
              onAdjust={handleQuickAdjust}
              onAddToShopping={handleAddToShopping}
              onDelete={handleDelete}
              onEdit={() => navigate('edit-product', product.id)}
              t={t}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}

function FilterPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
        active
          ? 'bg-primary text-primary-foreground'
          : 'bg-muted text-muted-foreground hover:bg-accent'
      }`}
    >
      {children}
    </button>
  );
}

function ProductCard({
  product, variants, onNavigate, onAdjust, onAddToShopping, onDelete, onEdit, t
}: {
  product: Product;
  variants: any;
  onNavigate: () => void;
  onAdjust: (p: Product, d: number) => void;
  onAddToShopping: (p: Product) => void;
  onDelete: (p: Product) => void;
  onEdit: () => void;
  t: (k: import('@/lib/i18n').TranslationKey) => string;
}) {
  const status = getStockStatus(product);
  const expiryDays = daysUntilExpiry(product.expirationDate);

  const statusConfig = {
    'in-stock': { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/20', glow: '' },
    'low-stock': { bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/30', glow: 'shadow-amber-500/10' },
    'out-of-stock': { bg: 'bg-red-500/10', text: 'text-red-500', border: 'border-red-500/30', glow: 'shadow-red-500/10' },
  };

  const cfg = statusConfig[status];

  return (
    <motion.div
      variants={variants}
      layout
      className={`group relative rounded-xl bg-card/60 backdrop-blur-sm border ${cfg.border} ${cfg.glow} hover:shadow-lg transition-all overflow-hidden`}
    >
      {/* Card Header - Clickable */}
      <div onClick={onNavigate} className="cursor-pointer">
        <div className="relative h-40 bg-gradient-to-br from-muted/50 to-muted overflow-hidden">
          {product.photo ? (
            <img src={product.photo} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-16 h-16 text-muted-foreground/20" />
            </div>
          )}
          <div className="absolute top-2 right-2 flex gap-1">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(); }}
              className="p-1.5 rounded-lg bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(product); }}
              className="p-1.5 rounded-lg bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-500" />
            </button>
          </div>
          <div className="absolute bottom-2 left-2 flex gap-1 flex-wrap">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${cfg.bg} ${cfg.text}`}>
              {t(stockStatusToKey(status))}
            </span>
            {expiryDays !== null && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                expiryDays <= 0 ? 'bg-red-500/10 text-red-500' :
                expiryDays <= 7 ? 'bg-orange-500/10 text-orange-500' :
                'bg-amber-500/10 text-amber-500'
              }`}>
                {expiryDays <= 0 ? t('expired') : `${expiryDays}d`}
              </span>
            )}
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-sm truncate">{product.name}</h3>
          {product.brand && <p className="text-xs text-muted-foreground">{product.brand}</p>}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="px-2 py-0.5 rounded-md bg-muted text-[10px] font-medium text-muted-foreground">
              {t(product.category)}
            </span>
            {product.rooms.slice(0, 2).map(room => (
              <span key={room} className="px-2 py-0.5 rounded-md bg-muted/50 text-[10px] text-muted-foreground">
                {t(roomToKey(room)) || room}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Actions Footer */}
      <div className="px-4 pb-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onAdjust(product, -1)}
            className="p-2 rounded-lg bg-muted hover:bg-accent transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-10 text-center text-sm font-semibold">{product.quantity}</span>
          <button
            onClick={() => onAdjust(product, 1)}
            className="p-2 rounded-lg bg-muted hover:bg-accent transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        {(status === 'low-stock' || status === 'out-of-stock') && (
          <button
            onClick={() => onAddToShopping(product)}
            className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
}

function EmptyState() {
  const { t, navigate } = useApp();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-4">
        <Package className="w-10 h-10 text-muted-foreground/40" />
      </div>
      <h3 className="text-lg font-semibold text-muted-foreground">{t('noProductsFound')}</h3>
      <p className="text-sm text-muted-foreground/60 mt-1">{t('addYourFirstProduct')}</p>
      <Button
        onClick={() => navigate('add-product')}
        className="mt-4 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500"
      >
        <Plus className="w-4 h-4 mr-1" />
        {t('addProduct')}
      </Button>
    </motion.div>
  );
}

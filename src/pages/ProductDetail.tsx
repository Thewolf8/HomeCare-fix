import { motion } from 'framer-motion';
import {
  ArrowLeft, Package, Pencil, Trash2, ShoppingCart,
  Plus, Minus, Calendar, DollarSign, Home, Tag, FileText
} from 'lucide-react';
import { useApp, getStockStatus, daysUntilExpiry, roomToKey } from '@/hooks/useAppContext';
import { Button } from '@/components/ui/button';

export default function ProductDetail() {
  const { state, dispatch, navigate, t, showToast } = useApp();

  const product = state.products.find(p => p.id === state.selectedProductId);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">{t('noProductsFound')}</p>
      </div>
    );
  }

  const status = getStockStatus(product);
  const expiryDays = daysUntilExpiry(product.expirationDate);

  const statusConfig = {
    'in-stock': { bg: 'bg-emerald-500/10', text: 'text-emerald-500', label: t('inStock') },
    'low-stock': { bg: 'bg-amber-500/10', text: 'text-amber-500', label: t('lowStock') },
    'out-of-stock': { bg: 'bg-red-500/10', text: 'text-red-500', label: t('outOfStock') },
  };
  const cfg = statusConfig[status];

  const handleDelete = () => {
    if (window.confirm(t('deleteProductConfirm'))) {
      dispatch({ type: 'DELETE_PRODUCT', id: product.id });
      showToast(t('productDeleted'), 'success');
      navigate('products');
    }
  };

  const handleAdjust = (delta: number) => {
    dispatch({ type: 'ADJUST_QUANTITY', id: product.id, delta });
  };

  const handleAddToShopping = () => {
    dispatch({ type: 'ADD_TO_SHOPPING_LIST', productId: product.id });
    showToast(t('itemAddedToList'), 'success');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <button onClick={() => navigate('products')} className="p-2 -ml-2 rounded-lg hover:bg-accent transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold truncate max-w-[200px]">{product.name}</h1>
          <div className="flex gap-1">
            <button onClick={() => navigate('edit-product', product.id)} className="p-2 rounded-lg hover:bg-accent transition-colors">
              <Pencil className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Hero Image / Status */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="relative h-48 rounded-2xl bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
            {product.photo ? (
              <img src={product.photo} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-24 h-24 text-muted-foreground/20" />
              </div>
            )}
            <div className="absolute bottom-4 left-4 flex gap-2">
              <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${cfg.bg} ${cfg.text}`}>
                {cfg.label}
              </span>
              {expiryDays !== null && (
                <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                  expiryDays <= 0 ? 'bg-red-500/10 text-red-500' :
                  expiryDays <= 7 ? 'bg-orange-500/10 text-orange-500' :
                  'bg-amber-500/10 text-amber-500'
                }`}>
                  {expiryDays <= 0 ? t('expired') : `${expiryDays}d ${t('expiringSoon')}`}
                </span>
              )}
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => handleAdjust(-1)} className="p-3 rounded-xl bg-muted hover:bg-accent transition-colors">
              <Minus className="w-5 h-5" />
            </button>
            <span className="text-3xl font-bold w-16 text-center">{product.quantity}</span>
            <button onClick={() => handleAdjust(1)} className="p-3 rounded-xl bg-muted hover:bg-accent transition-colors">
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="flex gap-2">
            {(status === 'low-stock' || status === 'out-of-stock') && (
              <Button onClick={handleAddToShopping} variant="outline" className="rounded-xl">
                <ShoppingCart className="w-4 h-4 mr-1" />
                {t('addToShoppingList')}
              </Button>
            )}
          </div>
        </motion.div>

        {/* Details */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="space-y-4">
          <h2 className="text-lg font-semibold">{t('productDetails')}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailRow icon={Tag} label={t('category')} value={t(product.category)} />
            {product.brand && <DetailRow icon={Tag} label={t('brand')} value={product.brand} />}
            <DetailRow icon={Home} label={t('rooms')} value={product.rooms.map(r => t(roomToKey(r)) || r).join(', ')} />
            <DetailRow icon={Package} label={t('quantity')} value={`${product.quantity} ${t(product.unit + '_unit' as any) || product.unit}`} />
            <DetailRow icon={Tag} label={t('minThreshold')} value={`${product.minThreshold} ${t(product.unit + '_unit' as any) || product.unit}`} />
            {product.expirationDate && <DetailRow icon={Calendar} label={t('expirationDate')} value={new Date(product.expirationDate).toLocaleDateString()} />}
            {product.purchaseDate && <DetailRow icon={Calendar} label={t('purchaseDate')} value={new Date(product.purchaseDate).toLocaleDateString()} />}
            {product.pricePerUnit && <DetailRow icon={DollarSign} label={t('pricePerUnit')} value={`$${product.pricePerUnit.toFixed(2)}`} />}
          </div>

          {product.notes && (
            <div className="p-4 rounded-xl bg-muted/50">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">{t('notes')}</span>
              </div>
              <p className="text-sm">{product.notes}</p>
            </div>
          )}
        </motion.div>

        {/* Danger Zone */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="pt-6 pb-8">
          <Button
            onClick={handleDelete}
            variant="outline"
            className="w-full h-12 rounded-xl border-red-500/30 text-red-500 hover:bg-red-500/10 hover:text-red-500"
          >
            <Trash2 className="w-5 h-5 mr-2" />
            {t('deleteProduct')}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }: { icon: typeof Package; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-card/40">
      <Icon className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

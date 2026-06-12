import { motion } from 'framer-motion';
import {
  ArrowLeft, Package, Plus, Minus, ShoppingCart,
  Pencil, Trash2, DoorOpen
} from 'lucide-react';
import { useApp, getStockStatus, daysUntilExpiry, stockStatusToKey, roomToKey } from '@/hooks/useAppContext';

export default function RoomDetail() {
  const { state, dispatch, navigate, t, showToast } = useApp();

  const room = state.selectedRoom;
  if (!room) {
    navigate('rooms');
    return null;
  }

  const roomProducts = state.products.filter(p => p.rooms.includes(room));

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const handleAdjust = (productId: string, delta: number) => {
    dispatch({ type: 'ADJUST_QUANTITY', id: productId, delta });
  };

  const handleAddToShopping = (productId: string) => {
    dispatch({ type: 'ADD_TO_SHOPPING_LIST', productId });
    showToast(t('itemAddedToList'), 'success');
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t('deleteProductConfirm'))) {
      dispatch({ type: 'DELETE_PRODUCT', id });
      showToast(t('productDeleted'), 'success');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <button onClick={() => navigate('rooms')} className="p-2 -ml-2 rounded-lg hover:bg-accent transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">{t(roomToKey(room)) || room}</h1>
          <span className="text-sm text-muted-foreground">{roomProducts.length} {t('products')}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {roomProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <DoorOpen className="w-10 h-10 text-muted-foreground/40" />
            </div>
            <h3 className="text-lg font-semibold text-muted-foreground">{t('noProductsFound')}</h3>
            <p className="text-sm text-muted-foreground/60 mt-1">{t('startAddingProducts')}</p>
          </motion.div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {roomProducts.map((product) => {
              const status = getStockStatus(product);
              const expiryDays = daysUntilExpiry(product.expirationDate);

              return (
                <motion.div
                  key={product.id}
                  variants={item}
                  layout
                  className="group p-4 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all"
                >
                  <div onClick={() => navigate('product-detail', product.id)} className="cursor-pointer">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                        {product.photo ? (
                          <img src={product.photo} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Package className="w-6 h-6 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm truncate">{product.name}</h3>
                        {product.brand && <p className="text-xs text-muted-foreground">{product.brand}</p>}
                        <div className="flex gap-1 mt-1">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                            status === 'in-stock' ? 'bg-emerald-500/10 text-emerald-500' :
                            status === 'low-stock' ? 'bg-amber-500/10 text-amber-500' :
                            'bg-red-500/10 text-red-500'
                          }`}>
                            {t(stockStatusToKey(status))}
                          </span>
                          {expiryDays !== null && (
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                              expiryDays <= 0 ? 'bg-red-500/10 text-red-500' :
                              expiryDays <= 7 ? 'bg-orange-500/10 text-orange-500' :
                              'bg-amber-500/10 text-amber-500'
                            }`}>
                              {expiryDays <= 0 ? t('expired') : `${expiryDays}d`}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-border/30">
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleAdjust(product.id, -1)} className="p-1.5 rounded-lg bg-muted hover:bg-accent transition-colors">
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{product.quantity}</span>
                      <button onClick={() => handleAdjust(product.id, 1)} className="p-1.5 rounded-lg bg-muted hover:bg-accent transition-colors">
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex gap-1">
                      {(status === 'low-stock' || status === 'out-of-stock') && (
                        <button onClick={() => handleAddToShopping(product.id)} className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                          <ShoppingCart className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button onClick={() => navigate('edit-product', product.id)} className="p-1.5 rounded-lg bg-muted hover:bg-accent transition-colors opacity-0 group-hover:opacity-100">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="p-1.5 rounded-lg bg-muted hover:bg-red-500/10 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}

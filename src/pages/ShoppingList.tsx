import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ShoppingCart, Plus, Minus, Trash2, Check, Share2,
  X, CheckCircle2, Circle
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useApp, roomToKey } from '@/hooks/useAppContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { ShoppingListItem } from '@/types';

type GroupMode = 'none' | 'room' | 'category';

export default function ShoppingList() {
  const { state, dispatch, navigate, t, showToast } = useApp();

  const [groupMode, setGroupMode] = useState<GroupMode>('none');
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customQty, setCustomQty] = useState(1);
  const [purchaseItem, setPurchaseItem] = useState<string | null>(null);
  const [purchaseQty, setPurchaseQty] = useState(1);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const pendingItems = state.shoppingList.filter(i => !i.completed);
  const totalEstimated = pendingItems.reduce((sum, i) => sum + (i.pricePerUnit || 0) * i.suggestedQuantity, 0);

  const handleMarkPurchased = (itemId: string) => {
    setPurchaseItem(itemId);
    const item = state.shoppingList.find(i => i.id === itemId);
    if (item) setPurchaseQty(item.suggestedQuantity);
  };

  const confirmPurchase = () => {
    if (purchaseItem) {
      dispatch({ type: 'MARK_PURCHASED', itemId: purchaseItem, qty: purchaseQty });
      showToast(t('itemMarkedPurchased'), 'success');
      setPurchaseItem(null);
    }
  };

  const handleAddCustom = () => {
    if (!customName.trim()) return;
    const item: ShoppingListItem = {
      id: uuidv4(),
      name: customName.trim(),
      suggestedQuantity: customQty,
      isCustom: true,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_CUSTOM_SHOPPING_ITEM', item });
    showToast(t('customItemAdded'), 'success');
    setCustomName('');
    setCustomQty(1);
    setShowAddCustom(false);
  };

  const handleShare = () => {
    const lines = [
      `🛒 ${t('appName')} - ${t('shoppingList')}`,
      '',
      ...pendingItems.map((item, i) => `${i + 1}. ${item.name} x${item.suggestedQuantity}${item.pricePerUnit ? ` ($${(item.pricePerUnit * item.suggestedQuantity).toFixed(2)})` : ''}`),
      '',
      totalEstimated > 0 ? `${t('totalEstimated')}: $${totalEstimated.toFixed(2)}` : '',
    ];
    const text = lines.join('\n');

    if (navigator.share) {
      navigator.share({ title: t('shoppingList'), text });
    } else {
      navigator.clipboard.writeText(text);
      showToast(t('exportSuccess'), 'success');
    }
  };

  const toggleChecked = (id: string) => {
    setCheckedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleClearCompleted = () => {
    dispatch({ type: 'CLEAR_COMPLETED_SHOPPING' });
    setCheckedItems(new Set());
    showToast(t('completedCleared'), 'success');
  };

  // Group items
  const getGroupedItems = () => {
    if (groupMode === 'none') return { [t('shoppingList')]: pendingItems };
    const groups: Record<string, ShoppingListItem[]> = {};
    for (const item of pendingItems) {
      const key = groupMode === 'room'
        ? (item.room ? t(roomToKey(item.room)) || item.room : t('other'))
        : (item.category ? t(item.category) : t('other'));
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    }
    return groups;
  };

  const grouped = getGroupedItems();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <button onClick={() => navigate('dashboard')} className="p-2 -ml-2 rounded-lg hover:bg-accent transition-colors md:hidden">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">{t('shoppingList')}</h1>
          <span className="text-sm text-muted-foreground">{pendingItems.length} {t('itemsPending')}</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        {/* Summary Card */}
        {pendingItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-gradient-to-br from-teal-500/10 to-cyan-500/10 border border-teal-500/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{pendingItems.length}</p>
                <p className="text-xs text-muted-foreground">{t('itemsPending')}</p>
              </div>
              {totalEstimated > 0 && (
                <div className="text-right">
                  <p className="text-xl font-bold">${totalEstimated.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">{t('totalEstimated')}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Actions */}
        <div className="flex gap-2 flex-wrap">
          <Button size="sm" variant="outline" onClick={() => setShowAddCustom(true)} className="rounded-full">
            <Plus className="w-4 h-4 mr-1" /> {t('addCustomItem')}
          </Button>
          <Button size="sm" variant="outline" onClick={handleShare} className="rounded-full">
            <Share2 className="w-4 h-4 mr-1" /> {t('shareList')}
          </Button>
          {checkedItems.size > 0 && (
            <Button size="sm" variant="outline" onClick={handleClearCompleted} className="rounded-full border-red-500/30 text-red-500 hover:bg-red-500/10">
              <Trash2 className="w-4 h-4 mr-1" /> {t('clearCompleted')}
            </Button>
          )}
        </div>

        {/* Group Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setGroupMode('none')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${groupMode === 'none' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
          >
            All
          </button>
          <button
            onClick={() => setGroupMode('room')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${groupMode === 'room' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
          >
            {t('groupByRoom')}
          </button>
          <button
            onClick={() => setGroupMode('category')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${groupMode === 'category' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
          >
            {t('groupByCategory')}
          </button>
        </div>

        {/* Add Custom Item */}
        <AnimatePresence>
          {showAddCustom && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="p-4 rounded-xl bg-card/50 border border-border/50 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">{t('addCustomItem')}</label>
                  <button onClick={() => setShowAddCustom(false)} className="p-1 rounded-lg hover:bg-accent"><X className="w-4 h-4" /></button>
                </div>
                <Input value={customName} onChange={(e) => setCustomName(e.target.value)} placeholder={t('itemName')} className="h-11 rounded-xl" />
                <div className="flex gap-2">
                  <div className="flex items-center gap-2 flex-1">
                    <button type="button" onClick={() => setCustomQty(Math.max(1, customQty - 1))} className="p-2 rounded-lg bg-muted hover:bg-accent"><Minus className="w-4 h-4" /></button>
                    <Input type="number" value={customQty} onChange={(e) => setCustomQty(Math.max(1, parseInt(e.target.value) || 1))} className="text-center" />
                    <button type="button" onClick={() => setCustomQty(customQty + 1)} className="p-2 rounded-lg bg-muted hover:bg-accent"><Plus className="w-4 h-4" /></button>
                  </div>
                  <Button onClick={handleAddCustom} className="rounded-xl">{t('addProduct')}</Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Items */}
        {pendingItems.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-4">
            {Object.entries(grouped).map(([groupName, items]) => (
              <div key={groupName} className="space-y-2">
                {groupMode !== 'none' && (
                  <h3 className="text-sm font-semibold text-muted-foreground px-1">{groupName}</h3>
                )}
                <div className="space-y-2">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        className={`p-4 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50 transition-all ${
                          checkedItems.has(item.id) ? 'opacity-50' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => toggleChecked(item.id)}
                            className="mt-0.5 shrink-0"
                          >
                            {checkedItems.has(item.id) ? (
                              <CheckCircle2 className="w-5 h-5 text-primary" />
                            ) : (
                              <Circle className="w-5 h-5 text-muted-foreground" />
                            )}
                          </button>
                          <div className="flex-1 min-w-0" onClick={() => item.productId && navigate('product-detail', item.productId)}>
                            <h3 className={`font-medium text-sm ${checkedItems.has(item.id) ? 'line-through text-muted-foreground' : ''}`}>
                              {item.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              {item.category && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                                  {t(item.category)}
                                </span>
                              )}
                              {item.room && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground">
                                  {t(roomToKey(item.room)) || item.room}
                                </span>
                              )}
                              <span className="text-[10px] text-muted-foreground">
                                {t('suggestedQty')}: {item.suggestedQuantity}
                              </span>
                              {item.pricePerUnit && (
                                <span className="text-[10px] text-muted-foreground">
                                  ${(item.pricePerUnit * item.suggestedQuantity).toFixed(2)}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-1 shrink-0">
                            <button
                              onClick={() => handleMarkPurchased(item.id)}
                              className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                              title={t('markAsPurchased')}
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                dispatch({ type: 'REMOVE_SHOPPING_ITEM', id: item.id });
                                showToast(t('productDeleted'), 'success');
                              }}
                              className="p-2 rounded-lg bg-muted hover:bg-red-500/10 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Purchase Dialog */}
      <AnimatePresence>
        {purchaseItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center"
            onClick={() => setPurchaseItem(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-background rounded-t-2xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{t('markAsPurchased')}</h3>
                <button onClick={() => setPurchaseItem(null)} className="p-1 rounded-lg hover:bg-accent">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground">{t('howManyBought')}</p>
              <div className="flex items-center justify-center gap-4">
                <button onClick={() => setPurchaseQty(Math.max(1, purchaseQty - 1))} className="p-3 rounded-xl bg-muted hover:bg-accent transition-colors">
                  <Minus className="w-5 h-5" />
                </button>
                <span className="text-4xl font-bold w-20 text-center">{purchaseQty}</span>
                <button onClick={() => setPurchaseQty(purchaseQty + 1)} className="p-3 rounded-xl bg-muted hover:bg-accent transition-colors">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <Button onClick={confirmPurchase} className="w-full h-12 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500">
                <Check className="w-5 h-5 mr-2" />
                {t('confirm')}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function EmptyState() {
  const { t } = useApp();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-4">
        <ShoppingCart className="w-10 h-10 text-muted-foreground/40" />
      </div>
      <h3 className="text-lg font-semibold text-muted-foreground">{t('noShoppingItems')}</h3>
      <p className="text-sm text-muted-foreground/60 mt-1">{t('startAddingProducts')}</p>
    </motion.div>
  );
}

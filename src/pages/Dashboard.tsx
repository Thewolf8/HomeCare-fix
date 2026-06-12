import { motion } from 'framer-motion';
import {
  Package, AlertTriangle, XCircle, Clock, DoorOpen,
  ShoppingCart, PlusCircle, Search, ChevronRight, Sparkles,
  TrendingDown, CalendarClock
} from 'lucide-react';
import { useApp, getStockStatus, daysUntilExpiry, stockStatusToKey, roomToKey, unitToKey } from '@/hooks/useAppContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';


export default function Dashboard() {
  const { state, navigate, t, getAllRooms } = useApp();

  const stats = {
    total: state.products.length,
    lowStock: state.products.filter(p => getStockStatus(p) === 'low-stock').length,
    outOfStock: state.products.filter(p => getStockStatus(p) === 'out-of-stock').length,
    expiringSoon: state.products.filter(p => {
      const days = daysUntilExpiry(p.expirationDate);
      return days !== null && days > 0 && days <= 30;
    }).length,
    expired: state.products.filter(p => {
      const days = daysUntilExpiry(p.expirationDate);
      return days !== null && days <= 0;
    }).length,
    shoppingPending: state.shoppingList.filter(i => !i.completed).length,
  };

  const allRooms = getAllRooms();

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.07 } },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const recentProducts = [...state.products]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const criticalProducts = state.products.filter(p => {
    const status = getStockStatus(p);
    const days = daysUntilExpiry(p.expirationDate);
    return status === 'out-of-stock' || status === 'low-stock' || (days !== null && days <= 7);
  }).slice(0, 5);

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{t('appName')}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t('appTagline')}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('settings')}
            className="rounded-full"
          >
            <Sparkles className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={t('search') + '...'}
            className="pl-10 h-12 rounded-xl bg-card/50 backdrop-blur-sm border-muted"
            onChange={(e) => {
              if (e.target.value) {
                navigate('products');
              }
            }}
          />
        </div>
      </motion.div>

      {/* Stat Cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3"
      >
        <StatCard
          icon={Package}
          label={t('totalProducts')}
          value={stats.total}
          color="bg-blue-500/10 text-blue-500"
          onClick={() => navigate('products')}
          variants={item}
        />
        <StatCard
          icon={AlertTriangle}
          label={t('lowStockItems')}
          value={stats.lowStock}
          color="bg-amber-500/10 text-amber-500"
          alert={stats.lowStock > 0}
          onClick={() => navigate('products')}
          variants={item}
        />
        <StatCard
          icon={XCircle}
          label={t('outOfStockItems')}
          value={stats.outOfStock}
          color="bg-red-500/10 text-red-500"
          alert={stats.outOfStock > 0}
          onClick={() => navigate('products')}
          variants={item}
        />
        <StatCard
          icon={CalendarClock}
          label={t('expiringSoon')}
          value={stats.expiringSoon}
          color="bg-orange-500/10 text-orange-500"
          alert={stats.expiringSoon > 0}
          onClick={() => navigate('products')}
          variants={item}
        />
        <StatCard
          icon={Clock}
          label={t('expired')}
          value={stats.expired}
          color="bg-rose-500/10 text-rose-500"
          alert={stats.expired > 0}
          onClick={() => navigate('products')}
          variants={item}
        />
        <StatCard
          icon={ShoppingCart}
          label={t('shoppingListItems')}
          value={stats.shoppingPending}
          color="bg-teal-500/10 text-teal-500"
          alert={stats.shoppingPending > 0}
          onClick={() => navigate('shopping-list')}
          variants={item}
        />
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex gap-3"
      >
        <Button
          onClick={() => navigate('add-product')}
          className="flex-1 h-12 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white shadow-lg shadow-teal-500/20"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          {t('addProduct')}
        </Button>
        <Button
          onClick={() => navigate('shopping-list')}
          variant="outline"
          className="flex-1 h-12 rounded-xl"
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          {t('viewShoppingList')}
        </Button>
      </motion.div>

      {/* Critical Alerts Section */}
      {criticalProducts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-semibold">{t('criticalAlerts')}</h2>
          </div>
          <div className="space-y-2">
            {criticalProducts.map((product) => {
              const status = getStockStatus(product);
              const expiryDays = daysUntilExpiry(product.expirationDate);
              let alertClass = 'border-l-4 border-l-emerald-500';
              let alertMsg = '';
              if (status === 'out-of-stock') {
                alertClass = 'border-l-4 border-l-red-500 bg-red-500/5';
                alertMsg = t('outOfStock');
              } else if (status === 'low-stock') {
                alertClass = 'border-l-4 border-l-amber-500 bg-amber-500/5';
                alertMsg = `${t('lowStock')}: ${product.quantity} ${t(unitToKey(product.unit))}`;
              } else if (expiryDays !== null && expiryDays <= 7) {
                alertClass = 'border-l-4 border-l-orange-500 bg-orange-500/5';
                alertMsg = expiryDays <= 0 ? t('expired') : `${t('expiringSoon')}: ${expiryDays}d`;
              }

              return (
                <motion.div
                  key={product.id}
                  layout
                  onClick={() => navigate('product-detail', product.id)}
                  className={`p-3 rounded-xl cursor-pointer hover:bg-accent/50 transition-colors ${alertClass}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-muted`}>
                        {product.photo ? (
                          <img src={product.photo} alt="" className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <Package className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{alertMsg}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Rooms Overview */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DoorOpen className="w-5 h-5 text-teal-500" />
            <h2 className="text-lg font-semibold">{t('rooms')}</h2>
          </div>
          <button
            onClick={() => navigate('rooms')}
            className="text-sm text-primary flex items-center gap-1 hover:underline"
          >
            {t('viewAll')} <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {allRooms.slice(0, 6).map((room) => {
            const count = state.products.filter(p => p.rooms.includes(room)).length;
            const issues = state.products.filter(p =>
              p.rooms.includes(room) && getStockStatus(p) !== 'in-stock'
            ).length;
            return (
              <motion.button
                key={room}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('room-detail', undefined, room)}
                className="relative p-4 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all text-left"
              >
                <p className="text-xs text-muted-foreground uppercase tracking-wider">{t(roomToKey(room)) || room}</p>
                <p className="text-2xl font-bold mt-1">{count}</p>
                <p className="text-xs text-muted-foreground">{t('products')}</p>
                {issues > 0 && (
                  <span className="absolute top-2 right-2 min-w-[20px] h-5 flex items-center justify-center text-[10px] font-bold bg-amber-500 text-white rounded-full px-1.5">
                    {issues}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Recently Added */}
      {recentProducts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{t('recentlyAdded')}</h2>
            <button
              onClick={() => navigate('products')}
              className="text-sm text-primary flex items-center gap-1 hover:underline"
            >
              {t('viewAll')} <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2">
            {recentProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                onClick={() => navigate('product-detail', product.id)}
                className="flex items-center gap-3 p-3 rounded-xl bg-card/40 hover:bg-card/70 transition-colors cursor-pointer"
              >
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                  {product.photo ? (
                    <img src={product.photo} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Package className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{t(product.category)} • {product.quantity} {t(unitToKey(product.unit))}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  getStockStatus(product) === 'in-stock' ? 'bg-emerald-500/10 text-emerald-500' :
                  getStockStatus(product) === 'low-stock' ? 'bg-amber-500/10 text-amber-500' :
                  'bg-red-500/10 text-red-500'
                }`}>
                  {t(stockStatusToKey(getStockStatus(product)))}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

function StatCard({
  icon: Icon, label, value, color, alert, onClick, variants
}: {
  icon: typeof Package;
  label: string;
  value: number;
  color: string;
  alert?: boolean;
  onClick: () => void;
  variants: any;
}) {
  return (
    <motion.button
      variants={variants}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="relative p-4 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all text-left"
    >
      <div className={`inline-flex p-2 rounded-lg ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <p className="text-2xl font-bold mt-2">{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
      {alert && (
        <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
      )}
    </motion.button>
  );
}

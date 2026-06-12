import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  DoorOpen,
  ShoppingCart,
} from 'lucide-react';
import { useApp } from '@/hooks/useAppContext';
import type { Page } from '@/types';

export default function MobileNav() {
  const { state, navigate, t } = useApp();

  const navItems: { page: Page; icon: typeof LayoutDashboard; label: string; isCenter?: boolean }[] = [
    { page: 'dashboard', icon: LayoutDashboard, label: t('dashboard') },
    { page: 'products', icon: Package, label: t('products') },
    { page: 'add-product', icon: PlusCircle, label: t('addProduct'), isCenter: true },
    { page: 'rooms', icon: DoorOpen, label: t('rooms') },
    { page: 'shopping-list', icon: ShoppingCart, label: t('shoppingList') },
  ];

  const pendingCount = state.shoppingList.filter(i => !i.completed).length;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-t border-border md:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = state.currentPage === item.page;
          const Icon = item.icon;

          if (item.isCenter) {
            return (
              <motion.button
                key={item.page}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate(item.page)}
                className="relative -mt-8 flex items-center justify-center w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30"
              >
                <Icon className="w-7 h-7" />
              </motion.button>
            );
          }

          return (
            <motion.button
              key={item.page}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(item.page)}
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg relative ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.page === 'shopping-list' && pendingCount > 0 && (
                  <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold bg-destructive text-destructive-foreground rounded-full px-1">
                    {pendingCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium leading-none">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -bottom-0.5 w-8 h-0.5 bg-primary rounded-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}

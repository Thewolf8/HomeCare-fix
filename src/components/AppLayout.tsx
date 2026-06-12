import { AnimatePresence, motion } from 'framer-motion';
import { useApp } from '@/hooks/useAppContext';
import Dashboard from '@/pages/Dashboard';
import Products from '@/pages/Products';
import AddProduct from '@/pages/AddProduct';
import EditProduct from '@/pages/EditProduct';
import ProductDetail from '@/pages/ProductDetail';
import Rooms from '@/pages/Rooms';
import RoomDetail from '@/pages/RoomDetail';
import ShoppingList from '@/pages/ShoppingList';
import Settings from '@/pages/Settings';
import ExportPage from '@/pages/ExportPage';
import MobileNav from '@/components/MobileNav';
import ToastContainer from '@/components/ToastContainer';
import { Skeleton } from '@/components/ui/skeleton';

export default function AppLayout() {
  const { state } = useApp();

  if (!state.isLoaded) {
    return (
      <div className="min-h-screen bg-background p-4 space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  const renderPage = () => {
    switch (state.currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'products': return <Products />;
      case 'add-product': return <AddProduct />;
      case 'edit-product': return <EditProduct />;
      case 'product-detail': return <ProductDetail />;
      case 'rooms': return <Rooms />;
      case 'room-detail': return <RoomDetail />;
      case 'shopping-list': return <ShoppingList />;
      case 'settings': return <Settings />;
      case 'export': return <ExportPage />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 md:pb-0">
      {/* Main content */}
      <main className="max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={state.currentPage + (state.selectedProductId || '') + (state.selectedRoom || '')}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Navigation */}
      <MobileNav />

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
}

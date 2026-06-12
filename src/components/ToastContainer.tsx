import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import { useApp } from '@/hooks/useAppContext';

export default function ToastContainer() {
  const { state, dispatch } = useApp();

  const iconMap = {
    success: CheckCircle,
    warning: AlertTriangle,
    error: XCircle,
    info: Info,
  };

  const colorMap = {
    success: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    error: 'bg-red-500/10 text-red-500 border-red-500/20',
    info: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  };

  return (
    <div className="fixed top-4 right-4 left-4 md:left-auto md:w-80 z-[60] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {state.toasts.map((toast) => {
          const Icon = iconMap[toast.type];
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.95 }}
              className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-lg ${colorMap[toast.type]}`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <p className="text-sm font-medium flex-1">{toast.message}</p>
              <button
                onClick={() => dispatch({ type: 'REMOVE_TOAST', id: toast.id })}
                className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

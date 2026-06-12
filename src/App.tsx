import { AppProvider } from '@/hooks/useAppContext';
import AppLayout from '@/components/AppLayout';

export default function App() {
  return (
    <AppProvider>
      <AppLayout />
    </AppProvider>
  );
}

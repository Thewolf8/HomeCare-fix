import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Plus, UtensilsCrossed, Bath, Bed, Sofa,
  WashingMachine, Warehouse, MoreHorizontal, DoorOpen,
  AlertTriangle, Pencil, Trash2, X
} from 'lucide-react';
import { useApp, getStockStatus, roomToKey } from '@/hooks/useAppContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { Room } from '@/types';

const roomIcons: Record<string, typeof UtensilsCrossed> = {
  kitchen: UtensilsCrossed,
  bathroom: Bath,
  bedroom: Bed,
  living: Sofa,
  laundry: WashingMachine,
  laundry_room: WashingMachine,
  storage: Warehouse,
  other: MoreHorizontal,
  other_room: MoreHorizontal,
};

export default function Rooms() {
  const { state, navigate, t, dispatch, showToast, getAllRooms } = useApp();
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [editingRoom, setEditingRoom] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const allRooms = getAllRooms();

  const handleAddRoom = () => {
    if (!newRoomName.trim()) return;
    dispatch({ type: 'ADD_CUSTOM_ROOM', room: newRoomName.trim() });
    showToast(t('success'), 'success');
    setNewRoomName('');
    setShowAddRoom(false);
  };

  const handleRenameRoom = (oldRoom: Room) => {
    if (!editName.trim() || editName.trim() === oldRoom) return;
    dispatch({ type: 'RENAME_ROOM', oldRoom, newRoom: editName.trim() });
    showToast(t('success'), 'success');
    setEditingRoom(null);
    setEditName('');
  };

  const handleDeleteRoom = (room: Room) => {
    if (window.confirm(t('deleteRoomConfirm'))) {
      dispatch({ type: 'DELETE_ROOM', room });
      showToast(t('deleteRoom'), 'success');
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.07 } },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('dashboard')} className="p-2 -ml-2 rounded-lg hover:bg-accent transition-colors md:hidden">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">{t('rooms')}</h1>
        </div>
        <Button size="sm" onClick={() => setShowAddRoom(true)} className="rounded-full bg-gradient-to-r from-teal-500 to-cyan-500">
          <Plus className="w-4 h-4 mr-1" />
          {t('addCustomRoom')}
        </Button>
      </div>

      {/* Add Room Form */}
      <AnimatePresence>
        {showAddRoom && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 rounded-xl bg-card/50 border border-border/50 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">{t('addCustomRoom')}</label>
                <button onClick={() => setShowAddRoom(false)} className="p-1 rounded-lg hover:bg-accent">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex gap-2">
                <Input
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  placeholder={t('roomName')}
                  className="h-11 rounded-xl"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddRoom()}
                />
                <Button onClick={handleAddRoom} className="h-11 rounded-xl px-6">
                  {t('addProduct')}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Room Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {allRooms.map((room) => {
          const roomProducts = state.products.filter(p => p.rooms.includes(room));
          const count = roomProducts.length;
          const issues = roomProducts.filter(p => getStockStatus(p) !== 'in-stock').length;
          const Icon = roomIcons[room] || DoorOpen;

          return (
            <motion.div
              key={room}
              variants={item}
              layout
              className="group relative p-5 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all"
            >
              <div onClick={() => navigate('room-detail', undefined, room)} className="cursor-pointer space-y-3">
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-xl ${
                    issues > 0 ? 'bg-amber-500/10 text-amber-500' : 'bg-teal-500/10 text-teal-500'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  {issues > 0 && (
                    <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-medium">
                      <AlertTriangle className="w-3 h-3" />
                      {issues}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{t(roomToKey(room)) || room}</h3>
                  <p className="text-sm text-muted-foreground">{count} {t('products')}</p>
                </div>
              </div>

              {/* Actions for custom rooms */}
              {state.customRooms.includes(room) && (
                <div className="flex gap-2 mt-4 pt-3 border-t border-border/50">
                  <button
                    onClick={() => { setEditingRoom(room); setEditName(room); }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-muted hover:bg-accent transition-colors"
                  >
                    <Pencil className="w-3 h-3" /> {t('renameRoom')}
                  </button>
                  <button
                    onClick={() => handleDeleteRoom(room)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" /> {t('delete')}
                  </button>
                </div>
              )}

              {/* Rename Form */}
              <AnimatePresence>
                {editingRoom === room && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-3 overflow-hidden"
                  >
                    <div className="flex gap-2">
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="h-9 rounded-lg text-sm"
                        onKeyDown={(e) => e.key === 'Enter' && handleRenameRoom(room)}
                      />
                      <Button size="sm" onClick={() => handleRenameRoom(room)} className="h-9 rounded-lg">
                        {t('save')}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

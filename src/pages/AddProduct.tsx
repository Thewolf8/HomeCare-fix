import { useState, useCallback, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Camera, X, Package, Check,
  ChevronDown, Plus, Minus
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useApp, roomToKey } from '@/hooks/useAppContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { Product, Category, Room, UnitType } from '@/types';

const categories: Category[] = ['cleaning', 'toiletries', 'laundry', 'kitchen', 'medical', 'baby', 'pet', 'other'];
const units: UnitType[] = ['bottles', 'boxes', 'bags', 'rolls', 'pieces', 'liters', 'other'];

export default function AddProduct() {
  const { state, dispatch, navigate, t, showToast, getAllRooms } = useApp();

  const [name, setName] = useState('');
  const [photo, setPhoto] = useState('');
  const [category, setCategory] = useState<Category>('cleaning');
  const [selectedRooms, setSelectedRooms] = useState<Room[]>(['kitchen']);
  const [brand, setBrand] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState<UnitType>('bottles');
  const [minThreshold, setMinThreshold] = useState(state.settings.defaultMinThreshold);
  const [expirationDate, setExpirationDate] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [pricePerUnit, setPricePerUnit] = useState('');
  const [notes, setNotes] = useState('');
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showUnitPicker, setShowUnitPicker] = useState(false);
  const [autoSaveIndicator, setAutoSaveIndicator] = useState(false);

  const allRooms = getAllRooms();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const autoSaveTimeout = useRef<number | null>(null);

  // Auto-save draft
  const saveDraft = useCallback(() => {
    const draft = { name, photo, category, selectedRooms, brand, quantity, unit, minThreshold, expirationDate, purchaseDate, pricePerUnit, notes };
    try {
      localStorage.setItem('hc_draft_add', JSON.stringify(draft));
      setAutoSaveIndicator(true);
      setTimeout(() => setAutoSaveIndicator(false), 1500);
    } catch { /* ignore */ }
  }, [name, photo, category, selectedRooms, brand, quantity, unit, minThreshold, expirationDate, purchaseDate, pricePerUnit, notes]);

  useEffect(() => {
    if (autoSaveTimeout.current) clearTimeout(autoSaveTimeout.current);
    autoSaveTimeout.current = window.setTimeout(saveDraft, 2000);
    return () => { if (autoSaveTimeout.current) clearTimeout(autoSaveTimeout.current); };
  }, [name, photo, category, selectedRooms, brand, quantity, unit, minThreshold, expirationDate, purchaseDate, pricePerUnit, notes, saveDraft]);

  // Load draft on mount
  useEffect(() => {
    try {
      const draft = localStorage.getItem('hc_draft_add');
      if (draft) {
        const d = JSON.parse(draft);
        if (d.name) setName(d.name);
        if (d.photo) setPhoto(d.photo);
        if (d.category) setCategory(d.category);
        if (d.selectedRooms) setSelectedRooms(d.selectedRooms);
        if (d.brand) setBrand(d.brand);
        if (d.quantity) setQuantity(d.quantity);
        if (d.unit) setUnit(d.unit);
        if (d.minThreshold) setMinThreshold(d.minThreshold);
        if (d.expirationDate) setExpirationDate(d.expirationDate);
        if (d.purchaseDate) setPurchaseDate(d.purchaseDate);
        if (d.pricePerUnit) setPricePerUnit(d.pricePerUnit);
        if (d.notes) setNotes(d.notes);
      }
    } catch { /* ignore */ }
  }, []);

  const handlePhotoCapture = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const toggleRoom = (room: Room) => {
    setSelectedRooms(prev =>
      prev.includes(room) ? prev.filter(r => r !== room) : [...prev, room]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast(t('error') + ': ' + t('productName'), 'error');
      return;
    }
    if (selectedRooms.length === 0) {
      showToast(t('error') + ': ' + t('assignRooms'), 'error');
      return;
    }

    const product: Product = {
      id: uuidv4(),
      name: name.trim(),
      photo: photo || undefined,
      category,
      rooms: selectedRooms,
      brand: brand.trim() || undefined,
      quantity,
      unit,
      minThreshold,
      expirationDate: expirationDate || undefined,
      purchaseDate: purchaseDate || undefined,
      pricePerUnit: pricePerUnit ? parseFloat(pricePerUnit) : undefined,
      notes: notes.trim() || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dispatch({ type: 'ADD_PRODUCT', product });
    showToast(t('productAdded'), 'success');

    // Clear draft
    localStorage.removeItem('hc_draft_add');

    navigate('products');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <button onClick={() => navigate('products')} className="p-2 -ml-2 rounded-lg hover:bg-accent transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">{t('addProduct')}</h1>
          <div className="flex items-center gap-2">
            {autoSaveIndicator && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-muted-foreground flex items-center gap-1">
                <Check className="w-3 h-3" /> {t('saved')}
              </motion.span>
            )}
            <div className="w-14" />
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Photo */}
        <div className="flex justify-center">
          <div
            onClick={handlePhotoCapture}
            className="relative w-32 h-32 rounded-2xl bg-gradient-to-br from-muted to-muted/50 border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors overflow-hidden"
          >
            {photo ? (
              <>
                <img src={photo} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setPhoto(''); }}
                  className="absolute top-1 right-1 p-1 rounded-full bg-background/80"
                >
                  <X className="w-3 h-3" />
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center gap-1">
                <Camera className="w-6 h-6 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">{t('takePhoto')}</span>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium">{t('productName')} *</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Dettol All-Purpose Cleaner"
            className="h-12 rounded-xl"
            required
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label className="text-sm font-medium">{t('category')}</label>
          <button
            type="button"
            onClick={() => setShowCategoryPicker(!showCategoryPicker)}
            className="w-full h-12 px-4 rounded-xl border border-input bg-background flex items-center justify-between hover:border-primary/50 transition-colors"
          >
            <span>{t(category)}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showCategoryPicker ? 'rotate-180' : ''}`} />
          </button>
          {showCategoryPicker && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="grid grid-cols-2 gap-2 overflow-hidden"
            >
              {categories.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => { setCategory(cat); setShowCategoryPicker(false); }}
                  className={`p-3 rounded-xl text-sm font-medium transition-all ${
                    category === cat ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-accent'
                  }`}
                >
                  {t(cat)}
                </button>
              ))}
            </motion.div>
          )}
        </div>

        {/* Rooms */}
        <div className="space-y-2">
          <label className="text-sm font-medium">{t('assignRooms')} *</label>
          <div className="flex flex-wrap gap-2">
            {allRooms.map(room => (
              <button
                key={room}
                type="button"
                onClick={() => toggleRoom(room)}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedRooms.includes(room)
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-accent'
                }`}
              >
                {t(roomToKey(room)) || room}
              </button>
            ))}
          </div>
        </div>

        {/* Brand */}
        <div className="space-y-2">
          <label className="text-sm font-medium">{t('brand')} <span className="text-muted-foreground">({t('optional')})</span></label>
          <Input
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="e.g. Dettol"
            className="h-12 rounded-xl"
          />
        </div>

        {/* Quantity + Unit */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('quantity')}</label>
            <div className="flex items-center h-12 rounded-xl border border-input bg-background">
              <button type="button" onClick={() => setQuantity(Math.max(0, quantity - 1))} className="p-3 hover:bg-accent rounded-l-xl transition-colors">
                <Minus className="w-4 h-4" />
              </button>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(0, parseInt(e.target.value) || 0))}
                className="h-full border-0 text-center bg-transparent"
              />
              <button type="button" onClick={() => setQuantity(quantity + 1)} className="p-3 hover:bg-accent rounded-r-xl transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('unit')}</label>
            <button
              type="button"
              onClick={() => setShowUnitPicker(!showUnitPicker)}
              className="w-full h-12 px-4 rounded-xl border border-input bg-background flex items-center justify-between hover:border-primary/50 transition-colors"
            >
              <span>{t(unit + '_unit' as any) || unit}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showUnitPicker ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {showUnitPicker && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="flex flex-wrap gap-2 overflow-hidden">
            {units.map(u => (
              <button
                key={u}
                type="button"
                onClick={() => { setUnit(u); setShowUnitPicker(false); }}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  unit === u ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-accent'
                }`}
              >
                {t(u + '_unit' as any) || u}
              </button>
            ))}
          </motion.div>
        )}

        {/* Min Threshold */}
        <div className="space-y-2">
          <label className="text-sm font-medium">{t('minThreshold')}</label>
          <Input
            type="number"
            value={minThreshold}
            onChange={(e) => setMinThreshold(Math.max(0, parseInt(e.target.value) || 0))}
            className="h-12 rounded-xl"
            min={0}
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('expirationDate')} <span className="text-muted-foreground">({t('optional')})</span></label>
            <Input
              type="date"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              className="h-12 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('purchaseDate')} <span className="text-muted-foreground">({t('optional')})</span></label>
            <Input
              type="date"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
              className="h-12 rounded-xl"
            />
          </div>
        </div>

        {/* Price */}
        <div className="space-y-2">
          <label className="text-sm font-medium">{t('pricePerUnit')} <span className="text-muted-foreground">({t('optional')})</span></label>
          <Input
            type="number"
            step="0.01"
            value={pricePerUnit}
            onChange={(e) => setPricePerUnit(e.target.value)}
            placeholder="0.00"
            className="h-12 rounded-xl"
          />
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <label className="text-sm font-medium">{t('notes')} <span className="text-muted-foreground">({t('optional')})</span></label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Additional notes..."
            className="min-h-[100px] rounded-xl resize-none"
          />
        </div>

        {/* Submit */}
        <div className="pt-4 pb-8">
          <Button
            type="submit"
            className="w-full h-14 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white shadow-lg shadow-teal-500/20 text-base font-semibold"
          >
            <Package className="w-5 h-5 mr-2" />
            {t('addProduct')}
          </Button>
        </div>
      </form>
    </div>
  );
}

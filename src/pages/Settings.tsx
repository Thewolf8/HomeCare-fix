import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Moon, Sun, Monitor, Globe, Bell,
  Download, Upload, Trash2, AlertTriangle, ChevronRight,
  Package, FileText, Shield, Camera
} from 'lucide-react';
import { useApp } from '@/hooks/useAppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import type { Language, ThemeMode, UnitType, ExportFormat, NotificationFrequency } from '@/types';

export default function Settings() {
  const { state, dispatch, navigate, t, showToast } = useApp();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLanguageChange = (lang: Language) => {
    dispatch({ type: 'UPDATE_SETTINGS', settings: { language: lang } });
    showToast(t('success'), 'success');
  };

  const handleThemeChange = (theme: ThemeMode) => {
    dispatch({ type: 'UPDATE_SETTINGS', settings: { theme } });
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else if (theme === 'light') root.classList.remove('dark');
    else {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) root.classList.add('dark');
      else root.classList.remove('dark');
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (Array.isArray(data)) {
          dispatch({ type: 'IMPORT_DATA', products: data, count: data.length });
          showToast(data.length + ' ' + t('importSuccess'), 'success');
        } else if (data.products && Array.isArray(data.products)) {
          dispatch({ type: 'IMPORT_DATA', products: data.products, count: data.products.length });
          showToast(data.products.length + ' ' + t('importSuccess'), 'success');
        } else {
          showToast(t('importFailed'), 'error');
        }
      } catch {
        showToast(t('importFailed'), 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleReset = () => {
    dispatch({ type: 'RESET_DATA' });
    setShowResetConfirm(false);
    showToast(t('dataReset'), 'success');
    navigate('dashboard');
  };

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: 'EN' },
    { code: 'ar', label: 'العربية', flag: 'AR' },
    { code: 'fr', label: 'Français', flag: 'FR' },
    { code: 'system', label: t('systemDefault'), flag: 'Auto' },
  ];

  const themes: { value: ThemeMode; icon: typeof Moon; label: string }[] = [
    { value: 'dark', icon: Moon, label: t('darkMode') },
    { value: 'light', icon: Sun, label: t('lightMode') },
    { value: 'system', icon: Monitor, label: t('systemDefault') },
  ];

  const units: UnitType[] = ['bottles', 'boxes', 'bags', 'rolls', 'pieces', 'liters', 'other'];
  const exportFormats: ExportFormat[] = ['pdf', 'txt', 'json'];
  const freqs: { value: NotificationFrequency; label: string }[] = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'never', label: 'Never' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <button onClick={() => navigate('dashboard')} className="p-2 -ml-2 rounded-lg hover:bg-accent transition-colors md:hidden">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">{t('settings')}</h1>
          <div className="w-9" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-8">
        {/* Appearance */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Monitor className="w-5 h-5 text-teal-500" />
            <h2 className="text-lg font-semibold">{t('appearance')}</h2>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {themes.map(({ value, icon: Icon, label }) => (
              <button
                key={value}
                onClick={() => handleThemeChange(value)}
                className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${
                  state.settings.theme === value
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border/50 bg-card/40 hover:border-primary/30'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Language */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-teal-500" />
            <h2 className="text-lg font-semibold">{t('language')}</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {languages.map(({ code, label, flag }) => (
              <button
                key={code}
                onClick={() => handleLanguageChange(code)}
                className={`p-4 rounded-xl border transition-all flex items-center gap-3 ${
                  state.settings.language === code
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border/50 bg-card/40 hover:border-primary/30'
                }`}
              >
                <span className="text-sm font-medium">{flag}</span>
                <span className="text-sm">{label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Notifications */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-teal-500" />
            <h2 className="text-lg font-semibold">{t('notifications')}</h2>
          </div>
          <div className="space-y-4 p-4 rounded-xl bg-card/40 border border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">{t('enableNotifications')}</Label>
              </div>
              <Switch
                checked={state.settings.notificationsEnabled}
                onCheckedChange={(checked) => dispatch({ type: 'UPDATE_SETTINGS', settings: { notificationsEnabled: checked } })}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">{t('dailyAlertTime')}</Label>
              <Input
                type="time"
                value={state.settings.dailyAlertTime}
                onChange={(e) => dispatch({ type: 'UPDATE_SETTINGS', settings: { dailyAlertTime: e.target.value } })}
                className="h-11 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">{t('lowStockThreshold')}</Label>
              <Input
                type="number"
                value={state.settings.defaultMinThreshold}
                onChange={(e) => dispatch({ type: 'UPDATE_SETTINGS', settings: { defaultMinThreshold: Math.max(0, parseInt(e.target.value) || 0) } })}
                className="h-11 rounded-xl"
                min={0}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">{t('reminderFrequency')}</Label>
              <div className="grid grid-cols-3 gap-2">
                {freqs.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => dispatch({ type: 'UPDATE_SETTINGS', settings: { shoppingListReminderFreq: value } })}
                    className={`p-2 rounded-lg text-xs font-medium transition-all ${
                      state.settings.shoppingListReminderFreq === value
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-accent'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Default Preferences */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-teal-500" />
            <h2 className="text-lg font-semibold">{t('defaultUnit')}</h2>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {units.map((u) => (
              <button
                key={u}
                onClick={() => dispatch({ type: 'UPDATE_SETTINGS', settings: { defaultUnit: u } })}
                className={`p-3 rounded-xl text-xs font-medium transition-all ${
                  state.settings.defaultUnit === u
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-accent'
                }`}
              >
                {t(u + '_unit' as any) || u}
              </button>
            ))}
          </div>

          <div className="space-y-2 pt-2">
            <Label className="text-sm font-medium">{t('defaultExportFormat')}</Label>
            <div className="grid grid-cols-3 gap-2">
              {exportFormats.map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => dispatch({ type: 'UPDATE_SETTINGS', settings: { defaultExportFormat: fmt } })}
                  className={`p-3 rounded-xl text-xs font-medium uppercase transition-all ${
                    state.settings.defaultExportFormat === fmt
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-accent'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Export / Import */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-500" />
            <h2 className="text-lg font-semibold">{t('dataManagement')}</h2>
          </div>
          <div className="space-y-3">
            <Button
              onClick={() => navigate('export')}
              variant="outline"
              className="w-full h-12 rounded-xl justify-between"
            >
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                {t('exportData')}
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Button>

            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="w-full h-12 rounded-xl justify-between"
            >
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                {t('importBackup')}
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            <p className="text-xs text-muted-foreground">{t('importMergeInfo')}</p>
          </div>
        </section>

        {/* Privacy */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-teal-500" />
            <h2 className="text-lg font-semibold">{t('privacyNotice')}</h2>
          </div>
          <div className="p-4 rounded-xl bg-card/40 border border-border/50 space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">{t('privacyText')}</p>
            <div className="grid grid-cols-2 gap-2">
              <PrivacyBadge icon={Shield} text={t('noCloud')} />
              <PrivacyBadge icon={Package} text={t('noAccount')} />
              <PrivacyBadge icon={Camera} text={t('dataStaysLocal')} />
              <PrivacyBadge icon={FileText} text={t('noBuiltInAI')} />
            </div>
          </div>
        </section>

        {/* Reset Data */}
        <section className="space-y-4 pb-8">
          <div className="flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-semibold text-red-500">{t('resetAllData')}</h2>
          </div>
          <Button
            onClick={() => setShowResetConfirm(true)}
            variant="outline"
            className="w-full h-12 rounded-xl border-red-500/30 text-red-500 hover:bg-red-500/10"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {t('resetAllData')}
          </Button>
        </section>
      </div>

      {/* Reset Confirmation */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center"
            onClick={() => setShowResetConfirm(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-background rounded-t-2xl p-6 space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-red-500/10">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{t('areYouSure')}</h3>
                  <p className="text-sm text-muted-foreground">{t('resetConfirm')}</p>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={() => setShowResetConfirm(false)}
                  variant="outline"
                  className="flex-1 h-12 rounded-xl"
                >
                  {t('cancel')}
                </Button>
                <Button
                  onClick={handleReset}
                  className="flex-1 h-12 rounded-xl bg-red-500 hover:bg-red-600 text-white"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {t('confirm')}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PrivacyBadge({ icon: Icon, text }: { icon: typeof Shield; text: string }) {
  return (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
      <Icon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
      <span className="text-[11px] text-muted-foreground font-medium">{text}</span>
    </div>
  );
}

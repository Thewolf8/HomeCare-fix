import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft, FileText, Download, Share2, FileSpreadsheet,
  FileCode
} from 'lucide-react';
import jsPDF from 'jspdf';
import { useApp, getStockStatus, daysUntilExpiry, stockStatusToKey } from '@/hooks/useAppContext';
import { Button } from '@/components/ui/button';

type ExportType = 'pdf' | 'txt' | 'json';

export default function ExportPage() {
  const { state, navigate, t, showToast } = useApp();
  const [exporting, setExporting] = useState<ExportType | null>(null);
  const [includeAI, setIncludeAI] = useState(true);

  const aiPromptText = t('aiPromptText');

  const lowStockProducts = state.products.filter(p => getStockStatus(p) === 'low-stock');
  const outOfStockProducts = state.products.filter(p => getStockStatus(p) === 'out-of-stock');
  const expiringProducts = state.products.filter(p => {
    const days = daysUntilExpiry(p.expirationDate);
    return days !== null && days > 0 && days <= 30;
  });
  const expiredProducts = state.products.filter(p => {
    const days = daysUntilExpiry(p.expirationDate);
    return days !== null && days <= 0;
  });

  const generatePDF = () => {
    setExporting('pdf');
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();

      // Title
      doc.setFontSize(22);
      doc.setTextColor(0, 0, 0);
      doc.text(t('appName'), pageWidth / 2, 20, { align: 'center' });

      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(new Date().toLocaleDateString(), pageWidth / 2, 28, { align: 'center' });

      // Summary
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text('Summary', 14, 42);

      const summaryData = [
        [t('totalProducts'), state.products.length.toString()],
        [t('lowStockItems'), lowStockProducts.length.toString()],
        [t('outOfStockItems'), outOfStockProducts.length.toString()],
        [t('expiringSoon'), expiringProducts.length.toString()],
        [t('expired'), expiredProducts.length.toString()],
        [t('shoppingListItems'), state.shoppingList.filter(i => !i.completed).length.toString()],
      ];

      (doc as any).autoTable({
        startY: 46,
        head: [['Metric', 'Value']],
        body: summaryData,
        theme: 'striped',
        headStyles: { fillColor: [20, 184, 166] },
        styles: { fontSize: 10 },
        margin: { left: 14, right: 14 },
      });

      let yPos = (doc as any).lastAutoTable.finalY + 10;

      // Products Table
      if (state.products.length > 0) {
        doc.setFontSize(14);
        doc.text('Inventory', 14, yPos);
        yPos += 4;

        const productData = state.products.map(p => [
          p.name,
          p.brand || '-',
          t(p.category),
          p.rooms.map(r => t(r as any) || r).join(', '),
          `${p.quantity} ${t(p.unit + '_unit' as any) || p.unit}`,
          t(stockStatusToKey(getStockStatus(p))),
          p.expirationDate ? new Date(p.expirationDate).toLocaleDateString() : '-',
          p.pricePerUnit ? `$${p.pricePerUnit.toFixed(2)}` : '-',
        ]);

        (doc as any).autoTable({
          startY: yPos,
          head: [['Name', 'Brand', 'Category', 'Rooms', 'Quantity', 'Status', 'Expiry', 'Price']],
          body: productData,
          theme: 'striped',
          headStyles: { fillColor: [20, 184, 166] },
          styles: { fontSize: 8 },
          margin: { left: 14, right: 14 },
        });

        yPos = (doc as any).lastAutoTable.finalY + 10;
      }

      // Low Stock Section
      if (lowStockProducts.length > 0 || outOfStockProducts.length > 0) {
        doc.setFontSize(14);
        doc.setTextColor(239, 68, 68);
        doc.text('Stock Alerts', 14, yPos);
        yPos += 4;

        const alertData = [
          ...outOfStockProducts.map(p => [p.name, t('outOfStock'), '0', t(p.unit + '_unit' as any) || p.unit]),
          ...lowStockProducts.map(p => [p.name, t('lowStock'), p.quantity.toString(), t(p.unit + '_unit' as any) || p.unit]),
        ];

        (doc as any).autoTable({
          startY: yPos,
          head: [['Product', 'Status', 'Qty', 'Unit']],
          body: alertData,
          theme: 'striped',
          headStyles: { fillColor: [239, 68, 68] },
          styles: { fontSize: 9 },
          margin: { left: 14, right: 14 },
        });

        yPos = (doc as any).lastAutoTable.finalY + 10;
        doc.setTextColor(0, 0, 0);
      }

      // Expiring Soon
      if (expiringProducts.length > 0 || expiredProducts.length > 0) {
        doc.setFontSize(14);
        doc.setTextColor(245, 158, 11);
        doc.text('Expiry Alerts', 14, yPos);
        yPos += 4;

        const expiryData = [
          ...expiredProducts.map(p => [p.name, t('expired'), '0 days']),
          ...expiringProducts.map(p => {
            const days = daysUntilExpiry(p.expirationDate);
            return [p.name, t('expiringSoon'), `${days} days`];
          }),
        ];

        (doc as any).autoTable({
          startY: yPos,
          head: [['Product', 'Status', 'Time Remaining']],
          body: expiryData,
          theme: 'striped',
          headStyles: { fillColor: [245, 158, 11] },
          styles: { fontSize: 9 },
          margin: { left: 14, right: 14 },
        });

        yPos = (doc as any).lastAutoTable.finalY + 10;
        doc.setTextColor(0, 0, 0);
      }

      // Shopping List
      const pendingShopping = state.shoppingList.filter(i => !i.completed);
      if (pendingShopping.length > 0) {
        doc.setFontSize(14);
        doc.text('Shopping List', 14, yPos);
        yPos += 4;

        const shoppingData = pendingShopping.map(i => [
          i.name,
          i.suggestedQuantity.toString(),
          i.pricePerUnit ? `$${(i.pricePerUnit * i.suggestedQuantity).toFixed(2)}` : '-',
        ]);

        (doc as any).autoTable({
          startY: yPos,
          head: [['Item', 'Qty', 'Est. Cost']],
          body: shoppingData,
          theme: 'striped',
          headStyles: { fillColor: [20, 184, 166] },
          styles: { fontSize: 9 },
          margin: { left: 14, right: 14 },
        });

        yPos = (doc as any).lastAutoTable.finalY + 10;
      }

      // AI Prompt
      if (includeAI) {
        if (yPos > 200) {
          doc.addPage();
          yPos = 20;
        }
        doc.setFontSize(14);
        doc.setTextColor(20, 184, 166);
        doc.text('AI Analysis Prompt', 14, yPos);
        yPos += 6;
        doc.setFontSize(9);
        doc.setTextColor(80, 80, 80);
        const lines = doc.splitTextToSize(aiPromptText, pageWidth - 28);
        doc.text(lines, 14, yPos);
      }

      // Save
      doc.save(`homecare-cabinet-${new Date().toISOString().split('T')[0]}.pdf`);
      showToast(t('exportSuccess'), 'success');
    } catch (err) {
      showToast(t('exportFailed'), 'error');
    } finally {
      setExporting(null);
    }
  };

  const generateTXT = () => {
    setExporting('txt');
    try {
      const lines = [
        `═══════════════════════════════════════════════════`,
        `  ${t('appName')} - ${t('exportData')}`,
        `  ${new Date().toLocaleString()}`,
        `═══════════════════════════════════════════════════`,
        ``,
        `📊 SUMMARY`,
        `  ${t('totalProducts')}: ${state.products.length}`,
        `  ${t('lowStockItems')}: ${lowStockProducts.length}`,
        `  ${t('outOfStockItems')}: ${outOfStockProducts.length}`,
        `  ${t('expiringSoon')}: ${expiringProducts.length}`,
        `  ${t('expired')}: ${expiredProducts.length}`,
        ``,
        `═══════════════════════════════════════════════════`,
        `📦 FULL INVENTORY`,
        `═══════════════════════════════════════════════════`,
        ``,
        ...state.products.map(p => {
          const status = getStockStatus(p);
          const expiry = daysUntilExpiry(p.expirationDate);
          return [
            `  Name: ${p.name}`,
            p.brand ? `  Brand: ${p.brand}` : '',
            `  Category: ${t(p.category)}`,
            `  Rooms: ${p.rooms.map(r => t(r as any) || r).join(', ')}`,
            `  Quantity: ${p.quantity} ${t(p.unit + '_unit' as any) || p.unit}`,
            `  Status: ${t(stockStatusToKey(status))}`,
            p.expirationDate ? `  Expires: ${new Date(p.expirationDate).toLocaleDateString()} (${expiry}d)` : '',
            p.pricePerUnit ? `  Price: $${p.pricePerUnit.toFixed(2)}` : '',
            `  ---`,
          ].filter(Boolean).join('\n');
        }),
        ``,
      ];

      if (lowStockProducts.length > 0 || outOfStockProducts.length > 0) {
        lines.push(
          `═══════════════════════════════════════════════════`,
          `⚠️  STOCK ALERTS`,
          `═══════════════════════════════════════════════════`,
          ``,
          ...outOfStockProducts.map(p => `  🔴 ${p.name} - ${t('outOfStock')}`),
          ...lowStockProducts.map(p => `  🟡 ${p.name} - ${t('lowStock')} (${p.quantity} left)`),
          ``,
        );
      }

      if (expiringProducts.length > 0 || expiredProducts.length > 0) {
        lines.push(
          `═══════════════════════════════════════════════════`,
          `⏰ EXPIRY ALERTS`,
          `═══════════════════════════════════════════════════`,
          ``,
          ...expiredProducts.map(p => `  🔴 ${p.name} - ${t('expired')}`),
          ...expiringProducts.map(p => `  🟡 ${p.name} - ${t('expiringSoon')} (${daysUntilExpiry(p.expirationDate)}d)`),
          ``,
        );
      }

      const pendingShopping = state.shoppingList.filter(i => !i.completed);
      if (pendingShopping.length > 0) {
        lines.push(
          `═══════════════════════════════════════════════════`,
          `🛒 SHOPPING LIST`,
          `═══════════════════════════════════════════════════`,
          ``,
          ...pendingShopping.map(i => `  ${i.name} x${i.suggestedQuantity}${i.pricePerUnit ? ` ($${(i.pricePerUnit * i.suggestedQuantity).toFixed(2)})` : ''}`),
          ``,
        );
      }

      if (includeAI) {
        lines.push(
          `═══════════════════════════════════════════════════`,
          `🤖 ${t('aiAnalysisPrompt')}`,
          `═══════════════════════════════════════════════════`,
          ``,
          aiPromptText,
        );
      }

      const text = lines.join('\n');
      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `homecare-cabinet-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast(t('exportSuccess'), 'success');
    } catch {
      showToast(t('exportFailed'), 'error');
    } finally {
      setExporting(null);
    }
  };

  const generateJSON = () => {
    setExporting('json');
    try {
      const data = {
        exportDate: new Date().toISOString(),
        appName: 'HomeCare Cabinet',
        version: '1.0.0',
        summary: {
          totalProducts: state.products.length,
          lowStock: lowStockProducts.length,
          outOfStock: outOfStockProducts.length,
          expiringSoon: expiringProducts.length,
          expired: expiredProducts.length,
          shoppingItems: state.shoppingList.filter(i => !i.completed).length,
        },
        products: state.products,
        shoppingList: state.shoppingList,
        settings: state.settings,
        ...(includeAI ? { aiAnalysisPrompt: aiPromptText } : {}),
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `homecare-cabinet-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast(t('exportSuccess'), 'success');
    } catch {
      showToast(t('exportFailed'), 'error');
    } finally {
      setExporting(null);
    }
  };

  const exportCards: { type: ExportType; icon: typeof FileText; label: string; desc: string; action: () => void; color: string }[] = [
    {
      type: 'pdf',
      icon: FileSpreadsheet,
      label: t('exportPDF'),
      desc: 'Formatted report with tables and summary',
      action: generatePDF,
      color: 'from-red-500/10 to-orange-500/10 border-red-500/20',
    },
    {
      type: 'txt',
      icon: FileText,
      label: t('exportTXT'),
      desc: 'Plain text AI-friendly structured summary',
      action: generateTXT,
      color: 'from-blue-500/10 to-indigo-500/10 border-blue-500/20',
    },
    {
      type: 'json',
      icon: FileCode,
      label: t('exportJSON'),
      desc: 'Full data backup including all fields',
      action: generateJSON,
      color: 'from-emerald-500/10 to-teal-500/10 border-emerald-500/20',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <button onClick={() => navigate('settings')} className="p-2 -ml-2 rounded-lg hover:bg-accent transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">{t('exportData')}</h1>
          <div className="w-9" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* AI Toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-card/40 border border-border/50">
          <div>
            <p className="font-medium text-sm">{t('aiAnalysisPrompt')}</p>
            <p className="text-xs text-muted-foreground">Include AI analysis prompt at the end</p>
          </div>
          <button
            onClick={() => setIncludeAI(!includeAI)}
            className={`relative w-12 h-7 rounded-full transition-colors ${includeAI ? 'bg-teal-500' : 'bg-muted'}`}
          >
            <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${includeAI ? 'left-6' : 'left-1'}`} />
          </button>
        </div>

        {/* Export Cards */}
        <div className="grid gap-4">
          {exportCards.map(({ type, icon: Icon, label, desc, action, color }) => (
            <motion.button
              key={type}
              whileTap={{ scale: 0.98 }}
              onClick={action}
              disabled={exporting !== null}
              className={`p-5 rounded-2xl bg-gradient-to-br ${color} border backdrop-blur-sm text-left transition-all hover:shadow-lg disabled:opacity-50`}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-background/80">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{label}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{desc}</p>
                </div>
                <div className="p-2 rounded-lg bg-background/60">
                  {exporting === type ? (
                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Download className="w-5 h-5" />
                  )}
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Preview */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground">{t('aiAnalysisPrompt')}</h3>
          <div className="p-4 rounded-xl bg-muted/30 border border-border/30 text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
            {aiPromptText}
          </div>
        </div>

        {/* Share */}
        <div className="pb-8">
          <Button
            onClick={() => {
              const text = `${t('appName')} - ${t('exportData')}\n${t('totalProducts')}: ${state.products.length}\n${t('lowStockItems')}: ${lowStockProducts.length}`;
              if (navigator.share) navigator.share({ title: t('appName'), text });
              else navigator.clipboard.writeText(text);
            }}
            variant="outline"
            className="w-full h-12 rounded-xl"
          >
            <Share2 className="w-4 h-4 mr-2" />
            {t('shareList')}
          </Button>
        </div>
      </div>
    </div>
  );
}

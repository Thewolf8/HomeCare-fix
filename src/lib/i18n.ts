import type { Language } from '@/types';

export const translations = {
  en: {
    // Navigation
    dashboard: 'Dashboard',
    products: 'Products',
    addProduct: 'Add Product',
    editProduct: 'Edit Product',
    shoppingList: 'Shopping List',
    rooms: 'Rooms',
    settings: 'Settings',
    export: 'Export',
    back: 'Back',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    confirm: 'Confirm',
    close: 'Close',
    done: 'Done',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    clear: 'Clear',
    apply: 'Apply',
    reset: 'Reset',

    // Dashboard
    totalProducts: 'Total Products',
    lowStockItems: 'Low Stock Items',
    outOfStockItems: 'Out of Stock',
    expiringSoon: 'Expiring Soon',
    expired: 'Expired',
    roomSummary: 'Rooms',
    shoppingListItems: 'Shopping List',
    quickAdd: 'Quick Add',
    viewShoppingList: 'View Shopping List',
    criticalAlerts: 'Critical Alerts',
    recentlyAdded: 'Recently Added',
    viewAll: 'View All',

    // Product
    productName: 'Product Name',
    photo: 'Photo',
    takePhoto: 'Take Photo',
    chooseFromGallery: 'Choose from Gallery',
    removePhoto: 'Remove Photo',
    category: 'Category',
    room: 'Room',
    roomLabel: 'Room',
    assignRooms: 'Assign Rooms',
    brand: 'Brand',
    quantity: 'Quantity',
    unit: 'Unit',
    minThreshold: 'Min. Stock Threshold',
    expirationDate: 'Expiration Date',
    purchaseDate: 'Purchase Date',
    pricePerUnit: 'Price per Unit',
    notes: 'Notes',
    optional: 'Optional',
    productDetails: 'Product Details',

    // Categories
    cleaning: 'Cleaning Supplies',
    toiletries: 'Toiletries & Personal Care',
    laundry: 'Laundry',
    kitchen: 'Kitchen Supplies',
    medical: 'Medical & First Aid',
    baby: 'Baby & Child Care',
    pet: 'Pet Supplies',
    other: 'Other',

    // Rooms
    kitchenRoom: 'Kitchen',
    bathroom: 'Bathroom',
    bedroom: 'Bedroom',
    living: 'Living Room',
    laundryRoom: 'Laundry Room',
    storage: 'Storage / Garage',
    otherRoom: 'Other',
    addCustomRoom: 'Add Custom Room',
    roomName: 'Room Name',
    renameRoom: 'Rename Room',
    deleteRoom: 'Delete Room',
    deleteRoomConfirm: 'Products in this room will be unassigned but not deleted.',
    productsInRoom: 'Products in this room',

    // Units
    bottles_unit: 'Bottles',
    boxes_unit: 'Boxes',
    bags_unit: 'Bags',
    rolls_unit: 'Rolls',
    pieces_unit: 'Pieces',
    liters_unit: 'Liters',
    other_unit: 'Other',

    // Stock Status
    inStock: 'In Stock',
    lowStock: 'Low Stock',
    outOfStock: 'Out of Stock',
    stockStatus: 'Stock Status',

    // Product Actions
    addToShoppingList: 'Add to Shopping List',
    markAsPurchased: 'Mark as Purchased',
    quantityAdjust: 'Quick Adjust',
    deleteProduct: 'Delete Product',
    deleteProductConfirm: 'Are you sure you want to delete this product?',
    productAdded: 'Product added successfully',
    productUpdated: 'Product updated successfully',
    productDeleted: 'Product deleted',

    // Shopping List
    addCustomItem: 'Add Custom Item',
    itemName: 'Item Name',
    suggestedQty: 'Suggested Qty',
    estimatedCost: 'Estimated Cost',
    totalEstimated: 'Total Estimated',
    groupByRoom: 'Group by Room',
    groupByCategory: 'Group by Category',
    shareList: 'Share List',
    clearCompleted: 'Clear Completed',
    howManyBought: 'How many did you buy?',
    itemsPending: 'items pending',
    noShoppingItems: 'Your shopping list is empty',
    itemAddedToList: 'Item added to shopping list',
    itemMarkedPurchased: 'Item marked as purchased',
    completedCleared: 'Completed items cleared',
    customItemAdded: 'Custom item added',

    // Alerts
    alerts: 'Alerts',
    lowStockAlert: 'Low Stock Alert',
    expiryAlert: 'Expiry Alert',
    dailySummary: 'Daily Summary',
    notificationTitle: 'HomeCare Cabinet Alert',

    // Filters & Sort
    allCategories: 'All Categories',
    allRooms: 'All Rooms',
    allStatuses: 'All Statuses',
    filterByCategory: 'Filter by Category',
    filterByRoom: 'Filter by Room',
    filterByStatus: 'Filter by Status',
    sortByName: 'Name (A-Z)',
    sortByQuantity: 'Quantity (Low to High)',
    sortByExpiry: 'Expiration (Soonest)',
    sortByDateAdded: 'Date Added',
    sortByCategory: 'Category',

    // Smart Sections
    outOfStockLabel: 'Out of Stock',

    // Export
    exportData: 'Export Data',
    exportPDF: 'Export as PDF',
    exportTXT: 'Export as TXT',
    exportJSON: 'Export as JSON',
    exportSuccess: 'Export successful',
    exportFailed: 'Export failed',
    aiAnalysisPrompt: 'AI Analysis Prompt',

    // Import
    importBackup: 'Import Backup',
    selectJSONFile: 'Select JSON file',
    importSuccess: 'products imported successfully',
    importFailed: 'Import failed: Invalid file format',
    importMergeInfo: 'Duplicate items will be skipped',

    // Settings
    appearance: 'Appearance',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    systemDefault: 'System Default',
    language: 'Language',
    notifications: 'Notifications',
    enableNotifications: 'Enable Push Notifications',
    dailyAlertTime: 'Daily Alert Time',
    lowStockThreshold: 'Low Stock Threshold',
    reminderFrequency: 'Shopping List Reminder',
    defaultUnit: 'Default Unit',
    defaultExportFormat: 'Default Export Format',
    dataManagement: 'Data Management',
    resetAllData: 'Reset All Data',
    resetConfirm: 'This will delete all your data. This action cannot be undone.',
    dataReset: 'All data has been reset',

    // Privacy
    privacyNotice: 'Privacy Notice',
    privacyText: 'HomeCare Cabinet respects your privacy. All data is stored locally on your device. No cloud storage, no accounts, no tracking. Your data never leaves your device unless you choose to export it.',
    noCloud: 'No Cloud Storage',
    noAccount: 'No Account Required',
    dataStaysLocal: 'All Data Stays on Device',
    noBuiltInAI: 'No Built-in AI',
    cameraStorageNote: 'Photos are stored as base64 in localStorage only.',

    // Empty States
    noProductsFound: 'No products found',
    noProductsYet: 'No products yet',
    addYourFirstProduct: 'Add your first product to get started',
    noRoomsFound: 'No rooms found',
    noAlerts: 'No alerts at the moment',
    startAddingProducts: 'Start adding products to see them here',

    // Toasts
    saved: 'Saved',
    autoSaveEnabled: 'Auto-save enabled',
    error: 'Error',
    success: 'Success',
    warning: 'Warning',
    info: 'Info',

    // Confirmation
    areYouSure: 'Are you sure?',
    thisActionCannotBeUndone: 'This action cannot be undone.',

    // Misc
    appName: 'HomeCare Cabinet',
    appTagline: 'Smart Household Inventory',
    version: 'Version',
    loading: 'Loading...',
    cameraNotAvailable: 'Camera not available on this device',
    pullToRefresh: 'Pull to refresh',
    tapToEdit: 'Tap to edit',

    // AI Prompt
    aiPromptText: `Analyze this household supplies inventory and determine:
- Items that are critically low or out of stock and need urgent restocking
- Products nearing expiration that should be used or replaced soon
- Possible duplicate products serving the same purpose
- Rooms that appear understocked or missing essential supplies
- Estimated monthly restocking cost based on listed prices
- Suggestions for consolidating or replacing products with multi-purpose alternatives

This report is not professional advice.`,
  },

  ar: {
    // Navigation
    dashboard: 'لوحة التحكم',
    products: 'المنتجات',
    addProduct: 'إضافة منتج',
    editProduct: 'تعديل منتج',
    shoppingList: 'قائمة التسوق',
    rooms: 'الغرف',
    settings: 'الإعدادات',
    export: 'تصدير',
    back: 'رجوع',
    cancel: 'إلغاء',
    save: 'حفظ',
    delete: 'حذف',
    edit: 'تعديل',
    confirm: 'تأكيد',
    close: 'إغلاق',
    done: 'تم',
    search: 'بحث',
    filter: 'تصفية',
    sort: 'ترتيب',
    clear: 'مسح',
    apply: 'تطبيق',
    reset: 'إعادة تعيين',

    // Dashboard
    totalProducts: 'إجمالي المنتجات',
    lowStockItems: 'مخزون منخفض',
    outOfStockItems: 'نفد المخزون',
    expiringSoon: 'ينتهي قريباً',
    expired: 'منتهي الصلاحية',
    roomSummary: 'الغرف',
    shoppingListItems: 'قائمة التسوق',
    quickAdd: 'إضافة سريعة',
    viewShoppingList: 'عرض قائمة التسوق',
    criticalAlerts: 'تنبيهات حرجة',
    recentlyAdded: 'أضيف مؤخراً',
    viewAll: 'عرض الكل',

    // Product
    productName: 'اسم المنتج',
    photo: 'صورة',
    takePhoto: 'التقاط صورة',
    chooseFromGallery: 'اختيار من المعرض',
    removePhoto: 'إزالة الصورة',
    category: 'الفئة',
    room: 'الغرفة',
    roomLabel: 'الغرفة',
    assignRooms: 'تعيين الغرف',
    brand: 'العلامة التجارية',
    quantity: 'الكمية',
    unit: 'الوحدة',
    minThreshold: 'حد الحد الأدنى',
    expirationDate: 'تاريخ الانتهاء',
    purchaseDate: 'تاريخ الشراء',
    pricePerUnit: 'السعر للوحدة',
    notes: 'ملاحظات',
    optional: 'اختياري',
    productDetails: 'تفاصيل المنتج',

    // Categories
    cleaning: 'مستلزمات التنظيف',
    toiletries: 'العناية الشخصية',
    laundry: 'الغسيل',
    kitchen: 'مستلزمات المطبخ',
    medical: 'الإسعافات الأولية',
    baby: 'الأطفال والرضع',
    pet: 'مستلزمات الحيوانات',
    other: 'أخرى',

    // Rooms
    kitchenRoom: 'المطبخ',
    bathroom: 'الحمام',
    bedroom: 'غرفة النوم',
    living: 'غرفة المعيشة',
    laundryRoom: 'غرفة الغسيل',
    storage: 'المخزن / المرآب',
    otherRoom: 'أخرى',
    addCustomRoom: 'إضافة غرفة مخصصة',
    roomName: 'اسم الغرفة',
    renameRoom: 'إعادة تسمية',
    deleteRoom: 'حذف الغرفة',
    deleteRoomConfirm: 'سيتم إلغاء تعيين المنتجات في هذه الغرفة دون حذفها.',
    productsInRoom: 'المنتجات في هذه الغرفة',

    // Units
    bottles_unit: 'زجاجات',
    boxes_unit: 'صناديق',
    bags_unit: 'أكياس',
    rolls_unit: 'رولات',
    pieces_unit: 'قطع',
    liters_unit: 'لترات',
    other_unit: 'أخرى',

    // Stock Status
    inStock: 'متوفر',
    lowStock: 'مخزون منخفض',
    outOfStock: 'نفد المخزون',
    stockStatus: 'حالة المخزون',

    // Product Actions
    addToShoppingList: 'أضف لقائمة التسوق',
    markAsPurchased: 'تم الشراء',
    quantityAdjust: 'تعديل سريع',
    deleteProduct: 'حذف المنتج',
    deleteProductConfirm: 'هل أنت متأكد من حذف هذا المنتج؟',
    productAdded: 'تمت إضافة المنتج بنجاح',
    productUpdated: 'تم تحديث المنتج بنجاح',
    productDeleted: 'تم حذف المنتج',

    // Shopping List
    addCustomItem: 'إضافة عنصر مخصص',
    itemName: 'اسم العنصر',
    suggestedQty: 'الكمية المقترحة',
    estimatedCost: 'التكلفة المتوقعة',
    totalEstimated: 'إجمالي التكلفة',
    groupByRoom: 'تجميع حسب الغرفة',
    groupByCategory: 'تجميع حسب الفئة',
    shareList: 'مشاركة القائمة',
    clearCompleted: 'مسح المكتمل',
    howManyBought: 'كم عدد ما اشتريت؟',
    itemsPending: 'عناصر معلقة',
    noShoppingItems: 'قائمة التسوق فارغة',
    itemAddedToList: 'تمت الإضافة لقائمة التسوق',
    itemMarkedPurchased: 'تم الشراء بنجاح',
    completedCleared: 'تم مسح المكتمل',
    customItemAdded: 'تمت إضافة العنصر',

    // Alerts
    alerts: 'التنبيهات',
    lowStockAlert: 'تنبيه المخزون المنخفض',
    expiryAlert: 'تنبيه الانتهاء',
    dailySummary: 'الملخص اليومي',
    notificationTitle: 'تنبيه HomeCare Cabinet',

    // Filters & Sort
    allCategories: 'جميع الفئات',
    allRooms: 'جميع الغرف',
    allStatuses: 'جميع الحالات',
    filterByCategory: 'تصفية حسب الفئة',
    filterByRoom: 'تصفية حسب الغرفة',
    filterByStatus: 'تصفية حسب الحالة',
    sortByName: 'الاسم (أ-ي)',
    sortByQuantity: 'الكمية (من الأقل)',
    sortByExpiry: 'الانتهاء (الأقرب)',
    sortByDateAdded: 'تاريخ الإضافة',
    sortByCategory: 'الفئة',

    // Smart Sections
    outOfStockLabel: 'نفد المخزون',

    // Export
    exportData: 'تصدير البيانات',
    exportPDF: 'تصدير PDF',
    exportTXT: 'تصدير نصي',
    exportJSON: 'تصدير JSON',
    exportSuccess: 'تم التصدير بنجاح',
    exportFailed: 'فشل التصدير',
    aiAnalysisPrompt: 'تحليل الذكاء الاصطناعي',

    // Import
    importBackup: 'استيراد نسخة احتياطية',
    selectJSONFile: 'اختر ملف JSON',
    importSuccess: 'منتجات مستوردة بنجاح',
    importFailed: 'فشل الاستيراد: تنسيق الملف غير صالح',
    importMergeInfo: 'سيتم تخطي العناصر المكررة',

    // Settings
    appearance: 'المظهر',
    darkMode: 'الوضع الداكن',
    lightMode: 'الوضع الفاتح',
    systemDefault: 'إعدادات النظام',
    language: 'اللغة',
    notifications: 'الإشعارات',
    enableNotifications: 'تفعيل الإشعارات',
    dailyAlertTime: 'وقت التنبيه اليومي',
    lowStockThreshold: 'حد المخزون المنخفض',
    reminderFrequency: 'تذكير قائمة التسوق',
    defaultUnit: 'الوحدة الافتراضية',
    defaultExportFormat: 'تنسيق التصدير الافتراضي',
    dataManagement: 'إدارة البيانات',
    resetAllData: 'إعادة تعيين جميع البيانات',
    resetConfirm: 'سيتم حذف جميع بياناتك. لا يمكن التراجع عن هذا الإجراء.',
    dataReset: 'تم إعادة تعيين جميع البيانات',

    // Privacy
    privacyNotice: 'إشعار الخصوصية',
    privacyText: 'يحترم HomeCare Cabinet خصوصيتك. جميع البيانات مخزنة محلياً على جهازك. لا تخزين سحابي، لا حسابات، لا تتبع. بياناتك لا تغادر جهازك إلا إذا اخترت تصديرها.',
    noCloud: 'لا تخزين سحابي',
    noAccount: 'لا يحتاج حساب',
    dataStaysLocal: 'جميع البيانات على الجهاز',
    noBuiltInAI: 'لا يوجد ذكاء اصطناعي مدمج',
    cameraStorageNote: 'يتم تخزين الصور كـ base64 في localStorage فقط.',

    // Empty States
    noProductsFound: 'لا توجد منتجات',
    noProductsYet: 'لا توجد منتجات بعد',
    addYourFirstProduct: 'أضف منتجك الأول للبدء',
    noRoomsFound: 'لا توجد غرف',
    noAlerts: 'لا توجد تنبيهات حالياً',
    startAddingProducts: 'ابدأ بإضافة المنتجات لتراها هنا',

    // Toasts
    saved: 'تم الحفظ',
    autoSaveEnabled: 'الحفظ التلقائي مفعل',
    error: 'خطأ',
    success: 'نجاح',
    warning: 'تحذير',
    info: 'معلومة',

    // Confirmation
    areYouSure: 'هل أنت متأكد؟',
    thisActionCannotBeUndone: 'لا يمكن التراجع عن هذا الإجراء.',

    // Misc
    appName: 'HomeCare Cabinet',
    appTagline: 'مدير المستلزمات المنزلية',
    version: 'الإصدار',
    loading: 'جاري التحميل...',
    cameraNotAvailable: 'الكاميرا غير متوفرة على هذا الجهاز',
    pullToRefresh: 'اسحب للتحديث',
    tapToEdit: 'اضغط للتعديل',

    // AI Prompt
    aiPromptText: `حلل جرد المستلزمات المنزلية وحدد:
- العناصر منخفضة المخزون أو المنفدة التي تحتاج إعادة تزويد عاجلة
- المنتجات القريبة من الانتهاء التي يجب استخدامها أو استبدالها
- المنتجات المكررة التي تؤدي نفس الغرض
- الغرف التي تبدو ناقصة في المستلزمات الأساسية
- التكلفة الشهرية المقدرة لإعادة التزويد
- اقتراحات لدمج أو استبدال المنتجات ببدائل متعددة الاستخدامات

هذا التقرير ليس استشارة مهنية.`,
  },

  fr: {
    // Navigation
    dashboard: 'Tableau de bord',
    products: 'Produits',
    addProduct: 'Ajouter un produit',
    editProduct: 'Modifier le produit',
    shoppingList: 'Liste de courses',
    rooms: 'Pièces',
    settings: 'Paramètres',
    export: 'Exporter',
    back: 'Retour',
    cancel: 'Annuler',
    save: 'Enregistrer',
    delete: 'Supprimer',
    edit: 'Modifier',
    confirm: 'Confirmer',
    close: 'Fermer',
    done: 'Terminé',
    search: 'Rechercher',
    filter: 'Filtrer',
    sort: 'Trier',
    clear: 'Effacer',
    apply: 'Appliquer',
    reset: 'Réinitialiser',

    // Dashboard
    totalProducts: 'Produits totaux',
    lowStockItems: 'Stock faible',
    outOfStockItems: 'Rupture de stock',
    expiringSoon: 'Expire bientôt',
    expired: 'Expiré',
    roomSummary: 'Pièces',
    shoppingListItems: 'Liste de courses',
    quickAdd: 'Ajout rapide',
    viewShoppingList: 'Voir la liste',
    criticalAlerts: 'Alertes critiques',
    recentlyAdded: 'Récemment ajouté',
    viewAll: 'Voir tout',

    // Product
    productName: 'Nom du produit',
    photo: 'Photo',
    takePhoto: 'Prendre une photo',
    chooseFromGallery: 'Choisir dans la galerie',
    removePhoto: 'Supprimer la photo',
    category: 'Catégorie',
    room: 'Pièce',
    roomLabel: 'Pièce',
    assignRooms: 'Assigner les pièces',
    brand: 'Marque',
    quantity: 'Quantité',
    unit: 'Unité',
    minThreshold: 'Seuil minimum',
    expirationDate: "Date d'expiration",
    purchaseDate: "Date d'achat",
    pricePerUnit: 'Prix par unité',
    notes: 'Notes',
    optional: 'Optionnel',
    productDetails: 'Détails du produit',

    // Categories
    cleaning: 'Produits de nettoyage',
    toiletries: 'Hygiène et soins',
    laundry: 'Lessive',
    kitchen: 'Ustensiles de cuisine',
    medical: 'Premiers secours',
    baby: 'Bébé et enfants',
    pet: 'Animaux',
    other: 'Autre',

    // Rooms
    kitchenRoom: 'Cuisine',
    bathroom: 'Salle de bain',
    bedroom: 'Chambre',
    living: 'Salon',
    laundryRoom: 'Buanderie',
    storage: 'Stockage / Garage',
    otherRoom: 'Autre',
    addCustomRoom: 'Ajouter une pièce',
    roomName: 'Nom de la pièce',
    renameRoom: 'Renommer',
    deleteRoom: 'Supprimer la pièce',
    deleteRoomConfirm: 'Les produits seront désassignés mais pas supprimés.',
    productsInRoom: 'Produits dans cette pièce',

    // Units
    bottles_unit: 'Bouteilles',
    boxes_unit: 'Boîtes',
    bags_unit: 'Sacs',
    rolls_unit: 'Rouleaux',
    pieces_unit: 'Pièces',
    liters_unit: 'Litres',
    other_unit: 'Autre',

    // Stock Status
    inStock: 'En stock',
    lowStock: 'Stock faible',
    outOfStock: 'Rupture',
    stockStatus: 'État du stock',

    // Product Actions
    addToShoppingList: 'Ajouter à la liste',
    markAsPurchased: 'Marquer comme acheté',
    quantityAdjust: 'Ajustement rapide',
    deleteProduct: 'Supprimer le produit',
    deleteProductConfirm: 'Êtes-vous sûr de vouloir supprimer ce produit ?',
    productAdded: 'Produit ajouté avec succès',
    productUpdated: 'Produit mis à jour avec succès',
    productDeleted: 'Produit supprimé',

    // Shopping List
    addCustomItem: 'Ajouter un article',
    itemName: "Nom de l'article",
    suggestedQty: 'Qté suggérée',
    estimatedCost: 'Coût estimé',
    totalEstimated: 'Total estimé',
    groupByRoom: 'Grouper par pièce',
    groupByCategory: 'Grouper par catégorie',
    shareList: 'Partager la liste',
    clearCompleted: 'Effacer les cochés',
    howManyBought: "Combien en avez-vous acheté ?",
    itemsPending: 'articles en attente',
    noShoppingItems: 'Votre liste est vide',
    itemAddedToList: 'Article ajouté à la liste',
    itemMarkedPurchased: 'Article marqué comme acheté',
    completedCleared: 'Articles cochés effacés',
    customItemAdded: 'Article personnalisé ajouté',

    // Alerts
    alerts: 'Alertes',
    lowStockAlert: 'Alerte stock faible',
    expiryAlert: "Alerte d'expiration",
    dailySummary: 'Résumé quotidien',
    notificationTitle: 'Alerte HomeCare Cabinet',

    // Filters & Sort
    allCategories: 'Toutes les catégories',
    allRooms: 'Toutes les pièces',
    allStatuses: 'Tous les états',
    filterByCategory: 'Filtrer par catégorie',
    filterByRoom: 'Filtrer par pièce',
    filterByStatus: 'Filtrer par état',
    sortByName: 'Nom (A-Z)',
    sortByQuantity: 'Quantité (croissant)',
    sortByExpiry: 'Expiration (prochaine)',
    sortByDateAdded: "Date d'ajout",
    sortByCategory: 'Catégorie',

    // Smart Sections
    outOfStockLabel: 'Rupture de stock',

    // Export
    exportData: 'Exporter les données',
    exportPDF: 'Exporter en PDF',
    exportTXT: 'Exporter en TXT',
    exportJSON: 'Exporter en JSON',
    exportSuccess: 'Export réussi',
    exportFailed: "Échec de l'export",
    aiAnalysisPrompt: 'Analyse IA',

    // Import
    importBackup: 'Importer une sauvegarde',
    selectJSONFile: 'Sélectionner un fichier JSON',
    importSuccess: 'produits importés avec succès',
    importFailed: 'Import échoué : format invalide',
    importMergeInfo: 'Les doublons seront ignorés',

    // Settings
    appearance: 'Apparence',
    darkMode: 'Mode sombre',
    lightMode: 'Mode clair',
    systemDefault: 'Par défaut système',
    language: 'Langue',
    notifications: 'Notifications',
    enableNotifications: 'Activer les notifications',
    dailyAlertTime: 'Heure de alerte',
    lowStockThreshold: 'Seuil stock faible',
    reminderFrequency: 'Rappel liste de courses',
    defaultUnit: 'Unité par défaut',
    defaultExportFormat: "Format d'export par défaut",
    dataManagement: 'Gestion des données',
    resetAllData: 'Réinitialiser les données',
    resetConfirm: 'Cela supprimera toutes vos données. Cette action est irréversible.',
    dataReset: 'Toutes les données ont été réinitialisées',

    // Privacy
    privacyNotice: 'Avis de confidentialité',
    privacyText: "HomeCare Cabinet respecte votre vie privée. Toutes les données sont stockées localement sur votre appareil. Pas de stockage cloud, pas de comptes, pas de suivi. Vos données ne quittent jamais votre appareil sauf si vous choisissez de les exporter.",
    noCloud: 'Pas de stockage cloud',
    noAccount: 'Pas de compte requis',
    dataStaysLocal: 'Toutes les données restent sur appareil',
    noBuiltInAI: "Pas d'IA intégrée",
    cameraStorageNote: 'Les photos sont stockées en base64 dans localStorage uniquement.',

    // Empty States
    noProductsFound: 'Aucun produit trouvé',
    noProductsYet: 'Aucun produit encore',
    addYourFirstProduct: 'Ajoutez votre premier produit',
    noRoomsFound: 'Aucune pièce trouvée',
    noAlerts: 'Aucune alerte pour le moment',
    startAddingProducts: 'Commencez à ajouter des produits',

    // Toasts
    saved: 'Enregistré',
    autoSaveEnabled: 'Sauvegarde auto activée',
    error: 'Erreur',
    success: 'Succès',
    warning: 'Avertissement',
    info: 'Info',

    // Confirmation
    areYouSure: 'Êtes-vous sûr ?',
    thisActionCannotBeUndone: 'Cette action est irréversible.',

    // Misc
    appName: 'HomeCare Cabinet',
    appTagline: 'Inventaire domestique intelligent',
    version: 'Version',
    loading: 'Chargement...',
    cameraNotAvailable: 'Caméra non disponible',
    pullToRefresh: 'Tirer pour rafraîchir',
    tapToEdit: 'Appuyer pour modifier',

    // AI Prompt
    aiPromptText: `Analysez cet inventaire de fournitures domestiques et déterminez :
- Articles critiques ou en rupture nécessitant un réapprovisionnement urgent
- Produits proches de l'expiration à utiliser ou remplacer
- Doublons potentiels avec la même fonction
- Pièces sous-équipées ou manquant de produits essentiels
- Coût mensuel estimé de réapprovisionnement
- Suggestions pour consolider ou remplacer par des alternatives multifonctions

Ce rapport n'est pas un conseil professionnel.`,
  },
};

export type TranslationKey = keyof typeof translations.en;

export function getTranslation(lang: Language, key: TranslationKey): string {
  if (lang === 'system') {
    const deviceLang = navigator.language.split('-')[0];
    if (deviceLang === 'ar') lang = 'ar';
    else if (deviceLang === 'fr') lang = 'fr';
    else lang = 'en';
  }
  const dict = translations[lang as keyof typeof translations] || translations.en;
  return (dict[key] as string) || translations.en[key] || key;
}

export function isRTLLanguage(lang: Language): boolean {
  if (lang === 'system') {
    const deviceLang = navigator.language.split('-')[0];
    return deviceLang === 'ar';
  }
  return lang === 'ar';
}

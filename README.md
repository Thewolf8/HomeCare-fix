# HomeCare Cabinet

A smart, privacy-focused household supplies inventory manager built as a modern web application. Track cleaning products, toiletries, and household consumables room by room, get restock alerts before you run out, generate smart shopping lists, and export your inventory for AI-assisted analysis.

## Features

- **Dashboard** - At-a-glance overview with animated stat cards, critical alerts, and room summaries
- **Product Management** - Add products with photos (camera/gallery), categories, rooms, quantities, expiry dates, and pricing
- **Room Organization** - Organize products by room with custom room support
- **Smart Shopping List** - Auto-generated from low stock, manual additions, grouping by room/category, share via native share sheet
- **Stock Alerts** - Visual alerts for low stock, out of stock, and expiring products
- **Export & Backup** - Export as PDF (formatted report), TXT (AI-friendly), or JSON (full backup) with AI analysis prompt
- **Import Backup** - Restore from JSON backup files with validation
- **Multi-Language** - English, Arabic (with full RTL support), and French
- **Dark/Light Mode** - Toggle between dark and light themes
- **100% Offline** - All data stored locally in localStorage, no backend required
- **Privacy First** - No cloud storage, no accounts, no tracking

## Tech Stack

- React 19 + TypeScript + Vite
- Tailwind CSS + shadcn/ui components
- Framer Motion animations
- jsPDF for PDF export
- localStorage for persistence
- Capacitor.js for Android deployment

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Sync with Capacitor (after build)
npx cap sync android
```

## Android Deployment

### Prerequisites
- Node.js 20+
- Android Studio
- JDK 17

### Local Build
```bash
# 1. Build the web app
npm run build

# 2. Sync with Android
npx cap sync android

# 3. Open in Android Studio
npx cap open android

# 4. Build APK from Android Studio
# Or use Gradle directly:
cd android && ./gradlew assembleDebug
```

### GitHub Actions CI/CD
This project includes a GitHub Actions workflow that automatically builds the Android APK on every push to `main`.

1. Push your code to GitHub
2. Go to the **Actions** tab in your repository
3. The workflow "Android APK Build" will run automatically
4. Once complete, download the APK from the **Artifacts** section

The workflow produces:
- `homecare-cabinet-apk` - Debug APK (ready to install)
- `homecare-cabinet-release-apk` - Release APK (unsigned)

## Project Structure

```
├── .github/workflows/     # CI/CD automation
├── src/
│   ├── components/        # Shared components (MobileNav, ToastContainer, AppLayout)
│   ├── hooks/             # Custom hooks (useAppContext - state management)
│   ├── lib/               # Utilities (i18n translations)
│   ├── pages/             # All page components
│   ├── types/             # TypeScript type definitions
│   ├── App.tsx            # Root component
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles with glassmorphism
├── capacitor.config.json  # Capacitor configuration
└── README.md
```

## Privacy Philosophy

- No cloud storage - all data stays on your device
- No account required
- No built-in AI - export your data to use with any AI you trust
- Camera photos stored as base64 in localStorage only

## License

MIT

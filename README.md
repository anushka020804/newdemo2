# OpportunityX - AI-Powered Tender Management Platform

**By Qistonpe**

A premium B2B fintech SaaS platform for complete tender management lifecycle - from onboarding to bid generation.

## 🚀 Features

- **Business Verification** - PAN auto-fetch and company verification
- **HSN Setup** - Enterprise-grade product/service configuration
- **Document Upload** - Smart document management with progress tracking
- **Premium Dashboard** - KPIs, analytics, and insights
- **Tender Discovery** - Browse and filter opportunities
- **AI Eligibility Analysis** - 4-step intelligent matching
- **Smart Bid Generation** - Professional PDF tender documents
- **Financial Upsell** - Metal Capital integration for non-customers

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Routing**: React Router v7 (Data Mode)
- **Styling**: Tailwind CSS v4
- **Animations**: Motion (Framer Motion)
- **UI Components**: Radix UI, shadcn/ui
- **Charts**: Recharts
- **PDF Generation**: jsPDF
- **Icons**: Lucide React
- **Build Tool**: Vite

## 📦 Installation

```bash
# Install dependencies (using pnpm)
pnpm install

# Or using npm
npm install
```

## 🏃‍♂️ Development

```bash
# Start development server
pnpm dev

# Or using npm
npm run dev
```

The app will be available at `http://localhost:5173`

## 🏗️ Build for Production

```bash
# Create production build
pnpm build

# Preview production build locally
pnpm preview
```

## 🚀 Deploy to Render

### Method 1: One-Click Deploy (Recommended)

1. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - OpportunityX"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy on Render**:
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click **"New +"** → **"Static Site"**
   - Connect your GitHub repository
   - Render will auto-detect the `render.yaml` configuration
   - Click **"Create Static Site"**
   - Your app will be live in a few minutes! 🎉

### Method 2: Manual Configuration

If `render.yaml` doesn't work, configure manually:

1. **Connect Repository** on Render
2. **Configure Build Settings**:
   - **Build Command**: `pnpm install && pnpm run build`
   - **Publish Directory**: `dist`
   - **Branch**: `main`
3. **Add Environment Variables** (if needed):
   - Click "Environment" tab
   - Add any API keys or secrets
4. Click **"Create Static Site"**

### Method 3: Using Render.yaml Blueprint

```bash
# Render will automatically use render.yaml
# Just connect your repo and Render handles the rest!
```

## 🌐 Environment Variables

Currently, the app uses mock data and doesn't require environment variables. 

For production with real APIs, create a `.env` file:

```env
VITE_API_URL=your_api_url
VITE_API_KEY=your_api_key
```

## 📁 Project Structure

```
opportunityx/
├── src/
│   ├── app/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components (9 screens)
│   │   ├── utils/           # Utility functions (PDF generation)
│   │   ├── App.tsx          # Main app component
│   │   └── routes.tsx       # React Router configuration
│   ├── styles/              # Global styles & Tailwind
│   └── main.tsx             # Entry point
├── public/                  # Static assets
├── index.html               # HTML template
├── package.json             # Dependencies
├── vite.config.ts           # Vite configuration
└── render.yaml              # Render deployment config
```

## 🎨 Key Pages

1. **Landing Page** - Metal Capital/OpportunityX cards
2. **Business Verification** - PAN auto-fetch
3. **HSN Setup** - Enterprise product table
4. **Welcome Screen** - Onboarding complete
5. **Document Upload** - Progress tracking
6. **Dashboard** - Premium KPI dashboard
7. **Tender Listing** - Browse opportunities
8. **Tender Details & Eligibility** - 4-step AI analysis
9. **Saved Bids** - Generated tender documents

## 🔧 Troubleshooting

### Build fails on Render

- Ensure `pnpm-lock.yaml` is committed
- Check Node version (use Node 18+)
- Verify all dependencies are in `package.json`

### React Router not working

- The `public/_redirects` file handles SPA routing
- Ensure it's included in your build

### Styles not loading

- Check that all CSS files are imported in `main.tsx`
- Verify Tailwind config is correct

## 📝 License

Private - Qistonpe © 2026

## 🙋‍♂️ Support

For issues or questions, contact the Qistonpe development team.

---

**Built with ❤️ by Qistonpe Team**

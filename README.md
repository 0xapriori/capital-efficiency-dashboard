# Capital Efficiency Dashboard

A real-time dashboard that measures and compares capital efficiency across blockchain networks using DeFiLlama's API.

## 🚀 Features

- **Real-time Data**: Fetches live data from DeFiLlama API
- **Capital Efficiency Metrics**: 
  - Stablecoin Turnover Ratio
  - TVL Turnover Ratio  
  - Fee Yield (APY)
  - Volume per TVL Dollar
  - Stablecoin Utilization
- **Interactive Charts**: Scatter plots and bar charts with hover tooltips
- **Sortable Tables**: Click column headers to sort by any metric
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark Theme**: Optimized for data visualization

## 📊 Metrics Explained

| Metric | Formula | What It Measures |
|--------|---------|------------------|
| **Stablecoin Turnover** | `DEX Volume / Stablecoin Mcap` | How actively stablecoins are traded |
| **TVL Turnover** | `DEX Volume / TVL` | How hard DeFi liquidity is working |
| **Fee Yield** | `Fees × 365 / TVL × 100` | Annualized capital productivity |
| **Volume per TVL** | `DEX Volume / TVL` | Raw capital velocity |
| **Stablecoin Utilization** | `Stablecoin Mcap / TVL × 100` | % of TVL that is stablecoins |

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Build Tool**: Vite
- **Data Source**: DeFiLlama API (free tier)

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/capital-efficiency-dashboard.git
cd capital-efficiency-dashboard
```

2. Install dependencies
```bash
npm install
```

3. Start development server
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🚀 Deployment

This project is configured for GitHub Pages deployment:

1. Create a new GitHub repository (any name will work)
2. Push to the `main` branch
3. Enable GitHub Pages: Settings → Pages → Source: "GitHub Actions"
4. GitHub Actions will automatically build and deploy
5. Your dashboard will be available at `https://yourusername.github.io/repository-name/`

### Quick Deployment Steps

```bash
# Initialize git repository
git init
git add .
git commit -m "Initial commit: Capital Efficiency Dashboard"

# Create GitHub repository and push
git branch -M main
git remote add origin https://github.com/yourusername/your-repo-name.git
git push -u origin main

# Go to GitHub repository settings
# Pages → Source: GitHub Actions
# Wait 2-3 minutes for deployment to complete
```

### Manual Deployment

To deploy to GitHub Pages manually:

```bash
npm run build
# Push the dist folder to gh-pages branch
```

## 📡 API Usage

The dashboard uses these DeFiLlama endpoints:

- `GET /v2/chains` - Chain TVL data
- `GET /stablecoinchains` - Stablecoin market caps
- `GET /overview/dexs` - DEX volume data
- `GET /overview/fees` - Protocol fees data

All endpoints are free and don't require authentication.

## 🔧 Configuration

Key configuration files:

- `vite.config.ts` - Build configuration and GitHub Pages base path
- `tailwind.config.js` - Custom color scheme and styling
- `.github/workflows/deploy.yml` - GitHub Actions deployment

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── Dashboard.tsx    # Main dashboard container
│   ├── DataTable.tsx    # Sortable data table
│   ├── ScatterChart.tsx # Efficiency scatter plot
│   ├── BarChart.tsx     # Ranking bar chart
│   └── ...
├── hooks/
│   └── useChainMetrics.ts # Main data fetching hook
├── api/
│   ├── client.ts        # HTTP client with retry logic
│   └── defillama.ts     # DeFiLlama API functions
├── utils/
│   ├── calculations.ts  # Metric calculations
│   ├── formatters.ts    # Number/date formatting
│   └── chainMapping.ts  # Chain name normalization
└── types/
    └── index.ts         # TypeScript interfaces
```

## 🎯 Key Features

### Data Quality
- Validates all metrics before display
- Filters out chains with insufficient data
- Handles API failures gracefully
- Implements retry logic with exponential backoff

### Performance
- Memoized calculations
- Efficient re-renders
- Debounced user interactions
- Parallel API requests with rate limiting

### User Experience
- Loading states with progress indicators
- Error states with retry buttons
- Responsive design for all screen sizes
- Intuitive sorting and filtering

## 📊 Data Attribution

Data provided by [DeFiLlama](https://defillama.com) - The largest TVL aggregator for DeFi protocols.

## ⚠️ Limitations

- Free API tier has rate limits
- Data updates every 5 minutes
- Some smaller chains may have incomplete data
- Historical data not included (real-time only)

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [DeFiLlama](https://defillama.com) for providing comprehensive DeFi data
- [Recharts](https://recharts.org) for beautiful chart components
- [Tailwind CSS](https://tailwindcss.com) for utility-first styling
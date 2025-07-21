# Pick & Pack Stats Dashboard

A modern, responsive dashboard for analyzing warehouse pick and pack statistics. Built with React, TypeScript, and Tailwind CSS, designed to process Excel files locally without storing sensitive data on any server.

## Features

- 📊 **Interactive Dashboard** - Visual analytics with charts and summary statistics
- 📁 **Drag & Drop File Upload** - Easy Excel file processing (.xlsx, .xls)
- 🔍 **Advanced Data Table** - Sortable, filterable data with search functionality
- 📈 **Data Visualization** - Charts showing employee performance and weekly trends
- 🔒 **Privacy First** - All data processing happens locally in your browser
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile devices
- 💾 **Export Functionality** - Export filtered data to CSV

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Components**: Shadcn/ui + Tailwind CSS
- **Data Processing**: SheetJS (xlsx) for Excel file parsing
- **Charts**: Recharts for data visualization
- **Table**: TanStack Table for advanced data tables
- **Deployment**: Cloudflare Pages ready

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.

## Usage

1. **Upload Files**: Drag and drop your Excel files or click to select them
2. **View Dashboard**: Switch to the Dashboard tab to see analytics and charts
3. **Explore Data**: Use the Data Table tab to sort, filter, and search your data
4. **Export Results**: Export filtered data to CSV for further analysis

## Excel File Format

The dashboard automatically detects common column names:
- **Week**: Week numbers (e.g., "Week 17", "17", etc.)
- **Employee**: Employee names or IDs
- **Date**: Date fields
- **Picks**: Pick counts or rates
- **Packs**: Pack counts or rates
- **Efficiency**: Efficiency percentages

## Deployment

### Cloudflare Pages

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy to Cloudflare Pages:
   - Connect your Git repository to Cloudflare Pages
   - Set build command: `npm run build`
   - Set output directory: `dist`
   - Deploy!

### Other Platforms

The built application is a static site and can be deployed to:
- Vercel
- Netlify
- GitHub Pages
- Any static hosting service

## Security & Privacy

- **No Server Storage**: All data processing happens in your browser
- **Local Processing**: Excel files are processed client-side using SheetJS
- **Session Only**: Data exists only during your browser session
- **No Tracking**: No analytics or tracking scripts included
```

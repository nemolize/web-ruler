# Web Ruler

A precise digital measurement tool that turns your screen into a ruler. Perfect for measuring objects, checking dimensions, and calibrating your display for accurate measurements.

## Features

- **Precise Ruler Grid**: SVG-based ruler overlay with centimeter markings
- **Display Metrics**: Real-time DPI, resolution, and zoom level detection  
- **Smart Calibration**: Calibrate using common objects (credit cards, quarters, etc.)
- **Zoom Detection**: Automatically adjusts for browser zoom levels
- **Mobile Responsive**: Works on both desktop and mobile devices
- **Persistent Settings**: Saves calibration settings locally

## Getting Started

First, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to start measuring.

## How to Use

1. **Calibration** (recommended for accuracy):
   - Click the info button to open display metrics
   - Use a physical object with known dimensions to calibrate
   - Common objects: credit card (8.56cm), quarter (2.4cm), etc.

2. **Taking Measurements**:
   - The ruler grid shows centimeter markings
   - Align objects with the grid lines to measure
   - Use the display info panel to see exact pixel measurements

3. **Display Information**:
   - View current DPI and resolution
   - Check browser zoom level
   - See pixels per centimeter/inch ratios

## Technical Details

- Built with Next.js and React
- Uses Visual Viewport API for zoom detection
- SVG-based ruler for crisp scaling
- Responsive design with orientation change support
- Local storage for calibration persistence

## Browser Compatibility

Works in modern browsers with Visual Viewport API support. Best performance in Chrome, Firefox, and Safari.
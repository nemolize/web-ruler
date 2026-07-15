# Web Ruler

A browser-based measurement tool that overlays a ruler grid on your screen. Use it to estimate dimensions, inspect display metrics, and check device orientation.

## Features

- **Ruler Grid**: SVG-based overlay with centimeter, millimeter, and inch markings
- **Unit Selection**: Switch units and keep the selection across browser sessions
- **Display Metrics**: Real-time DPI, resolution, and zoom level detection
- **Zoom Detection**: Automatically adjusts for browser zoom levels
- **Digital Level**: Check horizontal and vertical device orientation where supported
- **Mobile Responsive**: Works on both desktop and mobile devices

## Getting Started

First, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to start measuring.

## How to Use

1. **Taking Measurements**:
   - Select centimeters, millimeters, or inches
   - Align objects with the grid lines to measure

2. **Display Information**:
   - Open the display info panel to see pixel measurements
   - View current DPI and resolution
   - Check browser zoom level
   - See pixels per centimeter/inch ratios

3. **Digital Level**:
   - Open the level on a device with orientation sensor support
   - Allow orientation access when prompted by the browser

## Measurement Accuracy

Browsers do not reliably expose a display's physical pixel density. Web Ruler estimates the physical scale from browser-provided metrics, so measurements should be treated as approximate.

## Technical Details

- Built with Next.js and React
- Uses Visual Viewport API for zoom detection
- SVG-based ruler for crisp scaling
- Responsive design with orientation change support
- Local storage for unit preference persistence

## Browser Compatibility

The ruler grid works in modern browsers. Zoom detection and the digital level depend on Visual Viewport and Device Orientation API support.

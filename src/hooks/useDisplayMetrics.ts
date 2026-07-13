"use client";

import { useEffect, useState } from "react";

export interface DisplayMetrics {
  devicePixelRatio: number;
  screenWidth: number;
  screenHeight: number;
  viewportWidth: number;
  viewportHeight: number;
  physicalDPI: number;
  logicalDPI: number;
  zoomLevel: number;
  pixelsPerCm: number;
  pixelsPerInch: number;
  pixelsPerMm: number;
}

export const useDisplayMetrics = (): DisplayMetrics | null => {
  const [metrics, setMetrics] = useState<DisplayMetrics | null>(null);

  useEffect(() => {
    const calculateMetrics = () => {
      const devicePixelRatio = window.devicePixelRatio || 1;
      const screenWidth = window.screen.width;
      const screenHeight = window.screen.height;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Check for stored calibration
      const storedCalibration = localStorage.getItem("displayCalibration");
      let pixelsPerCm: number;

      if (storedCalibration) {
        pixelsPerCm = parseFloat(storedCalibration);
      } else {
        // Improved default calculation - assume standard 96 DPI but adjust for device pixel ratio
        // This is still an approximation, but better than pure CSS inches
        const standardDPI = 96;
        const adjustedDPI = standardDPI * Math.max(1, devicePixelRatio * 0.75); // Conservative adjustment
        pixelsPerCm = adjustedDPI / 2.54;
      }

      const pixelsPerInch = pixelsPerCm * 2.54;
      const pixelsPerMm = pixelsPerCm / 10;

      const logicalDPI = pixelsPerInch;
      const physicalDPI = logicalDPI * devicePixelRatio;

      // Zoom detection with priority for mobile devices
      let zoomLevel = 100;

      // Method 1: Visual Viewport API for mobile pinch zoom
      if (window.visualViewport) {
        const scale = window.visualViewport.scale;
        if (scale && scale !== 1) {
          zoomLevel = Math.round(scale * 100);
        }
      }

      return {
        devicePixelRatio,
        screenWidth,
        screenHeight,
        viewportWidth,
        viewportHeight,
        physicalDPI: Math.round(physicalDPI),
        logicalDPI: Math.round(logicalDPI),
        zoomLevel: Math.round(zoomLevel),
        pixelsPerCm: Math.round(pixelsPerCm * 100) / 100,
        pixelsPerInch: Math.round(pixelsPerInch),
        pixelsPerMm: Math.round(pixelsPerMm * 100) / 100,
      };
    };

    const updateMetrics = () => {
      setMetrics(calculateMetrics());
    };

    updateMetrics();
    window.addEventListener("resize", updateMetrics);
    window.addEventListener("orientationchange", updateMetrics);

    // Listen for visualViewport changes (zoom/pinch events on mobile)
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", updateMetrics);
      window.visualViewport.addEventListener("scroll", updateMetrics);
    }

    return () => {
      window.removeEventListener("resize", updateMetrics);
      window.removeEventListener("orientationchange", updateMetrics);

      // Clean up visualViewport listeners
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", updateMetrics);
        window.visualViewport.removeEventListener("scroll", updateMetrics);
      }
    };
  }, []);

  return metrics;
};

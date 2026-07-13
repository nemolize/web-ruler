"use client";

import { useEffect, useState } from "react";
import type { Unit } from "@/components/UnitSelector";
import type { DisplayMetrics } from "./useDisplayMetrics";

interface UnitMetrics {
  unit: Unit;
  gridSpacing: number;
  unitLabel: string;
  conversionFactor: number;
}

export const useUnit = (metrics: DisplayMetrics | null) => {
  const [selectedUnit, setSelectedUnit] = useState<Unit>("cm");

  // Load saved unit preference
  useEffect(() => {
    let savedUnit: string | null = null;
    try {
      savedUnit = localStorage.getItem("selectedUnit");
    } catch {
      // localStorage unavailable (e.g. blocked by privacy settings)
    }
    if (savedUnit && ["cm", "mm", "in"].includes(savedUnit)) {
      setSelectedUnit(savedUnit as Unit);
    }
  }, []);

  // Save unit preference
  const changeUnit = (unit: Unit) => {
    setSelectedUnit(unit);
    try {
      localStorage.setItem("selectedUnit", unit);
    } catch {
      // localStorage unavailable; the selection still applies for this session
    }
  };

  // Calculate unit-specific metrics
  const getUnitMetrics = (): UnitMetrics | null => {
    if (!metrics) return null;

    let gridSpacing: number;
    let unitLabel: string;
    let conversionFactor: number;

    switch (selectedUnit) {
      case "cm":
        gridSpacing = metrics.pixelsPerCm / (metrics.zoomLevel / 100);
        unitLabel = "cm";
        conversionFactor = 1;
        break;
      case "mm":
        gridSpacing = metrics.pixelsPerMm / (metrics.zoomLevel / 100);
        unitLabel = "mm";
        conversionFactor = 10;
        break;
      case "in":
        gridSpacing = metrics.pixelsPerInch / (metrics.zoomLevel / 100);
        unitLabel = "in";
        conversionFactor = 1 / 2.54;
        break;
      default:
        gridSpacing = metrics.pixelsPerCm / (metrics.zoomLevel / 100);
        unitLabel = "cm";
        conversionFactor = 1;
    }

    return {
      unit: selectedUnit,
      gridSpacing,
      unitLabel,
      conversionFactor,
    };
  };

  return {
    selectedUnit,
    changeUnit,
    unitMetrics: getUnitMetrics(),
  };
};

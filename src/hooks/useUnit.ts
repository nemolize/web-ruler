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
    const savedUnit = localStorage.getItem("selectedUnit") as Unit;
    if (savedUnit && ["cm", "mm", "in"].includes(savedUnit)) {
      setSelectedUnit(savedUnit);
    }
  }, []);

  // Save unit preference
  const changeUnit = (unit: Unit) => {
    setSelectedUnit(unit);
    localStorage.setItem("selectedUnit", unit);
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

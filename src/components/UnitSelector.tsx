"use client";

import { Select } from "@mantine/core";

export type Unit = "cm" | "mm" | "in";

interface UnitSelectorProps {
  selectedUnit: Unit;
  onUnitChange: (unit: Unit) => void;
}

export const UnitSelector = ({
  selectedUnit,
  onUnitChange,
}: UnitSelectorProps) => {
  const units = [
    { value: "cm", label: "Centimeters (cm)" },
    { value: "mm", label: "Millimeters (mm)" },
    { value: "in", label: "Inches (in)" },
  ];

  return (
    <div className="fixed top-8 right-4 w-40">
      <Select
        data={units}
        value={selectedUnit}
        onChange={(value) => value && onUnitChange(value as Unit)}
        placeholder="Select unit"
        size="sm"
        withCheckIcon={false}
      />
    </div>
  );
};

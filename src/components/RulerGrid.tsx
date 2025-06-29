"use client";

import { useDisplayMetrics } from "../hooks/useDisplayMetrics";

export const RulerGrid = () => {
  const metrics = useDisplayMetrics();

  if (!metrics) {
    return null;
  }

  const gridSpacing = metrics.pixelsPerCm / (metrics.zoomLevel / 100);

  const generateGridLines = () => {
    const lines = [];
    const maxWidth = window.innerWidth;
    const maxHeight = window.innerHeight;

    // Vertical lines
    for (let i = 0; i * gridSpacing <= maxWidth; i++) {
      const x = i * gridSpacing;
      lines.push(
        <line
          key={`v-${i}`}
          x1={x}
          y1={0}
          x2={x}
          y2={maxHeight}
          stroke="#3b82f6"
          strokeWidth={i % 5 === 0 ? 2 : 1}
          opacity={0.3}
        />,
      );
    }

    // Horizontal lines
    for (let i = 0; i * gridSpacing <= maxHeight; i++) {
      const y = i * gridSpacing;
      lines.push(
        <line
          key={`h-${i}`}
          x1={0}
          y1={y}
          x2={maxWidth}
          y2={y}
          stroke="#3b82f6"
          strokeWidth={i % 5 === 0 ? 2 : 1}
          opacity={0.3}
        />,
      );
    }

    return lines;
  };

  const generateRulerMarkings = () => {
    const markings = [];
    const maxWidth = window.innerWidth;
    const maxHeight = window.innerHeight;

    // Top ruler (horizontal)
    for (let i = 0; i * gridSpacing <= maxWidth; i++) {
      const x = i * gridSpacing;
      const value = i;
      markings.push(
        <text
          key={`top-${i}`}
          x={x + 2}
          y={15}
          fontSize="10"
          fill="#1f2937"
          fontFamily="monospace"
        >
          {value}
        </text>,
      );
    }

    // Left ruler (vertical)
    for (let i = 0; i * gridSpacing <= maxHeight; i++) {
      const y = i * gridSpacing;
      const value = i;
      markings.push(
        <text
          key={`left-${i}`}
          x={2}
          y={y + 12}
          fontSize="10"
          fill="#1f2937"
          fontFamily="monospace"
        >
          {value}
        </text>,
      );
    }

    return markings;
  };

  return (
    <>
      {/* Grid */}
      <svg
        className="fixed inset-0 w-full h-full pointer-events-none"
        role="img"
        aria-label="Ruler grid overlay"
      >
        <title>Ruler grid overlay</title>
        {/* Ruler background */}
        <rect
          x={0}
          y={0}
          width="100%"
          height={20}
          fill="rgba(255, 255, 255, 0.9)"
        />
        <rect
          x={0}
          y={0}
          width={20}
          height="100%"
          fill="rgba(255, 255, 255, 0.9)"
        />

        {/* Grid lines */}
        {generateGridLines()}

        {/* Ruler markings */}
        {generateRulerMarkings()}

        {/* Unit label */}
        <text
          x={25}
          y={15}
          fontSize="12"
          fill="#1f2937"
          fontFamily="monospace"
          fontWeight="bold"
        >
          cm
        </text>
      </svg>
    </>
  );
};

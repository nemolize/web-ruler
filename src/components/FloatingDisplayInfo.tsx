"use client";

import { Badge, Button, Card, Group, Modal, Stack, Text } from "@mantine/core";
import { Info, Monitor, Ruler } from "lucide-react";
import { useState } from "react";
import { useDisplayMetrics } from "../hooks/useDisplayMetrics";

const MetricCard = ({
  title,
  value,
  unit,
  color,
}: {
  title: string;
  value: string | number;
  unit?: string;
  color?: string;
}) => (
  <div>
    <Text size="xs" c="dimmed" mb={2}>
      {title}
    </Text>
    <Group gap="xs">
      <Text size="sm" fw={600} c={color}>
        {value}
      </Text>
      {unit && (
        <Badge variant="light" color={color} size="xs">
          {unit}
        </Badge>
      )}
    </Group>
  </div>
);

export const FloatingDisplayInfo = () => {
  const [isOpen, setIsOpen] = useState(false);
  const metrics = useDisplayMetrics();

  if (!metrics) {
    return (
      <div className="fixed top-4 left-4 z-50">
        <Button
          variant="filled"
          size="sm"
          leftSection={<Info size={16} />}
          loading
        >
          Loading...
        </Button>
      </div>
    );
  }

  const getDPIQuality = (dpi: number) => {
    if (dpi >= 200) return { label: "Very High", color: "green" };
    if (dpi >= 150) return { label: "High", color: "blue" };
    if (dpi >= 100) return { label: "Standard", color: "yellow" };
    return { label: "Low", color: "red" };
  };

  const getZoomStatus = (zoom: number) => {
    if (zoom === 100) return { label: "Normal", color: "green" };
    if (zoom > 100) return { label: "Zoomed In", color: "blue" };
    return { label: "Zoomed Out", color: "orange" };
  };

  const dpiQuality = getDPIQuality(metrics.physicalDPI);
  const zoomStatus = getZoomStatus(metrics.zoomLevel);

  return (
    <>
      {/* Floating Button */}
      <div
        style={{
          position: "fixed",
          top: 24,
          left: 24,
        }}
      >
        <Button
          variant="filled"
          size="sm"
          leftSection={<Info size={16} />}
          onClick={() => setIsOpen(true)}
        >
          Display Info
        </Button>
      </div>

      {/* Modal Popup */}
      <Modal
        opened={isOpen}
        onClose={() => setIsOpen(false)}
        title={
          <Group gap="xs">
            <Info size={20} />
            <Text fw={600}>Display Information</Text>
          </Group>
        }
        size="lg"
      >
        <Stack gap="lg">
          {/* Summary Badges */}
          <Group gap="md">
            <Badge color={dpiQuality.color} size="lg" variant="filled">
              {dpiQuality.label} DPI
            </Badge>
            <Badge color={zoomStatus.color} size="lg" variant="filled">
              {zoomStatus.label}
            </Badge>
          </Group>

          {/* Key Metrics */}
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <MetricCard
              title="Resolution"
              value={`${metrics.pixelsPerCm}`}
              unit="px/cm"
              color="green"
            />
            <MetricCard
              title="Zoom Level"
              value={`${metrics.zoomLevel}%`}
              color={zoomStatus.color}
            />
            <MetricCard
              title="Device Pixel Ratio"
              value={metrics.devicePixelRatio}
              unit="x"
              color="blue"
            />
          </div>

          {/* Display Metrics Section */}
          <div>
            <Group gap="xs" mb="md">
              <Monitor size={18} />
              <Text size="lg" fw={500}>
                Display Metrics
              </Text>
            </Group>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "16px",
              }}
            >
              <MetricCard
                title="Physical DPI"
                value={metrics.physicalDPI}
                unit="DPI"
                color={dpiQuality.color}
              />
              <MetricCard
                title="Logical DPI"
                value={metrics.logicalDPI}
                unit="DPI"
                color="cyan"
              />
              <MetricCard
                title="Screen Resolution"
                value={`${metrics.screenWidth}×${metrics.screenHeight}`}
                unit="px"
                color="grape"
              />
              <MetricCard
                title="Viewport Size"
                value={`${metrics.viewportWidth}×${metrics.viewportHeight}`}
                unit="px"
                color="indigo"
              />
            </div>
          </div>

          {/* Measurement Units Section */}
          <div>
            <Group gap="xs" mb="md">
              <Ruler size={18} />
              <Text size="lg" fw={500}>
                Measurement Units
              </Text>
            </Group>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              <MetricCard
                title="Pixels per CM"
                value={metrics.pixelsPerCm}
                unit="px/cm"
                color="green"
              />
              <MetricCard
                title="Pixels per Inch"
                value={metrics.pixelsPerInch}
                unit="px/in"
                color="orange"
              />
            </div>
          </div>

          {/* Additional Info */}
          <Card withBorder p="md">
            <Group gap="md" wrap="wrap">
              <Badge
                color={metrics.devicePixelRatio >= 2 ? "green" : "yellow"}
                size="md"
                variant="filled"
              >
                {metrics.devicePixelRatio >= 2
                  ? "Retina Display"
                  : "Standard Display"}
              </Badge>
              <Badge color="blue" size="md" variant="light">
                {metrics.screenWidth >= 1920 ? "HD+" : "Standard"} Resolution
              </Badge>
            </Group>
          </Card>
        </Stack>
      </Modal>
    </>
  );
};

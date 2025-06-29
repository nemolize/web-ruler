"use client";

import {
  Alert,
  Badge,
  Card,
  Divider,
  Grid,
  Group,
  Paper,
  Progress,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { Info, Monitor, Ruler } from "lucide-react";
import { useEffect, useState } from "react";

interface DisplayMetrics {
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
}

const useDisplayMetrics = (): DisplayMetrics | null => {
  const [metrics, setMetrics] = useState<DisplayMetrics | null>(null);

  useEffect(() => {
    const calculateMetrics = () => {
      const devicePixelRatio = window.devicePixelRatio || 1;
      const screenWidth = window.screen.width;
      const screenHeight = window.screen.height;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Create a temporary element to measure DPI
      const testElement = document.createElement("div");
      testElement.style.width = "1in";
      testElement.style.height = "1in";
      testElement.style.position = "absolute";
      testElement.style.left = "-100%";
      testElement.style.top = "-100%";
      testElement.style.visibility = "hidden";
      document.body.appendChild(testElement);

      const pixelsPerInch = testElement.offsetWidth;
      const pixelsPerCm = pixelsPerInch / 2.54;

      document.body.removeChild(testElement);

      // Calculate logical and physical DPI
      const logicalDPI = pixelsPerInch;
      const physicalDPI = logicalDPI * devicePixelRatio;

      // Estimate zoom level (this is approximate)
      const zoomLevel = (window.outerWidth / window.innerWidth) * 100;

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
      };
    };

    const updateMetrics = () => {
      setMetrics(calculateMetrics());
    };

    updateMetrics();

    window.addEventListener("resize", updateMetrics);
    window.addEventListener("orientationchange", updateMetrics);

    return () => {
      window.removeEventListener("resize", updateMetrics);
      window.removeEventListener("orientationchange", updateMetrics);
    };
  }, []);

  return metrics;
};

const MetricCard = ({
  title,
  value,
  unit,
  color,
  icon,
}: {
  title: string;
  value: string | number;
  unit?: string;
  color?: string;
  icon?: React.ReactNode;
}) => (
  <Paper p="md" withBorder>
    <Group mb="xs">
      {icon}
      <Text size="sm" fw={500} c="dimmed">
        {title}
      </Text>
    </Group>
    <Group>
      <Text size="xl" fw={700} c={color}>
        {value}
      </Text>
      {unit && (
        <Badge variant="light" color={color} size="sm">
          {unit}
        </Badge>
      )}
    </Group>
  </Paper>
);

export const DisplayScalingInfo = () => {
  const metrics = useDisplayMetrics();

  if (!metrics) {
    return (
      <Paper p="xl" withBorder>
        <Progress value={100} animated />
        <Text ta="center" mt="md">
          Calculating display metrics...
        </Text>
      </Paper>
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
    <Stack gap="xl">
      <Alert
        icon={<Info size="1rem" />}
        title="Display Information"
        color="blue"
      >
        Real-time display scaling and DPI information for accurate measurements
      </Alert>

      <div>
        <Title order={2} mb="md">
          <Group>
            <Monitor size="1.5rem" />
            Display Metrics
          </Group>
        </Title>

        <Grid>
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <MetricCard
              title="Device Pixel Ratio"
              value={metrics.devicePixelRatio}
              unit="x"
              color="blue"
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <MetricCard
              title="Physical DPI"
              value={metrics.physicalDPI}
              unit="DPI"
              color={dpiQuality.color}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <MetricCard
              title="Logical DPI"
              value={metrics.logicalDPI}
              unit="DPI"
              color="cyan"
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <MetricCard
              title="Browser Zoom"
              value={`${metrics.zoomLevel}%`}
              color={zoomStatus.color}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <MetricCard
              title="Screen Resolution"
              value={`${metrics.screenWidth} × ${metrics.screenHeight}`}
              unit="px"
              color="grape"
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <MetricCard
              title="Viewport Size"
              value={`${metrics.viewportWidth} × ${metrics.viewportHeight}`}
              unit="px"
              color="indigo"
            />
          </Grid.Col>
        </Grid>
      </div>

      <Divider />

      <div>
        <Title order={2} mb="md">
          <Group>
            <Ruler size="1.5rem" />
            Measurement Units
          </Group>
        </Title>

        <Grid>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <MetricCard
              title="Pixels per Centimeter"
              value={metrics.pixelsPerCm}
              unit="px/cm"
              color="green"
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6 }}>
            <MetricCard
              title="Pixels per Inch"
              value={metrics.pixelsPerInch}
              unit="px/in"
              color="orange"
            />
          </Grid.Col>
        </Grid>
      </div>

      <Card withBorder p="lg">
        <Title order={3} mb="md">
          Status Summary
        </Title>
        <Group>
          <Badge color={dpiQuality.color} size="lg" variant="filled">
            DPI Quality: {dpiQuality.label}
          </Badge>
          <Badge color={zoomStatus.color} size="lg" variant="filled">
            Zoom: {zoomStatus.label}
          </Badge>
          <Badge
            color={metrics.devicePixelRatio >= 2 ? "green" : "yellow"}
            size="lg"
            variant="filled"
          >
            {metrics.devicePixelRatio >= 2
              ? "Retina Display"
              : "Standard Display"}
          </Badge>
        </Group>
      </Card>
    </Stack>
  );
};

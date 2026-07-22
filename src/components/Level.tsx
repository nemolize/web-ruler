"use client";

import {
  Badge,
  Button,
  Card,
  Group,
  Modal,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import { Activity } from "lucide-react";
import { useEffect, useState } from "react";

interface OrientationData {
  beta: number; // front-back tilt in degrees (-180 to 180)
  gamma: number; // left-right tilt in degrees (-90 to 90)
}

const MAX_BUBBLE_TRAVEL = 45;

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const toRadians = (angle: number) => (angle * Math.PI) / 180;
const toDegrees = (angle: number) => (angle * 180) / Math.PI;
const stabilizeAngle = (angle: number) =>
  Math.round(angle * 10_000_000_000) / 10_000_000_000;

const getSurfaceTilt = ({ beta, gamma }: OrientationData) => {
  const betaRadians = toRadians(beta);
  const gammaRadians = toRadians(gamma);

  return {
    frontBack: stabilizeAngle(toDegrees(Math.asin(Math.sin(betaRadians)))),
    leftRight: stabilizeAngle(
      toDegrees(Math.asin(Math.cos(betaRadians) * Math.sin(gammaRadians))),
    ),
  };
};

export const Level = () => {
  const [orientation, setOrientation] = useState<OrientationData>({
    beta: 0,
    gamma: 0,
  });
  const [showLevel, setShowLevel] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    // Check if DeviceOrientationEvent is supported
    if (!window.DeviceOrientationEvent) {
      setIsSupported(false);
      return;
    }

    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.beta !== null && event.gamma !== null) {
        setOrientation({
          beta: event.beta,
          gamma: event.gamma,
        });
      }
    };

    let cancelled = false;

    const requestPermission = async () => {
      // For iOS 13+ we need to request permission
      if (
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof (
          DeviceOrientationEvent as unknown as {
            requestPermission: () => Promise<string>;
          }
        ).requestPermission === "function"
      ) {
        try {
          const response = await (
            DeviceOrientationEvent as unknown as {
              requestPermission: () => Promise<string>;
            }
          ).requestPermission();
          if (response === "granted" && !cancelled) {
            setHasPermission(true);
            window.addEventListener("deviceorientation", handleOrientation);
          }
        } catch (error) {
          console.error(
            "Error requesting device orientation permission:",
            error,
          );
        }
      } else {
        // Non-iOS devices don't need permission
        setHasPermission(true);
        window.addEventListener("deviceorientation", handleOrientation);
      }
    };

    if (showLevel) {
      requestPermission();
    }

    return () => {
      cancelled = true;
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, [showLevel]);

  const getLevelStatus = (angle: number, threshold = 2) => {
    const absAngle = Math.abs(angle);
    if (absAngle <= threshold) {
      return { status: "level", color: "green" };
    } else if (absAngle <= threshold * 2) {
      return { status: "nearly level", color: "yellow" };
    } else {
      return { status: "not level", color: "red" };
    }
  };

  const surfaceTilt = getSurfaceTilt(orientation);
  const leftRightStatus = getLevelStatus(surfaceTilt.leftRight);
  const frontBackStatus = getLevelStatus(surfaceTilt.frontBack);

  const bubbleX = clamp(
    surfaceTilt.leftRight,
    -MAX_BUBBLE_TRAVEL,
    MAX_BUBBLE_TRAVEL,
  );
  const bubbleY = clamp(
    surfaceTilt.frontBack,
    -MAX_BUBBLE_TRAVEL,
    MAX_BUBBLE_TRAVEL,
  );
  return (
    <>
      {/* Floating Level Button */}
      <div className="fixed top-8 left-36">
        <Button
          variant="filled"
          size="sm"
          leftSection={<Activity size={16} />}
          onClick={() => setShowLevel(true)}
          disabled={!isSupported}
        >
          {isSupported ? "Level" : "Level (Not Supported)"}
        </Button>
      </div>

      {/* Level Modal */}
      <Modal
        opened={showLevel}
        onClose={() => setShowLevel(false)}
        title={
          <Group gap="xs">
            <Activity size={20} />
            <Text fw={600}>Digital Level</Text>
          </Group>
        }
        size="lg"
      >
        <Stack gap="lg">
          {!hasPermission && isSupported && (
            <Card withBorder p="md" bg="yellow.1">
              <Text size="sm" c="yellow.9">
                Device orientation permission is required to use the level
                feature. Please allow access when prompted.
              </Text>
            </Card>
          )}

          {/* Status Badges */}
          <SimpleGrid cols={{ base: 1, xs: 2 }} spacing="md">
            <Badge
              color={leftRightStatus.color}
              size="lg"
              variant="filled"
              fullWidth
            >
              Left/Right: {leftRightStatus.status}
            </Badge>
            <Badge
              color={frontBackStatus.color}
              size="lg"
              variant="filled"
              fullWidth
            >
              Front/Back: {frontBackStatus.status}
            </Badge>
          </SimpleGrid>

          {/* 2D Bubble Level */}
          <Card withBorder p="lg">
            <Text size="sm" fw={500} mb="md" ta="center">
              2D Bubble Level
            </Text>
            <div
              data-testid="level-instrument"
              className="relative mx-auto size-48"
            >
              <div
                data-testid="level-platform"
                className="absolute inset-0 overflow-hidden rounded-full border-4 border-slate-400 bg-sky-50 shadow-inner"
                style={{
                  boxShadow:
                    "inset 0 6px 14px rgba(15, 23, 42, 0.12), 0 4px 10px rgba(15, 23, 42, 0.12)",
                }}
              >
                <svg
                  aria-hidden="true"
                  data-testid="level-grid"
                  className="absolute inset-0 h-full w-full opacity-70"
                >
                  <line
                    x1="50%"
                    y1="6%"
                    x2="50%"
                    y2="94%"
                    stroke="#64748b"
                    strokeWidth="1.5"
                  />
                  <line
                    x1="6%"
                    y1="50%"
                    x2="94%"
                    y2="50%"
                    stroke="#64748b"
                    strokeWidth="1.5"
                  />
                  <circle
                    cx="50%"
                    cy="50%"
                    r="18"
                    fill="none"
                    stroke="#16a34a"
                    strokeWidth="2.5"
                  />
                </svg>
                <div
                  data-testid="level-bubble"
                  data-offset-x={bubbleX}
                  data-offset-y={bubbleY}
                  className="absolute top-1/2 left-1/2 size-6 rounded-full border border-sky-200/90 transition-transform duration-150 ease-out motion-reduce:transition-none"
                  style={{
                    background:
                      "radial-gradient(circle at 32% 26%, white 0%, #bae6fd 18%, #38bdf8 48%, #0369a1 100%)",
                    boxShadow:
                      "0 4px 8px rgba(15, 23, 42, 0.3), inset -3px -5px 7px rgba(3, 105, 161, 0.42)",
                    transform: `translate(calc(-50% - ${bubbleX}px), calc(-50% - ${bubbleY}px))`,
                  }}
                >
                  <span className="absolute top-1 left-1 size-1.5 rounded-full bg-white/90" />
                </div>
              </div>
            </div>
          </Card>

          {/* Angle Readings */}
          <div className="grid grid-cols-2 gap-4">
            <Card withBorder p="md">
              <Text size="xs" c="dimmed">
                Left/Right Tilt
              </Text>
              <Text size="xl" fw={700} c={leftRightStatus.color}>
                {surfaceTilt.leftRight.toFixed(1)}°
              </Text>
            </Card>
            <Card withBorder p="md">
              <Text size="xs" c="dimmed">
                Front/Back Tilt
              </Text>
              <Text size="xl" fw={700} c={frontBackStatus.color}>
                {surfaceTilt.frontBack.toFixed(1)}°
              </Text>
            </Card>
          </div>

          {/* Instructions */}
          <Card withBorder p="md" bg="blue.0">
            <Text size="sm" c="blue.9">
              Place your device on the surface you want to check. The bubble
              should be centered in the green circle when the surface is level.
            </Text>
          </Card>
        </Stack>
      </Modal>
    </>
  );
};

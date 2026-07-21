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

  const horizontalStatus = getLevelStatus(orientation.gamma);
  const verticalStatus = getLevelStatus(orientation.beta);

  const bubbleX = clamp(
    orientation.gamma,
    -MAX_BUBBLE_TRAVEL,
    MAX_BUBBLE_TRAVEL,
  );
  const bubbleY = clamp(
    orientation.beta,
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
              color={horizontalStatus.color}
              size="lg"
              variant="filled"
              fullWidth
            >
              Horizontal: {horizontalStatus.status}
            </Badge>
            <Badge
              color={verticalStatus.color}
              size="lg"
              variant="filled"
              fullWidth
            >
              Vertical: {verticalStatus.status}
            </Badge>
          </SimpleGrid>

          {/* 3D Bubble Level */}
          <Card withBorder p="lg">
            <Text size="sm" fw={500} mb="md" ta="center">
              3D Bubble Level
            </Text>
            <div
              className="relative mx-auto h-56 w-56"
              style={{ perspective: "560px" }}
            >
              <div
                aria-hidden="true"
                data-testid="level-shadow"
                className="absolute right-5 bottom-1 left-5 h-12 rounded-[50%] bg-slate-950/25 blur-md"
              />
              <div
                data-testid="level-platform"
                className="absolute inset-4 rounded-full border-8 border-slate-500 bg-slate-700 shadow-2xl"
                style={{
                  transformStyle: "preserve-3d",
                }}
              >
                <div
                  data-testid="level-vessel"
                  className="absolute inset-1 rounded-full border-2 border-white/70 shadow-inner"
                  style={{
                    background:
                      "radial-gradient(circle at 38% 30%, rgba(255,255,255,0.95) 0%, rgba(219,234,254,0.82) 24%, rgba(147,197,253,0.55) 68%, rgba(30,64,175,0.72) 100%)",
                    transform: "translateZ(5px)",
                    transformStyle: "preserve-3d",
                  }}
                >
                  <div
                    data-testid="level-target"
                    className="absolute inset-[18%] rounded-full border-2 border-emerald-500/80 bg-emerald-100/10 shadow-[0_0_12px_rgba(34,197,94,0.25)]"
                  />
                  <svg
                    aria-hidden="true"
                    data-testid="level-grid"
                    className="absolute inset-0 h-full w-full opacity-70"
                  >
                    <line
                      x1="50%"
                      y1="8%"
                      x2="50%"
                      y2="92%"
                      stroke="#475569"
                      strokeWidth="1.5"
                    />
                    <line
                      x1="8%"
                      y1="50%"
                      x2="92%"
                      y2="50%"
                      stroke="#475569"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx="50%"
                      cy="50%"
                      r="12"
                      fill="none"
                      stroke="#16a34a"
                      strokeWidth="2.5"
                    />
                  </svg>
                  <div
                    data-testid="level-bubble"
                    className="absolute top-1/2 left-1/2 size-6 rounded-full border border-sky-200/90 transition-transform duration-150 ease-out motion-reduce:transition-none"
                    style={{
                      background:
                        "radial-gradient(circle at 32% 26%, white 0%, #bae6fd 18%, #38bdf8 48%, #0369a1 100%)",
                      boxShadow:
                        "0 8px 12px rgba(15, 23, 42, 0.32), inset -3px -5px 7px rgba(3, 105, 161, 0.42)",
                      transform: `translate3d(calc(-50% - ${bubbleX}px), calc(-50% - ${bubbleY}px), 18px)`,
                    }}
                  >
                    <span className="absolute top-1 left-1 size-1.5 rounded-full bg-white/90" />
                  </div>
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
              <Text size="xl" fw={700} c={horizontalStatus.color}>
                {orientation.gamma.toFixed(1)}°
              </Text>
            </Card>
            <Card withBorder p="md">
              <Text size="xs" c="dimmed">
                Front/Back Tilt
              </Text>
              <Text size="xl" fw={700} c={verticalStatus.color}>
                {orientation.beta.toFixed(1)}°
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

"use client";

import { Badge, Button, Card, Group, Modal, Stack, Text } from "@mantine/core";
import { Activity } from "lucide-react";
import { useEffect, useState } from "react";

interface OrientationData {
  beta: number; // front-back tilt in degrees (-180 to 180)
  gamma: number; // left-right tilt in degrees (-90 to 90)
}

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
          if (response === "granted") {
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

  // Calculate bubble positions
  const bubbleX = Math.max(-45, Math.min(45, orientation.gamma)); // Clamp to -45 to 45
  const bubbleY = Math.max(-45, Math.min(45, orientation.beta)); // Clamp to -45 to 45

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
          <Group gap="md">
            <Badge color={horizontalStatus.color} size="lg" variant="filled">
              Horizontal: {horizontalStatus.status}
            </Badge>
            <Badge color={verticalStatus.color} size="lg" variant="filled">
              Vertical: {verticalStatus.status}
            </Badge>
          </Group>

          {/* 2D Bubble Level */}
          <Card withBorder p="lg">
            <Text size="sm" fw={500} mb="md" ta="center">
              2D Bubble Level
            </Text>
            <div className="relative mx-auto h-48 w-48">
              {/* Outer circle */}
              <div className="absolute inset-0 rounded-full border-4 border-gray-300 bg-gray-100">
                {/* Center crosshair */}
                <svg className="absolute inset-0 h-full w-full">
                  <line
                    x1="50%"
                    y1="0"
                    x2="50%"
                    y2="100%"
                    stroke="#9ca3af"
                    strokeWidth="2"
                  />
                  <line
                    x1="0"
                    y1="50%"
                    x2="100%"
                    y2="50%"
                    stroke="#9ca3af"
                    strokeWidth="2"
                  />
                  {/* Center target circle */}
                  <circle
                    cx="50%"
                    cy="50%"
                    r="10"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="3"
                  />
                </svg>
                {/* Bubble */}
                <div
                  className="absolute size-4 rounded-full bg-blue-500 shadow-lg"
                  style={{
                    left: `calc(50% - ${bubbleX}px - 8px)`,
                    top: `calc(50% - ${bubbleY}px - 8px)`,
                  }}
                />
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

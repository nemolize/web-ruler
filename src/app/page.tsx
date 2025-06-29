"use client";

import { Container, Title } from "@mantine/core";
import { DisplayScalingInfo } from "@/components/DisplayScalingInfo";

export default function Home() {
  return (
    <Container size="md" py="xl">
      <Title order={1} mb="xl" ta="center">
        Display Scaling & Measurement Tool
      </Title>
      <DisplayScalingInfo />
    </Container>
  );
}

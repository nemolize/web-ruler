"use client";

import { FloatingDisplayInfo } from "@/components/FloatingDisplayInfo";
import { Level } from "@/components/Level";
import { RulerGrid } from "@/components/RulerGrid";
import { useDisplayMetrics } from "@/hooks/useDisplayMetrics";

export default function Home() {
  const metrics = useDisplayMetrics();

  return (
    <>
      <RulerGrid metrics={metrics} />
      <FloatingDisplayInfo metrics={metrics} />
      <Level />
    </>
  );
}

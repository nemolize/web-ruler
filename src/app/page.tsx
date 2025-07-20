"use client";

import { FloatingDisplayInfo } from "@/components/FloatingDisplayInfo";
import { Level } from "@/components/Level";
import { RulerGrid } from "@/components/RulerGrid";

export default function Home() {
  return (
    <>
      <RulerGrid />
      <FloatingDisplayInfo />
      <Level />
    </>
  );
}

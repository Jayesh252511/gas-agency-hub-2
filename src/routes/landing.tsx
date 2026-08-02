import { createFileRoute } from "@tanstack/react-router";
import LenisProvider from "@/components/showcase/LenisProvider";
import ThreeCanvas from "@/components/showcase/ThreeCanvas";
import ScrollOrchestrator from "@/components/showcase/ScrollOrchestrator";
import CursorDot from "@/components/showcase/CursorDot";
import ProgressDots from "@/components/showcase/ProgressDots";
import NavBar from "@/components/showcase/NavBar";
import S1_Birth from "@/components/showcase/sections/S1_Birth";
import S2_Reveal from "@/components/showcase/sections/S2_Reveal";
import S3_Awakens from "@/components/showcase/sections/S3_Awakens";
import S4_OS from "@/components/showcase/sections/S4_OS";
import S5_Flow from "@/components/showcase/sections/S5_Flow";
import S6_Warehouse from "@/components/showcase/sections/S6_Warehouse";
import S7_Analytics from "@/components/showcase/sections/S7_Analytics";
import S8_Devices from "@/components/showcase/sections/S8_Devices";
import S9_Transform from "@/components/showcase/sections/S9_Transform";

export const Route = createFileRoute("/landing")({ component: LandingPage });

function LandingPage() {
  return (
    <LenisProvider>
      {/* Pure Three.js 3D Canvas (React 19 compatible) */}
      <ThreeCanvas />

      {/* GSAP Scroll Controller */}
      <ScrollOrchestrator />

      {/* Custom industrial cursor */}
      <CursorDot />

      {/* Progress indicators */}
      <ProgressDots />

      {/* Navigation */}
      <NavBar />

      {/* 9 Scroll Sections */}
      <main style={{ position: "relative", zIndex: 10, pointerEvents: "none" }}>
        <S1_Birth />
        <S2_Reveal />
        <S3_Awakens />
        <S4_OS />
        <S5_Flow />
        <S6_Warehouse />
        <S7_Analytics />
        <S8_Devices />
        <S9_Transform />
      </main>
    </LenisProvider>
  );
}

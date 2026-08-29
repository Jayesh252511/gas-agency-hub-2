import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { Marquee } from "@/components/site/Marquee";
import { OldWay } from "@/components/site/OldWay";
import { AssemblyLine } from "@/components/site/AssemblyLine";
import { Workbench } from "@/components/site/Workbench";
import { Showcase } from "@/components/site/Showcase";
import { VideoDemo } from "@/components/site/VideoDemo";
import { Pipeline } from "@/components/site/Pipeline";
import { HowItWorksStacked } from "@/components/site/HowItWorksStacked";
import { CtaFooter } from "@/components/site/CtaFooter";
import { EmberCursor } from "@/components/site/EmberCursor";
import { SectionPill } from "@/components/site/SectionPill";
import { WhatsAppFAB } from "@/components/site/WhatsAppFAB";

export const Route = createFileRoute("/landing")({ component: LandingPage });

export default function LandingPage() {
  return (
    <>
      {/* SEO */}
      <title>GasAgency Hub — Smart LPG Agency ERP for India</title>
      <meta
        name="description"
        content="Manage bookings, customers, payments, stock, udhari, and reports from one powerful LPG agency ERP platform. Designed for India. Built for growth."
      />

      {/* ── Fixed HUDs ── */}
      <EmberCursor />
      <Pipeline />
      <SectionPill />
      <WhatsAppFAB />

      {/* ── Page Shell ── */}
      <div className="relative min-h-screen antialiased">
        {/* ACT 0 — Nav with dark/light toggle */}
        <Nav />

        {/* ACT 1 — Hero: Glitch ignition, 3D tilt cards, live numbers */}
        <Hero />

        {/* ACT 2 — Infinite Marquee Ticker */}
        <Marquee />

        {/* ACT 3 — The Old Way: Register Burns */}
        <OldWay />

        {/* ACT 4 — Assembly Line: 9 Modules Bolt On */}
        <AssemblyLine />

        {/* ACT 5 — Interactive App Workbench */}
        <Workbench />

        {/* ACT 6 — Pixel Dark Showcase */}
        <Showcase />

        {/* ACT 7 — Scroll-Driven Video Demo */}
        <VideoDemo />

        {/* ACT 8 — How It Works: Stacking Cards */}
        <HowItWorksStacked />

        {/* ACT 9 + 10 — CTA City + Footer */}
        <CtaFooter />
      </div>
    </>
  );
}

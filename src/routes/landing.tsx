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

export const Route = createFileRoute("/landing")({ component: LandingPage });

export default function LandingPage() {
  return (
    <>
      {/* ── Meta / SEO ── */}
      <title>GasAgency Hub — Smart LPG Agency ERP for India</title>

      {/* ── Page Shell ── */}
      <div className="relative min-h-screen antialiased">
        {/* Fixed HUD: scroll progress pipeline */}
        <Pipeline />

        {/* ACT 0 — Sticky Navigation */}
        <Nav />

        {/* ACT 1 — Hero: The Ignition (light --paper) */}
        <Hero />

        {/* ACT 2 — Infinite Marquee Ticker (--ink band) */}
        <Marquee />

        {/* ACT 3 — The Old Way: Register Burns (--ink band, 320vh) */}
        <OldWay />

        {/* ACT 4 — Assembly Line: 9 Modules Bolt On (--paper-2, 420vh horizontal) */}
        <AssemblyLine />

        {/* ACT 5 — Interactive App Workbench (--ink-2 band) */}
        <Workbench />

        {/* ACT 6 — Pixel Dark Showcase with Odometers (--ink band) */}
        <Showcase />

        {/* ACT 7 — Scroll-Driven Video Demo (--ink-2 band) */}
        <VideoDemo />

        {/* ACT 8 — How It Works: Stacking Cards (--paper band) */}
        <HowItWorksStacked />

        {/* ACT 9 + 10 — Final CTA City Lights Up + Footer (--ink) */}
        <CtaFooter />
      </div>
    </>
  );
}

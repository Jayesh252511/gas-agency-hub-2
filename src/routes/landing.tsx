import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { Marquee } from "@/components/site/Marquee";
import { OldWay } from "@/components/site/OldWay";
import { AssemblyLine } from "@/components/site/AssemblyLine";
import { Workbench } from "@/components/site/Workbench";
import { Showcase } from "@/components/site/Showcase";
import { VideoDemo } from "@/components/site/VideoDemo";
import { HowItWorks } from "@/components/site/HowItWorks";
import { Pipeline } from "@/components/site/Pipeline";
import { WHATSAPP_TRIAL } from "@/lib/gas";

export const Route = createFileRoute("/landing")({ component: LandingPage });

export default function LandingPage() {
  useEffect(() => {
    document.body.classList.add("lp-body");
    document.body.style.backgroundColor = "#FAFAFA";
    document.body.style.color = "#111111";
    document.documentElement.style.backgroundColor = "#FAFAFA";
    return () => {
      document.body.classList.remove("lp-body");
      document.body.style.backgroundColor = "";
      document.body.style.color = "";
      document.documentElement.style.backgroundColor = "";
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      {/* Fixed HUD Scroll Pipeline */}
      <Pipeline />

      {/* Navigation */}
      <Nav />

      {/* Hero Ignition */}
      <Hero />

      {/* Marquee Ticker */}
      <Marquee />

      {/* 01 // The Old Way: Paper Register to Ashes (320vh Scroll Transformation) */}
      <OldWay />

      {/* 02 // The Assembly Line: 9 Hardware Modules (420vh Horizontal Scroll) */}
      <AssemblyLine />

      {/* 03 // Interactive Workbench: Live Module Testing Station */}
      <Workbench />

      {/* 04 // Dark Pixel Art Feature Showcase */}
      <Showcase />

      {/* 05 // Live Product Video Demo */}
      <VideoDemo />

      {/* 06 // How It Works: 4-Step Process */}
      <HowItWorks />

      {/* 07 // Final CTA Banner */}
      <section id="start" className="relative overflow-hidden bg-background py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <span className="font-pixel text-[10px] tracking-tight text-primary">
            03 // IGNITE YOUR AGENCY
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            READY TO TRANSFORM YOUR<br />
            <span className="text-primary">GAS AGENCY?</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
            Start your free trial today. No credit card required. No setup fees. Just your agency, running smarter.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3 font-mono text-[11px] text-muted-foreground">
            {["No Credit Card", "Works Offline", "Any Device", "Made in India"].map((t) => (
              <span key={t} className="rounded-md border border-hairline bg-card px-3 py-1.5">
                ● {t}
              </span>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a
              href={WHATSAPP_TRIAL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-4 font-display text-sm font-bold uppercase tracking-wide text-primary-foreground shadow-glow transition-transform duration-200 hover:-translate-y-0.5"
            >
              Start Free Trial →
            </a>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-lg border border-foreground/15 px-8 py-4 font-display text-sm font-bold uppercase tracking-wide transition-colors hover:bg-secondary"
            >
              Agency Login
            </Link>
          </div>
        </div>
      </section>

      {/* Footer with Pixel Cityscape & Delivery Truck */}
      <footer className="relative border-t border-hairline bg-card">
        {/* Pixel Art Cityscape Banner */}
        <div className="relative h-32 w-full overflow-hidden border-b border-hairline bg-gradient-to-b from-amber-500/5 to-amber-500/10">
          <img
            src="/pixel-cityscape.png"
            alt="Pixel Art Cityscape"
            className="absolute bottom-0 left-0 h-full w-full object-cover object-bottom pixelated opacity-90"
          />
          <img
            src="/pixel-truck.png"
            alt="Pixel Delivery Truck"
            className="absolute bottom-2 z-10 h-12 w-auto animate-marquee-left pixelated"
          />
        </div>

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-14">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 font-pixel text-sm font-bold text-foreground">
                <span className="grid h-7 w-7 place-items-center rounded-md bg-primary text-primary-foreground">
                  🔥
                </span>
                GasAgency Hub
              </div>
              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                India's trusted LPG gas agency management platform. Engineered for speed, reliability, and growth.
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 rounded border border-primary/30 bg-primary/10 px-2.5 py-1 font-pixel text-[8px] uppercase tracking-wider text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                LIVE SYS.ACTIVE
              </span>
            </div>

            <div>
              <h4 className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                PRODUCT
              </h4>
              <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
                <li><a href="#assembly" className="hover:text-primary">Nine Modules</a></li>
                <li><a href="#workbench" className="hover:text-primary">Live Workbench</a></li>
                <li><a href="#showcase" className="hover:text-primary">Pixel Showcase</a></li>
                <li><a href="#how" className="hover:text-primary">How It Works</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                SUPPORT
              </h4>
              <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
                <li><a href={WHATSAPP_TRIAL} target="_blank" rel="noopener noreferrer" className="hover:text-primary">Contact Us</a></li>
                <li><a href="mailto:jayeshneo07@gmail.com" className="hover:text-primary">Email Support</a></li>
                <li><a href="#workbench" className="hover:text-primary">Interactive Demo</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                MADE IN INDIA
              </h4>
              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                Designed &amp; built for Indian LPG distributors (Indane, Bharatgas, HP Gas).
              </p>
              <img
                src="/pixel-india.png"
                alt="Made in India Pixel Badge"
                className="mt-4 h-10 w-auto object-contain pixelated"
              />
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-hairline pt-8 font-mono text-[11px] text-muted-foreground sm:flex-row">
            <div>© {new Date().getFullYear()} GasAgency Hub. All rights reserved.</div>
            <div className="flex gap-6">
              <Link to="/login" className="hover:text-foreground">Agency Login</Link>
              <a href={WHATSAPP_TRIAL} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Start Free Trial
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

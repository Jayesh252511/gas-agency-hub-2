import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { DashboardMock } from "./DashboardMock";

export function VideoDemo() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 70, damping: 24, mass: 0.4 });
  const scale = useTransform(p, [0, 0.6], [0.62, 1]);
  const radius = useTransform(p, [0, 0.6], [28, 12]);

  return (
    <section
      id="demo"
      ref={ref}
      className="relative h-[240vh] scroll-mt-24 bg-surface-2 md:h-[280vh]"
    >
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden px-4">
        <div className="mb-6 text-center">
          <span className="font-pixel text-[10px] tracking-tight text-primary">
            ▶ // PRODUCT DEMO
          </span>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-tight sm:text-4xl">
            See GasAgency Hub In Action.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-xs leading-relaxed text-muted-foreground sm:text-sm">
            Watch how your agency operations transform — from billing and udhari tracking to
            delivery management and reports. All in one dashboard, built for India.
          </p>
        </div>

        <motion.div
          style={reduced ? undefined : { scale, borderRadius: radius }}
          className="w-full max-w-5xl overflow-hidden border border-hairline bg-charcoal shadow-panel"
        >
          <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
            <span className="h-2.5 w-2.5 rounded-full bg-danger" />
            <span className="h-2.5 w-2.5 rounded-full bg-warn" />
            <span className="h-2.5 w-2.5 rounded-full bg-success" />
            <span className="ml-2 rounded bg-white/5 px-2 py-1 font-mono text-[10px] text-secondary/60">
              gasagency.app/dashboard
            </span>
          </div>
          <div className="aspect-[16/10]">
            <DashboardMock />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

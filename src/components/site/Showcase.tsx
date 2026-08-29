import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { DashboardMock } from "./DashboardMock";

function Odometer({ value, suffix, prefix }: { value: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / 1400);
      setV(value * (1 - Math.pow(1 - k, 3)));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);
  return (
    <span ref={ref} className="font-mono text-4xl font-bold text-primary sm:text-5xl">
      {prefix}
      {Number.isInteger(value) ? Math.round(v) : v.toFixed(1)}
      {suffix}
    </span>
  );
}

export function Showcase() {
  return (
    <section
      id="showcase"
      className="relative overflow-hidden border-y-4 border-primary/70 bg-charcoal px-4 py-20 sm:px-6 lg:px-14"
    >
      <div className="pointer-events-none absolute inset-0 scanline-overlay opacity-30" />
      <div className="relative mx-auto max-w-7xl">
        <span className="font-pixel text-[10px] tracking-tight text-primary">
          ▶ POWERFUL FEATURES
        </span>
        <h2 className="mt-3 max-w-3xl font-display text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
          ALL THE TOOLS YOU NEED, ONE POWERFUL PLATFORM
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-gray-300">
          Designed pixel-perfect for India's LPG distributors. Web, Mobile &amp; Tablet — all
          synced in real time. Works offline. Start your agency running same day.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {[
            { v: 500, suffix: "+", label: "Agencies Onboarded" },
            { v: 99.9, suffix: "%", label: "System Uptime" },
            { v: 0, prefix: "₹", label: "Upfront Setup Fee" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, type: "spring", stiffness: 90, damping: 18 }}
              className="rounded-2xl border border-white/15 bg-charcoal-soft p-6"
            >
              <Odometer value={s.v} suffix={s.suffix} prefix={s.prefix} />
              <p className="mt-2 font-mono text-[11px] uppercase tracking-widest text-gray-400">
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ type: "spring", stiffness: 60, damping: 20 }}
          className="relative mt-14 rounded-2xl border border-white/15 bg-charcoal-soft p-2 sm:p-4 shadow-panel overflow-hidden"
        >
          <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
            <span className="h-2.5 w-2.5 rounded-full bg-danger" />
            <span className="h-2.5 w-2.5 rounded-full bg-warn" />
            <span className="h-2.5 w-2.5 rounded-full bg-success" />
            <span className="ml-2 truncate rounded bg-black/40 px-2 py-1 font-mono text-[10px] text-gray-400">
              gasagency.app/dashboard
            </span>
          </div>
          <div className="aspect-[16/9] min-h-[320px]">
            <DashboardMock />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

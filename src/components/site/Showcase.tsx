import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

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
        <h2 className="mt-3 max-w-3xl font-display text-3xl font-bold leading-tight tracking-tight text-secondary sm:text-4xl lg:text-5xl">
          ALL THE TOOLS YOU NEED, ONE POWERFUL PLATFORM
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-secondary/60">
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
              className="rounded-2xl border border-white/10 bg-charcoal-soft p-6"
            >
              <Odometer value={s.v} suffix={s.suffix} prefix={s.prefix} />
              <p className="mt-2 font-mono text-[11px] uppercase tracking-widest text-secondary/50">
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
          className="relative mt-14"
        >
          <div className="absolute inset-x-10 bottom-0 h-24 rounded-full bg-primary/30 blur-3xl animate-breathe" />
          <img
            src="/pixel-dashboard.png"
            alt="Retro pixel art preview of the GasAgency Hub ERP dashboard"
            loading="lazy"
            width={1536}
            height={896}
            className="relative w-full rounded-xl border border-white/10 object-cover pixelated animate-bob"
          />
        </motion.div>
      </div>
    </section>
  );
}

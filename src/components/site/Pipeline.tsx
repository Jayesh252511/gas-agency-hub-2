import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { ACTS, scrollToId } from "@/lib/gas";

export function Pipeline() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });
  const [pct, setPct] = useState(0);

  useEffect(() => progress.on("change", (v) => setPct(v)), [progress]);

  const emberTop = useTransform(progress, (v) => `${v * 100}%`);
  const trailHeight = useTransform(progress, (v) => `${v * 100}%`);

  const activeIndex = Math.min(ACTS.length - 1, Math.floor(pct * ACTS.length + 0.0001));

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-y-0 left-4 z-40 hidden w-8 md:block"
    >
      <div className="relative mx-auto h-full w-px bg-hairline">
        <motion.div
          style={{ height: trailHeight }}
          className="absolute left-0 top-0 w-px bg-gradient-to-b from-transparent via-dim to-primary"
        />
        <motion.div
          style={{ top: emberTop }}
          className="pointer-events-none absolute left-1/2 z-10 -translate-x-1/2"
        >
          <div className="relative -mt-1.5 h-3 w-3 -translate-x-1/2 rounded-full bg-primary shadow-glow animate-ember" />
          <span className="absolute left-3 top-0 -translate-y-1/2 whitespace-nowrap font-pixel text-[8px] tracking-tight text-primary">
            {ACTS[activeIndex]?.label}
          </span>
        </motion.div>

        {ACTS.map((act, i) => (
          <button
            key={act.id}
            type="button"
            onClick={() => scrollToId(act.id)}
            aria-label={`Jump to ${act.label}`}
            style={{ top: `${(i / (ACTS.length - 1)) * 96 + 2}%` }}
            className={`pointer-events-auto absolute left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full border transition-all duration-300 ${
              i <= activeIndex
                ? "border-primary bg-primary shadow-glow"
                : "border-hairline bg-muted"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

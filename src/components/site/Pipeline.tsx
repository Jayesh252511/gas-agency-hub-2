import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";
import { ACTS, scrollToId } from "@/lib/gas";

interface VelocitySpark {
  id: number;
  x: number;
  angle: number;
  life: number;
}

let sparkId = 0;

export function Pipeline() {
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });
  const [pct, setPct] = useState(0);
  const [sparks, setSparks] = useState<VelocitySpark[]>([]);
  const lastY = useRef(0);
  const lastT = useRef(Date.now());

  useEffect(() => progress.on("change", (v) => setPct(v)), [progress]);

  const emberTop = useTransform(progress, (v) => `${v * 100}%`);
  const trailHeight = useTransform(progress, (v) => `${v * 100}%`);
  const activeIndex = Math.min(ACTS.length - 1, Math.floor(pct * ACTS.length + 0.0001));

  // Emit sparks on fast scroll
  useEffect(() => {
    return scrollY.on("change", (y) => {
      const now = Date.now();
      const dt = now - lastT.current;
      const velocity = Math.abs(y - lastY.current) / Math.max(dt, 1);
      lastY.current = y;
      lastT.current = now;

      if (velocity > 1.5) {
        const count = Math.min(Math.floor(velocity / 1.5), 4);
        setSparks((prev) => {
          const next = prev.filter((s) => s.life > 0);
          for (let i = 0; i < count; i++) {
            next.push({
              id: sparkId++,
              x: (Math.random() - 0.5) * 14,
              angle: (Math.random() - 0.5) * 60,
              life: 1,
            });
          }
          return next;
        });
      }
    });
  }, [scrollY]);

  // Decay sparks
  useEffect(() => {
    if (sparks.length === 0) return;
    const id = setInterval(() => {
      setSparks((prev) => {
        const next = prev.map((s) => ({ ...s, life: s.life - 0.07 })).filter((s) => s.life > 0);
        return next;
      });
    }, 30);
    return () => clearInterval(id);
  }, [sparks.length > 0]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-y-0 left-4 z-40 hidden w-8 md:block"
    >
      <div className="relative mx-auto h-full w-px bg-hairline">
        {/* Scroll trail */}
        <motion.div
          style={{ height: trailHeight }}
          className="absolute left-0 top-0 w-px bg-gradient-to-b from-transparent via-dim to-primary"
        />

        {/* Moving ember + velocity sparks */}
        <motion.div
          style={{ top: emberTop }}
          className="pointer-events-none absolute left-1/2 z-10 -translate-x-1/2"
        >
          {/* Sparks that fly out on fast scroll */}
          {sparks.map((s) => (
            <motion.div
              key={s.id}
              className="absolute rounded-full bg-primary"
              initial={{ opacity: s.life, x: 0, y: 0, scale: 1, width: 4, height: 4 }}
              animate={{
                opacity: 0,
                x: s.x,
                y: -20 - Math.random() * 15,
                scale: 0.2,
              }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              style={{ left: -2, top: -2 }}
            />
          ))}

          {/* Core ember dot */}
          <div className="relative -mt-1.5 h-3 w-3 -translate-x-1/2 rounded-full bg-primary shadow-glow animate-ember" />

          {/* Act label */}
          <span className="absolute left-3 top-0 -translate-y-1/2 whitespace-nowrap font-pixel text-[8px] tracking-tight text-primary">
            {ACTS[activeIndex]?.label}
          </span>
        </motion.div>

        {/* Chapter nodes */}
        {ACTS.map((act, i) => (
          <button
            key={act.id}
            type="button"
            onClick={() => scrollToId(act.id)}
            aria-label={`Jump to ${act.label}`}
            style={{ top: `${(i / (ACTS.length - 1)) * 96 + 2}%` }}
            className={`pointer-events-auto absolute left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full border transition-all duration-300 ${
              i <= activeIndex
                ? "border-primary bg-primary shadow-glow scale-110"
                : "border-hairline bg-muted hover:border-primary/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

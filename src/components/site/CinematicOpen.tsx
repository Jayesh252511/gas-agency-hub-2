import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { scrollToId } from "@/lib/gas";

const DAWN_DURATION = 3200; // ms for night → dawn transition

// Twinkling star positions (deterministic for SSR)
const STARS = Array.from({ length: 80 }, (_, i) => ({
  id: i,
  x: ((i * 137.508) % 100),
  y: ((i * 97.131) % 55),
  size: i % 5 === 0 ? 2 : 1,
  delay: (i * 0.13) % 2.5,
}));

export function CinematicOpen() {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<"night" | "dawn" | "done">("night");
  const [starsVisible, setStarsVisible] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const parallaxCity = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.6], [0, 0.7]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  useEffect(() => {
    if (reduced) {
      setPhase("done");
      setStarsVisible(false);
      return;
    }
    // Start night → dawn transition after 1s
    const t1 = setTimeout(() => setPhase("dawn"), 1000);
    // Stars fade mid-transition
    const t2 = setTimeout(() => setStarsVisible(false), 1000 + DAWN_DURATION * 0.5);
    // Done
    const t3 = setTimeout(() => setPhase("done"), 1000 + DAWN_DURATION + 400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [reduced]);

  return (
    <div
      ref={ref}
      id="cinematic"
      className="relative h-[140vh] overflow-hidden"
      aria-label="GasAgency Hub — Indian city transforms from night to dawn as your agency digitises"
    >
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* ─ Sky gradient (night → dawn) ─ */}
        <motion.div
          className="absolute inset-0 z-0"
          animate={{
            background:
              phase === "night"
                ? "linear-gradient(to bottom, #050514 0%, #0D0A2E 35%, #1A0E2E 60%, #2D1810 100%)"
                : phase === "dawn"
                ? "linear-gradient(to bottom, #FF8C00 0%, #FF4500 25%, #FF6B00 45%, #8B2500 70%, #1A0A00 100%)"
                : "linear-gradient(to bottom, #87CEEB 0%, #FFB347 30%, #FF8C00 55%, #FF6B00 70%, #2D1810 100%)",
          }}
          transition={{ duration: DAWN_DURATION / 1000, ease: "easeInOut" }}
        />

        {/* ─ Stars ─ */}
        <AnimatePresence>
          {starsVisible && (
            <motion.div
              className="pointer-events-none absolute inset-0 z-[1]"
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
            >
              {STARS.map((s) => (
                <motion.div
                  key={s.id}
                  className="absolute rounded-full bg-white"
                  style={{
                    left: `${s.x}%`,
                    top: `${s.y}%`,
                    width: s.size,
                    height: s.size,
                  }}
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    delay: s.delay,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─ Night city image (parallax) ─ */}
        <motion.div
          className="absolute inset-0 z-[2]"
          style={{ y: parallaxCity }}
        >
          <AnimatePresence initial={false}>
            {(phase === "night" || phase === "dawn") && (
              <motion.img
                key="night"
                src="/pixel-city-night.png"
                alt=""
                aria-hidden="true"
                className="absolute bottom-0 left-0 w-full object-cover object-bottom pixelated"
                style={{ height: "75%" }}
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: DAWN_DURATION / 1000 * 0.7, ease: "easeInOut" }}
              />
            )}
          </AnimatePresence>
          <motion.img
            key="dawn"
            src="/pixel-city-dawn.png"
            alt=""
            aria-hidden="true"
            className="absolute bottom-0 left-0 w-full object-cover object-bottom pixelated"
            style={{ height: "75%" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === "night" ? 0 : 1 }}
            transition={{ duration: DAWN_DURATION / 1000, ease: "easeInOut" }}
          />
        </motion.div>

        {/* ─ Ground fog / atmosphere ─ */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 z-[3] h-48"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)",
          }}
        />

        {/* ─ Dawn radial glow burst ─ */}
        {!reduced && (
          <motion.div
            className="pointer-events-none absolute inset-0 z-[2]"
            animate={{
              opacity: phase === "dawn" ? [0, 0.6, 0.3] : phase === "done" ? 0.15 : 0,
            }}
            transition={{ duration: DAWN_DURATION / 1000 * 0.6, ease: "easeOut" }}
            style={{
              background:
                "radial-gradient(ellipse 70% 40% at 50% 80%, rgba(255,107,0,0.50) 0%, transparent 70%)",
            }}
          />
        )}

        {/* ─ Scroll-driven dark overlay ─ */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-[8] bg-black"
          style={{ opacity: overlayOpacity }}
        />

        {/* ─ Hero text overlay ─ */}
        <motion.div
          className="absolute inset-0 z-[9] flex flex-col items-center justify-center px-4 text-center"
          style={{ y: textY, opacity: textOpacity }}
        >
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 100, damping: 20 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-black/40 px-4 py-2 font-pixel text-[10px] uppercase tracking-widest text-primary backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-ember" />
              LPG AGENCY MANAGEMENT PLATFORM
            </span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            className="max-w-4xl font-display text-4xl font-bold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, type: "spring", stiffness: 80, damping: 22 }}
          >
            <span className="block">YOUR CITY.</span>
            <span className="block text-primary">YOUR AGENCY.</span>
            <span className="block">YOUR GROWTH.</span>
          </motion.h1>

          {/* Sub-headline appears during dawn */}
          <motion.p
            className="mt-6 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: phase !== "night" ? 1 : 0, y: phase !== "night" ? 0 : 20 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 80, damping: 22 }}
          >
            Every delivery. Every rupee. Every customer.{" "}
            <span className="text-white font-semibold">All in one platform.</span>
          </motion.p>

          {/* CTA row */}
          <motion.div
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: phase === "done" || reduced ? 1 : 0, y: phase === "done" || reduced ? 0 : 24 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 80, damping: 22 }}
          >
            <button
              type="button"
              onClick={() => scrollToId("hero")}
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-lg bg-primary px-8 py-4 font-display text-sm font-bold uppercase tracking-wide text-white shadow-glow transition-transform hover:-translate-y-0.5"
            >
              <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 -left-full w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-700 group-hover:left-full" />
              Explore the Platform ↓
            </button>
          </motion.div>

          {/* Scroll nudge */}
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 2.5 }}
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center gap-2"
            >
              <span className="font-pixel text-[8px] uppercase tracking-widest text-white/50">
                SCROLL TO EXPLORE
              </span>
              <div className="h-8 w-px bg-gradient-to-b from-white/40 to-transparent" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* ─ Scanlines overlay ─ */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[10] opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, rgba(255,255,255,0.8) 0px, rgba(255,255,255,0.8) 1px, transparent 1px, transparent 4px)",
          }}
        />
      </div>
    </div>
  );
}

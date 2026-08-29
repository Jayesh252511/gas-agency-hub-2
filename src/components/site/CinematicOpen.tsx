import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { scrollToId, WHATSAPP } from "@/lib/gas";
import { ArrowRight } from "lucide-react";

const DAWN_DURATION = 3000; // ms

// Deterministic star positions
const STARS = Array.from({ length: 90 }, (_, i) => ({
  id: i,
  x: ((i * 137.508) % 100),
  y: ((i * 97.131) % 52),
  size: i % 6 === 0 ? 2.5 : i % 3 === 0 ? 1.5 : 1,
  delay: (i * 0.13) % 3,
}));

const TRUST = [
  "🛡️ 100% Secure",
  "📱 Works Offline",
  "☁️ Any Device",
  "🇮🇳 Made for India",
  "₹0 Setup Fee",
];

export function CinematicOpen() {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<"night" | "dawn" | "done">("night");
  const [starsVisible, setStarsVisible] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const parallaxCity = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const scrollOverlay = useTransform(scrollYProgress, [0, 0.55], [0, 0.85]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-25%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    if (reduced) { setPhase("done"); setStarsVisible(false); return; }
    const t1 = setTimeout(() => setPhase("dawn"), 800);
    const t2 = setTimeout(() => setStarsVisible(false), 800 + DAWN_DURATION * 0.45);
    const t3 = setTimeout(() => setPhase("done"), 800 + DAWN_DURATION + 200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [reduced]);

  const skyBg =
    phase === "night"
      ? "linear-gradient(to bottom, #040412 0%, #0A082A 40%, #180D28 65%, #2A1208 100%)"
      : phase === "dawn"
      ? "linear-gradient(to bottom, #C44B00 0%, #FF6B00 30%, #FF8C00 55%, #7A2200 80%, #140800 100%)"
      : "linear-gradient(to bottom, #87CEEB 0%, #FFB347 28%, #FF8C00 52%, #FF6B00 68%, #2D1810 100%)";

  return (
    <div
      ref={ref}
      id="hero"
      className="relative h-[160vh] overflow-hidden"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* ── Sky gradient ── */}
        <motion.div
          className="absolute inset-0 z-0"
          animate={{ background: skyBg }}
          transition={{ duration: DAWN_DURATION / 1000, ease: "easeInOut" }}
        />

        {/* ── Stars ── */}
        <AnimatePresence>
          {starsVisible && (
            <motion.div
              className="pointer-events-none absolute inset-0 z-[1]"
              exit={{ opacity: 0 }}
              transition={{ duration: 1.4 }}
            >
              {STARS.map((s) => (
                <motion.div
                  key={s.id}
                  className="absolute rounded-full bg-white"
                  style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size }}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── City images (parallax) ── */}
        <motion.div className="absolute inset-0 z-[2]" style={{ y: parallaxCity }}>
          {/* Night city */}
          <motion.img
            src="/pixel-city-night.png"
            alt=""
            aria-hidden="true"
            className="absolute bottom-0 left-0 w-full pixelated"
            style={{ height: "72%", objectFit: "cover", objectPosition: "bottom" }}
            animate={{ opacity: phase === "done" ? 0 : 1 }}
            transition={{ duration: DAWN_DURATION / 1000 * 0.7, ease: "easeInOut" }}
          />
          {/* Dawn city */}
          <motion.img
            src="/pixel-city-dawn.png"
            alt="Pixel art Indian LPG agency city at golden dawn — the story of your agency's transformation"
            className="absolute bottom-0 left-0 w-full pixelated"
            style={{ height: "72%", objectFit: "cover", objectPosition: "bottom" }}
            animate={{ opacity: phase === "night" ? 0 : 1 }}
            transition={{ duration: DAWN_DURATION / 1000, ease: "easeInOut" }}
          />
        </motion.div>

        {/* ── Dawn radial glow from horizon ── */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-[3]"
          animate={{
            opacity: phase === "night" ? 0 : phase === "dawn" ? 0.55 : 0.25,
          }}
          transition={{ duration: DAWN_DURATION / 1000 * 0.5, ease: "easeOut" }}
          style={{
            background: "radial-gradient(ellipse 80% 35% at 50% 100%, rgba(255,107,0,0.7) 0%, transparent 70%)",
          }}
        />

        {/* ── Ground atmosphere ── */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 z-[4] h-56"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 100%)" }}
        />

        {/* ── Text scrim (behind headline) ── */}
        <div
          className="pointer-events-none absolute inset-0 z-[5]"
          style={{
            background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,0,0,0.52) 0%, transparent 75%)",
          }}
        />

        {/* ── Scroll dark overlay ── */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-[6] bg-black"
          style={{ opacity: scrollOverlay }}
        />

        {/* ── Scanlines ── */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[7] opacity-[0.03]"
          style={{
            backgroundImage: "repeating-linear-gradient(to bottom, rgba(255,255,255,1) 0px, rgba(255,255,255,1) 1px, transparent 1px, transparent 4px)",
          }}
        />

        {/* ── Hero Content ── */}
        <motion.div
          className="absolute inset-0 z-[8] flex flex-col items-center justify-center px-4 text-center"
          style={{ y: textY, opacity: textOpacity }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 120, damping: 22 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/50 px-4 py-2 font-pixel text-[10px] uppercase tracking-widest text-primary backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-ember" />
              LPG AGENCY ERP FOR INDIA
            </span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            className="mt-6 max-w-5xl font-display font-black leading-[1] tracking-tight text-white"
            style={{ fontSize: "clamp(2.4rem, 7vw, 6rem)", textShadow: "0 2px 40px rgba(0,0,0,0.8), 0 0 80px rgba(0,0,0,0.5)" }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 80, damping: 22 }}
          >
            YOUR CITY.{" "}
            <span className="text-primary" style={{ textShadow: "0 0 60px rgba(255,107,0,0.6), 0 2px 20px rgba(0,0,0,0.8)" }}>
              YOUR AGENCY.
            </span>{" "}
            YOUR GROWTH.
          </motion.h1>

          {/* Sub-text */}
          <motion.p
            className="mt-6 max-w-2xl text-base leading-relaxed sm:text-xl"
            style={{ color: "rgba(255,255,255,0.88)", textShadow: "0 1px 12px rgba(0,0,0,0.9)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, type: "spring", stiffness: 80, damping: 22 }}
          >
            Manage every cylinder, every customer, every rupee —
            from one powerful platform built for India's LPG agencies.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, type: "spring", stiffness: 80, damping: 22 }}
          >
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-lg bg-primary px-8 py-4 font-display text-sm font-bold uppercase tracking-wide text-white shadow-glow transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 -left-full w-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent transition-all duration-700 group-hover:left-full" />
              Start Free Trial
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <button
              type="button"
              onClick={() => scrollToId("workbench")}
              className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-black/30 px-8 py-4 font-display text-sm font-bold uppercase tracking-wide text-white backdrop-blur-sm transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Try Live Demo
            </button>
          </motion.div>

          {/* Trust badges */}
          <motion.ul
            className="mt-8 flex flex-wrap justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.25 }}
          >
            {TRUST.map((t, i) => (
              <motion.li
                key={t}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.3 + i * 0.07, type: "spring", stiffness: 280, damping: 20 }}
                className="rounded-md border border-white/15 bg-black/40 px-3 py-1.5 font-mono text-[11px] text-white/75 backdrop-blur-sm"
              >
                {t}
              </motion.li>
            ))}
          </motion.ul>

          {/* Scroll nudge */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2 }}
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center gap-2"
            >
              <span className="font-pixel text-[8px] uppercase tracking-widest text-white/40">
                SCROLL TO EXPLORE
              </span>
              <div className="h-8 w-px bg-gradient-to-b from-white/35 to-transparent" />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

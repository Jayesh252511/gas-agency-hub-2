import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { scrollToId, WHATSAPP } from "@/lib/gas";
import { ArrowRight, Play } from "lucide-react";

// Deterministic star positions
const STARS = Array.from({ length: 90 }, (_, i) => ({
  id: i,
  x: ((i * 137.508) % 100),
  y: ((i * 97.131) % 55),
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
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const parallaxCity = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const scrollOverlay = useTransform(scrollYProgress, [0, 0.55], [0, 0.85]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-25%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div
      ref={ref}
      id="hero"
      className="relative h-[160vh] overflow-hidden bg-[#050512]"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* ── Night Sky gradient ── */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: "linear-gradient(to bottom, #03030D 0%, #090820 40%, #140B24 70%, #050510 100%)",
          }}
        />

        {/* ── Twinkling Stars ── */}
        <div className="pointer-events-none absolute inset-0 z-[1]">
          {STARS.map((s) => (
            <motion.div
              key={s.id}
              className="absolute rounded-full bg-white"
              style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size }}
              animate={reduced ? undefined : { opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 2.2, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}
            />
          ))}
        </div>

        {/* ── Dark City Night Image (Parallax) ── */}
        <motion.div className="absolute inset-0 z-[2]" style={{ y: parallaxCity }}>
          <img
            src="/pixel-city-night.png"
            alt="Pixel art Indian LPG agency city at night"
            className="absolute bottom-0 left-0 w-full pixelated"
            style={{ height: "76%", objectFit: "cover", objectPosition: "bottom" }}
          />
        </motion.div>

        {/* ── Subtle horizon ember ambient glow ── */}
        <div
          className="pointer-events-none absolute inset-0 z-[3]"
          style={{
            background: "radial-gradient(ellipse 80% 35% at 50% 100%, rgba(255,107,0,0.35) 0%, transparent 70%)",
          }}
        />

        {/* ── Ground atmosphere ── */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 z-[4] h-56"
          style={{ background: "linear-gradient(to top, rgba(5,5,18,0.95) 0%, transparent 100%)" }}
        />

        {/* ── Dark Scrim behind text for 100% legibility ── */}
        <div
          className="pointer-events-none absolute inset-0 z-[5]"
          style={{
            background: "radial-gradient(ellipse 85% 65% at 50% 50%, rgba(0,0,0,0.70) 0%, transparent 80%)",
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
            transition={{ delay: 0.2, type: "spring", stiffness: 120, damping: 22 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/60 px-4 py-2 font-pixel text-[10px] uppercase tracking-widest text-primary backdrop-blur-md shadow-lg">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-ember" />
              LPG AGENCY ERP FOR INDIA
            </span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            className="mt-6 max-w-5xl font-display font-black leading-[1] tracking-tight text-white"
            style={{ fontSize: "clamp(2.4rem, 7vw, 6rem)", textShadow: "0 4px 30px rgba(0,0,0,0.9), 0 0 50px rgba(0,0,0,0.7)" }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, type: "spring", stiffness: 80, damping: 22 }}
          >
            YOUR CITY.{" "}
            <span className="text-primary" style={{ textShadow: "0 0 50px rgba(255,107,0,0.7), 0 4px 20px rgba(0,0,0,0.9)" }}>
              YOUR AGENCY.
            </span>{" "}
            YOUR GROWTH.
          </motion.h1>

          {/* Sub-text */}
          <motion.p
            className="mt-6 max-w-2xl text-base leading-relaxed sm:text-xl font-medium text-gray-200"
            style={{ textShadow: "0 2px 14px rgba(0,0,0,0.95)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 80, damping: 22 }}
          >
            Manage every cylinder, every customer, every rupee —
            from one powerful platform built for India's LPG agencies.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, type: "spring", stiffness: 80, damping: 22 }}
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
              className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-black/60 px-8 py-4 font-display text-sm font-bold uppercase tracking-wide text-white backdrop-blur-md transition-colors hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <Play className="h-4 w-4 text-primary fill-primary" />
              Try Live Demo
            </button>
          </motion.div>

          {/* Trust badges */}
          <motion.ul
            className="mt-8 flex flex-wrap justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {TRUST.map((t, i) => (
              <motion.li
                key={t}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.85 + i * 0.06, type: "spring", stiffness: 280, damping: 20 }}
                className="rounded-md border border-white/20 bg-black/60 px-3.5 py-1.5 font-mono text-[11px] text-gray-200 backdrop-blur-md shadow"
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
            transition={{ delay: 1.2 }}
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center gap-2"
            >
              <span className="font-pixel text-[8px] uppercase tracking-widest text-gray-400">
                SCROLL TO EXPLORE
              </span>
              <div className="h-8 w-px bg-gradient-to-b from-white/40 to-transparent" />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

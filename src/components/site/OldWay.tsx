import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const PAINS = [
  "Ramesh — 2 cylinder — paisa baad me",
  "Kitna stock bacha? Pata nahi.",
  "Delivery boy ka hisaab?",
  "Month end… 3 din ka kaam.",
];

const CELLS = Array.from({ length: 120 }, (_, i) => i);

export function OldWay() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 80, damping: 24, mass: 0.3 });

  // 1. Register appearance & exit
  const bookOpacity = useTransform(p, [0.02, 0.12, 0.48, 0.68], [0, 1, 1, 0]);
  const bookScale = useTransform(p, [0.02, 0.12, 0.48, 0.68], [0.88, 1, 1, 0.84]);

  // 2. Digital ledger appearance
  const dashOpacity = useTransform(p, [0.66, 0.82], [0, 1]);
  const dashScale = useTransform(p, [0.66, 0.84], [0.88, 1]);
  const dashY = useTransform(p, [0.66, 0.84], [40, 0]);

  // 3. Final headline reveal
  const headOpacity = useTransform(p, [0.82, 0.96], [0, 1]);
  const headY = useTransform(p, [0.82, 0.96], [20, 0]);

  return (
    <section
      id="oldway"
      ref={ref}
      aria-label="The old way: paper registers"
      className="relative h-[360vh] bg-charcoal"
    >
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0 scanline-overlay opacity-40" />
        <div className="pointer-events-none absolute inset-0 vignette" />

        <div className="relative mx-auto w-full max-w-4xl px-5 text-center">
          <span className="font-pixel text-[10px] tracking-tight text-primary">
            01 // THE OLD WAY
          </span>

          {/* Paper Register Notebook (Phase 1 & 2) */}
          <motion.div
            style={reduced ? undefined : { opacity: bookOpacity, scale: bookScale }}
            className="relative mx-auto mt-8 max-w-2xl"
          >
            <img
              src="/pixel-register.png"
              alt="Pixel art paper register notebook used by gas agencies"
              loading="lazy"
              width={768}
              height={512}
              className="mx-auto w-full max-w-md object-contain pixelated"
            />

            {/* Pain lines animate ONE BY ONE on scroll */}
            <ul className="mt-6 space-y-2">
              {PAINS.map((t, i) => {
                const start = 0.12 + i * 0.09;
                return (
                  <PainLine key={t} text={t} progress={p} start={start} reduced={reduced} />
                );
              })}
            </ul>

            {!reduced && (
              <div className="pointer-events-none absolute inset-0 grid grid-cols-12 grid-rows-10">
                {CELLS.map((i) => (
                  <AshCell key={i} progress={p} index={i} />
                ))}
              </div>
            )}
          </motion.div>

          {/* Digital ERP Ledger (Phase 3) */}
          <motion.div
            style={reduced ? undefined : { opacity: dashOpacity, scale: dashScale, y: dashY }}
            className="absolute inset-x-5 top-1/2 mx-auto max-w-md -translate-y-1/2 rounded-2xl border border-primary/40 bg-charcoal-soft p-6 text-left shadow-glow"
          >
            <div className="font-pixel text-[8px] tracking-tight text-primary">AGENCY.OS / LEDGER</div>
            <div className="mt-2 font-mono text-3xl font-bold text-white">₹24,580</div>
            <div className="mt-1 font-mono text-xs text-success font-semibold">▲ 12% · all entries synced</div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {["SALES", "UDHARI", "STOCK"].map((k) => (
                <div key={k} className="rounded-md border border-white/15 px-2 py-2 text-center bg-black/50">
                  <span className="font-pixel text-[7px] text-gray-300">{k}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Headline Reveal (Phase 4) */}
          <motion.h2
            style={reduced ? undefined : { opacity: headOpacity, y: headY }}
            className="relative mt-8 font-display text-2xl font-bold leading-tight tracking-tight text-white sm:text-4xl"
          >
            THE REGISTER IS DEAD.
            <br />
            <span className="text-primary">LONG LIVE THE LEDGER.</span>
          </motion.h2>
        </div>
      </div>
    </section>
  );
}

function PainLine({
  text,
  progress,
  start,
  reduced,
}: {
  text: string;
  progress: ReturnType<typeof useSpring>;
  start: number;
  reduced: boolean;
}) {
  // Fade in from 0 -> 1 progressively between start and start + 0.07
  const opacity = useTransform(progress, [start, start + 0.07], [0, 1]);
  const y = useTransform(progress, [start, start + 0.07], [16, 0]);
  return (
    <motion.li
      style={reduced ? undefined : { opacity, y }}
      className="font-pixel text-xs leading-relaxed tracking-tight text-amber-300 sm:text-sm font-semibold"
      style={{ textShadow: "0 2px 10px rgba(0,0,0,0.95)" }}
    >
      &gt; {text}
    </motion.li>
  );
}

function AshCell({
  progress,
  index,
}: {
  progress: ReturnType<typeof useSpring>;
  index: number;
}) {
  const col = index % 12;
  const row = Math.floor(index / 12);
  const start = 0.48 + col * 0.008 + row * 0.004;
  const opacity = useTransform(progress, [start, start + 0.08], [0, 1]);
  const y = useTransform(progress, [start, start + 0.12], [0, -28]);
  return <motion.span style={{ opacity, y }} className="bg-charcoal" />;
}

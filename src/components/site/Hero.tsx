import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import { WHATSAPP, inr, scrollToId } from "@/lib/gas";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { DashboardMock } from "./DashboardMock";
import { TiltCard } from "./TiltCard";

const BOOT = "> booting agency.os ...";

const PILLS = [
  "🛡️ 100% Secure Data",
  "📱 Works Offline",
  "☁️ Any Device",
  "🇮🇳 Made for India",
];

const GLITCH_CHARS = "▓░▒█▀▄╔╗╚╝║═";

function GlitchText({ text, active }: { text: React.ReactNode; active: boolean }) {
  const [display, setDisplay] = useState(false);
  const [glitching, setGlitching] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!active || reduced) {
      if (active) setDisplay(true);
      return;
    }
    // Start glitch phase then settle
    setGlitching(true);
    const t1 = setTimeout(() => {
      setGlitching(false);
      setDisplay(true);
    }, 320);
    return () => clearTimeout(t1);
  }, [active, reduced]);

  if (!active && !display) return <span className="opacity-15">{text}</span>;

  return (
    <span className={`relative inline-block transition-opacity duration-700 ${display ? "opacity-100" : "opacity-15"}`}>
      {glitching && (
        <span
          aria-hidden="true"
          className="absolute inset-0 text-primary/80"
          style={{ filter: "blur(1px)", letterSpacing: "0.04em" }}
        >
          {GLITCH_CHARS.slice(0, 18)}
        </span>
      )}
      {text}
    </span>
  );
}

// Live fluctuating number
function LiveNumber({ base, range, prefix = "₹" }: { base: number; range: number; prefix?: string }) {
  const [v, setV] = useState(base);
  useEffect(() => {
    const id = setInterval(() => {
      setV(base + Math.round((Math.random() - 0.5) * range * 2));
    }, 1800 + Math.random() * 1200);
    return () => clearInterval(id);
  }, [base, range]);
  return <span className="font-mono tabular-nums">{prefix}{new Intl.NumberFormat("en-IN").format(v)}</span>;
}

export function Hero() {
  const reduced = useReducedMotion();
  const [typed, setTyped] = useState("");
  const [lit, setLit] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const sp = useSpring(scrollYProgress, { stiffness: 80, damping: 22 });
  const yA = useTransform(sp, [0, 1], [0, -70]);
  const yB = useTransform(sp, [0, 1], [0, -140]);
  const yC = useTransform(sp, [0, 1], [0, -40]);

  useEffect(() => {
    if (reduced) {
      setTyped(BOOT);
      setLit(true);
      return;
    }
    // Brief pause before typing starts
    const pause = setTimeout(() => {
      let i = 0;
      const t = setInterval(() => {
        i += 1;
        setTyped(BOOT.slice(0, i));
        if (i >= BOOT.length) {
          clearInterval(t);
          setTimeout(() => setLit(true), 220);
        }
      }, 42);
      return () => clearInterval(t);
    }, 300);
    return () => clearTimeout(pause);
  }, [reduced]);

  const onMove = useCallback((e: React.MouseEvent) => {
    if (reduced) return;
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setMouse({
      x: (e.clientX - r.left) / r.width - 0.5,
      y: (e.clientY - r.top) / r.height - 0.5,
    });
  }, [reduced]);

  return (
    <section
      id="hero"
      ref={ref}
      onMouseMove={onMove}
      className="relative overflow-hidden bg-paper pb-16 pt-28 sm:pb-24 sm:pt-32 lg:pt-36"
    >
      {/* Subtle noise grain overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />

      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:gap-10 lg:px-14">
        {/* ── Left ── */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 120, damping: 20 }}
            className="mb-6 flex items-center gap-3"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-hairline bg-card px-3 py-1.5 font-pixel text-[9px] uppercase tracking-tight text-foreground shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-ember" />
              BUILT FOR INDIA'S LPG AGENCIES
            </span>
          </motion.div>

          {/* Boot text with blinking cursor */}
          <p className="mb-4 h-5 font-mono text-xs text-muted-foreground" aria-hidden="true">
            {typed || <span className="opacity-0">_</span>}
            <span className="ml-0.5 inline-block h-3 w-1.5 -translate-y-px bg-primary align-middle animate-ember" />
          </p>

          {/* H1 with glitch reveal */}
          <h1 className="relative max-w-xl font-display text-[2.1rem] font-bold leading-[1.05] tracking-[-0.03em] sm:text-5xl lg:text-6xl">
            <GlitchText
              active={lit}
              text={
                <>
                  RUN YOUR LPG AGENCY{" "}
                  <span className="text-primary">SMARTER, FASTER</span> &amp; MORE PROFITABLE.
                </>
              }
            />
            {!reduced && (
              <motion.span
                aria-hidden="true"
                initial={{ x: "-120%" }}
                animate={lit ? { x: "130%" } : {}}
                transition={{ duration: 1.1, ease: "easeOut" }}
                className="pointer-events-none absolute inset-y-0 -left-10 w-1/2 blur-md"
                style={{
                  background: "linear-gradient(90deg, transparent 0%, rgba(255,107,0,0.35) 45%, rgba(255,107,0,0.6) 55%, transparent 100%)",
                }}
              />
            )}
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={lit ? { opacity: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-6 max-w-lg text-[15px] leading-relaxed text-muted-foreground"
          >
            Manage bookings, customers, payments, stock, udhari, and reports from one powerful
            platform. Designed for India. Built for growth.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={lit ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.45, type: "spring", stiffness: 120, damping: 22 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-lg bg-primary px-6 py-3.5 font-display text-sm font-bold uppercase tracking-wide text-white shadow-glow transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 -left-full w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-700 group-hover:left-full" />
              Start Free Trial
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <button
              type="button"
              onClick={() => scrollToId("workbench")}
              className="inline-flex items-center gap-2 rounded-lg border border-foreground/15 px-6 py-3.5 font-display text-sm font-bold uppercase tracking-wide transition-colors hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
            >
              Watch Workbench
            </button>
          </motion.div>

          <ul className="mt-10 flex flex-wrap gap-2">
            {PILLS.map((p, i) => (
              <motion.li
                key={p}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={lit ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.55 + 0.1 * i, type: "spring", stiffness: 300, damping: 18 }}
                className="rounded-md border border-hairline bg-card px-3 py-2 font-mono text-[11px] text-muted-foreground shadow-sm"
              >
                {p}
              </motion.li>
            ))}
          </ul>
        </div>

        {/* ── Right — Studio Stage ── */}
        <div className="relative min-h-[440px] sm:min-h-[540px]">
          {/* Charcoal pedestal */}
          <motion.div
            style={{ y: yA, x: mouse.x * 18 }}
            className="absolute inset-x-4 bottom-6 top-10 rounded-3xl bg-charcoal"
          >
            <div className="absolute inset-x-10 bottom-10 h-24 rounded-full bg-primary/40 blur-3xl animate-breathe" />
            <img
              src="/pixel-cylinder.png"
              alt="Pixel art LPG gas cylinder floating on a charcoal pedestal"
              width={512}
              height={512}
              className="absolute bottom-14 left-1/2 h-52 w-52 -translate-x-1/2 object-contain pixelated animate-bob sm:h-64 sm:w-64"
            />
            <span className="absolute bottom-5 left-1/2 -translate-x-1/2 font-pixel text-[9px] tracking-tight text-white/30">
              AGENCY.OS PEDESTAL
            </span>
          </motion.div>

          {/* HMI Card 1 — 3D tilt, live number */}
          <motion.div style={{ y: yB, x: mouse.x * -26 }} className="absolute -right-1 top-0 z-10 w-44 sm:w-52">
            <TiltCard className="panel p-4 bg-card">
              <div className="font-pixel text-[8px] tracking-tight text-muted-foreground">TODAY'S COLLECTION</div>
              <div className="mt-1.5 text-xl font-bold sm:text-2xl">
                <LiveNumber base={24580} range={400} />
              </div>
              <div className="mt-1 font-mono text-[11px] text-success">▲ 12%</div>
              <p className="mt-2 text-[11px] text-muted-foreground">Real-time daily inflow</p>
            </TiltCard>
          </motion.div>

          {/* HMI Card 2 — 3D tilt, live number */}
          <motion.div style={{ y: yC, x: mouse.x * 22 }} className="absolute -left-1 bottom-0 z-10 w-44 sm:w-52">
            <TiltCard className="panel p-4 bg-card">
              <div className="font-pixel text-[8px] tracking-tight text-muted-foreground">PENDING UDHARI</div>
              <div className="mt-1.5 text-xl font-bold sm:text-2xl">
                <LiveNumber base={8240} range={200} />
              </div>
              <div className="mt-1 font-mono text-[11px] text-danger">▼ 6%</div>
              <p className="mt-2 text-[11px] text-muted-foreground">12 active customers</p>
            </TiltCard>
          </motion.div>

          {/* Phone frame */}
          <motion.div
            style={{ y: yB, x: mouse.y * 16 }}
            className="absolute -right-2 bottom-4 hidden w-[132px] rounded-[26px] border-4 border-charcoal bg-charcoal shadow-panel sm:block"
          >
            <div className="mx-auto mb-1 mt-1 h-1 w-8 rounded-full bg-white/20" />
            <div className="h-[236px] overflow-hidden rounded-[18px]">
              <DashboardMock compact />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll down arrow */}
      <button
        type="button"
        onClick={() => scrollToId("ticker")}
        aria-label="Scroll to next section"
        className="mx-auto mt-12 flex h-10 w-10 items-center justify-center rounded-full border border-hairline text-muted-foreground animate-bob focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
      >
        <ArrowDown className="h-4 w-4" />
      </button>
    </section>
  );
}

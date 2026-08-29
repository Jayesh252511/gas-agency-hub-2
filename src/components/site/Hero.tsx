import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { WHATSAPP, inr, scrollToId } from "@/lib/gas";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { DashboardMock } from "./DashboardMock";

const BOOT = "> booting agency.os ...";

const PILLS = [
  "🛡️ 100% Secure Data",
  "📱 Works Offline",
  "☁️ Any Device",
  "🇮🇳 Made for India",
];

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
  }, [reduced]);

  const onMove = (e: React.MouseEvent) => {
    if (reduced) return;
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setMouse({
      x: (e.clientX - r.left) / r.width - 0.5,
      y: (e.clientY - r.top) / r.height - 0.5,
    });
  };

  return (
    <section
      id="hero"
      ref={ref}
      onMouseMove={onMove}
      className="relative overflow-hidden bg-background pb-16 pt-28 sm:pb-24 sm:pt-32 lg:pt-36"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:gap-10 lg:px-14">
        {/* Left */}
        <div>
          <div className="mb-6 flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-hairline bg-card px-3 py-1.5 font-pixel text-[9px] uppercase tracking-tight text-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-ember" />
              BUILT FOR INDIA'S LPG AGENCIES
            </span>
          </div>

          <p className="mb-4 font-mono text-xs text-muted-foreground" aria-hidden="true">
            {typed}
            <span className="ml-0.5 inline-block h-3 w-1.5 -translate-y-px bg-primary align-middle animate-ember" />
          </p>

          <h1 className="relative max-w-xl font-display text-[2.1rem] font-bold leading-[1.05] tracking-[-0.03em] sm:text-5xl lg:text-6xl">
            <span
              className={`transition-opacity duration-700 ${lit ? "opacity-100" : "opacity-15"}`}
            >
              RUN YOUR LPG AGENCY{" "}
              <span className="text-primary">SMARTER, FASTER</span> &amp; MORE PROFITABLE.
            </span>
            {!reduced && (
              <motion.span
                aria-hidden="true"
                initial={{ x: "-120%" }}
                animate={lit ? { x: "130%" } : {}}
                transition={{ duration: 1.1, ease: "easeOut" }}
                className="pointer-events-none absolute inset-y-0 -left-10 w-1/2 bg-[image:var(--gradient-ignite)] blur-md"
              />
            )}
          </h1>

          <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
            Manage bookings, customers, payments, stock, udhari, and reports from one powerful
            platform. Designed for India. Built for growth.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3.5 font-display text-sm font-bold uppercase tracking-wide text-primary-foreground shadow-glow transition-transform duration-200 hover:-translate-y-0.5"
            >
              Start Free Trial
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <button
              type="button"
              onClick={() => scrollToId("workbench")}
              className="inline-flex items-center gap-2 rounded-lg border border-foreground/15 px-6 py-3.5 font-display text-sm font-bold uppercase tracking-wide transition-colors hover:bg-secondary"
            >
              Watch Workbench
            </button>
          </div>

          <ul className="mt-10 flex flex-wrap gap-2">
            {PILLS.map((p, i) => (
              <motion.li
                key={p}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={lit ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.15 * i, type: "spring", stiffness: 300, damping: 18 }}
                className="rounded-md border border-hairline bg-card px-3 py-2 font-mono text-[11px] text-muted-foreground"
              >
                {p}
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Right — Studio stage */}
        <div className="relative min-h-[440px] sm:min-h-[540px]">
          <motion.div
            style={{ y: yA, x: mouse.x * 18 }}
            className="absolute inset-x-4 bottom-6 top-10 rounded-3xl bg-charcoal"
          >
            <div className="absolute inset-x-10 bottom-10 h-24 rounded-full bg-primary/40 blur-3xl animate-breathe" />
            <img
              src="/pixel-cylinder.png"
              alt="Pixel art LPG gas cylinder"
              width={512}
              height={512}
              className="absolute bottom-14 left-1/2 h-52 w-52 -translate-x-1/2 object-contain pixelated animate-bob sm:h-64 sm:w-64"
            />
            <span className="absolute bottom-5 left-1/2 -translate-x-1/2 font-pixel text-[9px] tracking-tight text-secondary/50">
              AGENCY.OS PEDESTAL
            </span>
          </motion.div>

          <motion.div
            style={{ y: yB, x: mouse.x * -26 }}
            className="absolute -right-1 top-0 w-44 panel p-4 sm:w-52"
          >
            <div className="font-pixel text-[8px] tracking-tight text-muted-foreground">
              TODAY'S COLLECTION
            </div>
            <div className="mt-1.5 font-mono text-xl font-bold sm:text-2xl">{inr(24580)}</div>
            <div className="mt-1 font-mono text-[11px] text-success">▲ 12%</div>
            <p className="mt-2 text-[11px] text-muted-foreground">Real-time daily inflow</p>
          </motion.div>

          <motion.div
            style={{ y: yC, x: mouse.x * 22 }}
            className="absolute -left-1 bottom-0 w-44 panel p-4 sm:w-52"
          >
            <div className="font-pixel text-[8px] tracking-tight text-muted-foreground">
              PENDING UDHARI
            </div>
            <div className="mt-1.5 font-mono text-xl font-bold sm:text-2xl">{inr(8240)}</div>
            <div className="mt-1 font-mono text-[11px] text-danger">▼ 6%</div>
            <p className="mt-2 text-[11px] text-muted-foreground">12 active customers</p>
          </motion.div>

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

      <button
        type="button"
        onClick={() => scrollToId("ticker")}
        aria-label="Scroll to next section"
        className="mx-auto mt-12 flex h-10 w-10 items-center justify-center rounded-full border border-hairline text-muted-foreground animate-bob"
      >
        <ArrowDown className="h-4 w-4" />
      </button>
    </section>
  );
}

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { inr } from "@/lib/gas";

export const STATIONS = [
  { title: "SALES MANAGEMENT", screen: `BILL #1042 · ${inr(24580)}`, knobs: ["QTY", "RATE"] },
  { title: "CUSTOMER LEDGER", screen: "DR 1,900 / CR 2,400", knobs: ["DR", "CR"] },
  { title: "UDHARI / CREDIT BOOK", screen: `DUES ${inr(8240)}`, knobs: ["AGE", "LIMIT"] },
  { title: "CASHBOOK & PAYMENTS", screen: "IN 4,000 · OUT 2,500", knobs: ["IN", "OUT"] },
  { title: "DELIVERY MANAGER", screen: "ROUTE 3/5 ACTIVE", knobs: ["STAFF", "ETA"] },
  { title: "PRODUCT & STOCK", screen: "142/200 · 28/60 · 15/40", knobs: ["FILL", "EMPTY"] },
  { title: "INFLOW & OUTFLOW", screen: "NET +1,500", knobs: ["▲", "▼"] },
  { title: "REPORTS & ANALYTICS", screen: `REV ${inr(324580)}`, knobs: ["RANGE", "TYPE"] },
  { title: "MULTI-USER & ROLES", screen: "OWNER · MGR · OPR", knobs: ["ROLE", "PERM"] },
];

function Panel({ i }: { i: number }) {
  const s = STATIONS[i];
  return (
    <article className="flex h-[300px] w-[280px] shrink-0 flex-col rounded-2xl border border-white/10 bg-charcoal-soft p-4 shadow-panel sm:h-[330px] sm:w-[330px]">
      <div className="flex items-center justify-between">
        <span className="font-pixel text-[9px] tracking-tight text-primary">
          {String(i + 1).padStart(2, "0")} / 09
        </span>
        <span className="h-2 w-2 rounded-full bg-primary shadow-glow" />
      </div>
      <h3 className="mt-3 font-display text-lg font-bold leading-tight tracking-tight text-white">
        {s.title}
      </h3>
      <div className="mt-4 flex-1 rounded-lg bg-[#090909] border border-white/5 p-3">
        <div className="font-pixel text-[7px] text-gray-500">INSET SCREEN</div>
        <div className="mt-3 font-mono text-sm font-bold text-primary">{s.screen}</div>
        <div className="mt-4 flex h-14 items-end gap-1">
          {[40, 66, 52, 88, 60, 96, 72].map((h, k) => (
            <motion.span
              key={k}
              initial={{ height: 4 }}
              whileInView={{ height: `${h}%` }}
              viewport={{ once: true }}
              transition={{ delay: k * 0.05, type: "spring", stiffness: 120, damping: 16 }}
              className="flex-1 rounded-sm bg-primary/80"
            />
          ))}
        </div>
      </div>
      <div className="mt-4 flex items-center gap-4">
        {s.knobs.map((k) => (
          <span key={k} className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-full border border-white/20 bg-black/40">
              <span className="h-2 w-0.5 -translate-y-1 bg-white" />
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-gray-400">
              {k}
            </span>
          </span>
        ))}
      </div>
    </article>
  );
}

export function AssemblyLine() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 70, damping: 24, mass: 0.4 });
  const x = useTransform(p, [0, 1], ["2%", "-78%"]);
  const cylinderGlow = useTransform(p, [0, 1], [0.2, 1]);

  return (
    <>
      {/* Desktop: horizontal scroll lock */}
      <section
        id="assembly"
        ref={ref}
        aria-label="The assembly line of modules"
        className="relative hidden h-[420vh] bg-[#111111] md:block border-t border-white/10"
      >
        <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
          <div className="mx-auto mb-8 w-full max-w-7xl px-10">
            <span className="font-pixel text-[10px] tracking-tight text-primary">
              02 // THE ASSEMBLY LINE
            </span>
            <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold tracking-tight text-white lg:text-4xl">
              NINE MODULES BOLT ONTO YOUR AGENCY.
            </h2>
          </div>

          <motion.div style={{ x }} className="flex gap-6 px-10 will-change-transform">
            {STATIONS.map((_, i) => (
              <Panel key={i} i={i} />
            ))}
          </motion.div>

          <div className="relative mt-8 px-10">
            <div className="h-1 w-full rounded-full bg-white/10" />
            <motion.img
              src="/pixel-cylinder.png"
              alt=""
              aria-hidden="true"
              width={512}
              height={512}
              style={{ left: useTransform(p, [0, 1], ["6%", "88%"]), opacity: cylinderGlow }}
              className="absolute -top-12 h-14 w-14 object-contain pixelated"
            />
          </div>
        </div>
      </section>

      {/* Mobile: vertical stack */}
      <section aria-label="Modules" className="bg-[#111111] px-4 py-16 md:hidden border-t border-white/10">
        <span className="font-pixel text-[10px] tracking-tight text-primary">
          02 // THE ASSEMBLY LINE
        </span>
        <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-white">
          NINE MODULES BOLT ONTO YOUR AGENCY.
        </h2>
        <div className="mt-8 flex flex-col items-center gap-5">
          {STATIONS.map((_, i) => (
            <Panel key={i} i={i} />
          ))}
        </div>
      </section>
    </>
  );
}

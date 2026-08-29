import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const STEPS = [
  {
    tag: "01 // SETUP",
    title: "Register Your Agency",
    body: "Create your agency account with a unique code in minutes. Zero technical overhead required. We handle the setup — you focus on your customers.",
    ember: "🔥",
    accent: "border-l-primary",
  },
  {
    tag: "02 // INGEST",
    title: "Add Customer Profiles",
    body: "Import or quickly add existing customer ledgers with contact info and running balance history. All your udhari is digitised from day one.",
    ember: "🔥🔥",
    accent: "border-l-primary",
  },
  {
    tag: "03 // ENGINE",
    title: "Record Cylinder Sales",
    body: "Log daily refill bookings, collect payments, and auto-track credit udharis across any device. Works fully offline and syncs when back online.",
    ember: "🔥🔥🔥",
    accent: "border-l-primary",
  },
  {
    tag: "04 // REPORT",
    title: "Export & Audit Dues",
    body: "Monitor real-time cash flow, print statement PDFs, and keep your agency 100% audit compliant. Month-end in 5 minutes, not 3 days.",
    ember: "🔥🔥🔥🔥",
    accent: "border-l-primary",
  },
];

function StackCard({ step, index }: { step: typeof STEPS[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.3 });

  return (
    <div
      ref={ref}
      className="sticky"
      style={{
        top: `${96 + index * 24}px`,
        zIndex: index + 1,
      }}
    >
      <motion.article
        animate={{
          scale: inView ? 1 : 0.97,
          opacity: inView ? 1 : 0.75,
        }}
        transition={{ type: "spring", stiffness: 120, damping: 22 }}
        className={`relative mb-6 overflow-hidden rounded-2xl border border-white/10 border-l-4 ${step.accent} bg-charcoal-soft p-6 shadow-panel sm:p-10`}
      >
        {/* Ghost numeral watermark */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-3 -top-4 select-none font-pixel text-[110px] leading-none text-white/[0.04] sm:text-[150px]"
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Ember strength indicator */}
        <span
          className="absolute right-5 top-5 font-mono text-sm leading-none"
          aria-hidden="true"
          style={{ filter: "sepia(1) saturate(3)" }}
        >
          {step.ember}
        </span>

        <span className="font-pixel text-[9px] tracking-widest text-primary">
          {step.tag}
        </span>
        <h3 className="mt-3 font-display text-xl font-bold tracking-tight text-white sm:text-3xl">
          {step.title}
        </h3>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-gray-300 sm:text-base">
          {step.body}
        </p>

        {/* Bottom ember accent line */}
        <motion.div
          animate={{ scaleX: inView ? 1 : 0 }}
          style={{ originX: 0 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 80, damping: 20 }}
          className="mt-6 h-0.5 w-full rounded-full bg-gradient-to-r from-primary via-primary/60 to-transparent"
        />
      </motion.article>
    </div>
  );
}

export function HowItWorksStacked() {
  return (
    <section
      id="how"
      className="scroll-mt-24 bg-[#0D0D0D] px-4 py-20 sm:px-6 lg:px-14 border-t border-white/10"
    >
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ type: "spring", stiffness: 90, damping: 22 }}
        >
          <span className="font-pixel text-[10px] tracking-widest text-primary">
            02 // SIMPLE PROCESS
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Up &amp; Running In{" "}
            <span className="text-primary">4 Easy Steps.</span>
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray-400 sm:text-base">
            We built GasAgency Hub so you can go from zero to fully digital in
            one afternoon. No IT skills needed. No expensive setup.
          </p>
        </motion.div>

        {/* Stacking cards */}
        <div className="mt-14">
          {STEPS.map((step, i) => (
            <StackCard key={step.tag} step={step} index={i} />
          ))}
        </div>

        {/* Spacer so the last sticky card scrolls away */}
        <div className="h-16" />

        {/* Feature icon banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ type: "spring", stiffness: 60, damping: 20 }}
          className="mt-6"
        >
          <img
            src="/pixel-features.png"
            alt="Pixel art grid of GasAgency Hub feature icons — billing, ledger, delivery, stock, reports"
            loading="lazy"
            width={1536}
            height={512}
            className="w-full rounded-xl border border-white/10 object-cover pixelated"
          />
        </motion.div>
      </div>
    </section>
  );
}

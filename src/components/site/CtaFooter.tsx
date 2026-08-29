import { Link } from "@tanstack/react-router";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Flame } from "lucide-react";
import { WHATSAPP, WHATSAPP_TRIAL } from "@/lib/gas";

const TRUST_BADGES = [
  "No Credit Card",
  "Works Offline",
  "Any Device",
  "Made in India",
];

const FOOTER_LINKS = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Live Demo", href: "#demo" },
    { label: "App Workbench", href: "#workbench" },
    { label: "How It Works", href: "#how" },
  ],
  Support: [
    { label: "Contact Us", href: WHATSAPP, external: true },
    { label: "Email Support", href: "mailto:jayeshneo07@gmail.com", external: true },
    { label: "Interactive Demo", href: "#workbench" },
  ],
};

function CityWindow({ delay }: { delay: number }) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.1 }}
      className="absolute h-1.5 w-1.5 rounded-[1px]"
      style={{ background: `hsl(${30 + Math.random() * 20} 90% 60%)` }}
    />
  );
}

export function CtaFooter() {
  const ctaRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ctaRef, { once: true, amount: 0.35 });

  return (
    <>
      {/* ── ACT 9 — The City Lights Up ── */}
      <section
        id="start"
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, #1A1A1A 0%, #111111 50%, #0D0D0D 100%)",
        }}
      >
        {/* Pixel cityscape backdrop */}
        <div className="relative h-48 w-full overflow-hidden sm:h-64">
          <img
            src="/pixel-cityscape.png"
            alt="Pixel art Indian city skyline — windows lighting up"
            className="absolute bottom-0 left-0 h-full w-full object-cover object-bottom pixelated opacity-80"
          />
          {/* Ember glow beneath city */}
          <div
            className="absolute inset-x-0 bottom-0 h-32"
            style={{
              background:
                "linear-gradient(to top, rgba(255,107,0,0.12) 0%, transparent 100%)",
            }}
          />
          {/* Pixel delivery truck crossing */}
          <motion.img
            src="/pixel-truck.png"
            alt="Pixel art LPG delivery truck"
            className="absolute bottom-2 z-10 h-12 w-auto pixelated"
            animate={{ x: ["-10%", "110%"] }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "linear",
              repeatDelay: 4,
            }}
          />
        </div>

        {/* CTA Content */}
        <div ref={ctaRef} className="relative mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 sm:py-28">
          {/* Ember glow behind heading */}
          <motion.div
            animate={inView ? { opacity: [0, 0.25, 0.15] } : {}}
            transition={{ duration: 1.2 }}
            className="pointer-events-none absolute inset-x-0 top-0 h-full"
            style={{
              background:
                "radial-gradient(ellipse 60% 60% at 50% 40%, rgba(255,107,0,0.18) 0%, transparent 70%)",
            }}
          />

          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, type: "spring", stiffness: 100, damping: 20 }}
            className="font-pixel text-[10px] tracking-widest text-primary"
          >
            03 // READY TO START
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.18, type: "spring", stiffness: 80, damping: 22 }}
            className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight text-cream sm:text-5xl lg:text-6xl"
          >
            READY TO TRANSFORM YOUR
            <br />
            <span className="text-primary">GAS AGENCY?</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.28, type: "spring", stiffness: 80, damping: 22 }}
            className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-cream/75"
          >
            Start your free trial today. No credit card required. No setup fees.
            Just your agency, running smarter.
          </motion.p>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.38 }}
            className="mt-8 flex flex-wrap justify-center gap-3"
          >
            {TRUST_BADGES.map((t, i) => (
              <motion.span
                key={t}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{
                  delay: 0.4 + i * 0.07,
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
                className="rounded-md border border-cream/15 bg-cream/5 px-3 py-2 font-mono text-[11px] text-cream/70"
              >
                ● {t}
              </motion.span>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, type: "spring", stiffness: 80, damping: 22 }}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            <a
              href={WHATSAPP_TRIAL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-lg bg-primary px-8 py-4 font-display text-sm font-bold uppercase tracking-wide text-white shadow-glow transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {/* Ember shimmer on hover */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 -left-full w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-700 group-hover:left-full"
              />
              Start Free Trial →
            </a>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-lg border border-cream/20 px-8 py-4 font-display text-sm font-bold uppercase tracking-wide text-cream/90 transition-colors hover:bg-cream/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
            >
              Agency Login
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── ACT 10 — Footer ── */}
      <footer
        id="footer"
        className="relative border-t border-white/10 bg-ink"
      >
        {/* Pipeline terminus indicator */}
        <div className="flex items-center justify-center py-3">
          <span className="font-pixel text-[8px] tracking-widest text-primary/60">
            ◉ EOF
          </span>
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-14">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary shadow-glow">
                  <Flame className="h-5 w-5 text-white" strokeWidth={2.2} />
                </span>
                <span className="font-display text-base font-bold text-cream">
                  GasAgency Hub
                </span>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-warm-grey">
                India's trusted LPG gas agency management platform. Engineered
                for speed, reliability, and growth.
              </p>

              {/* Status badge */}
              <span className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 font-pixel text-[8px] uppercase tracking-widest text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-ember" />
                LIVE SYS.ACTIVE
              </span>
            </div>

            {/* Product links */}
            <div>
              <h4 className="font-pixel text-[9px] font-bold uppercase tracking-widest text-warm-grey">
                PRODUCT
              </h4>
              <ul className="mt-4 space-y-2.5">
                {FOOTER_LINKS.Product.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-xs text-cream/60 transition-colors hover:text-cream"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support links */}
            <div>
              <h4 className="font-pixel text-[9px] font-bold uppercase tracking-widest text-warm-grey">
                SUPPORT
              </h4>
              <ul className="mt-4 space-y-2.5">
                {FOOTER_LINKS.Support.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      target={l.external ? "_blank" : undefined}
                      rel={l.external ? "noopener noreferrer" : undefined}
                      className="text-xs text-cream/60 transition-colors hover:text-cream"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Made in India */}
            <div>
              <h4 className="font-pixel text-[9px] font-bold uppercase tracking-widest text-warm-grey">
                MADE IN INDIA
              </h4>
              <p className="mt-4 text-xs leading-relaxed text-cream/60">
                Designed &amp; built for Indian LPG distributors — Indane,
                Bharatgas, and HP Gas agencies.
              </p>
              <img
                src="/pixel-india.png"
                alt="Made in India pixel badge"
                loading="lazy"
                width={80}
                height={40}
                className="mt-4 h-10 w-auto object-contain pixelated"
              />
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 font-mono text-[11px] text-warm-grey sm:flex-row">
            <div>© {new Date().getFullYear()} GasAgency Hub. All rights reserved.</div>
            <div className="flex flex-wrap justify-center gap-6">
              <Link
                to="/login"
                className="transition-colors hover:text-cream"
              >
                Agency Login
              </Link>
              <a
                href={WHATSAPP_TRIAL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary transition-colors hover:text-primary/80"
              >
                Start Free Trial →
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

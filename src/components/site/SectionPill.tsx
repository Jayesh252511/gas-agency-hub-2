import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SECTIONS = [
  { id: "hero",      label: "IGNITION" },
  { id: "ticker",   label: "MODULES" },
  { id: "oldway",   label: "THE OLD WAY" },
  { id: "assembly", label: "ASSEMBLY LINE" },
  { id: "workbench",label: "WORKBENCH" },
  { id: "demo",     label: "PRODUCT DEMO" },
  { id: "how",      label: "HOW IT WORKS" },
  { id: "start",    label: "IGNITE" },
];

export function SectionPill() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && e.intersectionRatio >= 0.35) {
            setActive(e.target.id);
          }
        }
      },
      { threshold: 0.35 }
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const current = SECTIONS.find((s) => s.id === active);
  if (!current || active === "hero") return null;

  return (
    <div className="pointer-events-none fixed left-1/2 top-20 z-[60] -translate-x-1/2">
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: -8, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
          className="flex items-center gap-2 rounded-full border border-primary/30 bg-charcoal/90 px-4 py-2 backdrop-blur-md"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-ember" />
          <span className="font-pixel text-[9px] uppercase tracking-widest text-primary">
            ● {current.label}
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

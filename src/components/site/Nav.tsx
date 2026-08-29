import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { Flame, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { WHATSAPP, scrollToId } from "@/lib/gas";

const LINKS = [
  { label: "Features", id: "features" },
  { label: "How It Works", id: "how" },
  { label: "App Workbench", id: "workbench" },
];

export function Nav() {
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => scrollY.on("change", (v) => setSolid(v > 40)), [scrollY]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    setTimeout(() => scrollToId(id), 30);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color,backdrop-filter] duration-500 ${
        solid
          ? "border-b border-white/10 bg-charcoal/85 shadow-lg backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-[68px] max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-10">
        <button
          type="button"
          onClick={() => go("hero")}
          className="flex min-w-0 items-center gap-2.5 text-left"
          aria-label="GasAgency Hub home"
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary shadow-glow">
            <Flame className="h-5 w-5 text-white" strokeWidth={2.4} />
          </span>
          <span className="min-w-0">
            <span className="block truncate font-display text-[15px] font-bold tracking-tight text-white">
              GasAgency Hub
            </span>
            <span className="block truncate font-mono text-[9px] uppercase tracking-[0.18em] text-gray-400">
              Smart. Simple. Secure.
            </span>
          </span>
        </button>

        <nav className="mx-auto hidden items-center gap-1 md:flex" aria-label="Main">
          {LINKS.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => go(l.id)}
              className="rounded-md px-3.5 py-2 font-mono text-xs uppercase tracking-wider text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2 md:ml-0">
          <Link
            to="/login"
            className="hidden rounded-md px-3.5 py-2 font-mono text-xs uppercase tracking-wider text-gray-300 transition-colors hover:text-white sm:inline-flex"
          >
            Login
          </Link>
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-md bg-primary px-4 py-2.5 font-display text-xs font-bold uppercase tracking-wide text-white shadow-glow transition-transform duration-200 hover:-translate-y-0.5 sm:inline-flex"
          >
            Start Free Trial
          </a>
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-md border border-white/15 text-white md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-charcoal px-6 py-5 md:hidden"
          >
            <div className="flex items-center justify-between">
              <span className="font-pixel text-xs text-primary">MENU</span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-md border border-white/15 text-white"
              >
                <X className="h-5 w-5 text-primary" />
              </button>
            </div>
            <nav className="mt-10 flex flex-col gap-2" aria-label="Mobile">
              {LINKS.map((l, i) => (
                <motion.button
                  key={l.id}
                  type="button"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * i + 0.05 }}
                  onClick={() => go(l.id)}
                  className="py-3 text-left font-display text-3xl font-bold tracking-tight text-white"
                >
                  {l.label}
                </motion.button>
              ))}
            </nav>
            <div className="mt-10 flex flex-col gap-3">
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md bg-primary px-4 py-4 text-center font-display text-sm font-bold uppercase tracking-wide text-white"
              >
                Start Free Trial
              </a>
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="rounded-md border border-white/20 px-4 py-4 text-center font-mono text-xs uppercase tracking-widest text-white"
              >
                Agency Login
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

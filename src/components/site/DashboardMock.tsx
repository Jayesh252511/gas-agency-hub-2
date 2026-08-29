import { motion } from "framer-motion";
import { inr } from "@/lib/gas";

const BARS = [38, 62, 44, 78, 55, 92, 70, 84, 60, 96, 72, 88];

/** Elegant animated dashboard mock used wherever a product video would play. */
export function DashboardMock({ compact = false }: { compact?: boolean }) {
  return (
    <div className="h-full w-full bg-charcoal p-3 sm:p-5">
      <div className="flex items-center justify-between">
        <span className="font-pixel text-[8px] tracking-tight text-primary sm:text-[10px]">
          AGENCY.OS / LIVE
        </span>
        <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-gray-300">
          <span className="h-1.5 w-1.5 rounded-full bg-success animate-ember" /> synced
        </span>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 sm:gap-3">
        {[
          { k: "COLLECTION", v: inr(24580), c: "text-success" },
          { k: "UDHARI", v: inr(8240), c: "text-danger" },
          { k: "CYLINDERS", v: "428", c: "text-primary" },
        ].map((m, i) => (
          <motion.div
            key={m.k}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="rounded-lg border border-white/10 bg-charcoal-soft p-2 sm:p-3"
          >
            <div className="font-pixel text-[7px] tracking-tight text-gray-400 sm:text-[8px]">
              {m.k}
            </div>
            <div className={`mt-1 font-mono text-xs font-bold sm:text-base ${m.c}`}>{m.v}</div>
          </motion.div>
        ))}
      </div>

      <div className="mt-3 rounded-lg border border-white/10 bg-charcoal-soft p-3">
        <div className="flex h-16 items-end gap-1 sm:h-28 sm:gap-1.5">
          {BARS.map((b, i) => (
            <motion.span
              key={i}
              initial={{ height: 4 }}
              animate={{ height: `${b}%` }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                repeatType: "mirror",
                delay: i * 0.09,
                ease: "easeInOut",
              }}
              className="flex-1 rounded-sm bg-primary/80"
            />
          ))}
        </div>
      </div>

      {!compact && (
        <div className="mt-3 space-y-1.5">
          {[
            ["Ramesh Patil", "14.2kg x2", inr(1900), "text-success"],
            ["Sunita Sharma", "19kg x1", inr(1850), "text-primary"],
            ["Amit Verma", "Udhari", `-${inr(2400)}`, "text-danger"],
          ].map(([n, d, a, c]) => (
            <div
              key={n}
              className="flex items-center justify-between rounded-md border border-white/10 bg-charcoal-soft/80 px-2.5 py-1.5"
            >
              <span className="truncate font-sans text-[10px] text-white sm:text-xs font-medium">
                {n} · <span className="text-gray-400">{d}</span>
              </span>
              <span className={`font-mono text-[10px] sm:text-xs font-bold ${c}`}>{a}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

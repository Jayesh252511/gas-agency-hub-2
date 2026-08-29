const ITEMS = [
  "LPG Sales Management",
  "Customer Ledger",
  "Udhari Tracking",
  "Delivery Management",
  "Stock Inventory",
  "Cashbook",
  "Business Reports",
  "Multi-User Access",
  "Works on Mobile",
  "Made for India",
];

function Row({ dir }: { dir: "left" | "right" }) {
  const items = [...ITEMS, ...ITEMS];
  return (
    <div className="flex overflow-hidden">
      <div
        className={`flex w-max shrink-0 items-center ${
          dir === "left" ? "animate-marquee-left" : "animate-marquee-right"
        }`}
      >
        {items.map((t, i) => (
          <span
            key={`${t}-${i}`}
            className="flex items-center whitespace-nowrap px-5 py-3 font-mono text-xs uppercase tracking-[0.2em] text-white font-medium sm:text-sm"
          >
            {t}
            <span className="ml-5 text-primary">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function Marquee() {
  return (
    <section
      id="ticker"
      aria-label="Platform modules"
      className="marquee-group border-y border-primary/70 bg-charcoal"
    >
      <div className="border-b border-primary/30">
        <Row dir="left" />
      </div>
      <Row dir="right" />
    </section>
  );
}

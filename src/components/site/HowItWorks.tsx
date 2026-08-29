const STEPS = [
  {
    tag: "01 // SETUP",
    title: "Register Your Agency",
    body: "Create your agency account with a unique code in minutes. Zero technical overhead required.",
  },
  {
    tag: "02 // INGEST",
    title: "Add Customer Profiles",
    body: "Import or quickly add existing customer ledgers with contact info and running balance history.",
  },
  {
    tag: "03 // ENGINE",
    title: "Record Cylinder Sales",
    body: "Log daily refill bookings, collect payments, and auto-track credit udharis across any device.",
  },
  {
    tag: "04 // REPORT",
    title: "Export & Audit Dues",
    body: "Monitor real-time cash flow, print statement PDFs, and keep your agency 100% audit compliant.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-24 bg-surface px-4 py-20 sm:px-6 lg:px-14">
      <div className="mx-auto max-w-5xl">
        <span className="font-pixel text-[10px] tracking-tight text-primary">
          02 // SIMPLE PROCESS
        </span>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Up &amp; Running In 4 Easy Steps.
        </h2>

        <div className="mt-10">
          {STEPS.map((s, i) => (
            <div
              key={s.tag}
              className="sticky top-24 mb-6"
              style={{ zIndex: i + 1, top: `${96 + i * 18}px` }}
            >
              <article className="relative overflow-hidden rounded-2xl border border-hairline border-l-4 border-l-primary bg-card p-6 shadow-panel sm:p-10">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-2 -top-6 font-pixel text-[90px] leading-none text-foreground/5 sm:text-[130px]"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-pixel text-[9px] tracking-tight text-primary">{s.tag}</span>
                <h3 className="mt-3 font-display text-xl font-bold tracking-tight sm:text-3xl">
                  {s.title}
                </h3>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
                  {s.body}
                </p>
              </article>
            </div>
          ))}
        </div>

        <img
          src="/pixel-features.png"
          alt="Pixel art grid of GasAgency Hub feature icons"
          loading="lazy"
          width={1536}
          height={512}
          className="mt-14 w-full rounded-xl border border-hairline object-cover pixelated"
        />
      </div>
    </section>
  );
}

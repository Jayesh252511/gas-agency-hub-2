import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { inr } from "@/lib/gas";

/* ---------------- shared bits ---------------- */

function Btn({
  children,
  onClick,
  tone = "solid",
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  tone?: "solid" | "ghost" | "success" | "danger";
  disabled?: boolean;
}) {
  const tones = {
    solid: "bg-primary text-primary-foreground shadow-glow",
    ghost: "border border-hairline bg-card text-foreground",
    success: "bg-success text-primary-foreground",
    danger: "bg-danger text-primary-foreground",
  } as const;
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 font-display text-[11px] font-bold uppercase tracking-wide transition-transform duration-150 active:translate-y-px disabled:opacity-40 ${tones[tone]}`}
    >
      {children}
    </button>
  );
}

function CountUp({ to, className }: { to: number; className?: string }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / 900);
      setV(to * (1 - Math.pow(1 - k, 3)));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return <span className={`font-mono ${className ?? ""}`}>{inr(v)}</span>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-pixel text-[8px] tracking-tight text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

const selectCls =
  "w-full rounded-md border border-hairline bg-card px-3 py-2 font-mono text-xs text-foreground";

/* ---------------- 1. Sales ---------------- */

const CYLS = [
  { id: "d14", name: "14.2kg Domestic", price: 950 },
  { id: "c19", name: "19kg Commercial", price: 1850 },
  { id: "s5", name: "5kg Chotu", price: 420 },
];
const CUSTOMERS = ["Ramesh Patil", "Sunita Sharma", "Amit Verma"];

function Sales() {
  const [cust, setCust] = useState(CUSTOMERS[0]);
  const [cyl, setCyl] = useState(CYLS[0].id);
  const [qty, setQty] = useState(2);
  const [mode, setMode] = useState<"Cash" | "UPI" | "Udhari">("Cash");
  const [receipt, setReceipt] = useState<null | { no: number; total: number }>(null);
  const price = CYLS.find((c) => c.id === cyl)!.price;
  const total = price * qty;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-3">
        <Field label="CUSTOMER">
          <select className={selectCls} value={cust} onChange={(e) => setCust(e.target.value)}>
            {CUSTOMERS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>
        <Field label="CYLINDER TYPE">
          <select className={selectCls} value={cyl} onChange={(e) => setCyl(e.target.value)}>
            {CYLS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} — {inr(c.price)}
              </option>
            ))}
          </select>
        </Field>
        <Field label="QUANTITY">
          <div className="flex items-center gap-2">
            <Btn tone="ghost" onClick={() => setQty((q) => Math.max(1, q - 1))}>
              −
            </Btn>
            <span className="w-10 text-center font-mono text-sm">{qty}</span>
            <Btn tone="ghost" onClick={() => setQty((q) => Math.min(50, q + 1))}>
              +
            </Btn>
          </div>
        </Field>
        <Field label="PAYMENT MODE">
          <div className="flex gap-2">
            {(["Cash", "UPI", "Udhari"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`rounded-md px-3 py-2 font-mono text-[11px] transition-colors ${
                  mode === m
                    ? "bg-primary text-primary-foreground"
                    : "border border-hairline bg-card text-muted-foreground"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </Field>
      </div>

      <div className="flex flex-col justify-between rounded-lg border border-hairline bg-surface-2 p-4">
        <div>
          <div className="font-pixel text-[8px] text-muted-foreground">LIVE TOTAL</div>
          <div className="mt-2 font-mono text-3xl font-bold">{inr(total)}</div>
          <p className="mt-2 font-mono text-[11px] text-muted-foreground">
            {qty} × {inr(price)} · {mode}
          </p>
        </div>
        <Btn
          onClick={() => {
            setReceipt({ no: 1042 + qty, total });
            toast.success("Receipt generated", { description: `${cust} · ${inr(total)}` });
          }}
        >
          Generate Receipt
        </Btn>
        <AnimatePresence>
          {receipt && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-3 overflow-hidden"
            >
              <div className="rounded-t-md border border-hairline bg-card p-3 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span>RECEIPT #{receipt.no}</span>
                  <span>{mode}</span>
                </div>
                <div className="mt-1 flex justify-between text-muted-foreground">
                  <span>{cust}</span>
                  <span>{inr(receipt.total)}</span>
                </div>
              </div>
              <div
                className="h-2 bg-card"
                style={{
                  clipPath:
                    "polygon(0 0,4% 100%,8% 0,12% 100%,16% 0,20% 100%,24% 0,28% 100%,32% 0,36% 100%,40% 0,44% 100%,48% 0,52% 100%,56% 0,60% 100%,64% 0,68% 100%,72% 0,76% 100%,80% 0,84% 100%,88% 0,92% 100%,96% 0,100% 100%)",
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ---------------- 2. Ledger ---------------- */

const LEDGER: Record<string, { date: string; note: string; dr?: number; cr?: number }[]> = {
  "Ramesh Patil": [
    { date: "02 Aug", note: "2 × 14.2kg refill", dr: 1900 },
    { date: "05 Aug", note: "Cash received", cr: 1000 },
    { date: "11 Aug", note: "1 × 14.2kg refill", dr: 950 },
  ],
  "Sunita Sharma": [
    { date: "01 Aug", note: "1 × 19kg refill", dr: 1850 },
    { date: "03 Aug", note: "UPI received", cr: 1850 },
  ],
  "Amit Verma": [
    { date: "04 Aug", note: "3 × 5kg Chotu", dr: 1260 },
    { date: "09 Aug", note: "Part payment", cr: 500 },
  ],
};

function Ledger() {
  const [cust, setCust] = useState(CUSTOMERS[0]);
  let bal = 0;
  return (
    <div className="grid gap-4 sm:grid-cols-[180px_1fr]">
      <ul className="space-y-2">
        {CUSTOMERS.map((c) => (
          <li key={c}>
            <button
              type="button"
              onClick={() => setCust(c)}
              className={`w-full rounded-md px-3 py-2.5 text-left font-sans text-xs transition-colors ${
                cust === c
                  ? "bg-primary text-primary-foreground"
                  : "border border-hairline bg-card hover:bg-secondary"
              }`}
            >
              {c}
            </button>
          </li>
        ))}
      </ul>
      <div className="overflow-hidden rounded-lg border border-hairline">
        <table className="w-full text-left">
          <caption className="sr-only">Ledger for {cust}</caption>
          <thead className="bg-surface-2">
            <tr className="font-pixel text-[8px] text-muted-foreground">
              <th className="px-3 py-2">DATE</th>
              <th className="px-3 py-2">PARTICULARS</th>
              <th className="px-3 py-2 text-right">DR</th>
              <th className="px-3 py-2 text-right">CR</th>
              <th className="px-3 py-2 text-right">BALANCE</th>
            </tr>
          </thead>
          <tbody className="font-mono text-[11px]">
            {LEDGER[cust].map((r) => {
              bal += (r.dr ?? 0) - (r.cr ?? 0);
              return (
                <tr key={r.date + r.note} className="border-t border-hairline">
                  <td className="px-3 py-2 text-muted-foreground">{r.date}</td>
                  <td className="px-3 py-2 font-sans">{r.note}</td>
                  <td className="px-3 py-2 text-right text-danger">
                    {r.dr ? inr(r.dr) : "—"}
                  </td>
                  <td className="px-3 py-2 text-right text-success">
                    {r.cr ? inr(r.cr) : "—"}
                  </td>
                  <td className="px-3 py-2 text-right font-bold">{inr(bal)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------------- 3. Udhari ---------------- */

type Due = { id: number; name: string; amount: number; days: number; paid: boolean };

function Udhari() {
  const [dues, setDues] = useState<Due[]>([
    { id: 1, name: "Ramesh Patil", amount: 1850, days: 12, paid: false },
    { id: 2, name: "Amit Verma", amount: 760, days: 5, paid: false },
    { id: 3, name: "Kirana Corner", amount: 3400, days: 24, paid: false },
    { id: 4, name: "Sunita Sharma", amount: 2230, days: 3, paid: false },
  ]);
  const total = dues.filter((d) => !d.paid).reduce((s, d) => s + d.amount, 0);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between rounded-lg border border-hairline bg-surface-2 px-4 py-3">
        <span className="font-pixel text-[9px] text-muted-foreground">TOTAL OUTSTANDING</span>
        <span className="font-mono text-xl font-bold text-danger">{inr(total)}</span>
      </div>
      <ul className="space-y-2">
        {dues.map((d) => (
          <motion.li
            key={d.id}
            layout
            className={`grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg border p-3 transition-colors ${
              d.paid ? "border-success/40 bg-success/10" : "border-hairline bg-card"
            }`}
          >
            <div className="min-w-0">
              <p className="truncate font-sans text-xs font-medium">{d.name}</p>
              <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                {inr(d.amount)}{" "}
                <span
                  className={`ml-2 rounded px-1.5 py-0.5 text-[9px] ${
                    d.days > 10 ? "bg-danger/15 text-danger" : "bg-warn/20 text-foreground"
                  }`}
                >
                  {d.days}d overdue
                </span>
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Btn
                tone="success"
                disabled={d.paid}
                onClick={() => {
                  setDues((p) => p.map((x) => (x.id === d.id ? { ...x, paid: true } : x)));
                  toast.success("Payment collected", {
                    description: `${d.name} · ${inr(d.amount)}`,
                  });
                }}
              >
                {d.paid ? "Paid" : "Collect"}
              </Btn>
              <Btn
                tone="ghost"
                onClick={() =>
                  toast("WhatsApp reminder sent", { description: `To ${d.name} · ${inr(d.amount)}` })
                }
              >
                Remind
              </Btn>
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------- 4. Cashbook ---------------- */

function Cashbook() {
  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { k: "CASH INFLOW", v: 4000, c: "text-success" },
          { k: "CASH OUTFLOW", v: 2500, c: "text-danger" },
          { k: "NET CASH BALANCE", v: 1500, c: "text-foreground" },
        ].map((m) => (
          <div key={m.k} className="rounded-lg border border-hairline bg-card p-4">
            <div className="font-pixel text-[8px] text-muted-foreground">{m.k}</div>
            <CountUp to={m.v} className={`mt-2 block text-2xl font-bold ${m.c}`} />
          </div>
        ))}
      </div>
      <ul className="mt-4 space-y-2">
        {[
          ["Refill collection — Ramesh", 1900, true],
          ["UPI — Sunita Sharma", 2100, true],
          ["Supplier payment — HP depot", 2000, false],
          ["Delivery fuel", 500, false],
        ].map(([n, a, inflow]) => (
          <li
            key={n as string}
            className="flex items-center justify-between rounded-md border border-hairline bg-card px-3 py-2"
          >
            <span className="truncate font-sans text-xs">{n as string}</span>
            <span className={`font-mono text-xs ${inflow ? "text-success" : "text-danger"}`}>
              {inflow ? "+" : "−"}
              {inr(a as number)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------- 5. Delivery ---------------- */

function Delivery() {
  const [assigned, setAssigned] = useState(0);
  const staff = [
    { name: "Raju Kumar", done: 3, pending: 2 + assigned },
    { name: "Santosh Patil", done: 5, pending: 0 },
  ];
  return (
    <div className="space-y-3">
      {staff.map((s) => (
        <div key={s.name} className="rounded-lg border border-hairline bg-card p-4">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <p className="truncate font-sans text-sm font-medium">{s.name}</p>
            <div className="flex shrink-0 gap-2 font-mono text-[10px]">
              <span className="rounded bg-success/15 px-2 py-1 text-success">{s.done} Done</span>
              <span
                className={`rounded px-2 py-1 ${
                  s.pending ? "bg-warn/20 text-foreground" : "bg-secondary text-muted-foreground"
                }`}
              >
                {s.pending ? `${s.pending} Pending` : "All Done"}
              </span>
            </div>
          </div>
          <div className="relative mt-4 h-1 rounded-full bg-hairline">
            <motion.span
              animate={{ left: ["0%", "100%"] }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              className="absolute -top-1 h-3 w-3 rounded-full bg-primary shadow-glow"
            />
          </div>
        </div>
      ))}
      <Btn
        onClick={() => {
          setAssigned((a) => a + 1);
          toast.success("Order assigned to Raju Kumar");
        }}
      >
        Assign Order
      </Btn>
    </div>
  );
}

/* ---------------- 6. Stock ---------------- */

function Stock() {
  const items = [
    { n: "14.2kg Domestic", have: 142, cap: 200 },
    { n: "19kg Commercial", have: 28, cap: 60 },
    { n: "5kg Cylinder", have: 15, cap: 40 },
  ];
  return (
    <div className="space-y-4">
      {items.map((i) => {
        const pct = (i.have / i.cap) * 100;
        const tone = pct < 40 ? "bg-danger" : pct < 60 ? "bg-warn" : "bg-success";
        return (
          <div key={i.n}>
            <div className="flex items-center justify-between">
              <span className="font-sans text-xs">{i.n}</span>
              <span className="font-mono text-xs text-muted-foreground">
                {i.have}/{i.cap}
              </span>
            </div>
            <div className="mt-2 h-3 overflow-hidden rounded-full bg-secondary">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ type: "spring", stiffness: 60, damping: 18 }}
                className={`h-full rounded-full ${tone}`}
              />
            </div>
          </div>
        );
      })}
      <p className="font-mono text-[11px] text-muted-foreground">
        Empty inventory auto-calculated: 115 units available for pickup.
      </p>
    </div>
  );
}

/* ---------------- 7. Inflow / Outflow ---------------- */

function Flow() {
  const inflow = [
    ["Ramesh Patil", 1900],
    ["Sunita Sharma", 2100],
    ["Kirana Corner", 3400],
  ] as const;
  const outflow = [
    ["HP Depot refill", 2000],
    ["Delivery fuel", 500],
    ["Staff advance", 1200],
  ] as const;
  const inSum = inflow.reduce((s, r) => s + r[1], 0);
  const outSum = outflow.reduce((s, r) => s + r[1], 0);
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          { title: "INFLOW ▲", rows: inflow, c: "text-success", b: "border-success/30" },
          { title: "OUTFLOW ▼", rows: outflow, c: "text-danger", b: "border-danger/30" },
        ].map((col) => (
          <div key={col.title} className={`rounded-lg border ${col.b} bg-card p-4`}>
            <div className={`font-pixel text-[9px] ${col.c}`}>{col.title}</div>
            <ul className="mt-3 space-y-2">
              {col.rows.map(([n, a]) => (
                <li key={n} className="flex justify-between">
                  <span className="truncate font-sans text-xs">{n}</span>
                  <span className={`font-mono text-xs ${col.c}`}>{inr(a)}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between rounded-lg bg-surface-2 px-4 py-3">
        <span className="font-pixel text-[9px] text-muted-foreground">NET POSITION</span>
        <span className="font-mono text-lg font-bold">{inr(inSum - outSum)}</span>
      </div>
    </div>
  );
}

/* ---------------- 8. Reports ---------------- */

function Reports() {
  const [busy, setBusy] = useState<string | null>(null);
  const [pct, setPct] = useState(0);
  const run = (kind: string) => {
    if (busy) return;
    setBusy(kind);
    setPct(0);
    const t = setInterval(() => {
      setPct((p) => {
        if (p >= 100) {
          clearInterval(t);
          setBusy(null);
          toast.success(`${kind} export ready`, { description: "August 2026 statement" });
          return 100;
        }
        return p + 10;
      });
    }, 70);
  };
  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-4">
        {[
          ["MONTHLY REVENUE", inr(324580)],
          ["CYLINDERS SOLD", "428"],
          ["TOTAL UDHARI", inr(18240)],
          ["NET REVENUE", inr(306340)],
        ].map(([k, v]) => (
          <div key={k} className="rounded-lg border border-hairline bg-card p-3">
            <div className="font-pixel text-[7px] text-muted-foreground">{k}</div>
            <div className="mt-1.5 font-mono text-sm font-bold">{v}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex h-32 items-end gap-2 rounded-lg border border-hairline bg-card p-4">
        {[45, 62, 38, 74, 58, 88, 66, 92, 70, 84, 76, 96].map((h, i) => (
          <motion.span
            key={i}
            initial={{ height: 2 }}
            animate={{ height: `${h}%` }}
            transition={{ delay: i * 0.05, type: "spring", stiffness: 90, damping: 16 }}
            className="flex-1 rounded-sm bg-primary"
          />
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Btn onClick={() => run("PDF")}>Export PDF</Btn>
        <Btn tone="ghost" onClick={() => run("Excel")}>
          Export Excel
        </Btn>
        {busy && (
          <div className="h-2 w-40 overflow-hidden rounded-full bg-secondary">
            <div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} />
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- 9. Users ---------------- */

const ROLES = ["Owner", "Manager", "Operator"] as const;
type Role = (typeof ROLES)[number];
const PERMS = ["Billing", "Ledger", "Reports", "Stock", "Staff"];
const MATRIX: Record<Role, boolean[]> = {
  Owner: [true, true, true, true, true],
  Manager: [true, true, true, true, false],
  Operator: [true, false, false, false, false],
};

function Users() {
  const [users, setUsers] = useState<{ name: string; role: Role }[]>([
    { name: "Jayesh (You)", role: "Owner" },
    { name: "Pooja Desai", role: "Manager" },
    { name: "Imran Shaikh", role: "Operator" },
  ]);
  return (
    <div className="space-y-3">
      {users.map((u, i) => (
        <div key={u.name} className="rounded-lg border border-hairline bg-card p-4">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <p className="truncate font-sans text-sm font-medium">{u.name}</p>
            <select
              aria-label={`Role for ${u.name}`}
              className="shrink-0 rounded-md border border-hairline bg-surface-2 px-2 py-1.5 font-mono text-[11px]"
              value={u.role}
              onChange={(e) => {
                const role = e.target.value as Role;
                setUsers((p) => p.map((x, k) => (k === i ? { ...x, role } : x)));
                toast.success(`${u.name} is now ${role}`);
              }}
            >
              {ROLES.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {PERMS.map((p, k) => (
              <span
                key={p}
                className={`flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-[10px] transition-colors ${
                  MATRIX[u.role][k]
                    ? "bg-primary/12 text-primary"
                    : "bg-secondary text-muted-foreground line-through"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    MATRIX[u.role][k] ? "bg-primary" : "bg-muted-foreground/50"
                  }`}
                />
                {p}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------------- console ---------------- */

const TABS = [
  { key: "sales", label: "Sales Management", url: "gasagency.app/sales", desc: "Record every cylinder & regulator sale instantly. View daily summaries, print receipts, and track order statuses dynamically.", Comp: Sales },
  { key: "customers", label: "Customer Ledger", url: "gasagency.app/customers", desc: "Maintain digital profiles for every customer. Check complete history of refuels, payments, and running debit/credit statements.", Comp: Ledger },
  { key: "udhari", label: "Udhari / Credit Book", url: "gasagency.app/udhari", desc: "Know who owes you outstanding balance at all times. Log credit receipts, collect pending dues, and send WhatsApp reminders.", Comp: Udhari },
  { key: "cashbook", label: "Cashbook & Payments", url: "gasagency.app/cashbook", desc: "Record all incoming cash collections and outgoing expenses. Check daily cash-in-hand totals and net bank balances.", Comp: Cashbook },
  { key: "delivery", label: "Delivery Manager", url: "gasagency.app/delivery", desc: "Assign orders to delivery boys. Track active pending deliveries, route coordinates, and staff refill commissions.", Comp: Delivery },
  { key: "products", label: "Product & Stock", url: "gasagency.app/products", desc: "Monitor live stock levels for 14.2kg domestic, 19kg commercial, and 5kg cylinders. Auto-calculate available empty inventory.", Comp: Stock },
  { key: "payments", label: "Inflow & Outflow", url: "gasagency.app/payments", desc: "Track full cash entries separated into customer payments received and supplier/vendor expenditures paid.", Comp: Flow },
  { key: "reports", label: "Reports & Analytics", url: "gasagency.app/reports", desc: "Generate professional monthly sales statements. Track revenue and credit changes, and export clean PDF/Excel documents.", Comp: Reports },
  { key: "users", label: "Multi-User & Staff Roles", url: "gasagency.app/users", desc: "Manage permission levels for agency staff. Add managers with select reports access or operators with bill-only roles.", Comp: Users },
];

export function Workbench() {
  const [active, setActive] = useState(0);
  const tab = TABS[active];
  const Active = tab.Comp;

  return (
    <section id="workbench" className="scroll-mt-24 bg-charcoal border-t border-white/10 px-4 py-20 sm:px-6 lg:px-14">
      <div id="features" className="mx-auto max-w-7xl scroll-mt-24">
        <span className="font-pixel text-[10px] tracking-tight text-primary">
          ▶ // APP WORKBENCH
        </span>
        <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
          NINE MODULES. ONE CONSOLE. TRY THEM ALL.
        </h2>

        <div className="relative mt-10 rounded-3xl border-[10px] border-charcoal bg-charcoal p-3 shadow-panel sm:p-5">
          {[
            "left-2 top-2",
            "right-2 top-2",
            "left-2 bottom-2",
            "right-2 bottom-2",
          ].map((pos) => (
            <span
              key={pos}
              aria-hidden="true"
              className={`absolute ${pos} h-2 w-2 rounded-full bg-white/20`}
            />
          ))}

          <div className="mb-3 flex items-center gap-2">
            {TABS.map((t, i) => (
              <span
                key={t.key}
                aria-hidden="true"
                className={`h-1.5 w-1.5 rounded-full transition-colors ${
                  i === active ? "bg-primary shadow-glow" : "bg-white/15"
                }`}
              />
            ))}
            <span className="ml-auto font-pixel text-[8px] text-secondary/50">
              SYS.ACTIVE
            </span>
          </div>

          <div className="grid gap-3 lg:grid-cols-[220px_1fr]">
            <div
              role="tablist"
              aria-label="Workbench modules"
              className="flex gap-2 overflow-x-auto no-scrollbar lg:flex-col lg:overflow-visible"
            >
              {TABS.map((t, i) => (
                <button
                  key={t.key}
                  role="tab"
                  aria-selected={i === active}
                  type="button"
                  onClick={() => setActive(i)}
                  className={`shrink-0 rounded-lg px-3 py-2.5 text-left font-display text-[11px] font-bold uppercase tracking-wide transition-all duration-150 lg:w-full ${
                    i === active
                      ? "translate-y-px bg-primary text-primary-foreground shadow-none"
                      : "border border-white/10 bg-charcoal-soft text-secondary/70 shadow-[0_3px_0_0_rgba(0,0,0,0.5)] hover:text-secondary"
                  }`}
                >
                  <span className="mr-2 font-pixel text-[8px] opacity-70">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {t.label}
                </button>
              ))}
            </div>

            <div className="overflow-hidden rounded-xl bg-background">
              <div className="flex items-center gap-2 border-b border-hairline bg-surface-2 px-3 py-2">
                <span className="h-2.5 w-2.5 rounded-full bg-danger" />
                <span className="h-2.5 w-2.5 rounded-full bg-warn" />
                <span className="h-2.5 w-2.5 rounded-full bg-success" />
                <span className="ml-2 truncate rounded bg-card px-2 py-1 font-mono text-[10px] text-muted-foreground">
                  {tab.url}
                </span>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={tab.key}
                  initial={{ opacity: 0, scale: 0.985 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.99 }}
                  transition={{ duration: 0.25 }}
                  className="p-4 sm:p-6"
                >
                  <h3 className="font-display text-lg font-bold tracking-tight">{tab.label}</h3>
                  <p className="mb-5 mt-1.5 max-w-2xl text-xs leading-relaxed text-muted-foreground">
                    {tab.desc}
                  </p>
                  <Active />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

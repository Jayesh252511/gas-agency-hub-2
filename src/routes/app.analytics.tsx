import { createFileRoute } from "@tanstack/react-router";
import { RequireAgencyUser } from "@/components/route-guards";
import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fmtCurrency, todayISO } from "@/lib/format";
import { subDays, format, parseISO, startOfMonth, endOfMonth, subMonths } from "date-fns";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { TrendingUp, BarChart2, PieChart as PieIcon, Users, Truck, Loader2 } from "lucide-react";

export const Route = createFileRoute("/app/analytics")({
  component: () => <RequireAgencyUser><AnalyticsPage /></RequireAgencyUser>,
});

const COLORS = {
  primary: "#6366f1",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  purple: "#8b5cf6",
  cyan: "#06b6d4",
  pink: "#ec4899",
  orange: "#f97316",
};

const PIE_COLORS = [COLORS.danger, COLORS.warning, COLORS.primary, COLORS.success];
const DONUT_COLORS = [COLORS.success, COLORS.primary, COLORS.danger, COLORS.warning];

type RangeOption = 30 | 60 | 90;

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label, currency = false }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl shadow-xl p-3 text-xs min-w-[120px]">
      {label && <p className="font-bold text-muted-foreground mb-1.5">{label}</p>}
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full" style={{ background: p.color || p.fill }} />
            <span className="text-muted-foreground">{p.name}</span>
          </span>
          <span className="font-bold text-foreground">
            {currency ? fmtCurrency(p.value) : p.value?.toLocaleString("en-IN")}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Section header ───────────────────────────────────────────────────────────
function SectionHeader({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <h2 className="font-bold text-sm text-foreground">{title}</h2>
        <p className="text-[11px] text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────
function ChartSkeleton() {
  return (
    <div className="flex items-center justify-center h-56 text-muted-foreground animate-pulse">
      <Loader2 className="w-6 h-6 animate-spin mr-2" />
      <span className="text-sm">Loading chart data...</span>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
function AnalyticsPage() {
  const { agency } = useAuth();
  const [range, setRange] = useState<RangeOption>(30);
  const [busy, setBusy] = useState(true);

  // Raw data
  const [salesData, setSalesData] = useState<any[]>([]);
  const [expensesData, setExpensesData] = useState<any[]>([]);
  const [ledgerData, setLedgerData] = useState<any[]>([]);
  const [paymentData, setPaymentData] = useState<any[]>([]);
  const [customerSalesData, setCustomerSalesData] = useState<any[]>([]);
  const [deliveryData, setDeliveryData] = useState<any[]>([]);

  useEffect(() => {
    if (!agency) return;
    loadAll();
  }, [agency, range]);

  const loadAll = async () => {
    if (!agency) return;
    setBusy(true);
    const today = todayISO();
    const fromDate = format(subDays(new Date(), range), "yyyy-MM-dd");
    const monthsBack = 6;

    try {
      const [salesQ, expQ, ledgerQ, paysQ, custSalesQ, boysQ, boySalesQ] = await Promise.all([
        // Sales for trend chart
        supabase.from("sales").select("sale_date, gross_amount, payment_mode, notes")
          .eq("agency_id", agency.id).eq("is_deleted", false)
          .gte("sale_date", fromDate).lte("sale_date", today),
        // Expenses for bar chart (monthly)
        supabase.from("expenses").select("expense_date, amount")
          .eq("agency_id", agency.id).eq("is_deleted", false)
          .gte("expense_date", format(subMonths(new Date(), monthsBack), "yyyy-MM-dd")),
        // Ledger for pie chart
        (supabase.from("customer_ledger") as any).select("customer_id, debit, credit, created_at")
          .eq("agency_id", agency.id),
        // Payments for donut
        supabase.from("payments").select("payment_date, amount, mode")
          .eq("agency_id", agency.id).eq("is_deleted", false)
          .gte("payment_date", fromDate),
        // Top customers by sales
        supabase.from("sales").select("customer_id, gross_amount, customer:customers(name)")
          .eq("agency_id", agency.id).eq("is_deleted", false)
          .gte("sale_date", fromDate).lte("sale_date", today),
        // Delivery boys
        supabase.from("delivery_boys").select("id, name")
          .eq("agency_id", agency.id).eq("is_deleted", false),
        // Delivery boy sales
        supabase.from("sales").select("delivery_boy_id, quantity, commission_amount, gross_amount, payment_mode, notes")
          .eq("agency_id", agency.id).eq("is_deleted", false)
          .gte("sale_date", fromDate).lte("sale_date", today),
      ]);

      setSalesData(salesQ.data ?? []);
      setExpensesData(expQ.data ?? []);
      setLedgerData(ledgerQ.data ?? []);
      setPaymentData(paysQ.data ?? []);

      // Top 10 customers by gross sales
      const custMap: Record<string, { name: string; total: number }> = {};
      (custSalesQ.data ?? []).forEach((s: any) => {
        if (!s.customer_id) return;
        const name = (s.customer as any)?.name ?? "Unknown";
        if (!custMap[s.customer_id]) custMap[s.customer_id] = { name, total: 0 };
        custMap[s.customer_id].total += Number(s.gross_amount || 0);
      });
      const top10 = Object.values(custMap).sort((a, b) => b.total - a.total).slice(0, 10);
      setCustomerSalesData(top10);

      // Delivery boys performance
      const boys = boysQ.data ?? [];
      const boySales = boySalesQ.data ?? [];
      const boyPerf = boys.map((boy: any) => {
        const bSales = (boySales as any[]).filter(s => s.delivery_boy_id === boy.id);
        const deliveries = bSales.reduce((s: number, x: any) => s + Number(x.quantity || 0), 0);
        const commission = bSales.reduce((s: number, x: any) => s + Number(x.commission_amount || 0), 0);
        let cashCollected = 0;
        bSales.forEach((s: any) => {
          let cashAmt = 0;
          if (s.notes) { try { const m = JSON.parse(s.notes); if (m?.is_split) cashAmt = Number(m.cash_amount || 0); } catch {} }
          if (!cashAmt && s.payment_mode === "cash") cashAmt = Number(s.gross_amount || 0);
          cashCollected += cashAmt;
        });
        return { name: boy.name, deliveries, commission, cashCollected };
      }).filter((b: any) => b.deliveries > 0);
      setDeliveryData(boyPerf);
    } catch (err) {
      console.error("Analytics error:", err);
    } finally {
      setBusy(false);
    }
  };

  // ── Chart 1: Sales Trend ──────────────────────────────────────────────────
  const salesTrendData = useMemo(() => {
    const grouped: Record<string, number> = {};
    salesData.forEach(s => {
      const d = s.sale_date;
      grouped[d] = (grouped[d] ?? 0) + Number(s.gross_amount || 0);
    });
    return Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)).map(([date, total]) => ({
      date: format(parseISO(date), "dd MMM"),
      Sales: Math.round(total),
    }));
  }, [salesData]);

  // ── Chart 2: Revenue vs Expenses (monthly) ────────────────────────────────
  const revenueExpBar = useMemo(() => {
    const months: Record<string, { Revenue: number; Expenses: number }> = {};
    // Revenue per month
    salesData.forEach(s => {
      const mo = s.sale_date?.substring(0, 7);
      if (!mo) return;
      if (!months[mo]) months[mo] = { Revenue: 0, Expenses: 0 };
      months[mo].Revenue += Number(s.gross_amount || 0);
    });
    expensesData.forEach((e: any) => {
      const mo = e.expense_date?.substring(0, 7);
      if (!mo) return;
      if (!months[mo]) months[mo] = { Revenue: 0, Expenses: 0 };
      months[mo].Expenses += Number(e.amount || 0);
    });
    return Object.entries(months).sort(([a], [b]) => a.localeCompare(b)).map(([month, val]) => ({
      month: format(parseISO(month + "-01"), "MMM yy"),
      Revenue: Math.round(val.Revenue),
      Expenses: Math.round(val.Expenses),
    }));
  }, [salesData, expensesData]);

  // ── Chart 3: Outstanding Aging Pie ────────────────────────────────────────
  const agingPieData = useMemo(() => {
    const now = new Date();
    const buckets = { "0–30 days": 0, "31–60 days": 0, "61–90 days": 0, "90+ days": 0 };

    // Build outstanding per customer
    const custOutstanding: Record<string, number> = {};
    ledgerData.forEach((r: any) => {
      custOutstanding[r.customer_id] = (custOutstanding[r.customer_id] ?? 0) + Number(r.debit || 0) - Number(r.credit || 0);
    });

    // For simplicity, bucket by earliest debit date still unpaid
    const custEarliestDebit: Record<string, Date> = {};
    ledgerData.filter((r: any) => Number(r.debit || 0) > 0).forEach((r: any) => {
      const d = new Date(r.created_at);
      if (!custEarliestDebit[r.customer_id] || d < custEarliestDebit[r.customer_id]) {
        custEarliestDebit[r.customer_id] = d;
      }
    });

    Object.entries(custOutstanding).forEach(([cid, amt]) => {
      if (amt <= 0) return;
      const earliest = custEarliestDebit[cid];
      if (!earliest) { buckets["90+ days"] += amt; return; }
      const days = Math.floor((now.getTime() - earliest.getTime()) / 86400000);
      if (days <= 30) buckets["0–30 days"] += amt;
      else if (days <= 60) buckets["31–60 days"] += amt;
      else if (days <= 90) buckets["61–90 days"] += amt;
      else buckets["90+ days"] += amt;
    });

    return Object.entries(buckets).filter(([, v]) => v > 0).map(([name, value]) => ({
      name, value: Math.round(value)
    }));
  }, [ledgerData]);

  // ── Chart 4: Payment Mode Donut ────────────────────────────────────────────
  const paymentModeData = useMemo(() => {
    const modes: Record<string, number> = { Cash: 0, Online: 0, Credit: 0 };
    salesData.forEach(s => {
      const amt = Number(s.gross_amount || 0);
      if (s.notes) {
        try {
          const m = JSON.parse(s.notes);
          if (m?.is_split) {
            modes["Cash"] += Number(m.cash_amount || 0);
            modes["Online"] += Number(m.online_amount || 0);
            modes["Credit"] += Number(m.credit_amount || 0);
            return;
          }
        } catch {}
      }
      if (s.payment_mode === "cash") modes["Cash"] += amt;
      else if (s.payment_mode === "credit") modes["Credit"] += amt;
      else modes["Online"] += amt;
    });
    // Include payment recoveries in Cash
    paymentData.forEach((p: any) => {
      if (p.mode === "cash") modes["Cash"] += Number(p.amount || 0);
      else modes["Online"] += Number(p.amount || 0);
    });
    return Object.entries(modes).filter(([, v]) => v > 0).map(([name, value]) => ({
      name, value: Math.round(value)
    }));
  }, [salesData, paymentData]);

  const RANGE_LABELS = { 30: "30 Days", 60: "60 Days", 90: "90 Days" };

  return (
    <div className="space-y-8 pb-12 animate-page-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
            <BarChart2 className="h-6 w-6 text-primary" />
            Analytics
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Business intelligence at a glance</p>
        </div>
        {/* Range Selector */}
        <div className="flex items-center gap-1 bg-muted/60 rounded-xl p-1 shrink-0">
          {([30, 60, 90] as RangeOption[]).map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                range === r
                  ? "bg-primary text-white shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {RANGE_LABELS[r]}
            </button>
          ))}
        </div>
      </div>

      {/* ── Row 1: Sales Trend + Revenue vs Expenses ─────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Sales Trend Area Chart */}
        <Card className="shadow-soft overflow-hidden">
          <CardContent className="p-5">
            <SectionHeader
              icon={<TrendingUp className="h-4 w-4" />}
              title={`Sales Trend — Last ${range} Days`}
              subtitle="Daily gross sales volume"
            />
            {busy ? <ChartSkeleton /> : salesTrendData.length === 0 ? (
              <div className="h-56 flex items-center justify-center text-sm text-muted-foreground">No sales data in this range.</div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={salesTrendData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} width={42} />
                  <Tooltip content={<ChartTooltip currency />} />
                  <Area type="monotone" dataKey="Sales" stroke={COLORS.primary} strokeWidth={2.5} fill="url(#salesGrad)" dot={false} activeDot={{ r: 5, strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Revenue vs Expenses Bar Chart */}
        <Card className="shadow-soft overflow-hidden">
          <CardContent className="p-5">
            <SectionHeader
              icon={<BarChart2 className="h-4 w-4" />}
              title="Revenue vs Expenses"
              subtitle="Monthly comparison (last 6 months)"
            />
            {busy ? <ChartSkeleton /> : revenueExpBar.length === 0 ? (
              <div className="h-56 flex items-center justify-center text-sm text-muted-foreground">No data available.</div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={revenueExpBar} margin={{ top: 4, right: 4, left: 0, bottom: 0 }} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} width={42} />
                  <Tooltip content={<ChartTooltip currency />} />
                  <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                  <Bar dataKey="Revenue" fill={COLORS.primary} radius={[4, 4, 0, 0]} maxBarSize={32} />
                  <Bar dataKey="Expenses" fill={COLORS.danger} radius={[4, 4, 0, 0]} maxBarSize={32} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Row 2: Aging Pie + Payment Mode Donut ─────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Outstanding Aging Pie */}
        <Card className="shadow-soft overflow-hidden">
          <CardContent className="p-5">
            <SectionHeader
              icon={<PieIcon className="h-4 w-4" />}
              title="Customer Outstanding Aging"
              subtitle="Breakdown by overdue days bucket"
            />
            {busy ? <ChartSkeleton /> : agingPieData.length === 0 ? (
              <div className="h-56 flex items-center justify-center text-sm text-muted-foreground">No outstanding dues 🎉</div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={agingPieData} cx="50%" cy="50%" outerRadius={80} innerRadius={40} paddingAngle={3} dataKey="value">
                      {agingPieData.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip currency />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 shrink-0 min-w-[140px]">
                  {agingPieData.map((d, i) => (
                    <div key={d.name} className="flex items-center gap-2 text-xs">
                      <span className="w-3 h-3 rounded-sm shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                      <span className="text-muted-foreground">{d.name}</span>
                      <span className="ml-auto font-bold text-foreground">{fmtCurrency(d.value)}</span>
                    </div>
                  ))}
                  <div className="border-t border-border pt-2 mt-2 flex items-center justify-between text-xs font-bold">
                    <span className="text-muted-foreground">Total</span>
                    <span className="text-destructive">{fmtCurrency(agingPieData.reduce((s, d) => s + d.value, 0))}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Mode Donut */}
        <Card className="shadow-soft overflow-hidden">
          <CardContent className="p-5">
            <SectionHeader
              icon={<PieIcon className="h-4 w-4" />}
              title="Payment Mode Split"
              subtitle={`Cash vs Online vs Credit — Last ${range} days`}
            />
            {busy ? <ChartSkeleton /> : paymentModeData.length === 0 ? (
              <div className="h-56 flex items-center justify-center text-sm text-muted-foreground">No payment data.</div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={paymentModeData} cx="50%" cy="50%" outerRadius={80} innerRadius={50} paddingAngle={3} dataKey="value">
                      {paymentModeData.map((_, i) => (
                        <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip currency />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 shrink-0 min-w-[140px]">
                  {paymentModeData.map((d, i) => {
                    const total = paymentModeData.reduce((s, x) => s + x.value, 0);
                    const pct = total > 0 ? ((d.value / total) * 100).toFixed(1) : "0";
                    return (
                      <div key={d.name} className="flex items-center gap-2 text-xs">
                        <span className="w-3 h-3 rounded-sm shrink-0" style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }} />
                        <span className="text-muted-foreground">{d.name}</span>
                        <span className="ml-auto font-bold text-foreground">{pct}%</span>
                      </div>
                    );
                  })}
                  <div className="border-t border-border pt-2 mt-2 flex items-center justify-between text-xs font-bold">
                    <span className="text-muted-foreground">Total</span>
                    <span className="text-foreground">{fmtCurrency(paymentModeData.reduce((s, d) => s + d.value, 0))}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Row 3: Top 10 Customers ──────────────────────────────────────────── */}
      <Card className="shadow-soft overflow-hidden">
        <CardContent className="p-5">
          <SectionHeader
            icon={<Users className="h-4 w-4" />}
            title={`Top 10 Customers by Sales — Last ${range} Days`}
            subtitle="Ranked by gross sales value"
          />
          {busy ? <ChartSkeleton /> : customerSalesData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-sm text-muted-foreground">No customer sales in this range.</div>
          ) : (
            <ResponsiveContainer width="100%" height={Math.max(200, customerSalesData.length * 38)}>
              <BarChart
                layout="vertical"
                data={customerSalesData.map(c => ({ name: c.name.length > 18 ? c.name.substring(0, 18) + "…" : c.name, Sales: Math.round(c.total) }))}
                margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 11, fill: "hsl(var(--foreground))" }} tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltip currency />} />
                <Bar dataKey="Sales" fill={COLORS.primary} radius={[0, 4, 4, 0]} maxBarSize={22}>
                  {customerSalesData.map((_, i) => (
                    <Cell key={i} fill={i === 0 ? COLORS.warning : i === 1 ? COLORS.primary : i === 2 ? COLORS.cyan : COLORS.purple} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* ── Row 4: Delivery Boy Performance ────────────────────────────────── */}
      <Card className="shadow-soft overflow-hidden">
        <CardContent className="p-5">
          <SectionHeader
            icon={<Truck className="h-4 w-4" />}
            title={`Delivery Boy Performance — Last ${range} Days`}
            subtitle="Deliveries, commission earned, and cash collected"
          />
          {busy ? <ChartSkeleton /> : deliveryData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-sm text-muted-foreground">No delivery data in this range.</div>
          ) : (
            <ResponsiveContainer width="100%" height={Math.max(200, deliveryData.length * 52)}>
              <BarChart
                data={deliveryData}
                margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
                barGap={3}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} width={42} />
                <Tooltip content={<ChartTooltip currency />} />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                <Bar dataKey="commission" name="Commission Earned" fill={COLORS.warning} radius={[4, 4, 0, 0]} maxBarSize={28} />
                <Bar dataKey="cashCollected" name="Cash Collected" fill={COLORS.success} radius={[4, 4, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

    </div>
  );
}

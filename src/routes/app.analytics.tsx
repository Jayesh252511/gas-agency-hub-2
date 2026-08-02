import { createFileRoute } from "@tanstack/react-router";
import { RequireAgencyUser } from "@/components/route-guards";
import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { fmtCurrency, fmtDate, todayISO } from "@/lib/format";
import { subDays, format } from "date-fns";
import { BookOpen, Calendar, Loader2, ArrowUpRight, ArrowDownRight, IndianRupee, FileText, CheckCircle2, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/app/analytics")({
  component: () => <RequireAgencyUser><AnalyticsPage /></RequireAgencyUser>,
});

interface CashbookAnalyticsRow {
  book_date: string;
  opening_cash: number;
  total_inflow: number;
  total_outflow: number;
  calculated_balance: number;
  actual_closing: number | null;
  difference: number | null;
  notes: string | null;
  daily_note: string | null;
}

/* ── Authoritative Daily Cashbook Calculation Engine ── */
function computeDailyCashbookEngine(params: {
  openingCash: number;
  dailySales: any[];
  dailyPayments: any[];
  dailyExpenses: any[];
  notesMeta?: any;
}) {
  const { openingCash, dailySales, dailyPayments, dailyExpenses, notesMeta } = params;

  const otherReceiptsList: any[] = Array.isArray(notesMeta?.other_receipts) ? notesMeta.other_receipts : [];
  const pendingBills: any[] = Array.isArray(notesMeta?.pending_bills) ? notesMeta.pending_bills : [];
  const magilBills: any[] = Array.isArray(notesMeta?.magil_bills) ? notesMeta.magil_bills : [];
  const paymentInflows: any[] = Array.isArray(notesMeta?.payment_inflows) ? notesMeta.payment_inflows : [];
  const paymentOutflows: any[] = Array.isArray(notesMeta?.payment_outflows) ? notesMeta.payment_outflows : [];
  const outstandingEntries: any[] = Array.isArray(notesMeta?.outstanding_entries) ? notesMeta.outstanding_entries : [];

  let homeTotal = 0, cncTotal = 0;
  const productSalesTotals: Record<string, { quantity: number; total: number }> = {};
  const commissionByDriver: Record<string, { name: string; amount: number; qty: number }> = {};
  const onlineByDriver: Record<string, { name: string; qty: number; amount: number }> = {};
  const prepByDriver: Record<string, { name: string; qty: number; amount: number }> = {};
  const prepByProduct: Record<string, { qty: number; amount: number }> = {};
  const chequeByCustomer: Record<string, { name: string; amount: number }> = {};
  const udhariByCustomer: Record<string, { name: string; amount: number }> = {};

  dailySales.forEach((s) => {
    const pName = s.product?.name ?? s.product_name ?? "Cylinder";
    const nl = pName.toLowerCase();
    const isMain = nl.includes("14.2") || nl.includes("14 kg") || nl.includes("domestic") || nl.includes("cylinder") || nl === "lpg" || nl === "gas";
    const isHome = nl.includes("home") || nl.includes("delivery") || (!!s.delivery_boy_id && !nl.includes("cnc"));
    const isCNC = !isHome;

    const qty = Number(s.quantity || 0);
    const rate = Number(s.rate || 0);
    const grossTotal = Number(s.gross_amount ?? (qty * rate));
    const commTotal = Number(s.commission_amount || 0);
    const dbName = s.delivery_boy?.name ?? s.delivery_boy_name ?? null;
    const custName = s.customer?.name ?? s.customer_name ?? "Walk-in";

    let isSplit = false;
    let onlineAmt = 0;
    let creditAmt = 0;
    let prepQty = 0;
    let userNote = "";
    if (s.notes) {
      try {
        const m = typeof s.notes === "string" ? JSON.parse(s.notes) : s.notes;
        if (m && typeof m === "object") {
          if (m.is_split) {
            isSplit = true;
            onlineAmt = Number(m.online_amount || 0);
            creditAmt = Number(m.credit_amount || 0);
          }
          if (m.website_prepaid_qty != null) {
            prepQty = Number(m.website_prepaid_qty);
          }
          if (m.remarks && typeof m.remarks === "string" && m.remarks.trim() !== "") {
            userNote = m.remarks.trim();
          }
        }
      } catch (_) {
        if (typeof s.notes === "string" && s.notes.trim() !== "" && !s.notes.startsWith("{")) {
          userNote = s.notes.trim();
        }
      }
    }

    if (isMain) {
      if (isCNC) cncTotal += grossTotal;
      else homeTotal += grossTotal;
    } else {
      if (!productSalesTotals[pName]) productSalesTotals[pName] = { quantity: 0, total: 0 };
      productSalesTotals[pName].quantity += qty;
      productSalesTotals[pName].total += grossTotal;
    }

    if (commTotal > 0 && dbName) {
      if (!commissionByDriver[dbName]) commissionByDriver[dbName] = { name: dbName, amount: 0, qty: 0 };
      commissionByDriver[dbName].amount += commTotal;
      commissionByDriver[dbName].qty += qty;
    }

    if (prepQty > 0) {
      const prepAmt = prepQty * rate;
      const dbKey = dbName ?? "Counter / Walk-in";
      if (!prepByDriver[dbKey]) prepByDriver[dbKey] = { name: dbKey, qty: 0, amount: 0 };
      prepByDriver[dbKey].qty += prepQty;
      prepByDriver[dbKey].amount += prepAmt;

      const prodKey = `${pName} - ${dbKey}`;
      if (!prepByProduct[prodKey]) prepByProduct[prodKey] = { qty: 0, amount: 0 };
      prepByProduct[prodKey].qty += prepQty;
      prepByProduct[prodKey].amount += prepAmt;
    }

    const mode = (s.payment_mode || "cash").toLowerCase();
    const isOnlineOrPaytmSale = !isSplit && (mode === "online" || mode === "paytm");
    const effectiveOnline = isSplit ? onlineAmt : (isOnlineOrPaytmSale ? (grossTotal - commTotal) : 0);
    if (effectiveOnline > 0) {
      const qrQty = isSplit ? 0 : qty;
      const dbKey = userNote ? userNote : (dbName ?? "Counter / Walk-in");
      if (!onlineByDriver[dbKey]) onlineByDriver[dbKey] = { name: dbKey, qty: 0, amount: 0 };
      onlineByDriver[dbKey].qty += qrQty;
      onlineByDriver[dbKey].amount += effectiveOnline;
    }

    const effectiveCredit = isSplit ? creditAmt : (mode === "credit" ? (grossTotal - commTotal) : 0);
    if (effectiveCredit > 0) {
      if (!udhariByCustomer[custName]) udhariByCustomer[custName] = { name: custName, amount: 0 };
      udhariByCustomer[custName].amount += effectiveCredit;
    }

    if (mode === "cheque" && !isSplit) {
      if (!chequeByCustomer[custName]) chequeByCustomer[custName] = { name: custName, amount: 0 };
      chequeByCustomer[custName].amount += (grossTotal - commTotal);
    }
  });

  dailyPayments.forEach((p) => {
    const pMode = (p.mode || "cash").toLowerCase();
    const custName = p.customer?.name ?? p.customer_name ?? "—";
    if (pMode === "cheque" || p.remarks?.startsWith("[CHEQUE]")) {
      if (!chequeByCustomer[custName]) chequeByCustomer[custName] = { name: custName, amount: 0 };
      chequeByCustomer[custName].amount += Number(p.amount || 0);
    }
  });

  let inflowOnlineSum = 0;
  let inflowCreditSum = 0;
  let inflowChequeSum = 0;

  paymentInflows.forEach((p: any) => {
    const pType = p.payment_type || "cash";
    const amt = Number(p.amount || 0);
    if (pType === "cheque") {
      inflowChequeSum += amt;
    } else if (pType === "upi" || pType === "online") {
      inflowOnlineSum += amt;
    } else if (pType === "split") {
      inflowOnlineSum += Number(p.split_online || 0);
      inflowCreditSum += Number(p.split_credit || 0);
    }
  });

  const collectionsTotal = dailyPayments.reduce((s, p) => s + Number(p.amount || 0), 0);
  const otherInflowsSum = otherReceiptsList.reduce((s, r) => s + Number(r.amount || 0), 0);
  const pendingBillsTotal = pendingBills.reduce((s, b) => s + Number(b.amount || 0), 0);
  const paymentInflowsTotal = paymentInflows.reduce((s, p) => s + Number(p.amount || 0), 0);

  const prepSales = Object.values(prepByDriver).reduce((s, d) => s + d.amount, 0);
  const upiSales = Object.values(onlineByDriver).reduce((s, d) => s + d.amount, 0);
  const chequeSales = dailySales.filter(s => (s.payment_mode || "").toLowerCase() === "cheque").reduce((a, r) => a + (Number(r.gross_amount || 0) - Number(r.commission_amount || 0)), 0);
  const udhariSales = Object.values(udhariByCustomer).reduce((s, c) => s + c.amount, 0);

  const paytmRecoveries = dailyPayments.filter(p => (p.mode || "").toLowerCase() === "paytm").reduce((a, r) => a + Number(r.amount || 0), 0);
  const onlineRecoveries = dailyPayments.filter(p => (p.mode || "").toLowerCase() === "online").reduce((a, r) => a + Number(r.amount || 0), 0);
  const chequeRecoveries = dailyPayments.filter(p => (p.mode || "").toLowerCase() === "cheque").reduce((a, r) => a + Number(r.amount || 0), 0);

  const prepOutflow = prepSales;
  const upiOutflow = upiSales + paytmRecoveries + onlineRecoveries + inflowOnlineSum;
  const chequeOutflow = chequeSales + chequeRecoveries + inflowChequeSum;
  const udhariOutflow = udhariSales + inflowCreditSum;

  const otherProductSalesSum = Object.values(productSalesTotals).reduce((s, r) => s + r.total, 0);
  const leftGrandTotal = openingCash + homeTotal + cncTotal + otherProductSalesSum + collectionsTotal + otherInflowsSum + pendingBillsTotal + paymentInflowsTotal;

  const expensesTotal = dailyExpenses.reduce((s, e) => s + Number(e.amount || 0), 0);
  const commissionsTotal = Object.values(commissionByDriver).reduce((s, d) => s + d.amount, 0);
  const magilBillsTotal = magilBills.reduce((s, b) => s + Number(b.amount || 0), 0);
  const paymentOutflowsTotal = paymentOutflows.reduce((s, p) => s + Number(p.amount || 0), 0);
  const outstandingTotal = outstandingEntries.reduce((s, o) => s + Number(o.amount || 0), 0);

  const totalOutflows = expensesTotal + prepOutflow + upiOutflow + chequeOutflow + udhariOutflow + commissionsTotal + magilBillsTotal + paymentOutflowsTotal + outstandingTotal;
  const cashBalance = leftGrandTotal - totalOutflows;

  return {
    leftGrandTotal,
    totalOutflows,
    cashBalance,
  };
}

function AnalyticsPage() {
  const { agency } = useAuth();
  const [startDate, setStartDate] = useState(format(subDays(new Date(), 30), "yyyy-MM-dd"));
  const [endDate, setEndDate] = useState(todayISO());
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<CashbookAnalyticsRow[]>([]);

  useEffect(() => {
    if (!agency) return;
    loadCashbookData();
  }, [agency, startDate, endDate]);

  const loadCashbookData = async () => {
    if (!agency) return;
    setLoading(true);
    try {
      // 1. Fetch cash_book_days records for the date range
      const { data: cbData, error: cbErr } = await supabase
        .from("cash_book_days")
        .select("book_date, opening_cash, actual_closing, notes")
        .eq("agency_id", agency.id)
        .gte("book_date", startDate)
        .lte("book_date", endDate)
        .order("book_date", { ascending: false });

      if (cbErr) throw cbErr;

      // 2. Fetch sales, payments, & expenses for the date range
      const [{ data: salesData }, { data: paysData }, { data: expData }] = await Promise.all([
        supabase
          .from("sales")
          .select("id, sale_date, gross_amount, quantity, rate, commission_amount, payment_mode, notes, delivery_boy_id, product:products(name), customer:customers(name), delivery_boy:delivery_boys(name)")
          .eq("agency_id", agency.id)
          .eq("is_deleted", false)
          .gte("sale_date", startDate)
          .lte("sale_date", endDate),
        supabase
          .from("payments")
          .select("id, payment_date, amount, mode, remarks, customer:customers(name)")
          .eq("agency_id", agency.id)
          .eq("is_deleted", false)
          .gte("payment_date", startDate)
          .lte("payment_date", endDate),
        supabase
          .from("expenses")
          .select("id, expense_date, amount, category, notes")
          .eq("agency_id", agency.id)
          .eq("is_deleted", false)
          .gte("expense_date", startDate)
          .lte("expense_date", endDate),
      ]);

      const salesByDate: Record<string, any[]> = {};
      (salesData ?? []).forEach((s: any) => { (salesByDate[s.sale_date] ||= []).push(s); });

      const paysByDate: Record<string, any[]> = {};
      (paysData ?? []).forEach((p: any) => { (paysByDate[p.payment_date] ||= []).push(p); });

      const expByDate: Record<string, any[]> = {};
      (expData ?? []).forEach((e: any) => { (expByDate[e.expense_date] ||= []).push(e); });

      const cbMap: Record<string, any> = {};
      (cbData ?? []).forEach((c: any) => { cbMap[c.book_date] = c; });

      const allDates = Array.from(new Set([
        ...Object.keys(cbMap),
        ...Object.keys(salesByDate),
        ...Object.keys(paysByDate),
        ...Object.keys(expByDate),
      ])).sort((a, b) => b.localeCompare(a));

      const formatted: CashbookAnalyticsRow[] = allDates.map((bDate) => {
        const cbRow = cbMap[bDate];
        const openingCash = Number(cbRow?.opening_cash || 0);

        let notesMeta: any = {};
        if (cbRow?.notes) {
          try { notesMeta = JSON.parse(cbRow.notes); } catch (_) {}
        }

        const dSales = salesByDate[bDate] ?? [];
        const dPays = paysByDate[bDate] ?? [];
        const dExp = expByDate[bDate] ?? [];

        const summary = computeDailyCashbookEngine({
          openingCash,
          dailySales: dSales,
          dailyPayments: dPays,
          dailyExpenses: dExp,
          notesMeta,
        });

        const manualCount = notesMeta.manual_cash_entry != null && notesMeta.manual_cash_entry !== ""
          ? Number(notesMeta.manual_cash_entry)
          : (cbRow?.actual_closing != null ? Number(cbRow.actual_closing) : null);

        const diff = manualCount != null ? manualCount - summary.cashBalance : null;

        return {
          book_date: bDate,
          opening_cash: openingCash,
          total_inflow: summary.leftGrandTotal,
          total_outflow: summary.totalOutflows,
          calculated_balance: summary.cashBalance,
          actual_closing: manualCount,
          difference: diff,
          notes: null,
          daily_note: notesMeta.daily_note ?? null,
        };
      });

      setRows(formatted);
    } catch (err) {
      console.error("Analytics Cashbook error:", err);
    } finally {
      setLoading(false);
    }
  };

  const totals = useMemo(() => {
    return rows.reduce(
      (acc, r) => {
        acc.inflow += r.total_inflow;
        acc.outflow += r.total_outflow;
        if (r.difference != null) {
          if (r.difference < 0) acc.shortage += Math.abs(r.difference);
          else if (r.difference > 0) acc.excess += r.difference;
        }
        return acc;
      },
      { inflow: 0, outflow: 0, shortage: 0, excess: 0 }
    );
  }, [rows]);

  return (
    <div className="space-y-6 pb-12 animate-page-in">
      <PageHeader
        title="Cashbook Analytics & Audit"
        subtitle="Automatic daily cashbook summary — total inflow, outflow, calculated cash balance, manual count, & discrepancy notes"
      />

      {/* Date Filter Bar */}
      <Card className="shadow-soft bg-muted/20">
        <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary shrink-0" />
            <div>
              <h3 className="font-bold text-sm text-foreground">Select Statement Period</h3>
              <p className="text-xs text-muted-foreground">Automated Cashbook ledger logs for selected date range</p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-muted-foreground uppercase">From:</span>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-10 text-xs font-semibold w-36"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-muted-foreground uppercase">To:</span>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-10 text-xs font-semibold w-36"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Highlight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Inflow */}
        <Card className="border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/40 dark:bg-emerald-950/10">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Total Cash Received (Inflow)</div>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums mt-1">{fmtCurrency(totals.inflow)}</div>
              <div className="text-[10px] text-muted-foreground mt-1">In period selected</div>
            </div>
            <div className="h-11 w-11 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <ArrowUpRight className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* Total Outflow */}
        <Card className="border-red-200 dark:border-red-900/50 bg-red-50/40 dark:bg-red-950/10">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-red-700 dark:text-red-400 uppercase tracking-wider">Total Paid Outflow</div>
              <div className="text-2xl font-black text-red-600 dark:text-red-400 tabular-nums mt-1">{fmtCurrency(totals.outflow)}</div>
              <div className="text-[10px] text-muted-foreground mt-1">Expenses & payouts</div>
            </div>
            <div className="h-11 w-11 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center border border-red-500/20">
              <ArrowDownRight className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* Net Cash Movement */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-primary uppercase tracking-wider">Net Cash Flow</div>
              <div className="text-2xl font-black text-primary tabular-nums mt-1">{fmtCurrency(totals.inflow - totals.outflow)}</div>
              <div className="text-[10px] text-muted-foreground mt-1">Inflow minus Outflow</div>
            </div>
            <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
              <IndianRupee className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* Cash Shortage Summary */}
        <Card className={totals.shortage > 0 ? "border-red-300 bg-red-500/10" : "border-emerald-300 bg-emerald-500/10"}>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-foreground">Discrepancy Audit</div>
              <div className={`text-2xl font-black tabular-nums mt-1 ${totals.shortage > 0 ? "text-red-600" : "text-emerald-600"}`}>
                {totals.shortage > 0 ? `- ${fmtCurrency(totals.shortage)}` : "Balanced"}
              </div>
              <div className="text-[10px] text-muted-foreground mt-1">
                {totals.shortage > 0 ? "Cumulative Shortage" : "No Cash Shortages"}
              </div>
            </div>
            <div className="h-11 w-11 rounded-xl flex items-center justify-center border border-border">
              {totals.shortage > 0 ? (
                <AlertTriangle className="h-6 w-6 text-red-600 animate-pulse" />
              ) : (
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Cashbook Table */}
      <Card className="shadow-soft overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-20 text-muted-foreground gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-primary" /> Loading Cashbook statement logs...
            </div>
          ) : rows.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-20 text-primary" />
              <p className="font-bold text-base">No Cashbook records found for this period.</p>
              <p className="text-xs mt-1">Open the Cash Book tab to record daily cash counts and notes.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b bg-muted/40 font-bold text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="p-4 pl-6">Book Date</th>
                    <th className="p-4 text-right">Opening Cash</th>
                    <th className="p-4 text-right text-emerald-700 dark:text-emerald-400 bg-emerald-500/5">Total Inflow (Recd)</th>
                    <th className="p-4 text-right text-red-700 dark:text-red-400 bg-red-500/5">Total Outflow (Paid)</th>
                    <th className="p-4 text-right font-black text-foreground">Calc Cash Balance</th>
                    <th className="p-4 text-right">Manual Cash Count</th>
                    <th className="p-4 text-center">Shortage / Difference</th>
                    <th className="p-4 pr-6">Daily Note / Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-xs">
                  {rows.map((r) => {
                    const hasShortage = r.difference != null && r.difference < -0.5;
                    const hasExcess = r.difference != null && r.difference > 0.5;
                    const isBalanced = r.difference != null && Math.abs(r.difference) <= 0.5;

                    return (
                      <tr key={r.book_date} className="hover:bg-muted/30 transition-colors">
                        <td className="p-4 pl-6 font-bold text-foreground whitespace-nowrap">
                          {fmtDate(r.book_date)}
                        </td>

                        <td className="p-4 text-right font-semibold text-muted-foreground tabular-nums">
                          {fmtCurrency(r.opening_cash)}
                        </td>

                        {/* Green highlight for Total Inflow */}
                        <td className="p-4 text-right font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 tabular-nums">
                          + {fmtCurrency(r.total_inflow)}
                        </td>

                        {/* Red highlight for Total Outflow */}
                        <td className="p-4 text-right font-black text-red-600 dark:text-red-400 bg-red-500/5 tabular-nums">
                          - {fmtCurrency(r.total_outflow)}
                        </td>

                        {/* Calculated Cash Balance */}
                        <td className="p-4 text-right font-extrabold text-foreground tabular-nums bg-muted/20">
                          {fmtCurrency(r.calculated_balance)}
                        </td>

                        {/* Manual Cash Count */}
                        <td className="p-4 text-right font-bold text-foreground tabular-nums">
                          {r.actual_closing != null ? fmtCurrency(r.actual_closing) : <span className="text-muted-foreground opacity-50">—</span>}
                        </td>

                        {/* Discrepancy Highlight */}
                        <td className="p-4 text-center whitespace-nowrap">
                          {r.difference == null ? (
                            <span className="text-[10px] text-muted-foreground font-medium italic">Unverified</span>
                          ) : hasShortage ? (
                            <span className="inline-flex items-center gap-1 font-black text-destructive bg-destructive/10 border border-destructive/20 px-2.5 py-1 rounded-full">
                              <AlertTriangle className="h-3 w-3" /> Shortage: {fmtCurrency(Math.abs(r.difference))}
                            </span>
                          ) : hasExcess ? (
                            <span className="inline-flex items-center gap-1 font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                              <ArrowUpRight className="h-3 w-3" /> Excess: +{fmtCurrency(r.difference)}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                              <CheckCircle2 className="h-3 w-3" /> Balanced
                            </span>
                          )}
                        </td>

                        {/* Daily Note */}
                        <td className="p-4 pr-6 max-w-xs truncate text-muted-foreground font-medium italic">
                          {r.daily_note ? (
                            <span className="flex items-center gap-1 text-foreground font-semibold" title={r.daily_note}>
                              <FileText className="h-3.5 w-3.5 text-primary shrink-0" />
                              {r.daily_note}
                            </span>
                          ) : (
                            <span className="opacity-40">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { RequireAgencyUser } from "@/components/route-guards";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/page-header";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { fmtCurrency, fmtDate, todayISO } from "@/lib/format";
import { Calendar, Plus, Trash2, ArrowDownToLine, Loader2, Eye, Edit2 } from "lucide-react";
import { getFriendlyError } from "@/lib/friendly-error";

export const Route = createFileRoute("/app/payment-inflow")({
  component: () => <RequireAgencyUser><PaymentInflowPage /></RequireAgencyUser>,
  head: () => ({ meta: [{ title: "Payment Inflow — GasFlow" }] }),
});

const PAYMENT_TYPES = [
  { value: "cash",   label: "💵 Cash" },
  { value: "upi",    label: "📱 UPI" },
  { value: "cheque", label: "🏦 Cheque" },
  { value: "online", label: "🌐 Online / Paytm" },
  { value: "split",  label: "⚖️ Split" },
];

const INFLOW_PAYMENT_TYPES = [
  { value: "split",  label: "⚖️ Split" },
  { value: "cheque", label: "🏦 Cheque" },
];

const BADGE_COLORS: Record<string, string> = {
  cash:   "bg-emerald-100 text-emerald-700",
  upi:    "bg-blue-100 text-blue-700",
  cheque: "bg-violet-100 text-violet-700",
  online: "bg-amber-100 text-amber-700",
  split:  "bg-rose-100 text-rose-700",
};

interface InflowItem { 
  id: string; 
  particular: string; 
  amount: number; 
  note?: string; 
  payment_type?: string; 
  split_cash?: number; 
  split_online?: number; 
  split_credit?: number; 
}

function newId() { return "inf-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7); }

function PaymentInflowPage() {
  const { agency } = useAuth();
  const [date, setDate] = useState(todayISO());
  const [items, setItems] = useState<InflowItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);

  // Add Dialog
  const [isOpen, setIsOpen] = useState(false);
  const [particular, setParticular] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [paymentType, setPaymentType] = useState("split");
  const [splitCash, setSplitCash] = useState("0");
  const [splitOnline, setSplitOnline] = useState("0");
  const [splitCredit, setSplitCredit] = useState("0");

  // Edit Dialog
  const [editTarget, setEditTarget] = useState<InflowItem | null>(null);
  const [editParticular, setEditParticular] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editNote, setEditNote] = useState("");
  const [editPaymentType, setEditPaymentType] = useState("split");
  const [editSplitCash, setEditSplitCash] = useState("0");
  const [editSplitOnline, setEditSplitOnline] = useState("0");
  const [editSplitCredit, setEditSplitCredit] = useState("0");

  // View Dialog
  const [viewTarget, setViewTarget] = useState<InflowItem | null>(null);

  const inflowAmt = Number(amount || 0);
  useEffect(() => {
    if (paymentType === "split" && inflowAmt >= 0) {
      const currentSum = Number(splitCash || 0) + Number(splitOnline || 0) + Number(splitCredit || 0);
      if (Math.abs(currentSum - inflowAmt) > 0.01) {
        const newCash = Math.max(0, inflowAmt - Number(splitOnline || 0) - Number(splitCredit || 0));
        setSplitCash(String(newCash));
      }
    }
  }, [inflowAmt, paymentType]);

  const loadItems = async () => {
    if (!agency) return;
    setLoading(true);
    const { data } = await supabase
      .from("cash_book_days")
      .select("notes")
      .eq("agency_id", agency.id)
      .eq("book_date", date)
      .maybeSingle();
    if (data?.notes) {
      try {
        const m = JSON.parse(data.notes);
        setItems(Array.isArray(m.payment_inflows) ? m.payment_inflows : []);
      } catch (_) { setItems([]); }
    } else {
      setItems([]);
    }
    setLoading(false);
  };

  useEffect(() => { void loadItems(); }, [agency, date]);

  const saveItems = async (updated: InflowItem[]) => {
    if (!agency) return;
    const { data: existing } = await supabase
      .from("cash_book_days")
      .select("notes, opening_cash")
      .eq("agency_id", agency.id)
      .eq("book_date", date)
      .maybeSingle();

    let meta: Record<string, any> = {};
    try { if (existing?.notes) meta = JSON.parse(existing.notes); } catch (_) {}

    meta.payment_inflows = updated;

    const { error } = await supabase.from("cash_book_days").upsert({
      agency_id: agency.id,
      book_date: date,
      opening_cash: existing?.opening_cash ?? 0,
      notes: JSON.stringify(meta),
    }, { onConflict: "agency_id,book_date" });

    if (error) toast.error(getFriendlyError(error));
  };

  const addItem = async (e: FormEvent) => {
    e.preventDefault();
    const amt = Number(amount);
    if (!particular.trim() || !amt || amt <= 0) { toast.error("Please enter a description and a valid amount."); return; }

    const cash = Number(splitCash || 0);
    const online = Number(splitOnline || 0);
    const credit = Number(splitCredit || 0);

    if (paymentType === "split" && Math.abs(cash + online + credit - amt) > 0.01) {
      toast.error(`Split breakdown (Cash: ${fmtCurrency(cash)}, Online: ${fmtCurrency(online)}, Udhari: ${fmtCurrency(credit)}) must equal total amount: ${fmtCurrency(amt)}`);
      return;
    }

    setBusy(true);
    const item: InflowItem = {
      id: newId(),
      particular: particular.trim(),
      amount: amt,
      note: note.trim() || undefined,
      payment_type: paymentType,
      split_cash: paymentType === "split" ? cash : undefined,
      split_online: paymentType === "split" ? online : undefined,
      split_credit: paymentType === "split" ? credit : undefined,
    };
    const updated = [...items, item];
    setItems(updated);
    await saveItems(updated);
    toast.success("Payment inflow recorded.");
    setIsOpen(false);
    setParticular(""); setAmount(""); setNote(""); setPaymentType("split");
    setSplitCash("0"); setSplitOnline("0"); setSplitCredit("0");
    setBusy(false);
  };

  const deleteItem = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this payment inflow entry? This cannot be undone.")) return;
    const updated = items.filter(i => i.id !== id);
    setItems(updated);
    await saveItems(updated);
    toast.success("Entry removed.");
  };

  const openEdit = (item: InflowItem) => {
    setEditTarget(item);
    setEditParticular(item.particular);
    setEditAmount(String(item.amount));
    setEditNote(item.note ?? "");
    setEditPaymentType(item.payment_type ?? "split");
    setEditSplitCash(String(item.split_cash ?? 0));
    setEditSplitOnline(String(item.split_online ?? 0));
    setEditSplitCredit(String(item.split_credit ?? 0));
  };

  const saveEdit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editTarget) return;
    const amt = Number(editAmount);
    if (!editParticular.trim() || !amt || amt <= 0) { toast.error("Please enter a description and a valid amount."); return; }

    const cash = Number(editSplitCash || 0);
    const online = Number(editSplitOnline || 0);
    const credit = Number(editSplitCredit || 0);

    if (editPaymentType === "split" && Math.abs(cash + online + credit - amt) > 0.01) {
      toast.error("Split breakdown must equal total amount.");
      return;
    }

    setBusy(true);
    const updated = items.map(i => i.id === editTarget.id ? {
      ...i,
      particular: editParticular.trim(),
      amount: amt,
      note: editNote.trim() || undefined,
      payment_type: editPaymentType,
      split_cash: editPaymentType === "split" ? cash : undefined,
      split_online: editPaymentType === "split" ? online : undefined,
      split_credit: editPaymentType === "split" ? credit : undefined,
    } : i);
    setItems(updated);
    await saveItems(updated);
    toast.success("Payment inflow updated.");
    setEditTarget(null);
    setBusy(false);
  };

  const total = items.reduce((s, i) => s + i.amount, 0);

  return (
    <div className="space-y-6 animate-page-in">
      <PageHeader
        title="Payment Inflow"
        subtitle="Miscellaneous cash receipts — these appear in the Cashbook received side"
        actions={
          <Button onClick={() => setIsOpen(true)} className="h-11 gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold">
            <Plus className="h-4.5 w-4.5" /> Add Inflow
          </Button>
        }
      />

      {/* Date picker */}
      <Card className="shadow-soft bg-muted/20">
        <CardContent className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary shrink-0" />
            <div>
              <h3 className="font-semibold text-sm">Select Date</h3>
              <p className="text-xs text-muted-foreground">Showing inflows for: <strong className="text-foreground">{fmtDate(date)}</strong></p>
            </div>
          </div>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-10 text-sm font-semibold w-full sm:max-w-xs" />
        </CardContent>
      </Card>

      {/* List */}
      <Card className="shadow-soft">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-5 space-y-4 animate-pulse">
              {[1, 2].map((n) => (
                <div key={n} className="flex justify-between items-center py-2 border-b last:border-0 border-border/40">
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-muted rounded w-1/3"></div>
                    <div className="h-3 bg-muted rounded w-1/4"></div>
                  </div>
                  <div className="h-6 bg-muted rounded w-16"></div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground">
              <ArrowDownToLine className="h-10 w-10 mx-auto mb-3 opacity-20" />
              <p className="font-medium">No inflows recorded for {fmtDate(date)}</p>
              <p className="text-xs mt-1">Click "Add Inflow" to record name change, udhari cash, or any other receipt.</p>
            </div>
          ) : (
            <>
              <div className="divide-y">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between px-4 py-4 hover:bg-muted/20 group transition-colors gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-9 w-9 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                        <ArrowDownToLine className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-sm truncate">{item.particular}</span>
                          {item.payment_type && (
                            <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${BADGE_COLORS[item.payment_type] ?? "bg-slate-100 text-slate-700"}`}>
                              {PAYMENT_TYPES.find(p => p.value === item.payment_type)?.label ?? item.payment_type}
                            </span>
                          )}
                        </div>
                        {item.note && <div className="text-xs text-slate-500 mt-0.5">{item.note}</div>}
                        <div className="text-xs text-muted-foreground mt-0.5">{fmtDate(date)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-black text-emerald-600 tabular-nums text-base">{fmtCurrency(item.amount)}</span>
                      {/* View */}
                      <button type="button" onClick={() => setViewTarget(item)}
                        className="h-8 w-8 rounded-lg border border-blue-200 text-blue-500 hover:bg-blue-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        title="View details">
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      {/* Edit */}
                      <button type="button" onClick={() => openEdit(item)}
                        className="h-8 w-8 rounded-lg border border-amber-200 text-amber-500 hover:bg-amber-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Edit entry">
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      {/* Delete */}
                      <button type="button" onClick={() => deleteItem(item.id)}
                        className="h-8 w-8 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete entry">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t bg-emerald-50 px-6 py-4 flex justify-between items-center">
                <span className="text-sm font-bold text-emerald-700 uppercase tracking-wider">Total Inflow ({fmtDate(date)})</span>
                <span className="text-xl font-black text-emerald-600 tabular-nums">{fmtCurrency(total)}</span>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* ── Add Dialog ── */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-sm bg-background border border-border rounded-2xl shadow-xl p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-bold">
              <ArrowDownToLine className="h-5 w-5 text-emerald-500" /> Record Payment Inflow
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={addItem} className="space-y-4 mt-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-muted-foreground uppercase">Particular / Description</Label>
              <Input required value={particular} onChange={(e) => setParticular(e.target.value)} placeholder="Name change, cash receipt..." className="h-11" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-muted-foreground uppercase">Payment Type</Label>
              <Select value={paymentType} onValueChange={setPaymentType}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {INFLOW_PAYMENT_TYPES.map(pt => (
                    <SelectItem key={pt.value} value={pt.value}>{pt.label}</SelectItem>
                  ))}
                  {paymentType !== "split" && paymentType !== "cheque" && (
                    <SelectItem value={paymentType}>{PAYMENT_TYPES.find(p => p.value === paymentType)?.label ?? paymentType.toUpperCase()}</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-muted-foreground uppercase">Amount (₹)</Label>
              <Input required type="number" step="any" min="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className="h-11 font-bold text-lg" />
            </div>
            {paymentType === "split" && (
              <Card className="p-4 bg-muted/40 border border-border space-y-3 rounded-lg">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Split Payment Breakdown</h4>
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Cash (₹)</Label>
                    <Input type="number" step="any" min="0" value={splitCash} onChange={(e) => setSplitCash(e.target.value)} className="h-10 text-xs font-bold" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Online (₹)</Label>
                    <Input type="number" step="any" min="0" value={splitOnline} onChange={(e) => setSplitOnline(e.target.value)} className="h-10 text-xs font-bold" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Udhari (₹)</Label>
                    <Input type="number" step="any" min="0" value={splitCredit} onChange={(e) => setSplitCredit(e.target.value)} className="h-10 text-xs font-bold" />
                  </div>
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold mt-1">
                  <span className="text-muted-foreground">Sum: {fmtCurrency(Number(splitCash || 0) + Number(splitOnline || 0) + Number(splitCredit || 0))} / Target: {fmtCurrency(Number(amount || 0))}</span>
                  <span className={Math.abs(Number(splitCash || 0) + Number(splitOnline || 0) + Number(splitCredit || 0) - Number(amount || 0)) < 0.01 ? "text-success" : "text-destructive"}>
                    {Math.abs(Number(splitCash || 0) + Number(splitOnline || 0) + Number(splitCredit || 0) - Number(amount || 0)) < 0.01 ? "✓ Perfect match" : "✗ Mismatch"}
                  </span>
                </div>
              </Card>
            )}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-muted-foreground uppercase">Note (Optional)</Label>
              <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Additional details..." className="h-11" />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={busy} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-11">
                {busy ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null} Record Inflow
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Edit Dialog ── */}
      <Dialog open={!!editTarget} onOpenChange={(v) => { if (!v) setEditTarget(null); }}>
        <DialogContent className="max-w-sm bg-background border border-border rounded-2xl shadow-xl p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-bold">
              <Edit2 className="h-5 w-5 text-amber-500" /> Edit Payment Inflow
            </DialogTitle>
          </DialogHeader>
          {editTarget && (
            <form onSubmit={saveEdit} className="space-y-4 mt-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-muted-foreground uppercase">Particular / Description</Label>
                <Input required value={editParticular} onChange={(e) => setEditParticular(e.target.value)} placeholder="Name change, cash receipt..." className="h-11" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-muted-foreground uppercase">Payment Type</Label>
                <Select value={editPaymentType} onValueChange={setEditPaymentType}>
                  <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {INFLOW_PAYMENT_TYPES.map(pt => (
                      <SelectItem key={pt.value} value={pt.value}>{pt.label}</SelectItem>
                    ))}
                    {editPaymentType !== "split" && editPaymentType !== "cheque" && (
                      <SelectItem value={editPaymentType}>{PAYMENT_TYPES.find(p => p.value === editPaymentType)?.label ?? editPaymentType.toUpperCase()}</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-muted-foreground uppercase">Amount (₹)</Label>
                <Input required type="number" step="any" min="0.01" value={editAmount} onChange={(e) => setEditAmount(e.target.value)} placeholder="0.00" className="h-11 font-bold text-lg" />
              </div>
              {editPaymentType === "split" && (
                <Card className="p-4 bg-muted/40 border border-border space-y-3 rounded-lg">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Split Payment Breakdown</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase font-bold text-muted-foreground">Cash (₹)</Label>
                      <Input type="number" step="any" min="0" value={editSplitCash} onChange={(e) => setEditSplitCash(e.target.value)} className="h-10 text-xs font-bold" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase font-bold text-muted-foreground">Online (₹)</Label>
                      <Input type="number" step="any" min="0" value={editSplitOnline} onChange={(e) => setEditSplitOnline(e.target.value)} className="h-10 text-xs font-bold" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase font-bold text-muted-foreground">Udhari (₹)</Label>
                      <Input type="number" step="any" min="0" value={editSplitCredit} onChange={(e) => setEditSplitCredit(e.target.value)} className="h-10 text-xs font-bold" />
                    </div>
                  </div>
                </Card>
              )}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-muted-foreground uppercase">Note (Optional)</Label>
                <Input value={editNote} onChange={(e) => setEditNote(e.target.value)} placeholder="Additional details..." className="h-11" />
              </div>
              <DialogFooter className="pt-2">
                <Button type="button" variant="ghost" onClick={() => setEditTarget(null)}>Cancel</Button>
                <Button type="submit" disabled={busy} className="bg-amber-600 hover:bg-amber-500 text-white font-bold h-11">
                  {busy ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null} Save Changes
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* ── View Dialog ── */}
      <Dialog open={!!viewTarget} onOpenChange={(v) => { if (!v) setViewTarget(null); }}>
        <DialogContent className="max-w-sm bg-background border border-border rounded-2xl shadow-xl p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-bold">
              <Eye className="h-5 w-5 text-blue-500" /> Inflow Details
            </DialogTitle>
          </DialogHeader>
          {viewTarget && (
            <div className="space-y-3 mt-3">
              <div className="bg-muted/30 rounded-xl p-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-semibold">Particular</span>
                  <span className="font-bold text-right max-w-[60%]">{viewTarget.particular}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-semibold">Date</span>
                  <span className="font-bold">{fmtDate(date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-semibold">Amount</span>
                  <span className="font-black text-emerald-600 text-base">{fmtCurrency(viewTarget.amount)}</span>
                </div>
                {viewTarget.payment_type && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-semibold">Payment Type</span>
                    <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${BADGE_COLORS[viewTarget.payment_type] ?? "bg-slate-100 text-slate-700"}`}>
                      {PAYMENT_TYPES.find(p => p.value === viewTarget.payment_type)?.label ?? viewTarget.payment_type}
                    </span>
                  </div>
                )}
                {viewTarget.payment_type === "split" && (
                  <>
                    <div className="border-t pt-3 space-y-2">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Split Breakdown</p>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Cash</span>
                        <span className="font-bold">{fmtCurrency(viewTarget.split_cash ?? 0)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Online</span>
                        <span className="font-bold">{fmtCurrency(viewTarget.split_online ?? 0)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Udhari / Credit</span>
                        <span className="font-bold">{fmtCurrency(viewTarget.split_credit ?? 0)}</span>
                      </div>
                    </div>
                  </>
                )}
                {viewTarget.note && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-semibold">Note</span>
                    <span className="font-medium text-right max-w-[60%]">{viewTarget.note}</span>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setViewTarget(null)} className="w-full">Close</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

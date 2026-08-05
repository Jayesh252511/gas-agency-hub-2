import { createFileRoute } from "@tanstack/react-router";
import { RequireAgencyUser } from "@/components/route-guards";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/page-header";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { fmtCurrency, fmtDate, todayISO } from "@/lib/format";
import { Calendar, Plus, Trash2, ArrowUpFromLine, Loader2, Eye, Edit2 } from "lucide-react";
import { getFriendlyError } from "@/lib/friendly-error";

export const Route = createFileRoute("/app/payment-outflow")({
  component: () => <RequireAgencyUser><PaymentOutflowPage /></RequireAgencyUser>,
  head: () => ({ meta: [{ title: "Payment Outflow — GasFlow" }] }),
});

interface OutflowItem { id: string; particular: string; amount: number; note?: string; }

function newId() { return "out-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7); }

function PaymentOutflowPage() {
  const { agency } = useAuth();
  const [date, setDate] = useState(todayISO());
  const [items, setItems] = useState<OutflowItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);

  // Add Dialog
  const [isOpen, setIsOpen] = useState(false);
  const [particular, setParticular] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  // Edit Dialog
  const [editTarget, setEditTarget] = useState<OutflowItem | null>(null);
  const [editParticular, setEditParticular] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editNote, setEditNote] = useState("");

  // View Dialog
  const [viewTarget, setViewTarget] = useState<OutflowItem | null>(null);

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
        setItems(Array.isArray(m.payment_outflows) ? m.payment_outflows : []);
      } catch (_) { setItems([]); }
    } else {
      setItems([]);
    }
    setLoading(false);
  };

  useEffect(() => { void loadItems(); }, [agency, date]);

  const saveItems = async (updated: OutflowItem[]) => {
    if (!agency) return;
    const { data: existing } = await supabase
      .from("cash_book_days")
      .select("notes, opening_cash")
      .eq("agency_id", agency.id)
      .eq("book_date", date)
      .maybeSingle();

    let meta: Record<string, any> = {};
    try { if (existing?.notes) meta = JSON.parse(existing.notes); } catch (_) {}
    meta.payment_outflows = updated;

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
    setBusy(true);
    const item: OutflowItem = { id: newId(), particular: particular.trim(), amount: amt, note: note.trim() || undefined };
    const updated = [...items, item];
    setItems(updated);
    await saveItems(updated);
    toast.success("Payment outflow recorded.");
    setIsOpen(false); setParticular(""); setAmount(""); setNote("");
    setBusy(false);
  };

  const deleteItem = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this payment outflow entry? This cannot be undone.")) return;
    const updated = items.filter(i => i.id !== id);
    setItems(updated);
    await saveItems(updated);
    toast.success("Entry removed.");
  };

  const openEdit = (item: OutflowItem) => {
    setEditTarget(item);
    setEditParticular(item.particular);
    setEditAmount(String(item.amount));
    setEditNote(item.note ?? "");
  };

  const saveEdit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editTarget) return;
    const amt = Number(editAmount);
    if (!editParticular.trim() || !amt || amt <= 0) { toast.error("Please enter a description and a valid amount."); return; }
    setBusy(true);
    const updated = items.map(i => i.id === editTarget.id ? {
      ...i,
      particular: editParticular.trim(),
      amount: amt,
      note: editNote.trim() || undefined,
    } : i);
    setItems(updated);
    await saveItems(updated);
    toast.success("Payment outflow updated.");
    setEditTarget(null);
    setBusy(false);
  };

  const total = items.reduce((s, i) => s + i.amount, 0);

  return (
    <div className="space-y-6 animate-page-in">
      <PageHeader
        title="Payment Outflow (पैसे दिले)"
        subtitle="Miscellaneous cash payments — these appear in the Cashbook paid side"
        actions={
          <Button onClick={() => setIsOpen(true)} className="h-11 gap-2 bg-orange-600 hover:bg-orange-500 text-white font-bold">
            <Plus className="h-4.5 w-4.5" /> Add Outflow
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
              <p className="text-xs text-muted-foreground">Showing outflows for: <strong className="text-foreground">{fmtDate(date)}</strong></p>
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
              <ArrowUpFromLine className="h-10 w-10 mx-auto mb-3 opacity-20" />
              <p className="font-medium">No outflows recorded for {fmtDate(date)}</p>
              <p className="text-xs mt-1">Click "Add Outflow" to record any miscellaneous cash payment.</p>
            </div>
          ) : (
            <>
              <div className="divide-y">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between px-4 py-4 hover:bg-muted/20 group transition-colors gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-9 w-9 rounded-lg bg-orange-100 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
                        <ArrowUpFromLine className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-sm truncate">{item.particular}</div>
                        {item.note && <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.note}</div>}
                        <div className="text-xs text-muted-foreground mt-0.5">{fmtDate(date)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="font-black text-red-600 tabular-nums text-base mr-1">{fmtCurrency(item.amount)}</span>
                      {/* View */}
                      <button type="button" onClick={() => setViewTarget(item)}
                        className="h-8 w-8 rounded-lg border border-blue-200 text-blue-500 hover:bg-blue-50 flex items-center justify-center transition-colors"
                        title="View details">
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      {/* Edit */}
                      <button type="button" onClick={() => openEdit(item)}
                        className="h-8 w-8 rounded-lg border border-amber-200 text-amber-500 hover:bg-amber-50 flex items-center justify-center transition-colors"
                        title="Edit entry">
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      {/* Delete */}
                      <button type="button" onClick={() => deleteItem(item.id)}
                        className="h-8 w-8 rounded-lg border border-red-200 dark:border-red-900/50 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 flex items-center justify-center transition-colors"
                        title="Delete entry">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-border bg-red-50 dark:bg-red-950/10 px-6 py-4 flex justify-between items-center">
                <span className="text-sm font-bold text-red-750 dark:text-red-300 uppercase tracking-wider">Total Outflow ({fmtDate(date)})</span>
                <span className="text-xl font-black text-red-600 tabular-nums">{fmtCurrency(total)}</span>
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
              <ArrowUpFromLine className="h-5 w-5 text-orange-500" /> Record Payment Outflow
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={addItem} className="space-y-4 mt-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-muted-foreground uppercase">Particular / Description</Label>
              <Input required value={particular} onChange={(e) => setParticular(e.target.value)} placeholder="Bank transfer, vendor payment..." className="h-11" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-muted-foreground uppercase">Amount (₹)</Label>
              <Input required type="number" step="any" min="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className="h-11 font-bold text-lg" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-muted-foreground uppercase">Note (Optional)</Label>
              <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Additional details..." className="h-11" />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={busy} className="bg-orange-600 hover:bg-orange-500 text-white font-bold h-11">
                {busy ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null} Record Outflow
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
              <Edit2 className="h-5 w-5 text-amber-500" /> Edit Payment Outflow
            </DialogTitle>
          </DialogHeader>
          {editTarget && (
            <form onSubmit={saveEdit} className="space-y-4 mt-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-muted-foreground uppercase">Particular / Description</Label>
                <Input required value={editParticular} onChange={(e) => setEditParticular(e.target.value)} placeholder="Bank transfer, vendor payment..." className="h-11" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-muted-foreground uppercase">Amount (₹)</Label>
                <Input required type="number" step="any" min="0.01" value={editAmount} onChange={(e) => setEditAmount(e.target.value)} placeholder="0.00" className="h-11 font-bold text-lg" />
              </div>
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
              <Eye className="h-5 w-5 text-blue-500" /> Outflow Details
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
                  <span className="font-black text-red-600 text-base">{fmtCurrency(viewTarget.amount)}</span>
                </div>
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

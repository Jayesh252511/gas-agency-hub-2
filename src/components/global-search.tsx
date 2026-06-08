import { useState, useEffect, useCallback, Fragment } from "react";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { fmtCurrency } from "@/lib/format";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Users, ShoppingCart, Wallet, Receipt, Search, BarChart2, LayoutDashboard, Package } from "lucide-react";

interface SearchResult {
  id: string;
  group: string;
  label: string;
  sub?: string;
  icon: React.ReactNode;
  to: string;
  params?: Record<string, string>;
}

// Expense category enum values from the DB schema
const EXPENSE_CATEGORIES = [
  "salary", "fuel", "maintenance", "rent", "utilities",
  "office_supplies", "marketing", "transport", "miscellaneous", "other",
];

export function GlobalSearch() {
  const { agency } = useAuth();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  // Keyboard shortcut listener
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(v => !v);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  // Reset on close
  useEffect(() => {
    if (!open) { setQuery(""); setResults([]); }
  }, [open]);

  const search = useCallback(async (q: string) => {
    // Sanitize: strip PostgREST special chars that break .or() syntax
    const cleanQ = q.replace(/[(),]/g, "").trim();
    if (!agency || cleanQ.length < 2) { setResults([]); return; }
    setLoading(true);

    try {
      const qLow = cleanQ.toLowerCase();
      const isNum = !isNaN(Number(cleanQ)) && Number(cleanQ) > 0;
      const numVal = isNum ? Number(cleanQ) : 0;

      // 1. Customer search: name OR mobile OR village
      const custPromise = supabase
        .from("customers")
        .select("id, name, mobile, village")
        .eq("agency_id", agency.id)
        .eq("is_deleted", false)
        .or(`name.ilike.%${cleanQ}%,mobile.ilike.%${cleanQ}%,village.ilike.%${cleanQ}%`)
        .limit(5);

      // 2. Sales/Payments — only when query is numeric (amount search)
      const salesPromise = isNum
        ? supabase
            .from("sales")
            .select("id, sale_date, gross_amount, payment_mode, customer:customers(name, id)")
            .eq("agency_id", agency.id)
            .eq("is_deleted", false)
            .gte("gross_amount", numVal)
            .lte("gross_amount", numVal)
            .order("sale_date", { ascending: false })
            .limit(4)
        : Promise.resolve({ data: [], error: null });

      const paysPromise = isNum
        ? supabase
            .from("payments")
            .select("id, payment_date, amount, mode, customer:customers(name, id)")
            .eq("agency_id", agency.id)
            .eq("is_deleted", false)
            .eq("amount", numVal)
            .order("payment_date", { ascending: false })
            .limit(3)
        : Promise.resolve({ data: [], error: null });

      // 3. Expense search: match category enum by filtering known categories, or match by amount
      const matchingCats = EXPENSE_CATEGORIES.filter(cat =>
        cat.replace(/_/g, " ").includes(qLow) || qLow.includes(cat.replace(/_/g, " "))
      );

      let expPromise;
      if (isNum) {
        // Search by amount
        expPromise = supabase
          .from("expenses")
          .select("id, expense_date, amount, category, notes")
          .eq("agency_id", agency.id)
          .eq("is_deleted", false)
          .eq("amount", numVal)
          .limit(3);
      } else if (matchingCats.length > 0) {
        // Search by matching category enum values
        expPromise = supabase
          .from("expenses")
          .select("id, expense_date, amount, category, notes")
          .eq("agency_id", agency.id)
          .eq("is_deleted", false)
          .in("category", matchingCats)
          .limit(3);
      } else {
        // Search by notes if column exists, else skip
        expPromise = supabase
          .from("expenses")
          .select("id, expense_date, amount, category, notes")
          .eq("agency_id", agency.id)
          .eq("is_deleted", false)
          .limit(0); // Return nothing if no match possible
      }

      const [custQ, salesQ, paysQ, expQ] = await Promise.all([
        custPromise, salesPromise, paysPromise, expPromise,
      ]);

      const res: SearchResult[] = [];

      // Customers
      (custQ.data ?? []).forEach((c: any) => {
        res.push({
          id: `c-${c.id}`, group: "Customers",
          label: c.name,
          sub: [c.mobile, c.village].filter(Boolean).join(" · "),
          icon: <Users className="w-4 h-4 text-primary" />,
          to: "/app/customers/$id", params: { id: c.id },
        });
      });

      // Sales (by amount only)
      if (isNum) {
        (salesQ.data ?? []).slice(0, 3).forEach((s: any) => {
          res.push({
            id: `s-${s.id}`, group: "Sales",
            label: `Sale — ${fmtCurrency(s.gross_amount)}`,
            sub: `${(s.customer as any)?.name ?? "Walk-in"} · ${s.sale_date}`,
            icon: <ShoppingCart className="w-4 h-4 text-indigo-500" />,
            to: "/app/sales",
          });
        });
      }

      // Payments (by amount only)
      if (isNum) {
        (paysQ.data ?? []).slice(0, 2).forEach((p: any) => {
          res.push({
            id: `p-${p.id}`, group: "Payments",
            label: `Payment — ${fmtCurrency(p.amount)}`,
            sub: `${(p.customer as any)?.name ?? "—"} · ${p.mode} · ${p.payment_date}`,
            icon: <Wallet className="w-4 h-4 text-emerald-500" />,
            to: "/app/payments",
          });
        });
      }

      // Expenses
      (expQ.data ?? []).forEach((e: any) => {
        const catLabel = (e.category ?? "").replace(/_/g, " ");
        res.push({
          id: `e-${e.id}`, group: "Expenses",
          label: `${catLabel} — ${fmtCurrency(e.amount)}`,
          sub: e.expense_date,
          icon: <Receipt className="w-4 h-4 text-amber-500" />,
          to: "/app/expenses",
        });
      });

      setResults(res);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  }, [agency]);

  useEffect(() => {
    const timer = setTimeout(() => search(query), 300);
    return () => clearTimeout(timer);
  }, [query, search]);

  const navigate = (result: SearchResult) => {
    setOpen(false);
    if (result.params) {
      nav({ to: result.to as any, params: result.params });
    } else {
      nav({ to: result.to as any });
    }
  };

  // Quick nav items always shown
  const quickNav = [
    { id: "qn-dash", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" />, to: "/app" },
    { id: "qn-sales", label: "New Sale", icon: <ShoppingCart className="w-4 h-4" />, to: "/app/sales" },
    { id: "qn-customers", label: "Customers", icon: <Users className="w-4 h-4" />, to: "/app/customers" },
    { id: "qn-analytics", label: "Analytics", icon: <BarChart2 className="w-4 h-4" />, to: "/app/analytics" },
    { id: "qn-products", label: "Products", icon: <Package className="w-4 h-4" />, to: "/app/products" },
  ];

  const groups = Array.from(new Set(results.map(r => r.group)));

  return (
    <>
      {/* Search Button */}
      <button
        id="global-search-btn"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-xs text-muted-foreground bg-muted/50 hover:bg-muted border border-border/60 rounded-lg transition-all hover:text-foreground group w-full"
        title="Global Search (Ctrl+K)"
        aria-label="Open global search"
      >
        <Search className="w-3.5 h-3.5 shrink-0" />
        <span className="flex-1 text-left">Search...</span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 bg-background border border-border rounded px-1 text-[10px] text-muted-foreground font-mono">
          ⌘K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen} shouldFilter={false}>
        <CommandInput
          placeholder="Search customers, amounts, expenses..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {loading && (
            <div className="p-4 text-center text-xs text-muted-foreground animate-pulse">Searching...</div>
          )}

          {!loading && query.length < 2 && (
            <CommandGroup heading="Quick Navigation">
              {quickNav.map(item => (
                <CommandItem
                  key={item.id}
                  onSelect={() => { setOpen(false); nav({ to: item.to as any }); }}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <span className="text-muted-foreground">{item.icon}</span>
                  <span>{item.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {!loading && query.length >= 2 && results.length === 0 && (
            <CommandEmpty>No results found for "{query}"</CommandEmpty>
          )}

          {!loading && groups.map((group, gi) => (
            <Fragment key={group}>
              {gi > 0 && <CommandSeparator />}
              <CommandGroup heading={group}>
                {results.filter(r => r.group === group).map(result => (
                  <CommandItem
                    key={result.id}
                    onSelect={() => navigate(result)}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <span className="shrink-0">{result.icon}</span>
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{result.label}</div>
                      {result.sub && <div className="text-xs text-muted-foreground truncate">{result.sub}</div>}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </Fragment>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}

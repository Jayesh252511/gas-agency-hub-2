import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { Bell, X, AlertTriangle, Package, TrendingDown, CheckCheck, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: "overdue_high" | "overdue_medium" | "low_stock";
  title: string;
  body: string;
  amount?: number;
  read: boolean;
}

const STORAGE_KEY = "gh_notif_read";

function getReadIds(): Set<string> {
  try { return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]")); } catch { return new Set(); }
}
function saveReadIds(ids: Set<string>) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids])); } catch { }
}

interface NotificationCenterProps {
  align?: "left" | "right";
}

export function NotificationCenter({ align = "right" }: NotificationCenterProps) {
  const { agency } = useAuth();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(getReadIds);
  const [refreshing, setRefreshing] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLButtonElement>(null);
  const [panelPos, setPanelPos] = useState<{ top: number; left?: number; right?: number }>({ top: 60 });

  const loadNotifications = useCallback(async () => {
    if (!agency) return;
    setRefreshing(true);

    const notifs: Notification[] = [];

    try {
      // Outstanding customers — read balance directly from active customers
      const { data: customers } = await (supabase.from("customers") as any)
        .select("id, name, mobile, outstanding:outstanding_balance").eq("agency_id", agency.id).eq("is_deleted", false);

      (customers ?? []).forEach((c: any) => {
        const bal = Number(c.outstanding || 0);
        if (bal >= 5000) {
          notifs.push({
            id: `overdue-high-${c.id}`,
            type: "overdue_high",
            title: "High Outstanding Alert",
            body: `${c.name} owes ₹${bal.toLocaleString("en-IN")}`,
            amount: bal,
            read: false,
          });
        } else if (bal >= 2000) {
          notifs.push({
            id: `overdue-med-${c.id}`,
            type: "overdue_medium",
            title: "Payment Reminder",
            body: `${c.name} has ₹${bal.toLocaleString("en-IN")} outstanding`,
            amount: bal,
            read: false,
          });
        }
      });
    } catch { /* silently skip if customer_ledger doesn't exist */ }

    // Low stock check
    try {
      const { data: products } = await supabase.from("products")
        .select("id, name").eq("agency_id", agency.id).eq("is_deleted", false);
      if (products) {
        const { getStockBalances } = await import("@/lib/stock-store");
        const balances = getStockBalances(agency.id, products);
        products.forEach((p: any) => {
          const bal = balances[p.id];
          if (bal && bal.currentStock < 10) {
            notifs.push({
              id: `low-stock-${p.id}`,
              type: "low_stock",
              title: "Low Stock Warning",
              body: `${p.name} — only ${bal.currentStock} units left`,
              read: false,
            });
          }
        });
      }
    } catch { }

    // Mark read status from localStorage
    const currentRead = getReadIds();
    setReadIds(currentRead);
    setNotifications(notifs.map(n => ({ ...n, read: currentRead.has(n.id) })));
    setRefreshing(false);
  }, [agency]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Position the panel relative to the bell button
  const updatePanelPosition = useCallback(() => {
    if (!bellRef.current) return;
    const rect = bellRef.current.getBoundingClientRect();
    const margin = 8;
    const isMobile = window.innerWidth < 640;

    if (isMobile) {
      // On mobile: pin to left edge with full usable width
      setPanelPos({
        top: rect.bottom + margin,
        left: margin,
      });
    } else if (align === "left") {
      setPanelPos({
        top: rect.bottom + margin,
        left: Math.max(margin, rect.left),
      });
    } else {
      const rightPos = window.innerWidth - rect.right;
      setPanelPos({
        top: rect.bottom + margin,
        right: Math.max(margin, rightPos),
      });
    }
  }, [align]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        panelRef.current && !panelRef.current.contains(e.target as Node) &&
        (!portalRef.current || !portalRef.current.contains(e.target as Node))
      ) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handler);
      updatePanelPosition();
    }
    return () => document.removeEventListener("mousedown", handler);
  }, [open, updatePanelPosition]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    const allIds = new Set(notifications.map(n => n.id));
    saveReadIds(allIds);
    setReadIds(allIds);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    const next = new Set(readIds);
    next.add(id);
    saveReadIds(next);
    setReadIds(next);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const typeConfig: Record<Notification["type"], { icon: React.ReactNode; colorClass: string; dotClass: string }> = {
    overdue_high: {
      icon: <AlertTriangle className="w-4 h-4" />,
      colorClass: "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30",
      dotClass: "bg-red-500",
    },
    overdue_medium: {
      icon: <TrendingDown className="w-4 h-4" />,
      colorClass: "text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30",
      dotClass: "bg-amber-500",
    },
    low_stock: {
      icon: <Package className="w-4 h-4" />,
      colorClass: "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30",
      dotClass: "bg-blue-500",
    },
  };

  const panelStyle: React.CSSProperties = {
    position: "fixed",
    zIndex: 9999,
    top: panelPos.top,
    ...(panelPos.left !== undefined ? { left: panelPos.left } : {}),
    ...(panelPos.right !== undefined ? { right: panelPos.right } : {}),
    width: window.innerWidth < 640 ? `calc(100vw - 16px)` : "min(340px, calc(100vw - 16px))",
    maxWidth: "calc(100vw - 16px)",
  };

  return (
    <div className="relative inline-flex items-center" ref={panelRef}>
      {/* Bell Button */}
      <button
        ref={bellRef}
        id="notification-bell"
        onClick={() => {
          setOpen(v => {
            if (!v) {
              loadNotifications();
              setTimeout(updatePanelPosition, 0);
            }
            return !v;
          });
        }}
        className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-all duration-200 active:scale-90"
        title="Notifications"
        aria-label="Open notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-4 w-4 min-w-[1rem] rounded-full bg-red-500 text-white text-[9px] font-extrabold flex items-center justify-center shadow-sm notification-badge-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Slide-out Panel via Portal */}
      {open && typeof document !== "undefined" && createPortal(
        <div
          ref={portalRef}
          style={panelStyle}
          className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden notification-panel-enter"
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-muted/40">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-primary" />
              <span className="font-bold text-sm">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-extrabold">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => loadNotifications()}
                className={cn("p-1 rounded hover:bg-muted text-muted-foreground transition-all", refreshing && "animate-spin")}
                title="Refresh notifications"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-[10px] text-primary hover:underline font-semibold flex items-center gap-1 px-1"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-3 h-3" /> All read
                </button>
              )}
              <button onClick={() => setOpen(false)} className="p-1 rounded hover:bg-muted text-muted-foreground ml-1">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Notification List */}
          <div className="max-h-[min(360px,60vh)] overflow-y-auto divide-y divide-border/50">
            {refreshing && notifications.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                <RefreshCw className="w-6 h-6 mx-auto mb-2 animate-spin opacity-40" />
                <p className="text-xs">Loading alerts…</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="font-semibold">All clear!</p>
                <p className="text-xs mt-0.5 text-muted-foreground">No outstanding alerts right now.</p>
              </div>
            ) : (
              notifications.map(n => {
                const cfg = typeConfig[n.type];
                return (
                  <div
                    key={n.id}
                    className={cn(
                      "p-3 flex items-start gap-3 hover:bg-muted/30 transition-colors cursor-pointer select-none",
                      !n.read && "bg-primary/5"
                    )}
                    onClick={() => markRead(n.id)}
                  >
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${cfg.colorClass}`}>
                      {cfg.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className={cn("text-xs font-bold truncate", !n.read ? "text-foreground" : "text-muted-foreground")}>
                          {n.title}
                        </p>
                        {!n.read && <span className={`w-2 h-2 rounded-full shrink-0 mt-0.5 ${cfg.dotClass}`} />}
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{n.body}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2.5 border-t border-border bg-muted/20">
              <p className="text-[10px] text-muted-foreground text-center">
                {notifications.filter(n => n.read).length} of {notifications.length} alerts reviewed
              </p>
            </div>
          )}
        </div>,
        document.body
      )}
    </div>
  );
}

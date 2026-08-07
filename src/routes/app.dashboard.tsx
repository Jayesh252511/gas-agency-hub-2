import { createFileRoute, Link } from "@tanstack/react-router";
import { RequireAgencyUser } from "@/components/route-guards";
import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { fmtCurrency, fmtDate, todayISO } from "@/lib/format";
import {
  ShoppingCart, HandCoins, Receipt, UserPlus, TrendingUp, AlertCircle,
  Users, Clock, Flame, ChevronRight, Trash2, Calendar,
  ArrowDownToLine, ArrowUpFromLine
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";


export const Route = createFileRoute("/app/dashboard")({ component: () => <RequireAgencyUser><Dash/></RequireAgencyUser> });

interface ActivityItem {
  id: string;
  type: "sale" | "payment" | "expense";
  title: string;
  amount: number;
  timestamp: string;
  is_deleted: boolean;
}

interface TopCustomer {
  id: string;
  name: string;
  outstanding: number;
}

function Dash() {
  const { agency } = useAuth();

  const { data: dashData, isLoading: queryLoading } = useQuery({
    queryKey: ["dashboard-data", agency?.id],
    queryFn: async () => {
      if (!agency) return null;
      const today = todayISO();
      const monthStart = `${today.substring(0, 8)}01`;

      const [
        salesQ, 
        paysQ, 
        expQ, 
        custQ, 
        cashQ, 
        recentSales, 
        recentPayments, 
        recentExpenses,
        allSalesQ,
        allExpQ,
        allSettlesQ,
        monthlySalesQ,
        allCustCount,
        allBoyCount,
        ledgerQ,
        allPaymentsQ
      ] = await Promise.all([
        // Today's aggregates
        (supabase.from("sales") as any).select("gross_amount, commission_amount, payment_mode, notes").eq("agency_id", agency.id).eq("is_deleted", false).eq("sale_date", today),
        (supabase.from("payments") as any).select("amount, mode").eq("agency_id", agency.id).eq("is_deleted", false).eq("payment_date", today),
        (supabase.from("expenses") as any).select("amount").eq("agency_id", agency.id).eq("is_deleted", false).eq("expense_date", today),
        (supabase.from("customers") as any).select("id, name, outstanding:outstanding_balance").eq("agency_id", agency.id).eq("is_deleted", false),
        (supabase.from("cash_book_days") as any).select("opening_cash, notes").eq("agency_id", agency.id).eq("book_date", today).maybeSingle(),
        
        // Activity feeds
        (supabase.from("sales") as any).select("id, gross_amount, created_at, is_deleted, customer:customers(name)").eq("agency_id", agency.id).order("created_at", { ascending: false }).limit(4),
        (supabase.from("payments") as any).select("id, amount, created_at, is_deleted, customer:customers(name)").eq("agency_id", agency.id).order("created_at", { ascending: false }).limit(4),
        (supabase.from("expenses") as any).select("id, category, amount, created_at, is_deleted").eq("agency_id", agency.id).order("created_at", { ascending: false }).limit(4),

        // Commission & Gross Sales calculation aggregates
        (supabase.from("sales") as any).select("gross_amount, commission_amount").eq("agency_id", agency.id).eq("is_deleted", false),
        (supabase.from("expenses") as any).select("amount").eq("agency_id", agency.id).eq("category", "delivery_boy_payment").eq("is_deleted", false),
        (supabase.from("delivery_settlements") as any).select("commission_kept").eq("agency_id", agency.id).eq("is_deleted", false),

        // Monthly and count aggregates
        (supabase.from("sales") as any).select("gross_amount").eq("agency_id", agency.id).eq("is_deleted", false).gte("sale_date", monthStart).lte("sale_date", today),
        (supabase.from("customers") as any).select("id", { count: "exact" }).eq("agency_id", agency.id).eq("is_deleted", false),
        (supabase.from("delivery_boys") as any).select("id", { count: "exact" }).eq("agency_id", agency.id).eq("is_deleted", false),
        
        // Authoritative ledger sum query
        (supabase.from("customer_ledger") as any).select("customer_id, debit, credit").eq("agency_id", agency.id),
        
        // System-wide Payments query for Admin Audit Panel
        (supabase.from("payments") as any).select("amount").eq("agency_id", agency.id).eq("is_deleted", false)
      ]);

      // Calculate Core Today Metrics
      const grossSales = ((salesQ.data ?? []) as any[]).reduce((a, r) => a + Number(r.gross_amount), 0);
      const commissionPaid = ((salesQ.data ?? []) as any[]).reduce((a, r) => a + Number(r.commission_amount), 0);
      const expenses = ((expQ.data ?? []) as any[]).reduce((a, r) => a + Number(r.amount), 0);
      
      // Calculate Outstanding Udhari dynamically and authoritatively from active customer balances
      const outstanding = ((custQ.data ?? []) as any[]).reduce((a, r) => a + Number(r.outstanding || 0), 0);
      const openingCash = Number(cashQ.data?.opening_cash ?? 0);

      // Parse Other Cash Receipts today
      let otherReceiptsToday = 0;
      if (cashQ.data?.notes) {
        try {
          const meta = JSON.parse(cashQ.data.notes);
          if (meta && typeof meta === "object" && meta.other_cash_receipts != null) {
            otherReceiptsToday = Number(meta.other_cash_receipts);
          }
        } catch (e) {}
      }

      // Today's cash inflows (Cash Sales Net of instant delivery commissions + Cash Udhari Recovery payments)
      let cashSalesTodayNet = 0;
      ((salesQ.data ?? []) as any[]).forEach((s) => {
        let isSplitSale = false;
        let cashAmt = 0;
        if (s.notes) {
          try {
            const meta = JSON.parse(s.notes);
            if (meta && typeof meta === "object" && meta.is_split) {
              isSplitSale = true;
              cashAmt = Number(meta.cash_amount || 0);
            }
          } catch (e) {}
        }
        if (!isSplitSale) {
          cashAmt = s.payment_mode === "cash" ? Number(s.gross_amount || 0) : 0;
        }
        const comm = Number(s.commission_amount || 0);
        cashSalesTodayNet += Math.max(0, cashAmt - comm);
      });

      const cashPaymentsToday = ((paysQ.data ?? []) as any[]).filter(p => p.mode === "cash").reduce((a, r) => a + Number(r.amount), 0);
      
      // Expected Cash Drawer Balance (Cash In Hand) - matches Cashbook net-inflow formula exactly
      const cashInHand = openingCash + cashSalesTodayNet + cashPaymentsToday + otherReceiptsToday - expenses;

      // Today's total Cash Received (Cash sales net of commission + Cash recoveries + other receipts)
      const cashCollections = cashSalesTodayNet + cashPaymentsToday + otherReceiptsToday;

      // Pending boy commission aggregates
      const totalCommissionEarned = ((allSalesQ.data ?? []) as any[]).reduce((a, r) => a + Number(r.commission_amount), 0);
      const totalPayouts = ((allExpQ.data ?? []) as any[]).reduce((a, r) => a + Number(r.amount), 0);
      const totalCommissionKept = ((allSettlesQ.data ?? []) as any[]).reduce((a, r) => a + Number(r.commission_kept), 0);
      const pendingCommission = totalCommissionEarned - totalPayouts - totalCommissionKept;

      // Monthly sales & total count aggregates
      const monthlyRevenue = ((monthlySalesQ.data ?? []) as any[]).reduce((a, r) => a + Number(r.gross_amount), 0);
      const totalCustomers = allCustCount.count ?? 0;
      const totalDeliveryBoys = allBoyCount.count ?? 0;

      // System-wide ERP Audit Reconciliation figures
      const totalSystemSales = ((allSalesQ.data ?? []) as any[]).reduce((a, r) => a + Number(r.gross_amount || 0), 0);
      const totalSystemPayments = ((allPaymentsQ.data ?? []) as any[]).reduce((a, r) => a + Number(r.amount || 0), 0);
      const totalSystemOutstanding = ((custQ.data ?? []) as any[]).reduce((a, r) => a + Number(r.outstanding || 0), 0);

      // Format Top Customers by Outstanding
      const sortedCustomers = ((custQ.data ?? []) as any[])
        .sort((a: any, b: any) => b.outstanding - a.outstanding)
        .slice(0, 4) as TopCustomer[];

      // Format Top Products sold today
      const { data: todayProductsSales } = await (supabase.from("sales") as any)
        .select("quantity, product:products(name)")
        .eq("agency_id", agency.id)
        .eq("sale_date", today)
        .eq("is_deleted", false);
      
      const productMap: Record<string, number> = {};
      ((todayProductsSales ?? []) as any[]).forEach((s) => {
        const name = s.product?.name ?? "Cylinder";
        productMap[name] = (productMap[name] ?? 0) + Number(s.quantity);
      });

      const sortedProducts = Object.entries(productMap)
        .map(([name, qty]) => ({ name, qty }))
        .sort((a, b) => b.qty - a.qty)
        .slice(0, 4);

      // Compile Recent Audit Activities
      const items: ActivityItem[] = [];
      
      ((recentSales.data ?? []) as any[]).forEach((s) => {
        items.push({
          id: s.id,
          type: "sale",
          title: `Sale to ${s.customer?.name ?? "Counter Client"}`,
          amount: Number(s.gross_amount),
          timestamp: s.created_at,
          is_deleted: s.is_deleted
        });
      });

      ((recentPayments.data ?? []) as any[]).forEach((p: any) => {
        items.push({
          id: p.id,
          type: "payment",
          title: `Payment from ${p.customer?.name ?? "—"}`,
          amount: Number(p.amount),
          timestamp: p.created_at,
          is_deleted: p.is_deleted
        });
      });

      ((recentExpenses.data ?? []) as any[]).forEach((e) => {
        items.push({
          id: e.id,
          type: "expense",
          title: `Overhead ${e.category.toUpperCase()}`,
          amount: Number(e.amount),
          timestamp: e.created_at,
          is_deleted: e.is_deleted
        });
      });

      const sortedActivities = items
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 4);

      return {
        metrics: {
          grossSales,
          cashCollections,
          outstanding,
          commissionPaid,
          expenses,
          openingCash,
          cashInHand,
          pendingCommission,
          monthlyRevenue,
          totalCustomers,
          totalDeliveryBoys
        },
        auditMetrics: {
          totalSales: totalSystemSales,
          totalPayments: totalSystemPayments,
          totalOutstanding: totalSystemOutstanding,
          ledgerOutstanding: outstanding
        },
        topCustomers: sortedCustomers,
        topProducts: sortedProducts,
        activities: sortedActivities
      };
    },
    enabled: !!agency?.id,
  });

  const metrics = dashData?.metrics ?? {
    grossSales: 0,
    cashCollections: 0,
    outstanding: 0,
    commissionPaid: 0,
    expenses: 0,
    openingCash: 0,
    cashInHand: 0,
    pendingCommission: 0,
    monthlyRevenue: 0,
    totalCustomers: 0,
    totalDeliveryBoys: 0
  };

  const auditMetrics = dashData?.auditMetrics ?? {
    totalSales: 0,
    totalPayments: 0,
    totalOutstanding: 0,
    ledgerOutstanding: 0
  };

  const topCustomers = dashData?.topCustomers ?? [];
  const activities = dashData?.activities ?? [];
  const topProducts = dashData?.topProducts ?? [];
  const busy = queryLoading;

  return (
    <div className="space-y-6 pb-8 animate-page-in">

      {/* Agency Header — Editorial Banner */}
      <div style={{
        background:'#FFFFFF', border:'1px solid #E8E8E8', borderRadius:16,
        padding:'20px 24px', display:'flex', flexDirection:'row', justifyContent:'space-between',
        alignItems:'center', flexWrap:'wrap', gap:16,
        boxShadow:'0 2px 8px rgba(0,0,0,0.03)', position:'relative', overflow:'hidden'
      }} className="dark:bg-[#1A1A1A] dark:border-white/10">
        <div style={{position:'absolute',top:0,left:0,right:0,height:3}} className="bg-foreground"/>
        <div style={{display:'flex',alignItems:'center',gap:14,minWidth:0}}>
          {(agency as any)?.logo_url
            ?<img src={(agency as any).logo_url} style={{width:48,height:48,borderRadius:12,objectFit:'cover',border:'1px solid #E8E8E8',flexShrink:0}} alt="Agency Logo"/>
            :<div style={{width:48,height:48,borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,boxShadow:'0 4px 14px rgba(0,0,0,0.15)'}} className="bg-foreground text-background">
              <Flame className="w-6 h-6 animate-pulse"/>
            </div>
          }
          <div style={{minWidth:0}}>
            <h1 style={{fontFamily:"'Space Grotesk','Inter',sans-serif",fontWeight:700,fontSize:22,letterSpacing:'-0.02em',color:'#111111',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}} className="dark:text-[#F0F0F0]">
              {agency?.name ?? "LPG Distributorship"}
            </h1>
            <div style={{display:'flex',alignItems:'center',gap:8,marginTop:4}}>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:700,padding:'2px 8px',borderRadius:4,letterSpacing:'.1em'}} className="bg-muted text-foreground border border-border">
                {agency?.code || "LPG"}
              </span>
              <span style={{fontFamily:"'Silkscreen',monospace",fontSize:8,color:'#AAAAAA',letterSpacing:'.18em',textTransform:'uppercase'}}>
                Distributorship Dashboard
              </span>
            </div>
          </div>
        </div>
        <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end'}}>
          <span style={{fontFamily:"'Silkscreen',monospace",fontSize:8,color:'#AAAAAA',letterSpacing:'.14em',textTransform:'uppercase'}}>Today's Date</span>
          <div style={{display:'flex',alignItems:'center',gap:6,marginTop:4}}>
            <Calendar className="h-4 w-4 text-foreground" style={{flexShrink:0}}/>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:700,fontSize:14,color:'#111111',letterSpacing:'-0.01em'}} className="dark:text-[#F0F0F0]">
              {fmtDate(todayISO())}
            </span>
          </div>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Today's Sales" value={fmtCurrency(metrics.grossSales)} desc="Total cylinder sales today" accent="orange" icon={<TrendingUp className="w-4 h-4"/>}/>
        <KpiCard label="Cash Received" value={fmtCurrency(metrics.cashCollections)} desc="Cash collected today" accent="green" icon={<HandCoins className="w-4 h-4"/>}/>
        <KpiCard label="Outstanding Dues" value={fmtCurrency(metrics.outstanding)} desc="Total customer balance pending" accent="red" icon={<AlertCircle className="w-4 h-4"/>}/>
        <KpiCard label="Today's Expenses" value={fmtCurrency(metrics.expenses)} desc="Operating expenses today" accent="amber" icon={<Receipt className="w-4 h-4"/>}/>
      </div>

      {/* Quick Actions */}
      <div>
        <div style={{fontFamily:"'Silkscreen',monospace",fontSize:9,color:'#AAAAAA',letterSpacing:'.18em',textTransform:'uppercase',marginBottom:14}}>
          // Quick Actions
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <QuickAct to="/app/sales" icon={<ShoppingCart className="w-5 h-5"/>} label="New Sale"/>
          <QuickAct to="/app/payments" icon={<HandCoins className="w-5 h-5"/>} label="Receive Payment"/>
          <QuickAct to="/app/expenses" icon={<Receipt className="w-5 h-5"/>} label="New Expense"/>
          <QuickAct to="/app/customers" icon={<UserPlus className="w-5 h-5"/>} label="New Customer"/>
          <QuickAct to="/app/payment-inflow" icon={<ArrowDownToLine className="w-5 h-5"/>} label="Record Inflow"/>
          <QuickAct to="/app/payment-outflow" icon={<ArrowUpFromLine className="w-5 h-5"/>} label="Record Outflow"/>
        </div>
      </div>

      {/* Activity / Dues / Products Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Recent Activity */}
        <div className="ed-panel">
          <div className="ed-panel-header">
            <span className="ed-panel-title">
              <Clock className="h-3.5 w-3.5" style={{color:'#FF6B00'}}/> Recent Audit Activity
            </span>
            <span className="ed-live-badge">● Live</span>
          </div>
          <div style={{maxHeight:360,overflowY:'auto'}}>
            {busy
              ?<div style={{padding:32,textAlign:'center',fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:'#AAAAAA'}}>Loading...</div>
              :activities.length===0
                ?<div style={{padding:32,textAlign:'center',fontFamily:"'Inter',sans-serif",fontSize:13,color:'#AAAAAA'}}>No transactions recorded today.</div>
                :activities.map(act=>(
                <div key={act.id} style={{
                  padding:'12px 20px', display:'flex', alignItems:'center', justifyContent:'space-between',
                  borderBottom:'1px solid #F0F0F0', opacity:act.is_deleted?.5:1
                }} className="dark:border-white/5 hover:bg-[#FAFAFA] dark:hover:bg-white/[0.02] transition-colors">
                  <div style={{display:'flex',alignItems:'center',gap:12,minWidth:0}}>
                    <div style={{
                      width:34,height:34,borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,
                      background: act.is_deleted?'rgba(239,68,68,0.08)':act.type==='sale'?'rgba(255,107,0,0.08)':act.type==='payment'?'rgba(16,185,129,0.08)':'rgba(245,158,11,0.08)',
                      color: act.is_deleted?'#EF4444':act.type==='sale'?'#FF6B00':act.type==='payment'?'#10B981':'#F59E0B'
                    }}>
                      {act.is_deleted?<Trash2 className="h-4 w-4"/>:act.type==='sale'?<ShoppingCart className="h-4 w-4"/>:act.type==='payment'?<HandCoins className="h-4 w-4"/>:<Receipt className="h-4 w-4"/>}
                    </div>
                    <div style={{minWidth:0}}>
                      <p style={{fontFamily:"'Inter',sans-serif",fontWeight:600,fontSize:13,color:'#111111',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',textDecoration:act.is_deleted?'line-through':'none'}} className="dark:text-[#E0E0E0]">
                        {act.title}
                      </p>
                      <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'#AAAAAA',marginTop:2}}>
                        {fmtDate(act.timestamp)} · {new Date(act.timestamp).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}
                      </p>
                    </div>
                  </div>
                  <span style={{
                    fontFamily:"'JetBrains Mono',monospace",fontWeight:700,fontSize:13,flexShrink:0,marginLeft:8,
                    color: act.is_deleted?'#AAAAAA':act.type==='expense'?'#EF4444':'#10B981',
                    textDecoration:act.is_deleted?'line-through':'none'
                  }}>
                    {act.type==='expense'?'-':'+'}{fmtCurrency(act.amount)}
                  </span>
                </div>
              ))
            }
          </div>
        </div>

        {/* Top Dues */}
        <div className="ed-panel">
          <div className="ed-panel-header">
            <span className="ed-panel-title">
              <Users className="h-3.5 w-3.5" style={{color:'#EF4444'}}/> Priority Udhari Dues
            </span>
            <span className="ed-alert-badge">⚠ Alert</span>
          </div>
          <div>
            {busy
              ?<div style={{padding:32,textAlign:'center',fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:'#AAAAAA'}}>Loading...</div>
              :topCustomers.length===0
                ?<div style={{padding:32,textAlign:'center',fontFamily:"'Inter',sans-serif",fontSize:13,color:'#AAAAAA'}}>All customer balances cleared!</div>
                :topCustomers.map(cust=>(
                <Link key={cust.id} to="/app/customers/$id" params={{id:cust.id}}
                  style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'14px 20px',borderBottom:'1px solid #F0F0F0',textDecoration:'none',transition:'background .15s'}}
                  className="dark:border-white/5 hover:bg-[#FFF8F5] dark:hover:bg-white/[0.02]">
                  <div style={{minWidth:0}}>
                    <p style={{fontFamily:"'Inter',sans-serif",fontWeight:600,fontSize:14,color:'#111111',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}} className="dark:text-[#E0E0E0]">
                      {cust.name}
                    </p>
                    <p style={{fontFamily:"'Silkscreen',monospace",fontSize:8,color:'#AAAAAA',letterSpacing:'.1em',textTransform:'uppercase',marginTop:3}}>
                      View Ledger →
                    </p>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:6,flexShrink:0,marginLeft:12}}>
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:700,fontSize:14,color:'#EF4444'}}>
                      {fmtCurrency(cust.outstanding)}
                    </span>
                    <ChevronRight className="h-4 w-4" style={{color:'#AAAAAA'}}/>
                  </div>
                </Link>
              ))
            }
          </div>
        </div>

        {/* Today's Top Products */}
        <div className="ed-panel">
          <div className="ed-panel-header">
            <span className="ed-panel-title">
              <Flame className="h-3.5 w-3.5 text-foreground"/> Today's Top Products
            </span>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,fontWeight:600,letterSpacing:'.08em'}} className="text-foreground">Volume</span>
          </div>
          <div>
            {busy
              ?<div style={{padding:32,textAlign:'center',fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:'#AAAAAA'}}>Loading...</div>
              :topProducts.length===0
                ?<div style={{padding:32,textAlign:'center',fontFamily:"'Inter',sans-serif",fontSize:13,color:'#AAAAAA'}}>No sales recorded today.</div>
                :topProducts.map((p,idx)=>(
                <div key={p.name} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'13px 20px',borderBottom:'1px solid #F0F0F0'}} className="dark:border-white/5 hover:bg-[#FAFAFA] dark:hover:bg-white/[0.02] transition-colors">
                  <div style={{display:'flex',alignItems:'center',gap:10,minWidth:0}}>
                    <span style={{fontFamily:"'Silkscreen',monospace",fontSize:9,width:16}} className="text-foreground">#{idx+1}</span>
                    <p style={{fontFamily:"'Inter',sans-serif",fontWeight:600,fontSize:14,color:'#111111',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}} className="dark:text-[#E0E0E0]">
                      {p.name}
                    </p>
                  </div>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:700,fontSize:13,padding:'3px 10px',borderRadius:6,flexShrink:0}} className="bg-muted text-foreground border border-border">
                    {p.qty} unit{p.qty!==1?'s':''}
                  </span>
                </div>
              ))
            }
          </div>
        </div>

      </div>

    </div>
  );
}

function KpiCard({label,value,desc,accent,icon}:{label:string;value:string;desc:string;accent:'orange'|'green'|'red'|'amber';icon:React.ReactNode}) {
  const accentColor = {orange:'var(--foreground)',green:'#10B981',red:'#EF4444',amber:'#F59E0B'}[accent];
  return (
    <div className={`kpi-card kpi-${accent}`}>
      <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:10}}>
        <div style={{minWidth:0}}>
          <div className="kpi-label">{label}</div>
          <div className="kpi-value" style={{color:accentColor}}>{value}</div>
          <div className="kpi-desc">{desc}</div>
        </div>
        <div className="kpi-icon" style={{background:accent==='orange'?'rgba(0,0,0,0.06)':`${accentColor}14`,color:accentColor}}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function QuickAct({to,icon,label}:{to:string;icon:React.ReactNode;label:string}) {
  return (
    <Link to={to} className="qa-card">
      <div className="qa-icon">{icon}</div>
      <span className="qa-label">{label}</span>
    </Link>
  );
}

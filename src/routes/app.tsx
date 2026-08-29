import { createFileRoute, Outlet, redirect, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getMe } from "@/lib/auth.functions";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { NotificationCenter } from "@/components/notification-center";
import { GlobalSearch } from "@/components/global-search";
import { PwaInstallPrompt } from "@/components/pwa-install-prompt";
import {
  LayoutDashboard, ShoppingCart, Users, Package, IndianRupee,
  Receipt, Wallet, Truck, BookOpen, LogOut, Flame, Menu, UserCog,
  ArrowDownToLine, ArrowUpFromLine, Coins, Moon, Sun, BarChart2,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app")({
  beforeLoad: async () => {
    if (typeof window === "undefined") return;
    const { data } = await supabase.auth.getSession();
    if (!data.session) throw redirect({ to: "/login" });
  },
  component: AppLayout,
});

const NAV = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/app/sales", label: "Sales", icon: ShoppingCart },
  { to: "/app/customers", label: "Customers", icon: Users },
  { to: "/app/udhari", label: "Credit Book (उधारी)", icon: IndianRupee },
  { to: "/app/payments", label: "Payments (उधारी-जमा)", icon: Wallet },
  { to: "/app/expenses", label: "Expenses", icon: Receipt },
  { to: "/app/products", label: "Products", icon: Package },
  { to: "/app/delivery-boys", label: "Delivery Boys", icon: Truck },
  { to: "/app/cashbook", label: "Cash Book", icon: BookOpen },
  { to: "/app/payment-inflow", label: "Payment Inflow", icon: ArrowDownToLine },
  { to: "/app/payment-outflow", label: "Payment Outflow", icon: ArrowUpFromLine },
  { to: "/app/outstanding", label: "Outstanding (उधारी देणे)", icon: Coins },
  { to: "/app/analytics", label: "Analytics", icon: BarChart2 },
  { to: "/app/reports", label: "Reports", icon: Receipt },
  { to: "/app/profile", label: "Profile", icon: UserCog },
] as const;

function AppLayout() {
  const meFn = useServerFn(getMe);
  const { data: me } = useQuery({ queryKey: ["me"], queryFn: () => meFn() });
  const { roles } = useAuth();
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;

  // Dark mode theme state
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Initial theme setup
    const isDark = localStorage.getItem("theme") === "dark" ||
      (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches);
    if (isDark) {
      document.documentElement.classList.add("dark");
      setTheme("dark");
    } else {
      document.documentElement.classList.remove("dark");
      setTheme("light");
    }
  }, []);

  // Register service worker for PWA
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => { });
    }
  }, []);

  const toggleTheme = () => {
    if (theme === "light") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setTheme("dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setTheme("light");
    }
  };

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (document.activeElement && (document.activeElement as HTMLInputElement).type === "number") {
        (document.activeElement as HTMLInputElement).blur();
      }
    };
    document.addEventListener("wheel", handleWheel, { passive: true });
    return () => {
      document.removeEventListener("wheel", handleWheel);
    };
  }, []);

  const isAdmin = useMemo(() => {
    return roles.includes("agency_admin") || roles.includes("platform_admin" as any);
  }, [roles]);

  const navItems = useMemo(() => {
    return NAV.filter((item) => {
      if (item.to === "/app/users" && !isAdmin) return false;
      return true;
    });
  }, [isAdmin]);

  async function signOut() {
    await supabase.auth.signOut();
    nav({ to: "/login" });
  }

  return (
    <div className="min-h-screen flex text-foreground transition-colors duration-200 app-editorial app-editorial-bg" style={{backgroundColor: 'var(--background)'}}>
      {/* ── SIDEBAR (desktop) ── */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-sidebar border-r border-sidebar-border" style={{position:'relative',zIndex:10}}>

        {/* Agency Brand Header */}
        <div style={{padding:'18px 20px 14px', borderBottom:'1px solid var(--sidebar-border)', background:'var(--sidebar)'}}>
          <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
            <div style={{display:'flex', alignItems:'center', gap:10, minWidth:0}}>
              {me?.agency?.logo_url ? (
                <img src={me.agency.logo_url} style={{width:36,height:36,borderRadius:10,objectFit:'cover',border:'1px solid var(--sidebar-border)',flexShrink:0}} alt="Agency Logo"/>
              ) : (
                <div style={{width:36,height:36,borderRadius:10,background:'var(--foreground)',color:'var(--background)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,boxShadow:'0 2px 8px rgba(0,0,0,0.15)'}}>
                  <Flame className="w-4 h-4"/>
                </div>
              )}
              <div style={{minWidth:0}}>
                <div style={{fontFamily:"'Space Grotesk','Inter',sans-serif",fontWeight:700,fontSize:14,letterSpacing:'-0.01em',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',color:'var(--sidebar-foreground)'}}>
                  {me?.agency?.name ?? "LPG Agency"}
                </div>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'var(--foreground)',letterSpacing:'.1em',marginTop:2}}>
                  {me?.agency?.code ?? ""}
                </div>
              </div>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:4,flexShrink:0}}>
              <NotificationCenter align="left"/>
              <button onClick={toggleTheme} style={{padding:'6px',borderRadius:8,background:'transparent',border:'none',cursor:'pointer',color:'var(--muted-foreground)',transition:'color .2s'}} title={theme==="dark"?"Switch to Light":"Switch to Dark"}>
                <div className={cn("transition-transform duration-500",theme==="dark"?"rotate-[360deg] scale-110":"rotate-0")}>
                  {theme==="dark"?<Sun className="w-4 h-4"/>:<Moon className="w-4 h-4"/>}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Global Search */}
        <div style={{padding:'12px 14px 6px'}}>
          <GlobalSearch/>
        </div>

        {/* Nav */}
        <nav style={{flex:1, padding:'8px 10px', overflowY:'auto', display:'flex', flexDirection:'column', gap:2}}>

          {/* // MAIN */}
          <div style={{fontFamily:"'Silkscreen',monospace",fontSize:'8px',color:'#AAAAAA',letterSpacing:'.18em',textTransform:'uppercase',padding:'10px 8px 4px'}}>// Main</div>
          {[
            {to:"/app",label:"Dashboard",icon:LayoutDashboard,exact:true},
            {to:"/app/sales",label:"Sales",icon:ShoppingCart},
            {to:"/app/customers",label:"Customers",icon:Users},
          ].map(n=>(
            <Link key={n.to} to={n.to}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 text-gray-300 hover:text-white hover:bg-white/10"
              style={{fontFamily:"'Inter',sans-serif",fontSize:13,textDecoration:'none'}}
              activeProps={{className:"nav-item-active font-semibold text-white bg-white/15 border-l-4 border-primary pl-2.5", style:{fontFamily:"'Inter',sans-serif",fontSize:13,textDecoration:'none'}}}
              activeOptions={{exact:(n as any).exact}}
            >
              <n.icon className="w-4 h-4 shrink-0"/>
              <span>{n.label}</span>
            </Link>
          ))}

          {/* // FINANCE */}
          <div style={{fontFamily:"'Silkscreen',monospace",fontSize:'8px',color:'#AAAAAA',letterSpacing:'.18em',textTransform:'uppercase',padding:'14px 8px 4px'}}>// Finance</div>
          {[
            {to:"/app/udhari",label:"Credit Book (उधारी)",icon:IndianRupee},
            {to:"/app/payments",label:"Payments (उधारी-जमा)",icon:Wallet},
            {to:"/app/expenses",label:"Expenses",icon:Receipt},
            {to:"/app/cashbook",label:"Cash Book",icon:BookOpen},
            {to:"/app/payment-inflow",label:"Payment Inflow",icon:ArrowDownToLine},
            {to:"/app/payment-outflow",label:"Payment Outflow",icon:ArrowUpFromLine},
            {to:"/app/outstanding",label:"Outstanding (उधारी देणे)",icon:Coins},
          ].map(n=>(
            <Link key={n.to} to={n.to}
              style={{fontFamily:"'Inter',sans-serif",fontWeight:500,fontSize:13,color:'var(--sidebar-foreground)',textDecoration:'none'}}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:translate-x-[2px]"
              activeProps={{className:"nav-item-active",style:{fontFamily:"'Inter',sans-serif",fontWeight:600,fontSize:13,color:'var(--foreground)',textDecoration:'none',background:'var(--muted)',borderLeft:'3px solid var(--foreground)',paddingLeft:9}}}
            >
              <n.icon className="w-4 h-4 shrink-0"/>
              <span>{n.label}</span>
            </Link>
          ))}

          {/* // MANAGE */}
          <div style={{fontFamily:"'Silkscreen',monospace",fontSize:'8px',color:'#AAAAAA',letterSpacing:'.18em',textTransform:'uppercase',padding:'14px 8px 4px'}}>// Manage</div>
          {[
            {to:"/app/products",label:"Products",icon:Package},
            {to:"/app/delivery-boys",label:"Delivery Boys",icon:Truck},
            {to:"/app/analytics",label:"Analytics",icon:BarChart2},
            {to:"/app/reports",label:"Reports",icon:Receipt},
            {to:"/app/profile",label:"Profile",icon:UserCog},
            ...(isAdmin?[{to:"/app/users",label:"Users",icon:UserCog}]:[]),
          ].map(n=>(
            <Link key={n.to} to={n.to}
              style={{fontFamily:"'Inter',sans-serif",fontWeight:500,fontSize:13,color:'var(--sidebar-foreground)',textDecoration:'none'}}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:translate-x-[2px]"
              activeProps={{className:"nav-item-active",style:{fontFamily:"'Inter',sans-serif",fontWeight:600,fontSize:13,color:'var(--foreground)',textDecoration:'none',background:'var(--muted)',borderLeft:'3px solid var(--foreground)',paddingLeft:9}}}
            >
              <n.icon className="w-4 h-4 shrink-0"/>
              <span>{n.label}</span>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div style={{padding:'12px 14px',borderTop:'1px solid var(--sidebar-border)'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
            <div style={{display:'flex',alignItems:'center',gap:6}}>
              <span style={{width:6,height:6,borderRadius:2,background:'var(--foreground)',display:'inline-block'}} className="pixel-blink"/>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'var(--muted-foreground)'}}>
                {me?.user?.full_name ?? me?.user?.username}
              </span>
            </div>
          </div>
          <button onClick={signOut} style={{width:'100%',display:'flex',alignItems:'center',gap:8,padding:'8px 12px',borderRadius:10,border:'1px solid var(--sidebar-border)',background:'transparent',cursor:'pointer',color:'var(--muted-foreground)',fontFamily:"'Inter',sans-serif",fontSize:13,transition:'all .2s'}}
            onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.borderColor='var(--foreground)';(e.currentTarget as HTMLButtonElement).style.color='var(--foreground)';}}
            onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.borderColor='var(--sidebar-border)';(e.currentTarget as HTMLButtonElement).style.color='var(--muted-foreground)';}}>
            <LogOut className="w-4 h-4"/> Sign Out
          </button>
        </div>
      </aside>

      {/* ── MOBILE CONTAINER ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Mobile Header */}
        <header style={{background:'var(--sidebar)',borderBottom:'1px solid var(--sidebar-border)',position:'sticky',top:0,zIndex:30,padding:'0 16px',height:56,display:'flex',alignItems:'center',justifyContent:'space-between'}} className="lg:hidden">
          <button onClick={()=>setOpen(!open)} style={{padding:8,marginLeft:-8,background:'none',border:'none',cursor:'pointer',color:'var(--foreground)'}}>
            <Menu className="w-5 h-5"/>
          </button>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            {me?.agency?.logo_url
              ?<img src={me.agency.logo_url} style={{width:28,height:28,borderRadius:8,objectFit:'cover'}} alt="Agency Logo"/>
              :<div style={{width:28,height:28,borderRadius:8,background:'var(--foreground)',color:'var(--background)',display:'flex',alignItems:'center',justifyContent:'center'}}><Flame className="w-3.5 h-3.5"/></div>
            }
            <span style={{fontFamily:"'Space Grotesk','Inter',sans-serif",fontWeight:700,fontSize:14,letterSpacing:'-0.01em',maxWidth:140,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
              {me?.agency?.name ?? "LPG Agency"}
            </span>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:4}}>
            <NotificationCenter/>
            <button onClick={toggleTheme} style={{padding:8,background:'none',border:'none',cursor:'pointer',color:'var(--muted-foreground)'}}>
              <div className={cn("transition-transform duration-500",theme==="dark"?"rotate-[360deg]":"")}>
                {theme==="dark"?<Sun className="w-5 h-5"/>:<Moon className="w-5 h-5"/>}
              </div>
            </button>
            <button onClick={signOut} style={{padding:8,marginRight:-8,background:'none',border:'none',cursor:'pointer',color:'var(--muted-foreground)'}}>
              <LogOut className="w-5 h-5"/>
            </button>
          </div>
        </header>

        {/* Mobile Drawer */}
        <div className={cn("lg:hidden fixed inset-0 z-40 transition-opacity duration-300", open?"opacity-100 pointer-events-auto":"opacity-0 pointer-events-none")} onClick={()=>setOpen(false)}>
          <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.4)'}}/>
          <aside className={cn("absolute left-0 top-0 bottom-0 w-72 shadow-xl p-3 overflow-y-auto transition-transform duration-300 ease-out", open?"translate-x-0":"-translate-x-full")}
            style={{background:'var(--sidebar)'}} onClick={e=>e.stopPropagation()}>
            <div style={{marginBottom:12,padding:'12px 8px 14px',borderBottom:'1px solid var(--sidebar-border)',display:'flex',alignItems:'center',gap:10}}>
              {me?.agency?.logo_url
                ?<img src={me.agency.logo_url} style={{width:36,height:36,borderRadius:10,objectFit:'cover'}} alt="Agency Logo"/>
                :<div style={{width:36,height:36,borderRadius:10,background:'var(--foreground)',color:'var(--background)',display:'flex',alignItems:'center',justifyContent:'center'}}><Flame className="w-4 h-4"/></div>
              }
              <div>
                <div style={{fontFamily:"'Space Grotesk','Inter',sans-serif",fontWeight:700,fontSize:14,letterSpacing:'-0.01em'}}>{me?.agency?.name}</div>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'var(--foreground)',letterSpacing:'.1em'}}>{me?.agency?.code}</div>
              </div>
            </div>
            <div style={{marginBottom:12}}><GlobalSearch/></div>
            <div style={{display:'flex',flexDirection:'column',gap:2}}>
              {navItems.map(n=>(
                <Link key={n.to} to={n.to} onClick={()=>setOpen(false)}
                  style={{display:'flex',alignItems:'center',gap:12,padding:'11px 12px',borderRadius:10,fontFamily:"'Inter',sans-serif",fontWeight:500,fontSize:14,color:'var(--sidebar-foreground)',textDecoration:'none',transition:'all .15s'}}
                  activeProps={{style:{display:'flex',alignItems:'center',gap:12,padding:'11px 9px',borderRadius:10,fontFamily:"'Inter',sans-serif",fontWeight:600,fontSize:14,color:'var(--foreground)',textDecoration:'none',background:'var(--muted)',borderLeft:'3px solid var(--foreground)'}}}
                  activeOptions={{exact:(n as any).exact}}
                >
                  <n.icon className="w-5 h-5 shrink-0"/>{n.label}
                </Link>
              ))}
            </div>
          </aside>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 pb-24 lg:p-8 max-w-7xl w-full mx-auto" style={{position:'relative',zIndex:1}}>
          <Outlet/>
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 border-t flex items-center justify-around z-30 pb-safe"
          style={{background:'var(--sidebar)',borderTopColor:'var(--sidebar-border)',boxShadow:'0 -4px 20px rgba(0,0,0,0.04)'}}>
          {[
            {to:"/app",label:"Home",icon:LayoutDashboard,exact:true},
            {to:"/app/sales",label:"Sales",icon:ShoppingCart},
            {to:"/app/cashbook",label:"Cashbook",icon:BookOpen},
            {to:"/app/expenses",label:"Expenses",icon:Receipt},
            {to:"/app/profile",label:"Profile",icon:UserCog},
          ].map(n=>(
            <Link key={n.to} to={n.to}
              activeOptions={{exact:(n as any).exact}}
              style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',flex:1,height:'100%',textDecoration:'none',color:'var(--muted-foreground)',gap:3,fontFamily:"'Inter',sans-serif",fontSize:10,fontWeight:500,transition:'color .2s'}}
              activeProps={{style:{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',flex:1,height:'100%',textDecoration:'none',color:'var(--foreground)',gap:3,fontFamily:"'Inter',sans-serif",fontSize:10,fontWeight:700}}}
            >
              <n.icon className="w-5 h-5"/>
              <span>{n.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      <PwaInstallPrompt/>
    </div>
  );
}

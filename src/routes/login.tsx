import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { loginAgency } from "@/lib/auth.functions";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, Loader2, MessageSquare, Sparkles, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const WA_TRIAL_LINK = "https://wa.me/918605601801?text=Hello%20Jayesh%2C%20I%20want%20to%20start%20a%20free%20trial%20for%20LPG%20Agency%20ERP.";
const WA_DEMO_LINK = "https://wa.me/918605601801?text=Hello%20Jayesh%2C%20I%20want%20to%20book%20a%20live%20demo%20for%20LPG%20Agency%20ERP.";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const fn = useServerFn(loginAgency);
  const [agencyCode, setAgencyCode] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) nav({ to: "/app" });
    });
  }, [nav]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fn({ data: { agencyCode, username, password } });
      await supabase.auth.setSession({ access_token: res.access_token, refresh_token: res.refresh_token });
      toast.success("Signed in");
      nav({ to: "/app" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("auth.invalidCredentials"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-background via-background to-accent/30 px-4 py-4 sm:py-6">
      {/* Top Header Bar with Home, Book Demo, and Start Free Trial */}
      <header className="w-full max-w-5xl mx-auto flex items-center justify-between gap-3 py-2">
        <Link 
          to="/landing" 
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors bg-muted/60 hover:bg-muted px-3.5 py-2 rounded-xl border border-border/60 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="flex items-center gap-2">
          <a
            href={WA_DEMO_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground bg-muted/50 hover:bg-muted px-3 py-2 rounded-xl border border-border/60 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">Book</span> Demo
          </a>
          <a
            href={WA_TRIAL_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 px-3.5 py-2 rounded-xl shadow-sm transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Start Free Trial</span>
          </a>
        </div>
      </header>

      {/* Login Card */}
      <div className="w-full max-w-md mx-auto my-auto py-6">
        <div className="flex items-center gap-2 justify-center mb-6">
          <div className="w-11 h-11 rounded-xl bg-primary text-primary-foreground grid place-items-center shadow-sm">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <div className="font-bold text-lg leading-tight">{t("app.name")}</div>
            <div className="text-xs text-muted-foreground">{t("app.tagline")}</div>
          </div>
        </div>
        <Card className="shadow-lg border-border">
          <CardHeader>
            <CardTitle className="text-2xl">{t("auth.agencyLogin")}</CardTitle>
            <CardDescription>Sign in to your gas agency account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <Label htmlFor="code">{t("auth.agencyCode")}</Label>
                <Input id="code" autoCapitalize="characters" value={agencyCode} onChange={(e) => setAgencyCode(e.target.value)} required className="h-12 text-base" />
              </div>
              <div>
                <Label htmlFor="username">{t("auth.username")}</Label>
                <Input id="username" autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} required className="h-12 text-base" />
              </div>
              <div>
                <Label htmlFor="password">{t("auth.password")}</Label>
                <Input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required className="h-12 text-base" />
              </div>
              <Button type="submit" disabled={loading} className="w-full h-12 text-base font-semibold">
                {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                {t("auth.signIn")}
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={WA_TRIAL_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 p-2.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-950/70 transition-colors text-center"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> Start Free Trial
                </a>
                <a
                  href={WA_DEMO_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 p-2.5 text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-xl hover:bg-amber-100 dark:hover:bg-amber-950/70 transition-colors text-center"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Book Live Demo
                </a>
              </div>

              <div className="text-center text-sm text-muted-foreground pt-1">
                {t("auth.needPlatformAccess")}{" "}
                <Link to="/platform-admin/login" className="text-primary font-medium hover:underline">
                  {t("auth.platformLogin")}
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <footer className="text-center text-xs text-muted-foreground py-2">
        © LPG Agency ERP · Powered by ProERP
      </footer>
    </div>
  );
}

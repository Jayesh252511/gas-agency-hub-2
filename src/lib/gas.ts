export const WHATSAPP = "https://wa.me/918605601801";
export const WHATSAPP_TRIAL =
  "https://wa.me/918605601801?text=Hello%20Jayesh%2C%20I%20want%20to%20start%20a%20free%20trial%20for%20LPG%20Agency%20ERP.";

export const HEADER_OFFSET = 84;

export function inr(value: number, withSymbol = true): string {
  const s = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
    Math.round(value),
  );
  return withSymbol ? `₹${s}` : s;
}

export function scrollToId(id: string) {
  if (typeof window === "undefined") return;
  const el = document.getElementById(id.replace("#", ""));
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
  window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
}

export const ACTS = [
  { id: "hero", label: "IGNITION" },
  { id: "ticker", label: "MODULES" },
  { id: "oldway", label: "THE OLD WAY" },
  { id: "assembly", label: "ASSEMBLY" },
  { id: "workbench", label: "WORKBENCH" },
  { id: "demo", label: "DEMO" },
  { id: "how", label: "PROCESS" },
  { id: "start", label: "IGNITE" },
] as const;

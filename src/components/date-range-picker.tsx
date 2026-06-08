import { useState, useRef, useEffect } from "react";
import { format, subDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek, subMonths } from "date-fns";
import { Calendar, ChevronDown, X } from "lucide-react";
import { DayPicker, DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import "react-day-picker/style.css";

export interface DateRangeValue {
  from: string; // YYYY-MM-DD
  to: string;   // YYYY-MM-DD
}

interface Props {
  value: DateRangeValue;
  onChange: (v: DateRangeValue) => void;
  className?: string;
}

const toISO = (d: Date) => format(d, "yyyy-MM-dd");
const today = () => new Date();

const PRESETS = [
  { label: "Today", get: () => ({ from: toISO(today()), to: toISO(today()) }) },
  { label: "This Week", get: () => ({ from: toISO(startOfWeek(today(), { weekStartsOn: 1 })), to: toISO(endOfWeek(today(), { weekStartsOn: 1 })) }) },
  { label: "This Month", get: () => ({ from: toISO(startOfMonth(today())), to: toISO(endOfMonth(today())) }) },
  { label: "Last Month", get: () => { const lm = subMonths(today(), 1); return { from: toISO(startOfMonth(lm)), to: toISO(endOfMonth(lm)) }; } },
  { label: "Last 30 Days", get: () => ({ from: toISO(subDays(today(), 29)), to: toISO(today()) }) },
  { label: "Last 3 Months", get: () => ({ from: toISO(subDays(today(), 89)), to: toISO(today()) }) },
];

function formatDisplay(from: string, to: string): string {
  if (!from && !to) return "Select date range";
  if (from === to) return format(new Date(from), "dd MMM yyyy");
  return `${format(new Date(from), "dd MMM")} – ${format(new Date(to), "dd MMM yyyy")}`;
}

export function DateRangePicker({ value, onChange, className }: Props) {
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState<DateRange | undefined>(
    value.from ? { from: new Date(value.from), to: new Date(value.to) } : undefined
  );
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const applyPreset = (preset: typeof PRESETS[0]) => {
    const v = preset.get();
    setRange({ from: new Date(v.from), to: new Date(v.to) });
    onChange(v);
    setOpen(false);
  };

  const applyRange = (r: DateRange | undefined) => {
    setRange(r);
    if (r?.from && r?.to) {
      onChange({ from: toISO(r.from), to: toISO(r.to) });
    }
  };

  return (
    <div className={cn("relative", className)} ref={ref}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 h-11 px-3 rounded-lg border border-input bg-background text-sm hover:bg-accent/50 transition-colors w-full text-left"
      >
        <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
        <span className={cn("flex-1 truncate", !value.from && "text-muted-foreground")}>
          {formatDisplay(value.from, value.to)}
        </span>
        {value.from && (
          <button
            type="button"
            onClick={e => { e.stopPropagation(); onChange({ from: "", to: "" }); setRange(undefined); }}
            className="p-0.5 rounded hover:bg-muted"
          >
            <X className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        )}
        <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform shrink-0", open && "rotate-180")} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 top-full mt-1 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-slide-in-from-top min-w-[320px]">
          {/* Preset pills */}
          <div className="px-3 pt-3 pb-2 flex flex-wrap gap-1.5 border-b border-border">
            {PRESETS.map(p => (
              <button
                key={p.label}
                type="button"
                onClick={() => applyPreset(p)}
                className="px-3 py-1 rounded-full text-xs font-semibold bg-muted hover:bg-primary hover:text-white transition-all"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Calendar */}
          <div className="p-2">
            <DayPicker
              mode="range"
              selected={range}
              onSelect={applyRange}
              numberOfMonths={1}
              captionLayout="dropdown"
              classNames={{
                root: "text-sm text-foreground",
                month_caption: "flex items-center justify-between px-1 pb-2",
                caption_label: "font-semibold text-sm",
                nav: "flex items-center gap-1",
                button_previous: "p-1 rounded hover:bg-muted",
                button_next: "p-1 rounded hover:bg-muted",
                month_grid: "w-full border-collapse",
                weekdays: "text-muted-foreground text-[10px] uppercase font-bold",
                weekday: "p-1 text-center",
                week: "",
                day: "p-0",
                day_button: cn(
                  "h-8 w-8 mx-auto rounded-lg text-sm transition-all hover:bg-primary hover:text-white",
                  "flex items-center justify-center"
                ),
                selected: "bg-primary text-white rounded-lg",
                today: "font-bold text-primary",
                range_start: "bg-primary text-white rounded-l-lg",
                range_end: "bg-primary text-white rounded-r-lg",
                range_middle: "bg-primary/15 text-foreground rounded-none",
                outside: "opacity-30",
                disabled: "opacity-20 cursor-not-allowed",
                hidden: "invisible",
              }}
            />
          </div>

          {range?.from && range?.to && (
            <div className="px-3 py-2.5 border-t border-border bg-muted/30 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {formatDisplay(toISO(range.from), toISO(range.to))}
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-3 py-1 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors"
              >
                Apply
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

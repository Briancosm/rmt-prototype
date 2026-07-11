import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DAY_PARTS,
  DAYS_OF_WEEK,
  EMPTY_FILTERS,
  type DatePreset,
  type EventStatusFilter,
  type ReportingFilters,
} from "./types";

interface FilterBarProps {
  filters: ReportingFilters;
  onChange: (next: ReportingFilters) => void;
  locations: string[];
  categories: string[];
  priceTiers: string[];
}

export function FilterBar({ filters, onChange, locations, categories, priceTiers }: FilterBarProps) {
  const set = <K extends keyof ReportingFilters>(key: K, value: ReportingFilters[K]) =>
    onChange({ ...filters, [key]: value });

  const activeCount = [
    filters.datePreset !== "all",
    filters.locations.length > 0,
    filters.categories.length > 0,
    filters.dayParts.length > 0,
    filters.daysOfWeek.length > 0,
    filters.priceTiers.length > 0,
    filters.eventStatus !== "all",
  ].filter(Boolean).length;

  return (
    <div className="flex flex-wrap items-center gap-2 px-4 py-2.5 sm:px-6">
      {/* Date range preset */}
      <DateRangeFilter
        preset={filters.datePreset}
        customFrom={filters.customDateFrom}
        customTo={filters.customDateTo}
        onPresetChange={(p) => set("datePreset", p)}
        onCustomFromChange={(v) => set("customDateFrom", v)}
        onCustomToChange={(v) => set("customDateTo", v)}
      />

      <Divider />

      {/* Location */}
      <MultiSelectPill
        label="Location"
        options={locations}
        selected={filters.locations}
        onChange={(v) => set("locations", v)}
      />

      <Divider />

      {/* Category */}
      <MultiSelectPill
        label="Category"
        options={categories}
        selected={filters.categories}
        onChange={(v) => set("categories", v)}
      />

      <Divider />

      {/* Day Part */}
      <MultiSelectPill
        label="Day Part"
        options={[...DAY_PARTS]}
        selected={filters.dayParts}
        onChange={(v) => set("dayParts", v)}
      />

      <Divider />

      {/* Day of Week */}
      <MultiSelectPill
        label="Day of Week"
        options={[...DAYS_OF_WEEK]}
        selected={filters.daysOfWeek}
        onChange={(v) => set("daysOfWeek", v)}
        abbrev={(d) => d.slice(0, 3)}
      />

      <Divider />

      {/* Price Tier */}
      <MultiSelectPill
        label="Price Tier"
        options={priceTiers}
        selected={filters.priceTiers}
        onChange={(v) => set("priceTiers", v)}
      />

      <Divider />

      {/* Event Status toggle */}
      <StatusToggle
        value={filters.eventStatus}
        onChange={(v) => set("eventStatus", v)}
      />

      {/* Clear all */}
      {activeCount > 0 && (
        <>
          <Divider />
          <button
            type="button"
            onClick={() => onChange({ ...EMPTY_FILTERS })}
            className="flex items-center gap-1 rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive hover:bg-destructive/20 transition-colors"
          >
            <X className="h-3 w-3" />
            Clear {activeCount}
          </button>
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function Divider() {
  return <span className="h-4 w-px shrink-0 bg-border/60" />;
}

// --- Date preset ---------------------------------------------------------

const DATE_PRESETS: { value: DatePreset; label: string }[] = [
  { value: "all", label: "All time" },
  { value: "last30", label: "Next/Last 30 days" },
  { value: "last90", label: "Next/Last 90 days" },
  { value: "this-season", label: "This season (±6 mo)" },
  { value: "custom", label: "Custom range" },
];

function DateRangeFilter({
  preset,
  customFrom,
  customTo,
  onPresetChange,
  onCustomFromChange,
  onCustomToChange,
}: {
  preset: DatePreset;
  customFrom: string;
  customTo: string;
  onPresetChange: (v: DatePreset) => void;
  onCustomFromChange: (v: string) => void;
  onCustomToChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs font-medium text-muted-foreground">Date Range</span>
      <select
        value={preset}
        onChange={(e) => onPresetChange(e.target.value as DatePreset)}
        className={cn(
          "h-7 rounded-md border bg-background px-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary",
          preset !== "all" ? "border-primary/50 text-primary font-medium" : "border-border/60",
        )}
        aria-label="Date range preset"
      >
        {DATE_PRESETS.map((p) => (
          <option key={p.value} value={p.value}>{p.label}</option>
        ))}
      </select>

      {preset === "custom" && (
        <>
          <input
            type="date"
            value={customFrom}
            onChange={(e) => onCustomFromChange(e.target.value)}
            className="h-7 rounded-md border border-border/60 bg-background px-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            aria-label="Custom date from"
          />
          <span className="text-xs text-muted-foreground">–</span>
          <input
            type="date"
            value={customTo}
            onChange={(e) => onCustomToChange(e.target.value)}
            className="h-7 rounded-md border border-border/60 bg-background px-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            aria-label="Custom date to"
          />
        </>
      )}
    </div>
  );
}

// --- Multi-select pill dropdown ------------------------------------------

function MultiSelectPill({
  label,
  options,
  selected,
  onChange,
  abbrev,
}: {
  label: string;
  options: string[];
  selected: string[];
  onChange: (next: string[]) => void;
  abbrev?: (opt: string) => string;
}) {
  const [open, setOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (ref.current?.contains(target) || menuRef.current?.contains(target)) return;
      setOpen(false);
    };
    // The menu is portaled with fixed positioning, so close it if the page
    // scrolls or resizes rather than letting it drift away from its trigger.
    const handleScroll = (e: Event) => {
      if (menuRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    const handleResize = () => setOpen(false);
    document.addEventListener("mousedown", handleOutside);
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleResize);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleResize);
    };
  }, [open]);

  const toggleOpen = () => {
    const rect = ref.current?.getBoundingClientRect();
    if (rect) {
      setMenuPosition({ x: rect.left, y: rect.bottom });
    }
    setOpen((v) => !v);
  };

  const toggle = (opt: string) => {
    onChange(selected.includes(opt) ? selected.filter((s) => s !== opt) : [...selected, opt]);
  };

  const displayLabel =
    selected.length === 0
      ? label
      : selected.length === 1
        ? (abbrev ? abbrev(selected[0]) : selected[0])
        : `${label} (${selected.length})`;

  const active = selected.length > 0;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={toggleOpen}
        className={cn(
          "flex h-7 items-center gap-1 rounded-md border px-2.5 text-xs font-medium transition-colors",
          active
            ? "border-primary/50 bg-primary/8 text-primary hover:bg-primary/12"
            : "border-border/60 bg-background text-foreground hover:bg-muted/40",
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Filter by ${label}`}
      >
        {displayLabel}
        {active && (
          <span
            role="button"
            tabIndex={0}
            className="ml-0.5 rounded-full hover:bg-primary/20"
            onClick={(e) => { e.stopPropagation(); onChange([]); }}
            onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); onChange([]); } }}
            aria-label={`Clear ${label} filter`}
          >
            <X className="h-3 w-3" />
          </span>
        )}
        {!active && <ChevronDown className={cn("h-3 w-3 transition-transform", open && "rotate-180")} />}
      </button>

      {open && menuPosition !== null && createPortal(
        <div
          ref={menuRef}
          className="fixed z-[130] min-w-[160px] rounded-lg border bg-card shadow-lg"
          style={{ left: menuPosition.x, top: menuPosition.y + 4 }}
          role="listbox"
          aria-multiselectable="true"
          aria-label={`${label} options`}
        >
          <div className="max-h-52 overflow-y-auto p-1">
            {options.map((opt) => {
              const checked = selected.includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  role="option"
                  aria-selected={checked}
                  onClick={() => toggle(opt)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm transition-colors",
                    checked
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-muted/50",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border",
                      checked ? "border-primary bg-primary" : "border-border",
                    )}
                  >
                    {checked && (
                      <svg viewBox="0 0 10 8" className="h-2.5 w-2.5 fill-none stroke-white stroke-[1.5]">
                        <polyline points="1 4 4 7 9 1" />
                      </svg>
                    )}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>
          {selected.length > 0 && (
            <div className="border-t px-2 py-1.5">
              <button
                type="button"
                onClick={() => onChange([])}
                className="text-xs text-muted-foreground hover:text-destructive"
              >
                Clear all
              </button>
            </div>
          )}
        </div>,
        document.body,
      )}
    </div>
  );
}

// --- Event status toggle --------------------------------------------------

const STATUS_OPTIONS: { value: EventStatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "past", label: "Past" },
];

function StatusToggle({
  value,
  onChange,
}: {
  value: EventStatusFilter;
  onChange: (v: EventStatusFilter) => void;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs font-medium text-muted-foreground">Status</span>
      <div className="flex rounded-md border border-border/60 overflow-hidden">
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "h-7 px-2.5 text-xs font-medium transition-colors border-r last:border-r-0 border-border/60",
              value === opt.value
                ? "bg-primary text-primary-foreground"
                : "bg-background text-foreground hover:bg-muted/40",
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

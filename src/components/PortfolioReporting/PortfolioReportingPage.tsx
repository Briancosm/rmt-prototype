import { useMemo, useRef, useState } from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { EMPTY_FILTERS, type ReportingFilters } from "./types";
import { FilterBar } from "./FilterBar";
import { KpiStrip } from "./KpiStrip";
import { TrendingTable } from "./TrendingTable";
import { MarketingSiteMetrics } from "./MarketingSiteMetrics";
import { DomeHallSummary } from "./DomeHallSummary";
import { useFilteredEvents, derivePortfolioKpis, type PortfolioEvent } from "./useFilteredEvents";
import { deriveRoas, deriveMarketingMetrics, deriveDomeHallSummary } from "./portfolioMocks";

interface PortfolioReportingPageProps {
  events: PortfolioEvent[];
  onViewEvent?: (eventId: string) => void;
}

const CITY_ABBREV: Record<string, string> = {
  "Los Angeles": "LA",
  "Cleveland": "CLE",
  "Atlanta": "ATL",
  "Dallas": "DAL",
  "Chicago": "CHI",
  "New York": "NYC",
  "Golden State": "GS",
};

function abbreviateCity(name: string): string {
  return CITY_ABBREV[name] ?? name;
}

function fmtUsd(v: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: v >= 1_000_000 ? "compact" : "standard",
    maximumFractionDigits: v >= 1_000_000 ? 1 : 0,
  }).format(v);
}

export function PortfolioReportingPage({ events, onViewEvent }: PortfolioReportingPageProps) {
  const [filters, setFilters] = useState<ReportingFilters>(EMPTY_FILTERS);
  const atRiskRef = useRef<HTMLTableSectionElement>(null);

  const locations = useMemo(() => Array.from(new Set(events.map((e) => e.venueName))).sort(), [events]);
  const categories = useMemo(() => Array.from(new Set(events.map((e) => e.eventCategory))).sort(), [events]);
  const priceTiers = useMemo(() => Array.from(new Set(events.map((e) => e.priceTier).filter(Boolean))).sort(), [events]);

  const filtered = useFilteredEvents(events, filters);
  const kpis = useMemo(() => derivePortfolioKpis(filtered), [filtered]);
  const roasRows = useMemo(() => deriveRoas(filtered), [filtered]);
  const marketingMetrics = useMemo(() => deriveMarketingMetrics(filtered), [filtered]);
  const domeHallModel = useMemo(() => deriveDomeHallSummary(filtered), [filtered]);

  const handleAtRiskClick = () =>
    atRiskRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="space-y-5">
      {/* Filter bar */}
      <section className="overflow-hidden rounded-xl border bg-card/95 shadow-sm backdrop-blur">
        <div className="border-b px-4 py-2 sm:px-6">
          <p className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">Filters</p>
        </div>
        <FilterBar
          filters={filters}
          onChange={setFilters}
          locations={locations}
          categories={categories}
          priceTiers={priceTiers}
        />
      </section>

      {/* KPI strip — 6 cards */}
      <KpiStrip kpis={kpis} onAtRiskClick={handleAtRiskClick} />

      {/* Trending table */}
      <TrendingTable events={filtered} roasRows={roasRows} />

      {/* Marketing + Dome/Hall — 2 col on wide screens */}
      <div className="grid gap-5 xl:grid-cols-2">
        <MarketingSiteMetrics metrics={marketingMetrics} />
        <DomeHallSummary model={domeHallModel} />
      </div>

      {/* Event table */}
      <section className="overflow-hidden rounded-xl border bg-card/95 shadow-sm backdrop-blur">
        <div className="flex items-center justify-between border-b px-4 py-3 sm:px-6">
          <p className="text-sm font-semibold text-foreground">
            All Events
            <span className="ml-1 font-normal text-muted-foreground">({filtered.length})</span>
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <p className="text-sm text-muted-foreground">No events match the selected filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] border-collapse text-sm">
              <thead>
                <tr className="border-b bg-muted/30 text-left text-xs uppercase tracking-[0.06em] text-muted-foreground">
                  <th className="px-4 py-2.5 font-medium sm:px-6">Event</th>
                  <th className="px-3 py-2.5 font-medium">Location</th>
                  <th className="px-3 py-2.5 font-medium">Category</th>
                  <th className="px-3 py-2.5 text-right font-medium">Health</th>
                  <th className="px-3 py-2.5 text-right font-medium">%</th>
                  <th className="px-3 py-2.5 text-right font-medium">Days left</th>
                  <th className="px-3 py-2.5 text-right font-medium">Revenue</th>
                  <th className="px-3 py-2.5 font-medium">Status</th>
                  <th className="px-3 py-2.5 font-medium sm:pr-6" />
                </tr>
              </thead>
              <tbody ref={atRiskRef}>
                {filtered.map((ev) => (
                  <EventRow key={ev.id} event={ev} onView={onViewEvent} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Event row
// ---------------------------------------------------------------------------

function EventRow({ event, onView }: { event: PortfolioEvent; onView?: (id: string) => void }) {
  const health = event.eventHealth ?? 0;
  const healthColor =
    health >= 80 ? "text-success" : health >= 60 ? "text-primary" : health >= 40 ? "text-warning" : "text-destructive";
  const sold = event.soldPct ?? 0;
  const soldColor = sold >= 75 ? "text-success" : sold >= 50 ? "text-warning" : "text-destructive";

  return (
    <tr className="group border-b last:border-0 hover:bg-muted/20 transition-colors">
      <td className="px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          {event.attention
            ? <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-warning" aria-label="Needs attention" />
            : health >= 75
              ? <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-success/60" aria-label="On track" />
              : null}
          <span className="font-medium text-foreground">{event.event}</span>
        </div>
      </td>
      <td className="px-3 py-3 text-muted-foreground">{abbreviateCity(event.venueName)}</td>
      <td className="px-3 py-3"><CategoryBadge category={event.eventCategory} /></td>
      <td className={cn("px-3 py-3 text-right tabular-nums font-semibold", healthColor)}>{health}</td>
      <td className={cn("px-3 py-3 text-right tabular-nums", soldColor)}>{sold}%</td>
      <td className="px-3 py-3 text-right tabular-nums text-muted-foreground">{event.daysRemaining ?? "—"}</td>
      <td className="px-3 py-3 text-right tabular-nums text-foreground">{fmtUsd(event.netTicketRevenue ?? 0)}</td>
      <td className="px-3 py-3">
        <span className={cn("inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
          event.status === "On Sale"
            ? "bg-success/10 text-success"
            : event.status === "Completed"
              ? "bg-muted text-muted-foreground"
              : event.status === "Upcoming"
                ? "bg-primary/10 text-primary"
                : "bg-secondary text-muted-foreground")}>
          {event.status}
        </span>
      </td>
      <td className="px-3 py-3 sm:pr-6">
        {onView && (
          <button
            type="button"
            onClick={() => onView(event.id)}
            className="rounded-md px-2.5 py-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100 hover:bg-primary/10"
          >
            View →
          </button>
        )}
      </td>
    </tr>
  );
}

const CATEGORY_COLORS: Record<string, string> = {
  Sports: "bg-primary/10 text-primary",
  Film: "bg-warning/10 text-warning",
  "Film + Live Score": "bg-warning/10 text-warning",
  Concert: "bg-success/10 text-success",
  Entertainment: "bg-success/10 text-success",
  Theater: "bg-destructive/10 text-destructive",
  Family: "bg-muted text-muted-foreground",
};

function CategoryBadge({ category }: { category: string }) {
  return (
    <span className={cn("inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
      CATEGORY_COLORS[category] ?? "bg-secondary text-muted-foreground")}>
      {category}
    </span>
  );
}

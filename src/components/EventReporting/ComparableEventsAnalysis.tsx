import { useMemo, useState } from "react";
import { Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  formatUsd,
  generateComparableEvents,
  generateHistoricalPool,
  type ComparableEvent,
  type ReportingEventInput,
} from "@/mocks/eventReportingData";

interface ComparableEventsAnalysisProps {
  event: ReportingEventInput;
}

export function ComparableEventsAnalysis({ event }: ComparableEventsAnalysisProps) {
  const [showAll, setShowAll] = useState(false);

  const topComps = useMemo(() => generateComparableEvents(event, 5), [event]);
  const allComps = useMemo(
    () =>
      generateHistoricalPool(event)
        .filter((c) => c.matchesCategory || c.matchesVenue)
        .sort((a, b) => b.similarity - a.similarity),
    [event],
  );

  const rows = showAll ? allComps : topComps;
  const bestId = topComps[0]?.id;

  return (
    <section
      className="rounded-lg border bg-background p-4 sm:p-5"
      aria-label="Comparable events analysis"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-heading text-lg font-semibold text-foreground">Comparable Events</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Past {event.eventCategory} events at {event.venueName} and similar venues, matched on
            category, venue and day-of-week.
          </p>
        </div>
        <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground">
          {rows.length} comps
        </span>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="border-b bg-muted/30 text-left text-xs font-medium text-muted-foreground">
              <th className="px-3 py-2.5 font-medium">Event</th>
              <th className="px-3 py-2.5 font-medium">Date</th>
              <th className="px-3 py-2.5 font-medium">Price range</th>
              <th className="px-3 py-2.5 text-right font-medium">
                % sold @ day {event.daysInMarket ?? 0}
              </th>
              <th className="px-3 py-2.5 text-right font-medium">Final yield</th>
              <th className="px-3 py-2.5 text-right font-medium">Match</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((comp) => (
              <CompRow key={comp.id} comp={comp} isBest={comp.id === bestId} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          <Star className="mr-1 inline h-3.5 w-3.5 fill-warning text-warning" />
          Most similar comparable is highlighted.
        </p>
        {allComps.length > topComps.length && (
          <Button variant="ghost" size="sm" onClick={() => setShowAll((v) => !v)}>
            {showAll ? "Show top 5" : `View all comps (${allComps.length})`}
          </Button>
        )}
      </div>
    </section>
  );
}

function CompRow({ comp, isBest }: { comp: ComparableEvent; isBest: boolean }) {
  return (
    <tr className={cn("border-b last:border-0 hover:bg-muted/20 transition-colors", isBest && "bg-warning/5")}>
      <td className="px-3 py-3">
        <div className="flex items-center gap-1.5">
          {isBest && <Star className="h-3.5 w-3.5 shrink-0 fill-warning text-warning" />}
          <div>
            <p className="font-medium text-foreground">{comp.name}</p>
            <p className="text-xs text-muted-foreground">
              {comp.venue} · {comp.weekday}
            </p>
          </div>
        </div>
      </td>
      <td className="px-3 py-3 text-muted-foreground">{comp.dateLabel}</td>
      <td className="px-3 py-3 tabular-nums text-foreground">
        {formatUsd(comp.priceMax)} – {formatUsd(comp.priceMin)}
      </td>
      <td className="px-3 py-3 text-right tabular-nums text-foreground">
        {comp.pctSoldAtDayInMarket}%
      </td>
      <td className="px-3 py-3 text-right tabular-nums font-medium text-foreground">
        {comp.finalYield}%
      </td>
      <td className="px-3 py-3 text-right">
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold",
            comp.similarity >= 70
              ? "bg-success/10 text-success"
              : comp.similarity >= 45
                ? "bg-primary/10 text-primary"
                : "bg-secondary text-muted-foreground",
          )}
        >
          {comp.similarity}%
        </span>
      </td>
    </tr>
  );
}

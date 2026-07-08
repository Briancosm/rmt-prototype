import { useMemo } from "react";
import { Lightbulb } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  formatUsd,
  generatePricePerformance,
  type ReportingEventInput,
  type SeatGroupComparison,
} from "@/mocks/eventReportingData";

interface PricePerformanceComparisonProps {
  event: ReportingEventInput;
}

export function PricePerformanceComparison({ event }: PricePerformanceComparisonProps) {
  const model = useMemo(() => generatePricePerformance(event), [event]);

  return (
    <section
      className="rounded-lg border bg-background p-4 sm:p-5"
      aria-label="Price performance versus comparable events"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-heading text-lg font-semibold text-foreground">
            Price Performance vs Comps
          </h3>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Your price by seat group vs. the average across {model.compCount} comparable events.
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {model.rows.map((row) => (
          <PriceBar key={row.id} row={row} />
        ))}
      </div>

      {/* Insight card */}
      <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-3">
        <div className="flex gap-2.5">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <div>
            <p className="text-sm font-medium text-foreground">{model.insight}</p>
            <p className="mt-1 text-sm text-muted-foreground">{model.suggestion}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function PriceBar({ row }: { row: SeatGroupComparison }) {
  const maxPrice = Math.max(row.yourPrice, row.compAvgPrice, 1);
  const yourW = (row.yourPrice / maxPrice) * 100;
  const compW = (row.compAvgPrice / maxPrice) * 100;
  const priceHigher = row.priceDeltaPct > 0;
  const sellLower = row.sellThroughDeltaPct < 0;

  return (
    <div className="rounded-lg border bg-secondary/15 p-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">{row.name}</p>
        <div className="flex items-center gap-2 text-xs">
          <span
            className={cn(
              "rounded-full px-2 py-0.5 font-semibold",
              priceHigher ? "bg-warning/10 text-warning" : "bg-success/10 text-success",
            )}
          >
            {priceHigher ? "+" : ""}
            {row.priceDeltaPct}% price
          </span>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 font-semibold",
              sellLower ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success",
            )}
          >
            {row.sellThroughDeltaPct > 0 ? "+" : ""}
            {row.sellThroughDeltaPct}% sold
          </span>
        </div>
      </div>

      {/* Price bars */}
      <div className="mt-2.5 space-y-1.5">
        <BarLine
          label="You"
          widthPct={yourW}
          color="bg-primary"
          value={`${formatUsd(row.yourPrice)} · ${row.yourSellThrough}% sold`}
        />
        <BarLine
          label="Comps"
          widthPct={compW}
          color="bg-muted-foreground/40"
          value={`${formatUsd(row.compAvgPrice)} · ${row.compAvgSellThrough}% sold`}
        />
      </div>
    </div>
  );
}

function BarLine({
  label,
  widthPct,
  color,
  value,
}: {
  label: string;
  widthPct: number;
  color: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-12 shrink-0 text-[11px] font-medium text-muted-foreground">
        {label}
      </span>
      <div className="h-4 flex-1 overflow-hidden rounded bg-secondary">
        <div className={cn("h-full rounded", color)} style={{ width: `${widthPct}%` }} />
      </div>
      <span className="w-40 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
        {value}
      </span>
    </div>
  );
}

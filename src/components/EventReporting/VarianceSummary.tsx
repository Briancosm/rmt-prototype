import { TrendingDown, TrendingUp } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  deriveKpis,
  formatSignedPct,
  formatSignedUsd,
  formatUsd,
  generateVarianceHistory,
  type ReportingEventInput,
} from "@/mocks/eventReportingData";
import { sparklinePath } from "./charts";

interface VarianceSummaryProps {
  event: ReportingEventInput;
}

export function VarianceSummary({ event }: VarianceSummaryProps) {
  const kpis = deriveKpis(event);
  const history = generateVarianceHistory(event);
  const negative = kpis.variance < 0;

  // Sparkline tracks daily variance (actual - expected) over the window.
  const varianceSeries = history.map((p) => p.actual - p.expected);
  const sparkW = 220;
  const sparkH = 48;
  const path = sparklinePath(varianceSeries, sparkW, sparkH);

  return (
    <section
      className="rounded-lg border bg-background p-4 sm:p-5"
      aria-label="Revenue variance summary"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-lg font-semibold text-foreground">Variance Summary</h3>
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
            negative ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success",
          )}
        >
          {negative ? <TrendingDown className="h-3.5 w-3.5" /> : <TrendingUp className="h-3.5 w-3.5" />}
          {formatSignedPct(kpis.variancePercent)}
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border bg-secondary/20 p-3">
          <p className="text-[11px] font-medium text-muted-foreground">
            Actual Revenue
          </p>
          <p className="mt-1 font-heading text-base font-semibold tabular-nums text-foreground">
            {formatUsd(kpis.currentRevenue)}
          </p>
        </div>
        <div className="rounded-lg border bg-secondary/20 p-3">
          <p className="text-[11px] font-medium text-muted-foreground">
            Expected Revenue
          </p>
          <p className="mt-1 font-heading text-base font-semibold tabular-nums text-muted-foreground">
            {formatUsd(kpis.expectedRevenue)}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-end justify-between gap-3 rounded-lg border bg-background p-3">
        <div>
          <p className="text-[11px] font-medium text-muted-foreground">
            Variance to date
          </p>
          <p
            className={cn(
              "mt-1 font-heading text-xl font-semibold tabular-nums",
              negative ? "text-destructive" : "text-success",
            )}
          >
            {formatSignedUsd(kpis.variance)}
          </p>
        </div>
        <svg
          width={sparkW}
          height={sparkH}
          viewBox={`0 0 ${sparkW} ${sparkH}`}
          className="overflow-visible"
          role="img"
          aria-label={`Variance trend over the last ${history.length} days`}
        >
          <path
            d={path}
            fill="none"
            stroke={negative ? "hsl(var(--destructive))" : "hsl(var(--success))"}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </section>
  );
}

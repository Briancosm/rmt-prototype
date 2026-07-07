import { useMemo } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  formatUsd,
  generateFunnelData,
  type FunnelStage,
  type FunnelStageId,
  type ReportingEventInput,
} from "@/mocks/eventReportingData";
import { sparklinePath } from "./charts";

interface EventFunnelBreakdownProps {
  event: ReportingEventInput;
}

const STAGE_COLOR: Record<FunnelStageId, string> = {
  presale: "bg-primary",
  main: "bg-success",
  final: "bg-warning",
};

const STAGE_STROKE: Record<FunnelStageId, string> = {
  presale: "hsl(var(--primary))",
  main: "hsl(var(--success))",
  final: "hsl(var(--warning))",
};

export function EventFunnelBreakdown({ event }: EventFunnelBreakdownProps) {
  const model = useMemo(() => generateFunnelData(event), [event]);

  return (
    <section className="rounded-xl border bg-background p-4 sm:p-5" aria-label="Event funnel breakdown">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-heading text-lg font-semibold text-foreground">Funnel Breakdown</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Presale → Main Sale → Final Push · {model.totalTickets.toLocaleString()} tickets sold
          </p>
        </div>
      </div>

      {/* Stacked bar */}
      <div
        className="mt-4 flex h-7 w-full overflow-hidden rounded-lg"
        role="img"
        aria-label="Share of sales by funnel stage"
      >
        {model.stages.map((stage) => (
          <div
            key={stage.id}
            className={cn("h-full", STAGE_COLOR[stage.id])}
            style={{ width: `${stage.pctOfTotal}%` }}
            title={`${stage.label}: ${stage.pctOfTotal}%`}
          />
        ))}
      </div>

      {/* Per-stage detail */}
      <div className="mt-4 space-y-2.5">
        {model.stages.map((stage) => (
          <StageRow key={stage.id} stage={stage} />
        ))}
      </div>
    </section>
  );
}

function StageRow({ stage }: { stage: FunnelStage }) {
  const up = stage.trendDeltaPct >= 0;
  const sparkW = 80;
  const sparkH = 26;

  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-lg border bg-secondary/15 p-3">
      <div className="flex items-center gap-2">
        <span className={cn("h-3 w-3 rounded-sm", STAGE_COLOR[stage.id])} />
        <div>
          <p className="text-sm font-medium text-foreground">{stage.label}</p>
          <p className="text-xs text-muted-foreground">
            {stage.tickets.toLocaleString()} tix · {stage.pctOfTotal}% of total
          </p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 text-right text-xs sm:gap-6">
        <Stat label="Avg price" value={formatUsd(stage.avgPrice)} />
        <Stat label="Conversion" value={`${stage.conversionRate}%`} />
      </div>

      <div className="flex items-center gap-2">
        <svg width={sparkW} height={sparkH} viewBox={`0 0 ${sparkW} ${sparkH}`} aria-hidden="true">
          <path
            d={sparklinePath(stage.trend, sparkW, sparkH)}
            fill="none"
            stroke={STAGE_STROKE[stage.id]}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span
          className={cn(
            "inline-flex items-center gap-0.5 text-xs font-semibold",
            up ? "text-success" : "text-destructive",
          )}
        >
          {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {stage.trendDeltaPct > 0 ? "+" : ""}
          {stage.trendDeltaPct}%
        </span>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.06em] text-muted-foreground">{label}</p>
      <p className="font-semibold tabular-nums text-foreground">{value}</p>
    </div>
  );
}

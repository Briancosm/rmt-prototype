import { ArrowUpRight, BarChart3, GaugeCircle, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  deriveKpis,
  formatSignedUsd,
  formatUsd,
  RISK_FLAG_LABEL,
  type ReportingEventInput,
  type RiskFlag,
} from "@/mocks/eventReportingData";

const RISK_STYLES: Record<RiskFlag, string> = {
  critical: "bg-destructive/10 text-destructive border-destructive/30",
  warning: "bg-warning/10 text-warning border-warning/30",
  monitor: "bg-primary/10 text-primary border-primary/30",
  "on-track": "bg-success/10 text-success border-success/30",
};

interface EventHeaderProps {
  event: ReportingEventInput;
  onAdjustPricing?: () => void;
  onViewComparables?: () => void;
  onRunScenario?: () => void;
}

export function EventHeader({
  event,
  onAdjustPricing,
  onViewComparables,
  onRunScenario,
}: EventHeaderProps) {
  const kpis = deriveKpis(event);
  const windowProgress =
    kpis.salesWindowDays > 0
      ? Math.min(100, Math.round((kpis.daysInMarket / kpis.salesWindowDays) * 100))
      : 0;

  const varianceNegative = kpis.variance < 0;

  return (
    <section
      className="rounded-2xl border bg-card p-5 shadow-[0_18px_50px_-40px_rgba(15,23,42,0.55)] sm:p-6"
      aria-label="Event reporting overview"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            {event.eventCategory} · {event.venueName}
          </p>
          <h2 className="mt-1 font-heading text-2xl font-semibold tracking-tight text-foreground">
            {event.event}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {event.weekdayLabel} · {event.startTimeLabel} · {kpis.daysRemaining} days remaining
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={onAdjustPricing} className="gap-1.5">
            <GaugeCircle className="h-4 w-4" />
            Adjust Pricing
          </Button>
          <Button size="sm" variant="outline" onClick={onViewComparables} className="gap-1.5">
            <BarChart3 className="h-4 w-4" />
            View Comparable Events
          </Button>
          <Button size="sm" variant="outline" onClick={onRunScenario} className="gap-1.5">
            <Sparkles className="h-4 w-4" />
            Run Scenario
          </Button>
        </div>
      </div>

      {/* Sales-window progress */}
      <div className="mt-5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Sales window progress</span>
          <span>
            Day {kpis.daysInMarket} of {kpis.salesWindowDays} ({windowProgress}%)
          </span>
        </div>
        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${windowProgress}%` }}
            role="progressbar"
            aria-valuenow={windowProgress}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>

      {/* KPI grid */}
      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiTile
          label="Health Score"
          value={`${kpis.healthScore}`}
          sub="out of 100"
          accent={
            kpis.healthScore >= 80
              ? "text-success"
              : kpis.healthScore >= 60
                ? "text-primary"
                : kpis.healthScore >= 40
                  ? "text-warning"
                  : "text-destructive"
          }
        />
        <div className="rounded-xl border bg-background p-3">
          <p className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">Risk Flag</p>
          <span
            className={cn(
              "mt-2 inline-flex items-center rounded-full border px-2.5 py-1 text-sm font-semibold",
              RISK_STYLES[kpis.riskFlag],
            )}
          >
            {RISK_FLAG_LABEL[kpis.riskFlag]}
          </span>
          <p className="mt-1 text-xs text-muted-foreground">
            {kpis.percentSold}% sold · {kpis.inventoryRemaining.toLocaleString()} left
          </p>
        </div>
        <KpiTile
          label="Revenue vs Expected"
          value={formatUsd(kpis.currentRevenue, { compact: true })}
          sub={`${formatSignedUsd(kpis.variance, { compact: true })} vs ${formatUsd(
            kpis.expectedRevenue,
            { compact: true },
          )}`}
          accent={varianceNegative ? "text-destructive" : "text-success"}
        />
        <KpiTile
          label="Pricing Opportunity"
          value={formatUsd(kpis.pricingOpportunity, { compact: true })}
          sub="upside vs current plan"
          accent="text-primary"
          icon={<ArrowUpRight className="h-4 w-4 text-primary" />}
        />
      </div>
    </section>
  );
}

function KpiTile({
  label,
  value,
  sub,
  accent,
  icon,
}: {
  label: string;
  value: string;
  sub: string;
  accent: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-background p-3">
      <div className="flex items-center justify-between">
        <p className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">{label}</p>
        {icon}
      </div>
      <p className={cn("mt-1 font-heading text-2xl font-semibold tabular-nums", accent)}>{value}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>
    </div>
  );
}

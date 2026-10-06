import { AlertTriangle, ArrowDown, ArrowUp, CheckCircle2, Minus } from "lucide-react";

import { cn } from "@/lib/utils";
import type { PortfolioKpis } from "./useFilteredEvents";

interface KpiStripProps {
  kpis: PortfolioKpis;
}

function fmtUsd(v: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: Math.abs(v) >= 1_000_000 ? "compact" : "standard",
    maximumFractionDigits: Math.abs(v) >= 1_000_000 ? 1 : 0,
  }).format(v);
}

function fmtSignedUsd(v: number) {
  const sign = v > 0 ? "+" : "";
  return `${sign}${fmtUsd(v)}`;
}

export function KpiStrip({ kpis }: KpiStripProps) {
  const varNeg = kpis.totalVariance < 0;
  const varPos = kpis.totalVariance > 0;
  const soldDelta = kpis.avgSoldPct - kpis.avgExpectedSoldPct;

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
      {/* 1. Total Revenue */}
      <KpiCard
        label="Total Revenue"
        value={fmtUsd(kpis.totalRevenue)}
        sub={
          <span className={cn("font-medium", varNeg ? "text-destructive" : varPos ? "text-success" : "text-muted-foreground")}>
            {fmtSignedUsd(kpis.totalVariance)} vs expected
          </span>
        }
        accent="text-foreground"
      />

      {/* 2. Revenue Variance */}
      <KpiCard
        label="Revenue Variance"
        value={fmtSignedUsd(kpis.totalVariance)}
        accent={varNeg ? "text-destructive" : varPos ? "text-success" : "text-muted-foreground"}
        icon={
          varNeg ? <ArrowDown className="h-4 w-4 text-destructive" /> :
          varPos ? <ArrowUp className="h-4 w-4 text-success" /> :
          <Minus className="h-4 w-4 text-muted-foreground" />
        }
        sub={
          <span className={cn("font-medium", varNeg ? "text-destructive" : varPos ? "text-success" : "text-muted-foreground")}>
            {kpis.variancePct > 0 ? "+" : ""}{kpis.variancePct}% vs expected
          </span>
        }
      />

      {/* 3. Avg Sell-Through */}
      <KpiCard
        label="Avg Sell-Through"
        value={`${kpis.avgSoldPct}%`}
        accent={kpis.avgSoldPct >= 75 ? "text-success" : kpis.avgSoldPct >= 55 ? "text-warning" : "text-destructive"}
        sub={
          <span className={cn("font-medium", soldDelta < 0 ? "text-destructive" : soldDelta > 0 ? "text-success" : "text-muted-foreground")}>
            {soldDelta > 0 ? "+" : ""}{soldDelta}% vs expected {kpis.avgExpectedSoldPct}%
          </span>
        }
      />

      {/* 4. Events On Track */}
      <KpiCard
        label="Events On Track"
        value={String(kpis.eventsOnTrack)}
        accent="text-success"
        icon={<CheckCircle2 className="h-4 w-4 text-success" />}
        sub={
          <span className="text-muted-foreground">
            {kpis.eventsOnTrack} of {kpis.totalEvents} events (±5% expected)
          </span>
        }
      />

      {/* 5. Events At Risk */}
      <KpiCard
        label="Events At Risk"
        value={String(kpis.eventsAtRisk)}
        accent={kpis.eventsAtRisk > 0 ? "text-warning" : "text-success"}
        icon={<AlertTriangle className="h-4 w-4 text-warning" />}
        sub={
          <span className="text-muted-foreground">
            {kpis.eventsAtRisk > 0 ? ">10% below expected" : "No events at risk"}
          </span>
        }
      />
    </div>
  );
}

function KpiCard({
  label,
  value,
  sub,
  accent,
  icon,
}: {
  label: string;
  value: string;
  sub: React.ReactNode;
  accent: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
        {icon}
      </div>
      <p className={cn("mt-1 font-heading text-base font-semibold tabular-nums", accent)}>{value}</p>
      <p className="mt-0.5 text-xs">{sub}</p>
    </div>
  );
}

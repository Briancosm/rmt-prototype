import { useRef } from "react";
import { AlertTriangle, ArrowDown, ArrowUp, CheckCircle2, Minus, TrendingUp } from "lucide-react";

import { cn } from "@/lib/utils";
import type { PortfolioKpis } from "./useFilteredEvents";

interface KpiStripProps {
  kpis: PortfolioKpis;
  onAtRiskClick?: () => void;
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

export function KpiStrip({ kpis, onAtRiskClick }: KpiStripProps) {
  const varNeg = kpis.totalVariance < 0;
  const varPos = kpis.totalVariance > 0;
  const soldDelta = kpis.avgSoldPct - kpis.avgExpectedSoldPct;

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
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
      <button
        type="button"
        onClick={onAtRiskClick}
        className="rounded-xl border bg-card p-4 shadow-sm text-left transition-colors hover:bg-muted/20 focus:outline-none focus:ring-2 focus:ring-primary/40"
        aria-label="View at-risk events"
      >
        <div className="flex items-center justify-between">
          <p className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">Events At Risk</p>
          <AlertTriangle className="h-4 w-4 text-warning" />
        </div>
        <p className={cn("mt-1 font-heading text-2xl font-semibold tabular-nums", kpis.eventsAtRisk > 0 ? "text-warning" : "text-success")}>
          {kpis.eventsAtRisk}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {kpis.eventsAtRisk > 0 ? ">10% below expected · click to view" : "No events at risk"}
        </p>
      </button>

      {/* 6. Pricing Opportunity */}
      <KpiCard
        label="Pricing Opportunity"
        value={fmtUsd(kpis.pricingOpportunity)}
        accent="text-primary"
        icon={<TrendingUp className="h-4 w-4 text-primary" />}
        sub={
          <span className="text-muted-foreground">
            across {kpis.pricingOpportunityEventCount} event{kpis.pricingOpportunityEventCount !== 1 ? "s" : ""}
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
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">{label}</p>
        {icon}
      </div>
      <p className={cn("mt-1 font-heading text-2xl font-semibold tabular-nums", accent)}>{value}</p>
      <p className="mt-0.5 text-xs">{sub}</p>
    </div>
  );
}

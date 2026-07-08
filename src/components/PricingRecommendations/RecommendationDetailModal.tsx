import { Sparkles, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  confidenceTierLabels,
  type SeatGroupRecommendation,
} from "@/lib/recommendationEngine";
import { ConfidenceBadge } from "./ConfidenceBadge";

function formatMoney(value: number): string {
  const rounded = Math.round(value);
  const abs = Math.abs(rounded).toLocaleString("en-US");
  return `${rounded < 0 ? "-" : ""}$${abs}`;
}

function formatSignedMoney(value: number): string {
  return `${Math.round(value) >= 0 ? "+" : ""}${formatMoney(value)}`;
}

function formatPrice(value: number): string {
  return `$${value.toLocaleString("en-US", {
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

const tierMeterStyles: Record<SeatGroupRecommendation["confidenceTier"], string> = {
  high: "bg-success",
  medium: "bg-warning",
  low: "bg-destructive",
};

function DemandCurveChart({ rec }: { rec: SeatGroupRecommendation }) {
  const width = 560;
  const height = 190;
  const left = 46;
  const right = 14;
  const top = 14;
  const bottom = 34;

  const prices = rec.demandCurve.map((point) => point.price);
  const revenues = rec.demandCurve.map((point) => point.expectedRevenue);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const maxRevenue = Math.max(...revenues, 1);

  const xFor = (price: number) =>
    left + ((price - minPrice) / (maxPrice - minPrice)) * (width - left - right);
  const yFor = (revenue: number) =>
    top + (1 - revenue / maxRevenue) * (height - top - bottom);

  const revenueAt = (price: number) => {
    const clamped = Math.min(maxPrice, Math.max(minPrice, price));
    for (let i = 1; i < rec.demandCurve.length; i += 1) {
      const prev = rec.demandCurve[i - 1];
      const next = rec.demandCurve[i];
      if (clamped <= next.price) {
        const t = (clamped - prev.price) / (next.price - prev.price || 1);
        return prev.expectedRevenue + t * (next.expectedRevenue - prev.expectedRevenue);
      }
    }
    return rec.demandCurve[rec.demandCurve.length - 1].expectedRevenue;
  };

  const linePath = rec.demandCurve
    .map((point, index) => `${index === 0 ? "M" : "L"} ${xFor(point.price)} ${yFor(point.expectedRevenue)}`)
    .join(" ");
  const areaPath = `${linePath} L ${xFor(maxPrice)} ${height - bottom} L ${xFor(minPrice)} ${height - bottom} Z`;

  const markers = [
    {
      id: "current",
      price: rec.currentPrice,
      label: `Current ${formatPrice(rec.currentPrice)}`,
      color: "hsl(var(--primary))",
    },
    {
      id: "recommended",
      price: rec.recommendedPrice,
      label: `Rec. ${formatPrice(rec.recommendedPrice)}`,
      color: "hsl(var(--success))",
    },
  ];

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-[190px] w-full"
      role="img"
      aria-label="Modeled revenue by price with current and recommended price markers"
    >
      {/* Guardrail bounds — pricing outside this band is out of policy. */}
      {rec.priceFloor > minPrice && (
        <rect
          x={left}
          y={top}
          width={Math.max(0, xFor(rec.priceFloor) - left)}
          height={height - top - bottom}
          fill="hsl(var(--muted))"
          opacity={0.55}
        />
      )}
      {rec.priceCeiling < maxPrice && (
        <rect
          x={xFor(rec.priceCeiling)}
          y={top}
          width={Math.max(0, width - right - xFor(rec.priceCeiling))}
          height={height - top - bottom}
          fill="hsl(var(--muted))"
          opacity={0.55}
        />
      )}

      <path d={areaPath} fill="hsl(var(--primary))" opacity={0.08} />
      <path d={linePath} fill="none" stroke="hsl(var(--primary))" strokeWidth={2.5} />

      <line
        x1={left}
        y1={height - bottom}
        x2={width - right}
        y2={height - bottom}
        stroke="hsl(var(--border))"
        strokeWidth={1}
      />
      <text x={left} y={height - 10} fontSize={11} fill="hsl(var(--muted-foreground))">
        {formatPrice(minPrice)}
      </text>
      <text
        x={width - right}
        y={height - 10}
        fontSize={11}
        textAnchor="end"
        fill="hsl(var(--muted-foreground))"
      >
        {formatPrice(maxPrice)}
      </text>
      <text
        x={12}
        y={top + 8}
        fontSize={10}
        fill="hsl(var(--muted-foreground))"
      >
        Rev.
      </text>

      {markers.map((marker, index) => {
        const x = xFor(marker.price);
        const y = yFor(revenueAt(marker.price));
        const nearRightEdge = x > width - 110;
        return (
          <g key={marker.id}>
            <line
              x1={x}
              y1={y}
              x2={x}
              y2={height - bottom}
              stroke={marker.color}
              strokeWidth={1.2}
              strokeDasharray="3 3"
            />
            <circle cx={x} cy={y} r={4.2} fill={marker.color} />
            <text
              x={nearRightEdge ? x - 6 : x + 6}
              y={y - 8 - index * 2}
              fontSize={11}
              fontWeight={600}
              textAnchor={nearRightEdge ? "end" : "start"}
              fill={marker.color}
            >
              {marker.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function DriverAttribution({ rec }: { rec: SeatGroupRecommendation }) {
  const maxContribution = Math.max(
    ...rec.drivers.map((driver) => Math.abs(driver.contributionPct)),
    1,
  );

  return (
    <div className="space-y-2.5">
      {rec.drivers.map((driver) => {
        const isPositive = driver.contributionPct >= 0;
        return (
          <div key={driver.id}>
            <div className="flex items-baseline justify-between gap-2">
              <p className="text-sm font-medium text-foreground">{driver.label}</p>
              <span
                className={cn(
                  "text-xs font-semibold tabular-nums",
                  isPositive ? "text-primary" : "text-destructive",
                )}
              >
                {isPositive ? "+" : ""}
                {driver.contributionPct}%
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{driver.detail}</p>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-secondary/60">
              <div
                className={cn(
                  "h-full rounded-full",
                  isPositive ? "bg-primary" : "bg-destructive/70",
                )}
                style={{
                  width: `${(Math.abs(driver.contributionPct) / maxContribution) * 100}%`,
                }}
              />
            </div>
          </div>
        );
      })}
      <p className="pt-1 text-[11px] text-muted-foreground">
        Signed contributions to the recommended price move. Negative factors pull
        the recommendation in the opposite direction.
      </p>
    </div>
  );
}

export function RecommendationDetailModal({
  open,
  eventName,
  seatGroupName,
  recommendation,
  alreadyApplied,
  onClose,
  onApply,
}: {
  open: boolean;
  eventName: string;
  seatGroupName: string;
  recommendation: SeatGroupRecommendation | null;
  alreadyApplied: boolean;
  onClose: () => void;
  onApply: () => void;
}) {
  if (!open || !recommendation) {
    return null;
  }

  const rec = recommendation;
  const deltaPositive = rec.deltaPct >= 0;
  const sellthroughShiftPts =
    Math.round((rec.impact.sellthroughRecommendedPct - rec.impact.sellthroughCurrentPct) * 10) / 10;

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center bg-slate-950/45 px-4 py-8">
      <div className="max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-lg border bg-card shadow-2xl">
        <div className="flex items-start justify-between gap-3 border-b px-6 py-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h2 className="font-heading text-xl font-semibold text-foreground">
                Price Recommendation
              </h2>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {eventName} · {seatGroupName} · Refreshed {rec.model.refreshedLabel}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-foreground"
            aria-label="Close recommendation details"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-5 px-6 py-5">
          <div className="grid gap-3 sm:grid-cols-[1.2fr_1fr]">
            <div className="rounded-lg border bg-secondary/15 p-4">
              <p className="text-[11px] font-medium text-muted-foreground">
                Recommended Price
              </p>
              <div className="mt-1 flex flex-wrap items-baseline gap-2">
                <span className="text-2xl font-semibold text-foreground">
                  {formatPrice(rec.recommendedPrice)}
                </span>
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(rec.currentPrice)}
                </span>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs font-semibold",
                    deltaPositive ? "bg-success/10 text-success" : "bg-warning/10 text-warning",
                  )}
                >
                  {deltaPositive ? "+" : ""}
                  {rec.deltaPct}%
                </span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Modeled revenue-optimal price: {formatPrice(rec.optimalPrice)} ·
                Elasticity {rec.elasticity.toFixed(2)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{rec.guardrailNote}</p>
            </div>

            <div className="rounded-lg border bg-secondary/15 p-4">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-medium text-muted-foreground">
                  Model Confidence
                </p>
                <ConfidenceBadge score={rec.confidenceScore} tier={rec.confidenceTier} showScore={false} />
              </div>
              <p className="mt-1 text-2xl font-semibold text-foreground">
                {rec.confidenceScore}
                <span className="text-base font-normal text-muted-foreground">/100</span>
              </p>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary/60">
                <div
                  className={cn("h-full rounded-full", tierMeterStyles[rec.confidenceTier])}
                  style={{ width: `${rec.confidenceScore}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {confidenceTierLabels[rec.confidenceTier]} confidence based on{" "}
                {rec.model.comparablesUsed} comparable events and current sales signal.
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Projected Impact</h3>
            <div className="mt-2 grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border bg-secondary/15 p-3">
                <p className="text-[11px] font-medium text-muted-foreground">
                  Remaining-Inventory Revenue
                </p>
                <p
                  className={cn(
                    "mt-1 text-xl font-semibold",
                    rec.impact.revenueDelta >= 0 ? "text-success" : "text-destructive",
                  )}
                >
                  {formatSignedMoney(rec.impact.revenueDelta)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatMoney(rec.impact.revenueCurrent)} →{" "}
                  {formatMoney(rec.impact.revenueRecommended)}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  80% interval: {formatSignedMoney(rec.impact.revenueDeltaLow)} to{" "}
                  {formatSignedMoney(rec.impact.revenueDeltaHigh)}
                </p>
              </div>
              <div className="rounded-lg border bg-secondary/15 p-3">
                <p className="text-[11px] font-medium text-muted-foreground">
                  Projected Final Sellthrough
                </p>
                <p className="mt-1 text-xl font-semibold text-foreground">
                  {rec.impact.sellthroughRecommendedPct}%
                </p>
                <p className="text-xs text-muted-foreground">
                  vs. {rec.impact.sellthroughCurrentPct}% at current price (
                  {sellthroughShiftPts >= 0 ? "+" : ""}
                  {sellthroughShiftPts} pts)
                </p>
              </div>
              <div className="rounded-lg border bg-secondary/15 p-3">
                <p className="text-[11px] font-medium text-muted-foreground">
                  Sell-Out Timing
                </p>
                <p className="mt-1 text-xl font-semibold text-foreground">
                  {rec.impact.selloutShiftDays === 0
                    ? "No change"
                    : `${Math.abs(rec.impact.selloutShiftDays)} days ${
                        rec.impact.selloutShiftDays > 0 ? "later" : "sooner"
                      }`}
                </p>
                <p className="text-xs text-muted-foreground">
                  Estimated shift in projected sell-out date.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.15fr_1fr]">
            <div className="rounded-lg border p-4">
              <h3 className="text-sm font-semibold text-foreground">Modeled Demand Curve</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Expected remaining-inventory revenue across the allowed price band.
                Shaded regions are outside pricing guardrails.
              </p>
              <div className="mt-2">
                <DemandCurveChart rec={rec} />
              </div>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="text-sm font-semibold text-foreground">Why This Price</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Top model drivers behind this recommendation.
              </p>
              <div className="mt-3">
                <DriverAttribution rec={rec} />
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-secondary/15 px-4 py-3">
            <p className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Model diagnostics:</span>{" "}
              trained on a {rec.model.trainingWindowDays}-day window ·{" "}
              {rec.model.comparablesUsed} comparable events · backtest error (MAPE){" "}
              {rec.model.backtestMapePct}% · refreshed {rec.model.refreshedLabel}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 border-t px-6 py-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={onApply} disabled={alreadyApplied}>
            {alreadyApplied
              ? "Recommendation Applied"
              : `Apply ${formatPrice(rec.recommendedPrice)} to Draft`}
          </Button>
        </div>
      </div>
    </div>
  );
}

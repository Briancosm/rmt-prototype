import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import type { PortfolioEvent } from "./useFilteredEvents";
import type { EventRoasRow } from "./portfolioMocks";
import {
  makePlot, scaleX, scaleY, pathFromPoints, evenTicks, niceMax,
} from "@/components/EventReporting/charts";

type MetricTab = "revenue" | "funnel-entries" | "funnel-completion" | "sold" | "roas";

const TABS: { id: MetricTab; label: string }[] = [
  { id: "revenue", label: "Revenue" },
  { id: "funnel-entries", label: "Funnel Entries" },
  { id: "funnel-completion", label: "Funnel Completion" },
  { id: "sold", label: "%" },
  { id: "roas", label: "ROAS" },
];

const X_LABELS = ["8w", "7w", "6w", "5w", "4w", "3w", "2w", "1w", "Now"];

// ---------------------------------------------------------------------------
// RNG + series generators
// ---------------------------------------------------------------------------

function rng(seed: number) {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function cumulativeSeries(finalValue: number, seed: number, n = 9): number[] {
  if (finalValue === 0) return Array(n).fill(0);
  const r = rng(seed);
  const pts: number[] = [0];
  for (let i = 1; i < n - 1; i++) {
    const t = i / (n - 1);
    const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    const noise = (r() - 0.5) * 0.07;
    pts.push(finalValue * Math.max(0, Math.min(0.98, eased + noise)));
  }
  pts.push(finalValue);
  return pts;
}

function trendSeries(finalValue: number, seed: number, n = 9, spread = 0.12): number[] {
  if (finalValue === 0) return Array(n).fill(0);
  const r = rng(seed);
  const startFrac = 0.55 + r() * 0.25;
  return Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1);
    const linear = finalValue * (startFrac + (1 - startFrac) * t);
    return Math.max(0, linear + (r() - 0.5) * 2 * spread * finalValue);
  });
}

// ---------------------------------------------------------------------------
// Series config
// ---------------------------------------------------------------------------

interface SeriesConfig {
  title: string;
  description: string;
  actualLabel: string;
  expectedLabel: string;
  deltaLabel: string;
  actualSeries: number[];
  expectedSeries: number[];
  actualTotal: number;
  expectedTotal: number;
  deltaBadge: string;
  deltaPositive: boolean;
  fmtKpi: (v: number) => string;
  fmtY: (v: number) => string;
  yMax: number;
}

function fmtUsd(v: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD",
    notation: Math.abs(v) >= 1_000_000 ? "compact" : "standard",
    maximumFractionDigits: Math.abs(v) >= 1_000_000 ? 1 : 0,
  }).format(v);
}

function fmtUsdY(v: number) {
  if (Math.abs(v) >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (Math.abs(v) >= 1_000) return `$${Math.round(v / 1_000)}K`;
  return `$${Math.round(v)}`;
}

function buildSeries(
  events: PortfolioEvent[],
  tab: MetricTab,
  roasRows: EventRoasRow[],
): SeriesConfig {
  const seed = events.length * 31 + tab.length * 7;

  if (tab === "revenue") {
    const actual = events.reduce((s, e) => s + (e.netTicketRevenue ?? 0), 0);
    const expected = events.reduce((s, e) => s + (e.projectedNetRevenue ?? 0), 0);
    const delta = actual - expected;
    const sign = delta >= 0 ? "+" : "";
    return {
      title: "Revenue", description: "Net revenue accumulation against expected pace.",
      actualLabel: "Actual Revenue", expectedLabel: "Expected Revenue", deltaLabel: "Variance",
      actualSeries: cumulativeSeries(actual, seed),
      expectedSeries: cumulativeSeries(expected, seed + 1),
      actualTotal: actual, expectedTotal: expected,
      deltaBadge: `${sign}${fmtUsd(delta)}`,
      deltaPositive: delta >= 0,
      fmtKpi: fmtUsd, fmtY: fmtUsdY,
      yMax: niceMax(Math.max(actual, expected) * 1.1),
    };
  }

  if (tab === "funnel-entries") {
    const active = events.filter((e) => e.tof !== null);
    const actual = active.reduce((s, e) => s + (e.tof ?? 0), 0);
    const avgVsPct = active.length
      ? active.reduce((s, e) => s + (e.funnelEntriesVsExpectedPct ?? 0), 0) / active.length : 0;
    const expected = actual && avgVsPct !== -100
      ? Math.round(actual / (1 + avgVsPct / 100)) : actual;
    const delta = actual - expected;
    const deltaPct = expected ? Math.round((delta / expected) * 100) : 0;
    const fmtK = (v: number) => v >= 1_000 ? `${(v / 1_000).toFixed(0)}K` : String(Math.round(v));
    return {
      title: "Funnel Entries", description: "Cumulative top-of-funnel sessions across all events.",
      actualLabel: "Actual Entries", expectedLabel: "Expected Entries", deltaLabel: "Δ vs Expected",
      actualSeries: cumulativeSeries(actual, seed),
      expectedSeries: cumulativeSeries(expected, seed + 1),
      actualTotal: actual, expectedTotal: expected,
      deltaBadge: `${deltaPct >= 0 ? "+" : ""}${deltaPct}%`,
      deltaPositive: delta >= 0,
      fmtKpi: (v) => v.toLocaleString(), fmtY: fmtK,
      yMax: niceMax(Math.max(actual, expected) * 1.1),
    };
  }

  if (tab === "funnel-completion") {
    const active = events.filter((e) => e.fcrPct !== null);
    const avgFcr = active.length
      ? active.reduce((s, e) => s + (e.fcrPct ?? 0), 0) / active.length : 0;
    const avgVsPct = active.length
      ? active.reduce((s, e) => s + (e.fcrVsExpectedPct ?? 0), 0) / active.length : 0;
    const expectedFcr = avgVsPct !== -100 ? avgFcr / (1 + avgVsPct / 100) : avgFcr;
    const delta = avgFcr - expectedFcr;
    const deltaPct = expectedFcr ? Math.round((delta / expectedFcr) * 100) : 0;
    return {
      title: "Funnel Completion", description: "Average funnel completion rate (FCR) trend across events.",
      actualLabel: "Actual FCR %", expectedLabel: "Expected FCR %", deltaLabel: "Δ vs Expected",
      actualSeries: trendSeries(avgFcr, seed, 9, 0.14),
      expectedSeries: trendSeries(expectedFcr, seed + 1, 9, 0.05),
      actualTotal: avgFcr, expectedTotal: expectedFcr,
      deltaBadge: `${deltaPct >= 0 ? "+" : ""}${deltaPct}%`,
      deltaPositive: delta >= 0,
      fmtKpi: (v) => `${v.toFixed(2)}%`, fmtY: (v) => `${v.toFixed(1)}%`,
      yMax: Math.min(20, niceMax(Math.max(avgFcr, expectedFcr) * 1.4)),
    };
  }

  if (tab === "sold") {
    const active = events.filter((e) => e.soldPct !== null);
    const avgSold = active.length
      ? active.reduce((s, e) => s + (e.soldPct ?? 0), 0) / active.length : 0;
    const avgProjected = active.length
      ? active.reduce((s, e) => s + (e.domeProjectedSellthroughPct ?? 0), 0) / active.length : 0;
    const delta = avgSold - avgProjected;
    const deltaPct = avgProjected ? Math.round((delta / avgProjected) * 100) : 0;
    return {
      title: "%", description: "Average sell-through progression vs. projected across all events.",
      actualLabel: "Actual %", expectedLabel: "Projected", deltaLabel: "Δ vs Projected",
      actualSeries: trendSeries(avgSold, seed, 9, 0.09),
      expectedSeries: trendSeries(avgProjected, seed + 1, 9, 0.04),
      actualTotal: avgSold, expectedTotal: avgProjected,
      deltaBadge: `${deltaPct >= 0 ? "+" : ""}${deltaPct}%`,
      deltaPositive: delta >= 0,
      fmtKpi: (v) => `${v.toFixed(1)}%`, fmtY: (v) => `${Math.round(v)}%`,
      yMax: 100,
    };
  }

  // ROAS
  const roasMap = new Map(roasRows.map((r) => [r.id, r]));
  const vals = events.map((e) => roasMap.get(e.id)?.roas ?? 0).filter((v) => v > 0);
  const avgRoas = vals.length ? vals.reduce((s, v) => s + v, 0) / vals.length : 0;
  const target = 5.0;
  const delta = avgRoas - target;
  return {
    title: "ROAS", description: "Portfolio-wide return on ad spend vs. 5.0× performance target.",
    actualLabel: "Actual ROAS", expectedLabel: "5.0× Target", deltaLabel: "Δ vs Target",
    actualSeries: trendSeries(avgRoas, seed, 9, 0.11),
    expectedSeries: Array(9).fill(target),
    actualTotal: avgRoas, expectedTotal: target,
    deltaBadge: `${delta >= 0 ? "+" : ""}${delta.toFixed(1)}×`,
    deltaPositive: delta >= 0,
    fmtKpi: (v) => `${v.toFixed(1)}×`, fmtY: (v) => `${v.toFixed(1)}×`,
    yMax: niceMax(Math.max(avgRoas, target) * 1.3),
  };
}

// ---------------------------------------------------------------------------
// Chart
// ---------------------------------------------------------------------------

const PLOT_W = 720;
const PLOT_H = 220;

function TrendChart({ series }: { series: SeriesConfig }) {
  const plot = makePlot(PLOT_W, PLOT_H, { left: 52, right: 14, top: 12, bottom: 28 });
  const n = X_LABELS.length;
  const yMax = series.yMax || 1;
  const ticks = evenTicks(yMax, 4);

  const actualCoords = series.actualSeries.map((v, i) => ({
    x: scaleX(i, n, plot),
    y: scaleY(v, yMax, plot),
  }));
  const expectedCoords = series.expectedSeries.map((v, i) => ({
    x: scaleX(i, n, plot),
    y: scaleY(v, yMax, plot),
  }));

  const actualPath = pathFromPoints(actualCoords);
  const expectedPath = pathFromPoints(expectedCoords);

  const baseY = scaleY(0, yMax, plot);
  const firstX = actualCoords[0].x.toFixed(1);
  const lastX = actualCoords[actualCoords.length - 1].x.toFixed(1);
  const areaPath = `${actualPath} L ${lastX} ${baseY.toFixed(1)} L ${firstX} ${baseY.toFixed(1)} Z`;

  return (
    <svg
      viewBox={`0 0 ${PLOT_W} ${PLOT_H}`}
      width="100%"
      style={{ display: "block" }}
      aria-label={`${series.title} trend chart`}
    >
      {ticks.map((tick) => {
        const y = scaleY(tick, yMax, plot);
        return (
          <g key={tick}>
            <line
              x1={plot.left} y1={y.toFixed(1)}
              x2={PLOT_W - plot.right} y2={y.toFixed(1)}
              stroke="currentColor" strokeWidth="1"
              className="text-border" strokeOpacity="0.5"
            />
            <text
              x={plot.left - 4} y={y}
              textAnchor="end" dominantBaseline="middle"
              fontSize="10" fill="currentColor" className="text-muted-foreground"
            >
              {series.fmtY(tick)}
            </text>
          </g>
        );
      })}

      <path d={areaPath} fill="var(--color-success, #22c55e)" fillOpacity="0.08" />

      <path
        d={expectedPath}
        fill="none"
        stroke="var(--color-warning, #f97316)"
        strokeWidth="1.5"
        strokeDasharray="5,4"
      />

      <path
        d={actualPath}
        fill="none"
        stroke="var(--color-success, #22c55e)"
        strokeWidth="2"
      />

      {actualCoords.map((c, i) => (
        <circle
          key={i}
          cx={c.x.toFixed(1)} cy={c.y.toFixed(1)}
          r={i === actualCoords.length - 1 ? "4" : "3"}
          fill="var(--color-success, #22c55e)"
        />
      ))}

      {X_LABELS.map((lbl, i) => (
        <text
          key={lbl}
          x={scaleX(i, n, plot).toFixed(1)}
          y={PLOT_H - 5}
          textAnchor="middle"
          fontSize="10"
          fill="currentColor"
          className="text-muted-foreground"
        >
          {lbl}
        </text>
      ))}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// KPI card
// ---------------------------------------------------------------------------

function KpiCard({
  label,
  value,
  valueClass = "text-foreground",
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="rounded-lg border bg-background/60 px-4 py-2.5 text-right min-w-[120px]">
      <p className="text-[10px] font-semibold text-muted-foreground">{label}</p>
      <p className={cn("mt-0.5 text-base font-bold tabular-nums", valueClass)}>{value}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

interface TrendingTableProps {
  events: PortfolioEvent[];
  roasRows: EventRoasRow[];
}

export function TrendingTable({ events, roasRows }: TrendingTableProps) {
  const [activeTab, setActiveTab] = useState<MetricTab>("revenue");
  const series = useMemo(
    () => buildSeries(events, activeTab, roasRows),
    [events, activeTab, roasRows],
  );

  return (
    <section className="overflow-hidden rounded-lg border bg-card/95 shadow-sm">
      {/* Header — same style as All Events section */}
      <div className="border-b px-4 py-3 sm:px-6">
        <p className="text-sm font-semibold text-foreground">Trending by Metric</p>
        <div className="mt-2 flex flex-wrap gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "rounded-md px-3 py-1 text-xs font-medium transition-colors",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/60 text-muted-foreground hover:text-foreground",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Title + KPI cards — bg-muted/30 sub-header matching thead style */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b bg-muted/30 px-4 py-3 sm:px-6">
        <div>
          <p className="text-sm font-medium text-foreground">{series.title}</p>
          <p className="text-xs text-muted-foreground">{series.description}</p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <KpiCard label={series.actualLabel} value={series.fmtKpi(series.actualTotal)} />
          <KpiCard label={series.expectedLabel} value={series.fmtKpi(series.expectedTotal)} />
          <KpiCard
            label={series.deltaLabel}
            value={series.deltaBadge}
            valueClass={series.deltaPositive ? "text-success" : "text-destructive"}
          />
        </div>
      </div>

      {/* Chart */}
      <div className="px-4 pb-3 pt-3 sm:px-6">
        {events.length === 0 ? (
          <div className="flex h-[220px] items-center justify-center">
            <p className="text-sm text-muted-foreground">No events match the selected filters.</p>
          </div>
        ) : (
          <TrendChart series={series} />
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 border-t px-4 py-2.5 sm:px-6">
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <svg width="20" height="10" viewBox="0 0 20 10">
            <line x1="0" y1="5" x2="20" y2="5" stroke="var(--color-success, #22c55e)" strokeWidth="2" />
            <circle cx="10" cy="5" r="3" fill="var(--color-success, #22c55e)" />
          </svg>
          {series.actualLabel}
        </span>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <svg width="20" height="10" viewBox="0 0 20 10">
            <line x1="0" y1="5" x2="20" y2="5" stroke="var(--color-warning, #f97316)" strokeWidth="1.5" strokeDasharray="4,3" />
          </svg>
          {series.expectedLabel}
        </span>
      </div>
    </section>
  );
}

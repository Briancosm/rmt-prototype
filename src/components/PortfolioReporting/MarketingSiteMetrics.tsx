import { cn } from "@/lib/utils";
import type { MarketingMetrics } from "./portfolioMocks";

interface MarketingSiteMetricsProps {
  metrics: MarketingMetrics;
}

function fmtNum(v: number) {
  return new Intl.NumberFormat("en-US", { notation: v >= 10_000 ? "compact" : "standard", maximumFractionDigits: 1 }).format(v);
}

export function MarketingSiteMetrics({ metrics }: MarketingSiteMetricsProps) {
  const noData = metrics.totalSessions === 0;

  return (
    <section className="overflow-hidden rounded-lg border bg-card/95 shadow-sm">
      <div className="border-b px-4 py-3 sm:px-5">
        <h3 className="text-sm font-semibold text-foreground">Marketing &amp; Site Metrics</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">Aggregate across filtered events</p>
      </div>

      {noData ? (
        <div className="px-5 py-10 text-center text-sm text-muted-foreground">No active events in selection.</div>
      ) : (
        <div className="divide-y">
          {/* Site metrics */}
          <div className="grid grid-cols-2 gap-3 px-4 py-4 sm:px-5">
            <Metric
              label="Site Sessions"
              value={fmtNum(metrics.totalSessions)}
              sub={
                <VsExpected value={metrics.sessionsVsExpectedPct} unit="% vs expected" />
              }
            />
            <Metric
              label="Checkout CTR"
              value={`${metrics.avgCtr}%`}
              sub="avg initiation rate"
            />
            <Metric
              label="Conversion Rate"
              value={`${metrics.avgConversionRate}%`}
              sub="purchase completion"
              accent={metrics.avgConversionRate >= 5 ? "text-success" : metrics.avgConversionRate >= 3.5 ? "text-warning" : "text-destructive"}
            />
            <Metric
              label="Top Source"
              value={metrics.topSource}
              sub={`${metrics.topSourceSharePct}% of traffic`}
            />
          </div>

          {/* Channel mix bar */}
          <div className="px-4 py-4 sm:px-5">
            <p className="mb-2 text-xs font-medium text-muted-foreground">Traffic Mix</p>
            <div className="flex h-5 w-full overflow-hidden rounded-full">
              {[
                { label: "Direct", pct: metrics.directPct, color: "bg-primary" },
                { label: "Organic", pct: metrics.organicPct, color: "bg-success" },
                { label: "Paid", pct: metrics.paidPct, color: "bg-warning" },
                { label: "Email", pct: metrics.emailPct, color: "bg-destructive/70" },
                { label: "Social", pct: metrics.socialPct, color: "bg-muted-foreground/40" },
              ].map((s) => (
                <div
                  key={s.label}
                  className={cn("h-full first:rounded-l-full last:rounded-r-full", s.color)}
                  style={{ width: `${s.pct}%` }}
                  title={`${s.label}: ${s.pct}%`}
                />
              ))}
            </div>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
              {[
                { label: "Direct", pct: metrics.directPct, color: "bg-primary" },
                { label: "Organic", pct: metrics.organicPct, color: "bg-success" },
                { label: "Paid", pct: metrics.paidPct, color: "bg-warning" },
                { label: "Email", pct: metrics.emailPct, color: "bg-destructive/70" },
                { label: "Social", pct: metrics.socialPct, color: "bg-muted-foreground/40" },
              ].map((s) => (
                <span key={s.label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className={cn("h-2.5 w-2.5 rounded-sm", s.color)} />
                  {s.label} {s.pct}%
                </span>
              ))}
            </div>
          </div>

          {/* Email metrics */}
          <div className="grid grid-cols-3 gap-3 px-4 py-4 sm:px-5">
            <Metric label="Emails Sent" value={fmtNum(metrics.emailsSent)} sub="across campaigns" />
            <Metric
              label="Open Rate"
              value={`${metrics.emailOpenRate}%`}
              sub="industry avg 21%"
              accent={metrics.emailOpenRate >= 21 ? "text-success" : "text-warning"}
            />
            <Metric
              label="Click Rate"
              value={`${metrics.emailClickRate}%`}
              sub="industry avg 3.5%"
              accent={metrics.emailClickRate >= 3.5 ? "text-success" : "text-warning"}
            />
          </div>
        </div>
      )}
    </section>
  );
}

function Metric({ label, value, sub, accent }: { label: string; value: string; sub: React.ReactNode; accent?: string }) {
  return (
    <div>
      <p className="text-[10px] font-medium text-muted-foreground">{label}</p>
      <p className={cn("mt-0.5 font-heading text-xl font-semibold tabular-nums", accent ?? "text-foreground")}>{value}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>
    </div>
  );
}

function VsExpected({ value, unit }: { value: number; unit: string }) {
  const pos = value > 0;
  const neg = value < 0;
  return (
    <span className={cn("font-medium", pos ? "text-success" : neg ? "text-destructive" : "text-muted-foreground")}>
      {pos ? "+" : ""}{value}{unit}
    </span>
  );
}

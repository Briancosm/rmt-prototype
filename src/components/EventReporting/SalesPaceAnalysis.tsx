import { generateSalesPace, type ReportingEventInput } from "@/mocks/eventReportingData";
import {
  bandPath,
  evenTicks,
  makePlot,
  pathFromPoints,
  scaleX,
  scaleY,
} from "./charts";

interface SalesPaceAnalysisProps {
  event: ReportingEventInput;
}

export function SalesPaceAnalysis({ event }: SalesPaceAnalysisProps) {
  const model = generateSalesPace(event);
  const plot = makePlot(720, 250);
  const yMax = 100;
  const len = model.points.length;

  const actualCoords = model.points
    .filter((p) => p.actual !== null)
    .map((p) => ({ x: scaleX(p.day, len, plot), y: scaleY(p.actual as number, yMax, plot) }));
  const expectedCoords = model.points.map((p) => ({
    x: scaleX(p.day, len, plot),
    y: scaleY(p.expected, yMax, plot),
  }));
  const projectedCoords = model.points
    .filter((p) => p.projected !== null)
    .map((p) => ({ x: scaleX(p.day, len, plot), y: scaleY(p.projected as number, yMax, plot) }));

  const band = bandPath(
    model.points.map((p) => ({ x: scaleX(p.day, len, plot), low: p.bandLow, high: p.bandHigh })),
    yMax,
    plot,
  );

  const todayX = scaleX(model.currentDay, len, plot);
  const yTicks = evenTicks(yMax, 4);

  return (
    <section className="rounded-lg border bg-background p-4 sm:p-5" aria-label="Sales pace analysis">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-heading text-lg font-semibold text-foreground">Sales Pace Analysis</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Cumulative sell-through vs. historical average, with projected finish.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 text-right">
          <PaceStat label="Sold now" value={`${model.percentSold}%`} />
          <PaceStat label="Projected" value={`${model.projectedFinalPct}%`} accent="text-primary" />
          <PaceStat label="Target" value={`${model.targetPct}%`} accent="text-success" />
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <svg
          width="100%"
          viewBox={`0 0 ${plot.width} ${plot.height}`}
          className="min-w-[560px]"
          role="img"
          aria-label={`Sales pace chart: ${model.percentSold}% sold today, projected ${model.projectedFinalPct}% by event day.`}
        >
          {/* Y gridlines + labels */}
          {yTicks.map((tick) => {
            const y = scaleY(tick, yMax, plot);
            return (
              <g key={tick}>
                <line
                  x1={plot.left}
                  x2={plot.width - plot.right}
                  y1={y}
                  y2={y}
                  stroke="hsl(var(--border))"
                  strokeWidth={1}
                  strokeDasharray="2 4"
                />
                <text x={plot.left - 8} y={y + 3} textAnchor="end" className="fill-muted-foreground text-[10px]">
                  {tick}%
                </text>
              </g>
            );
          })}

          {/* Confidence band */}
          {band && <path d={band} fill="hsl(var(--primary))" fillOpacity={0.1} stroke="none" />}

          {/* Expected (historical average) */}
          <path
            d={pathFromPoints(expectedCoords)}
            fill="none"
            stroke="hsl(var(--success))"
            strokeWidth={1.8}
            strokeDasharray="5 4"
          />

          {/* Projected */}
          <path
            d={pathFromPoints(projectedCoords)}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth={1.8}
            strokeDasharray="2 3"
          />

          {/* Actual */}
          <path
            d={pathFromPoints(actualCoords)}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth={2.6}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Today marker */}
          <line
            x1={todayX}
            x2={todayX}
            y1={plot.top}
            y2={plot.height - plot.bottom}
            stroke="hsl(var(--foreground))"
            strokeWidth={1}
            strokeOpacity={0.35}
          />
          <text
            x={todayX}
            y={plot.top - 4}
            textAnchor="middle"
            className="fill-muted-foreground text-[10px] font-medium"
          >
            Today
          </text>

          {/* X axis labels */}
          {[0, model.currentDay, model.totalDays].map((day, i) => (
            <text
              key={`${day}-${i}`}
              x={scaleX(day, len, plot)}
              y={plot.height - 8}
              textAnchor={i === 0 ? "start" : i === 2 ? "end" : "middle"}
              className="fill-muted-foreground text-[10px]"
            >
              {day === model.totalDays ? "Event" : `Day ${day}`}
            </text>
          ))}
        </svg>
      </div>

      {/* Legend + remaining */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
          <LegendSwatch color="hsl(var(--primary))" label="Actual" />
          <LegendSwatch color="hsl(var(--primary))" label="Projected" dashed />
          <LegendSwatch color="hsl(var(--success))" label="Expected avg" dashed />
        </div>
        <p className="text-muted-foreground">
          <span className="font-semibold text-foreground">{model.daysRemaining}</span> days ·{" "}
          <span className="font-semibold text-foreground">
            {model.inventoryRemaining.toLocaleString()}
          </span>{" "}
          / {model.inventoryTotal.toLocaleString()} seats left
        </p>
      </div>
    </section>
  );
}

function PaceStat({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div>
      <p className="text-[10px] font-medium text-muted-foreground">{label}</p>
      <p className={`font-heading text-lg font-semibold tabular-nums ${accent ?? "text-foreground"}`}>
        {value}
      </p>
    </div>
  );
}

function LegendSwatch({ color, label, dashed }: { color: string; label: string; dashed?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <svg width={18} height={6} aria-hidden="true">
        <line
          x1={0}
          y1={3}
          x2={18}
          y2={3}
          stroke={color}
          strokeWidth={2.4}
          strokeDasharray={dashed ? "3 2" : undefined}
        />
      </svg>
      {label}
    </span>
  );
}

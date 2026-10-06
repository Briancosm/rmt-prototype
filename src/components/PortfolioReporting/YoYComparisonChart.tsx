import { niceAxis } from "./chartAxis";
import type { YoYModel, YoYSeries } from "./portfolioMocks";

interface YoYComparisonChartProps {
  title: string;
  model: YoYModel;
  formatValue: (v: number) => string;
}

const PLOT_W = 560;
const PLOT_H = 220;
const PAD = { top: 10, right: 118, bottom: 26, left: 42 };

const PRIOR_COLOR = "hsl(217 75% 55%)";
const CURRENT_COLOR = "hsl(25 90% 55%)";

/**
 * Two season cohorts on a shared day axis, with a marker at today.
 *
 * The current cohort is dashed and stops at the marker — the rest of its
 * season has not happened yet. Drawing it solid and full-width would imply
 * actuals exist for dates in the future.
 */
export function YoYComparisonChart({ title, model, formatValue }: YoYComparisonChartProps) {
  const plotW = PLOT_W - PAD.left - PAD.right;
  const plotH = PLOT_H - PAD.top - PAD.bottom;

  const allValues = [...model.priorCohort.points, ...model.currentCohort.points]
    .map((p) => p.value)
    .filter((v): v is number => v !== null);
  const { yMax, ticks } = niceAxis(Math.max(1, ...allValues) * 1.1);

  const x = (t: number) => PAD.left + (t / (model.points - 1)) * plotW;
  const y = (v: number) => PAD.top + plotH - (v / yMax) * plotH;

  const pathFor = (series: YoYSeries) => {
    const segments: string[] = [];
    let open = false;
    for (const p of series.points) {
      if (p.value === null) {
        open = false;
        continue;
      }
      segments.push(`${open ? "L" : "M"} ${x(p.t).toFixed(1)} ${y(p.value).toFixed(1)}`);
      open = true;
    }
    return segments.join(" ");
  };

  const todayX = x(model.todayIndex);

  return (
    <section className="overflow-hidden rounded-lg border bg-card/95 shadow-sm">
      <div className="border-b px-4 py-3 sm:px-6">
        <h3 className="font-heading text-lg font-semibold tracking-tight text-foreground">
          {title}
        </h3>
      </div>

      <div className="px-2 py-3 sm:px-4">
        <svg
          viewBox={`0 0 ${PLOT_W} ${PLOT_H}`}
          width="100%"
          style={{ display: "block" }}
          role="img"
          aria-label={`${title} — two season cohorts compared`}
        >
          {ticks.map((tick) => {
            const ty = y(tick);
            return (
              <g key={tick}>
                <line
                  x1={PAD.left}
                  y1={ty}
                  x2={PAD.left + plotW}
                  y2={ty}
                  stroke="currentColor"
                  strokeWidth="0.5"
                  strokeOpacity="0.5"
                  className="text-border"
                />
                <text
                  x={PAD.left - 4}
                  y={ty}
                  textAnchor="end"
                  dominantBaseline="middle"
                  fontSize="7"
                  fill="currentColor"
                  className="text-muted-foreground"
                >
                  {formatValue(tick)}
                </text>
              </g>
            );
          })}

          {/* Today marker — where the current cohort's actuals stop. */}
          <line
            x1={todayX}
            y1={PAD.top}
            x2={todayX}
            y2={PAD.top + plotH}
            stroke="currentColor"
            strokeWidth="0.7"
            strokeDasharray="4,3"
            className="text-muted-foreground"
          />
          <text
            x={todayX}
            y={PAD.top - 2}
            textAnchor="middle"
            fontSize="6.5"
            fill="currentColor"
            className="text-muted-foreground"
          >
            today
          </text>

          <path
            d={pathFor(model.priorCohort)}
            fill="none"
            stroke={PRIOR_COLOR}
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <path
            d={pathFor(model.currentCohort)}
            fill="none"
            stroke={CURRENT_COLOR}
            strokeWidth="1.4"
            strokeDasharray="5,3"
            strokeLinejoin="round"
          />

          <line
            x1={PAD.left}
            y1={PAD.top + plotH}
            x2={PAD.left + plotW}
            y2={PAD.top + plotH}
            stroke="currentColor"
            strokeWidth="0.6"
            className="text-border"
          />

          {/* Legend */}
          <text
            x={PAD.left + plotW + 12}
            y={PAD.top + 10}
            fontSize="7.5"
            fontWeight="600"
            fill="currentColor"
            className="text-foreground"
          >
            Cohort
          </text>
          {[
            { label: model.priorCohort.label, color: PRIOR_COLOR, dash: undefined },
            { label: model.currentCohort.label, color: CURRENT_COLOR, dash: "4,2" },
          ].map((entry, i) => (
            <g key={entry.label}>
              <line
                x1={PAD.left + plotW + 12}
                y1={PAD.top + 21 + i * 12}
                x2={PAD.left + plotW + 28}
                y2={PAD.top + 21 + i * 12}
                stroke={entry.color}
                strokeWidth="1.4"
                strokeDasharray={entry.dash}
              />
              <text
                x={PAD.left + plotW + 32}
                y={PAD.top + 23.5 + i * 12}
                fontSize="7"
                fill="currentColor"
                className="text-muted-foreground"
              >
                {entry.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </section>
  );
}

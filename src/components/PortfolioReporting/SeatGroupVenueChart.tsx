import { niceAxis } from "./chartAxis";
import { SEAT_GROUPS, type SeatGroupVenueSeries } from "./portfolioMocks";

interface SeatGroupVenueChartProps {
  title: string;
  /** Y-axis caption, e.g. "Sell-Through Rate". */
  yLabel: string;
  series: SeatGroupVenueSeries[];
  formatValue: (v: number) => string;
}

const PLOT_W = 560;
const PLOT_H = 230;
const PAD = { top: 10, right: 76, bottom: 34, left: 40 };


/**
 * Grouped bars: one cluster per venue, one bar per seat group within it.
 *
 * Seat groups are a price ladder (S premium down to GA), so they are shaded as
 * a single-hue ramp rather than categorical colours — the ordering is the
 * information, and a rainbow would imply the groups are unrelated.
 */
export function SeatGroupVenueChart({
  title,
  yLabel,
  series,
  formatValue,
}: SeatGroupVenueChartProps) {
  const plotW = PLOT_W - PAD.left - PAD.right;
  const plotH = PLOT_H - PAD.top - PAD.bottom;

  const max = Math.max(
    1,
    ...series.flatMap((s) => s.values.map((v) => v.value)),
  );
  const { yMax, ticks } = niceAxis(max);

  const clusterW = plotW / Math.max(1, series.length);
  const barW = (clusterW * 0.82) / SEAT_GROUPS.length;

  const shade = (i: number) => {
    // Ramp built on the app's primary (hue 240), darkest at the premium end.
    // Saturation eases off toward the light end so the pale bars read as tints
    // of the brand colour rather than washed-out blue.
    const t = i / (SEAT_GROUPS.length - 1);
    const lightness = 30 + t * 56;
    const saturation = 52 - t * 8;
    return `hsl(240 ${saturation}% ${lightness}%)`;
  };

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
          aria-label={`${title} — grouped bars by venue and seat group`}
        >
          {/* Gridlines + y-axis labels */}
          {ticks.map((tick) => {
            const y = PAD.top + plotH - (tick / yMax) * plotH;
            return (
              <g key={tick}>
                <line
                  x1={PAD.left}
                  y1={y}
                  x2={PAD.left + plotW}
                  y2={y}
                  stroke="currentColor"
                  strokeWidth="0.5"
                  strokeOpacity="0.5"
                  className="text-border"
                />
                <text
                  x={PAD.left - 4}
                  y={y}
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

          <text
            transform={`rotate(-90 10 ${PAD.top + plotH / 2})`}
            x={10}
            y={PAD.top + plotH / 2}
            textAnchor="middle"
            fontSize="7.5"
            fill="currentColor"
            className="text-muted-foreground"
          >
            {yLabel}
          </text>

          {/* Bars */}
          {series.map((venueSeries, vi) => {
            const clusterX = PAD.left + vi * clusterW;
            return (
              <g key={venueSeries.venue}>
                {venueSeries.values.map((v, i) => {
                  const h = (v.value / yMax) * plotH;
                  const x = clusterX + clusterW * 0.09 + i * barW;
                  return (
                    <rect
                      key={v.seatGroup}
                      x={x}
                      y={PAD.top + plotH - h}
                      width={Math.max(0.8, barW - 0.5)}
                      height={Math.max(0, h)}
                      fill={shade(i)}
                    >
                      <title>{`${venueSeries.venue} · ${v.seatGroup}: ${formatValue(v.value)}`}</title>
                    </rect>
                  );
                })}
                <text
                  x={clusterX + clusterW / 2}
                  y={PAD.top + plotH + 12}
                  textAnchor="middle"
                  fontSize="7.5"
                  fill="currentColor"
                  className="text-muted-foreground"
                >
                  {venueSeries.venue}
                </text>
              </g>
            );
          })}

          {/* Baseline */}
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
            x={PAD.left + plotW + 14}
            y={PAD.top + 4}
            fontSize="7.5"
            fontWeight="600"
            fill="currentColor"
            className="text-foreground"
          >
            Seat Group
          </text>
          {SEAT_GROUPS.map((sg, i) => (
            <g key={sg}>
              <rect
                x={PAD.left + plotW + 14}
                y={PAD.top + 11 + i * 11}
                width={7}
                height={7}
                fill={shade(i)}
              />
              <text
                x={PAD.left + plotW + 25}
                y={PAD.top + 17.5 + i * 11}
                fontSize="7"
                fill="currentColor"
                className="text-muted-foreground"
              >
                {sg}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </section>
  );
}

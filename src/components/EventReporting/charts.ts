// Small, self-contained SVG chart helpers for the Event Reporting views.
// Mirrors the hand-built inline-SVG approach already used elsewhere in the app
// (no external charting dependency).

export interface PlotArea {
  width: number;
  height: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export function makePlot(width = 720, height = 240, overrides: Partial<PlotArea> = {}): PlotArea {
  return {
    width,
    height,
    left: 46,
    right: 18,
    top: 16,
    bottom: 28,
    ...overrides,
  };
}

export function niceTickStep(value: number): number {
  if (value <= 1) return 0.2;
  if (value <= 5) return 1;
  if (value <= 10) return 2;
  if (value <= 25) return 5;
  if (value <= 50) return 10;
  if (value <= 100) return 20;
  if (value <= 500) return 100;
  if (value <= 2_000) return 500;
  if (value <= 10_000) return 2_000;
  if (value <= 50_000) return 10_000;
  return 25_000;
}

export function niceMax(value: number): number {
  const step = niceTickStep(value);
  return Math.ceil(value / step) * step;
}

export function scaleX(index: number, length: number, plot: PlotArea): number {
  if (length <= 1) return plot.left;
  return plot.left + (index / (length - 1)) * (plot.width - plot.left - plot.right);
}

export function scaleXValue(value: number, min: number, max: number, plot: PlotArea): number {
  const span = max - min || 1;
  return plot.left + ((value - min) / span) * (plot.width - plot.left - plot.right);
}

export function scaleY(value: number, yMax: number, plot: PlotArea, yMin = 0): number {
  const span = yMax - yMin || 1;
  const drawable = plot.height - plot.top - plot.bottom;
  return plot.top + (1 - (value - yMin) / span) * drawable;
}

/** Build an SVG path string from a list of (x, y) screen coordinates. */
export function pathFromPoints(coords: Array<{ x: number; y: number }>): string {
  return coords
    .map((c, i) => `${i === 0 ? "M" : "L"} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`)
    .join(" ");
}

/**
 * Build a closed band path (upper edge forward, lower edge back) for a
 * confidence interval. `coords` items may have null bounds which are skipped.
 */
export function bandPath(
  coords: Array<{ x: number; low: number | null; high: number | null }>,
  yMax: number,
  plot: PlotArea,
  yMin = 0,
): string {
  const valid = coords.filter((c) => c.low !== null && c.high !== null);
  if (valid.length === 0) return "";
  const upper = valid
    .map((c, i) => `${i === 0 ? "M" : "L"} ${c.x.toFixed(1)} ${scaleY(c.high as number, yMax, plot, yMin).toFixed(1)}`)
    .join(" ");
  const lower = [...valid]
    .reverse()
    .map((c) => `L ${c.x.toFixed(1)} ${scaleY(c.low as number, yMax, plot, yMin).toFixed(1)}`)
    .join(" ");
  return `${upper} ${lower} Z`;
}

/** Compact sparkline path scaled to a width x height box. */
export function sparklinePath(values: number[], width: number, height: number, pad = 2): string {
  if (values.length === 0) return "";
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  return values
    .map((v, i) => {
      const x = pad + (values.length <= 1 ? 0 : (i / (values.length - 1)) * (width - pad * 2));
      const y = pad + (1 - (v - min) / span) * (height - pad * 2);
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

export function evenTicks(yMax: number, count = 4, yMin = 0): number[] {
  const ticks: number[] = [];
  for (let i = 0; i <= count; i += 1) {
    ticks.push(yMin + ((yMax - yMin) * i) / count);
  }
  return ticks;
}

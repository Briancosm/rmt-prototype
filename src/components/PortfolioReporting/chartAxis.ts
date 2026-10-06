/**
 * Picks a round gridline step (1, 2, 2.5 or 5 x a power of ten) so axes read
 * 0/20/40/60/80 rather than 0/17.5/35/52.5/70.
 */
export function niceAxis(max: number, tickCount = 4): { yMax: number; ticks: number[] } {
  const safeMax = max > 0 ? max : 1;
  const rough = safeMax / tickCount;
  const magnitude = Math.pow(10, Math.floor(Math.log10(rough)));
  const normalized = rough / magnitude;
  const nice =
    normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 2.5 ? 2.5 : normalized <= 5 ? 5 : 10;
  const step = nice * magnitude;
  const yMax = Math.ceil(safeMax / step) * step;
  return {
    yMax,
    ticks: Array.from({ length: Math.round(yMax / step) + 1 }, (_, i) => i * step),
  };
}

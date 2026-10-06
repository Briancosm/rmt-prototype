// Centralized mock-data module for the per-event Reporting deep-dive.
// Frontend-only prototype: every value here is generated locally from the
// event record. Generators are deterministic (seeded by event id) so the
// charts stay stable across re-renders.

/** Structural subset of the app's EventRecord that the reporting views need. */
export interface ReportingSeatGroup {
  id: string;
  name: string;
  currentPrice: number;
  originalPrice: number;
  recTicketPrice: number;
  soldPct: number;
  ticketsRemaining: number;
}

export interface ReportingEventInput {
  id: string;
  event: string;
  eventCategory: string;
  venueName: string;
  startTimeLabel: string;
  weekdayLabel: string;
  daysInMarket: number | null;
  salesWindowDays: number | null;
  daysRemaining: number | null;
  eventHealth: number | null;
  soldPct: number | null;
  netTicketRevenue: number | null;
  projectedNetRevenue: number | null;
  projectedRevenue: number | null;
  optimizedProjected: number | null;
  funnelEntriesVsExpectedPct: number | null;
  seatGroups: ReportingSeatGroup[];
}

export type RiskFlag = "critical" | "warning" | "monitor" | "on-track";

export interface ReportingKpis {
  healthScore: number;
  riskFlag: RiskFlag;
  currentRevenue: number;
  expectedRevenue: number;
  variance: number;
  variancePercent: number;
  daysRemaining: number;
  daysInMarket: number;
  salesWindowDays: number;
  percentSold: number;
  inventoryTotal: number;
  inventoryRemaining: number;
  projectedFinalSellThrough: number;
}

export interface VariancePoint {
  dayIndex: number;
  dayLabel: string;
  actual: number;
  expected: number;
}

export interface PacePoint {
  day: number;
  /** Cumulative % sold along the actual curve (null after "today"). */
  actual: number | null;
  /** Cumulative % sold along the expected / historical-average curve. */
  expected: number;
  /** Cumulative % sold along the projected curve (null before "today"). */
  projected: number | null;
  /** Lower / upper confidence band on the projection (null before "today"). */
  bandLow: number | null;
  bandHigh: number | null;
}

export interface SalesPaceModel {
  points: PacePoint[];
  currentDay: number;
  totalDays: number;
  percentSold: number;
  projectedFinalPct: number;
  targetPct: number;
  inventoryTotal: number;
  inventoryRemaining: number;
  daysRemaining: number;
  /** Extra daily sales rate (in % of inventory) needed to hit target. */
  dailyLiftToTargetPct: number;
}

// ---------------------------------------------------------------------------
// Deterministic seeded RNG helpers
// ---------------------------------------------------------------------------

function hashString(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed: number): () => number {
  let a = seed;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

// ---------------------------------------------------------------------------
// Derived KPIs
// ---------------------------------------------------------------------------

export function deriveKpis(event: ReportingEventInput): ReportingKpis {
  const currentRevenue = event.netTicketRevenue ?? event.projectedNetRevenue ?? 0;

  // Use the funnel-vs-expected signal as a pace proxy when available, else
  // fall back to a health-derived estimate.
  const healthScore = event.eventHealth ?? 70;
  const paceSignal =
    event.funnelEntriesVsExpectedPct ?? Math.round((healthScore - 70) / 2);
  const variancePercent = clamp(paceSignal, -60, 40);

  const expectedRevenue =
    variancePercent === 0
      ? currentRevenue
      : Math.round(currentRevenue / (1 + variancePercent / 100));
  const variance = currentRevenue - expectedRevenue;

  const percentSold = event.soldPct ?? 0;
  const inventoryRemaining = event.seatGroups.reduce(
    (sum, sg) => sum + (sg.ticketsRemaining ?? 0),
    0,
  );
  const inventoryTotal =
    percentSold >= 100
      ? inventoryRemaining
      : Math.round(inventoryRemaining / (1 - percentSold / 100));

  const daysInMarket = event.daysInMarket ?? 0;
  const salesWindowDays = event.salesWindowDays ?? Math.max(daysInMarket + (event.daysRemaining ?? 14), 1);
  const fractionElapsed = clamp(daysInMarket / Math.max(salesWindowDays, 1), 0.05, 0.99);
  const projectedFinalSellThrough = clamp(
    Math.round(percentSold / Math.pow(fractionElapsed, 0.8)),
    percentSold,
    100,
  );

  let riskFlag: RiskFlag;
  if (healthScore < 40 || variancePercent <= -25) {
    riskFlag = "critical";
  } else if (healthScore < 60 || variancePercent <= -10) {
    riskFlag = "warning";
  } else if (healthScore < 80 || variancePercent < 0) {
    riskFlag = "monitor";
  } else {
    riskFlag = "on-track";
  }

  return {
    healthScore,
    riskFlag,
    currentRevenue,
    expectedRevenue,
    variance,
    variancePercent,
    daysRemaining: event.daysRemaining ?? 0,
    daysInMarket,
    salesWindowDays,
    percentSold,
    inventoryTotal,
    inventoryRemaining,
    projectedFinalSellThrough,
  };
}

// ---------------------------------------------------------------------------
// Variance history (15-day actual vs expected cumulative revenue)
// ---------------------------------------------------------------------------

export function generateVarianceHistory(
  event: ReportingEventInput,
  days = 15,
): VariancePoint[] {
  const kpis = deriveKpis(event);
  const rng = mulberry32(hashString(`${event.id}:variance`));
  const points: VariancePoint[] = [];

  for (let i = 0; i < days; i += 1) {
    // 0..1 progress with a gentle ease so cumulative revenue ramps up.
    const t = days === 1 ? 1 : i / (days - 1);
    const eased = Math.pow(t, 1.15);
    const noise = (rng() - 0.5) * 0.05;

    const expected = Math.round(kpis.expectedRevenue * clamp(eased, 0, 1));
    const actual = Math.round(
      kpis.currentRevenue * clamp(eased + noise * (1 - t), 0, 1),
    );

    points.push({
      dayIndex: i,
      dayLabel: `D-${days - 1 - i}`,
      actual: i === days - 1 ? kpis.currentRevenue : actual,
      expected: i === days - 1 ? kpis.expectedRevenue : expected,
    });
  }

  return points;
}

// ---------------------------------------------------------------------------
// Sales pace (cumulative sell-through curve + projection + confidence band)
// ---------------------------------------------------------------------------

export function generateSalesPace(event: ReportingEventInput): SalesPaceModel {
  const kpis = deriveKpis(event);
  const totalDays = Math.max(kpis.salesWindowDays, 2);
  const currentDay = clamp(kpis.daysInMarket, 1, totalDays - 1);
  const rng = mulberry32(hashString(`${event.id}:pace`));

  const projectedFinalPct = kpis.projectedFinalSellThrough;
  const targetPct = clamp(Math.max(projectedFinalPct + 7, 80), 0, 100);

  // Front-loaded adoption curve: most sales early, tapering toward the event.
  const curveAt = (dayFraction: number, finalPct: number) =>
    finalPct * (1 - Math.pow(1 - dayFraction, 1.7));

  // Calibrate the actual curve so it lands exactly on percentSold "today".
  const todayFraction = currentDay / totalDays;
  const rawToday = 1 - Math.pow(1 - todayFraction, 1.7);
  const actualFinalForCurve = rawToday > 0 ? kpis.percentSold / rawToday : kpis.percentSold;

  const points: PacePoint[] = [];
  for (let day = 0; day <= totalDays; day += 1) {
    const frac = day / totalDays;
    const expected = clamp(curveAt(frac, Math.max(targetPct, projectedFinalPct + 4)), 0, 100);

    let actual: number | null = null;
    let projected: number | null = null;
    let bandLow: number | null = null;
    let bandHigh: number | null = null;

    if (day <= currentDay) {
      const noise = day === currentDay ? 0 : (rng() - 0.5) * 1.4;
      actual = clamp(curveAt(frac, actualFinalForCurve) + noise, 0, 100);
      if (day === currentDay) {
        actual = kpis.percentSold;
        projected = kpis.percentSold;
        bandLow = kpis.percentSold;
        bandHigh = kpis.percentSold;
      }
    }
    if (day >= currentDay) {
      // Continue from today toward the projected final at current pace.
      const remainFrac = (day - currentDay) / Math.max(totalDays - currentDay, 1);
      const projGain = (projectedFinalPct - kpis.percentSold) * (1 - Math.pow(1 - remainFrac, 1.4));
      projected = clamp(kpis.percentSold + projGain, 0, 100);
      const spread = 3 + remainFrac * 6;
      bandLow = clamp(projected - spread, 0, 100);
      bandHigh = clamp(projected + spread, 0, 100);
    }

    points.push({ day, actual, expected, projected, bandLow, bandHigh });
  }

  const daysRemaining = Math.max(totalDays - currentDay, 0);
  const gapToTarget = Math.max(targetPct - projectedFinalPct, 0);
  const dailyLiftToTargetPct =
    daysRemaining > 0 ? Number((gapToTarget / daysRemaining).toFixed(2)) : 0;

  return {
    points,
    currentDay,
    totalDays,
    percentSold: kpis.percentSold,
    projectedFinalPct,
    targetPct,
    inventoryTotal: kpis.inventoryTotal,
    inventoryRemaining: kpis.inventoryRemaining,
    daysRemaining,
    dailyLiftToTargetPct,
  };
}

// ---------------------------------------------------------------------------
// Local formatting helpers (kept here so the module is self-contained)
// ---------------------------------------------------------------------------

export function formatUsd(value: number, opts: { compact?: boolean } = {}): string {
  if (opts.compact && Math.abs(value) >= 1000) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatSignedUsd(value: number, opts: { compact?: boolean } = {}): string {
  const sign = value > 0 ? "+" : value < 0 ? "-" : "";
  return `${sign}${formatUsd(Math.abs(value), opts)}`;
}

export function formatSignedPct(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(value % 1 === 0 ? 0 : 1)}%`;
}

export const RISK_FLAG_LABEL: Record<RiskFlag, string> = {
  critical: "Critical",
  warning: "Warning",
  monitor: "Monitor",
  "on-track": "On Track",
};

// ---------------------------------------------------------------------------
// Comparable events (Phase 2)
// ---------------------------------------------------------------------------

export interface ComparableEvent {
  id: string;
  name: string;
  venue: string;
  category: string;
  weekday: string;
  dateLabel: string;
  priceMin: number;
  priceMax: number;
  /** Sell-through at the same days-in-market as the current event. */
  pctSoldAtDayInMarket: number;
  /** Final sell-through achieved by the comp. */
  finalYield: number;
  /** 0-100 closeness to the current event. */
  similarity: number;
  matchesVenue: boolean;
  matchesCategory: boolean;
  matchesWeekday: boolean;
}

const VENUE_POOL = [
  "Los Angeles",
  "Cleveland",
  "Chicago",
  "New York",
  "Boston",
  "Dallas",
  "Miami",
  "Denver",
  "Phoenix",
  "Seattle",
];

const WEEKDAY_POOL = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const NAME_POOL: Record<string, string[]> = {
  Sports: [
    "Lakers vs. Warriors",
    "Celtics vs. Heat",
    "Bulls vs. Knicks",
    "Mavericks vs. Suns",
    "Nuggets vs. Clippers",
    "Cavaliers vs. Bucks",
    "Rangers vs. Bruins",
    "Yankees vs. Red Sox",
  ],
  Music: [
    "Midnight Echo Live",
    "Neon Skyline Tour",
    "The Velvet Hours",
    "Saffron & Sage",
    "Crimson Avenue",
    "Aurora Nights",
    "Silver Lake Sessions",
    "Northern Lights Tour",
  ],
  Theater: [
    "A Winter's Tale",
    "The Gilded Stage",
    "Echoes of Broadway",
    "Moonlit Overture",
    "The Last Encore",
    "City of Lamps",
  ],
  Family: [
    "Dino Adventure Live",
    "Ice Spectacular",
    "Cirque Lumina",
    "Storybook Festival",
    "Magic & Wonder Tour",
  ],
};

function namesForCategory(category: string): string[] {
  return NAME_POOL[category] ?? [
    `${category} Showcase`,
    `${category} Classic`,
    `${category} Spotlight`,
    `${category} Invitational`,
    `${category} Series`,
    `${category} Festival`,
  ];
}

function pick<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length) % arr.length];
}

function eventPriceRange(event: ReportingEventInput): { min: number; max: number } {
  const prices = event.seatGroups.map((sg) => sg.currentPrice).filter((p) => p > 0);
  if (prices.length === 0) return { min: 30, max: 80 };
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

/** Build a deterministic pool of 30+ historical events for this event. */
export function generateHistoricalPool(event: ReportingEventInput, size = 32): ComparableEvent[] {
  const rng = mulberry32(hashString(`${event.id}:pool`));
  const kpis = deriveKpis(event);
  const range = eventPriceRange(event);
  const names = namesForCategory(event.eventCategory);

  const pool: ComparableEvent[] = [];
  for (let i = 0; i < size; i += 1) {
    // Bias roughly half the pool toward matching attributes so comps exist.
    const matchVenue = rng() < 0.45;
    const matchCategory = rng() < 0.6;
    const matchWeekday = rng() < 0.4;

    const venue = matchVenue ? event.venueName : pick(VENUE_POOL, rng);
    const category = matchCategory ? event.eventCategory : pick(Object.keys(NAME_POOL), rng);
    const weekday = matchWeekday ? event.weekdayLabel : pick(WEEKDAY_POOL, rng);
    const nameList = category === event.eventCategory ? names : namesForCategory(category);
    const name = pick(nameList, rng);

    const priceJitter = 0.8 + rng() * 0.5; // 0.8x – 1.3x
    const priceMin = Math.round(range.min * priceJitter);
    const priceMax = Math.round(range.max * priceJitter * (1 + rng() * 0.2));

    const pctSoldAtDayInMarket = clamp(
      Math.round(kpis.percentSold + (rng() - 0.4) * 30),
      10,
      96,
    );
    const finalYield = clamp(
      Math.round(pctSoldAtDayInMarket + 8 + rng() * 18),
      pctSoldAtDayInMarket,
      100,
    );

    // Past dates, deterministic
    const month = 1 + Math.floor(rng() * 12);
    const day = 1 + Math.floor(rng() * 27);
    const dateLabel = `${String(month).padStart(2, "0")}/${String(day).padStart(2, "0")}/25`;

    // Similarity score
    const priceCloseness =
      1 -
      clamp(
        Math.abs((priceMin + priceMax) / 2 - (range.min + range.max) / 2) /
          Math.max((range.min + range.max) / 2, 1),
        0,
        1,
      );
    const similarity = Math.round(
      (matchVenue ? 34 : 0) +
        (matchCategory ? 34 : 0) +
        (matchWeekday ? 14 : 0) +
        priceCloseness * 18,
    );

    pool.push({
      id: `${event.id}-comp-${i}`,
      name,
      venue,
      category,
      weekday,
      dateLabel,
      priceMin,
      priceMax,
      pctSoldAtDayInMarket,
      finalYield,
      similarity: clamp(similarity, 0, 100),
      matchesVenue: matchVenue,
      matchesCategory: matchCategory,
      matchesWeekday: matchWeekday,
    });
  }

  return pool;
}

/**
 * Return the top comparable events (same venue / category / day-of-week),
 * ranked by similarity. Filters to events sharing at least the category.
 */
export function generateComparableEvents(
  event: ReportingEventInput,
  limit = 5,
): ComparableEvent[] {
  return generateHistoricalPool(event)
    .filter((c) => c.matchesCategory || c.matchesVenue)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);
}

// ---------------------------------------------------------------------------
// Price performance vs comps (Phase 2)
// ---------------------------------------------------------------------------

export interface SeatGroupComparison {
  id: string;
  name: string;
  yourPrice: number;
  compAvgPrice: number;
  priceDeltaPct: number;
  yourSellThrough: number;
  compAvgSellThrough: number;
  sellThroughDeltaPct: number;
}

export interface PricePerformanceModel {
  rows: SeatGroupComparison[];
  compCount: number;
  insight: string;
  suggestion: string;
}

export function generatePricePerformance(event: ReportingEventInput): PricePerformanceModel {
  const comps = generateComparableEvents(event);
  const rng = mulberry32(hashString(`${event.id}:priceperf`));
  const compAvgMid =
    comps.length > 0
      ? comps.reduce((s, c) => s + (c.priceMin + c.priceMax) / 2, 0) / comps.length
      : 0;
  const compAvgSell =
    comps.length > 0
      ? comps.reduce((s, c) => s + c.pctSoldAtDayInMarket, 0) / comps.length
      : 0;

  const rows: SeatGroupComparison[] = event.seatGroups.map((sg) => {
    // Comp price for this tier drifts around the comp average, scaled by the
    // tier's position relative to the event's own price spread.
    const compAvgPrice = Math.round(compAvgMid * (0.75 + rng() * 0.5));
    const priceDeltaPct =
      compAvgPrice > 0 ? Math.round(((sg.currentPrice - compAvgPrice) / compAvgPrice) * 100) : 0;
    const compAvgSellThrough = clamp(Math.round(compAvgSell + (rng() - 0.5) * 12), 5, 99);
    const sellThroughDeltaPct = sg.soldPct - compAvgSellThrough;

    return {
      id: sg.id,
      name: sg.name,
      yourPrice: sg.currentPrice,
      compAvgPrice,
      priceDeltaPct,
      yourSellThrough: sg.soldPct,
      compAvgSellThrough,
      sellThroughDeltaPct,
    };
  });

  // Insight: the tier most over-priced relative to comps while under-selling.
  const flagged = [...rows]
    .filter((r) => r.priceDeltaPct > 0)
    .sort((a, b) => b.priceDeltaPct - a.priceDeltaPct - (b.sellThroughDeltaPct - a.sellThroughDeltaPct))[0];

  let insight: string;
  let suggestion: string;
  if (flagged && flagged.sellThroughDeltaPct < 0) {
    insight = `Your ${flagged.name} price is ${flagged.priceDeltaPct}% higher than comps, while sell-through is ${Math.abs(flagged.sellThroughDeltaPct)}% lower.`;
    suggestion = `Consider moving ${flagged.name} closer to the comp average (${formatUsd(flagged.compAvgPrice)}) to lift conversion.`;
  } else if (flagged) {
    insight = `Your ${flagged.name} price is ${flagged.priceDeltaPct}% above comps but sell-through is holding.`;
    suggestion = `Pricing power looks healthy on ${flagged.name} — hold or test a small increase.`;
  } else {
    insight = `Your pricing is at or below comparable events across all tiers.`;
    suggestion = `Room to test modest price increases where sell-through is strong.`;
  }

  return { rows, compCount: comps.length, insight, suggestion };
}

// ---------------------------------------------------------------------------
// Funnel breakdown (Phase 3)
// ---------------------------------------------------------------------------

export type FunnelStageId = "presale" | "main" | "final";

export interface FunnelStage {
  id: FunnelStageId;
  label: string;
  tickets: number;
  pctOfTotal: number;
  avgPrice: number;
  conversionRate: number;
  /** Short trend series for a sparkline (is this stage trending up vs history). */
  trend: number[];
  trendDeltaPct: number;
}

export interface FunnelModel {
  stages: FunnelStage[];
  totalTickets: number;
}

function weightedAvgPrice(event: ReportingEventInput): number {
  const prices = event.seatGroups.map((sg) => sg.currentPrice).filter((p) => p > 0);
  if (prices.length === 0) return 50;
  return prices.reduce((s, p) => s + p, 0) / prices.length;
}

function sparkSeries(rng: () => number, base: number, drift: number, n = 7): number[] {
  const out: number[] = [];
  let v = base;
  for (let i = 0; i < n; i += 1) {
    v = Math.max(0, v + drift + (rng() - 0.5) * base * 0.18);
    out.push(Math.round(v));
  }
  return out;
}

export function generateFunnelData(event: ReportingEventInput): FunnelModel {
  const kpis = deriveKpis(event);
  const rng = mulberry32(hashString(`${event.id}:funnel`));
  const totalTickets = Math.max(
    1,
    Math.round((kpis.inventoryTotal * kpis.percentSold) / 100),
  );
  const baseline = weightedAvgPrice(event);

  // Deterministic stage split (presale / main / final) summing to total.
  const presaleShare = 0.28 + rng() * 0.14; // 28% – 42%
  const finalShare = 0.12 + rng() * 0.1; // 12% – 22%
  const mainShare = Math.max(0.2, 1 - presaleShare - finalShare);

  const presaleTickets = Math.round(totalTickets * presaleShare);
  const finalTickets = Math.round(totalTickets * finalShare);
  const mainTickets = Math.max(0, totalTickets - presaleTickets - finalTickets);

  const defs: Array<{
    id: FunnelStageId;
    label: string;
    tickets: number;
    priceFactor: number;
    conv: number;
    drift: number;
  }> = [
    { id: "presale", label: "Presale", tickets: presaleTickets, priceFactor: 0.88, conv: 58 + rng() * 12, drift: baseline * 0.04 },
    { id: "main", label: "Main Sale", tickets: mainTickets, priceFactor: 1.0, conv: 34 + rng() * 10, drift: baseline * 0.01 },
    { id: "final", label: "Final Push", tickets: finalTickets, priceFactor: 1.06, conv: 22 + rng() * 9, drift: -baseline * 0.03 },
  ];

  const stages: FunnelStage[] = defs.map((d) => {
    const trend = sparkSeries(rng, d.tickets / 6 + 4, d.drift / 6);
    const first = trend[0] || 1;
    const last = trend[trend.length - 1] || 1;
    return {
      id: d.id,
      label: d.label,
      tickets: d.tickets,
      pctOfTotal: Math.round((d.tickets / totalTickets) * 100),
      avgPrice: Math.round(baseline * d.priceFactor),
      conversionRate: Math.round(d.conv),
      trend,
      trendDeltaPct: Math.round(((last - first) / first) * 100),
    };
  });

  return { stages, totalTickets };
}

// ---------------------------------------------------------------------------
// Channel & buyer-source attribution (Phase 3)
// ---------------------------------------------------------------------------

export interface ChannelSlice {
  id: string;
  label: string;
  tickets: number;
  pctOfTotal: number;
  avgPrice: number;
  repeatRate: number;
  color: string;
}

export interface ChannelModel {
  slices: ChannelSlice[];
  totalTickets: number;
  insight: string;
}

const CHANNEL_DEFS: Array<{
  id: string;
  label: string;
  baseShare: number;
  priceFactor: number;
  repeatBase: number;
  color: string;
}> = [
  { id: "direct", label: "Direct", baseShare: 0.34, priceFactor: 1.12, repeatBase: 42, color: "hsl(var(--primary))" },
  { id: "venue", label: "Venue Site", baseShare: 0.27, priceFactor: 1.02, repeatBase: 28, color: "hsl(var(--success))" },
  { id: "marketplace", label: "Marketplace", baseShare: 0.29, priceFactor: 0.92, repeatBase: 14, color: "hsl(var(--warning))" },
  { id: "phone", label: "Phone", baseShare: 0.1, priceFactor: 1.05, repeatBase: 33, color: "hsl(217 60% 55%)" },
];

export function generateChannelData(event: ReportingEventInput): ChannelModel {
  const kpis = deriveKpis(event);
  const rng = mulberry32(hashString(`${event.id}:channel`));
  const totalSold = Math.max(1, Math.round((kpis.inventoryTotal * kpis.percentSold) / 100));
  const baseline = weightedAvgPrice(event);

  // Jitter shares then normalize so they sum exactly to total tickets.
  const rawShares = CHANNEL_DEFS.map((c) => Math.max(0.02, c.baseShare + (rng() - 0.5) * 0.08));
  const shareSum = rawShares.reduce((s, v) => s + v, 0);

  let allocated = 0;
  const slices: ChannelSlice[] = CHANNEL_DEFS.map((def, i) => {
    const isLast = i === CHANNEL_DEFS.length - 1;
    const tickets = isLast
      ? totalSold - allocated
      : Math.round((rawShares[i] / shareSum) * totalSold);
    allocated += isLast ? 0 : tickets;
    return {
      id: def.id,
      label: def.label,
      tickets,
      pctOfTotal: Math.round((tickets / totalSold) * 100),
      avgPrice: Math.round(baseline * def.priceFactor),
      repeatRate: Math.round(def.repeatBase + (rng() - 0.5) * 8),
      color: def.color,
    };
  });

  const direct = slices.find((s) => s.id === "direct");
  const marketplace = slices.find((s) => s.id === "marketplace");
  let insight = "Channel mix is balanced across direct and third-party sources.";
  if (direct && marketplace && marketplace.avgPrice > 0) {
    const premium = Math.round(((direct.avgPrice - marketplace.avgPrice) / marketplace.avgPrice) * 100);
    if (premium > 0) {
      insight = `Direct buyers pay ${premium}% more than marketplace buyers — consider prioritizing direct marketing.`;
    }
  }

  return { slices, totalTickets: totalSold, insight };
}

// ---------------------------------------------------------------------------
// Marketing channels (Email / Ads / Web)
//
// Demand-generation performance, distinct from `generateChannelData` above,
// which attributes tickets to the *sales* channel they were bought through.
// Attributed tickets here are allocated out of the event's actual sold count so
// the three channels reconcile to the same total the pricing views report,
// rather than floating free of it.
// ---------------------------------------------------------------------------

export type MarketingChannelId = "email" | "ads" | "web";

export interface MarketingColumn {
  id: string;
  label: string;
  numeric?: boolean;
  /** Draws a sparkline to the left of this cell's value. */
  spark?: boolean;
}

export interface MarketingRow {
  id: string;
  label: string;
  values: Record<string, string>;
  series: number[];
}

export interface MarketingChannelModel {
  id: MarketingChannelId;
  /** First column header — also names the module. */
  label: string;
  /** Collapsed summary row label, e.g. "Ads · all campaigns". */
  summaryLabel: string;
  /** Caption shown above the breakdown once expanded. */
  breakdownTitle: string;
  /** First column header inside the breakdown. */
  breakdownLabel: string;
  columns: MarketingColumn[];
  /** Breakdown columns — may add ones the summary row has no value for. */
  breakdownColumns: MarketingColumn[];
  summary: MarketingRow;
  rows: MarketingRow[];
  attributedTickets: number;
  attributedRevenue: number;
}

const MARKETING_SHARES: Record<MarketingChannelId, number> = {
  email: 0.22,
  ads: 0.34,
  web: 0.44,
};

const AD_PLATFORMS = ["Google", "Meta", "TikTok"];
const AD_SCOPES = ["Event", "Category"];
const WEB_POSITIONS = ["Featured", "Home page", "Category", "Listings", "EDP", "Other"];
const EMAIL_AUDIENCES: { label: string; threshold: "Low" | "Medium" | "High" }[] = [
  { label: "Ohio State", threshold: "Low" },
  { label: "Iowa", threshold: "Low" },
  { label: "NCAAF", threshold: "Medium" },
  { label: "Sports", threshold: "High" },
  { label: "New users", threshold: "Low" },
];

/**
 * Email audiences overlap — one person can sit in several — so the collapsed
 * "unique" summary is deliberately below the sum of the audience rows. Ads and
 * Web rows are disjoint, so those summaries are exact sums.
 */
const EMAIL_UNIQUE_FACTOR = 0.54;

function splitShares(rng: () => number, total: number, parts: number): number[] {
  const weights = Array.from({ length: parts }, () => 0.6 + rng() * 0.8);
  const sum = weights.reduce((s, w) => s + w, 0);
  const out: number[] = [];
  let allocated = 0;
  for (let i = 0; i < parts; i += 1) {
    const value = i === parts - 1 ? total - allocated : Math.round((weights[i] / sum) * total);
    out.push(Math.max(0, value));
    allocated += value;
  }
  return out;
}

/** Large counts read better abbreviated; the breakdown's smaller ones don't. */
function formatCount(n: number): string {
  return n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : Math.round(n).toLocaleString();
}

function pct(part: number, whole: number, digits = 1): string {
  if (whole <= 0) return "—";
  return `${((part / whole) * 100).toFixed(digits)}%`;
}

function money2(n: number): string {
  return `$${n.toFixed(2)}`;
}

function sum<T>(rows: T[], pick: (row: T) => number): number {
  return rows.reduce((total, row) => total + pick(row), 0);
}

export function generateMarketingChannels(event: ReportingEventInput): MarketingChannelModel[] {
  const kpis = deriveKpis(event);
  const rng = mulberry32(hashString(`${event.id}:marketing`));
  const avgPrice = weightedAvgPrice(event);
  // Anchor on the event's own reported revenue rather than the seat-group
  // inventory count — the two are on different scales, and attributed revenue
  // has to reconcile with the figure the pricing views show for this event.
  const totalRevenue = Math.max(avgPrice, kpis.currentRevenue);
  const totalSold = Math.max(1, Math.round(totalRevenue / avgPrice));

  const ticketsFor = (id: MarketingChannelId) =>
    Math.max(AD_PLATFORMS.length * AD_SCOPES.length, Math.round(totalSold * MARKETING_SHARES[id]));

  // --- Ads ---------------------------------------------------------------
  const adCampaigns = AD_PLATFORMS.flatMap((platform) =>
    AD_SCOPES.map((scope) => `${platform} · ${scope}`),
  );
  const adTickets = ticketsFor("ads");
  const adRowTickets = splitShares(rng, adTickets, adCampaigns.length);

  // Every rate is derived from the raw counts below, so CTR/CPC/CPM reconcile
  // with their own row and the totals reconcile with the rows.
  const adRaw = adCampaigns.map((label, i) => {
    const tickets = adRowTickets[i];
    const revenue = Math.round(tickets * avgPrice * (0.9 + rng() * 0.25));
    const clicks = Math.max(1, Math.round(tickets * (16 + rng() * 10)));
    const impressions = Math.round(clicks * (45 + rng() * 35));
    // Budget is set against a return target, so spend stays a sensible
    // fraction of attributed revenue. Deriving it from clicks instead makes
    // ROAS a function of clicks-per-ticket, which lands structurally below 1x.
    const spend = Math.round(revenue / (2.2 + rng() * 1.8));
    const sessions = Math.round(clicks * (0.28 + rng() * 0.14));
    return {
      id: `ads-${i}`,
      label,
      tickets,
      clicks,
      impressions,
      spend,
      sessions,
      revenue,
    };
  });

  const adTotals = {
    spend: sum(adRaw, (r) => r.spend),
    impressions: sum(adRaw, (r) => r.impressions),
    clicks: sum(adRaw, (r) => r.clicks),
    sessions: sum(adRaw, (r) => r.sessions),
    tickets: sum(adRaw, (r) => r.tickets),
    revenue: sum(adRaw, (r) => r.revenue),
  };

  const adColumns: MarketingColumn[] = [
    { id: "spend", label: "Spend (30d)", numeric: true, spark: true },
    { id: "impr", label: "Impr.", numeric: true },
    { id: "clicks", label: "Clicks", numeric: true },
    { id: "ctr", label: "CTR", numeric: true },
    { id: "cpc", label: "CPC", numeric: true },
    { id: "cpm", label: "CPM", numeric: true },
    { id: "sessions", label: "Funnel sessions", numeric: true },
    { id: "tickets", label: "Tickets sold", numeric: true },
    { id: "revenue", label: "Revenue", numeric: true },
  ];

  const adValues = (d: {
    spend: number;
    impressions: number;
    clicks: number;
    sessions: number;
    tickets: number;
    revenue: number;
  }) => ({
    spend: formatUsd(d.spend),
    impr: formatCount(d.impressions),
    clicks: formatCount(d.clicks),
    ctr: pct(d.clicks, d.impressions),
    cpc: money2(d.spend / Math.max(1, d.clicks)),
    cpm: money2((d.spend / Math.max(1, d.impressions)) * 1000),
    sessions: formatCount(d.sessions),
    tickets: formatCount(d.tickets),
    revenue: formatUsd(d.revenue),
  });

  const ads: MarketingChannelModel = {
    id: "ads",
    label: "Ads",
    summaryLabel: "Ads · all campaigns",
    breakdownTitle: "Campaign breakdown",
    breakdownLabel: "Campaign type · scope",
    columns: adColumns,
    breakdownColumns: adColumns,
    summary: {
      id: "ads-summary",
      label: "Ads · all campaigns",
      values: adValues(adTotals),
      series: sparkSeries(rng, adTotals.spend / 30, adTotals.spend / 1200, 30),
    },
    rows: adRaw.map((r) => ({
      id: r.id,
      label: r.label,
      values: adValues(r),
      series: sparkSeries(rng, r.spend / 30, r.spend / 1200, 30),
    })),
    attributedTickets: adTotals.tickets,
    attributedRevenue: adTotals.revenue,
  };

  // --- Web ---------------------------------------------------------------
  const webTickets = ticketsFor("web");
  const webRowTickets = splitShares(rng, webTickets, WEB_POSITIONS.length);

  const webRaw = WEB_POSITIONS.map((label, i) => {
    const tickets = webRowTickets[i];
    const sessions = Math.max(1, Math.round(tickets * (14 + rng() * 8)));
    const clicks = Math.round(sessions / (0.45 + rng() * 0.3));
    const views = Math.round(clicks * (11 + rng() * 7));
    return {
      id: `web-${i}`,
      label,
      tickets,
      sessions,
      clicks,
      views,
      revenue: Math.round(tickets * avgPrice * (0.9 + rng() * 0.25)),
    };
  });

  const webTotals = {
    views: sum(webRaw, (r) => r.views),
    clicks: sum(webRaw, (r) => r.clicks),
    sessions: sum(webRaw, (r) => r.sessions),
    tickets: sum(webRaw, (r) => r.tickets),
    revenue: sum(webRaw, (r) => r.revenue),
  };

  const webColumns: MarketingColumn[] = [
    { id: "views", label: "Views (30d)", numeric: true, spark: true },
    { id: "clicks", label: "Clicks", numeric: true },
    { id: "sessions", label: "Funnel sessions", numeric: true },
    { id: "entry", label: "Funnel entry rate", numeric: true },
    { id: "tickets", label: "Tickets sold", numeric: true },
    { id: "revenue", label: "Revenue", numeric: true },
  ];

  const webValues = (d: {
    views: number;
    clicks: number;
    sessions: number;
    tickets: number;
    revenue: number;
  }) => ({
    views: formatCount(d.views),
    clicks: formatCount(d.clicks),
    sessions: formatCount(d.sessions),
    entry: pct(d.sessions, d.clicks, 0),
    tickets: formatCount(d.tickets),
    revenue: formatUsd(d.revenue),
  });

  const web: MarketingChannelModel = {
    id: "web",
    label: "Web",
    summaryLabel: "Web · all positions",
    breakdownTitle: "Traffic by position",
    breakdownLabel: "Position",
    columns: webColumns,
    breakdownColumns: webColumns,
    summary: {
      id: "web-summary",
      label: "Web · all positions",
      values: webValues(webTotals),
      series: sparkSeries(rng, webTotals.views / 30, webTotals.views / 1500, 30),
    },
    rows: webRaw.map((r) => ({
      id: r.id,
      label: r.label,
      values: webValues(r),
      series: sparkSeries(rng, r.views / 30, r.views / 1500, 30),
    })),
    attributedTickets: webTotals.tickets,
    attributedRevenue: webTotals.revenue,
  };

  // --- Email -------------------------------------------------------------
  const emailTickets = ticketsFor("email");
  // Audience rows are counted per-audience, so they sum above the unique total.
  const emailRowTickets = splitShares(
    rng,
    Math.round(emailTickets / EMAIL_UNIQUE_FACTOR),
    EMAIL_AUDIENCES.length,
  );

  const emailRaw = EMAIL_AUDIENCES.map((audience, i) => {
    const tickets = emailRowTickets[i];
    const entries = Math.max(1, Math.round(tickets * (2.2 + rng() * 1.6)));
    const clicks = Math.round(entries * (1.8 + rng() * 1.4));
    const opens = Math.round(clicks * (3.4 + rng() * 2.2));
    const sends = Math.round(opens * (2.6 + rng() * 1.4));
    return {
      id: `email-${i}`,
      label: audience.label,
      threshold: audience.threshold,
      sends,
      opens,
      clicks,
      entries,
      tickets,
      revenue: Math.round(tickets * avgPrice * (0.9 + rng() * 0.25)),
      newUsers: Math.round(10 + rng() * 32),
    };
  });

  const emailRowTotals = {
    sends: sum(emailRaw, (r) => r.sends),
    opens: sum(emailRaw, (r) => r.opens),
    clicks: sum(emailRaw, (r) => r.clicks),
    entries: sum(emailRaw, (r) => r.entries),
    tickets: sum(emailRaw, (r) => r.tickets),
    revenue: sum(emailRaw, (r) => r.revenue),
  };
  const emailTotals = {
    sends: Math.round(emailRowTotals.sends * EMAIL_UNIQUE_FACTOR),
    opens: Math.round(emailRowTotals.opens * EMAIL_UNIQUE_FACTOR),
    clicks: Math.round(emailRowTotals.clicks * EMAIL_UNIQUE_FACTOR),
    entries: Math.round(emailRowTotals.entries * EMAIL_UNIQUE_FACTOR),
    tickets: Math.round(emailRowTotals.tickets * EMAIL_UNIQUE_FACTOR),
    revenue: Math.round(emailRowTotals.revenue * EMAIL_UNIQUE_FACTOR),
    // Share of reach that had never bought before, weighted by sends.
    newUsers: Math.round(
      sum(emailRaw, (r) => r.newUsers * r.sends) / Math.max(1, emailRowTotals.sends),
    ),
  };

  const emailColumns: MarketingColumn[] = [
    { id: "sends", label: "Sends (30d)", numeric: true, spark: true },
    { id: "opens", label: "Opens", numeric: true },
    { id: "clicks", label: "Clicks", numeric: true },
    { id: "entries", label: "Funnel entry", numeric: true },
    { id: "tickets", label: "Tickets sold", numeric: true },
    { id: "revenue", label: "Revenue", numeric: true },
    { id: "newUsers", label: "% new users", numeric: true },
  ];

  const emailValues = (d: {
    sends: number;
    opens: number;
    clicks: number;
    entries: number;
    tickets: number;
    revenue: number;
    newUsers: number;
  }) => ({
    sends: formatCount(d.sends),
    opens: formatCount(d.opens),
    clicks: formatCount(d.clicks),
    entries: formatCount(d.entries),
    tickets: formatCount(d.tickets),
    revenue: formatUsd(d.revenue),
    newUsers: `${d.newUsers}%`,
  });

  const email: MarketingChannelModel = {
    id: "email",
    label: "Email",
    summaryLabel: "Email · all (unique)",
    breakdownTitle: "Audience breakdown (not unique)",
    breakdownLabel: "Audience",
    columns: emailColumns,
    // Threshold is an audience attribute, so it exists only in the breakdown.
    breakdownColumns: [{ id: "threshold", label: "Threshold" }, ...emailColumns],
    summary: {
      id: "email-summary",
      label: "Email · all (unique)",
      values: emailValues(emailTotals),
      series: sparkSeries(rng, emailTotals.sends / 30, emailTotals.sends / 900, 30),
    },
    rows: emailRaw.map((r) => ({
      id: r.id,
      label: r.label,
      values: { threshold: r.threshold, ...emailValues(r) },
      series: sparkSeries(rng, r.sends / 30, r.sends / 900, 30),
    })),
    attributedTickets: emailTotals.tickets,
    attributedRevenue: emailTotals.revenue,
  };

  return [ads, web, email];
}

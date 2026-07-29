// Pseudo-ML pricing recommendation engine for the prototype.
//
// Everything here is dummy data, but the shapes and math mirror what a real
// demand-model service would return: point estimates with confidence
// intervals, feature attributions, a demand curve, guardrails, and model
// metadata. All values are derived deterministically from the seat-group /
// event inputs (seeded by id), so the same row always produces the same
// recommendation across renders and navigation.

export type ConfidenceTier = "high" | "medium" | "low";

export interface RecommendationDriver {
  id: string;
  label: string;
  detail: string;
  /** Signed share of the price move this driver explains (sums to ~100 by absolute value). */
  contributionPct: number;
}

export interface DemandCurvePoint {
  price: number;
  expectedRevenue: number;
}

export interface RecommendationImpact {
  /** Projected revenue from remaining inventory at the current price. */
  revenueCurrent: number;
  /** Projected revenue from remaining inventory at the recommended price. */
  revenueRecommended: number;
  revenueDelta: number;
  /** 80% interval bounds on the revenue delta. */
  revenueDeltaLow: number;
  revenueDeltaHigh: number;
  /** Projected final sellthrough at current vs. recommended price. */
  sellthroughCurrentPct: number;
  sellthroughRecommendedPct: number;
  /** Estimated shift in sell-out timing, in days (+ = sells out later). */
  selloutShiftDays: number;
}

export interface ModelMetadata {
  refreshedLabel: string;
  comparablesUsed: number;
  /** Mean absolute percentage error on the holdout backtest. */
  backtestMapePct: number;
  trainingWindowDays: number;
}

export interface SeatGroupRecommendation {
  key: string;
  currentPrice: number;
  recommendedPrice: number;
  deltaPct: number;
  priceFloor: number;
  priceCeiling: number;
  guardrailNote: string;
  confidenceScore: number;
  confidenceTier: ConfidenceTier;
  /** Estimated own-price elasticity of demand (negative). */
  elasticity: number;
  impact: RecommendationImpact;
  drivers: RecommendationDriver[];
  demandCurve: DemandCurvePoint[];
  /** Price at the peak of the modeled demand curve. */
  optimalPrice: number;
  model: ModelMetadata;
}

export interface RecommendationInput {
  eventId: string;
  seatGroupId: string;
  currentPrice: number;
  recommendedPrice: number;
  originalPrice?: number;
  soldPct?: number | null;
  ticketsRemaining?: number | null;
  daysRemaining?: number | null;
  eventHealth?: number | null;
}

function hashString(value: string): number {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function createRng(seed: string): () => number {
  let state = hashString(seed) || 1;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function clampValue(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function round(value: number, decimals = 0): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

export function confidenceTierFor(score: number): ConfidenceTier {
  if (score >= 72) return "high";
  if (score >= 48) return "medium";
  return "low";
}

export const confidenceTierLabels: Record<ConfidenceTier, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

/**
 * Two pricing objectives the portfolio can optimize toward. Revenue pricing
 * comes from `buildSeatGroupRecommendation` above; sell-through pricing comes
 * from `sellThroughRecommendedPrice` below. They're intentionally driven by
 * different signals so they diverge the way two competing production models
 * would, rather than being one model with a fudge factor.
 */
export type RecommendationObjective = "revenue" | "sellThrough";

export const recommendationObjectiveLabels: Record<RecommendationObjective, string> = {
  revenue: "Revenue",
  sellThrough: "Sell-through",
};

// A deterministic, seeded price point for the sell-through objective — the
// same shape as `recTicketPrice` (the revenue recommendation): it can land
// above or below current price, it isn't a one-directional discount formula.
export function sellThroughRecommendedPrice(
  eventId: string,
  seatGroupId: string,
  currentPrice: number,
): number {
  const rng = createRng(`${eventId}:${seatGroupId}:sellThrough`);
  const pctMove = (rng() - 0.5) * 0.36; // symmetric ±18% move off current price
  return round(Math.max(1, currentPrice * (1 + pctMove)), 2);
}

function buildDrivers(
  rng: () => number,
  input: RecommendationInput,
  direction: number,
  elasticity: number,
): RecommendationDriver[] {
  const soldPct = input.soldPct ?? 55;
  const remaining = input.ticketsRemaining ?? 60;
  const daysRemaining = input.daysRemaining ?? 21;
  const paceDelta = Math.round(6 + rng() * 22);
  const compPremiumPct = Math.round(4 + rng() * 14);
  const funnelDelta = Math.round(3 + rng() * 18);

  const pool: { id: string; label: string; detail: string }[] =
    direction >= 0
      ? [
          {
            id: "pace",
            label: "Sales pace vs. comparables",
            detail: `Selling ${paceDelta}% faster than the comparable-event median at this point in the window.`,
          },
          {
            id: "scarcity",
            label: "Inventory scarcity",
            detail: `${remaining} tickets remain at ${soldPct}% sold — scarcity supports a higher clearing price.`,
          },
          {
            id: "comps",
            label: "Comparable event pricing",
            detail: `Similar inventory at comparable events is clearing ${compPremiumPct}% above this group's current price.`,
          },
          {
            id: "funnel",
            label: "Search & funnel momentum",
            detail: `Funnel entries are up ${funnelDelta}% week over week for this event.`,
          },
        ]
      : [
          {
            id: "pace",
            label: "Sales pace vs. comparables",
            detail: `Selling ${paceDelta}% slower than the comparable-event median at this point in the window.`,
          },
          {
            id: "scarcity",
            label: "Unsold inventory risk",
            detail: `${remaining} tickets remain at ${soldPct}% sold — elevated risk of unsold inventory at close.`,
          },
          {
            id: "comps",
            label: "Comparable event pricing",
            detail: `Similar inventory at comparable events is clearing ${compPremiumPct}% below this group's current price.`,
          },
          {
            id: "funnel",
            label: "Search & funnel momentum",
            detail: `Funnel entries are down ${funnelDelta}% week over week for this event.`,
          },
        ];

  const timing = {
    id: "timing",
    label: "Time to event",
    detail: `${daysRemaining} days remaining — pricing power ${
      daysRemaining < 10 ? "decays quickly from here" : "is still elevated this far out"
    }.`,
  };
  const sensitivity = {
    id: "elasticity",
    label: "Price sensitivity",
    detail: `Estimated demand elasticity of ${elasticity.toFixed(2)} for this seat group.`,
  };

  // Two supporting drivers, one opposing, two context drivers — weights are
  // seeded so each row gets a stable, distinct attribution profile.
  const primaryWeight = 30 + Math.round(rng() * 14);
  const secondaryWeight = 18 + Math.round(rng() * 10);
  const opposingWeight = -(8 + Math.round(rng() * 8));
  const shuffled = [...pool].sort(() => rng() - 0.5);
  const remainingWeight =
    100 - primaryWeight - secondaryWeight - Math.abs(opposingWeight);

  return [
    { ...shuffled[0], contributionPct: primaryWeight },
    { ...shuffled[1], contributionPct: secondaryWeight },
    { ...timing, contributionPct: Math.max(6, Math.round(remainingWeight * 0.6)) },
    { ...sensitivity, contributionPct: Math.max(4, remainingWeight - Math.max(6, Math.round(remainingWeight * 0.6))) },
    { ...shuffled[2], contributionPct: opposingWeight },
  ];
}

export function buildSeatGroupRecommendation(
  input: RecommendationInput,
): SeatGroupRecommendation {
  const key = `${input.eventId}:${input.seatGroupId}`;
  const rng = createRng(key);

  const currentPrice = Math.max(1, input.currentPrice);
  const recommendedPrice = Math.max(1, input.recommendedPrice);
  const deltaPct = round(((recommendedPrice - currentPrice) / currentPrice) * 100, 1);
  const direction = recommendedPrice >= currentPrice ? 1 : -1;

  const soldPct = clampValue(input.soldPct ?? 40 + rng() * 40, 0, 99);
  const remaining = Math.max(4, Math.round(input.ticketsRemaining ?? 20 + rng() * 220));
  const daysRemaining = Math.max(1, input.daysRemaining ?? Math.round(7 + rng() * 35));
  const eventHealth = clampValue(input.eventHealth ?? 45 + rng() * 40, 5, 98);

  // Higher sellthrough -> less elastic demand; weak health -> more elastic.
  const elasticityMagnitude = clampValue(
    (0.7 + rng() * 1.1) * (1 + (60 - soldPct) / 220) * (1 + (55 - eventHealth) / 400),
    0.45,
    2.4,
  );
  const elasticity = -round(elasticityMagnitude, 2);

  // Guardrails match the app's existing ±50%-of-original-price warning.
  const anchorPrice = input.originalPrice && input.originalPrice > 0 ? input.originalPrice : currentPrice;
  const priceFloor = round(anchorPrice * 0.5, 2);
  const priceCeiling = round(anchorPrice * 1.5, 2);
  const guardrailNote = `Constrained to ±50% of the original price (${priceFloor.toFixed(0)}–${priceCeiling.toFixed(0)}).`;

  // Model the demand curve as a quasi-concave revenue surface whose peak sits
  // at (or just past) the recommended price. Sharper peaks for more elastic
  // demand. Impact numbers are read off this same curve so the detail view is
  // internally consistent.
  const optimalPrice = round(
    clampValue(recommendedPrice * (1 + (rng() - 0.35) * 0.05), priceFloor, priceCeiling),
    2,
  );
  const curveSigma = optimalPrice * clampValue(0.52 / elasticityMagnitude, 0.2, 0.6);
  const expectedSellFraction = clampValue(0.5 + eventHealth / 250 + rng() * 0.12, 0.35, 0.97);
  const peakRevenue = remaining * expectedSellFraction * optimalPrice;
  const revenueAt = (price: number) =>
    Math.round(peakRevenue * Math.exp(-((price - optimalPrice) ** 2) / (2 * curveSigma ** 2)));

  const curveMin = Math.min(priceFloor, currentPrice * 0.9);
  const curveMax = Math.max(priceCeiling, currentPrice * 1.1);
  const demandCurve: DemandCurvePoint[] = Array.from({ length: 13 }, (_, i) => {
    const price = round(curveMin + ((curveMax - curveMin) * i) / 12, 2);
    return { price, expectedRevenue: revenueAt(price) };
  });

  const revenueCurrent = revenueAt(currentPrice);
  const revenueRecommended = revenueAt(recommendedPrice);
  const revenueDelta = revenueRecommended - revenueCurrent;

  // Confidence: more observed sales and modest moves -> tighter estimate.
  // The seeded noise term is intentionally wide so a realistic portfolio mixes
  // low-, medium-, and high-confidence recommendations across rows.
  const confidenceScore = Math.round(
    clampValue(
      40 + soldPct * 0.42 + (daysRemaining > 5 ? 4 : 0) - Math.abs(deltaPct) * 0.45 + (rng() - 0.5) * 34,
      15,
      96,
    ),
  );
  const confidenceTier = confidenceTierFor(confidenceScore);

  const intervalHalfWidth = Math.round(
    Math.abs(revenueDelta) * (0.22 + (95 - confidenceScore) / 130) + remaining * 0.6,
  );

  const sellthroughCurrentPct = round(
    clampValue(soldPct + expectedSellFraction * (100 - soldPct), soldPct, 99.5),
    1,
  );
  const sellthroughShiftPts = round(
    clampValue(-direction * Math.abs(deltaPct) * elasticityMagnitude * 0.3, -12, 12),
    1,
  );
  const sellthroughRecommendedPct = round(
    clampValue(sellthroughCurrentPct + sellthroughShiftPts, 0, 99.9),
    1,
  );
  const selloutShiftDays = round(
    clampValue(direction * Math.abs(deltaPct) * elasticityMagnitude * 0.12, -10, 10),
    1,
  );

  const drivers = buildDrivers(rng, { ...input, soldPct, ticketsRemaining: remaining, daysRemaining }, direction, elasticity);

  const model: ModelMetadata = {
    refreshedLabel: `${4 + Math.floor(rng() * 38)} min ago`,
    comparablesUsed: 9 + Math.floor(rng() * 16),
    backtestMapePct: round(4.2 + rng() * 4.4, 1),
    trainingWindowDays: 120 + Math.floor(rng() * 4) * 30,
  };

  return {
    key,
    currentPrice,
    recommendedPrice,
    deltaPct,
    priceFloor,
    priceCeiling,
    guardrailNote,
    confidenceScore,
    confidenceTier,
    elasticity,
    impact: {
      revenueCurrent,
      revenueRecommended,
      revenueDelta,
      revenueDeltaLow: revenueDelta - intervalHalfWidth,
      revenueDeltaHigh: revenueDelta + intervalHalfWidth,
      sellthroughCurrentPct,
      sellthroughRecommendedPct,
      selloutShiftDays,
    },
    drivers,
    demandCurve,
    optimalPrice,
    model,
  };
}

export interface RecommendationSummary {
  count: number;
  totalDelta: number;
  totalDeltaLow: number;
  totalDeltaHigh: number;
  /** Revenue-weighted average confidence across recommendations. */
  weightedConfidence: number;
  tierCounts: Record<ConfidenceTier, number>;
  model: ModelMetadata | null;
}

export function summarizeRecommendations(
  recommendations: SeatGroupRecommendation[],
): RecommendationSummary {
  if (recommendations.length === 0) {
    return {
      count: 0,
      totalDelta: 0,
      totalDeltaLow: 0,
      totalDeltaHigh: 0,
      weightedConfidence: 0,
      tierCounts: { high: 0, medium: 0, low: 0 },
      model: null,
    };
  }

  let totalDelta = 0;
  let totalDeltaLow = 0;
  let totalDeltaHigh = 0;
  let weightSum = 0;
  let weightedScoreSum = 0;
  const tierCounts: Record<ConfidenceTier, number> = { high: 0, medium: 0, low: 0 };

  for (const rec of recommendations) {
    totalDelta += rec.impact.revenueDelta;
    totalDeltaLow += rec.impact.revenueDeltaLow;
    totalDeltaHigh += rec.impact.revenueDeltaHigh;
    const weight = Math.max(1, Math.abs(rec.impact.revenueDelta));
    weightSum += weight;
    weightedScoreSum += rec.confidenceScore * weight;
    tierCounts[rec.confidenceTier] += 1;
  }

  return {
    count: recommendations.length,
    totalDelta,
    totalDeltaLow,
    totalDeltaHigh,
    weightedConfidence: Math.round(weightedScoreSum / weightSum),
    tierCounts,
    model: recommendations[0].model,
  };
}

/**
 * Deterministic mock-event generator for the Portfolio Reporting page.
 * Produces 28 fully-populated events across venues, categories, health bands
 * and metric distributions. Seeded RNG ensures stable values across renders.
 *
 * Only outputs fields defined in PortfolioEvent — no excess property errors.
 */

import type { PortfolioEvent } from "@/components/PortfolioReporting/useFilteredEvents";

// ---------------------------------------------------------------------------
// Seeded RNG
// ---------------------------------------------------------------------------

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function clamp(v: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, v));
}

function r1(v: number) {
  return Math.round(v * 10) / 10;
}

// ---------------------------------------------------------------------------
// Reference pools
// ---------------------------------------------------------------------------

const SPORTS_NAMES = [
  "Los Angeles Lakers vs. Dallas Mavericks",
  "Golden State Warriors vs. San Antonio Spurs",
  "Chicago Bulls vs. Milwaukee Bucks",
  "Miami Heat vs. Philadelphia 76ers",
  "Boston Celtics vs. Toronto Raptors",
  "Phoenix Suns vs. Denver Nuggets",
  "Brooklyn Nets vs. Detroit Pistons",
  "Portland Trail Blazers vs. Oklahoma City Thunder",
  "Indiana Pacers vs. Orlando Magic",
  "Memphis Grizzlies vs. Sacramento Kings",
];

const FILM_NAMES = [
  "The Dark Knight — Film Screening",
  "Interstellar — IMAX Experience",
  "Inception — Midnight Screening",
  "Oppenheimer — Film Screening",
  "Dune: Part Two — Preview Night",
  "Avatar — Extended Cut",
  "Tenet — Director's Screening",
  "2001: A Space Odyssey",
  "Blade Runner 2049 — Special Screening",
  "The Matrix — 25th Anniversary",
];

const FILM_LIVE_NAMES = [
  "Harry Potter and the Sorcerer's Stone",
  "Harry Potter and the Chamber of Secrets",
  "The Lord of the Rings: Fellowship — Live Score",
  "Star Wars: A New Hope — Live Orchestra",
  "Jurassic Park — Live Score",
  "Home Alone — Holiday Orchestra",
];

const VENUES = ["Los Angeles", "Cleveland", "Atlanta", "Dallas", "Chicago", "New York"];

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

interface TimeSlot { label: string; hour: number }
const TIMES: TimeSlot[] = [
  { label: "12:00 PM", hour: 12 },
  { label: "2:00 PM",  hour: 14 },
  { label: "3:00 PM",  hour: 15 },
  { label: "6:00 PM",  hour: 18 },
  { label: "7:00 PM",  hour: 19 },
  { label: "7:30 PM",  hour: 19.5 },
  { label: "8:00 PM",  hour: 20 },
];

const PRICE_TIERS: Record<string, string[]> = {
  Sports:           ["GSC S3", "GSC S2", "GSC E3", "GSC E2", "GSC Club"],
  Film:             ["GSC E3", "GSC E2", "GSC S3", "GSC S2"],
  "Film + Live Score": ["GSC E2", "GSC E3", "GSC S2", "MTRX Floor"],
};

// ---------------------------------------------------------------------------
// Inventory/ATP profiles per category
// ---------------------------------------------------------------------------

interface Profile {
  domeInv: number; hallInv: number; gaInv: number;
  domeAtp: number; hallAtp: number; gaAtp: number;
}

const PROFILES: Record<string, Profile> = {
  Sports:           { domeInv: 3200, hallInv: 2000, gaInv: 1400, domeAtp: 48, hallAtp: 37, gaAtp: 23 },
  Film:             { domeInv: 2800, hallInv: 1800, gaInv: 1200, domeAtp: 42, hallAtp: 33, gaAtp: 20 },
  "Film + Live Score": { domeInv: 2600, hallInv: 1600, gaInv: 1100, domeAtp: 52, hallAtp: 41, gaAtp: 26 },
};

// ---------------------------------------------------------------------------
// Health bands (4 bands × N events)
// ---------------------------------------------------------------------------

interface Band {
  health: [number, number];
  soldPct: [number, number];
  funnelVsExp: [number, number];
  fcrVsExp: [number, number];
  attention: boolean;
}

const BANDS: Band[] = [
  { health: [12, 34], soldPct: [24, 46], funnelVsExp: [-28, -8],  fcrVsExp: [-18, -4], attention: true  },
  { health: [36, 58], soldPct: [44, 64], funnelVsExp: [-12,  2],  fcrVsExp: [-8,   4], attention: false },
  { health: [60, 76], soldPct: [58, 78], funnelVsExp: [-4,   9],  fcrVsExp: [-3,   9], attention: false },
  { health: [78, 96], soldPct: [74, 97], funnelVsExp: [5,   24],  fcrVsExp: [8,   26], attention: false },
];

// 28 events: 4 critical, 7 warning, 9 monitor, 8 on-track
const BAND_SEQ = [0,0,0,0, 1,1,1,1,1,1,1, 2,2,2,2,2,2,2,2,2, 3,3,3,3,3,3,3,3];

// Category sequence: 10 Sports, 12 Film, 6 Film+Live
const CAT_SEQ = [
  "Sports","Sports","Sports","Sports","Sports","Sports","Sports","Sports","Sports","Sports",
  "Film","Film","Film","Film","Film","Film","Film","Film","Film","Film","Film","Film",
  "Film + Live Score","Film + Live Score","Film + Live Score","Film + Live Score","Film + Live Score","Film + Live Score",
];

function pick<T>(arr: T[], r: () => number): T {
  return arr[Math.floor(r() * arr.length)];
}

function between(lo: number, hi: number, r: () => number): number {
  return lo + r() * (hi - lo);
}

// ---------------------------------------------------------------------------
// Main generator — deterministic, stable across renders
// ---------------------------------------------------------------------------

export function generatePortfolioEvents(): PortfolioEvent[] {
  const events: PortfolioEvent[] = [];

  for (let i = 0; i < 28; i++) {
    const r = mulberry32(0xdeadbeef + i * 0x9e3779b9);
    const category = CAT_SEQ[i];
    const band = BANDS[BAND_SEQ[i]];
    const prof = PROFILES[category];

    const namePool = category === "Sports" ? SPORTS_NAMES : category === "Film" ? FILM_NAMES : FILM_LIVE_NAMES;
    const eventName = namePool[i % namePool.length];
    const venue = VENUES[i % VENUES.length];
    const weekday = pick(WEEKDAYS, r);
    const time = pick(TIMES, r);
    const tier = pick(PRICE_TIERS[category], r);

    // Spread events −90 days to +90 days around today
    const base = new Date();
    base.setHours(0, 0, 0, 0);
    base.setDate(base.getDate() - 90 + Math.floor(i * 6.5) + Math.floor(r() * 4));
    const startTimeValue = base.valueOf() + time.hour * 3_600_000;

    const isActive = startTimeValue > Date.now();
    const daysRemaining = isActive ? Math.max(1, Math.round((startTimeValue - Date.now()) / 86_400_000)) : null;
    const daysInMarket = isActive ? Math.round(between(8, 55, r)) : null;

    // Health & sell-through
    const health = Math.round(between(band.health[0], band.health[1], r));
    const soldPct = isActive ? clamp(Math.round(between(band.soldPct[0], band.soldPct[1], r)), 0, 99) : null;

    // Inventory (±10% jitter around profile)
    const domeInv = Math.round(prof.domeInv * (0.9 + r() * 0.2));
    const hallInv = Math.round(prof.hallInv * (0.9 + r() * 0.2));
    const gaInv   = Math.round(prof.gaInv   * (0.9 + r() * 0.2));

    // ATP with ±14% jitter
    const domeAtp = isActive ? r1(prof.domeAtp * (0.86 + r() * 0.28)) : null;
    const hallAtp = isActive ? r1(prof.hallAtp * (0.86 + r() * 0.28)) : null;
    const gaAtp   = isActive ? r1(prof.gaAtp   * (0.86 + r() * 0.28)) : null;

    // Sold counts
    const spct = soldPct ?? 0;
    const domeSold = isActive ? Math.round(domeInv * (spct / 100) * (0.94 + r() * 0.12)) : null;
    const hallSold = isActive ? Math.round(hallInv * (spct / 100) * (0.92 + r() * 0.12)) : null;
    const gaSold   = isActive ? Math.round(gaInv   * (spct / 100) * (0.88 + r() * 0.16)) : null;

    // Projected final sell-through
    const projFinalPct = isActive ? clamp(spct + Math.round(between(3, 18, r)), spct, 100) : null;
    const domeSoldProjected = isActive ? Math.round(domeInv * (projFinalPct! / 100)) : null;
    const hallSoldProjected = isActive ? Math.round(hallInv * (projFinalPct! / 100)) : null;
    const hallSoldPct = isActive && hallSold !== null ? Math.round((hallSold / hallInv) * 100) : null;

    // Revenue (computed with internal gaAtp — not stored on PortfolioEvent)
    const netTicketRevenue = isActive
      ? Math.round((domeSold ?? 0) * (domeAtp ?? 0) + (hallSold ?? 0) * (hallAtp ?? 0) + (gaSold ?? 0) * (gaAtp ?? 0))
      : null;

    const varFactor = 1 + (band.funnelVsExp[0] < 0
      ? between(-0.18, -0.02, r)
      : between(-0.04, 0.14, r));
    const projectedNetRevenue = netTicketRevenue !== null ? Math.round(netTicketRevenue / varFactor) : null;
    const optimizedProjected  = projectedNetRevenue !== null ? Math.round(projectedNetRevenue * (1.08 + r() * 0.14)) : null;

    // Funnel
    const tof = isActive ? Math.round(between(7_800, 24_500, r)) : null;
    const funnelEntriesVsExpectedPct = isActive ? Math.round(between(band.funnelVsExp[0], band.funnelVsExp[1], r)) : null;
    const fcrPct = isActive ? r1(between(2.6, 8.0, r)) : null;
    const fcrVsExpectedPct = isActive ? Math.round(between(band.fcrVsExp[0], band.fcrVsExp[1], r)) : null;

    events.push({
      id: `port-${String(i + 1).padStart(3, "0")}`,
      event: eventName,
      eventCategory: category,
      venueName: venue,
      startTimeValue,
      weekdayLabel: weekday,
      localStartTimeLabel: time.label,
      daysInMarket: isActive ? daysInMarket : null,
      daysRemaining: isActive ? daysRemaining : null,
      soldPct,
      eventHealth: health,
      priceTier: tier,
      status: isActive ? "On Sale" : "Completed",
      attention: band.attention ? "underperforming" : null,
      netTicketRevenue,
      projectedNetRevenue,
      optimizedProjected,
      tof,
      funnelEntriesVsExpectedPct,
      fcrPct,
      fcrVsExpectedPct,
      domeAtp,
      hallAtp,
      domeSold,
      hallSold,
      domeSoldProjected,
      hallSoldProjected,
      domeProjectedSellthroughPct: projFinalPct,
      hallSoldPct,
    });
  }

  return events;
}

// Deterministic mock generators for portfolio-level metrics not present in EventRecord.

import type { PortfolioEvent } from "./useFilteredEvents";

function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function rng(seed: number) {
  let a = seed;
  return () => { a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
function clamp(v: number, lo: number, hi: number) { return Math.min(hi, Math.max(lo, v)); }

// ---------------------------------------------------------------------------
// Per-event ROAS (Return on Ad Spend)
// ---------------------------------------------------------------------------

export interface EventRoasRow {
  id: string;
  event: string;
  adSpend: number;
  roas: number;
  roasVsExpected: number; // delta from 5.0x baseline
}

export function deriveRoas(events: PortfolioEvent[]): EventRoasRow[] {
  return events
    .filter((e) => e.netTicketRevenue !== null && e.netTicketRevenue > 0)
    .map((e) => {
      const r = rng(hashStr(e.id + ":roas"));
      // Ad spend: 12–22% of actual revenue, health-adjusted (poor health → higher spend)
      const healthFactor = 1 + ((100 - (e.eventHealth ?? 70)) / 100) * 0.4;
      const spendRate = clamp(0.12 + r() * 0.10, 0.12, 0.28) * healthFactor;
      const adSpend = Math.round((e.netTicketRevenue ?? 0) * spendRate);
      const rawRoas = adSpend > 0 ? (e.netTicketRevenue ?? 0) / adSpend : 0;
      const roas = Math.round(rawRoas * 10) / 10;
      return {
        id: e.id,
        event: e.event,
        adSpend,
        roas,
        roasVsExpected: Math.round((roas - 5.0) * 10) / 10,
      };
    });
}

// ---------------------------------------------------------------------------
// Aggregate marketing & site metrics
// ---------------------------------------------------------------------------

export interface MarketingMetrics {
  totalSessions: number;
  sessionsVsExpectedPct: number;
  avgCtr: number;          // checkout initiation rate %
  avgConversionRate: number; // purchase conversion %
  emailsSent: number;
  emailOpenRate: number;
  emailClickRate: number;
  topSource: string;
  topSourceSharePct: number;
  directPct: number;
  organicPct: number;
  paidPct: number;
  emailPct: number;
  socialPct: number;
}

export function deriveMarketingMetrics(events: PortfolioEvent[]): MarketingMetrics {
  const active = events.filter((e) => e.tof !== null);
  if (active.length === 0) {
    return {
      totalSessions: 0, sessionsVsExpectedPct: 0, avgCtr: 0, avgConversionRate: 0,
      emailsSent: 0, emailOpenRate: 0, emailClickRate: 0,
      topSource: "Direct", topSourceSharePct: 0,
      directPct: 0, organicPct: 0, paidPct: 0, emailPct: 0, socialPct: 0,
    };
  }

  // Sessions ≈ TOF × 3 (TOF is checkout page entries; site sessions upstream)
  const totalSessions = active.reduce((s, e) => s + (e.tof ?? 0) * 3, 0);
  const avgFunnelVsExp = active.reduce((s, e) => s + (e.funnelEntriesVsExpectedPct ?? 0), 0) / active.length;
  const avgFcr = active.reduce((s, e) => s + (e.fcrPct ?? 0), 0) / active.length;

  // Emails ≈ 8× sessions (list size >> sessions)
  const emailsSent = Math.round(totalSessions * 0.6);

  // Channel mix — stable across filter changes
  const r = rng(hashStr(active.map((e) => e.id).join(":")));
  const directPct = Math.round(28 + r() * 8);
  const organicPct = Math.round(22 + r() * 6);
  const paidPct = Math.round(24 + r() * 8);
  const emailPct = Math.round(14 + r() * 6);
  const socialPct = 100 - directPct - organicPct - paidPct - emailPct;

  const sources = [
    { label: "Direct", pct: directPct },
    { label: "Organic", pct: organicPct },
    { label: "Paid", pct: paidPct },
    { label: "Email", pct: emailPct },
    { label: "Social", pct: Math.max(0, socialPct) },
  ];
  const top = sources.reduce((a, b) => (b.pct > a.pct ? b : a));

  return {
    totalSessions: Math.round(totalSessions),
    sessionsVsExpectedPct: Math.round(avgFunnelVsExp),
    avgCtr: Math.round(clamp(avgFcr * 3.8, 8, 35) * 10) / 10,
    avgConversionRate: Math.round(avgFcr * 10) / 10,
    emailsSent,
    emailOpenRate: Math.round((22 + r() * 12) * 10) / 10,
    emailClickRate: Math.round((3.2 + r() * 3) * 10) / 10,
    topSource: top.label,
    topSourceSharePct: top.pct,
    directPct,
    organicPct,
    paidPct,
    emailPct,
    socialPct: Math.max(0, socialPct),
  };
}

// ---------------------------------------------------------------------------
// Dome vs. Hall aggregate summary
// ---------------------------------------------------------------------------

export interface SectionSummary {
  label: string;
  totalSold: number;
  totalProjected: number;
  sellThroughPct: number;
  avgAtp: number;
  totalRevenue: number;
  eventCount: number;
}

export interface DomeHallSummaryModel {
  dome: SectionSummary;
  hall: SectionSummary;
  domeSharePct: number;
  hallSharePct: number;
}

export function deriveDomeHallSummary(events: PortfolioEvent[]): DomeHallSummaryModel {
  const domeEvents = events.filter((e) => e.domeSold !== null && e.domeAtp !== null);
  const hallEvents = events.filter((e) => e.hallSold !== null && e.hallAtp !== null);

  function summarize(evts: PortfolioEvent[], label: string, soldKey: keyof PortfolioEvent, projKey: keyof PortfolioEvent, atpKey: keyof PortfolioEvent): SectionSummary {
    const totalSold = evts.reduce((s, e) => s + ((e[soldKey] as number | null) ?? 0), 0);
    const totalProj = evts.reduce((s, e) => s + ((e[projKey] as number | null) ?? 0), 0);
    const atps = evts.map((e) => (e[atpKey] as number | null) ?? 0).filter((v) => v > 0);
    const avgAtp = atps.length > 0 ? atps.reduce((s, v) => s + v, 0) / atps.length : 0;
    return {
      label,
      totalSold,
      totalProjected: totalProj,
      sellThroughPct: totalProj > 0 ? Math.round((totalSold / totalProj) * 100) : 0,
      avgAtp: Math.round(avgAtp * 10) / 10,
      totalRevenue: Math.round(totalSold * avgAtp),
      eventCount: evts.length,
    };
  }

  const dome = summarize(domeEvents, "Dome", "domeSold", "domeSoldProjected", "domeAtp");
  const hall = summarize(hallEvents, "Hall", "hallSold", "hallSoldProjected", "hallAtp");
  const combined = dome.totalRevenue + hall.totalRevenue;

  return {
    dome,
    hall,
    domeSharePct: combined > 0 ? Math.round((dome.totalRevenue / combined) * 100) : 0,
    hallSharePct: combined > 0 ? Math.round((hall.totalRevenue / combined) * 100) : 0,
  };
}

// ---------------------------------------------------------------------------
// Seat-group breakdowns by venue (sell-through + ATP)
//
// Seat groups run premium (S) to general admission (GA); both metrics decline
// down that ladder, so the generators anchor on the venue's real aggregate and
// fan out deterministically from it.
// ---------------------------------------------------------------------------

export const SEAT_GROUPS = ["S", "A", "B", "C", "D", "E", "F", "G", "H", "GA"] as const;
export type SeatGroup = (typeof SEAT_GROUPS)[number];

export interface SeatGroupVenueSeries {
  venue: string;
  values: { seatGroup: SeatGroup; value: number }[];
}

function venuesOf(events: PortfolioEvent[]): string[] {
  return Array.from(new Set(events.map((e) => e.venueName))).sort();
}

export function deriveSeatGroupSellThrough(events: PortfolioEvent[]): SeatGroupVenueSeries[] {
  return venuesOf(events).flatMap((venue) => {
    // Only events that actually reported a sell-through. Counting a null as 0
    // would drag a venue's whole ladder to the floor whenever its in-window
    // events are all past or unpublished.
    const sold = events
      .filter((e) => e.venueName === venue)
      .map((e) => e.soldPct)
      .filter((v): v is number => v !== null);
    if (sold.length === 0) return [];

    const base = sold.reduce((s, v) => s + v, 0) / sold.length;
    const r = rng(hashStr(`${venue}:st`));
    return [{
      venue,
      values: SEAT_GROUPS.map((seatGroup, i) => {
        // Premium tiers clear faster; GA trails well behind.
        const tierFactor = 1.25 - (i / (SEAT_GROUPS.length - 1)) * 0.95;
        return {
          seatGroup,
          value: Math.round(clamp(base * tierFactor * (0.8 + r() * 0.45), 2, 70)),
        };
      }),
    }];
  });
}

export function deriveSeatGroupAtp(events: PortfolioEvent[]): SeatGroupVenueSeries[] {
  return venuesOf(events).flatMap((venue) => {
    const domeAtps = events
      .filter((e) => e.venueName === venue)
      .map((e) => e.domeAtp)
      .filter((v): v is number => v !== null);
    // No priced events in window — drawing a default ladder here would invent
    // a price structure for a venue we have nothing on.
    if (domeAtps.length === 0) return [];

    const base = domeAtps.reduce((s, v) => s + v, 0) / domeAtps.length;
    const r = rng(hashStr(`${venue}:atp`));
    return [{
      venue,
      values: SEAT_GROUPS.map((seatGroup, i) => {
        // Price ladder: S commands a large premium, GA is the floor.
        const tierFactor = 1.9 - (i / (SEAT_GROUPS.length - 1)) * 1.78;
        return {
          seatGroup,
          value: Math.round(clamp(base * tierFactor * (0.9 + r() * 0.2), 8, 200)),
        };
      }),
    }];
  });
}

// ---------------------------------------------------------------------------
// Year-over-year cohort comparisons
// ---------------------------------------------------------------------------

export interface YoYPoint {
  /** Days from the start of the window. */
  t: number;
  value: number | null;
}

export interface YoYSeries {
  id: string;
  label: string;
  points: YoYPoint[];
}

export interface YoYModel {
  priorCohort: YoYSeries;
  currentCohort: YoYSeries;
  /** Index of "today" along the shared axis, for the marker line. */
  todayIndex: number;
  points: number;
}

/**
 * Two cohorts on a shared day axis. The current cohort stops at "today" — the
 * rest of its season has not happened yet — which is what makes the dashed
 * marker meaningful.
 */
function buildYoY(
  seed: string,
  startValue: number,
  endValue: number,
  volatility: number,
  points = 40,
): YoYModel {
  const todayIndex = Math.round(points * 0.62);

  const series = (id: string, label: string, scale: number, truncateAt: number | null): YoYSeries => {
    const r = rng(hashStr(`${seed}:${id}`));
    return {
      id,
      label,
      points: Array.from({ length: points }, (_, i) => {
        if (truncateAt !== null && i > truncateAt) return { t: i, value: null };
        const progress = i / (points - 1);
        const trend = startValue + (endValue - startValue) * Math.pow(progress, 0.7);
        const noise = (r() - 0.5) * volatility * (1 - progress * 0.55);
        return { t: i, value: Math.max(0, (trend + noise) * scale) };
      }),
    };
  };

  return {
    priorCohort: series("prior", "2025 Q3 – 2026 Q1", 1, null),
    currentCohort: series("current", "2026 Q3 – 2027 Q1", 0.88, todayIndex),
    todayIndex,
    points,
  };
}

export function deriveDomeAtpYoY(events: PortfolioEvent[]): YoYModel {
  const atps = events.map((e) => e.domeAtp).filter((v): v is number => v !== null);
  const avg = atps.length > 0 ? atps.reduce((s, v) => s + v, 0) / atps.length : 120;
  return buildYoY("dome-atp", avg * 1.75, avg * 0.95, avg * 0.5);
}

export function deriveFunnelConversionYoY(events: PortfolioEvent[]): YoYModel {
  const fcrs = events.map((e) => e.fcrPct).filter((v): v is number => v !== null);
  const avg = fcrs.length > 0 ? fcrs.reduce((s, v) => s + v, 0) / fcrs.length : 3;
  return buildYoY("funnel-conv", avg * 1.9, avg * 0.8, avg * 0.5);
}

// ---------------------------------------------------------------------------
// Tickets by order source
// ---------------------------------------------------------------------------

export interface OrderSourceSlice {
  id: string;
  label: string;
  tickets: number;
  pctOfTotal: number;
  color: string;
}

export interface OrderSourceModel {
  slices: OrderSourceSlice[];
  /** Net of refunds — matches the figure in the donut centre. */
  totalTickets: number;
}

// Tints of the app's primary (hue 240) for the sales channels, with refunds
// picked out in the destructive red since they subtract from the total.
const ORDER_SOURCE_SHARES = [
  { id: "web", label: "Web", share: 0.715, color: "hsl(240 52% 48%)" },
  { id: "guest-service", label: "Guest Service", share: 0.181, color: "hsl(240 47% 63%)" },
  { id: "mobile", label: "Mobile", share: 0.144, color: "hsl(240 42% 78%)" },
  { id: "refund", label: "Refund", share: -0.04, color: "hsl(0 62% 46%)" },
];

export function deriveOrderSource(events: PortfolioEvent[]): OrderSourceModel {
  const gross = events.reduce((s, e) => {
    const revenue = e.netTicketRevenue ?? 0;
    const atp = e.domeAtp ?? 60;
    return s + (atp > 0 ? Math.round(revenue / atp) : 0);
  }, 0);
  const scale = Math.max(1, gross);

  const slices = ORDER_SOURCE_SHARES.map((s) => ({
    id: s.id,
    label: s.label,
    tickets: Math.round(scale * s.share),
    pctOfTotal: Math.round(s.share * 1000) / 10,
    color: s.color,
  }));

  return { slices, totalTickets: slices.reduce((s, x) => s + x.tickets, 0) };
}

// ---------------------------------------------------------------------------
// Guest-service tickets by venue
// ---------------------------------------------------------------------------

export interface GuestServiceRow {
  venue: string;
  ticketsSold: number;
  ticketRevenue: number;
}

export function deriveGuestServiceByVenue(events: PortfolioEvent[]): GuestServiceRow[] {
  return venuesOf(events).map((venue) => {
    const forVenue = events.filter((e) => e.venueName === venue);
    const revenue = forVenue.reduce((s, e) => s + (e.netTicketRevenue ?? 0), 0);
    const r = rng(hashStr(`${venue}:gs`));
    const share = 0.1 + r() * 0.1;
    const gsRevenue = Math.round(revenue * share);
    const atp = forVenue[0]?.domeAtp ?? 70;
    return {
      venue,
      ticketsSold: Math.max(0, Math.round(gsRevenue / Math.max(1, atp))),
      ticketRevenue: gsRevenue,
    };
  });
}

// ---------------------------------------------------------------------------
// Summary by venue & category
// ---------------------------------------------------------------------------

export interface SummaryRow {
  id: string;
  name: string;
  eventCount: number;
  funnelSessions: number;
  funnelConvPct: number;
  ticketsSold: number;
  atp: number;
  domeAtp: number;
  domeStPct: number;
  ticketRevenue: number;
  budget: number;
}

function summarise(id: string, name: string, rows: PortfolioEvent[], withBudget: boolean): SummaryRow {
  const r = rng(hashStr(`${id}:summary`));
  const ticketRevenue = rows.reduce((s, e) => s + (e.netTicketRevenue ?? 0), 0);
  const funnelSessions = rows.reduce((s, e) => s + (e.tof ?? 0), 0);
  const domeAtps = rows.map((e) => e.domeAtp).filter((v): v is number => v !== null);
  const domeAtp = domeAtps.length > 0 ? domeAtps.reduce((s, v) => s + v, 0) / domeAtps.length : 0;
  const atp = domeAtp > 0 ? domeAtp * (0.6 + r() * 0.2) : 0;
  const soldPcts = rows.map((e) => e.soldPct).filter((v): v is number => v !== null);

  return {
    id,
    name,
    eventCount: rows.length,
    funnelSessions: Math.round(funnelSessions),
    funnelConvPct: Math.round((2 + r() * 2.5) * 10) / 10,
    ticketsSold: atp > 0 ? Math.round(ticketRevenue / atp) : 0,
    atp: Math.round(atp),
    domeAtp: Math.round(domeAtp),
    domeStPct:
      soldPcts.length > 0
        ? Math.round((soldPcts.reduce((s, v) => s + v, 0) / soldPcts.length) * 10) / 10
        : 0,
    ticketRevenue: Math.round(ticketRevenue),
    // Categories are tracked against the venues that host them, so they carry
    // no budget line of their own.
    budget: withBudget ? Math.round(ticketRevenue * (1.6 + r() * 0.6)) : 0,
  };
}

export interface VenueCategorySummaryModel {
  venues: SummaryRow[];
  total: SummaryRow;
  categories: SummaryRow[];
}

export function deriveVenueCategorySummary(events: PortfolioEvent[]): VenueCategorySummaryModel {
  const venues = venuesOf(events).map((v) =>
    summarise(v, v, events.filter((e) => e.venueName === v), true),
  );
  const categories = Array.from(new Set(events.map((e) => e.eventCategory)))
    .sort()
    .map((c) => summarise(c, c, events.filter((e) => e.eventCategory === c), false));

  const total = summarise("total", "Total", events, true);
  return { venues, total, categories };
}

// ---------------------------------------------------------------------------
// Low dome sell-through watchlist
// ---------------------------------------------------------------------------

export interface LowSellThroughRow {
  id: string;
  event: string;
  venue: string;
  startTime: string;
  dayOfWeek: string;
  totalTickets: number;
  gsTickets: number;
  domeTickets: number;
  domeStPct: number;
  domeAtp: number;
  l3dDomeTickets: number;
  targetTof: number;
  funnelSessions: number;
  funnelConvPct: number;
}

const LOW_ST_THRESHOLD = 60;

/**
 * Upcoming events whose dome sell-through is lagging, worst first.
 *
 * The window is 45 days rather than the fortnight a live system would use:
 * the mock pool spreads 28 events over 180 days, so a 14-day slice holds about
 * two events and the watchlist reads empty. Narrow this once the event density
 * is realistic.
 */
export function deriveLowSellThroughEvents(
  events: PortfolioEvent[],
  withinDays = 45,
): LowSellThroughRow[] {
  const now = Date.now();
  const horizon = now + withinDays * 86_400_000;

  return events
    .filter(
      (e) =>
        e.startTimeValue >= now &&
        e.startTimeValue <= horizon &&
        (e.soldPct ?? 100) < LOW_ST_THRESHOLD,
    )
    .map((e) => {
      const r = rng(hashStr(`${e.id}:lowst`));
      const domeTickets = e.domeSold ?? Math.round((e.soldPct ?? 0) * 3);
      const gsTickets = Math.round(domeTickets * r() * 0.4);
      return {
        id: e.id,
        event: e.event,
        venue: e.venueName,
        startTime: new Date(e.startTimeValue).toISOString().slice(0, 16).replace("T", " "),
        dayOfWeek: e.weekdayLabel,
        totalTickets: domeTickets + gsTickets,
        gsTickets,
        domeTickets,
        domeStPct: e.soldPct ?? 0,
        domeAtp: Math.round(e.domeAtp ?? 0),
        l3dDomeTickets: Math.round(domeTickets * (0.05 + r() * 0.25)),
        targetTof: Math.round(e.tof ?? 0),
        funnelSessions: Math.round((e.tof ?? 0) * (0.03 + r() * 0.1)),
        funnelConvPct: Math.round((e.fcrPct ?? 0) * 10) / 10,
      };
    })
    .sort((a, b) => a.domeStPct - b.domeStPct);
}

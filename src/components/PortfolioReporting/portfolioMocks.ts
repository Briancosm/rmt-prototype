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

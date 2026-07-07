import { useMemo } from "react";
import { resolveDateRange, type EventStatusFilter, type ReportingFilters } from "./types";

/** Minimal shape of EventRecord that the portfolio view needs. */
export interface PortfolioEvent {
  id: string;
  event: string;
  eventCategory: string;
  venueName: string;
  startTimeValue: number;
  weekdayLabel: string;
  localStartTimeLabel: string;
  daysRemaining: number | null;
  daysInMarket: number | null;
  soldPct: number | null;
  netTicketRevenue: number | null;
  projectedNetRevenue: number | null;
  optimizedProjected: number | null;
  eventHealth: number | null;
  funnelEntriesVsExpectedPct: number | null;
  fcrPct: number | null;
  fcrVsExpectedPct: number | null;
  tof: number | null;
  priceTier: string;
  status: "On Sale" | "Upcoming" | "Completed" | "Unpublished";
  attention: "underperforming" | null;
  // Dome / Hall breakdown
  domeAtp: number | null;
  hallAtp: number | null;
  domeSold: number | null;
  hallSold: number | null;
  domeSoldProjected: number | null;
  hallSoldProjected: number | null;
  domeProjectedSellthroughPct: number | null;
  hallSoldPct: number | null;
}

function daypart(localTimeLabel: string): string {
  const parts = localTimeLabel.split(/[:\s]/);
  let hour = parseInt(parts[0], 10);
  const period = parts[parts.length - 1]?.toLowerCase();
  if (period === "pm" && hour !== 12) hour += 12;
  if (period === "am" && hour === 12) hour = 0;
  if (hour < 12) return "Morning";
  if (hour < 17) return "Afternoon";
  return "Evening";
}

function eventStatus(event: PortfolioEvent): EventStatusFilter {
  const now = Date.now();
  if (event.startTimeValue < now) return "past";
  if (event.status === "On Sale") return "active";
  return "upcoming";
}

export function useFilteredEvents(
  events: PortfolioEvent[],
  filters: ReportingFilters,
): PortfolioEvent[] {
  return useMemo(() => {
    const { from, to } = resolveDateRange(
      filters.datePreset,
      filters.customDateFrom,
      filters.customDateTo,
    );

    return events.filter((ev) => {
      if (from !== null && ev.startTimeValue < from) return false;
      if (to !== null && ev.startTimeValue > to) return false;
      if (filters.locations.length > 0 && !filters.locations.includes(ev.venueName)) return false;
      if (filters.categories.length > 0 && !filters.categories.includes(ev.eventCategory)) return false;
      if (filters.dayParts.length > 0) {
        const dp = daypart(ev.localStartTimeLabel);
        if (!filters.dayParts.includes(dp)) return false;
      }
      if (filters.daysOfWeek.length > 0 && !filters.daysOfWeek.includes(ev.weekdayLabel)) return false;
      if (filters.priceTiers.length > 0 && !filters.priceTiers.includes(ev.priceTier)) return false;
      if (filters.eventStatus !== "all") {
        if (eventStatus(ev) !== filters.eventStatus) return false;
      }
      return true;
    });
  }, [events, filters]);
}

export interface PortfolioKpis {
  totalEvents: number;
  totalRevenue: number;
  totalExpectedRevenue: number;
  totalVariance: number;
  variancePct: number;
  avgSoldPct: number;
  avgExpectedSoldPct: number;
  eventsOnTrack: number;
  eventsAtRisk: number;
  pricingOpportunity: number;
  pricingOpportunityEventCount: number;
  projectedRevenue: number;
}

export function derivePortfolioKpis(events: PortfolioEvent[]): PortfolioKpis {
  const n = events.length;
  if (n === 0) {
    return {
      totalEvents: 0,
      totalRevenue: 0,
      totalExpectedRevenue: 0,
      totalVariance: 0,
      variancePct: 0,
      avgSoldPct: 0,
      avgExpectedSoldPct: 0,
      eventsOnTrack: 0,
      eventsAtRisk: 0,
      pricingOpportunity: 0,
      pricingOpportunityEventCount: 0,
      projectedRevenue: 0,
    };
  }

  const active = events.filter((e) => e.netTicketRevenue !== null && e.projectedNetRevenue !== null);
  const totalRevenue = active.reduce((s, e) => s + (e.netTicketRevenue ?? 0), 0);
  const totalExpectedRevenue = active.reduce((s, e) => s + (e.projectedNetRevenue ?? 0), 0);
  const totalVariance = totalRevenue - totalExpectedRevenue;
  const variancePct =
    totalExpectedRevenue !== 0
      ? Math.round((totalVariance / totalExpectedRevenue) * 100)
      : 0;

  const soldActive = events.filter((e) => e.soldPct !== null);
  const avgSoldPct =
    soldActive.length > 0
      ? Math.round(soldActive.reduce((s, e) => s + (e.soldPct ?? 0), 0) / soldActive.length)
      : 0;

  // Expected sell-through: approximate from projected vs optimized ratio
  const avgExpectedSoldPct = Math.min(100, Math.round(avgSoldPct * 1.07));

  let eventsOnTrack = 0;
  let eventsAtRisk = 0;
  let pricingOpportunity = 0;
  let pricingOpportunityEventCount = 0;

  for (const ev of active) {
    const actual = ev.netTicketRevenue ?? 0;
    const expected = ev.projectedNetRevenue ?? 0;
    if (expected === 0) continue;
    const varPct = (actual - expected) / expected;
    if (Math.abs(varPct) <= 0.05) eventsOnTrack++;
    if (varPct < -0.10) eventsAtRisk++;
    const upside = (ev.optimizedProjected ?? 0) - (ev.projectedNetRevenue ?? 0);
    if (upside > 0) {
      pricingOpportunity += upside;
      pricingOpportunityEventCount++;
    }
  }

  return {
    totalEvents: n,
    totalRevenue,
    totalExpectedRevenue,
    totalVariance,
    variancePct,
    avgSoldPct,
    avgExpectedSoldPct,
    eventsOnTrack,
    eventsAtRisk,
    pricingOpportunity,
    pricingOpportunityEventCount,
    projectedRevenue: totalExpectedRevenue,
  };
}

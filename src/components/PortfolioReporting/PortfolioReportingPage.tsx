import { useMemo, useState } from "react";

import { EMPTY_FILTERS, type ReportingFilters } from "./types";
import { FilterBar } from "./FilterBar";
import { KpiStrip } from "./KpiStrip";
import { TrendingTable } from "./TrendingTable";
import { MarketingSiteMetrics } from "./MarketingSiteMetrics";
import { DomeHallSummary } from "./DomeHallSummary";
import { SeatGroupVenueChart } from "./SeatGroupVenueChart";
import { YoYComparisonChart } from "./YoYComparisonChart";
import { OrderSourceDonut, GuestServiceTable } from "./OrderSourcePanel";
import { VenueCategorySummary } from "./VenueCategorySummary";
import { LowSellThroughTable } from "./LowSellThroughTable";
import { useFilteredEvents, derivePortfolioKpis, type PortfolioEvent } from "./useFilteredEvents";
import {
  deriveRoas,
  deriveMarketingMetrics,
  deriveDomeHallSummary,
  deriveSeatGroupSellThrough,
  deriveSeatGroupAtp,
  deriveDomeAtpYoY,
  deriveFunnelConversionYoY,
  deriveOrderSource,
  deriveGuestServiceByVenue,
  deriveVenueCategorySummary,
  deriveLowSellThroughEvents,
} from "./portfolioMocks";

interface PortfolioReportingPageProps {
  events: PortfolioEvent[];
}

export function PortfolioReportingPage({ events }: PortfolioReportingPageProps) {
  const [filters, setFilters] = useState<ReportingFilters>(EMPTY_FILTERS);

  const locations = useMemo(() => Array.from(new Set(events.map((e) => e.venueName))).sort(), [events]);
  const categories = useMemo(() => Array.from(new Set(events.map((e) => e.eventCategory))).sort(), [events]);
  const priceTiers = useMemo(() => Array.from(new Set(events.map((e) => e.priceTier).filter(Boolean))).sort(), [events]);

  const filtered = useFilteredEvents(events, filters);
  const kpis = useMemo(() => derivePortfolioKpis(filtered), [filtered]);
  const roasRows = useMemo(() => deriveRoas(filtered), [filtered]);
  const marketingMetrics = useMemo(() => deriveMarketingMetrics(filtered), [filtered]);
  const domeHallModel = useMemo(() => deriveDomeHallSummary(filtered), [filtered]);
  const seatGroupSellThrough = useMemo(() => deriveSeatGroupSellThrough(filtered), [filtered]);
  const seatGroupAtp = useMemo(() => deriveSeatGroupAtp(filtered), [filtered]);
  const domeAtpYoY = useMemo(() => deriveDomeAtpYoY(filtered), [filtered]);
  const funnelConversionYoY = useMemo(() => deriveFunnelConversionYoY(filtered), [filtered]);
  const orderSource = useMemo(() => deriveOrderSource(filtered), [filtered]);
  const guestServiceRows = useMemo(() => deriveGuestServiceByVenue(filtered), [filtered]);
  const venueCategorySummary = useMemo(() => deriveVenueCategorySummary(filtered), [filtered]);
  const lowSellThroughRows = useMemo(() => deriveLowSellThroughEvents(filtered), [filtered]);

  return (
    <div className="space-y-5">
      {/* Filter bar */}
      <section className="overflow-hidden rounded-lg border bg-card/95 shadow-sm">
        <div className="border-b px-4 py-2 sm:px-6">
          <p className="text-xs font-medium text-muted-foreground">Filters</p>
        </div>
        <FilterBar
          filters={filters}
          onChange={setFilters}
          locations={locations}
          categories={categories}
          priceTiers={priceTiers}
        />
      </section>

      {/* KPI strip */}
      <KpiStrip kpis={kpis} />

      <VenueCategorySummary model={venueCategorySummary} />

      {/* Trending table */}
      <TrendingTable events={filtered} roasRows={roasRows} />

      {/* Marketing + Dome/Hall — 2 col on wide screens */}
      <div className="grid gap-5 xl:grid-cols-2">
        <MarketingSiteMetrics metrics={marketingMetrics} />
        <DomeHallSummary model={domeHallModel} />
      </div>

      {/* Seat-group breakdowns */}
      <div className="grid gap-5 xl:grid-cols-2">
        <SeatGroupVenueChart
          title="Sell-Through by Seat Group & Venue"
          yLabel="Sell-Through Rate"
          series={seatGroupSellThrough}
          formatValue={(v) => `${Math.round(v)}%`}
        />
        <SeatGroupVenueChart
          title="ATP by Seat Group & Venue"
          yLabel="Average Ticket Price"
          series={seatGroupAtp}
          formatValue={(v) => `$${Math.round(v)}`}
        />
      </div>

      {/* Year-over-year cohort comparisons */}
      <div className="grid gap-5 xl:grid-cols-2">
        <YoYComparisonChart
          title="Dome ATP — YoY Comparison"
          model={domeAtpYoY}
          formatValue={(v) => `$${Math.round(v)}`}
        />
        <YoYComparisonChart
          title="Cumulative Funnel Conversion — YoY Comparison"
          model={funnelConversionYoY}
          formatValue={(v) => `${v.toFixed(1)}%`}
        />
      </div>

      {/* Order source + guest service */}
      <div className="grid gap-5 xl:grid-cols-2">
        <OrderSourceDonut model={orderSource} />
        <GuestServiceTable rows={guestServiceRows} />
      </div>

      <LowSellThroughTable rows={lowSellThroughRows} />
    </div>
  );
}

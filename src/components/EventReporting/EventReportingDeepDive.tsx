import { useRef } from "react";

import type { ReportingEventInput } from "@/mocks/eventReportingData";
import { ChannelAttribution } from "./ChannelAttribution";
import { ComparableEventsAnalysis } from "./ComparableEventsAnalysis";
import { EventFunnelBreakdown } from "./EventFunnelBreakdown";
import { EventHeader } from "./EventHeader";
import { PricePerformanceComparison } from "./PricePerformanceComparison";
import { SalesPaceAnalysis } from "./SalesPaceAnalysis";
import { VarianceSummary } from "./VarianceSummary";

interface EventReportingDeepDiveProps {
  event: ReportingEventInput | undefined;
  onAdjustPricing?: () => void;
  onRunScenario?: () => void;
}

/**
 * Deep-dive analytics for a single event.
 *  - Phase 1: performance overview (header KPIs, sales pace, variance).
 *  - Phase 2: comparable events + price performance vs comps.
 * Later phases append funnel/channel and forecasting sections below.
 */
export function EventReportingDeepDive({
  event,
  onAdjustPricing,
  onRunScenario,
}: EventReportingDeepDiveProps) {
  const comparablesRef = useRef<HTMLDivElement>(null);

  if (!event) {
    return (
      <section className="rounded-xl border bg-background p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Event not found. Select an event to view its reporting deep-dive.
        </p>
      </section>
    );
  }

  const scrollToComparables = () =>
    comparablesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="space-y-6">
      <EventHeader
        event={event}
        onAdjustPricing={onAdjustPricing}
        onViewComparables={scrollToComparables}
        onRunScenario={onRunScenario}
      />

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <SalesPaceAnalysis event={event} />
        <VarianceSummary event={event} />
      </div>

      <div ref={comparablesRef} className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <ComparableEventsAnalysis event={event} />
        <PricePerformanceComparison event={event} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <EventFunnelBreakdown event={event} />
        <ChannelAttribution event={event} />
      </div>
    </div>
  );
}

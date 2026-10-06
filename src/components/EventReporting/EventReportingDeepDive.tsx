import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

import {
  generateMarketingChannels,
  type ReportingEventInput,
} from "@/mocks/eventReportingData";
import { ChannelAttribution } from "./ChannelAttribution";
import { ComparableEventsAnalysis } from "./ComparableEventsAnalysis";
import { EventFunnelBreakdown } from "./EventFunnelBreakdown";
import { EventHeader } from "./EventHeader";
import { MarketingChannelSection } from "./MarketingChannelSection";
import { PricePerformanceComparison } from "./PricePerformanceComparison";
import { SalesPaceAnalysis } from "./SalesPaceAnalysis";
import { VarianceSummary } from "./VarianceSummary";

interface EventReportingDeepDiveProps {
  event: ReportingEventInput | undefined;
  /** Pre-existing dashboard panels, folded into their matching band. */
  performanceSlot?: ReactNode;
  demandSlot?: ReactNode;
}

const SECTIONS = [
  { id: "performance", label: "Performance" },
  { id: "marketing", label: "Marketing" },
  { id: "attribution", label: "Attribution" },
  { id: "pricing", label: "Pricing" },
] as const;

/**
 * Height the sticky tab bar occupies. Band headings are considered "reached"
 * once they pass under it, and `scroll-mt` keeps them clear of it on jump.
 */
const NAV_OFFSET = 72;

/**
 * Where the spy considers a band "reached". Deliberately a few pixels below
 * NAV_OFFSET: a jump lands the band at exactly NAV_OFFSET, so testing against
 * that same value puts the comparison on a boundary that sub-pixel layout
 * (observed: 72.15) decides, leaving the indicator one band behind.
 */
const SPY_THRESHOLD = NAV_OFFSET + 4;

/**
 * Deep-dive analytics for a single event, grouped into four bands. Panels that
 * predate the banding are passed in as slots from the dashboard rather than
 * moved, so their chart state and handlers stay where they're defined.
 */
export function EventReportingDeepDive({
  event,
  performanceSlot,
  demandSlot,
}: EventReportingDeepDiveProps) {
  const comparablesRef = useRef<HTMLDivElement>(null);
  const marketing = useMemo(
    () => (event ? generateMarketingChannels(event) : []),
    [event],
  );

  const [activeSection, setActiveSection] = useState<string>(SECTIONS[0].id);
  // Pins the indicator to the clicked band while its smooth scroll is in
  // flight, so it doesn't rewind through the bands being passed on the way.
  const scrollLockRef = useRef(false);
  const lockTimerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    // Measured synchronously rather than inside requestAnimationFrame: rAF is
    // suspended while the tab is backgrounded, which would leave the indicator
    // stuck on whichever band was active when the tab lost visibility.
    const measure = () => {
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;

      // The last band starts below max scroll, so it can never reach the bar;
      // bottom-of-page counts as reaching it.
      let current: string = SECTIONS[0].id;
      if (atBottom) {
        current = SECTIONS[SECTIONS.length - 1].id;
      } else {
        for (const section of SECTIONS) {
          const el = document.getElementById(section.id);
          if (el && el.getBoundingClientRect().top <= SPY_THRESHOLD) {
            current = section.id;
          }
        }
      }

      setActiveSection((prev) => (prev === current ? prev : current));
    };

    const onScroll = () => {
      if (scrollLockRef.current) {
        // Smooth-scroll duration scales with distance and isn't knowable up
        // front, so hold the lock until scroll events actually stop rather
        // than guessing a timeout that a long jump would outlive.
        window.clearTimeout(lockTimerRef.current);
        lockTimerRef.current = window.setTimeout(() => {
          scrollLockRef.current = false;
          measure();
        }, 150);
        return;
      }
      measure();
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.clearTimeout(lockTimerRef.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const jumpTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    setActiveSection(id);
    scrollLockRef.current = true;
    // Clicking the already-active band scrolls nowhere and fires no scroll
    // event, so the lock needs a fallback release of its own.
    window.clearTimeout(lockTimerRef.current);
    lockTimerRef.current = window.setTimeout(() => {
      scrollLockRef.current = false;
    }, 400);
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  if (!event) {
    return (
      <section className="rounded-lg border bg-background p-8 text-center">
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
      <EventHeader event={event} onViewComparables={scrollToComparables} />

      <nav
        className="sticky top-0 z-30 -mx-4 flex gap-1 overflow-x-auto border-b bg-card/95 px-4 py-2 backdrop-blur supports-[backdrop-filter]:bg-card/85 sm:-mx-6 sm:px-6"
        aria-label="Report sections"
      >
        {SECTIONS.map((section) => {
          const active = activeSection === section.id;
          return (
            <button
              key={section.id}
              type="button"
              onClick={() => jumpTo(section.id)}
              aria-current={active ? "true" : undefined}
              className={cn(
                "relative shrink-0 rounded-md px-4 py-2.5 text-sm font-semibold transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              {section.label}
              <span
                className={cn(
                  "absolute inset-x-3 -bottom-2 h-0.5 rounded-full transition-colors",
                  active ? "bg-primary" : "bg-transparent",
                )}
              />
            </button>
          );
        })}
      </nav>

      <BandHeading
        id="performance"
        title="Performance & Pacing"
        hint="How this event is tracking against where it was expected to be."
      />
      <div className="space-y-6">
        <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
          <SalesPaceAnalysis event={event} />
          <VarianceSummary event={event} />
        </div>
        {performanceSlot}
      </div>

      <BandHeading
        id="marketing"
        title="Marketing"
        hint="Channels that drove traffic to the event, measured before any sale happened."
      />
      <div className="space-y-6">
        {demandSlot}
        {marketing.map((model) => (
          <MarketingChannelSection key={model.id} model={model} />
        ))}
      </div>

      <BandHeading
        id="attribution"
        title="Sales Attribution"
        hint="Where completed purchases actually came from, once demand converted."
      />
      <div className="grid gap-6 xl:grid-cols-2">
        <EventFunnelBreakdown event={event} />
        <ChannelAttribution event={event} />
      </div>

      <BandHeading
        id="pricing"
        title="Pricing"
        hint="What seats are priced at today, how that compares to similar events, and what to change."
      />
      <div ref={comparablesRef} className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <ComparableEventsAnalysis event={event} />
        <PricePerformanceComparison event={event} />
      </div>
    </div>
  );
}

/**
 * Band titles sit a level above the panels they contain, so they are set
 * larger than the panel headings inside them (text-lg) rather than smaller,
 * and given extra top space so arriving at one reads as entering a section.
 */
function BandHeading({ id, title, hint }: { id: string; title: string; hint?: string }) {
  return (
    <div id={id} className="scroll-mt-[72px] border-b-2 border-border pb-3 pt-4">
      <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
        {title}
      </h2>
      {hint && <p className="mt-1 text-sm text-muted-foreground">{hint}</p>}
    </div>
  );
}

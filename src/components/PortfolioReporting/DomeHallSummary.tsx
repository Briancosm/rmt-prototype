import { cn } from "@/lib/utils";
import type { DomeHallSummaryModel, SectionSummary } from "./portfolioMocks";

interface DomeHallSummaryProps {
  model: DomeHallSummaryModel;
}

function fmtUsd(v: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: v >= 1_000_000 ? "compact" : "standard",
    maximumFractionDigits: v >= 1_000_000 ? 1 : 0,
  }).format(v);
}

export function DomeHallSummary({ model }: DomeHallSummaryProps) {
  const noData = model.dome.eventCount === 0 && model.hall.eventCount === 0;

  return (
    <section className="overflow-hidden rounded-lg border bg-card/95 shadow-sm">
      <div className="border-b px-4 py-3 sm:px-5">
        <h3 className="text-sm font-semibold text-foreground">Dome vs. Hall Summary</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">Aggregate ticket sales by section across filtered events</p>
      </div>

      {noData ? (
        <div className="px-5 py-10 text-center text-sm text-muted-foreground">No section data in selection.</div>
      ) : (
        <div className="divide-y">
          {/* Revenue share bar */}
          <div className="px-4 py-4 sm:px-5">
            <p className="mb-2 text-xs font-medium text-muted-foreground">Revenue Share</p>
            <div className="flex h-5 overflow-hidden rounded-full">
              <div
                className="h-full bg-primary"
                style={{ width: `${model.domeSharePct}%` }}
                title={`Dome: ${model.domeSharePct}%`}
              />
              <div
                className="h-full bg-success"
                style={{ width: `${model.hallSharePct}%` }}
                title={`Hall: ${model.hallSharePct}%`}
              />
            </div>
            <div className="mt-2 flex gap-5 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-primary" />Dome {model.domeSharePct}%</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-success" />Hall {model.hallSharePct}%</span>
            </div>
          </div>

          {/* Side-by-side section cards */}
          <div className="grid grid-cols-2 gap-px bg-border/50">
            <SectionCard section={model.dome} color="text-primary" barColor="bg-primary" />
            <SectionCard section={model.hall} color="text-success" barColor="bg-success" />
          </div>
        </div>
      )}
    </section>
  );
}

function SectionCard({ section, color, barColor }: { section: SectionSummary; color: string; barColor: string }) {
  return (
    <div className="bg-card px-4 py-4 sm:px-5">
      <p className={cn("text-xs font-semibold", color)}>{section.label}</p>
      <p className="mt-0.5 text-[10px] text-muted-foreground">{section.eventCount} event{section.eventCount !== 1 ? "s" : ""}</p>

      {/* Sell-through bar */}
      <div className="mt-3">
        <div className="flex items-end justify-between text-xs text-muted-foreground">
          <span>Sell-through</span>
          <span className={cn("font-semibold", color)}>{section.sellThroughPct}%</span>
        </div>
        <div className="mt-1 h-2 overflow-hidden rounded-full bg-secondary">
          <div
            className={cn("h-full rounded-full", barColor)}
            style={{ width: `${section.sellThroughPct}%` }}
            role="progressbar"
            aria-valuenow={section.sellThroughPct}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>

      <div className="mt-4 space-y-2.5">
        <Row label="Sold" value={section.totalSold.toLocaleString()} />
        <Row label="Projected" value={section.totalProjected.toLocaleString()} muted />
        <Row label="Avg ATP" value={`$${section.avgAtp}`} />
        <Row label="Total Revenue" value={fmtUsd(section.totalRevenue)} bold />
      </div>
    </div>
  );
}

function Row({ label, value, muted = false, bold = false }: { label: string; value: string; muted?: boolean; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={cn("text-xs tabular-nums", bold ? "font-semibold text-foreground" : muted ? "text-muted-foreground" : "text-foreground")}>
        {value}
      </span>
    </div>
  );
}

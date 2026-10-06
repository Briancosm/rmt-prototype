import { cn } from "@/lib/utils";
import type { SummaryRow, VenueCategorySummaryModel } from "./portfolioMocks";

function fmtUsd(v: number) {
  return v === 0 ? "$0" : `$${Math.round(v).toLocaleString()}`;
}

const COLUMNS: {
  id: keyof SummaryRow | "name";
  label: string;
  numeric?: boolean;
  format?: (row: SummaryRow) => string;
}[] = [
  { id: "name", label: "Name" },
  { id: "eventCount", label: "Event Count", numeric: true, format: (r) => r.eventCount.toLocaleString() },
  { id: "funnelSessions", label: "Funnel Sessions", numeric: true, format: (r) => r.funnelSessions.toLocaleString() },
  { id: "funnelConvPct", label: "Funnel Conv (%)", numeric: true, format: (r) => `${r.funnelConvPct}%` },
  { id: "ticketsSold", label: "Tickets Sold", numeric: true, format: (r) => r.ticketsSold.toLocaleString() },
  { id: "atp", label: "ATP ($)", numeric: true, format: (r) => fmtUsd(r.atp) },
  { id: "domeAtp", label: "Dome ATP ($)", numeric: true, format: (r) => fmtUsd(r.domeAtp) },
  { id: "domeStPct", label: "Dome ST (%)", numeric: true, format: (r) => `${r.domeStPct}%` },
  { id: "ticketRevenue", label: "Ticket Revenue ($)", numeric: true, format: (r) => fmtUsd(r.ticketRevenue) },
  { id: "budget", label: "Budget ($)", numeric: true, format: (r) => fmtUsd(r.budget) },
];

/**
 * Venues, their roll-up, then categories. Categories cut across the same
 * events as the venues, so they sit below the Total rather than inside it —
 * stacking them together would double-count.
 */
export function VenueCategorySummary({ model }: { model: VenueCategorySummaryModel }) {
  const renderRow = (row: SummaryRow, variant: "venue" | "total" | "category") => (
    <tr
      key={row.id}
      className={cn(
        "border-b transition-colors last:border-0",
        variant === "total"
          ? "bg-secondary/40 font-semibold"
          : "hover:bg-muted/20",
      )}
    >
      {COLUMNS.map((col) => (
        <td
          key={col.id}
          className={cn(
            "px-3 py-3 tabular-nums",
            col.numeric ? "text-right" : "text-left font-medium",
            col.id === "name" ? "text-foreground sm:pl-6" : "text-foreground",
          )}
        >
          {col.id === "name" ? row.name : col.format?.(row)}
        </td>
      ))}
    </tr>
  );

  return (
    <section className="overflow-hidden rounded-lg border bg-card/95 shadow-sm">
      <div className="border-b px-4 py-3 sm:px-6">
        <h3 className="font-heading text-lg font-semibold tracking-tight text-foreground">
          Summary by Venue &amp; Category
        </h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Venue roll-up, then the same events cut by category
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] border-collapse text-sm">
          <thead>
            <tr className="border-b bg-muted/30 text-left text-xs font-medium text-muted-foreground">
              {COLUMNS.map((col) => (
                <th
                  key={col.id}
                  className={cn(
                    "px-3 py-2.5 font-medium",
                    col.numeric && "text-right",
                    col.id === "name" && "sm:pl-6",
                  )}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {model.venues.map((r) => renderRow(r, "venue"))}
            {renderRow(model.total, "total")}
            {model.categories.map((r) => renderRow(r, "category"))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

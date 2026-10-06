import { cn } from "@/lib/utils";
import type { LowSellThroughRow } from "./portfolioMocks";

interface LowSellThroughTableProps {
  rows: LowSellThroughRow[];
  thresholdPct?: number;
  withinDays?: number;
}

/**
 * Watchlist of upcoming events whose dome sell-through is lagging, worst
 * first — the queue a pricing analyst works top-down.
 */
export function LowSellThroughTable({
  rows,
  thresholdPct = 60,
  withinDays = 45,
}: LowSellThroughTableProps) {
  return (
    <section className="overflow-hidden rounded-lg border bg-card/95 shadow-sm">
      <div className="border-b px-4 py-3 sm:px-6">
        <h3 className="font-heading text-lg font-semibold tracking-tight text-foreground">
          Low Dome Sell-Through Events
        </h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Next {withinDays} days, under {thresholdPct}% sold · {rows.length} event
          {rows.length === 1 ? "" : "s"} · worst first
        </p>
      </div>

      {rows.length === 0 ? (
        <div className="px-6 py-12 text-center">
          <p className="text-sm text-muted-foreground">
            No events under {thresholdPct}% sell-through in the next {withinDays} days.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1180px] border-collapse text-sm">
            <thead>
              <tr className="border-b bg-muted/30 text-left text-xs font-medium text-muted-foreground">
                <th className="px-4 py-2.5 font-medium sm:px-6">Event</th>
                <th className="px-3 py-2.5 font-medium">Venue</th>
                <th className="px-3 py-2.5 font-medium">Start Time</th>
                <th className="px-3 py-2.5 font-medium">Day of Week</th>
                <th className="px-3 py-2.5 text-right font-medium">Total Tickets</th>
                <th className="px-3 py-2.5 text-right font-medium">GS Tickets</th>
                <th className="px-3 py-2.5 text-right font-medium">Dome Tickets</th>
                <th className="px-3 py-2.5 text-right font-medium">Dome ST%</th>
                <th className="px-3 py-2.5 text-right font-medium">Dome ATP</th>
                <th className="px-3 py-2.5 text-right font-medium">L3D Dome</th>
                <th className="px-3 py-2.5 text-right font-medium">Target TOF</th>
                <th className="px-3 py-2.5 text-right font-medium">Funnel Sessions</th>
                <th className="px-3 py-2.5 text-right font-medium sm:pr-6">Funnel Conv.</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b transition-colors last:border-0 hover:bg-muted/20">
                  <td className="px-4 py-3 font-medium text-foreground sm:px-6">{r.event}</td>
                  <td className="px-3 py-3 text-muted-foreground">{r.venue}</td>
                  <td className="px-3 py-3 tabular-nums text-muted-foreground">{r.startTime}</td>
                  <td className="px-3 py-3 text-muted-foreground">{r.dayOfWeek}</td>
                  <td className="px-3 py-3 text-right tabular-nums text-foreground">
                    {r.totalTickets.toLocaleString()}
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums text-muted-foreground">
                    {r.gsTickets.toLocaleString()}
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums text-foreground">
                    {r.domeTickets.toLocaleString()}
                  </td>
                  <td
                    className={cn(
                      "px-3 py-3 text-right font-semibold tabular-nums",
                      r.domeStPct < thresholdPct ? "text-destructive" : "text-foreground",
                    )}
                  >
                    {r.domeStPct}%
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums text-foreground">
                    ${r.domeAtp.toFixed(2)}
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums text-muted-foreground">
                    {r.l3dDomeTickets.toLocaleString()}
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums text-muted-foreground">
                    {r.targetTof.toLocaleString()}
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums text-muted-foreground">
                    {r.funnelSessions.toLocaleString()}
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums text-muted-foreground sm:pr-6">
                    {r.funnelConvPct}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

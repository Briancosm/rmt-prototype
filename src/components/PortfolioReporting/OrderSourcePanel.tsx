import { cn } from "@/lib/utils";
import type { GuestServiceRow, OrderSourceModel } from "./portfolioMocks";

function fmtUsd(v: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: Math.abs(v) >= 1000 ? "compact" : "standard",
    maximumFractionDigits: Math.abs(v) >= 1000 ? 0 : 0,
  }).format(v);
}

export function OrderSourceDonut({ model }: { model: OrderSourceModel }) {
  const size = 260;
  const stroke = 46;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  // Refunds are negative, so the ring is laid out on absolute magnitudes —
  // otherwise a negative arc length would silently invert the segment.
  const magnitudeTotal = model.slices.reduce((s, x) => s + Math.abs(x.tickets), 0) || 1;

  let offset = 0;
  const segments = model.slices.map((s) => {
    const len = (Math.abs(s.tickets) / magnitudeTotal) * circumference;
    const seg = { ...s, dash: `${len} ${circumference - len}`, dashoffset: -offset };
    offset += len;
    return seg;
  });

  return (
    <section className="overflow-hidden rounded-lg border bg-card/95 shadow-sm">
      <div className="border-b px-4 py-3 sm:px-6">
        <h3 className="font-heading text-lg font-semibold tracking-tight text-foreground">
          Tickets by Order Source
        </h3>
      </div>

      {/* Centred as a unit — the legend sizes to its content, so without this
          the pair sits left with dead space across the rest of the panel. */}
      <div className="flex flex-col items-center justify-center gap-6 p-5 sm:flex-row sm:gap-8 sm:p-6">
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-full max-w-[260px] shrink-0"
          role="img"
          aria-label="Ticket distribution by order source"
        >
          <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
            {segments.map((seg) => (
              <circle
                key={seg.id}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth={stroke}
                strokeDasharray={seg.dash}
                strokeDashoffset={seg.dashoffset}
              />
            ))}
          </g>
          <text
            x={size / 2}
            y={size / 2 - 2}
            textAnchor="middle"
            fontSize="32"
            fontWeight="600"
            className="fill-foreground"
          >
            {model.totalTickets.toLocaleString()}
          </text>
          <text
            x={size / 2}
            y={size / 2 + 20}
            textAnchor="middle"
            fontSize="13"
            className="fill-muted-foreground"
          >
            net tickets
          </text>
        </svg>

        {/* Sized to its content rather than filling the panel, so each value
            sits beside its own label instead of against the far edge. */}
        <ul className="space-y-2 text-sm">
          {model.slices.map((s) => (
            <li key={s.id} className="flex items-center gap-3">
              <span
                className="h-3 w-3 shrink-0 rounded-sm"
                style={{ backgroundColor: s.color }}
              />
              <span className="w-[104px] shrink-0 text-foreground">{s.label}</span>
              <span
                className={cn(
                  "w-[118px] shrink-0 text-right tabular-nums",
                  s.tickets < 0 ? "text-destructive" : "text-muted-foreground",
                )}
              >
                {s.tickets.toLocaleString()} ({s.pctOfTotal}%)
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function GuestServiceTable({ rows }: { rows: GuestServiceRow[] }) {
  const totalTickets = rows.reduce((s, r) => s + r.ticketsSold, 0);
  const totalRevenue = rows.reduce((s, r) => s + r.ticketRevenue, 0);

  return (
    <section className="overflow-hidden rounded-lg border bg-card/95 shadow-sm">
      <div className="border-b px-4 py-3 sm:px-6">
        <h3 className="font-heading text-lg font-semibold tracking-tight text-foreground">
          Guest Service Tickets by Venue
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[380px] border-collapse text-sm">
          <thead>
            <tr className="border-b bg-muted/30 text-left text-xs font-medium text-muted-foreground">
              <th className="px-4 py-2.5 font-medium sm:px-6">Venue</th>
              <th className="px-3 py-2.5 text-right font-medium">Tickets Sold</th>
              <th className="px-3 py-2.5 text-right font-medium sm:pr-6">Ticket Revenue</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.venue} className="border-b transition-colors hover:bg-muted/20">
                <td className="px-4 py-3 text-foreground sm:px-6">{r.venue}</td>
                <td className="px-3 py-3 text-right tabular-nums text-foreground">
                  {r.ticketsSold.toLocaleString()}
                </td>
                <td className="px-3 py-3 text-right tabular-nums text-foreground sm:pr-6">
                  {fmtUsd(r.ticketRevenue)}
                </td>
              </tr>
            ))}
            <tr className="bg-secondary/30 font-semibold">
              <td className="px-4 py-3 text-foreground sm:px-6">Total</td>
              <td className="px-3 py-3 text-right tabular-nums text-foreground">
                {totalTickets.toLocaleString()}
              </td>
              <td className="px-3 py-3 text-right tabular-nums text-foreground sm:pr-6">
                {fmtUsd(totalRevenue)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

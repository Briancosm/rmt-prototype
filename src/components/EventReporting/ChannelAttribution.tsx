import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Lightbulb } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  formatUsd,
  generateChannelData,
  type ChannelSlice,
  type ReportingEventInput,
} from "@/mocks/eventReportingData";

interface ChannelAttributionProps {
  event: ReportingEventInput;
}

type SortKey = "label" | "tickets" | "pctOfTotal" | "avgPrice" | "repeatRate";

export function ChannelAttribution({ event }: ChannelAttributionProps) {
  const model = useMemo(() => generateChannelData(event), [event]);
  const [sortKey, setSortKey] = useState<SortKey>("tickets");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const sorted = useMemo(() => {
    const rows = [...model.slices];
    rows.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      const cmp =
        typeof av === "number" && typeof bv === "number"
          ? av - bv
          : String(av).localeCompare(String(bv));
      return sortDir === "asc" ? cmp : -cmp;
    });
    return rows;
  }, [model.slices, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "label" ? "asc" : "desc");
    }
  };

  return (
    <section
      className="rounded-lg border bg-background p-4 sm:p-5"
      aria-label="Channel and buyer-source attribution"
    >
      <div>
        <h3 className="font-heading text-lg font-semibold text-foreground">Channel Attribution</h3>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Ticket distribution by buyer source · {model.totalTickets.toLocaleString()} tickets
        </p>
      </div>

      <div className="mt-4 flex flex-col items-center gap-5 sm:flex-row sm:items-center">
        <Donut slices={model.slices} total={model.totalTickets} />

        <ul className="grid w-full grid-cols-2 gap-2 sm:flex-1">
          {model.slices.map((s) => (
            <li key={s.id} className="flex items-center gap-2 text-sm">
              <span className="h-3 w-3 shrink-0 rounded-sm" style={{ backgroundColor: s.color }} />
              <span className="text-foreground">{s.label}</span>
              <span className="ml-auto tabular-nums text-muted-foreground">{s.pctOfTotal}%</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Sortable table */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[460px] border-collapse text-sm">
          <thead>
            <tr className="border-b bg-muted/30 text-left text-xs font-medium text-muted-foreground">
              <SortableTh label="Channel" col="label" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
              <SortableTh label="Tickets" col="tickets" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} align="right" />
              <SortableTh label="% total" col="pctOfTotal" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} align="right" />
              <SortableTh label="Avg price" col="avgPrice" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} align="right" />
              <SortableTh label="Repeat %" col="repeatRate" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} align="right" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((s) => (
              <tr key={s.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                <td className="px-3 py-3">
                  <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: s.color }} />
                    <span className="font-medium text-foreground">{s.label}</span>
                  </span>
                </td>
                <td className="px-3 py-3 text-right tabular-nums text-foreground">
                  {s.tickets.toLocaleString()}
                </td>
                <td className="px-3 py-3 text-right tabular-nums text-muted-foreground">{s.pctOfTotal}%</td>
                <td className="px-3 py-3 text-right tabular-nums text-foreground">{formatUsd(s.avgPrice)}</td>
                <td className="px-3 py-3 text-right tabular-nums text-muted-foreground">{s.repeatRate}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-3">
        <div className="flex gap-2.5">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <p className="text-sm text-foreground">{model.insight}</p>
        </div>
      </div>
    </section>
  );
}

function Donut({ slices, total }: { slices: ChannelSlice[]; total: number }) {
  const size = 132;
  const stroke = 22;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;
  const segments = slices.map((s) => {
    const frac = total > 0 ? s.tickets / total : 0;
    const len = frac * circumference;
    const seg = { color: s.color, dash: `${len} ${circumference - len}`, dashoffset: -offset };
    offset += len;
    return seg;
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="shrink-0"
      role="img"
      aria-label="Donut chart of ticket distribution by channel"
    >
      <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="hsl(var(--secondary))" strokeWidth={stroke} />
        {segments.map((seg, i) => (
          <circle
            key={i}
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
      <text x={size / 2} y={size / 2 - 4} textAnchor="middle" className="fill-foreground text-lg font-semibold">
        {total.toLocaleString()}
      </text>
      <text x={size / 2} y={size / 2 + 12} textAnchor="middle" className="fill-muted-foreground text-[10px]">
        tickets
      </text>
    </svg>
  );
}

function SortableTh({
  label,
  col,
  sortKey,
  sortDir,
  onSort,
  align = "left",
}: {
  label: string;
  col: SortKey;
  sortKey: SortKey;
  sortDir: "asc" | "desc";
  onSort: (key: SortKey) => void;
  align?: "left" | "right";
}) {
  const active = sortKey === col;
  return (
    <th className={cn("px-3 py-2.5 font-medium", align === "right" && "text-right")}>
      <button
        type="button"
        onClick={() => onSort(col)}
        className={cn(
          "inline-flex items-center gap-1 hover:text-foreground",
          align === "right" && "flex-row-reverse",
          active && "text-foreground",
        )}
      >
        {label}
        {active &&
          (sortDir === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
      </button>
    </th>
  );
}

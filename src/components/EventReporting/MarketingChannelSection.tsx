import { useId, useState } from "react";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import type {
  MarketingChannelModel,
  MarketingColumn,
  MarketingRow,
} from "@/mocks/eventReportingData";
import { sparklinePath } from "./charts";

interface MarketingChannelSectionProps {
  model: MarketingChannelModel;
  /** Expanded on first render; the breakdown is the point of the module. */
  defaultOpen?: boolean;
}

const SPARK_W = 64;
const SPARK_H = 16;

/**
 * One demand-generation channel (Ads / Web / Email), shown as a single
 * roll-up row that folds open into its per-campaign, per-position or
 * per-audience breakdown. All three share this shape, so the table is driven
 * by the model's own columns rather than a layout hard-coded per channel.
 */
export function MarketingChannelSection({
  model,
  defaultOpen = true,
}: MarketingChannelSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const breakdownId = useId();

  return (
    <section
      className="overflow-hidden rounded-lg border bg-background"
      aria-label={`${model.label} marketing performance`}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] border-collapse text-sm">
          <thead>
            <tr className="border-b bg-muted/30 text-xs font-medium text-muted-foreground">
              <th scope="col" className="px-3 py-2.5 text-left font-medium">
                {model.label}
              </th>
              {model.columns.map((col) => (
                <ColumnHead key={col.id} col={col} />
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="bg-secondary/25">
              <th scope="row" className="px-3 py-3 text-left font-medium">
                <button
                  type="button"
                  onClick={() => setOpen((v) => !v)}
                  aria-expanded={open}
                  aria-controls={breakdownId}
                  className="flex items-center gap-1.5 rounded text-foreground transition-colors hover:text-primary"
                >
                  <ChevronRight
                    className={cn(
                      "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
                      open && "rotate-90",
                    )}
                  />
                  {model.summaryLabel}
                </button>
              </th>
              {model.columns.map((col) => (
                <ValueCell key={col.id} col={col} row={model.summary} emphasis />
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {open && (
        <div id={breakdownId} className="border-t bg-muted/10 px-3 py-4 sm:px-5">
          <p className="text-xs font-medium text-muted-foreground">
            {model.breakdownTitle}
          </p>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full min-w-[920px] border-collapse text-sm">
              <thead>
                <tr className="border-b text-xs font-medium text-muted-foreground">
                  <th scope="col" className="px-3 py-2.5 text-left font-medium">
                    {model.breakdownLabel}
                  </th>
                  {model.breakdownColumns.map((col) => (
                    <ColumnHead key={col.id} col={col} />
                  ))}
                </tr>
              </thead>
              <tbody>
                {model.rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-dashed transition-colors last:border-0 hover:bg-muted/30"
                  >
                    <th scope="row" className="px-3 py-3 text-left font-medium text-foreground">
                      {row.label}
                    </th>
                    {model.breakdownColumns.map((col) => (
                      <ValueCell key={col.id} col={col} row={row} />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}

function ColumnHead({ col }: { col: MarketingColumn }) {
  return (
    <th
      scope="col"
      className={cn("px-3 py-2.5 font-medium", col.numeric ? "text-right" : "text-left")}
    >
      {col.label}
    </th>
  );
}

function ValueCell({
  col,
  row,
  emphasis = false,
}: {
  col: MarketingColumn;
  row: MarketingRow;
  emphasis?: boolean;
}) {
  const value = row.values[col.id];
  return (
    <td
      className={cn(
        "px-3 py-3 tabular-nums",
        col.numeric ? "text-right" : "text-left",
        emphasis ? "font-medium text-foreground" : "text-muted-foreground",
      )}
    >
      {col.spark ? (
        <span className="flex items-center justify-end gap-2">
          <svg
            width={SPARK_W}
            height={SPARK_H}
            viewBox={`0 0 ${SPARK_W} ${SPARK_H}`}
            className="hidden shrink-0 overflow-visible text-primary sm:block"
            aria-hidden="true"
          >
            <path
              d={sparklinePath(row.series, SPARK_W, SPARK_H)}
              fill="none"
              stroke="currentColor"
              strokeWidth={1.25}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {value}
        </span>
      ) : (
        value
      )}
    </td>
  );
}

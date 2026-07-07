// Shared types for the portfolio-wide Reporting page.

export type DatePreset = "all" | "last30" | "last90" | "this-season" | "custom";
export type EventStatusFilter = "all" | "active" | "past" | "upcoming";

export interface ReportingFilters {
  datePreset: DatePreset;
  /** ISO strings for the custom range picker — empty string = unset. */
  customDateFrom: string;
  customDateTo: string;
  locations: string[];       // [] = all
  categories: string[];      // [] = all
  dayParts: string[];        // [] = all: "morning" | "afternoon" | "evening"
  daysOfWeek: string[];      // [] = all: "Monday" … "Sunday"
  priceTiers: string[];      // [] = all
  eventStatus: EventStatusFilter;
}

export const EMPTY_FILTERS: ReportingFilters = {
  datePreset: "all",
  customDateFrom: "",
  customDateTo: "",
  locations: [],
  categories: [],
  dayParts: [],
  daysOfWeek: [],
  priceTiers: [],
  eventStatus: "all",
};

export const DAY_PARTS = ["Morning", "Afternoon", "Evening"] as const;
export const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

/** Resolve a date preset to concrete millisecond bounds (UTC). */
export function resolveDateRange(
  preset: DatePreset,
  customFrom: string,
  customTo: string,
): { from: number | null; to: number | null } {
  const now = Date.now();
  const DAY = 86_400_000;

  if (preset === "all") return { from: null, to: null };
  if (preset === "custom") {
    return {
      from: customFrom ? new Date(customFrom + "T00:00:00").valueOf() : null,
      to: customTo ? new Date(customTo + "T23:59:59").valueOf() : null,
    };
  }
  if (preset === "last30") return { from: now - 30 * DAY, to: now + 30 * DAY };
  if (preset === "last90") return { from: now - 90 * DAY, to: now + 90 * DAY };
  // "this-season" — ±6 months from today
  return { from: now - 182 * DAY, to: now + 182 * DAY };
}

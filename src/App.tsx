import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Check,
  ChevronRight,
  MoreHorizontal,
  Pencil,
  Search,
  Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type EventStatus = "On Sale" | "Unpublished";
type AttentionFlag = "underperforming" | null;
type FilterValue = "all" | "attention" | "on-sale" | "unpublished";
type SortKey =
  | "event"
  | "startTime"
  | "domeAtp"
  | "recAtp"
  | "soldPct"
  | "daysRemaining"
  | "projectedRevenue"
  | "status";

type EventEditableField = "domeAtp" | "priceTier" | `seatGroup:${string}`;
type SeatGroupEditableField = "name" | "currentPrice";

type ViewRoute =
  | { type: "price-adjustment" }
  | { type: "seatmap"; eventId: string }
  | { type: "reporting"; eventId: string }
  | { type: "mvp-view" };

interface SeatGroup {
  id: string;
  name: string;
  originalPrice: number;
  currentPrice: number;
  recTicketPrice: number;
  soldPct: number;
  ticketsRemaining: number;
  projectedRevenue: number;
  yield: number;
}

interface EventRecord {
  id: string;
  event: string;
  eventCategory: string;
  venueName: string;
  startTimeLabel: string;
  startTimeValue: number;
  weekdayLabel: string;
  localStartTimeLabel: string;
  onSaleDateLabel: string;
  daysInMarket: number | null;
  salesWindowDays: number | null;
  programReleasePriceTier: string;
  programReleaseDomeAtp: number | null;
  priceTier: string;
  priceTierOptions: string[];
  eventHealth: number | null;
  domeAtp: number | null;
  hallAtp: number | null;
  gaAtp: number | null;
  recAtp: number | null;
  soldPct: number | null;
  domeProjectedSellthroughPct: number | null;
  domeSold: number | null;
  domeSoldProjected: number | null;
  hallSold: number | null;
  hallSoldProjected: number | null;
  gaSold: number | null;
  gaSoldProjected: number | null;
  hallSoldPct: number | null;
  daysRemaining: number | null;
  projectedRevenue: number | null;
  netTicketRevenue: number | null;
  projectedNetRevenue: number | null;
  optimizedProjected: number | null;
  tof: number | null;
  funnelEntriesVsExpectedPct: number | null;
  fcrPct: number | null;
  fcrVsExpectedPct: number | null;
  status: EventStatus;
  attention: AttentionFlag;
  seatGroups: SeatGroup[];
}

const initialEvents: EventRecord[] = [
  {
    id: "evt-001",
    event: "Los Angeles Lakers vs. Dallas Mavericks",
    eventCategory: "Sports",
    venueName: "Los Angeles",
    startTimeLabel: "10/21/25 2:00 PM",
    startTimeValue: new Date("2025-10-21T14:00:00").valueOf(),
    weekdayLabel: "Tuesday",
    localStartTimeLabel: "2:00 PM",
    onSaleDateLabel: "09/08/25",
    daysInMarket: 29,
    salesWindowDays: 43,
    programReleasePriceTier: "GSC S3",
    programReleaseDomeAtp: 41,
    priceTier: "GSC S3",
    priceTierOptions: ["GSC S3", "GSC S2", "GSC E3", "Not Set"],
    domeAtp: 45.3,
    eventHealth: 24,
    hallAtp: 36.5,
    gaAtp: 22.0,
    recAtp: 55,
    soldPct: 60,
    domeProjectedSellthroughPct: 60,
    domeSold: 1840,
    domeSoldProjected: 2100,
    hallSold: 1260,
    hallSoldProjected: 1450,
    gaSold: 980,
    gaSoldProjected: 1150,
    hallSoldPct: 60,
    daysRemaining: 14,
    projectedRevenue: 40000,
    netTicketRevenue: 15000,
    projectedNetRevenue: 15000,
    optimizedProjected: 17200,
    tof: 12450,
    funnelEntriesVsExpectedPct: -12,
    fcrPct: 4.5,
    fcrVsExpectedPct: 10,
    status: "On Sale",
    attention: "underperforming",
    seatGroups: [
      {
        id: "sg-1",
        name: "Sports A",
        originalPrice: 40,
        currentPrice: 45,
        recTicketPrice: 55,
        soldPct: 70,
        ticketsRemaining: 18,
        projectedRevenue: 400,
        yield: 250,
      },
      {
        id: "sg-2",
        name: "Sports B",
        originalPrice: 40,
        currentPrice: 50,
        recTicketPrice: 55,
        soldPct: 50,
        ticketsRemaining: 25,
        projectedRevenue: 400,
        yield: 250,
      },
      {
        id: "sg-3",
        name: "Sports C",
        originalPrice: 40,
        currentPrice: 45,
        recTicketPrice: 55,
        soldPct: 45,
        ticketsRemaining: 10,
        projectedRevenue: 400,
        yield: 250,
      },
      {
        id: "sg-4",
        name: "Sports D",
        originalPrice: 40,
        currentPrice: 45,
        recTicketPrice: 55,
        soldPct: 70,
        ticketsRemaining: 10,
        projectedRevenue: 400,
        yield: 250,
      },
      {
        id: "sg-5",
        name: "GA",
        originalPrice: 40,
        currentPrice: 45,
        recTicketPrice: 55,
        soldPct: 55,
        ticketsRemaining: 18,
        projectedRevenue: 400,
        yield: 250,
      },
    ],
  },
  {
    id: "evt-002",
    event: "Cleveland Cavaliers vs. Boston Celtics",
    eventCategory: "Sports",
    venueName: "Cleveland",
    startTimeLabel: "10/21/25 2:00 PM",
    startTimeValue: new Date("2025-10-21T14:00:00").valueOf(),
    weekdayLabel: "Tuesday",
    localStartTimeLabel: "2:00 PM",
    onSaleDateLabel: "09/08/25",
    daysInMarket: 29,
    salesWindowDays: 43,
    programReleasePriceTier: "GSC E3",
    programReleaseDomeAtp: 42.5,
    priceTier: "GSC E3",
    priceTierOptions: ["GSC E3", "GSC E2", "GSC Club", "Not Set"],
    domeAtp: 45.3,
    eventHealth: 72,
    hallAtp: 36.5,
    gaAtp: 22.0,
    recAtp: 55,
    soldPct: 60,
    domeProjectedSellthroughPct: 62,
    domeSold: 1920,
    domeSoldProjected: 2200,
    hallSold: 1180,
    hallSoldProjected: 1380,
    gaSold: 890,
    gaSoldProjected: 1050,
    hallSoldPct: 58,
    daysRemaining: 14,
    projectedRevenue: 40000,
    netTicketRevenue: 14850,
    projectedNetRevenue: 15425,
    optimizedProjected: 17800,
    tof: 13780,
    funnelEntriesVsExpectedPct: -6,
    fcrPct: 4.2,
    fcrVsExpectedPct: 6,
    status: "On Sale",
    attention: null,
    seatGroups: [
      {
        id: "sg-6",
        name: "Sports A",
        originalPrice: 38,
        currentPrice: 43,
        recTicketPrice: 51,
        soldPct: 64,
        ticketsRemaining: 20,
        projectedRevenue: 430,
        yield: 238,
      },
      {
        id: "sg-7",
        name: "Sports B",
        originalPrice: 39,
        currentPrice: 46,
        recTicketPrice: 52,
        soldPct: 58,
        ticketsRemaining: 22,
        projectedRevenue: 455,
        yield: 244,
      },
      {
        id: "sg-8",
        name: "Sports C",
        originalPrice: 36,
        currentPrice: 41,
        recTicketPrice: 49,
        soldPct: 49,
        ticketsRemaining: 15,
        projectedRevenue: 390,
        yield: 228,
      },
      {
        id: "sg-9",
        name: "Sports D",
        originalPrice: 40,
        currentPrice: 44,
        recTicketPrice: 53,
        soldPct: 62,
        ticketsRemaining: 12,
        projectedRevenue: 420,
        yield: 241,
      },
      {
        id: "sg-10",
        name: "GA",
        originalPrice: 35,
        currentPrice: 39,
        recTicketPrice: 47,
        soldPct: 54,
        ticketsRemaining: 28,
        projectedRevenue: 370,
        yield: 215,
      },
    ],
  },
  {
    id: "evt-003",
    event: "Atlanta Hawks vs. Miami Heat",
    eventCategory: "Sports",
    venueName: "Atlanta",
    startTimeLabel: "10/21/25 2:00 PM",
    startTimeValue: new Date("2025-10-21T14:00:00").valueOf(),
    weekdayLabel: "Tuesday",
    localStartTimeLabel: "2:00 PM",
    onSaleDateLabel: "09/08/25",
    daysInMarket: 29,
    salesWindowDays: 43,
    programReleasePriceTier: "GSC E3",
    programReleaseDomeAtp: 42.5,
    priceTier: "GSC E3",
    priceTierOptions: ["GSC E3", "GSC E2", "GSC Club", "Not Set"],
    domeAtp: 45.3,
    eventHealth: 86,
    hallAtp: 36.5,
    gaAtp: 22.0,
    recAtp: 52,
    soldPct: 83,
    domeProjectedSellthroughPct: 86,
    domeSold: 2650,
    domeSoldProjected: 2900,
    hallSold: 1580,
    hallSoldProjected: 1750,
    gaSold: 1320,
    gaSoldProjected: 1500,
    hallSoldPct: 79,
    daysRemaining: 14,
    projectedRevenue: 42200,
    netTicketRevenue: 18125,
    projectedNetRevenue: 17680,
    optimizedProjected: 19500,
    tof: 16890,
    funnelEntriesVsExpectedPct: 9,
    fcrPct: 5.1,
    fcrVsExpectedPct: 14,
    status: "On Sale",
    attention: null,
    seatGroups: [
      {
        id: "sg-11",
        name: "Sports A",
        originalPrice: 42,
        currentPrice: 49,
        recTicketPrice: 54,
        soldPct: 86,
        ticketsRemaining: 8,
        projectedRevenue: 470,
        yield: 282,
      },
      {
        id: "sg-12",
        name: "Sports B",
        originalPrice: 41,
        currentPrice: 47,
        recTicketPrice: 52,
        soldPct: 79,
        ticketsRemaining: 11,
        projectedRevenue: 445,
        yield: 270,
      },
      {
        id: "sg-13",
        name: "Sports C",
        originalPrice: 39,
        currentPrice: 46,
        recTicketPrice: 50,
        soldPct: 74,
        ticketsRemaining: 9,
        projectedRevenue: 430,
        yield: 261,
      },
      {
        id: "sg-14",
        name: "Sports D",
        originalPrice: 43,
        currentPrice: 48,
        recTicketPrice: 53,
        soldPct: 88,
        ticketsRemaining: 6,
        projectedRevenue: 490,
        yield: 289,
      },
      {
        id: "sg-15",
        name: "GA",
        originalPrice: 37,
        currentPrice: 44,
        recTicketPrice: 48,
        soldPct: 81,
        ticketsRemaining: 13,
        projectedRevenue: 410,
        yield: 249,
      },
    ],
  },
  {
    id: "evt-004",
    event: "Los Angeles Clippers vs. Phoenix Suns",
    eventCategory: "Sports",
    venueName: "Los Angeles",
    startTimeLabel: "10/21/25 2:00 PM",
    startTimeValue: new Date("2025-10-21T14:00:00").valueOf(),
    weekdayLabel: "Tuesday",
    localStartTimeLabel: "2:00 PM",
    onSaleDateLabel: "09/08/25",
    daysInMarket: 29,
    salesWindowDays: 43,
    programReleasePriceTier: "GSC E3",
    programReleaseDomeAtp: 42.5,
    priceTier: "GSC E3",
    priceTierOptions: ["GSC E3", "GSC E2", "GSC Club", "Not Set"],
    domeAtp: 45.3,
    eventHealth: 74,
    hallAtp: 36.5,
    gaAtp: 22.0,
    recAtp: 55,
    soldPct: 60,
    domeProjectedSellthroughPct: 64,
    domeSold: 1760,
    domeSoldProjected: 2050,
    hallSold: 1140,
    hallSoldProjected: 1320,
    gaSold: 870,
    gaSoldProjected: 1020,
    hallSoldPct: 57,
    daysRemaining: 14,
    projectedRevenue: 40000,
    netTicketRevenue: 15240,
    projectedNetRevenue: 15890,
    optimizedProjected: 18100,
    tof: 14210,
    funnelEntriesVsExpectedPct: 3,
    fcrPct: 4.6,
    fcrVsExpectedPct: 8,
    status: "On Sale",
    attention: null,
    seatGroups: [
      {
        id: "sg-16",
        name: "Sports A",
        originalPrice: 40,
        currentPrice: 44,
        recTicketPrice: 55,
        soldPct: 61,
        ticketsRemaining: 17,
        projectedRevenue: 405,
        yield: 236,
      },
      {
        id: "sg-17",
        name: "Sports B",
        originalPrice: 40,
        currentPrice: 45,
        recTicketPrice: 55,
        soldPct: 56,
        ticketsRemaining: 19,
        projectedRevenue: 415,
        yield: 242,
      },
      {
        id: "sg-18",
        name: "Sports C",
        originalPrice: 39,
        currentPrice: 43,
        recTicketPrice: 54,
        soldPct: 48,
        ticketsRemaining: 16,
        projectedRevenue: 395,
        yield: 231,
      },
      {
        id: "sg-19",
        name: "Sports D",
        originalPrice: 41,
        currentPrice: 46,
        recTicketPrice: 56,
        soldPct: 59,
        ticketsRemaining: 14,
        projectedRevenue: 425,
        yield: 246,
      },
      {
        id: "sg-20",
        name: "GA",
        originalPrice: 36,
        currentPrice: 40,
        recTicketPrice: 49,
        soldPct: 52,
        ticketsRemaining: 24,
        projectedRevenue: 380,
        yield: 220,
      },
    ],
  },
  {
    id: "evt-005",
    event: "Cleveland Browns vs. Pittsburgh Steelers",
    eventCategory: "Film + Live Score",
    venueName: "Cleveland",
    startTimeLabel: "10/31/25 2:00 PM",
    startTimeValue: new Date("2025-10-31T14:00:00").valueOf(),
    weekdayLabel: "Friday",
    localStartTimeLabel: "2:00 PM",
    onSaleDateLabel: "10/18/25",
    daysInMarket: null,
    salesWindowDays: 13,
    programReleasePriceTier: "Not Set",
    programReleaseDomeAtp: null,
    priceTier: "Not Set",
    priceTierOptions: ["MTRX Floor", "MTRX Balcony", "Not Set"],
    domeAtp: null,
    eventHealth: 18,
    hallAtp: null,
    gaAtp: null,
    recAtp: null,
    soldPct: null,
    domeProjectedSellthroughPct: null,
    domeSold: null,
    domeSoldProjected: null,
    hallSold: null,
    hallSoldProjected: null,
    gaSold: null,
    gaSoldProjected: null,
    hallSoldPct: null,
    daysRemaining: null,
    projectedRevenue: null,
    netTicketRevenue: null,
    projectedNetRevenue: null,
    optimizedProjected: null,
    tof: null,
    funnelEntriesVsExpectedPct: null,
    fcrPct: null,
    fcrVsExpectedPct: null,
    status: "Unpublished",
    attention: null,
    seatGroups: [
      {
        id: "sg-21",
        name: "Floor A",
        originalPrice: 32,
        currentPrice: 32,
        recTicketPrice: 36,
        soldPct: 18,
        ticketsRemaining: 42,
        projectedRevenue: 320,
        yield: 180,
      },
      {
        id: "sg-22",
        name: "Floor B",
        originalPrice: 30,
        currentPrice: 30,
        recTicketPrice: 35,
        soldPct: 15,
        ticketsRemaining: 38,
        projectedRevenue: 305,
        yield: 172,
      },
      {
        id: "sg-23",
        name: "Balcony A",
        originalPrice: 24,
        currentPrice: 24,
        recTicketPrice: 29,
        soldPct: 12,
        ticketsRemaining: 51,
        projectedRevenue: 260,
        yield: 149,
      },
      {
        id: "sg-24",
        name: "Balcony B",
        originalPrice: 22,
        currentPrice: 22,
        recTicketPrice: 27,
        soldPct: 10,
        ticketsRemaining: 56,
        projectedRevenue: 240,
        yield: 138,
      },
      {
        id: "sg-25",
        name: "GA",
        originalPrice: 20,
        currentPrice: 20,
        recTicketPrice: 24,
        soldPct: 8,
        ticketsRemaining: 60,
        projectedRevenue: 225,
        yield: 126,
      },
    ],
  },
  {
    id: "evt-006",
    event: "The Dark Knight — Film Screening",
    eventCategory: "Film",
    venueName: "Los Angeles",
    startTimeLabel: "11/07/25 7:30 PM",
    startTimeValue: new Date("2025-11-07T19:30:00").valueOf(),
    weekdayLabel: "Friday",
    localStartTimeLabel: "7:30 PM",
    onSaleDateLabel: "10/01/25",
    daysInMarket: 37,
    salesWindowDays: 37,
    programReleasePriceTier: "GSC E3",
    programReleaseDomeAtp: 38,
    priceTier: "GSC E3",
    priceTierOptions: ["GSC E3", "GSC E2", "GSC S3", "Not Set"],
    domeAtp: 42.1,
    hallAtp: 33.8,
    eventHealth: 79,
    gaAtp: 20.5,
    recAtp: 48,
    soldPct: 74,
    domeProjectedSellthroughPct: 78,
    domeSold: 2280,
    domeSoldProjected: 2600,
    hallSold: 1420,
    hallSoldProjected: 1650,
    gaSold: 1150,
    gaSoldProjected: 1340,
    hallSoldPct: 71,
    daysRemaining: 21,
    projectedRevenue: 36500,
    netTicketRevenue: 16200,
    projectedNetRevenue: 16800,
    optimizedProjected: 19300,
    tof: 15340,
    funnelEntriesVsExpectedPct: 5,
    fcrPct: 4.8,
    fcrVsExpectedPct: 12,
    status: "On Sale" as const,
    attention: null,
    seatGroups: [
      { id: "sg-26", name: "Orchestra", originalPrice: 48, currentPrice: 52, recTicketPrice: 58, soldPct: 82, ticketsRemaining: 10, projectedRevenue: 520, yield: 310 },
      { id: "sg-27", name: "Mezzanine", originalPrice: 40, currentPrice: 44, recTicketPrice: 50, soldPct: 76, ticketsRemaining: 14, projectedRevenue: 440, yield: 268 },
      { id: "sg-28", name: "Balcony", originalPrice: 32, currentPrice: 36, recTicketPrice: 42, soldPct: 68, ticketsRemaining: 20, projectedRevenue: 360, yield: 218 },
      { id: "sg-29", name: "GA", originalPrice: 25, currentPrice: 28, recTicketPrice: 34, soldPct: 70, ticketsRemaining: 18, projectedRevenue: 280, yield: 175 },
    ],
  },
  {
    id: "evt-007",
    event: "Interstellar — IMAX Experience",
    eventCategory: "Film",
    venueName: "Cleveland",
    startTimeLabel: "11/14/25 8:00 PM",
    startTimeValue: new Date("2025-11-14T20:00:00").valueOf(),
    weekdayLabel: "Friday",
    localStartTimeLabel: "8:00 PM",
    onSaleDateLabel: "10/10/25",
    daysInMarket: 35,
    salesWindowDays: 35,
    programReleasePriceTier: "GSC S2",
    programReleaseDomeAtp: 52,
    priceTier: "GSC S2",
    priceTierOptions: ["GSC S2", "GSC S3", "GSC E3", "Not Set"],
    domeAtp: 55.8,
    hallAtp: 44.5,
    eventHealth: 92,
    gaAtp: 28.0,
    recAtp: 62,
    soldPct: 88,
    domeProjectedSellthroughPct: 92,
    domeSold: 3100,
    domeSoldProjected: 3350,
    hallSold: 1870,
    hallSoldProjected: 2100,
    gaSold: 1540,
    gaSoldProjected: 1750,
    hallSoldPct: 85,
    daysRemaining: 28,
    projectedRevenue: 52000,
    netTicketRevenue: 24300,
    projectedNetRevenue: 25100,
    optimizedProjected: 28400,
    tof: 21600,
    funnelEntriesVsExpectedPct: 18,
    fcrPct: 6.2,
    fcrVsExpectedPct: 22,
    status: "On Sale" as const,
    attention: null,
    seatGroups: [
      { id: "sg-30", name: "IMAX Premium", originalPrice: 65, currentPrice: 70, recTicketPrice: 75, soldPct: 94, ticketsRemaining: 4, projectedRevenue: 700, yield: 420 },
      { id: "sg-31", name: "Orchestra", originalPrice: 52, currentPrice: 58, recTicketPrice: 64, soldPct: 89, ticketsRemaining: 8, projectedRevenue: 580, yield: 345 },
      { id: "sg-32", name: "Mezzanine", originalPrice: 44, currentPrice: 48, recTicketPrice: 55, soldPct: 85, ticketsRemaining: 11, projectedRevenue: 480, yield: 290 },
      { id: "sg-33", name: "Balcony", originalPrice: 35, currentPrice: 39, recTicketPrice: 46, soldPct: 80, ticketsRemaining: 16, projectedRevenue: 390, yield: 234 },
      { id: "sg-34", name: "GA", originalPrice: 28, currentPrice: 32, recTicketPrice: 38, soldPct: 82, ticketsRemaining: 12, projectedRevenue: 320, yield: 198 },
    ],
  },
  {
    id: "evt-008",
    event: "Jurassic Park — Film + Live Score",
    eventCategory: "Film + Live Score",
    venueName: "Atlanta",
    startTimeLabel: "11/21/25 7:00 PM",
    startTimeValue: new Date("2025-11-21T19:00:00").valueOf(),
    weekdayLabel: "Friday",
    localStartTimeLabel: "7:00 PM",
    onSaleDateLabel: "10/15/25",
    daysInMarket: 22,
    salesWindowDays: 37,
    programReleasePriceTier: "GSC E2",
    programReleaseDomeAtp: 46,
    priceTier: "GSC E2",
    priceTierOptions: ["GSC E2", "GSC E3", "GSC S3", "Not Set"],
    domeAtp: 49.5,
    hallAtp: 39.6,
    eventHealth: 22,
    gaAtp: 24.5,
    recAtp: 56,
    soldPct: 52,
    domeProjectedSellthroughPct: 58,
    domeSold: 1520,
    domeSoldProjected: 1850,
    hallSold: 960,
    hallSoldProjected: 1180,
    gaSold: 720,
    gaSoldProjected: 880,
    hallSoldPct: 48,
    daysRemaining: 35,
    projectedRevenue: 44200,
    netTicketRevenue: 12800,
    projectedNetRevenue: 14500,
    optimizedProjected: 16800,
    tof: 11900,
    funnelEntriesVsExpectedPct: -4,
    fcrPct: 3.9,
    fcrVsExpectedPct: 2,
    status: "On Sale" as const,
    attention: "underperforming" as const,
    seatGroups: [
      { id: "sg-35", name: "Orchestra", originalPrice: 55, currentPrice: 55, recTicketPrice: 62, soldPct: 58, ticketsRemaining: 22, projectedRevenue: 550, yield: 320 },
      { id: "sg-36", name: "Mezzanine", originalPrice: 45, currentPrice: 45, recTicketPrice: 52, soldPct: 50, ticketsRemaining: 28, projectedRevenue: 450, yield: 265 },
      { id: "sg-37", name: "Balcony", originalPrice: 35, currentPrice: 35, recTicketPrice: 42, soldPct: 44, ticketsRemaining: 32, projectedRevenue: 350, yield: 210 },
      { id: "sg-38", name: "GA", originalPrice: 28, currentPrice: 28, recTicketPrice: 34, soldPct: 48, ticketsRemaining: 26, projectedRevenue: 280, yield: 168 },
    ],
  },
  {
    id: "evt-009",
    event: "The Godfather — 55th Anniversary Screening",
    eventCategory: "Film",
    venueName: "Los Angeles",
    startTimeLabel: "12/05/25 6:30 PM",
    startTimeValue: new Date("2025-12-05T18:30:00").valueOf(),
    weekdayLabel: "Friday",
    localStartTimeLabel: "6:30 PM",
    onSaleDateLabel: "11/15/25",
    daysInMarket: null,
    salesWindowDays: 20,
    programReleasePriceTier: "Not Set",
    programReleaseDomeAtp: null,
    priceTier: "Not Set",
    priceTierOptions: ["GSC E3", "GSC E2", "GSC Club", "Not Set"],
    domeAtp: null,
    hallAtp: null,
    eventHealth: 12,
    gaAtp: null,
    recAtp: null,
    soldPct: null,
    domeProjectedSellthroughPct: null,
    domeSold: null,
    domeSoldProjected: null,
    hallSold: null,
    hallSoldProjected: null,
    gaSold: null,
    gaSoldProjected: null,
    hallSoldPct: null,
    daysRemaining: null,
    projectedRevenue: null,
    netTicketRevenue: null,
    projectedNetRevenue: null,
    optimizedProjected: null,
    tof: null,
    funnelEntriesVsExpectedPct: null,
    fcrPct: null,
    fcrVsExpectedPct: null,
    status: "Unpublished" as const,
    attention: null,
    seatGroups: [
      { id: "sg-39", name: "Orchestra", originalPrice: 50, currentPrice: 50, recTicketPrice: 58, soldPct: 10, ticketsRemaining: 48, projectedRevenue: 500, yield: 290 },
      { id: "sg-40", name: "Mezzanine", originalPrice: 40, currentPrice: 40, recTicketPrice: 47, soldPct: 8, ticketsRemaining: 52, projectedRevenue: 400, yield: 232 },
      { id: "sg-41", name: "Balcony", originalPrice: 30, currentPrice: 30, recTicketPrice: 36, soldPct: 6, ticketsRemaining: 55, projectedRevenue: 300, yield: 174 },
      { id: "sg-42", name: "GA", originalPrice: 22, currentPrice: 22, recTicketPrice: 28, soldPct: 5, ticketsRemaining: 60, projectedRevenue: 220, yield: 130 },
    ],
  },
  {
    id: "evt-010",
    event: "Golden State Warriors vs. San Antonio Spurs",
    eventCategory: "Sports",
    venueName: "Los Angeles",
    startTimeLabel: "10/25/25 7:00 PM",
    startTimeValue: new Date("2025-10-25T19:00:00").valueOf(),
    weekdayLabel: "Saturday",
    localStartTimeLabel: "7:00 PM",
    onSaleDateLabel: "09/15/25",
    daysInMarket: 26,
    salesWindowDays: 40,
    programReleasePriceTier: "GSC S3",
    programReleaseDomeAtp: 44,
    priceTier: "GSC S3",
    priceTierOptions: ["GSC S3", "GSC S2", "GSC E3", "Not Set"],
    domeAtp: 48.2,
    hallAtp: 38.5,
    eventHealth: 70,
    gaAtp: 23.5,
    recAtp: 58,
    soldPct: 67,
    domeProjectedSellthroughPct: 72,
    domeSold: 2060,
    domeSoldProjected: 2350,
    hallSold: 1280,
    hallSoldProjected: 1480,
    gaSold: 1040,
    gaSoldProjected: 1220,
    hallSoldPct: 64,
    daysRemaining: 10,
    projectedRevenue: 43800,
    netTicketRevenue: 17600,
    projectedNetRevenue: 18200,
    optimizedProjected: 20600,
    tof: 15800,
    funnelEntriesVsExpectedPct: 2,
    fcrPct: 4.4,
    fcrVsExpectedPct: 7,
    status: "On Sale" as const,
    attention: null,
    seatGroups: [
      { id: "sg-43", name: "Sports A", originalPrice: 45, currentPrice: 50, recTicketPrice: 60, soldPct: 75, ticketsRemaining: 14, projectedRevenue: 500, yield: 298 },
      { id: "sg-44", name: "Sports B", originalPrice: 42, currentPrice: 48, recTicketPrice: 58, soldPct: 68, ticketsRemaining: 18, projectedRevenue: 480, yield: 278 },
      { id: "sg-45", name: "Sports C", originalPrice: 38, currentPrice: 42, recTicketPrice: 52, soldPct: 60, ticketsRemaining: 22, projectedRevenue: 420, yield: 248 },
      { id: "sg-46", name: "Sports D", originalPrice: 35, currentPrice: 39, recTicketPrice: 48, soldPct: 55, ticketsRemaining: 20, projectedRevenue: 390, yield: 228 },
      { id: "sg-47", name: "GA", originalPrice: 30, currentPrice: 34, recTicketPrice: 42, soldPct: 62, ticketsRemaining: 24, projectedRevenue: 340, yield: 205 },
    ],
  },
  {
    id: "evt-011",
    event: "New York Knicks vs. Brooklyn Nets",
    eventCategory: "Sports",
    venueName: "Cleveland",
    startTimeLabel: "11/01/25 3:00 PM",
    startTimeValue: new Date("2025-11-01T15:00:00").valueOf(),
    weekdayLabel: "Saturday",
    localStartTimeLabel: "3:00 PM",
    onSaleDateLabel: "09/20/25",
    daysInMarket: 28,
    salesWindowDays: 42,
    programReleasePriceTier: "GSC E3",
    programReleaseDomeAtp: 40,
    priceTier: "GSC E3",
    priceTierOptions: ["GSC E3", "GSC E2", "GSC Club", "Not Set"],
    domeAtp: 43.7,
    hallAtp: 34.9,
    eventHealth: 27,
    gaAtp: 21.0,
    recAtp: 51,
    soldPct: 55,
    domeProjectedSellthroughPct: 60,
    domeSold: 1680,
    domeSoldProjected: 1950,
    hallSold: 1040,
    hallSoldProjected: 1220,
    gaSold: 810,
    gaSoldProjected: 960,
    hallSoldPct: 52,
    daysRemaining: 17,
    projectedRevenue: 38400,
    netTicketRevenue: 13900,
    projectedNetRevenue: 14600,
    optimizedProjected: 16500,
    tof: 12500,
    funnelEntriesVsExpectedPct: -8,
    fcrPct: 3.7,
    fcrVsExpectedPct: -2,
    status: "On Sale" as const,
    attention: "underperforming" as const,
    seatGroups: [
      { id: "sg-48", name: "Sports A", originalPrice: 42, currentPrice: 42, recTicketPrice: 52, soldPct: 58, ticketsRemaining: 22, projectedRevenue: 420, yield: 245 },
      { id: "sg-49", name: "Sports B", originalPrice: 40, currentPrice: 40, recTicketPrice: 50, soldPct: 52, ticketsRemaining: 26, projectedRevenue: 400, yield: 232 },
      { id: "sg-50", name: "Sports C", originalPrice: 37, currentPrice: 37, recTicketPrice: 46, soldPct: 48, ticketsRemaining: 28, projectedRevenue: 370, yield: 218 },
      { id: "sg-51", name: "Sports D", originalPrice: 34, currentPrice: 34, recTicketPrice: 43, soldPct: 54, ticketsRemaining: 19, projectedRevenue: 340, yield: 202 },
      { id: "sg-52", name: "GA", originalPrice: 28, currentPrice: 28, recTicketPrice: 36, soldPct: 50, ticketsRemaining: 30, projectedRevenue: 280, yield: 168 },
    ],
  },
  {
    id: "evt-012",
    event: "Chicago Bulls vs. Milwaukee Bucks",
    eventCategory: "Sports",
    venueName: "Atlanta",
    startTimeLabel: "11/08/25 6:00 PM",
    startTimeValue: new Date("2025-11-08T18:00:00").valueOf(),
    weekdayLabel: "Saturday",
    localStartTimeLabel: "6:00 PM",
    onSaleDateLabel: "09/25/25",
    daysInMarket: 30,
    salesWindowDays: 44,
    programReleasePriceTier: "GSC S3",
    programReleaseDomeAtp: 43,
    priceTier: "GSC S3",
    priceTierOptions: ["GSC S3", "GSC S2", "GSC E3", "Not Set"],
    domeAtp: 46.9,
    hallAtp: 37.5,
    eventHealth: 83,
    gaAtp: 23.0,
    recAtp: 54,
    soldPct: 71,
    domeProjectedSellthroughPct: 76,
    domeSold: 2180,
    domeSoldProjected: 2480,
    hallSold: 1360,
    hallSoldProjected: 1580,
    gaSold: 1100,
    gaSoldProjected: 1300,
    hallSoldPct: 68,
    daysRemaining: 24,
    projectedRevenue: 41500,
    netTicketRevenue: 16700,
    projectedNetRevenue: 17400,
    optimizedProjected: 19800,
    tof: 14900,
    funnelEntriesVsExpectedPct: 7,
    fcrPct: 5.0,
    fcrVsExpectedPct: 11,
    status: "On Sale" as const,
    attention: null,
    seatGroups: [
      { id: "sg-53", name: "Sports A", originalPrice: 44, currentPrice: 49, recTicketPrice: 57, soldPct: 78, ticketsRemaining: 12, projectedRevenue: 490, yield: 288 },
      { id: "sg-54", name: "Sports B", originalPrice: 41, currentPrice: 46, recTicketPrice: 54, soldPct: 72, ticketsRemaining: 16, projectedRevenue: 460, yield: 270 },
      { id: "sg-55", name: "Sports C", originalPrice: 38, currentPrice: 42, recTicketPrice: 50, soldPct: 65, ticketsRemaining: 20, projectedRevenue: 420, yield: 248 },
      { id: "sg-56", name: "Sports D", originalPrice: 36, currentPrice: 40, recTicketPrice: 48, soldPct: 68, ticketsRemaining: 15, projectedRevenue: 400, yield: 238 },
      { id: "sg-57", name: "GA", originalPrice: 30, currentPrice: 34, recTicketPrice: 41, soldPct: 64, ticketsRemaining: 22, projectedRevenue: 340, yield: 205 },
    ],
  },
];

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const statusFilterOptions: { label: string; value: FilterValue }[] = [
  { label: "All Events", value: "all" },
  { label: "Needs Attention", value: "attention" },
  { label: "On Sale", value: "on-sale" },
  { label: "Unpublished", value: "unpublished" },
];

const sortLabelMap: Record<SortKey, string> = {
  event: "Event",
  startTime: "Start Time",
  domeAtp: "Dome ATP",
  recAtp: "Rec. ATP",
  soldPct: "% Sold",
  daysRemaining: "Days Remaining",
  projectedRevenue: "Proj. Revenue",
  status: "Status",
};

function cloneEvents(events: EventRecord[]): EventRecord[] {
  return events.map((event) => ({
    ...event,
    priceTierOptions: [...event.priceTierOptions],
    seatGroups: event.seatGroups.map((seatGroup) => ({ ...seatGroup })),
  }));
}

function formatCurrency(value: number | null): string {
  if (value === null) {
    return "--";
  }
  return currencyFormatter.format(value);
}

function formatWholeNumber(value: number | null): string {
  if (value === null) {
    return "--";
  }

  return value.toLocaleString("en-US");
}

function summarizeBulkEditValues<T>(
  values: T[],
  formatter: (value: T) => string,
): EventBulkFieldSummary {
  if (values.length === 0) {
    return { valueLabel: "--", rawValue: null, isMixed: false };
  }

  const firstValue = values[0];
  if (values.every((value) => value === firstValue)) {
    return {
      valueLabel: formatter(firstValue),
      rawValue: firstValue as string | number | null,
      isMixed: false,
    };
  }

  return { valueLabel: "Mixed", rawValue: null, isMixed: true };
}

function formatPercent(value: number | null): string {
  if (value === null) {
    return "--";
  }
  return `${value}%`;
}

function formatSignedPercent(value: number | null): string {
  if (value === null) {
    return "--";
  }

  const absoluteValue = Math.abs(value);
  const formattedValue = Number.isInteger(absoluteValue)
    ? String(absoluteValue)
    : absoluteValue.toFixed(1).replace(/\.0$/, "");

  if (value > 0) {
    return `+${formattedValue}%`;
  }

  if (value < 0) {
    return `-${formattedValue}%`;
  }

  return `${formattedValue}%`;
}

function formatCycleComplete(daysOnSale: number | null, totalWindowDays: number | null): string {
  if (daysOnSale === null || totalWindowDays === null || totalWindowDays <= 0) {
    return "--";
  }

  const percentComplete = roundTo((daysOnSale / totalWindowDays) * 100, 1);
  return formatPercent(percentComplete);
}

function getSellthroughLift(actualPct: number | null, projectedPct: number | null): number {
  if (actualPct === null || projectedPct === null) {
    return 0;
  }

  return projectedPct - actualPct;
}

function projectSellthroughMetric(
  actualPct: number | null,
  projectionLift: number,
  multiplier: number,
): number | null {
  if (actualPct === null) {
    return null;
  }

  return roundTo(clamp(actualPct + projectionLift * multiplier, 0, 100), 1);
}

function getVenueTimezone(venueName: string): string {
  const map: Record<string, string> = {
    "Los Angeles": "PST",
    "Cleveland": "EST",
    "Atlanta": "EST",
    "New York": "EST",
    "Chicago": "CST",
    "Golden State": "PST",
  };
  return map[venueName] ?? "";
}

function getSeatGroupByName(event: EventRecord, seatGroupName: string): SeatGroup | undefined {
  return event.seatGroups.find(
    (seatGroup) => seatGroup.name.trim().toLowerCase() === seatGroupName.trim().toLowerCase(),
  );
}

function formatSeatGroupPriceRange(
  event: EventRecord,
  field: "currentPrice" | "recTicketPrice",
): string {
  if (event.seatGroups.length === 0) {
    return "--";
  }

  const values = event.seatGroups.map((seatGroup) => seatGroup[field]);
  const minimum = Math.min(...values);
  const maximum = Math.max(...values);

  return `${formatCurrency(minimum)} - ${formatCurrency(maximum)}`;
}

function getNetTicketRevenueBreakdown(event: EventRecord): {
  groupSales: number | null;
  consumer: number | null;
} {
  if (event.netTicketRevenue === null) {
    return {
      groupSales: null,
      consumer: null,
    };
  }

  const groupSalesRatio = clamp(
    0.24 + ((event.hallSoldPct ?? event.soldPct ?? 50) - 50) / 250,
    0.18,
    0.46,
  );
  const groupSales = roundTo(event.netTicketRevenue * groupSalesRatio, 2);
  const consumer = roundTo(event.netTicketRevenue - groupSales, 2);

  return {
    groupSales,
    consumer,
  };
}

function parseRoute(pathname: string): ViewRoute {
  const seatmapMatch = pathname.match(/^\/seatmap\/([^/]+)\/?$/);
  if (seatmapMatch) {
    return { type: "seatmap", eventId: decodeURIComponent(seatmapMatch[1]) };
  }

  const reportingMatch = pathname.match(/^\/reporting\/([^/]+)\/?$/);
  if (reportingMatch) {
    return { type: "reporting", eventId: decodeURIComponent(reportingMatch[1]) };
  }

  if (pathname === "/mvp") {
    return { type: "mvp-view" };
  }

  return { type: "price-adjustment" };
}

function calculatePendingChanges(publishedEvents: EventRecord[], draftEvents: EventRecord[]) {
  const publishedById = new Map(publishedEvents.map((event) => [event.id, event]));
  const changedEventIds = new Set<string>();

  let total = 0;

  for (const draftEvent of draftEvents) {
    const publishedEvent = publishedById.get(draftEvent.id);
    if (!publishedEvent) {
      continue;
    }

    const eventLevelDirty =
      draftEvent.priceTier !== publishedEvent.priceTier || draftEvent.domeAtp !== publishedEvent.domeAtp;

    if (eventLevelDirty) {
      total += 1;
      changedEventIds.add(draftEvent.id);
    }

    const publishedSeatGroups = new Map(
      publishedEvent.seatGroups.map((seatGroup) => [seatGroup.id, seatGroup]),
    );

    for (const draftSeatGroup of draftEvent.seatGroups) {
      const publishedSeatGroup = publishedSeatGroups.get(draftSeatGroup.id);
      if (!publishedSeatGroup) {
        continue;
      }

      if (
        draftSeatGroup.name !== publishedSeatGroup.name ||
        draftSeatGroup.currentPrice !== publishedSeatGroup.currentPrice
      ) {
        total += 1;
        changedEventIds.add(draftEvent.id);
      }
    }
  }

  return {
    total,
    changedEventIds,
  };
}

function getAttentionReasons(event: EventRecord): { metric: string; detail: string }[] {
  const reasons: { metric: string; detail: string }[] = [];

  if (event.soldPct !== null && event.soldPct < 55) {
    reasons.push({ metric: "Sell-Through", detail: `${event.soldPct}% sold — below the 55% target` });
  }

  if (event.funnelEntriesVsExpectedPct !== null && event.funnelEntriesVsExpectedPct < -5) {
    reasons.push({ metric: "Funnel Entries", detail: `${event.funnelEntriesVsExpectedPct}% vs. expected — demand is trailing` });
  }

  if (event.fcrVsExpectedPct !== null && event.fcrVsExpectedPct < 0) {
    reasons.push({ metric: "Conversion Rate", detail: `FCR is ${event.fcrVsExpectedPct}% vs. expected` });
  }

  if (event.netTicketRevenue !== null && event.projectedNetRevenue !== null && event.netTicketRevenue < event.projectedNetRevenue * 0.8) {
    reasons.push({ metric: "Net Revenue", detail: `${formatCurrency(event.netTicketRevenue)} actual vs. ${formatCurrency(event.projectedNetRevenue)} projected` });
  }

  if (event.daysRemaining !== null && event.daysRemaining <= 14 && event.soldPct !== null && event.soldPct < 65) {
    reasons.push({ metric: "Time Pressure", detail: `Only ${event.daysRemaining} days left with ${event.soldPct}% sold` });
  }

  if (reasons.length === 0) {
    reasons.push({ metric: "Performance", detail: "Overall metrics are below expectations" });
  }

  return reasons;
}

function getAttentionSummary(event: EventRecord): string {
  const soldPct = event.soldPct ?? 0;
  const funnelGap = event.funnelEntriesVsExpectedPct ?? 0;
  const daysLeft = event.daysRemaining;

  if (daysLeft !== null && daysLeft <= 14 && soldPct < 55) {
    return `This event is at risk — low sell-through with only ${daysLeft} days remaining; consider a price adjustment to drive demand.`;
  }
  if (funnelGap < -10) {
    return "Demand is significantly below expectations; a pricing or promotional adjustment may be needed to recover momentum.";
  }
  if (soldPct < 50) {
    return "Sell-through is well below target; review pricing strategy and consider recommendations to improve ticket velocity.";
  }
  return "Multiple performance indicators are trailing expectations; review pricing and demand metrics for this event.";
}

function attentionBadge(event: EventRecord) {
  if (event.attention !== "underperforming") {
    return null;
  }

  const reasons = getAttentionReasons(event);
  const summary = getAttentionSummary(event);

  return (
    <span className="group/attn relative ml-1.5 shrink-0">
      <span className="inline-flex h-6 w-6 cursor-help items-center justify-center rounded-full bg-warning/15 text-warning">
        <AlertTriangle className="h-3.5 w-3.5" />
      </span>
      <div className="pointer-events-none absolute left-0 top-full z-50 mt-1.5 w-[320px] rounded-lg border border-border/80 bg-card p-3 opacity-0 shadow-xl transition-opacity group-hover/attn:pointer-events-auto group-hover/attn:opacity-100">
        <p className="mb-2 text-xs font-semibold text-foreground">Flagged Metrics</p>
        <ul className="space-y-1.5">
          {reasons.map((r) => (
            <li key={r.metric} className="flex items-start gap-2 text-xs">
              <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-warning" />
              <span>
                <span className="font-medium text-foreground">{r.metric}:</span>{" "}
                <span className="text-muted-foreground">{r.detail}</span>
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-2.5 border-t border-border/60 pt-2 text-xs leading-relaxed text-muted-foreground">
          {summary}
        </p>
      </div>
    </span>
  );
}

function EventHealthBadge({ score }: { score: number | null }) {
  if (score === null) return <span className="text-muted-foreground text-sm">--</span>;
  const { bg, text, ring } =
    score >= 76
      ? { bg: "bg-emerald-100", text: "text-emerald-700", ring: "ring-1 ring-emerald-300" }
      : score >= 51
      ? { bg: "bg-blue-100", text: "text-blue-700", ring: "ring-1 ring-blue-300" }
      : score >= 26
      ? { bg: "bg-amber-100", text: "text-amber-700", ring: "ring-1 ring-amber-300" }
      : { bg: "bg-red-100", text: "text-red-700", ring: "ring-1 ring-red-300" };
  return (
    <div
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-normal",
        bg, text, ring,
      )}
    >
      {score}
    </div>
  );
}

function SellThroughBar({ pct, compact = false }: { pct: number | null; compact?: boolean }) {
  if (pct === null) return <span>--</span>;
  const barColor = pct >= 75 ? "bg-success" : pct >= 51 ? "bg-primary" : "bg-warning";
  const textColor = pct < 50 ? "text-destructive" : "";
  return (
    <div className="flex flex-col items-center gap-2.5">
      <span className={textColor}>{formatPercent(pct)}</span>
      <div className={cn("h-1.5 rounded-full bg-border/25", compact ? "w-[52px]" : "w-full")}>
        <div
          className={cn("h-full rounded-full transition-all duration-300", barColor)}
          style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
        />
      </div>
    </div>
  );
}

function PublishedOverlay({ visible }: { visible: boolean }) {
  return (
    <div
      className={cn(
        "pointer-events-none fixed left-1/2 top-5 z-[80] -translate-x-1/2 transform transition-all duration-500",
        visible ? "translate-y-0 scale-100 opacity-100" : "-translate-y-2 scale-95 opacity-0",
      )}
      aria-live="polite"
    >
      <span className="inline-flex items-center gap-2 rounded-xl border bg-card px-6 py-3 text-base font-semibold text-foreground shadow-2xl">
        <Check className="h-5 w-5 text-success" />
        Changes published
      </span>
    </div>
  );
}

function DraftActionFooter({
  stagedCount,
  onDiscard,
  onPublish,
  scopeLabel,
  extraActionLabel,
  onExtraAction,
  extraActionDisabled,
}: {
  stagedCount: number;
  onDiscard: () => void;
  onPublish: () => void;
  scopeLabel?: string;
  extraActionLabel?: string;
  onExtraAction?: () => void;
  extraActionDisabled?: boolean;
}) {
  const hasChanges = stagedCount > 0;
  const scopeSuffix = scopeLabel ? ` ${scopeLabel}` : "";

  return (
    <footer className="fixed inset-x-0 bottom-0 z-[70] border-t border-border/60 bg-white">
      <div className="mx-auto flex max-w-[1450px] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <div className={cn("h-1.5 w-1.5 rounded-full", hasChanges ? "bg-warning" : "bg-muted-foreground/30")} />
          <p className={cn("text-sm", hasChanges ? "font-medium text-foreground" : "text-muted-foreground")}>
            {hasChanges
              ? `${stagedCount} staged change${stagedCount === 1 ? "" : "s"}${scopeSuffix} ready to publish`
              : `No staged changes${scopeSuffix}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {extraActionLabel && onExtraAction && (
            <Button variant="secondary" onClick={onExtraAction} disabled={extraActionDisabled}>
              {extraActionLabel}
            </Button>
          )}
          <Button variant="ghost" onClick={onDiscard} disabled={!hasChanges} className="text-muted-foreground hover:text-foreground">
            Discard Draft
          </Button>
          <Button onClick={onPublish} disabled={!hasChanges} className={cn(!hasChanges && "opacity-40")}>
            {hasChanges ? `Review ${stagedCount} Change${stagedCount === 1 ? "" : "s"}` : "Review Changes"}
          </Button>
        </div>
      </div>
    </footer>
  );
}

function SvgPointTooltip({
  x,
  y,
  width,
  height,
  left,
  right,
  top,
  bottom,
  title,
  lines,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
  title: string;
  lines: string[];
}) {
  const tooltipWidth = 214;
  const lineHeight = 14;
  const tooltipHeight = 26 + lines.length * lineHeight;
  const placeAbove = y - tooltipHeight - 10 >= top;
  const rawX = x - tooltipWidth / 2;
  const tooltipX = clamp(rawX, left + 4, width - right - tooltipWidth - 4);
  const tooltipY = placeAbove
    ? y - tooltipHeight - 10
    : clamp(y + 10, top + 4, height - bottom - tooltipHeight - 4);

  return (
    <g transform={`translate(${tooltipX},${tooltipY})`} pointerEvents="none">
      <rect
        width={tooltipWidth}
        height={tooltipHeight}
        rx={10}
        ry={10}
        fill="hsl(var(--card))"
        stroke="hsl(var(--border))"
      />
      <text x={12} y={16} fontSize={11} fontWeight={700} fill="hsl(var(--foreground))">
        {title}
      </text>
      {lines.map((line, index) => (
        <text
          key={`${title}-${line}-${index}`}
          x={12}
          y={34 + index * lineHeight}
          fontSize={11}
          fill="hsl(var(--muted-foreground))"
        >
          {line}
        </text>
      ))}
    </g>
  );
}

function sortValueForKey(row: EventRecord, key: SortKey): number | string | null {
  switch (key) {
    case "event":
      return row.event;
    case "startTime":
      return row.startTimeValue;
    case "domeAtp":
      return row.domeAtp;
    case "recAtp":
      return row.recAtp;
    case "soldPct":
      return row.soldPct;
    case "daysRemaining":
      return row.daysRemaining;
    case "projectedRevenue":
      return row.projectedRevenue;
    case "status":
      return row.status;
    default:
      return null;
  }
}

interface ReportingPricingRow {
  id: string;
  label: string;
  originalPrice: number;
  currentPrice: number;
  recPrice: number;
  soldPct: number | null;
  ticketsLeft: number | null;
  yield: number | null;
}

interface PublishFieldChange {
  fieldLabel: string;
  previousValue: string;
  nextValue: string;
  rawNextValue: string | number | null;
  recommendedValue?: string;
  inputType: "number" | "text";
  changeKey: string;
  target:
    | { type: "event-price-tier"; eventId: string }
    | { type: "event-dome-atp"; eventId: string }
    | { type: "seat-group-name"; eventId: string; seatGroupId: string }
    | { type: "seat-group-current-price"; eventId: string; seatGroupId: string };
}

interface PublishChangeRow {
  id: string;
  rowLabel: string;
  contextLabel: string;
  changes: PublishFieldChange[];
}

interface RecommendedReviewChangeRow {
  id: string;
  rowLabel: string;
  contextLabel: string;
  currentValue: number;
  suggestedValue: number;
  format: "currency" | "percent";
  inputStep: string;
  inputDecimals: number;
  maximum?: number;
  target:
    | { type: "seat-group-price"; rowId: string }
    | { type: "draft-seat-group-price"; eventId: string; seatGroupId: string }
    | { type: "offer-rate" }
    | { type: "marketing-spend" };
}

interface EventBulkEditOption {
  value: EventEditableField;
  label: string;
  inputType: "number" | "select";
  group: "event" | "seatGroup";
  selectOptions?: string[];
  availabilityCount?: number;
}

interface EventBulkFieldSummary {
  valueLabel: string;
  detailLabel?: string;
  rawValue?: string | number | null;
  isMixed?: boolean;
}

type NumericBulkEditMode = "set" | "flat" | "percent";

const numericBulkEditModes: { value: NumericBulkEditMode; label: string }[] = [
  { value: "set", label: "Set value" },
  { value: "flat", label: "Edit by amount" },
  { value: "percent", label: "Edit by percent" },
];

function formatPublishValue(value: number | string | null) {
  if (typeof value === "number") {
    return formatCurrency(value);
  }

  if (value === null) {
    return "--";
  }

  return value;
}

function formatRecommendationReviewValue(value: number, format: RecommendedReviewChangeRow["format"]) {
  if (format === "percent") {
    return `${roundTo(value, 1)}%`;
  }

  return formatCurrency(value);
}

function formatRecommendationReviewInputValue(value: number, decimals: number) {
  return String(roundTo(value, decimals));
}

function intersectOptions(optionGroups: string[][]): string[] {
  if (optionGroups.length === 0) {
    return [];
  }

  return optionGroups.reduce((sharedOptions, options) =>
    sharedOptions.filter((option) => options.includes(option)),
  );
}

function buildPublishChangeRows(
  publishedEvents: EventRecord[],
  draftEvents: EventRecord[],
): PublishChangeRow[] {
  const publishedById = new Map(publishedEvents.map((event) => [event.id, event]));
  const changeRows: PublishChangeRow[] = [];

  for (const draftEvent of draftEvents) {
    const publishedEvent = publishedById.get(draftEvent.id);
    if (!publishedEvent) {
      continue;
    }

    const eventChanges: PublishFieldChange[] = [];

    if (draftEvent.priceTier !== publishedEvent.priceTier) {
      eventChanges.push({
        fieldLabel: "Price Tier",
        previousValue: formatPublishValue(publishedEvent.priceTier),
        nextValue: formatPublishValue(draftEvent.priceTier),
        rawNextValue: draftEvent.priceTier,
        inputType: "text",
        changeKey: `event-price-tier-${draftEvent.id}`,
        target: { type: "event-price-tier", eventId: draftEvent.id },
      });
    }

    if (draftEvent.domeAtp !== publishedEvent.domeAtp) {
      eventChanges.push({
        fieldLabel: "Dome ATP",
        previousValue: formatPublishValue(publishedEvent.domeAtp),
        nextValue: formatPublishValue(draftEvent.domeAtp),
        rawNextValue: draftEvent.domeAtp,
        inputType: "number",
        changeKey: `event-dome-atp-${draftEvent.id}`,
        target: { type: "event-dome-atp", eventId: draftEvent.id },
      });
    }

    if (eventChanges.length > 0) {
      changeRows.push({
        id: `event-${draftEvent.id}`,
        rowLabel: draftEvent.event,
        contextLabel: "Event",
        changes: eventChanges,
      });
    }

    const publishedSeatGroups = new Map(
      publishedEvent.seatGroups.map((seatGroup) => [seatGroup.id, seatGroup]),
    );

    for (const draftSeatGroup of draftEvent.seatGroups) {
      const publishedSeatGroup = publishedSeatGroups.get(draftSeatGroup.id);
      if (!publishedSeatGroup) {
        continue;
      }

      const seatGroupChanges: PublishFieldChange[] = [];

      if (draftSeatGroup.name !== publishedSeatGroup.name) {
        seatGroupChanges.push({
          fieldLabel: "Seat Group",
          previousValue: formatPublishValue(publishedSeatGroup.name),
          nextValue: formatPublishValue(draftSeatGroup.name),
          rawNextValue: draftSeatGroup.name,
          inputType: "text",
          changeKey: `seat-group-name-${draftEvent.id}-${draftSeatGroup.id}`,
          target: { type: "seat-group-name", eventId: draftEvent.id, seatGroupId: draftSeatGroup.id },
        });
      }

      if (draftSeatGroup.currentPrice !== publishedSeatGroup.currentPrice) {
        seatGroupChanges.push({
          fieldLabel: "Current Price",
          previousValue: formatPublishValue(publishedSeatGroup.currentPrice),
          nextValue: formatPublishValue(draftSeatGroup.currentPrice),
          rawNextValue: draftSeatGroup.currentPrice,
          recommendedValue: formatPublishValue(draftSeatGroup.recTicketPrice),
          inputType: "number",
          changeKey: `seat-group-current-price-${draftEvent.id}-${draftSeatGroup.id}`,
          target: { type: "seat-group-current-price", eventId: draftEvent.id, seatGroupId: draftSeatGroup.id },
        });
      }

      if (seatGroupChanges.length > 0) {
        changeRows.push({
          id: `seat-group-${draftEvent.id}-${draftSeatGroup.id}`,
          rowLabel: draftEvent.event,
          contextLabel: `${draftSeatGroup.name} / Seat Group`,
          changes: seatGroupChanges,
        });
      }
    }
  }

  return changeRows;
}

function PublishConfirmationModal({
  open,
  changeRows,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  changeRows: PublishChangeRow[];
  onCancel: () => void;
  onConfirm: (edits: Record<string, string>) => void;
}) {
  const [editedValues, setEditedValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) return;
    const initial: Record<string, string> = {};
    for (const row of changeRows) {
      for (const change of row.changes) {
        initial[change.changeKey] = change.rawNextValue === null ? "" : String(change.rawNextValue);
      }
    }
    setEditedValues(initial);
  }, [open]);

  if (!open) {
    return null;
  }

  const fieldChangeCount = changeRows.reduce((total, row) => total + row.changes.length, 0);

  // Group rows by event name
  const eventGroups = new Map<string, PublishChangeRow[]>();
  for (const row of changeRows) {
    if (!eventGroups.has(row.rowLabel)) eventGroups.set(row.rowLabel, []);
    eventGroups.get(row.rowLabel)!.push(row);
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/45 px-4 py-8">
      <div className="max-h-[85vh] w-full max-w-5xl overflow-hidden rounded-2xl border bg-card shadow-2xl">
        <div className="border-b px-6 py-4">
          <h2 className="font-heading text-xl font-semibold text-foreground">Confirm Publish Changes</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Review {fieldChangeCount} field change{fieldChangeCount === 1 ? "" : "s"} across{" "}
            {eventGroups.size} event{eventGroups.size === 1 ? "" : "s"} before publishing.
          </p>
        </div>

        <div className="max-h-[62vh] space-y-5 overflow-y-auto px-6 py-5">
          {Array.from(eventGroups.entries()).map(([eventName, rows]) => (
            <div key={eventName} className="rounded-xl border border-border/70 overflow-hidden">
              {/* Event header */}
              <div className="bg-secondary/30 px-4 py-2.5 border-b border-border/60">
                <p className="text-sm font-semibold text-foreground">{eventName}</p>
              </div>

              {/* Table */}
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 bg-secondary/10">
                    <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/70 w-[160px]">Seat Group</th>
                    <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/70 w-[130px]">Field</th>
                    <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/70 w-[120px]">Previous</th>
                    <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/70 w-[120px]">Recommended</th>
                    <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/70">New Value</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) =>
                    row.changes.map((change, i) => (
                      <tr
                        key={`${row.id}-${change.fieldLabel}`}
                        className="border-b border-border/40 last:border-0 hover:bg-muted/20"
                      >
                        {i === 0 && (
                          <td
                            className="px-4 py-3 text-sm text-foreground align-top"
                            rowSpan={row.changes.length}
                          >
                            {row.contextLabel === "Event" ? (
                              <span className="text-muted-foreground italic">Event</span>
                            ) : (
                              row.contextLabel.replace(" / Seat Group", "")
                            )}
                          </td>
                        )}
                        <td className="px-4 py-3 text-sm text-muted-foreground">{change.fieldLabel}</td>
                        <td className="px-4 py-3 text-sm text-foreground">{change.previousValue}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {change.recommendedValue ?? <span className="text-muted-foreground/40">—</span>}
                        </td>
                        <td className="px-4 py-3">
                          <Input
                            type={change.inputType}
                            min={change.inputType === "number" ? "0" : undefined}
                            step={change.inputType === "number" ? "0.01" : undefined}
                            value={editedValues[change.changeKey] ?? ""}
                            onChange={(e) =>
                              setEditedValues((prev) => ({ ...prev, [change.changeKey]: e.target.value }))
                            }
                            className="h-8 w-[120px] bg-background text-sm font-medium"
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end gap-2 border-t px-6 py-4">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={() => onConfirm(editedValues)}>Confirm Publish</Button>
        </div>
      </div>
    </div>
  );
}

function BulkEditEventsModal({
  open,
  selectedEvents,
  sharedFields,
  summaries,
  values,
  modes,
  readyFields,
  onClose,
  onSetValue,
  onSetMode,
  onApply,
  onPublish,
}: {
  open: boolean;
  selectedEvents: EventRecord[];
  sharedFields: EventBulkEditOption[];
  summaries: Record<string, EventBulkFieldSummary>;
  values: Record<string, string>;
  modes: Record<string, NumericBulkEditMode>;
  readyFields: EventBulkEditOption[];
  onClose: () => void;
  onSetValue: (field: EventEditableField, value: string) => void;
  onSetMode: (field: EventEditableField, mode: NumericBulkEditMode) => void;
  onApply: () => void;
  onPublish: () => void;
}) {
  if (!open) return null;

  function getReferencedEvents(field: EventBulkEditOption): EventRecord[] {
    if (field.value === "domeAtp" || field.value === "priceTier") return selectedEvents;
    const seatGroupName = field.value.replace("seatGroup:", "");
    return selectedEvents.filter((e) => getSeatGroupByName(e, seatGroupName) !== undefined);
  }

  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/45 px-4 py-8">
      <div className="max-h-[85vh] w-full max-w-3xl overflow-hidden rounded-2xl border bg-card shadow-2xl">
        {/* Header */}
        <div className="border-b px-6 py-4">
          <h2 className="font-heading text-xl font-semibold text-foreground">Bulk Edit Events</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Editing shared fields across {selectedEvents.length} selected event{selectedEvents.length === 1 ? "" : "s"}.
          </p>
        </div>

        {/* Table */}
        <div className="max-h-[62vh] overflow-y-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50 bg-secondary/10">
                <th className="w-[160px] px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/70">Field</th>
                <th className="w-[160px] px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/70">Current</th>
                <th className="w-[180px] px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/70">Mode</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/70">New Value</th>
              </tr>
            </thead>
            <tbody>
              {(["seatGroup"] as const).map((group) => {
                const fields = sharedFields.filter((f) => f.group === group);
                if (fields.length === 0) return null;
                return (
                  <Fragment key={group}>
                    <tr className="border-b border-border/40 bg-secondary/10">
                      <td colSpan={4} className="px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                        {"Seat Groups"}
                      </td>
                    </tr>
                    {fields.map((field) => {
                      const summary = summaries[field.value] ?? { valueLabel: "--" };
                      const fieldValue = values[field.value] ?? "";
                      const fieldMode = modes[field.value] ?? "set";
                      const referencedEvents = getReferencedEvents(field);

                      return (
                        <tr key={field.value} className="border-b border-border/40 last:border-0 align-top hover:bg-muted/20">
                          {/* Field name */}
                          <td className="px-4 py-3 font-medium text-foreground">{field.label}</td>

                          {/* Current value + hover tooltip */}
                          <td className="px-4 py-3">
                            <p className={cn("text-sm text-foreground", summary.isMixed && "text-muted-foreground")}>
                              {summary.valueLabel}
                            </p>
                            {summary.detailLabel && (
                              <div className="group relative mt-0.5 inline-block">
                                <span className="cursor-help text-xs text-muted-foreground underline decoration-dotted underline-offset-2">
                                  {summary.detailLabel}
                                </span>
                                <div className="pointer-events-none absolute left-0 top-full z-30 mt-1.5 min-w-[200px] rounded-lg border border-border/80 bg-card p-2.5 shadow-xl opacity-0 transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100">
                                  <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/70">Events</p>
                                  <ul className="space-y-1">
                                    {referencedEvents.map((e) => (
                                      <li key={e.id} className="text-xs leading-snug text-foreground">{e.event}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            )}
                          </td>

                          {/* Mode selector */}
                          <td className="px-4 py-3">
                            {field.inputType === "number" ? (
                              <Select value={fieldMode} onValueChange={(next) => onSetMode(field.value, next as NumericBulkEditMode)}>
                                <SelectTrigger className="h-8 w-full bg-background">
                                  <SelectValue placeholder="Mode" />
                                </SelectTrigger>
                                <SelectContent className="!z-[200]">
                                  {numericBulkEditModes.map((mode) => (
                                    <SelectItem key={mode.value} value={mode.value}>{mode.label}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              <span className="text-xs text-muted-foreground">—</span>
                            )}
                          </td>

                          {/* New value input */}
                          <td className="px-4 py-3">
                            {field.inputType === "select" ? (
                              <Select value={fieldValue} onValueChange={(next) => onSetValue(field.value, next)}>
                                <SelectTrigger className="h-8 w-full bg-background">
                                  <SelectValue placeholder="Select value" />
                                </SelectTrigger>
                                <SelectContent className="!z-[200]">
                                  {(field.selectOptions ?? []).map((option) => (
                                    <SelectItem key={option} value={option}>{option}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              <Input
                                type="number"
                                inputMode="decimal"
                                step="0.01"
                                value={fieldValue}
                                onChange={(e) => onSetValue(field.value, e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") onApply();
                                  if (e.key === "Escape") onClose();
                                }}
                                className="h-8 w-full bg-background"
                                placeholder={
                                  fieldMode === "percent" ? "Enter %" :
                                  fieldMode === "flat" ? "Enter Amount" :
                                  "Set value"
                                }
                              />
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t px-6 py-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="secondary" onClick={onApply} disabled={readyFields.length === 0}>
            Apply Changes
          </Button>
          <Button onClick={onPublish} disabled={readyFields.length === 0}>
            Publish Changes
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function RecommendedReviewModal({
  open,
  changeRows,
  valueById,
  onValueChange,
  onCancel,
  onConfirm,
  onConfirmAndPublish,
}: {
  open: boolean;
  changeRows: RecommendedReviewChangeRow[];
  valueById: Record<string, string>;
  onValueChange: (rowId: string, nextValue: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
  onConfirmAndPublish: () => void;
}) {
  if (!open) {
    return null;
  }

  const invalidRowIds = new Set(
    changeRows
      .filter((row) => {
        const parsedValue = Number.parseFloat(valueById[row.id] ?? "");
        if (!Number.isFinite(parsedValue) || parsedValue < 0) {
          return true;
        }

        if (row.maximum !== undefined && parsedValue > row.maximum) {
          return true;
        }

        return false;
      })
      .map((row) => row.id),
  );

  const reviewedChangeCount = changeRows.reduce((count, row) => {
    const parsedValue = Number.parseFloat(valueById[row.id] ?? "");
    if (!Number.isFinite(parsedValue) || parsedValue < 0) {
      return count;
    }

    if (row.maximum !== undefined && parsedValue > row.maximum) {
      return count;
    }

    return count + (!arePriceValuesEqual(parsedValue, row.currentValue) ? 1 : 0);
  }, 0);

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/45 px-4 py-8">
      <div className="max-h-[85vh] w-full max-w-5xl overflow-hidden rounded-2xl border bg-card shadow-2xl">
        <div className="border-b px-6 py-4">
          <h2 className="font-heading text-xl font-semibold text-foreground">Review Recommended Changes</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Review {changeRows.length} recommended change{changeRows.length === 1 ? "" : "s"} and adjust any reviewed value before staging them in draft or publishing them live.
          </p>
        </div>

        <div className="max-h-[58vh] space-y-4 overflow-y-auto px-6 py-5">
          {changeRows.map((row) => {
            const isInvalid = invalidRowIds.has(row.id);

            return (
              <div key={row.id} className="rounded-xl border border-border/70 bg-secondary/15 p-4">
                <div className="mb-3">
                  <p className="text-sm font-medium text-foreground">{row.rowLabel}</p>
                  <p className="text-xs text-muted-foreground">{row.contextLabel}</p>
                </div>

                <div className="grid gap-2 rounded-lg border border-border/60 bg-card px-3 py-3 sm:grid-cols-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Current</p>
                    <p className="mt-1 text-sm text-foreground">
                      {formatRecommendationReviewValue(row.currentValue, row.format)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Suggested</p>
                    <p className="mt-1 text-sm font-medium text-foreground">
                      {formatRecommendationReviewValue(row.suggestedValue, row.format)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Reviewed Value</p>
                    <div className="mt-1 flex items-center gap-2">
                      <Input
                        type="number"
                        inputMode="decimal"
                        min="0"
                        max={row.maximum !== undefined ? String(row.maximum) : undefined}
                        step={row.inputStep}
                        value={valueById[row.id] ?? ""}
                        onChange={(event) => onValueChange(row.id, event.target.value)}
                        className={cn("h-9 bg-background", isInvalid && "border-destructive")}
                        aria-label={`Reviewed value for ${row.rowLabel}`}
                      />
                      {row.format === "percent" && (
                        <span className="text-sm text-muted-foreground">%</span>
                      )}
                    </div>
                    {isInvalid && (
                      <p className="mt-1 text-xs text-destructive">
                        Enter a valid non-negative {row.format === "percent" ? "percent" : "amount"}.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t px-6 py-4">
          <p className="text-sm text-muted-foreground">
            {reviewedChangeCount} reviewed change{reviewedChangeCount === 1 ? "" : "s"} ready to stage or publish.
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button variant="secondary" onClick={onConfirm} disabled={changeRows.length === 0 || invalidRowIds.size > 0}>
              Stage Reviewed Changes
            </Button>
            <Button onClick={onConfirmAndPublish} disabled={changeRows.length === 0 || invalidRowIds.size > 0}>
              Publish Reviewed Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ReportingOfferRow {
  id: string;
  offer: string;
  type: string;
  amountLabel: string;
  startLabel: string;
  endLabel: string;
  published: boolean;
}

interface ReportingDiscountRow {
  id: string;
  discount: string;
  code: string;
  amountLabel: string;
  startLabel: string;
  endLabel: string;
}

interface ReportingYieldRow {
  id: string;
  ticketsSold: number;
  sellThroughPct: number;
  yield: number;
  grossYield: number;
}

interface ComparablePaceRow {
  id: string;
  phase: string;
  ticketsSold: number;
  soldPct: number;
  compYield: number;
}

interface EventHealthTrendPoint {
  id: string;
  label: string;
  health: number;
  target: number;
}

interface MetricTrendPoint {
  id: string;
  label: string;
  actual: number;
  expected: number;
}

interface EventPerformanceModel {
  mode: "active" | "future";
  currentGrossRevenue: number;
  currentNetRevenue: number;
  expectedRevenueNow: number;
  projectedNetRevenueCurrent: number;
  projectedNetRevenueRecommended: number;
  revenueVsExpectedPct: number;
  actualSellthroughNow: number;
  expectedSellthroughNow: number;
  sellthroughVsExpectedPts: number;
  expectedRevenueDelta: number;
  pricingOpportunity: number;
  pricingOpportunityPct: number;
  pricingOpportunityScore: number;
  healthScore: number;
  riskFlag: "Underperforming" | "On Track" | "Pre-Sale Planning";
  domeGrossRevenue: number;
  domeNetRevenue: number;
  hallGrossRevenue: number;
  hallNetRevenue: number;
  ticketsSoldTotal: number;
  ticketsRemainingTotal: number;
  roas: number;
  compRoas: number;
  adSpend: number;
  funnelEntries: number;
  funnelCompletion: number;
  compFunnelEntries: number;
  compFunnelCompletion: number;
  revenueTrend: MetricTrendPoint[];
  sellthroughTrend: MetricTrendPoint[];
  funnelEntriesTrend: MetricTrendPoint[];
  funnelCompletionTrend: MetricTrendPoint[];
  roasTrend: MetricTrendPoint[];
}

const fallbackReportingPricingRows: ReportingPricingRow[] = [
  {
    id: "group-a",
    label: "Group A",
    originalPrice: 40,
    currentPrice: 40,
    recPrice: 45,
    soldPct: 72,
    ticketsLeft: 20,
    yield: 205,
  },
  {
    id: "group-b",
    label: "Group B",
    originalPrice: 45,
    currentPrice: 45,
    recPrice: 45,
    soldPct: 58,
    ticketsLeft: 32,
    yield: 188,
  },
  {
    id: "group-c",
    label: "Group C",
    originalPrice: 50,
    currentPrice: 50,
    recPrice: 45,
    soldPct: 47,
    ticketsLeft: 44,
    yield: 179,
  },
  {
    id: "group-d",
    label: "Group D",
    originalPrice: 50,
    currentPrice: 50,
    recPrice: 45,
    soldPct: 35,
    ticketsLeft: 51,
    yield: 165,
  },
  {
    id: "group-e",
    label: "Group E",
    originalPrice: 50,
    currentPrice: 50,
    recPrice: 45,
    soldPct: 31,
    ticketsLeft: 54,
    yield: 159,
  },
  {
    id: "ga",
    label: "GA",
    originalPrice: 50,
    currentPrice: 50,
    recPrice: 45,
    soldPct: 62,
    ticketsLeft: 65,
    yield: 171,
  },
  {
    id: "hall-reserved",
    label: "Hall Reserved",
    originalPrice: 50,
    currentPrice: 50,
    recPrice: 45,
    soldPct: 28,
    ticketsLeft: 39,
    yield: 151,
  },
];

const reportingYieldRows: ReportingYieldRow[] = [
  { id: "y-1", ticketsSold: 58, sellThroughPct: 100, yield: 250, grossYield: 250 },
  { id: "y-2", ticketsSold: 44, sellThroughPct: 39, yield: 207, grossYield: 207 },
  { id: "y-3", ticketsSold: 18, sellThroughPct: 36, yield: 250, grossYield: 250 },
  { id: "y-4", ticketsSold: 32, sellThroughPct: 100, yield: 226, grossYield: 226 },
  { id: "y-5", ticketsSold: 20, sellThroughPct: 56, yield: 217, grossYield: 217 },
  { id: "y-6", ticketsSold: 49, sellThroughPct: 75, yield: 160, grossYield: 162 },
  { id: "y-7", ticketsSold: 4, sellThroughPct: 50, yield: 191, grossYield: 191 },
  { id: "y-8", ticketsSold: 18, sellThroughPct: 16, yield: 159, grossYield: 159 },
  { id: "y-9", ticketsSold: 54, sellThroughPct: 6, yield: 84, grossYield: 84 },
];

const comparablePaceRows: ComparablePaceRow[] = [
  { id: "c-0", phase: "Presale", ticketsSold: 0, soldPct: 0, compYield: 0 },
  { id: "c-1", phase: "0%", ticketsSold: 19, soldPct: 6, compYield: 83 },
  { id: "c-2", phase: "10%", ticketsSold: 38, soldPct: 11, compYield: 78 },
  { id: "c-3", phase: "20%", ticketsSold: 79, soldPct: 23, compYield: 81 },
  { id: "c-4", phase: "30%", ticketsSold: 100, soldPct: 30, compYield: 79 },
  { id: "c-5", phase: "40%", ticketsSold: 122, soldPct: 36, compYield: 74 },
  { id: "c-6", phase: "50%", ticketsSold: 275, soldPct: 82, compYield: 75 },
  { id: "c-7", phase: "60%", ticketsSold: 280, soldPct: 84, compYield: 75 },
  { id: "c-8", phase: "70%", ticketsSold: 290, soldPct: 87, compYield: 77 },
  { id: "c-9", phase: "80%", ticketsSold: 290, soldPct: 87, compYield: 77 },
  { id: "c-10", phase: "90%", ticketsSold: 290, soldPct: 87, compYield: 77 },
  { id: "c-11", phase: "100%", ticketsSold: 290, soldPct: 87, compYield: 77 },
  { id: "c-12", phase: "Post-Event", ticketsSold: 290, soldPct: 87, compYield: 77 },
];

const baseEventHealthTrend: EventHealthTrendPoint[] = [
  { id: "h-1", label: "8w", health: 43, target: 55 },
  { id: "h-2", label: "7w", health: 47, target: 57 },
  { id: "h-3", label: "6w", health: 51, target: 59 },
  { id: "h-4", label: "5w", health: 54, target: 62 },
  { id: "h-5", label: "4w", health: 57, target: 66 },
  { id: "h-6", label: "3w", health: 61, target: 70 },
  { id: "h-7", label: "2w", health: 66, target: 74 },
  { id: "h-8", label: "1w", health: 69, target: 78 },
  { id: "h-9", label: "Now", health: 72, target: 80 },
];

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function buildEventHealthTrend(event: EventRecord | undefined): EventHealthTrendPoint[] {
  const soldBias = event?.soldPct === null || event?.soldPct === undefined ? 0 : (event.soldPct - 60) * 0.35;
  const attentionBias = event?.attention === "underperforming" ? -8 : 0;

  return baseEventHealthTrend.map((point, index, array) => {
    const momentum = (index / (array.length - 1)) * 4 - 2;
    const adjustedHealth = Math.round(clamp(point.health + soldBias + attentionBias + momentum, 15, 96));

    return {
      ...point,
      health: adjustedHealth,
    };
  });
}

const offerSeedRows: ReportingOfferRow[] = [
  {
    id: "o-1",
    offer: "Lorem Ips",
    type: "Reserved",
    amountLabel: "40%",
    startLabel: "10/5/26",
    endLabel: "10/11/26",
    published: true,
  },
  {
    id: "o-2",
    offer: "Lorem Ips",
    type: "Reserved",
    amountLabel: "40%",
    startLabel: "10/5/26",
    endLabel: "10/11/26",
    published: true,
  },
  {
    id: "o-3",
    offer: "Lorem Ips",
    type: "Reserved",
    amountLabel: "40%",
    startLabel: "10/5/26",
    endLabel: "10/11/26",
    published: true,
  },
  {
    id: "o-4",
    offer: "Lorem Ips",
    type: "Reserved",
    amountLabel: "40%",
    startLabel: "10/5/26",
    endLabel: "10/11/26",
    published: true,
  },
  {
    id: "o-5",
    offer: "Lorem Ips",
    type: "Reserved",
    amountLabel: "40%",
    startLabel: "10/5/26",
    endLabel: "10/11/26",
    published: true,
  },
];

const discountRows: ReportingDiscountRow[] = [
  {
    id: "d-1",
    discount: "Lorem Ips",
    code: "COSM",
    amountLabel: "40%",
    startLabel: "10/5/26",
    endLabel: "10/11/26",
  },
  {
    id: "d-2",
    discount: "Lorem Ips",
    code: "COSM",
    amountLabel: "40%",
    startLabel: "10/5/26",
    endLabel: "10/11/26",
  },
];

function cloneReportingPricingRows(rows: ReportingPricingRow[]): ReportingPricingRow[] {
  return rows.map((row) => ({ ...row }));
}

function roundTo(value: number, decimals = 0): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function arePriceValuesEqual(left: number | null, right: number | null): boolean {
  if (left === null || right === null) {
    return left === right;
  }

  return Math.abs(left - right) < 0.005;
}

function healthRecommendationAdjustmentPct(healthScore: number): number {
  if (healthScore >= 80) {
    return 10;
  }
  if (healthScore >= 68) {
    return 6;
  }
  if (healthScore >= 55) {
    return 2;
  }
  if (healthScore >= 40) {
    return -4;
  }
  return -8;
}

function healthAdjustedRecommendation(basePrice: number, healthScore: number): number {
  const adjustment = healthRecommendationAdjustmentPct(healthScore);
  const nextPrice = basePrice * (1 + adjustment / 100);
  return roundTo(Math.max(1, nextPrice), 2);
}

function applyNumericBulkEdit(
  currentValue: number | null,
  rawValue: string,
  mode: NumericBulkEditMode,
): number | null {
  const parsedValue = Number.parseFloat(rawValue);
  if (!Number.isFinite(parsedValue)) {
    return currentValue;
  }

  if (mode === "set") {
    return roundTo(Math.max(0, parsedValue), 2);
  }

  if (currentValue === null) {
    return currentValue;
  }

  if (mode === "flat") {
    return roundTo(Math.max(0, currentValue + parsedValue), 2);
  }

  return roundTo(Math.max(0, currentValue * (1 + parsedValue / 100)), 2);
}

function estimateTicketsSoldFromSeatGroup(soldPct: number, ticketsLeft: number): number {
  if (soldPct <= 0) {
    return 0;
  }
  if (soldPct >= 100) {
    return ticketsLeft > 0 ? ticketsLeft * 4 : 0;
  }
  return Math.round((ticketsLeft * soldPct) / (100 - soldPct));
}

function buildReportingPricingRows(event: EventRecord | undefined): ReportingPricingRow[] {
  if (!event || event.seatGroups.length === 0) {
    return cloneReportingPricingRows(fallbackReportingPricingRows);
  }

  return event.seatGroups.map((seatGroup) => ({
    id: seatGroup.id,
    label: seatGroup.name,
    originalPrice: seatGroup.originalPrice,
    currentPrice: seatGroup.currentPrice,
    recPrice: seatGroup.recTicketPrice,
    soldPct: event.status === "On Sale" ? seatGroup.soldPct : null,
    ticketsLeft: event.status === "On Sale" ? seatGroup.ticketsRemaining : null,
    yield: event.status === "On Sale" ? seatGroup.yield : null,
  }));
}

function buildTrendSeries(
  labels: string[],
  actualFinal: number,
  expectedFinal: number,
  volatility: number,
): MetricTrendPoint[] {
  const finalActual = Math.max(0, actualFinal);
  const finalExpected = Math.max(0, expectedFinal);
  const precision = Math.max(finalActual, finalExpected) < 10 ? 2 : Math.max(finalActual, finalExpected) < 100 ? 1 : 0;

  return labels.map((label, index) => {
    const progress = (index + 1) / labels.length;
    const curve = Math.pow(progress, 1.15);
    const wave = Math.sin(progress * Math.PI * 1.2) * volatility;

    const expected = index === labels.length - 1 ? finalExpected : finalExpected * curve;
    const actual =
      index === labels.length - 1 ? finalActual : Math.max(0, finalActual * curve * (1 + wave * 0.14));

    return {
      id: `trend-${label}`,
      label,
      actual: roundTo(actual, precision),
      expected: roundTo(expected, precision),
    };
  });
}

function buildEventPerformanceModel(
  event: EventRecord,
  pricingRows: ReportingPricingRow[],
): EventPerformanceModel {
  const mode: EventPerformanceModel["mode"] = event.status === "On Sale" ? "active" : "future";
  const soldPctBase = event.soldPct ?? 0;
  const daysInMarket = event.daysInMarket ?? 0;
  const salesWindowDays =
    event.salesWindowDays ?? Math.max(daysInMarket + (event.daysRemaining ?? 0), 1);
  const salesWindowPassedPct = clamp(Math.round((daysInMarket / Math.max(1, salesWindowDays)) * 100), 0, 100);

  const ticketSummary = pricingRows.reduce(
    (accumulator, row) => {
      if (row.soldPct === null || row.ticketsLeft === null) {
        return accumulator;
      }

      const soldTickets = estimateTicketsSoldFromSeatGroup(row.soldPct, row.ticketsLeft);
      return {
        sold: accumulator.sold + soldTickets,
        remaining: accumulator.remaining + row.ticketsLeft,
      };
    },
    { sold: 0, remaining: 0 },
  );

  const fallbackCapacity = 1200;
  const fallbackSold = Math.round((soldPctBase / 100) * fallbackCapacity);
  const ticketsSoldTotal = ticketSummary.sold > 0 ? ticketSummary.sold : fallbackSold;
  const ticketsRemainingTotal =
    ticketSummary.remaining > 0 ? ticketSummary.remaining : Math.max(0, fallbackCapacity - fallbackSold);

  const projectedNetRevenueCurrent =
    Math.round(event.projectedRevenue ?? pricingRows.reduce((sum, row) => sum + row.currentPrice * 65, 0)) || 0;
  const recommendedMultiplier =
    event.domeAtp && event.recAtp ? event.recAtp / event.domeAtp : 1.06;
  const projectedNetRevenueRecommended = Math.round(
    projectedNetRevenueCurrent * clamp(recommendedMultiplier * 1.03, 1.01, 1.26),
  );

  const pricingOpportunity = projectedNetRevenueRecommended - projectedNetRevenueCurrent;
  const pricingOpportunityPct =
    projectedNetRevenueCurrent > 0
      ? roundTo((pricingOpportunity / projectedNetRevenueCurrent) * 100, 1)
      : 0;

  let expectedSellthroughNow =
    mode === "active"
      ? clamp(Math.round(salesWindowPassedPct * 0.93 + 7), 6, 96)
      : clamp(Math.round(68 + pricingOpportunityPct * 0.35), 10, 95);

  let actualSellthroughNow =
    mode === "active"
      ? soldPctBase
      : clamp(Math.round(expectedSellthroughNow + 5 + (event.recAtp ? 2 : 0)), 10, 98);

  let expectedRevenueNow =
    mode === "active"
      ? Math.round(projectedNetRevenueCurrent * clamp(expectedSellthroughNow / 100, 0.1, 0.98))
      : Math.round(projectedNetRevenueCurrent * 0.9);

  let currentNetRevenue =
    mode === "active"
      ? Math.round(projectedNetRevenueCurrent * clamp(actualSellthroughNow / 100, 0.1, 1))
      : projectedNetRevenueCurrent;

  if (expectedRevenueNow <= 0) {
    expectedRevenueNow = Math.round(projectedNetRevenueCurrent * 0.6);
  }

  if (currentNetRevenue <= 0) {
    currentNetRevenue = Math.round(projectedNetRevenueCurrent * 0.65);
    actualSellthroughNow = clamp(Math.round(expectedSellthroughNow * 0.9), 0, 100);
  }

  const expectedRevenueDelta = currentNetRevenue - expectedRevenueNow;
  const revenueVsExpectedPct =
    expectedRevenueNow > 0 ? roundTo((expectedRevenueDelta / expectedRevenueNow) * 100, 1) : 0;
  const sellthroughVsExpectedPts = roundTo(actualSellthroughNow - expectedSellthroughNow, 1);

  const currentGrossRevenue = Math.round(currentNetRevenue / 0.855);
  const domeGrossRevenue = Math.round(currentGrossRevenue * 0.73);
  const hallGrossRevenue = currentGrossRevenue - domeGrossRevenue;
  const domeNetRevenue = Math.round(domeGrossRevenue * 0.87);
  const hallNetRevenue = Math.round(hallGrossRevenue * 0.82);

  const adSpend =
    mode === "active"
      ? Math.round(30000 + actualSellthroughNow * 920)
      : Math.round(22000 + projectedNetRevenueCurrent * 0.055);
  const roas = roundTo(currentNetRevenue / Math.max(1, adSpend), 2);
  const compRoas = roundTo(
    roas *
      (mode === "active"
        ? event.attention === "underperforming"
          ? 1.12
          : 0.95
        : 0.96),
    2,
  );

  const funnelEntries =
    mode === "active"
      ? Math.round(18000 + actualSellthroughNow * 340)
      : Math.round(23000 + projectedNetRevenueRecommended * 0.09);
  const funnelCompletion = roundTo(
    mode === "active"
      ? clamp(1.4 + actualSellthroughNow * 0.046, 0.4, 8.9)
      : clamp(1.9 + pricingOpportunityPct * 0.11, 0.5, 8.9),
    2,
  );
  const compFunnelEntries = Math.round(
    funnelEntries * (mode === "active" ? 0.94 : 0.9),
  );
  const compFunnelCompletion = roundTo(
    funnelCompletion - (mode === "active" ? 0.34 : 0.22),
    2,
  );

  const averageYield =
    pricingRows.filter((row) => row.yield !== null).reduce((sum, row) => sum + (row.yield ?? 0), 0) /
    Math.max(1, pricingRows.filter((row) => row.yield !== null).length);
  const yieldScore = clamp((averageYield / 210) * 100, 0, 130);
  const revenueAttainment = clamp((currentNetRevenue / Math.max(1, expectedRevenueNow)) * 100, 0, 180);
  const sellthroughAttainment = clamp(
    (actualSellthroughNow / Math.max(1, expectedSellthroughNow)) * 100,
    0,
    180,
  );
  const marketingScore = clamp((roas / Math.max(0.01, compRoas)) * 100, 0, 160);
  const healthScore = Math.round(
    clamp(
      revenueAttainment * 0.34 + sellthroughAttainment * 0.28 + yieldScore * 0.2 + marketingScore * 0.18,
      0,
      100,
    ),
  );

  const pricingOpportunityScore = Math.round(
    clamp(pricingOpportunityPct * 2.1 + (mode === "active" ? 10 : 20), 0, 100),
  );

  const riskFlag: EventPerformanceModel["riskFlag"] =
    mode === "future"
      ? "Pre-Sale Planning"
      : healthScore < 55
        ? "Underperforming"
        : "On Track";

  const timelineLabels = baseEventHealthTrend.map((point) => point.label);
  const revenueTrend = buildTrendSeries(
    timelineLabels,
    currentNetRevenue,
    expectedRevenueNow,
    revenueVsExpectedPct / 100,
  );
  const sellthroughTrend = buildTrendSeries(
    timelineLabels,
    actualSellthroughNow,
    expectedSellthroughNow,
    sellthroughVsExpectedPts / 100,
  );
  const funnelEntriesTrend = buildTrendSeries(
    timelineLabels,
    funnelEntries,
    compFunnelEntries,
    (funnelEntries - compFunnelEntries) / Math.max(1, compFunnelEntries),
  );
  const funnelCompletionTrend = buildTrendSeries(
    timelineLabels,
    funnelCompletion,
    compFunnelCompletion,
    (funnelCompletion - compFunnelCompletion) / Math.max(0.25, compFunnelCompletion),
  );
  const roasTrend = buildTrendSeries(
    timelineLabels,
    roas,
    compRoas,
    (roas - compRoas) / Math.max(0.1, compRoas),
  );

  return {
    mode,
    currentGrossRevenue,
    currentNetRevenue,
    expectedRevenueNow,
    projectedNetRevenueCurrent,
    projectedNetRevenueRecommended,
    revenueVsExpectedPct,
    actualSellthroughNow,
    expectedSellthroughNow,
    sellthroughVsExpectedPts,
    expectedRevenueDelta,
    pricingOpportunity,
    pricingOpportunityPct,
    pricingOpportunityScore,
    healthScore,
    riskFlag,
    domeGrossRevenue,
    domeNetRevenue,
    hallGrossRevenue,
    hallNetRevenue,
    ticketsSoldTotal,
    ticketsRemainingTotal,
    roas,
    compRoas,
    adSpend,
    funnelEntries,
    funnelCompletion,
    compFunnelEntries,
    compFunnelCompletion,
    revenueTrend,
    sellthroughTrend,
    funnelEntriesTrend,
    funnelCompletionTrend,
    roasTrend,
  };
}

function formatCompactDateTime(value: number): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(value);
}

function formatStartDate(value: number): string {
  const d = new Date(value);
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}

function formatStartTime(value: number): string {
  const d = new Date(value);
  const hours = d.getHours();
  const minutes = d.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const h = hours % 12 || 12;
  const m = minutes.toString().padStart(2, "0");
  return `${h}:${m}${ampm}`;
}

function formatDollarInteger(value: number): string {
  return `$${value.toLocaleString("en-US")}`;
}

function formatCompactNumber(value: number): string {
  if (Math.abs(value) >= 1_000_000) {
    return `${roundTo(value / 1_000_000, 1)}M`;
  }
  if (Math.abs(value) >= 1_000) {
    return `${roundTo(value / 1_000, 1)}K`;
  }
  return `${Math.round(value)}`;
}

function parsePercentLabel(label: string): number {
  const match = label.match(/-?\d+(\.\d+)?/);
  if (!match) {
    return 0;
  }
  const parsed = Number.parseFloat(match[0]);
  return Number.isFinite(parsed) ? parsed : 0;
}

function averageOfferDiscountPct(rows: ReportingOfferRow[]): number {
  if (rows.length === 0) {
    return 0;
  }
  const total = rows.reduce((sum, row) => sum + parsePercentLabel(row.amountLabel), 0);
  return roundTo(total / rows.length, 1);
}

interface ComparisonChartPoint {
  id: string;
  label: string;
  x: number;
  actualY: number;
  expectedY: number;
  actual: number;
  expected: number;
}

interface ComparisonChartGeometry {
  width: number;
  height: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
  baseY: number;
  yMax: number;
  yTicks: number[];
  points: ComparisonChartPoint[];
  actualPath: string;
  expectedPath: string;
  areaPath: string;
}

function getNiceTickStep(value: number): number {
  if (value <= 1) {
    return 0.1;
  }
  if (value <= 2.5) {
    return 0.25;
  }
  if (value <= 5) {
    return 0.5;
  }
  if (value <= 10) {
    return 1;
  }
  if (value <= 25) {
    return 2.5;
  }
  if (value <= 50) {
    return 5;
  }
  if (value <= 100) {
    return 10;
  }
  if (value <= 500) {
    return 50;
  }
  if (value <= 2_000) {
    return 200;
  }
  if (value <= 10_000) {
    return 1_000;
  }
  if (value <= 50_000) {
    return 5_000;
  }
  if (value <= 250_000) {
    return 25_000;
  }
  return 50_000;
}

function buildComparisonChartGeometry(
  series: MetricTrendPoint[],
  fixedMax?: number,
): ComparisonChartGeometry {
  const width = 860;
  const height = 270;
  const left = 50;
  const right = 16;
  const top = 16;
  const bottom = 36;

  const drawableWidth = width - left - right;
  const drawableHeight = height - top - bottom;

  const yMaxFromData = Math.max(
    1,
    ...series.flatMap((point) => [point.actual, point.expected]),
  );
  const yMax =
    fixedMax ??
    Math.ceil(yMaxFromData / getNiceTickStep(yMaxFromData)) * getNiceTickStep(yMaxFromData);
  const tickPrecision = yMax <= 10 ? 2 : yMax <= 100 ? 1 : 0;

  const points = series.map((point, index) => {
    const x = left + (index / Math.max(1, series.length - 1)) * drawableWidth;
    const actualY = top + ((yMax - point.actual) / yMax) * drawableHeight;
    const expectedY = top + ((yMax - point.expected) / yMax) * drawableHeight;

    return {
      id: point.id,
      label: point.label,
      x,
      actualY,
      expectedY,
      actual: point.actual,
      expected: point.expected,
    };
  });

  const actualPath = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(1)} ${point.actualY.toFixed(1)}`)
    .join(" ");
  const expectedPath = points
    .map(
      (point, index) =>
        `${index === 0 ? "M" : "L"} ${point.x.toFixed(1)} ${point.expectedY.toFixed(1)}`,
    )
    .join(" ");
  const areaPath = `${actualPath} L ${points[points.length - 1]?.x.toFixed(1) ?? left} ${(height - bottom).toFixed(1)} L ${points[0]?.x.toFixed(1) ?? left} ${(height - bottom).toFixed(1)} Z`;

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => roundTo(yMax * ratio, tickPrecision));

  return {
    width,
    height,
    left,
    right,
    top,
    bottom,
    baseY: height - bottom,
    yMax,
    yTicks,
    points,
    actualPath,
    expectedPath,
    areaPath,
  };
}

type ReportingTab = "performance" | "pricing-details";
type PerformanceMetricView = "revenue" | "funnel-entries" | "funnel-completion" | "sold" | "roas";

function EventRoutePlaceholder({
  title,
  event,
  onBack,
}: {
  title: string;
  event: EventRecord | undefined;
  onBack: () => void;
}) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(9,119,180,0.12),_transparent_42%),linear-gradient(180deg,_hsl(210_33%_98%)_0%,_hsl(210_30%_95%)_100%)] px-4 py-8 pb-28 sm:px-6 lg:px-8">
      <main className="mx-auto max-w-4xl rounded-2xl border bg-card p-8 shadow-[0_24px_70px_-45px_rgba(15,23,42,0.65)]">
        <p className="text-sm font-medium uppercase tracking-[0.14em] text-muted-foreground">Event Route</p>
        <h1 className="mt-2 font-heading text-3xl font-semibold">{title}</h1>
        <p className="mt-2 text-muted-foreground">
          {event
            ? `Event: ${event.event} · Venue: ${event.venueName}`
            : "Event not found. This route is wired and ready for the next screen build."}
        </p>

        <div className="mt-6 rounded-lg border bg-secondary/40 p-4 text-sm text-muted-foreground">
          Placeholder route implemented for v1 navigation. We can replace this with full seatmap and
          reporting screens next.
        </div>

        <Button className="mt-6" onClick={onBack}>
          Back to Price Adjustment
        </Button>
      </main>
    </div>
  );
}

function computeSgTicketsSold(sg: SeatGroup): number | null {
  if (sg.soldPct <= 0) return 0;
  if (sg.soldPct >= 100) return null;
  return Math.round((sg.ticketsRemaining * sg.soldPct) / (100 - sg.soldPct));
}

function EventReportingDashboard({
  event,
  onBack,
  onOpenSeatmap,
}: {
  event: EventRecord | undefined;
  onBack: () => void;
  onOpenSeatmap: () => void;
}) {
  const initialPricingRows = useMemo(() => buildReportingPricingRows(event), [event]);
  const initialDiscountRate = useMemo(() => averageOfferDiscountPct(offerSeedRows), []);
  const [savedPricingRows, setSavedPricingRows] =
    useState<ReportingPricingRow[]>(initialPricingRows);
  const [pricingRows, setPricingRows] = useState<ReportingPricingRow[]>(initialPricingRows);
  const [offerRows, setOfferRows] = useState<ReportingOfferRow[]>(() =>
    offerSeedRows.map((offer) => ({ ...offer })),
  );
  const [savedDiscountRate, setSavedDiscountRate] = useState<number>(initialDiscountRate);
  const [discountRate, setDiscountRate] = useState<number>(initialDiscountRate);
  const [savedMarketingSpend, setSavedMarketingSpend] = useState<number>(0);
  const [marketingSpend, setMarketingSpend] = useState<number>(0);
  const [showPublishOverlay, setShowPublishOverlay] = useState(false);
  const [showRecommendedReviewModal, setShowRecommendedReviewModal] = useState(false);
  const [recommendedReviewValuesById, setRecommendedReviewValuesById] = useState<Record<string, string>>({});
  const [pricingRecommendationUndoById, setPricingRecommendationUndoById] = useState<Record<string, number>>({});
  const [activeTab, setActiveTab] = useState<ReportingTab>("performance");
  const [activePerformanceMetric, setActivePerformanceMetric] = useState<PerformanceMetricView>("revenue");
  const [editingPricingRowId, setEditingPricingRowId] = useState<string | null>(null);
  const [editingPricingValue, setEditingPricingValue] = useState<string>("");
  const [hoveredPerformanceMetricPointId, setHoveredPerformanceMetricPointId] = useState<string | null>(null);

  useEffect(() => {
    const nextRows = buildReportingPricingRows(event);
    const nextPerformance = event ? buildEventPerformanceModel(event, nextRows) : null;
    const nextMarketingSpend = nextPerformance?.adSpend ?? 0;
    setSavedPricingRows(nextRows);
    setPricingRows(cloneReportingPricingRows(nextRows));
    setOfferRows(offerSeedRows.map((offer) => ({ ...offer })));
    setSavedDiscountRate(initialDiscountRate);
    setDiscountRate(initialDiscountRate);
    setSavedMarketingSpend(nextMarketingSpend);
    setMarketingSpend(nextMarketingSpend);
    setShowPublishOverlay(false);
    setShowRecommendedReviewModal(false);
    setRecommendedReviewValuesById({});
    setPricingRecommendationUndoById({});
    setActiveTab("performance");
    setActivePerformanceMetric("revenue");
    setEditingPricingRowId(null);
    setEditingPricingValue("");
    setHoveredPerformanceMetricPointId(null);
  }, [event?.id, event?.priceTier, event?.seatGroups, initialDiscountRate]);

  useEffect(() => {
    if (!showPublishOverlay) {
      return;
    }

    const timeoutId = window.setTimeout(() => setShowPublishOverlay(false), 2200);
    return () => window.clearTimeout(timeoutId);
  }, [showPublishOverlay]);

  const savedPricingById = useMemo(
    () => new Map(savedPricingRows.map((row) => [row.id, row.currentPrice])),
    [savedPricingRows],
  );
  const pricingDraftCount = useMemo(
    () =>
      pricingRows.reduce(
        (count, row) => count + (savedPricingById.get(row.id) !== row.currentPrice ? 1 : 0),
        0,
      ),
    [pricingRows, savedPricingById],
  );
  const hasDiscountDraft = !arePriceValuesEqual(discountRate, savedDiscountRate);
  const hasMarketingDraft = !arePriceValuesEqual(marketingSpend, savedMarketingSpend);
  const stagedActionCount = pricingDraftCount + (hasDiscountDraft ? 1 : 0) + (hasMarketingDraft ? 1 : 0);

  const unsavedChanges = useMemo(() => {
    return stagedActionCount > 0;
  }, [stagedActionCount]);

  const eventPerformance = useMemo(
    () => (event ? buildEventPerformanceModel(event, pricingRows) : null),
    [event, pricingRows],
  );

  const yieldTotals = useMemo(() => {
    const totals = reportingYieldRows.reduce(
      (accumulator, row) => {
        return {
          ticketsSold: accumulator.ticketsSold + row.ticketsSold,
          sellThroughPct: accumulator.sellThroughPct + row.sellThroughPct,
          yield: accumulator.yield + row.yield,
          grossYield: accumulator.grossYield + row.grossYield,
        };
      },
      {
        ticketsSold: 0,
        sellThroughPct: 0,
        yield: 0,
        grossYield: 0,
      },
    );

    return {
      ticketsSold: totals.ticketsSold,
      sellThroughPct: Math.round(totals.sellThroughPct / reportingYieldRows.length),
      yield: Math.round(totals.yield / reportingYieldRows.length),
      grossYield: Math.round(totals.grossYield / reportingYieldRows.length),
    };
  }, []);

  const startTimeLabel = event ? formatCompactDateTime(event.startTimeValue) : "--";
  const tosTimeLabel = event ? formatCompactDateTime(event.startTimeValue - 7 * 24 * 60 * 60 * 1000) : "--";
  const daysRemainingLabel = event?.daysRemaining ?? "--";
  const daysInMarketLabel = event?.daysInMarket ?? "--";
  const salesWindowLabel = event?.salesWindowDays ?? "--";
  const salesWindowPassedPct =
    event?.daysInMarket !== null &&
    event?.daysInMarket !== undefined &&
    event?.salesWindowDays !== null &&
    event?.salesWindowDays !== undefined
      ? clamp(Math.round((event.daysInMarket / Math.max(1, event.salesWindowDays)) * 100), 0, 100)
      : event?.daysRemaining === null || event?.daysRemaining === undefined
        ? 0
        : clamp(Math.round(((28 - event.daysRemaining) / 28) * 100), 0, 100);
  const salesWindowPassedLabel =
    event?.status === "Unpublished" ? "--" : `${salesWindowPassedPct}%`;

  const eventHealthTrend = useMemo(
    () => buildEventHealthTrend(event),
    [event?.id, event?.soldPct, event?.attention],
  );
  const latestHealthScore = eventPerformance?.healthScore ?? eventHealthTrend[eventHealthTrend.length - 1]?.health ?? 0;
  const recommendationAdjustmentPct = healthRecommendationAdjustmentPct(latestHealthScore);
  const recommendationDirectionLabel =
    recommendationAdjustmentPct >= 0 ? "Lift pricing bias" : "Demand stimulation bias";
  const recommendedDiscountRate = clamp(
    roundTo(
      discountRate +
        (latestHealthScore < 55 ? 5 : latestHealthScore >= 75 ? -4 : 2),
      1,
    ),
    0,
    80,
  );
  const recommendedMarketingSpend = Math.max(
    0,
    Math.round(
      marketingSpend *
        (latestHealthScore < 55 ? 1.12 : latestHealthScore >= 75 ? 0.94 : 1.03),
    ),
  );
  const currentPricingProjection = eventPerformance?.projectedNetRevenueCurrent ?? 0;
  const recommendedPricingProjection = eventPerformance?.projectedNetRevenueRecommended ?? 0;
  const currentNetProjectionAfterActions = Math.round(
    currentPricingProjection * (1 - discountRate / 100) - marketingSpend,
  );
  const projectedNetAfterActions = Math.round(
    recommendedPricingProjection * (1 - recommendedDiscountRate / 100) - recommendedMarketingSpend,
  );
  const netProjectionDelta = projectedNetAfterActions - currentNetProjectionAfterActions;
  const currentSeatGroupPrice = useMemo(
    () =>
      pricingRows.length === 0
        ? 0
        : roundTo(
            pricingRows.reduce((sum, row) => sum + row.currentPrice, 0) / pricingRows.length,
            2,
          ),
    [pricingRows],
  );
  const recommendedSeatGroupPrice = useMemo(
    () =>
      pricingRows.length === 0
        ? 0
        : roundTo(
            pricingRows.reduce(
              (sum, row) => sum + healthAdjustedRecommendation(row.recPrice, latestHealthScore),
              0,
            ) / pricingRows.length,
            2,
          ),
    [latestHealthScore, pricingRows],
  );
  const recommendedReviewChangeRows = useMemo(() => {
    const nextRows: RecommendedReviewChangeRow[] = pricingRows.flatMap((row) => {
      const suggestedValue = healthAdjustedRecommendation(row.recPrice, latestHealthScore);
      if (arePriceValuesEqual(suggestedValue, row.currentPrice)) {
        return [];
      }

      return [
        {
          id: `seat-group-price-${row.id}`,
          rowLabel: row.label,
          contextLabel: "Seat Group Price",
          currentValue: row.currentPrice,
          suggestedValue,
          format: "currency" as const,
          inputStep: "0.01",
          inputDecimals: 2,
          target: { type: "seat-group-price" as const, rowId: row.id },
        },
      ];
    });

    if (!arePriceValuesEqual(recommendedDiscountRate, discountRate)) {
      nextRows.push({
        id: "offer-rate",
        rowLabel: "Offer Rate",
        contextLabel: "Recommended Actions",
        currentValue: discountRate,
        suggestedValue: recommendedDiscountRate,
        format: "percent",
        inputStep: "0.1",
        inputDecimals: 1,
        maximum: 80,
        target: { type: "offer-rate" },
      });
    }

    if (!arePriceValuesEqual(recommendedMarketingSpend, marketingSpend)) {
      nextRows.push({
        id: "marketing-spend",
        rowLabel: "Marketing Spend",
        contextLabel: "Recommended Actions",
        currentValue: marketingSpend,
        suggestedValue: recommendedMarketingSpend,
        format: "currency",
        inputStep: "1",
        inputDecimals: 0,
        target: { type: "marketing-spend" },
      });
    }

    return nextRows;
  }, [
    pricingRows,
    latestHealthScore,
    recommendedDiscountRate,
    discountRate,
    recommendedMarketingSpend,
    marketingSpend,
  ]);
  const actionProjectionSeries = useMemo(
    () => {
      const labels = baseEventHealthTrend.map((point) => point.label);
      const currentProjectionBase = Math.max(currentPricingProjection, eventPerformance?.currentNetRevenue ?? 0, 25_000);
      const expectedProjectionBase = Math.max(
        recommendedPricingProjection,
        currentProjectionBase * 1.08,
        28_000,
      );

      return buildTrendSeries(
        labels,
        currentProjectionBase,
        expectedProjectionBase,
        0.08,
      );
    },
    [currentPricingProjection, eventPerformance?.currentNetRevenue, recommendedPricingProjection],
  );
  const actionProjectionChart = useMemo(
    () => buildComparisonChartGeometry(actionProjectionSeries),
    [actionProjectionSeries],
  );
  const emptyMetricTrend = useMemo(
    () =>
      baseEventHealthTrend.map((point) => ({
        id: `fallback-${point.id}`,
        label: point.label,
        actual: 0,
        expected: 0,
      })),
    [],
  );
  const activePerformanceMetricConfig = useMemo(() => {
    switch (activePerformanceMetric) {
      case "funnel-entries":
        return {
          title: "Funnel Entries",
          description: "Traffic volume versus comparable funnel-entry pace.",
          actualLabel: "Actual Funnel Entries",
          expectedLabel: "Comparable Funnel Entries",
          series: eventPerformance?.funnelEntriesTrend ?? emptyMetricTrend,
          actualStroke: "hsl(var(--primary))",
          areaColor: "hsl(var(--primary))",
          fixedMax: undefined,
          formatAxis: (value: number) => formatCompactNumber(value),
          formatTooltip: (value: number) => formatCompactNumber(value),
          formatVariance: (actual: number, expected: number) =>
            `${actual - expected >= 0 ? "+" : ""}${formatCompactNumber(actual - expected)}`,
        };
      case "funnel-completion":
        return {
          title: "Funnel Completion",
          description: "Conversion completion rate against comparable benchmark.",
          actualLabel: "Actual Funnel Completion",
          expectedLabel: "Comparable Funnel Completion",
          series: eventPerformance?.funnelCompletionTrend ?? emptyMetricTrend,
          actualStroke: "hsl(var(--warning))",
          areaColor: "hsl(var(--warning))",
          fixedMax: 10,
          formatAxis: (value: number) => `${roundTo(value, 1)}%`,
          formatTooltip: (value: number) => `${roundTo(value, 2)}%`,
          formatVariance: (actual: number, expected: number) =>
            `${actual - expected >= 0 ? "+" : ""}${roundTo(actual - expected, 2)} pts`,
        };
      case "sold":
        return {
          title: "% Sold",
          description: "Sales pace benchmarked to expected sellthrough curve.",
          actualLabel: "Actual % Sold",
          expectedLabel: "Expected % Sold",
          series: eventPerformance?.sellthroughTrend ?? emptyMetricTrend,
          actualStroke: "hsl(var(--success))",
          areaColor: "hsl(var(--success))",
          fixedMax: 100,
          formatAxis: (value: number) => `${roundTo(value, 1)}%`,
          formatTooltip: (value: number) => `${roundTo(value, 1)}%`,
          formatVariance: (actual: number, expected: number) =>
            `${actual - expected >= 0 ? "+" : ""}${roundTo(actual - expected, 1)} pts`,
        };
      case "roas":
        return {
          title: "ROAS",
          description: "Return on ad spend compared with comparable performance.",
          actualLabel: "Actual ROAS",
          expectedLabel: "Comparable ROAS",
          series: eventPerformance?.roasTrend ?? emptyMetricTrend,
          actualStroke: "hsl(var(--accent-foreground))",
          areaColor: "hsl(var(--accent-foreground))",
          fixedMax: undefined,
          formatAxis: (value: number) => `${roundTo(value, 1)}x`,
          formatTooltip: (value: number) => `${roundTo(value, 2)}x`,
          formatVariance: (actual: number, expected: number) =>
            `${actual - expected >= 0 ? "+" : ""}${roundTo(actual - expected, 2)}x`,
        };
      case "revenue":
      default:
        return {
          title: "Revenue",
          description: "Net revenue accumulation against expected pace.",
          actualLabel: "Actual Revenue",
          expectedLabel: "Expected Revenue",
          series: eventPerformance?.revenueTrend ?? emptyMetricTrend,
          actualStroke: "hsl(var(--success))",
          areaColor: "hsl(var(--success))",
          fixedMax: undefined,
          formatAxis: (value: number) => `$${formatCompactNumber(value)}`,
          formatTooltip: (value: number) => formatCurrency(value),
          formatVariance: (actual: number, expected: number) =>
            `${actual - expected >= 0 ? "+" : ""}${formatCurrency(actual - expected)}`,
        };
    }
  }, [activePerformanceMetric, emptyMetricTrend, eventPerformance]);
  const activePerformanceTrendChart = useMemo(
    () =>
      buildComparisonChartGeometry(
        activePerformanceMetricConfig.series,
        activePerformanceMetricConfig.fixedMax,
      ),
    [activePerformanceMetricConfig],
  );
  const hoveredPerformanceMetricPoint =
    activePerformanceTrendChart.points.find((point) => point.id === hoveredPerformanceMetricPointId) ?? null;
  const riskBadgeVariant =
    eventPerformance?.riskFlag === "On Track"
      ? "secondary"
      : eventPerformance?.riskFlag === "Pre-Sale Planning"
        ? "outline"
        : "warning";

  const beginPricingRowEdit = (row: ReportingPricingRow) => {
    setEditingPricingRowId(row.id);
    setEditingPricingValue(String(row.currentPrice));
  };

  const cancelPricingRowEdit = () => {
    setEditingPricingRowId(null);
    setEditingPricingValue("");
  };

  const commitPricingRowEdit = () => {
    if (!editingPricingRowId) {
      return;
    }

    onCurrentPriceChange(editingPricingRowId, editingPricingValue);
    setEditingPricingRowId(null);
    setEditingPricingValue("");
  };

  const onCurrentPriceChange = (rowId: string, nextValue: string) => {
    const parsedValue = Number.parseFloat(nextValue);

    if (!Number.isFinite(parsedValue)) {
      return;
    }

    const normalizedValue = roundTo(Math.max(0, parsedValue), 2);
    setPricingRecommendationUndoById((current) => {
      if (!(rowId in current)) {
        return current;
      }

      const { [rowId]: _removed, ...rest } = current;
      return rest;
    });
    setPricingRows((current) =>
      current.map((row) =>
        row.id === rowId
          ? {
              ...row,
              currentPrice: normalizedValue,
            }
          : row,
      ),
    );
  };

  const applyPricingRecommendation = (rowId: string, currentPrice: number, recommendedPrice: number) => {
    if (arePriceValuesEqual(currentPrice, recommendedPrice)) {
      return;
    }

    setEditingPricingRowId(null);
    setEditingPricingValue("");
    setPricingRecommendationUndoById((current) => ({
      ...current,
      [rowId]: currentPrice,
    }));
    setPricingRows((current) =>
      current.map((row) =>
        row.id === rowId
          ? {
              ...row,
              currentPrice: recommendedPrice,
            }
          : row,
      ),
    );
  };

  const undoPricingRecommendation = (rowId: string) => {
    const previousPrice = pricingRecommendationUndoById[rowId];
    if (previousPrice === undefined) {
      return;
    }

    setPricingRows((current) =>
      current.map((row) =>
        row.id === rowId
          ? {
              ...row,
              currentPrice: previousPrice,
            }
          : row,
      ),
    );
    setPricingRecommendationUndoById((current) => {
      const { [rowId]: _removed, ...rest } = current;
      return rest;
    });
  };

  const openRecommendedReviewModal = () => {
    setRecommendedReviewValuesById(
      Object.fromEntries(
        recommendedReviewChangeRows.map((row) => [
          row.id,
          formatRecommendationReviewInputValue(row.suggestedValue, row.inputDecimals),
        ]),
      ),
    );
    setEditingPricingRowId(null);
    setEditingPricingValue("");
    setShowRecommendedReviewModal(true);
  };

  const onRecommendedReviewValueChange = (rowId: string, nextValue: string) => {
    setRecommendedReviewValuesById((current) => ({
      ...current,
      [rowId]: nextValue,
    }));
  };

  const getReviewedRecommendedValues = () => {
    const seatGroupPriceById = new Map<string, number>();
    let nextDiscountRateValue: number | null = null;
    let nextMarketingSpendValue: number | null = null;

    for (const row of recommendedReviewChangeRows) {
      const parsedValue = Number.parseFloat(recommendedReviewValuesById[row.id] ?? "");
      if (!Number.isFinite(parsedValue) || parsedValue < 0) {
        return;
      }

      if (row.maximum !== undefined && parsedValue > row.maximum) {
        return;
      }

      if (row.target.type === "seat-group-price") {
        seatGroupPriceById.set(row.target.rowId, roundTo(parsedValue, 2));
      }

      if (row.target.type === "offer-rate") {
        nextDiscountRateValue = clamp(roundTo(parsedValue, 1), 0, row.maximum ?? 80);
      }

      if (row.target.type === "marketing-spend") {
        nextMarketingSpendValue = Math.round(parsedValue);
      }
    }

    return { seatGroupPriceById, nextDiscountRateValue, nextMarketingSpendValue };
  };

  const stageReviewedRecommendedChanges = () => {
    const reviewedValues = getReviewedRecommendedValues();
    if (!reviewedValues) {
      return;
    }

    const { seatGroupPriceById, nextDiscountRateValue, nextMarketingSpendValue } = reviewedValues;

    setPricingRows((current) =>
      current.map((row) =>
        seatGroupPriceById.has(row.id)
          ? {
              ...row,
              currentPrice: seatGroupPriceById.get(row.id) ?? row.currentPrice,
            }
          : row,
      ),
    );

    if (nextDiscountRateValue !== null) {
      setDiscountRate(nextDiscountRateValue);
    }

    if (nextMarketingSpendValue !== null) {
      setMarketingSpend(nextMarketingSpendValue);
    }

    setPricingRecommendationUndoById({});
    setShowRecommendedReviewModal(false);
  };

  const publishReviewedRecommendedChanges = () => {
    const reviewedValues = getReviewedRecommendedValues();
    if (!reviewedValues) {
      return;
    }

    const { seatGroupPriceById, nextDiscountRateValue, nextMarketingSpendValue } = reviewedValues;
    const nextPricingRows = pricingRows.map((row) =>
      seatGroupPriceById.has(row.id)
        ? {
            ...row,
            currentPrice: seatGroupPriceById.get(row.id) ?? row.currentPrice,
          }
        : row,
    );
    const nextDiscountRate = nextDiscountRateValue ?? discountRate;
    const nextMarketingSpend = nextMarketingSpendValue ?? marketingSpend;

    setPricingRows(nextPricingRows);
    setSavedPricingRows(cloneReportingPricingRows(nextPricingRows));
    setDiscountRate(nextDiscountRate);
    setSavedDiscountRate(nextDiscountRate);
    setMarketingSpend(nextMarketingSpend);
    setSavedMarketingSpend(nextMarketingSpend);
    setEditingPricingRowId(null);
    setEditingPricingValue("");
    setPricingRecommendationUndoById({});
    setShowRecommendedReviewModal(false);
    setShowPublishOverlay(true);
  };

  const onPublishPricingChanges = () => {
    if (!unsavedChanges) {
      return;
    }

    setSavedPricingRows(cloneReportingPricingRows(pricingRows));
    setSavedDiscountRate(discountRate);
    setSavedMarketingSpend(marketingSpend);
    setEditingPricingRowId(null);
    setEditingPricingValue("");
    setPricingRecommendationUndoById({});
    setShowPublishOverlay(true);
  };

  const onDiscardPricingDraft = () => {
    setPricingRows(cloneReportingPricingRows(savedPricingRows));
    setDiscountRate(savedDiscountRate);
    setMarketingSpend(savedMarketingSpend);
    setEditingPricingRowId(null);
    setEditingPricingValue("");
    setShowPublishOverlay(false);
    setShowRecommendedReviewModal(false);
    setPricingRecommendationUndoById({});
  };

  const toggleOfferPublished = (offerId: string) => {
    setOfferRows((current) =>
      current.map((offer) =>
        offer.id === offerId ? { ...offer, published: !offer.published } : offer,
      ),
    );
  };

  if (!event) {
    return (
      <EventRoutePlaceholder
        title="Reporting"
        event={event}
        onBack={onBack}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(9,119,180,0.12),_transparent_42%),linear-gradient(180deg,_hsl(210_33%_98%)_0%,_hsl(210_30%_95%)_100%)] px-4 py-6 pb-28 sm:px-6 lg:px-8">
      <main className="mx-auto max-w-[1450px] rounded-2xl border bg-card p-4 shadow-[0_24px_70px_-45px_rgba(15,23,42,0.65)] sm:p-6 lg:p-8">
        <PublishedOverlay visible={showPublishOverlay} />
        <RecommendedReviewModal
          open={showRecommendedReviewModal}
          changeRows={recommendedReviewChangeRows}
          valueById={recommendedReviewValuesById}
          onValueChange={onRecommendedReviewValueChange}
          onCancel={() => setShowRecommendedReviewModal(false)}
          onConfirm={stageReviewedRecommendedChanges}
          onConfirmAndPublish={publishReviewedRecommendedChanges}
        />
        <header className="border-b pb-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onBack}
                className="flex items-center gap-2 font-heading text-4xl font-semibold tracking-tight text-foreground"
              >
                <ArrowLeft className="h-7 w-7" />
                <span className="text-3xl">{event.event}</span>
              </button>
              <Badge variant={eventPerformance?.mode === "active" ? "success" : "outline"}>
                {eventPerformance?.mode === "active" ? "Active Event" : "Future Event"}
              </Badge>
            </div>
            <Button variant="secondary" className="px-8 text-base">
              Reporting
            </Button>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-foreground/90">
            <span className="rounded bg-secondary px-2 py-0.5 font-medium">{event.venueName}</span>
            <span className="rounded bg-accent px-2 py-0.5 font-medium text-accent-foreground">
              {event.eventCategory}
            </span>
            <span>
              <span className="font-semibold">Weekday:</span> {event.weekdayLabel}
            </span>
            <span>
              <span className="font-semibold">Start Time:</span> {startTimeLabel}
            </span>
            <span>
              <span className="font-semibold">Local Time:</span> {event.localStartTimeLabel} {getVenueTimezone(event.venueName)}
            </span>
            <span>
              <span className="font-semibold">On-Sale Date:</span> {event.onSaleDateLabel}
            </span>
            <span>
              <span className="font-semibold">Days In-Market:</span> {daysInMarketLabel}
            </span>
            <span>
              <span className="font-semibold">Sales Window:</span> {salesWindowLabel}
            </span>
            <span>
              <span className="font-semibold">TOS Time:</span> {tosTimeLabel}
            </span>
            <span>
              <span className="font-semibold">Days Remaining:</span> {daysRemainingLabel}
            </span>
            <span>
              <span className="font-semibold">Sales Window Passed:</span> {salesWindowPassedLabel}
            </span>
          </div>
        </header>

        <div className="mt-6">
          <h2 className="mb-3 font-heading text-2xl font-semibold">Summary</h2>
          <section className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-lg border bg-secondary/20 p-3">
              <p className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                Health Score
              </p>
              <p className="mt-1 text-2xl font-semibold">{eventPerformance?.healthScore ?? "--"}</p>
            </div>
            <div className="rounded-lg border bg-secondary/20 p-3">
              <p className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">Risk Flag</p>
              <div className="mt-1">
                <Badge variant={riskBadgeVariant}>{eventPerformance?.riskFlag ?? "--"}</Badge>
              </div>
            </div>
            <div className="rounded-lg border bg-secondary/20 p-3">
              <p className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                {eventPerformance?.mode === "active"
                  ? "Net Revenue (Right Now)"
                  : "Projected Net Revenue (Current)"}
              </p>
              <p className="mt-1 text-2xl font-semibold">
                {formatCurrency(eventPerformance?.currentNetRevenue ?? 0)}
              </p>
            </div>
            <div className="rounded-lg border bg-secondary/20 p-3">
              <p className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                {eventPerformance?.mode === "active"
                  ? "Expected Revenue (Right Now)"
                  : "Projected Net Revenue (Recommended)"}
              </p>
              <p className="mt-1 text-2xl font-semibold">
                {formatCurrency(
                  eventPerformance?.mode === "active"
                    ? eventPerformance?.expectedRevenueNow ?? 0
                    : eventPerformance?.projectedNetRevenueRecommended ?? 0,
                )}
              </p>
            </div>
            <div className="rounded-lg border bg-secondary/20 p-3">
              <p className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                {eventPerformance?.mode === "active"
                  ? "Sellthrough (Actual / Expected)"
                  : "Projected Sellthrough (Rec / Baseline)"}
              </p>
              <p className="mt-1 text-2xl font-semibold">
                {eventPerformance?.actualSellthroughNow ?? 0}% / {eventPerformance?.expectedSellthroughNow ?? 0}%
              </p>
            </div>
            <div className="rounded-lg border bg-secondary/20 p-3">
              <p className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                Revenue Vs Expected
              </p>
              <p
                className={cn(
                  "mt-1 text-2xl font-semibold",
                  (eventPerformance?.revenueVsExpectedPct ?? 0) >= 0 ? "text-success" : "text-destructive",
                )}
              >
                {(eventPerformance?.revenueVsExpectedPct ?? 0) >= 0 ? "+" : ""}
                {eventPerformance?.revenueVsExpectedPct ?? 0}%
              </p>
            </div>
            <div className="rounded-lg border bg-secondary/20 p-3">
              <p className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                Sellthrough Vs Expected
              </p>
              <p
                className={cn(
                  "mt-1 text-2xl font-semibold",
                  (eventPerformance?.sellthroughVsExpectedPts ?? 0) >= 0 ? "text-success" : "text-destructive",
                )}
              >
                {(eventPerformance?.sellthroughVsExpectedPts ?? 0) >= 0 ? "+" : ""}
                {eventPerformance?.sellthroughVsExpectedPts ?? 0} pts
              </p>
            </div>
            <div className="rounded-lg border bg-secondary/20 p-3">
              <p className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                Pricing Opportunity
              </p>
              <p className="mt-1 text-2xl font-semibold">
                {formatCurrency(eventPerformance?.pricingOpportunity ?? 0)}
              </p>
              <p className="text-xs text-muted-foreground">
                Score: {eventPerformance?.pricingOpportunityScore ?? 0}
              </p>
            </div>
            <div className="rounded-lg border bg-secondary/20 p-3">
              <p className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                Left-To-Go Tickets
              </p>
              <p className="mt-1 text-2xl font-semibold">
                {formatCompactNumber(eventPerformance?.ticketsRemainingTotal ?? 0)}
              </p>
              <p className="text-xs text-muted-foreground">
                Sold: {formatCompactNumber(eventPerformance?.ticketsSoldTotal ?? 0)}
              </p>
            </div>
          </section>

          <section className="mb-6 rounded-xl border bg-background p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-heading text-2xl font-semibold">Recommended Actions</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Current versus recommended seat-group pricing and offer rate, with projected revenue impact.
                </p>
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                Use the footer to review and stage these recommendations.
              </p>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_1fr]">
              <div className="overflow-x-auto rounded-lg border">
                <Table className="min-w-[560px]">
                  <TableHeader className="bg-secondary/35">
                    <TableRow className="hover:bg-secondary/35">
                      <TableHead>Action</TableHead>
                      <TableHead className="text-right">Current</TableHead>
                      <TableHead className="text-right">Recommended</TableHead>
                      <TableHead className="text-right">Delta</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Seat Group Price</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(currentSeatGroupPrice)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(recommendedSeatGroupPrice)}
                      </TableCell>
                      <TableCell
                        className={cn(
                          "text-right font-semibold",
                          recommendedSeatGroupPrice - currentSeatGroupPrice >= 0
                            ? "text-success"
                            : "text-warning",
                        )}
                      >
                        {(recommendedSeatGroupPrice - currentSeatGroupPrice) >= 0 ? "+" : ""}
                        {formatCurrency(recommendedSeatGroupPrice - currentSeatGroupPrice)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Offer Rate</TableCell>
                      <TableCell className="text-right font-medium">{discountRate}%</TableCell>
                      <TableCell className="text-right font-medium">{recommendedDiscountRate}%</TableCell>
                      <TableCell
                        className={cn(
                          "text-right font-semibold",
                          recommendedDiscountRate - discountRate <= 0 ? "text-success" : "text-warning",
                        )}
                      >
                        {recommendedDiscountRate - discountRate >= 0 ? "+" : ""}
                        {roundTo(recommendedDiscountRate - discountRate, 1)} pts
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Marketing Spend</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(marketingSpend)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(recommendedMarketingSpend)}
                      </TableCell>
                      <TableCell
                        className={cn(
                          "text-right font-semibold",
                          recommendedMarketingSpend - marketingSpend <= 0
                            ? "text-success"
                            : "text-warning",
                        )}
                      >
                        {(recommendedMarketingSpend - marketingSpend) >= 0 ? "+" : ""}
                        {formatCurrency(recommendedMarketingSpend - marketingSpend)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="rounded-lg border p-3">
                <p className="text-xs uppercase tracking-[0.1em] text-muted-foreground">
                  Revenue Projection
                </p>
                <div className="mt-3 overflow-x-auto">
                  <svg
                    viewBox={`0 0 ${actionProjectionChart.width} ${actionProjectionChart.height}`}
                    className="h-[220px] w-full"
                    role="img"
                    aria-label="Current versus expected revenue projections"
                  >
                    {actionProjectionChart.yTicks.map((tick) => {
                      const y =
                        actionProjectionChart.top +
                        ((actionProjectionChart.yMax - tick) / actionProjectionChart.yMax) *
                          (actionProjectionChart.height -
                            actionProjectionChart.top -
                            actionProjectionChart.bottom);
                      return (
                        <g key={`action-tick-${tick}`}>
                          <line
                            x1={actionProjectionChart.left}
                            y1={y}
                            x2={actionProjectionChart.width - actionProjectionChart.right}
                            y2={y}
                            stroke="hsl(var(--border))"
                            strokeWidth={1}
                          />
                          <text
                            x={36}
                            y={y + 4}
                            textAnchor="end"
                            fontSize={11}
                            fill="hsl(var(--muted-foreground))"
                          >
                            {`$${formatCompactNumber(tick)}`}
                          </text>
                        </g>
                      );
                    })}
                    <path
                      d={actionProjectionChart.actualPath}
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                    />
                    <path
                      d={actionProjectionChart.expectedPath}
                      fill="none"
                      stroke="hsl(var(--success))"
                      strokeWidth={3}
                    />
                    {actionProjectionChart.points.map((point) => (
                      <g key={`action-point-${point.id}`}>
                        <circle cx={point.x} cy={point.actualY} r={3.3} fill="hsl(var(--primary))" />
                        <circle cx={point.x} cy={point.expectedY} r={3.3} fill="hsl(var(--success))" />
                        <text
                          x={point.x}
                          y={actionProjectionChart.baseY + 16}
                          textAnchor="middle"
                          fontSize={11}
                          fill="hsl(var(--muted-foreground))"
                        >
                          {point.label}
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                    Current Revenue
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-success" />
                    Expected Revenue
                  </span>
                </div>
                <div className="mt-3 rounded border bg-secondary/20 px-3 py-2 text-sm">
                  <span className="text-muted-foreground">Projected net impact:</span>{" "}
                  <span
                    className={cn(
                      "font-semibold",
                      netProjectionDelta >= 0 ? "text-success" : "text-destructive",
                    )}
                  >
                    {netProjectionDelta >= 0 ? "+" : ""}
                    {formatCurrency(netProjectionDelta)}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <div className="mb-6 inline-flex rounded-lg border bg-secondary/40 p-1">
            <Button
              variant={activeTab === "performance" ? "default" : "ghost"}
              size="sm"
              className="h-9 px-5"
              onClick={() => setActiveTab("performance")}
            >
              Performance
            </Button>
            <Button
              variant={activeTab === "pricing-details" ? "default" : "ghost"}
              size="sm"
              className="h-9 px-5"
              onClick={() => setActiveTab("pricing-details")}
            >
              Pricing Details
            </Button>
          </div>

          {activeTab === "performance" ? (
            <section className="space-y-6">
              <div className="rounded-xl border bg-background p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="font-heading text-2xl font-semibold">
                      {activePerformanceMetricConfig.title}
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {activePerformanceMetricConfig.description}
                    </p>
                  </div>

                  <div className="grid min-w-[260px] gap-2 sm:grid-cols-3">
                    <div className="rounded-lg border bg-secondary/25 px-3 py-2">
                      <p className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                        {activePerformanceMetricConfig.actualLabel}
                      </p>
                      <p className="mt-1 text-lg font-semibold">
                        {activePerformanceMetricConfig.formatTooltip(
                          activePerformanceMetricConfig.series[activePerformanceMetricConfig.series.length - 1]?.actual ?? 0,
                        )}
                      </p>
                    </div>
                    <div className="rounded-lg border bg-secondary/25 px-3 py-2">
                      <p className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                        {activePerformanceMetricConfig.expectedLabel}
                      </p>
                      <p className="mt-1 text-lg font-semibold">
                        {activePerformanceMetricConfig.formatTooltip(
                          activePerformanceMetricConfig.series[activePerformanceMetricConfig.series.length - 1]?.expected ?? 0,
                        )}
                      </p>
                    </div>
                    <div className="rounded-lg border bg-secondary/25 px-3 py-2">
                      <p className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                        Variance
                      </p>
                      <p
                        className={cn(
                          "mt-1 text-lg font-semibold",
                          (activePerformanceMetricConfig.series[activePerformanceMetricConfig.series.length - 1]?.actual ?? 0) -
                            (activePerformanceMetricConfig.series[activePerformanceMetricConfig.series.length - 1]?.expected ?? 0) >=
                          0
                            ? "text-success"
                            : "text-destructive",
                        )}
                      >
                        {activePerformanceMetricConfig.formatVariance(
                          activePerformanceMetricConfig.series[activePerformanceMetricConfig.series.length - 1]?.actual ?? 0,
                          activePerformanceMetricConfig.series[activePerformanceMetricConfig.series.length - 1]?.expected ?? 0,
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 inline-flex flex-wrap rounded-lg border bg-secondary/35 p-1">
                  {[
                    { value: "revenue" as const, label: "Revenue" },
                    { value: "funnel-entries" as const, label: "Funnel Entries" },
                    { value: "funnel-completion" as const, label: "Funnel Completion" },
                    { value: "sold" as const, label: "% Sold" },
                    { value: "roas" as const, label: "ROAS" },
                  ].map((metric) => (
                    <Button
                      key={metric.value}
                      variant={activePerformanceMetric === metric.value ? "default" : "ghost"}
                      size="sm"
                      className="h-9 px-4"
                      onClick={() => {
                        setActivePerformanceMetric(metric.value);
                        setHoveredPerformanceMetricPointId(null);
                      }}
                    >
                      {metric.label}
                    </Button>
                  ))}
                </div>

                <div className="mt-4 overflow-x-auto">
                  <svg
                    viewBox={`0 0 ${activePerformanceTrendChart.width} ${activePerformanceTrendChart.height}`}
                    className="h-[290px] w-full"
                    role="img"
                    aria-label={`${activePerformanceMetricConfig.title} over time chart`}
                    onMouseLeave={() => setHoveredPerformanceMetricPointId(null)}
                  >
                    <defs>
                      <linearGradient id="performance-metric-fill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={activePerformanceMetricConfig.areaColor} stopOpacity="0.26" />
                        <stop offset="100%" stopColor={activePerformanceMetricConfig.areaColor} stopOpacity="0.02" />
                      </linearGradient>
                    </defs>
                    {activePerformanceTrendChart.yTicks.map((tick) => {
                      const y =
                        activePerformanceTrendChart.top +
                        ((activePerformanceTrendChart.yMax - tick) / activePerformanceTrendChart.yMax) *
                          (activePerformanceTrendChart.height -
                            activePerformanceTrendChart.top -
                            activePerformanceTrendChart.bottom);
                      return (
                        <g key={`perf-tick-${tick}`}>
                          <line
                            x1={activePerformanceTrendChart.left}
                            y1={y}
                            x2={activePerformanceTrendChart.width - activePerformanceTrendChart.right}
                            y2={y}
                            stroke="hsl(var(--border))"
                            strokeWidth={1}
                          />
                          <text
                            x={36}
                            y={y + 4}
                            textAnchor="end"
                            fontSize={11}
                            fill="hsl(var(--muted-foreground))"
                          >
                            {activePerformanceMetricConfig.formatAxis(tick)}
                          </text>
                        </g>
                      );
                    })}
                    <path d={activePerformanceTrendChart.areaPath} fill="url(#performance-metric-fill)" />
                    <path
                      d={activePerformanceTrendChart.expectedPath}
                      fill="none"
                      stroke="hsl(var(--warning))"
                      strokeDasharray="6 4"
                      strokeWidth={2}
                    />
                    <path
                      d={activePerformanceTrendChart.actualPath}
                      fill="none"
                      stroke={activePerformanceMetricConfig.actualStroke}
                      strokeWidth={3}
                    />
                    {activePerformanceTrendChart.points.map((point) => {
                      const isHovered = hoveredPerformanceMetricPointId === point.id;
                      return (
                        <g key={`perf-point-${point.id}`}>
                          <circle
                            cx={point.x}
                            cy={point.actualY}
                            r={isHovered ? 5.2 : 3.8}
                            fill={activePerformanceMetricConfig.actualStroke}
                            stroke={isHovered ? "hsl(var(--card))" : "none"}
                            strokeWidth={isHovered ? 2 : 0}
                            onMouseEnter={() => setHoveredPerformanceMetricPointId(point.id)}
                            onFocus={() => setHoveredPerformanceMetricPointId(point.id)}
                            onBlur={() => setHoveredPerformanceMetricPointId(null)}
                            tabIndex={0}
                          />
                          <text
                            x={point.x}
                            y={activePerformanceTrendChart.baseY + 16}
                            textAnchor="middle"
                            fontSize={11}
                            fill="hsl(var(--muted-foreground))"
                          >
                            {point.label}
                          </text>
                        </g>
                      );
                    })}
                    {hoveredPerformanceMetricPoint && (
                      <SvgPointTooltip
                        x={hoveredPerformanceMetricPoint.x}
                        y={hoveredPerformanceMetricPoint.actualY}
                        width={activePerformanceTrendChart.width}
                        height={activePerformanceTrendChart.height}
                        left={activePerformanceTrendChart.left}
                        right={activePerformanceTrendChart.right}
                        top={activePerformanceTrendChart.top}
                        bottom={activePerformanceTrendChart.bottom}
                        title={`Period: ${hoveredPerformanceMetricPoint.label}`}
                        lines={[
                          `${activePerformanceMetricConfig.actualLabel}: ${activePerformanceMetricConfig.formatTooltip(hoveredPerformanceMetricPoint.actual)}`,
                          `${activePerformanceMetricConfig.expectedLabel}: ${activePerformanceMetricConfig.formatTooltip(hoveredPerformanceMetricPoint.expected)}`,
                          `Variance: ${activePerformanceMetricConfig.formatVariance(
                            hoveredPerformanceMetricPoint.actual,
                            hoveredPerformanceMetricPoint.expected,
                          )}`,
                        ]}
                      />
                    )}
                  </svg>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: activePerformanceMetricConfig.actualStroke }}
                    />
                    {activePerformanceMetricConfig.actualLabel}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <span className="h-0 w-6 border-t-2 border-dashed border-warning" />
                    {activePerformanceMetricConfig.expectedLabel}
                  </span>
                </div>
              </div>

              <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">

              <div className="rounded-xl border bg-background p-4 sm:p-5">
                <h3 className="font-heading text-xl font-semibold">Dome vs Hall Summary</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Gross and net breakout across venue areas.
                </p>

                <div className="mt-4 space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">Dome Net</span>
                      <span>{formatCurrency(eventPerformance?.domeNetRevenue ?? 0)}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{
                          width: `${clamp(
                            ((eventPerformance?.domeNetRevenue ?? 0) /
                              Math.max(
                                1,
                                (eventPerformance?.domeNetRevenue ?? 0) +
                                  (eventPerformance?.hallNetRevenue ?? 0),
                              )) *
                              100,
                            0,
                            100,
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">Hall Net</span>
                      <span>{formatCurrency(eventPerformance?.hallNetRevenue ?? 0)}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-success"
                        style={{
                          width: `${clamp(
                            ((eventPerformance?.hallNetRevenue ?? 0) /
                              Math.max(
                                1,
                                (eventPerformance?.domeNetRevenue ?? 0) +
                                  (eventPerformance?.hallNetRevenue ?? 0),
                              )) *
                              100,
                            0,
                            100,
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <div className="rounded border bg-secondary/20 p-2">
                    <p className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">Dome Gross</p>
                    <p className="mt-1 font-semibold">{formatCurrency(eventPerformance?.domeGrossRevenue ?? 0)}</p>
                  </div>
                  <div className="rounded border bg-secondary/20 p-2">
                    <p className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">Hall Gross</p>
                    <p className="mt-1 font-semibold">{formatCurrency(eventPerformance?.hallGrossRevenue ?? 0)}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border bg-background p-4 sm:p-5">
                <h3 className="font-heading text-xl font-semibold">Marketing + Site Metrics</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  ROAS, funnel traffic, and completion against comparable benchmarks.
                </p>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <div className="rounded border bg-secondary/20 p-2">
                    <p className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">Ad Spend</p>
                    <p className="mt-1 font-semibold">{formatCurrency(eventPerformance?.adSpend ?? 0)}</p>
                  </div>
                  <div className="rounded border bg-secondary/20 p-2">
                    <p className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">ROAS / Comp</p>
                    <p className="mt-1 font-semibold">
                      {eventPerformance?.roas ?? 0}x / {eventPerformance?.compRoas ?? 0}x
                    </p>
                  </div>
                  <div className="rounded border bg-secondary/20 p-2">
                    <p className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">Funnel Entries</p>
                    <p className="mt-1 font-semibold">
                      {formatCompactNumber(eventPerformance?.funnelEntries ?? 0)}
                      <span className="ml-1 text-xs text-muted-foreground">
                        (Comp {formatCompactNumber(eventPerformance?.compFunnelEntries ?? 0)})
                      </span>
                    </p>
                  </div>
                  <div className="rounded border bg-secondary/20 p-2">
                    <p className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                      Funnel Completion
                    </p>
                    <p className="mt-1 font-semibold">
                      {eventPerformance?.funnelCompletion ?? 0}%
                      <span className="ml-1 text-xs text-muted-foreground">
                        (Comp {eventPerformance?.compFunnelCompletion ?? 0}%)
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border bg-background">
                <div className="overflow-x-auto">
                  <Table className="min-w-[520px]">
                    <TableHeader className="bg-secondary/40">
                      <TableRow className="hover:bg-secondary/40">
                        <TableHead>Tickets Sold</TableHead>
                        <TableHead>Seat Group S..</TableHead>
                        <TableHead>Yield</TableHead>
                        <TableHead>Gross Yield</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reportingYieldRows.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell>{row.ticketsSold}</TableCell>
                          <TableCell><SellThroughBar pct={row.sellThroughPct} /></TableCell>
                          <TableCell>{formatDollarInteger(row.yield)}</TableCell>
                          <TableCell>{formatDollarInteger(row.grossYield)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-secondary/30 font-semibold">
                        <TableCell>{yieldTotals.ticketsSold}</TableCell>
                        <TableCell><SellThroughBar pct={yieldTotals.sellThroughPct} /></TableCell>
                        <TableCell>{formatDollarInteger(yieldTotals.yield)}</TableCell>
                        <TableCell>{formatDollarInteger(yieldTotals.grossYield)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="rounded-xl border bg-background">
                <div className="border-b bg-secondary/30 px-4 py-3 text-center">
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    Comparable Event
                  </p>
                  <p className="mt-1 text-sm text-foreground">
                    2025 Concacaf Gold Cup: USA vs. Mexico - 7/6/25 @ 4P
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <Table className="min-w-[520px]">
                    <TableHeader className="bg-secondary/40">
                      <TableRow className="hover:bg-secondary/40">
                        <TableHead>Presale</TableHead>
                        <TableHead>Tickets Sold</TableHead>
                        <TableHead>% Sold</TableHead>
                        <TableHead>Comp Yield</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {comparablePaceRows.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell>{row.phase}</TableCell>
                          <TableCell>{row.ticketsSold}</TableCell>
                          <TableCell>{row.soldPct}%</TableCell>
                          <TableCell>{formatDollarInteger(row.compYield)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              </div>
            </section>
          ) : (
            <section className="space-y-6">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-lg border bg-secondary/20 p-3">
                  <p className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                    Projected Net Revenue (Current)
                  </p>
                  <p className="mt-1 text-xl font-semibold">
                    {formatCurrency(eventPerformance?.projectedNetRevenueCurrent ?? 0)}
                  </p>
                </div>
                <div className="rounded-lg border bg-secondary/20 p-3">
                  <p className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                    Projected Net Revenue (Recommended)
                  </p>
                  <p className="mt-1 text-xl font-semibold">
                    {formatCurrency(eventPerformance?.projectedNetRevenueRecommended ?? 0)}
                  </p>
                </div>
                <div className="rounded-lg border bg-secondary/20 p-3">
                  <p className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                    Pricing Opportunity
                  </p>
                  <p className="mt-1 text-xl font-semibold">
                    {formatCurrency(eventPerformance?.pricingOpportunity ?? 0)}
                  </p>
                </div>
                <div className="rounded-lg border bg-secondary/20 p-3">
                  <p className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                    Dome ATP (Release / Current / Rec)
                  </p>
                  <p className="mt-1 text-xl font-semibold">
                    {formatCurrency(event.programReleaseDomeAtp)} / {formatCurrency(event.domeAtp)} /{" "}
                    {formatCurrency(event.recAtp)}
                  </p>
                </div>
              </div>

              <div>
                <h2 className="mb-2 font-heading text-3xl font-semibold">Pricing</h2>
                <div className="rounded-xl border bg-background">
                  <div className="flex flex-wrap items-center justify-end gap-3 border-b p-3">
                    <Button variant="default" className="h-9" onClick={onOpenSeatmap}>
                      Edit Seat Map Pricing
                    </Button>
                  </div>
                  <div className="border-b bg-secondary/25 px-3 py-2 text-xs text-muted-foreground">
                    Health-adjusted recommendation:
                    <span className={cn("ml-1 font-semibold", recommendationAdjustmentPct >= 0 ? "text-success" : "text-warning")}>
                      {recommendationAdjustmentPct >= 0 ? "+" : ""}
                      {recommendationAdjustmentPct}% ({recommendationDirectionLabel})
                    </span>
                  </div>
                  {unsavedChanges && (
                    <div className="border-b bg-warning/10 px-3 py-2 text-sm text-warning-foreground">
                      {stagedActionCount} staged change{stagedActionCount === 1 ? "" : "s"} pending publish.
                    </div>
                  )}

                  <div className="overflow-x-auto">
                    <Table className="min-w-[760px]">
                      <TableHeader className="bg-secondary/40">
                        <TableRow className="hover:bg-secondary/40">
                          <TableHead className="w-[15%]">Original</TableHead>
                          <TableHead className="w-[15%]">Current</TableHead>
                          <TableHead className="w-[12%]">% Sold</TableHead>
                          <TableHead className="w-[15%]">Left-To-Go</TableHead>
                          <TableHead className="w-[12%]">Yield</TableHead>
                          <TableHead className="w-[31%]">Recommendation</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                      {pricingRows.map((row) => {
                        const recommendedPrice = healthAdjustedRecommendation(
                          row.recPrice,
                          latestHealthScore,
                        );
                        const recommendationDelta = roundTo(recommendedPrice - row.currentPrice, 2);
                        const isRecommendationDifferent = !arePriceValuesEqual(
                          recommendedPrice,
                          row.currentPrice,
                        );
                        const isRecommendationUndo =
                          pricingRecommendationUndoById[row.id] !== undefined &&
                          arePriceValuesEqual(recommendedPrice, row.currentPrice);
                        const isRowStaged = savedPricingById.get(row.id) !== row.currentPrice;

                        return (
                          <TableRow key={row.id} className={cn(isRowStaged && "bg-primary/5")}>
                            <TableCell>{formatCurrency(row.originalPrice)}</TableCell>
                            <TableCell>
                              {editingPricingRowId === row.id ? (
                                <Input
                                  type="number"
                                  inputMode="decimal"
                                  min="0"
                                  step="0.01"
                                  autoFocus
                                  value={editingPricingValue}
                                  onChange={(event) => setEditingPricingValue(event.target.value)}
                                  onKeyDown={(event) => {
                                    if (event.key === "Enter") {
                                      commitPricingRowEdit();
                                    }
                                    if (event.key === "Escape") {
                                      cancelPricingRowEdit();
                                    }
                                  }}
                                  onBlur={cancelPricingRowEdit}
                                  className="h-8 w-[104px] bg-card"
                                  aria-label={`Current price for ${row.label}`}
                                />
                              ) : (
                                <button
                                  type="button"
                                  onDoubleClick={() => beginPricingRowEdit(row)}
                                  className={cn(
                                    "rounded px-1 text-left font-medium",
                                    isRowStaged ? "text-orange-500" : "text-foreground",
                                  )}
                                  aria-label={`Edit current price for ${row.label}`}
                                >
                                  {formatCurrency(row.currentPrice)}
                                </button>
                              )}
                            </TableCell>
                            <TableCell><SellThroughBar pct={row.soldPct} /></TableCell>
                            <TableCell>{row.ticketsLeft !== null ? row.ticketsLeft : "--"}</TableCell>
                            <TableCell>{row.yield !== null ? formatDollarInteger(row.yield) : "--"}</TableCell>
                            <TableCell>
                              <div className="flex items-center justify-between gap-2">
                                <div className="text-sm">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      isRecommendationUndo
                                        ? undoPricingRecommendation(row.id)
                                        : applyPricingRecommendation(
                                            row.id,
                                            row.currentPrice,
                                            recommendedPrice,
                                          )
                                    }
                                    disabled={!isRecommendationDifferent && !isRecommendationUndo}
                                    className={cn(
                                      "inline-flex h-7 items-center rounded-full border px-2.5 text-xs font-semibold transition",
                                      isRecommendationUndo
                                        ? "border-warning/50 bg-warning/10 text-warning hover:bg-warning/15"
                                        : isRecommendationDifferent
                                          ? "border-primary/40 bg-primary/10 text-primary hover:bg-primary/15"
                                          : "cursor-default border-border/70 bg-secondary/20 text-muted-foreground",
                                    )}
                                    aria-label={
                                      isRecommendationUndo
                                        ? `Undo recommended price for ${row.label}`
                                        : `Apply recommended price for ${row.label}`
                                    }
                                  >
                                    {isRecommendationUndo ? "Undo" : formatCurrency(recommendedPrice)}
                                  </button>
                                  <p
                                    className={cn(
                                      "text-xs",
                                      recommendationDelta > 0
                                        ? "text-success"
                                        : recommendationDelta < 0
                                          ? "text-warning"
                                          : "text-muted-foreground",
                                    )}
                                  >
                                    {recommendationDelta >= 0 ? "+" : ""}
                                    {formatCurrency(recommendationDelta)}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      </TableBody>
                    </Table>
                  </div>

                </div>
              </div>

              <div>
                <h2 className="mb-2 font-heading text-3xl font-semibold">Offers</h2>
                <div className="rounded-xl border bg-background">
                  <div className="overflow-x-auto">
                    <Table className="min-w-[760px]">
                      <TableHeader className="bg-secondary/40">
                        <TableRow className="hover:bg-secondary/40">
                          <TableHead>Offer</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Start</TableHead>
                          <TableHead>End</TableHead>
                          <TableHead className="text-center">Publish</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {offerRows.map((offer) => (
                          <TableRow key={offer.id}>
                            <TableCell>{offer.offer}</TableCell>
                            <TableCell>{offer.type}</TableCell>
                            <TableCell>{offer.amountLabel}</TableCell>
                            <TableCell>{offer.startLabel}</TableCell>
                            <TableCell>{offer.endLabel}</TableCell>
                            <TableCell className="text-center">
                              <button
                                type="button"
                                onClick={() => toggleOfferPublished(offer.id)}
                                className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-transparent transition hover:border-border"
                                aria-label={`Toggle ${offer.offer} publish`}
                              >
                                <span
                                  className={cn(
                                    "h-3.5 w-3.5 rounded-full",
                                    offer.published ? "bg-success" : "bg-muted-foreground/40",
                                  )}
                                />
                              </button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="mb-2 font-heading text-3xl font-semibold">Active Discounts</h2>
                <div className="rounded-xl border bg-background">
                  <div className="overflow-x-auto">
                    <Table className="min-w-[700px]">
                      <TableHeader className="bg-secondary/40">
                        <TableRow className="hover:bg-secondary/40">
                          <TableHead>Discount</TableHead>
                          <TableHead>Code</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Start</TableHead>
                          <TableHead>End</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {discountRows.map((discount) => (
                          <TableRow key={discount.id}>
                            <TableCell>{discount.discount}</TableCell>
                            <TableCell>{discount.code}</TableCell>
                            <TableCell>{discount.amountLabel}</TableCell>
                            <TableCell>{discount.startLabel}</TableCell>
                            <TableCell>{discount.endLabel}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
      <DraftActionFooter
        stagedCount={stagedActionCount}
        onDiscard={onDiscardPricingDraft}
        onPublish={onPublishPricingChanges}
        scopeLabel="for this event"
        extraActionLabel="Review Recommendations"
        onExtraAction={openRecommendedReviewModal}
        extraActionDisabled={recommendedReviewChangeRows.length === 0}
      />
    </div>
  );
}

export default function App() {
  const [publishedEvents, setPublishedEvents] = useState<EventRecord[]>(() => cloneEvents(initialEvents));
  const [draftEvents, setDraftEvents] = useState<EventRecord[]>(() => cloneEvents(initialEvents));
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterValue>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [daypartFilter, setDaypartFilter] = useState<string>("all");
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set(["evt-001"]));
  const [sortState, setSortState] = useState<{ key: SortKey; direction: "asc" | "desc" }>({
    key: "startTime",
    direction: "asc",
  });
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [editingEventValue, setEditingEventValue] = useState<string>("");
  const [selectedEventIds, setSelectedEventIds] = useState<string[]>([]);
  const [bulkEventEditValuesByField, setBulkEventEditValuesByField] = useState<Record<string, string>>({});
  const [bulkEventEditModesByField, setBulkEventEditModesByField] = useState<
    Record<string, NumericBulkEditMode>
  >({});
  const [showEventBulkEditOverlay, setShowEventBulkEditOverlay] = useState(false);
  const eventBulkEditBtnRef = useRef<HTMLButtonElement>(null);
  const seatBulkEditBtnRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [editingSeatCell, setEditingSeatCell] = useState<{
    eventId: string;
    seatGroupId: string;
    field: SeatGroupEditableField;
  } | null>(null);
  const [editingSeatValue, setEditingSeatValue] = useState<string>("");
  const [selectedSeatGroupsByEvent, setSelectedSeatGroupsByEvent] = useState<Record<string, string[]>>({});
  const [bulkSeatEditValues, setBulkSeatEditValues] = useState<Record<string, string>>({});
  const [bulkSeatEditFieldByEvent, setBulkSeatEditFieldByEvent] = useState<
    Record<string, SeatGroupEditableField>
  >({});
  const [bulkSeatEditModeByEvent, setBulkSeatEditModeByEvent] = useState<
    Record<string, NumericBulkEditMode>
  >({});
  const [activeBulkEditEventId, setActiveBulkEditEventId] = useState<string | null>(null);
  const [showPublishConfirmation, setShowPublishConfirmation] = useState(false);
  const [showPublishOverlay, setShowPublishOverlay] = useState(false);
  const [showRecommendedReviewModal, setShowRecommendedReviewModal] = useState(false);
  const [recommendedReviewValuesById, setRecommendedReviewValuesById] = useState<Record<string, string>>({});
  const [draftSeatRecommendationUndoById, setDraftSeatRecommendationUndoById] = useState<Record<string, number>>({});
  const [route, setRoute] = useState<ViewRoute>(() => {
    if (typeof window === "undefined") {
      return { type: "price-adjustment" };
    }
    return parseRoute(window.location.pathname);
  });

  useEffect(() => {
    const handlePopState = () => {
      setRoute(parseRoute(window.location.pathname));
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (!showPublishOverlay) {
      return;
    }

    const timeoutId = window.setTimeout(() => setShowPublishOverlay(false), 2200);
    return () => window.clearTimeout(timeoutId);
  }, [showPublishOverlay]);

  useEffect(() => {
    if (!activeBulkEditEventId) {
      return;
    }

    const selectedSeatGroupIds = selectedSeatGroupsByEvent[activeBulkEditEventId] ?? [];
    if (selectedSeatGroupIds.length === 0) {
      setActiveBulkEditEventId(null);
    }
  }, [activeBulkEditEventId, selectedSeatGroupsByEvent]);

  const navigate = (path: string) => {
    window.history.pushState({}, "", path);
    setRoute(parseRoute(path));
  };

  const pendingChanges = useMemo(
    () => calculatePendingChanges(publishedEvents, draftEvents),
    [publishedEvents, draftEvents],
  );
  const publishChangeRows = useMemo(
    () => buildPublishChangeRows(publishedEvents, draftEvents),
    [publishedEvents, draftEvents],
  );
  const publishedById = useMemo(
    () => new Map(publishedEvents.map((event) => [event.id, event])),
    [publishedEvents],
  );
  const selectedEvents = useMemo(
    () => draftEvents.filter((event) => selectedEventIds.includes(event.id)),
    [draftEvents, selectedEventIds],
  );
  const sharedEventPriceTierOptions = useMemo(
    () => intersectOptions(selectedEvents.map((event) => event.priceTierOptions)),
    [selectedEvents],
  );
  const sharedEventSeatGroupNames = useMemo(
    () =>
      Array.from(
        new Set(selectedEvents.flatMap((event) => event.seatGroups.map((seatGroup) => seatGroup.name))),
      ),
    [selectedEvents],
  );
  const canBulkEditDomeAtp = useMemo(
    () => selectedEvents.length > 0 && selectedEvents.every((event) => event.status === "On Sale"),
    [selectedEvents],
  );
  const sharedEventEditableFields = useMemo<EventBulkEditOption[]>(
    () =>
      [
        ...(canBulkEditDomeAtp
          ? [
              {
                value: "domeAtp" as const,
                label: "Dome ATP",
                inputType: "number" as const,
                group: "event" as const,
              },
            ]
          : []),
        ...(sharedEventPriceTierOptions.length > 0
          ? [
              {
                value: "priceTier" as const,
                label: "Price Tier",
                inputType: "select" as const,
                group: "event" as const,
                selectOptions: sharedEventPriceTierOptions,
              },
            ]
          : []),
        ...sharedEventSeatGroupNames.map((seatGroupName) => ({
          value: `seatGroup:${seatGroupName}` as const,
          label: seatGroupName,
          inputType: "number" as const,
          group: "seatGroup" as const,
          availabilityCount: selectedEvents.filter((event) =>
            event.seatGroups.some((seatGroup) => seatGroup.name === seatGroupName),
          ).length,
        })),
      ],
    [
      canBulkEditDomeAtp,
      sharedEventPriceTierOptions,
      sharedEventSeatGroupNames,
      selectedEvents,
    ],
  );
  const eventBulkFieldSummaries = useMemo<Record<string, EventBulkFieldSummary>>(
    () =>
      Object.fromEntries(
        sharedEventEditableFields.map((field) => {
          if (field.value === "domeAtp") {
            return [
              field.value,
              summarizeBulkEditValues(
                selectedEvents.map((event) => event.domeAtp),
                (value) => formatCurrency(value),
              ),
            ];
          }

          if (field.value === "priceTier") {
            return [
              field.value,
              summarizeBulkEditValues(
                selectedEvents.map((event) => event.priceTier),
                (value) => value,
              ),
            ];
          }

          const seatGroupName = field.value.replace("seatGroup:", "");
          const matchingSeatGroups = selectedEvents
            .map((event) => getSeatGroupByName(event, seatGroupName))
            .filter((seatGroup): seatGroup is SeatGroup => seatGroup !== undefined);
          const summary = summarizeBulkEditValues(
            matchingSeatGroups.map((seatGroup) => seatGroup.currentPrice),
            (value) => formatCurrency(value),
          );
          const availabilityCount = field.availabilityCount ?? matchingSeatGroups.length;

          return [
            field.value,
            {
              ...summary,
              detailLabel:
                availabilityCount < selectedEvents.length
                  ? `${availabilityCount} of ${selectedEvents.length} events`
                  : "All selected events",
            },
          ];
        }),
      ),
    [selectedEvents, sharedEventEditableFields],
  );
  const bulkEventEditValues = useMemo(
    () =>
      Object.fromEntries(
        sharedEventEditableFields.map((field) => [field.value, bulkEventEditValuesByField[field.value] ?? ""]),
      ),
    [bulkEventEditValuesByField, sharedEventEditableFields],
  );
  const bulkEventEditModes = useMemo(
    () =>
      Object.fromEntries(
        sharedEventEditableFields.map((field) => [field.value, bulkEventEditModesByField[field.value] ?? "set"]),
      ) as Record<string, NumericBulkEditMode>,
    [bulkEventEditModesByField, sharedEventEditableFields],
  );

  const filteredAndSortedEvents = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    const filtered = draftEvents.filter((event) => {
      if (
        term.length > 0 &&
        !event.event.toLowerCase().includes(term) &&
        !event.venueName.toLowerCase().includes(term)
      ) {
        return false;
      }

      if (statusFilter === "all") {
        return true;
      }

      if (statusFilter === "attention") {
        return event.attention !== null;
      }

      if (statusFilter === "on-sale") {
        return event.status === "On Sale";
      }

      return event.status === "Unpublished";
    }).filter((event) => {
      // Location filter
      if (locationFilter !== "all" && event.venueName !== locationFilter) return false;

      // Date range filter
      if (dateFrom) {
        const fromMs = new Date(dateFrom + "T00:00:00").valueOf();
        if (event.startTimeValue < fromMs) return false;
      }
      if (dateTo) {
        const toMs = new Date(dateTo + "T23:59:59").valueOf();
        if (event.startTimeValue > toMs) return false;
      }

      // Daypart filter
      if (daypartFilter !== "all") {
        const hour = new Date(event.startTimeValue).getHours();
        if (daypartFilter === "morning" && hour >= 12) return false;
        if (daypartFilter === "afternoon" && (hour < 12 || hour >= 17)) return false;
        if (daypartFilter === "evening" && hour < 17) return false;
      }

      return true;
    });

    const sorted = [...filtered].sort((a, b) => {
      const left = sortValueForKey(a, sortState.key);
      const right = sortValueForKey(b, sortState.key);

      if (left === null && right === null) {
        return 0;
      }

      if (left === null) {
        return 1;
      }

      if (right === null) {
        return -1;
      }

      const compareResult =
        typeof left === "number" && typeof right === "number"
          ? left - right
          : String(left).localeCompare(String(right));

      return sortState.direction === "asc" ? compareResult : compareResult * -1;
    });

    return sorted;
  }, [draftEvents, searchTerm, statusFilter, locationFilter, dateFrom, dateTo, daypartFilter, sortState]);
  const recommendedReviewChangeRows = useMemo<RecommendedReviewChangeRow[]>(
    () =>
      draftEvents.flatMap((event) =>
        event.seatGroups.flatMap((seatGroup) => {
          if (arePriceValuesEqual(seatGroup.recTicketPrice, seatGroup.currentPrice)) {
            return [];
          }

          return [
            {
              id: `draft-seat-group-price-${event.id}-${seatGroup.id}`,
              rowLabel: event.event,
              contextLabel: seatGroup.name,
              currentValue: seatGroup.currentPrice,
              suggestedValue: seatGroup.recTicketPrice,
              format: "currency" as const,
              inputStep: "0.01",
              inputDecimals: 2,
              target: {
                type: "draft-seat-group-price" as const,
                eventId: event.id,
                seatGroupId: seatGroup.id,
              },
            },
          ];
        }),
      ),
    [draftEvents],
  );

  const scopedRecommendations = useMemo(() => {
    const scopeEventIds =
      selectedEventIds.length > 0 ? selectedEventIds : draftEvents.map((e) => e.id);
    return draftEvents
      .filter((e) => scopeEventIds.includes(e.id))
      .flatMap((event) =>
        event.seatGroups
          .filter((sg) => !arePriceValuesEqual(sg.recTicketPrice, sg.currentPrice))
          .map((sg) => ({ eventId: event.id, seatGroupId: sg.id, currentPrice: sg.currentPrice, recPrice: sg.recTicketPrice })),
      );
  }, [draftEvents, selectedEventIds]);

  const filterTabCounts = useMemo(
    () => ({
      all: draftEvents.length,
      attention: draftEvents.filter((e) => e.attention !== null).length,
      "on-sale": draftEvents.filter((e) => e.status === "On Sale").length,
      unpublished: draftEvents.filter((e) => e.status === "Unpublished").length,
    }),
    [draftEvents],
  );

  const uniqueLocations = useMemo(
    () => Array.from(new Set(draftEvents.map((e) => e.venueName))).sort(),
    [draftEvents],
  );

  const activeFilterCount = [
    locationFilter !== "all",
    dateFrom !== "",
    dateTo !== "",
    daypartFilter !== "all",
  ].filter(Boolean).length;

  function clearAllFilters() {
    setLocationFilter("all");
    setDateFrom("");
    setDateTo("");
    setDaypartFilter("all");
  }

  const applyAllRecommendations = useCallback(() => {
    if (scopedRecommendations.length === 0) return;

    // Store undo entries for all recommendations
    setDraftSeatRecommendationUndoById((current) => {
      const next = { ...current };
      for (const rec of scopedRecommendations) {
        next[`${rec.eventId}:${rec.seatGroupId}`] = rec.currentPrice;
      }
      return next;
    });

    // Apply all recommended prices in one batch
    setDraftEvents((current) =>
      current.map((event) => {
        const eventRecs = scopedRecommendations.filter((r) => r.eventId === event.id);
        if (eventRecs.length === 0) return event;
        return {
          ...event,
          seatGroups: event.seatGroups.map((sg) => {
            const rec = eventRecs.find((r) => r.seatGroupId === sg.id);
            return rec ? { ...sg, currentPrice: rec.recPrice } : sg;
          }),
        };
      }),
    );
  }, [scopedRecommendations]);

  const visibleEventIds = useMemo(
    () => filteredAndSortedEvents.map((event) => event.id),
    [filteredAndSortedEvents],
  );
  const selectedVisibleEventCount = useMemo(
    () => visibleEventIds.filter((eventId) => selectedEventIds.includes(eventId)).length,
    [selectedEventIds, visibleEventIds],
  );

  useEffect(() => {
    if (selectedEventIds.length === 0) {
      setBulkEventEditValuesByField({});
      setBulkEventEditModesByField({});
      setShowEventBulkEditOverlay(false);
      return;
    }

    if (sharedEventEditableFields.length === 0) {
      setShowEventBulkEditOverlay(false);
    }
  }, [selectedEventIds.length, sharedEventEditableFields.length]);

  const onSort = (key: SortKey) => {
    setSortState((current) => {
      if (current.key === key) {
        return { key, direction: current.direction === "asc" ? "desc" : "asc" };
      }

      return { key, direction: "asc" };
    });
  };

  const beginEventPriceEdit = (eventRecord: EventRecord) => {
    setEditingEventId(eventRecord.id);
    setEditingEventValue(eventRecord.domeAtp === null ? "" : String(eventRecord.domeAtp));
  };

  const cancelEventPriceEdit = () => {
    setEditingEventId(null);
    setEditingEventValue("");
  };

  const commitEventPriceEdit = () => {
    if (!editingEventId) {
      return;
    }
    onDomeAtpChange(editingEventId, editingEventValue);
    setEditingEventId(null);
    setEditingEventValue("");
  };

  const setBulkEventFieldValue = (field: EventEditableField, nextValue: string) => {
    setBulkEventEditValuesByField((current) => ({
      ...current,
      [field]: nextValue,
    }));
  };

  const setBulkEventFieldMode = (field: EventEditableField, nextMode: NumericBulkEditMode) => {
    setBulkEventEditModesByField((current) => ({
      ...current,
      [field]: nextMode,
    }));
  };

  const beginSeatCellEdit = (
    eventId: string,
    seatGroup: SeatGroup,
    field: SeatGroupEditableField,
  ) => {
    setEditingSeatCell({ eventId, seatGroupId: seatGroup.id, field });
    setEditingSeatValue(field === "name" ? seatGroup.name : String(seatGroup.currentPrice));
  };

  const cancelSeatPriceEdit = () => {
    setEditingSeatCell(null);
    setEditingSeatValue("");
  };

  const commitSeatCellEdit = () => {
    if (!editingSeatCell) {
      return;
    }

    if (editingSeatCell.field === "name") {
      onSeatGroupNameChange(editingSeatCell.eventId, editingSeatCell.seatGroupId, editingSeatValue);
    } else {
      onSeatGroupCurrentPriceChange(
        editingSeatCell.eventId,
        editingSeatCell.seatGroupId,
        editingSeatValue,
      );
    }

    setEditingSeatCell(null);
    setEditingSeatValue("");
  };

  const onDomeAtpChange = (eventId: string, nextValue: string) => {
    setDraftEvents((current) =>
      current.map((event) => {
        if (event.id !== eventId) {
          return event;
        }

        if (nextValue.trim() === "") {
          return {
            ...event,
            domeAtp: null,
          };
        }

        const parsedValue = Number.parseFloat(nextValue);
        if (!Number.isFinite(parsedValue)) {
          return event;
        }

        return {
          ...event,
          domeAtp: roundTo(Math.max(0, parsedValue), 2),
        };
      }),
    );
  };

  const onPriceTierChange = (eventId: string, nextValue: string) => {
    const trimmedValue = nextValue.trim();
    if (trimmedValue.length === 0) {
      return;
    }

    setDraftEvents((current) =>
      current.map((event) => {
        if (event.id !== eventId || !event.priceTierOptions.includes(trimmedValue)) {
          return event;
        }

        return {
          ...event,
          priceTier: trimmedValue,
        };
      }),
    );
  };

  const onBulkEventEdit = (
    eventIds: string[],
    field: EventEditableField,
    nextValue: string,
    editMode: NumericBulkEditMode,
  ) => {
    if (eventIds.length === 0) {
      return;
    }

    const selectedIds = new Set(eventIds);

    if (field.startsWith("seatGroup:")) {
      const seatGroupName = field.replace("seatGroup:", "");
      if (!Number.isFinite(Number.parseFloat(nextValue))) {
        return;
      }
      setDraftEvents((current) =>
        current.map((event) =>
          selectedIds.has(event.id)
            ? {
                ...event,
                seatGroups: event.seatGroups.map((seatGroup) =>
                  seatGroup.name === seatGroupName
                    ? {
                        ...seatGroup,
                        currentPrice:
                          applyNumericBulkEdit(seatGroup.currentPrice, nextValue, editMode) ??
                          seatGroup.currentPrice,
                      }
                    : seatGroup,
                ),
              }
            : event,
        ),
      );
      return;
    }

    if (field === "priceTier") {
      const trimmedValue = nextValue.trim();
      if (trimmedValue.length === 0) {
        return;
      }

      setDraftEvents((current) =>
        current.map((event) =>
          selectedIds.has(event.id) && event.priceTierOptions.includes(trimmedValue)
            ? {
                ...event,
                priceTier: trimmedValue,
              }
            : event,
        ),
      );
      return;
    }

    if (!Number.isFinite(Number.parseFloat(nextValue))) {
      return;
    }
    setDraftEvents((current) =>
      current.map((event) =>
        selectedIds.has(event.id) && event.status === "On Sale"
          ? {
              ...event,
              domeAtp: applyNumericBulkEdit(event.domeAtp, nextValue, editMode),
            }
          : event,
      ),
    );
  };

  const toggleEventSelection = (eventId: string, checked: boolean) => {
    setSelectedEventIds((current) =>
      checked
        ? current.includes(eventId)
          ? current
          : [...current, eventId]
        : current.filter((id) => id !== eventId),
    );
  };

  const toggleAllVisibleEvents = (eventIds: string[], checked: boolean) => {
    setSelectedEventIds((current) => {
      if (checked) {
        return Array.from(new Set([...current, ...eventIds]));
      }

      const visibleIds = new Set(eventIds);
      return current.filter((id) => !visibleIds.has(id));
    });
  };

  const clearEventSelection = () => {
    setSelectedEventIds([]);
    setBulkEventEditValuesByField({});
    setBulkEventEditModesByField({});
    setShowEventBulkEditOverlay(false);
  };

  const isBulkEventApplyDisabled = (field: EventBulkEditOption) => {
    const nextValue = (bulkEventEditValues[field.value] ?? "").trim();
    const editMode = bulkEventEditModes[field.value] ?? "set";
    const summary = eventBulkFieldSummaries[field.value];

    if (nextValue.length === 0) {
      return true;
    }

    if (field.inputType === "select") {
      return !summary?.isMixed && nextValue === String(summary?.rawValue ?? "");
    }

    const parsedValue = Number.parseFloat(nextValue);
    if (!Number.isFinite(parsedValue)) {
      return true;
    }

    if (editMode === "flat" || editMode === "percent") {
      return parsedValue === 0;
    }

    if (summary?.isMixed) {
      return false;
    }

    if (typeof summary?.rawValue === "number") {
      return roundTo(parsedValue, 2) === roundTo(summary.rawValue, 2);
    }

    return false;
  };

  const bulkEventFieldsReadyToApply = sharedEventEditableFields.filter(
    (field) => !isBulkEventApplyDisabled(field),
  );

  const applyBulkEventEdits = () => {
    if (selectedEventIds.length === 0 || bulkEventFieldsReadyToApply.length === 0) {
      return;
    }

    cancelEventPriceEdit();
    setDraftSeatRecommendationUndoById({});
    bulkEventFieldsReadyToApply.forEach((field) => {
      onBulkEventEdit(
        selectedEventIds,
        field.value,
        bulkEventEditValues[field.value] ?? "",
        bulkEventEditModes[field.value] ?? "set",
      );
    });
    setBulkEventEditValuesByField({});
    setBulkEventEditModesByField({});
    setShowEventBulkEditOverlay(false);
  };

  const onSeatGroupCurrentPriceChange = (
    eventId: string,
    seatGroupId: string,
    nextValue: string,
  ) => {
    const parsedValue = Number.parseFloat(nextValue);
    if (!Number.isFinite(parsedValue)) {
      return;
    }

    const recommendationKey = `${eventId}:${seatGroupId}`;
    setDraftSeatRecommendationUndoById((current) => {
      if (!(recommendationKey in current)) {
        return current;
      }

      const { [recommendationKey]: _removed, ...rest } = current;
      return rest;
    });
    setDraftEvents((current) =>
      current.map((event) => {
        if (event.id !== eventId) {
          return event;
        }

        const seatGroups = event.seatGroups.map((group) =>
          group.id === seatGroupId
            ? {
                ...group,
                currentPrice: roundTo(Math.max(0, parsedValue), 2),
              }
            : group,
        );

        return {
          ...event,
          seatGroups,
        };
      }),
    );
  };

  const applyDraftSeatGroupRecommendation = (
    eventId: string,
    seatGroupId: string,
    currentPrice: number,
    recommendedPrice: number,
  ) => {
    if (arePriceValuesEqual(currentPrice, recommendedPrice)) {
      return;
    }

    const recommendationKey = `${eventId}:${seatGroupId}`;
    setEditingSeatCell(null);
    setEditingSeatValue("");
    setDraftSeatRecommendationUndoById((current) => ({
      ...current,
      [recommendationKey]: currentPrice,
    }));
    setDraftEvents((current) =>
      current.map((event) =>
        event.id === eventId
          ? {
              ...event,
              seatGroups: event.seatGroups.map((seatGroup) =>
                seatGroup.id === seatGroupId
                  ? {
                      ...seatGroup,
                      currentPrice: recommendedPrice,
                    }
                  : seatGroup,
              ),
            }
          : event,
      ),
    );
  };

  const undoDraftSeatGroupRecommendation = (eventId: string, seatGroupId: string) => {
    const recommendationKey = `${eventId}:${seatGroupId}`;
    const previousPrice = draftSeatRecommendationUndoById[recommendationKey];
    if (previousPrice === undefined) {
      return;
    }

    setDraftEvents((current) =>
      current.map((event) =>
        event.id === eventId
          ? {
              ...event,
              seatGroups: event.seatGroups.map((seatGroup) =>
                seatGroup.id === seatGroupId
                  ? {
                      ...seatGroup,
                      currentPrice: previousPrice,
                    }
                  : seatGroup,
              ),
            }
          : event,
      ),
    );
    setDraftSeatRecommendationUndoById((current) => {
      const { [recommendationKey]: _removed, ...rest } = current;
      return rest;
    });
  };

  const onSeatGroupNameChange = (
    eventId: string,
    seatGroupId: string,
    nextValue: string,
  ) => {
    const trimmedValue = nextValue.trim();
    if (trimmedValue.length === 0) {
      return;
    }

    setDraftEvents((current) =>
      current.map((event) => {
        if (event.id !== eventId) {
          return event;
        }

        const seatGroups = event.seatGroups.map((group) =>
          group.id === seatGroupId
            ? {
                ...group,
                name: trimmedValue,
              }
            : group,
        );

        return {
          ...event,
          seatGroups,
        };
      }),
    );
  };

  const onSeatGroupBulkEdit = (
    eventId: string,
    seatGroupIds: string[],
    field: SeatGroupEditableField,
    nextValue: string,
    editMode: NumericBulkEditMode,
  ) => {
    if (seatGroupIds.length === 0) {
      return;
    }

    const selectedSeatGroupIds = new Set(seatGroupIds);

    let nextName: string | null = null;

    if (field === "name") {
      const trimmedValue = nextValue.trim();
      if (trimmedValue.length === 0) {
        return;
      }
      nextName = trimmedValue;
    } else {
      if (!Number.isFinite(Number.parseFloat(nextValue))) {
        return;
      }
    }

    setDraftEvents((current) =>
      current.map((event) => {
        if (event.id !== eventId) {
          return event;
        }

        const seatGroups = event.seatGroups.map((group) =>
          selectedSeatGroupIds.has(group.id)
            ? {
                ...group,
                ...(field === "name"
                  ? { name: nextName as string }
                  : {
                      currentPrice:
                        applyNumericBulkEdit(group.currentPrice, nextValue, editMode) ??
                        group.currentPrice,
                    }),
              }
            : group,
        );

        return {
          ...event,
          seatGroups,
        };
      }),
    );
  };

  const toggleSeatGroupSelection = (eventId: string, seatGroupId: string, checked: boolean) => {
    setSelectedSeatGroupsByEvent((current) => {
      const currentSelection = current[eventId] ?? [];
      const nextSelection = checked
        ? currentSelection.includes(seatGroupId)
          ? currentSelection
          : [...currentSelection, seatGroupId]
        : currentSelection.filter((id) => id !== seatGroupId);

      return {
        ...current,
        [eventId]: nextSelection,
      };
    });
  };

  const toggleAllSeatGroupsForEvent = (eventId: string, seatGroups: SeatGroup[], checked: boolean) => {
    setSelectedSeatGroupsByEvent((current) => ({
      ...current,
      [eventId]: checked ? seatGroups.map((seatGroup) => seatGroup.id) : [],
    }));
  };

  const clearSeatGroupSelection = (eventId: string) => {
    setSelectedSeatGroupsByEvent((current) => ({
      ...current,
      [eventId]: [],
    }));
    setBulkSeatEditValues((current) => ({
      ...current,
      [eventId]: "",
    }));
    setBulkSeatEditModeByEvent((current) => ({
      ...current,
      [eventId]: "set",
    }));
    setActiveBulkEditEventId((current) => (current === eventId ? null : current));
  };

  const applyBulkSeatEdit = (eventId: string) => {
    const selectedSeatGroupIds = selectedSeatGroupsByEvent[eventId] ?? [];
    const nextValue = bulkSeatEditValues[eventId] ?? "";
    const field = bulkSeatEditFieldByEvent[eventId] ?? "currentPrice";
    const editMode = bulkSeatEditModeByEvent[eventId] ?? "set";
    if (selectedSeatGroupIds.length === 0) {
      return;
    }

    cancelSeatPriceEdit();
    setDraftSeatRecommendationUndoById({});
    onSeatGroupBulkEdit(eventId, selectedSeatGroupIds, field, nextValue, editMode);
    setActiveBulkEditEventId((current) => (current === eventId ? null : current));
  };

  const openRecommendedReviewModal = () => {
    setRecommendedReviewValuesById(
      Object.fromEntries(
        recommendedReviewChangeRows.map((row) => [
          row.id,
          formatRecommendationReviewInputValue(row.suggestedValue, row.inputDecimals),
        ]),
      ),
    );
    setEditingEventId(null);
    setEditingEventValue("");
    setEditingSeatCell(null);
    setEditingSeatValue("");
    setShowRecommendedReviewModal(true);
  };

  const onRecommendedReviewValueChange = (rowId: string, nextValue: string) => {
    setRecommendedReviewValuesById((current) => ({
      ...current,
      [rowId]: nextValue,
    }));
  };

  const getNextDraftEventsWithReviewedRecommendations = () => {
    const reviewedSeatGroupPrices = new Map<string, number>();

    for (const row of recommendedReviewChangeRows) {
      const parsedValue = Number.parseFloat(recommendedReviewValuesById[row.id] ?? "");
      if (!Number.isFinite(parsedValue) || parsedValue < 0) {
        return;
      }

      if (row.maximum !== undefined && parsedValue > row.maximum) {
        return;
      }

      if (row.target.type === "draft-seat-group-price") {
        reviewedSeatGroupPrices.set(
          `${row.target.eventId}:${row.target.seatGroupId}`,
          roundTo(parsedValue, 2),
        );
      }
    }

    return draftEvents.map((event) => ({
      ...event,
      seatGroups: event.seatGroups.map((seatGroup) => {
        const reviewedPrice = reviewedSeatGroupPrices.get(`${event.id}:${seatGroup.id}`);

        return reviewedPrice !== undefined
          ? {
              ...seatGroup,
              currentPrice: reviewedPrice,
            }
          : seatGroup;
      }),
    }));
  };

  const stageReviewedRecommendedChanges = () => {
    const nextDraftEvents = getNextDraftEventsWithReviewedRecommendations();
    if (!nextDraftEvents) {
      return;
    }

    setDraftEvents(nextDraftEvents);
    setDraftSeatRecommendationUndoById({});
    setShowRecommendedReviewModal(false);
  };

  const publishReviewedRecommendedChanges = () => {
    const nextDraftEvents = getNextDraftEventsWithReviewedRecommendations();
    if (!nextDraftEvents) {
      return;
    }

    setDraftEvents(nextDraftEvents);
    setPublishedEvents(cloneEvents(nextDraftEvents));
    setEditingEventId(null);
    setEditingEventValue("");
    setSelectedEventIds([]);
    setBulkEventEditValuesByField({});
    setBulkEventEditModesByField({});
    setShowEventBulkEditOverlay(false);
    setEditingSeatCell(null);
    setEditingSeatValue("");
    setSelectedSeatGroupsByEvent({});
    setBulkSeatEditValues({});
    setBulkSeatEditFieldByEvent({});
    setBulkSeatEditModeByEvent({});
    setActiveBulkEditEventId(null);
    setDraftSeatRecommendationUndoById({});
    setShowRecommendedReviewModal(false);
    setShowPublishConfirmation(false);
    setShowPublishOverlay(true);
  };

  const onPublishChanges = () => {
    if (pendingChanges.total === 0) {
      return;
    }

    setShowPublishConfirmation(true);
  };

  const onConfirmPublishChanges = (edits: Record<string, string>) => {
    if (pendingChanges.total === 0) {
      return;
    }

    let updatedDraft = cloneEvents(draftEvents);
    for (const row of publishChangeRows) {
      for (const change of row.changes) {
        const editedValue = edits[change.changeKey];
        if (editedValue === undefined) continue;
        const target = change.target;
        if (target.type === "event-price-tier") {
          const event = updatedDraft.find((e) => e.id === target.eventId);
          if (event) event.priceTier = editedValue;
        } else if (target.type === "event-dome-atp") {
          const event = updatedDraft.find((e) => e.id === target.eventId);
          if (event) {
            const parsed = parseFloat(editedValue);
            event.domeAtp = editedValue === "" ? null : isNaN(parsed) ? event.domeAtp : parsed;
          }
        } else if (target.type === "seat-group-name") {
          const event = updatedDraft.find((e) => e.id === target.eventId);
          const sg = event?.seatGroups.find((s) => s.id === target.seatGroupId);
          if (sg) sg.name = editedValue;
        } else if (target.type === "seat-group-current-price") {
          const event = updatedDraft.find((e) => e.id === target.eventId);
          const sg = event?.seatGroups.find((s) => s.id === target.seatGroupId);
          if (sg) {
            const parsed = parseFloat(editedValue);
            if (!isNaN(parsed) && parsed >= 0) sg.currentPrice = parsed;
          }
        }
      }
    }
    setDraftEvents(updatedDraft);
    setPublishedEvents(cloneEvents(updatedDraft));
    setEditingEventId(null);
    setEditingEventValue("");
    setSelectedEventIds([]);
    setBulkEventEditValuesByField({});
    setBulkEventEditModesByField({});
    setShowEventBulkEditOverlay(false);
    setEditingSeatCell(null);
    setEditingSeatValue("");
    setSelectedSeatGroupsByEvent({});
    setBulkSeatEditValues({});
    setBulkSeatEditFieldByEvent({});
    setBulkSeatEditModeByEvent({});
    setActiveBulkEditEventId(null);
    setDraftSeatRecommendationUndoById({});
    setShowRecommendedReviewModal(false);
    setShowPublishConfirmation(false);
    setShowPublishOverlay(true);
  };

  const onDiscardChanges = () => {
    if (pendingChanges.total === 0) {
      return;
    }

    setDraftEvents(cloneEvents(publishedEvents));
    setEditingEventId(null);
    setEditingEventValue("");
    setSelectedEventIds([]);
    setBulkEventEditValuesByField({});
    setBulkEventEditModesByField({});
    setShowEventBulkEditOverlay(false);
    setEditingSeatCell(null);
    setEditingSeatValue("");
    setSelectedSeatGroupsByEvent({});
    setBulkSeatEditValues({});
    setBulkSeatEditFieldByEvent({});
    setBulkSeatEditModeByEvent({});
    setActiveBulkEditEventId(null);
    setDraftSeatRecommendationUndoById({});
    setShowRecommendedReviewModal(false);
    setShowPublishConfirmation(false);
    setShowPublishOverlay(false);
  };

  const toggleExpanded = (eventId: string) => {
    setExpandedRows((current) => {
      const next = new Set(current);

      if (next.has(eventId)) {
        next.delete(eventId);
      } else {
        next.add(eventId);
      }

      return next;
    });
  };

  const sortIconForKey = (key: SortKey) => {
    if (sortState.key !== key) {
      return <ArrowUpDown className="h-3 w-3 text-muted-foreground/40 transition-opacity group-hover:text-muted-foreground/70" />;
    }

    return sortState.direction === "asc" ? (
      <ArrowUp className="h-3 w-3 text-foreground" />
    ) : (
      <ArrowDown className="h-3 w-3 text-foreground" />
    );
  };

  if (route.type === "mvp-view") {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(9,119,180,0.12),_transparent_42%),linear-gradient(180deg,_hsl(210_33%_98%)_0%,_hsl(210_30%_95%)_100%)] px-4 py-8 pb-28 sm:px-6 lg:px-8">
        <main className="mx-auto max-w-[1450px]">
          <PublishedOverlay visible={showPublishOverlay} />
          <PublishConfirmationModal
            open={showPublishConfirmation}
            changeRows={publishChangeRows}
            onCancel={() => setShowPublishConfirmation(false)}
            onConfirm={onConfirmPublishChanges}
          />
          <RecommendedReviewModal
            open={showRecommendedReviewModal}
            changeRows={recommendedReviewChangeRows}
            valueById={recommendedReviewValuesById}
            onValueChange={onRecommendedReviewValueChange}
            onCancel={() => setShowRecommendedReviewModal(false)}
            onConfirm={stageReviewedRecommendedChanges}
            onConfirmAndPublish={publishReviewedRecommendedChanges}
          />
          <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <button
                type="button"
                onClick={() => navigate("/")}
                className="mb-2 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Pricing Tool
              </button>
              <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground">
                Pricing Tool
              </h1>
              <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
                Scaled-back view of event pricing and ticket sales.
              </p>
            </div>
          </header>

          <section className="overflow-hidden rounded-2xl border bg-card/95 shadow-[0_24px_70px_-45px_rgba(15,23,42,0.65)] backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-card px-4 py-2.5 sm:px-6">
              <div className="inline-flex items-center gap-1 rounded-lg bg-muted p-1">
                {(
                  [
                    { value: "all", label: "All events" },
                    { value: "on-sale", label: "On sale" },
                    { value: "unpublished", label: "Unpublished" },
                  ] as { value: FilterValue; label: string; dot?: string }[]
                ).map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => setStatusFilter(tab.value)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all",
                      statusFilter === tab.value
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {tab.dot && <span className={cn("h-2 w-2 rounded-full", tab.dot)} />}
                    {tab.label}
                    <span
                      className={cn(
                        "text-xs",
                        statusFilter === tab.value ? "text-muted-foreground" : "text-muted-foreground/50",
                      )}
                    >
                      {filterTabCounts[tab.value]}
                    </span>
                  </button>
                ))}
              </div>
              <div className="relative flex items-center">
                <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground/60" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-9 w-56 pl-9 text-sm"
                  placeholder="Search events or venue"
                  aria-label="Search events"
                />
              </div>
            </div>

            {/* Filter strip */}
            <div className="flex flex-wrap items-center gap-2.5 border-b border-border/70 bg-muted/20 px-4 py-2.5 sm:px-6">
              {/* Location */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">Location</span>
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="h-7 rounded-md border border-border/60 bg-background px-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="all">All</option>
                  {uniqueLocations.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              <div className="h-4 w-px bg-border/60" />

              {/* Date range */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">Date</span>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="h-7 rounded-md border border-border/60 bg-background px-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <span className="text-xs text-muted-foreground">–</span>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="h-7 rounded-md border border-border/60 bg-background px-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="h-4 w-px bg-border/60" />

              {/* Daypart */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">Daypart</span>
                <select
                  value={daypartFilter}
                  onChange={(e) => setDaypartFilter(e.target.value)}
                  className="h-7 rounded-md border border-border/60 bg-background px-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="all">All</option>
                  <option value="morning">Morning</option>
                  <option value="afternoon">Afternoon</option>
                  <option value="evening">Evening</option>
                </select>
              </div>

              {/* Clear button */}
              {activeFilterCount > 0 && (
                <>
                  <div className="h-4 w-px bg-border/60" />
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                  >
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                      {activeFilterCount}
                    </span>
                    Clear filters
                  </button>
                </>
              )}
            </div>

            {pendingChanges.total > 0 && (
              <div className="border-b bg-primary/5 px-4 py-2 text-sm text-primary sm:px-6">
                {pendingChanges.total} staged pricing update{pendingChanges.total === 1 ? "" : "s"} ready to publish.
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3 border-b border-border/70 bg-card px-4 py-3 sm:px-6">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground">
                    {selectedEventIds.length > 0
                      ? `${selectedEventIds.length} of ${visibleEventIds.length} selected`
                      : `${visibleEventIds.length} event${visibleEventIds.length === 1 ? "" : "s"}`}
                  </p>
                </div>
                {selectedEventIds.length > 0 && (
                  <div className="relative flex items-center gap-1">
                    <Button
                      ref={eventBulkEditBtnRef}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setShowEventBulkEditOverlay((c) => !c)}
                      disabled={sharedEventEditableFields.length === 0}
                      aria-label={`Edit ${selectedEventIds.length} selected events`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={clearEventSelection}
                      aria-label={`Clear ${selectedEventIds.length} selected events`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <BulkEditEventsModal
                      open={showEventBulkEditOverlay}
                      selectedEvents={selectedEvents}
                      sharedFields={sharedEventEditableFields}
                      summaries={eventBulkFieldSummaries}
                      values={bulkEventEditValues}
                      modes={bulkEventEditModes}
                      readyFields={bulkEventFieldsReadyToApply}
                      onClose={() => setShowEventBulkEditOverlay(false)}
                      onSetValue={setBulkEventFieldValue}
                      onSetMode={setBulkEventFieldMode}
                      onApply={applyBulkEventEdits}
                      onPublish={() => { applyBulkEventEdits(); setShowPublishOverlay(true); }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="overflow-auto max-h-[calc(100vh-280px)]">
              <Table className="table-fixed" wrapperClassName="overflow-visible">
                <colgroup>
                  <col style={{ width: "480px" }} />
                  <col style={{ width: "170px" }} />
                  <col style={{ width: "180px" }} />
                  <col style={{ width: "150px" }} />
                  <col style={{ width: "210px" }} />
                </colgroup>
                <TableHeader className="bg-card sticky top-0 z-10 shadow-[0_1px_3px_0_rgba(0,0,0,0.06)]">
                  <TableRow className="bg-card hover:bg-card">
                    <TableHead className="w-[480px] whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={visibleEventIds.length > 0 && selectedVisibleEventCount === visibleEventIds.length}
                          indeterminate={selectedVisibleEventCount > 0 && selectedVisibleEventCount < visibleEventIds.length}
                          onCheckedChange={(checked) => toggleAllVisibleEvents(visibleEventIds, checked)}
                          aria-label="Select all visible events"
                        />
                        <button
                          type="button"
                          onClick={() => onSort("event")}
                          className="group flex items-center gap-1.5 whitespace-nowrap"
                        >
                          Event
                          {sortIconForKey("event")}
                        </button>
                      </div>
                    </TableHead>
                    <TableHead className="w-[170px] whitespace-nowrap">
                      <button type="button" onClick={() => onSort("startTime")} className="group flex items-center gap-1.5 whitespace-nowrap">
                        Date
                        {sortIconForKey("startTime")}
                      </button>
                    </TableHead>
                    <TableHead className="w-[110px] whitespace-nowrap">Days / Window</TableHead>
                    <TableHead className="w-[150px] whitespace-nowrap text-center">Tickets Sold</TableHead>
                    <TableHead className="w-[210px] whitespace-nowrap text-center">Price Range</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedEvents.map((event) => {
                    const hasSeatGroups = event.seatGroups.length > 0;
                    const isExpanded = expandedRows.has(event.id);
                    const isPendingPublish = pendingChanges.changedEventIds.has(event.id);
                    const publishedEvent = publishedById.get(event.id);
                    const selectedSeatGroupIds = selectedSeatGroupsByEvent[event.id] ?? [];
                    const allSeatGroupsSelected = hasSeatGroups && selectedSeatGroupIds.length === event.seatGroups.length;
                    const hasSelectedSeatGroups = selectedSeatGroupIds.length > 0;
                    const bulkSeatEditValue = bulkSeatEditValues[event.id] ?? "";
                    const bulkSeatEditField = bulkSeatEditFieldByEvent[event.id] ?? "currentPrice";
                    const bulkSeatEditMode = bulkSeatEditModeByEvent[event.id] ?? "set";
                    const isBulkEditOverlayOpen = activeBulkEditEventId === event.id;
                    const domePriceRange = formatSeatGroupPriceRange(event, "currentPrice");
                    const hasSoldData = event.domeSold !== null || event.hallSold !== null || event.gaSold !== null;
                    const totalSold = (event.domeSold ?? 0) + (event.hallSold ?? 0) + (event.gaSold ?? 0);

                    return (
                      <Fragment key={event.id}>
                        <TableRow
                          onClick={() => toggleExpanded(event.id)}
                          className={cn(
                            "cursor-pointer hover:bg-muted/35",
                            isExpanded && "bg-primary/[0.03] border-l-2 border-l-primary",
                          )}
                        >
                          <TableCell>
                            <div className="flex items-start gap-3">
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); toggleExpanded(event.id); }}
                                aria-label={isExpanded ? "Collapse event details" : "Expand event details"}
                                className={cn(
                                  "flex h-6 w-6 shrink-0 items-center justify-center rounded transition-colors",
                                  isExpanded ? "bg-foreground/8 text-foreground" : "text-muted-foreground hover:text-foreground",
                                )}
                              >
                                <ChevronRight className={cn("h-3.5 w-3.5 transition-transform duration-150", isExpanded && "rotate-90")} />
                              </button>
                              <Checkbox
                                className="mt-1"
                                checked={selectedEventIds.includes(event.id)}
                                onCheckedChange={(checked) => toggleEventSelection(event.id, checked)}
                                onClick={(e) => e.stopPropagation()}
                                aria-label={`Select ${event.event}`}
                              />
                              <div className="min-w-0">
                                <p className="max-w-[540px] whitespace-normal text-xs leading-tight">{event.event}</p>
                                <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
                                  <p className="text-xs text-muted-foreground">{event.venueName}</p>
                                  {isPendingPublish && (
                                    <Badge variant="secondary" className="bg-primary/12 text-primary">Pending Publish</Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="text-foreground">{formatStartDate(event.startTimeValue)}</p>
                            <p className="text-xs text-muted-foreground">
                              {event.weekdayLabel} {formatStartTime(event.startTimeValue)} {getVenueTimezone(event.venueName)}
                            </p>
                          </TableCell>
                          <TableCell>
                            {event.daysInMarket !== null && event.salesWindowDays !== null
                              ? `${event.daysInMarket} / ${event.salesWindowDays}`
                              : event.daysInMarket ?? "--"}
                          </TableCell>
                          <TableCell className="text-center font-medium">
                            {hasSoldData ? formatWholeNumber(totalSold) : "--"}
                          </TableCell>
                          <TableCell className="whitespace-nowrap border-x border-border/40 text-center">
                            {domePriceRange}
                          </TableCell>
                        </TableRow>

                        {isExpanded && (
                          <TableRow className="bg-muted/20 hover:bg-muted/20 border-l-2 border-l-primary">
                            <TableCell colSpan={5} className="p-0">
                              <div className="mx-5 my-4 max-w-[1500px] overflow-clip rounded-lg border border-border/60 bg-card shadow-sm">
                                {hasSeatGroups ? (
                                  <>
                                    <div className="sticky top-[48px] z-[5] bg-card">
                                      <div className="flex flex-wrap items-center gap-3 border-b border-border/70 bg-secondary/35 px-4 py-3">
                                        <div className="flex items-center gap-2">
                                          <p className="text-sm font-medium text-foreground">
                                            {hasSelectedSeatGroups
                                              ? `${selectedSeatGroupIds.length} seat group${selectedSeatGroupIds.length === 1 ? "" : "s"} selected`
                                              : "Seat Group Pricing"}
                                          </p>
                                          {hasSelectedSeatGroups && (
                                            <div className="relative flex items-center gap-1">
                                              <Button
                                                ref={(el) => { seatBulkEditBtnRefs.current[event.id] = el; }}
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7"
                                                onClick={() => setActiveBulkEditEventId((current) => current === event.id ? null : event.id)}
                                                aria-label={`Edit ${selectedSeatGroupIds.length} selected seat groups`}
                                              >
                                                <Pencil className="h-3.5 w-3.5" />
                                              </Button>
                                              <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                                onClick={() => clearSeatGroupSelection(event.id)}
                                                aria-label={`Clear ${selectedSeatGroupIds.length} selected seat groups`}
                                              >
                                                <Trash2 className="h-3.5 w-3.5" />
                                              </Button>
                                              {isBulkEditOverlayOpen && createPortal(
                                                <div
                                                  className="fixed z-50 w-[280px] rounded-xl border border-border/80 bg-card p-3 shadow-xl"
                                                  style={(() => {
                                                    const rect = seatBulkEditBtnRefs.current[event.id]?.getBoundingClientRect();
                                                    return rect ? { top: rect.bottom + 8, left: Math.max(8, rect.right - 280) } : { top: 0, left: 0 };
                                                  })()}
                                                >
                                                  <div className="space-y-3">
                                                    <Select value={bulkSeatEditField} onValueChange={(next) => { setBulkSeatEditFieldByEvent((c) => ({ ...c, [event.id]: next as SeatGroupEditableField })); setBulkSeatEditModeByEvent((c) => ({ ...c, [event.id]: "set" })); }}>
                                                      <SelectTrigger className="h-8 w-full bg-background"><SelectValue placeholder="Field" /></SelectTrigger>
                                                      <SelectContent>
                                                        <SelectItem value="name">Seat Group</SelectItem>
                                                        <SelectItem value="currentPrice">Current Price</SelectItem>
                                                      </SelectContent>
                                                    </Select>
                                                    {bulkSeatEditField === "currentPrice" && (
                                                      <Select value={bulkSeatEditMode} onValueChange={(next) => setBulkSeatEditModeByEvent((c) => ({ ...c, [event.id]: next as NumericBulkEditMode }))}>
                                                        <SelectTrigger className="h-8 w-full bg-background"><SelectValue placeholder="Mode" /></SelectTrigger>
                                                        <SelectContent>
                                                          {numericBulkEditModes.map((mode) => (
                                                            <SelectItem key={mode.value} value={mode.value}>{mode.label}</SelectItem>
                                                          ))}
                                                        </SelectContent>
                                                      </Select>
                                                    )}
                                                    <Input
                                                      type={bulkSeatEditField === "currentPrice" ? "number" : "text"}
                                                      inputMode={bulkSeatEditField === "currentPrice" ? "decimal" : "text"}
                                                      step={bulkSeatEditField === "currentPrice" ? "0.01" : undefined}
                                                      value={bulkSeatEditValue}
                                                      onChange={(e) => setBulkSeatEditValues((c) => ({ ...c, [event.id]: e.target.value }))}
                                                      onKeyDown={(e) => { if (e.key === "Enter") applyBulkSeatEdit(event.id); if (e.key === "Escape") setActiveBulkEditEventId(null); }}
                                                      className="h-8 w-full bg-background"
                                                      placeholder={bulkSeatEditField === "name" ? "Set name" : bulkSeatEditMode === "percent" ? "Increase by %" : bulkSeatEditMode === "flat" ? "Increase by amount" : "Set price"}
                                                      aria-label={`Bulk edit ${bulkSeatEditField} for ${event.event}`}
                                                    />
                                                    <div className="flex items-center justify-end gap-2">
                                                      <Button variant="ghost" size="sm" onClick={() => setActiveBulkEditEventId(null)}>Cancel</Button>
                                                      <Button variant="secondary" size="sm" onClick={() => applyBulkSeatEdit(event.id)} disabled={bulkSeatEditValue.trim() === ""}>Apply</Button>
                                                    </div>
                                                  </div>
                                                </div>,
                                                document.body,
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    <Table wrapperClassName="overflow-visible">
                                      <TableHeader className="sticky top-[93px] z-[4] bg-secondary/55">
                                        <TableRow className="bg-card [&_th]:bg-secondary/55 hover:bg-secondary/55">
                                          <TableHead className="w-[40px] whitespace-nowrap">
                                            <Checkbox
                                              checked={allSeatGroupsSelected}
                                              indeterminate={hasSelectedSeatGroups && !allSeatGroupsSelected}
                                              onCheckedChange={(checked) => toggleAllSeatGroupsForEvent(event.id, event.seatGroups, checked)}
                                              aria-label={`Select all seat groups for ${event.event}`}
                                            />
                                          </TableHead>
                                          <TableHead className="whitespace-nowrap">Seat Group</TableHead>
                                          <TableHead className="whitespace-nowrap text-center">Ticket Price</TableHead>
                                          <TableHead className="whitespace-nowrap text-center">Tickets Sold</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {event.seatGroups.map((seatGroup) => {
                                          const publishedSeatGroup = publishedEvent?.seatGroups.find((item) => item.id === seatGroup.id);
                                          const isSeatRecommendationDifferent = !arePriceValuesEqual(seatGroup.recTicketPrice, seatGroup.currentPrice);
                                          const seatRecommendationKey = `${event.id}:${seatGroup.id}`;
                                          const isSeatRecommendationUndo =
                                            draftSeatRecommendationUndoById[seatRecommendationKey] !== undefined &&
                                            arePriceValuesEqual(seatGroup.recTicketPrice, seatGroup.currentPrice);
                                          const isSeatNameDirty = seatGroup.name !== (publishedSeatGroup?.name ?? seatGroup.name);
                                          const isSeatPriceDirty = seatGroup.currentPrice !== (publishedSeatGroup?.currentPrice ?? seatGroup.currentPrice);
                                          const sgSold = computeSgTicketsSold(seatGroup);
                                          return (
                                            <TableRow key={seatGroup.id}>
                                              <TableCell>
                                                <Checkbox
                                                  checked={selectedSeatGroupIds.includes(seatGroup.id)}
                                                  onCheckedChange={(checked) => toggleSeatGroupSelection(event.id, seatGroup.id, checked)}
                                                  aria-label={`Select ${seatGroup.name}`}
                                                />
                                              </TableCell>
                                              <TableCell>
                                                {editingSeatCell?.eventId === event.id && editingSeatCell.seatGroupId === seatGroup.id && editingSeatCell.field === "name" ? (
                                                  <Input
                                                    type="text"
                                                    autoFocus
                                                    value={editingSeatValue}
                                                    onChange={(e) => setEditingSeatValue(e.target.value)}
                                                    onKeyDown={(e) => { if (e.key === "Enter") commitSeatCellEdit(); if (e.key === "Escape") cancelSeatPriceEdit(); }}
                                                    onBlur={cancelSeatPriceEdit}
                                                    className="h-8 w-[150px] bg-background"
                                                    aria-label={`Seat group name for ${seatGroup.name}`}
                                                  />
                                                ) : (
                                                  <button
                                                    type="button"
                                                    onDoubleClick={() => beginSeatCellEdit(event.id, seatGroup, "name")}
                                                    className={cn("rounded px-1 text-left font-medium", isSeatNameDirty ? "text-orange-500" : "text-foreground")}
                                                    aria-label={`Edit seat group name for ${seatGroup.name}`}
                                                  >
                                                    {seatGroup.name}
                                                  </button>
                                                )}
                                              </TableCell>
                                              <TableCell className="text-center">
                                                {formatCurrency(seatGroup.currentPrice)}
                                              </TableCell>
                                              <TableCell className="text-center">
                                                {sgSold !== null ? formatWholeNumber(sgSold) : "--"}
                                              </TableCell>
                                            </TableRow>
                                          );
                                        })}
                                      </TableBody>
                                    </Table>
                                  </>
                                ) : (
                                  <div className="px-4 py-6 text-sm text-muted-foreground">
                                    No seat group pricing is available for this event yet.
                                  </div>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </Fragment>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </section>
        </main>
        <DraftActionFooter
          stagedCount={pendingChanges.total}
          onDiscard={onDiscardChanges}
          onPublish={onPublishChanges}
        />
      </div>
    );
  }

  if (route.type === "seatmap") {
    const event = draftEvents.find((item) => item.id === route.eventId);

    return (
      <>
        <PublishConfirmationModal
          open={showPublishConfirmation}
          changeRows={publishChangeRows}
          onCancel={() => setShowPublishConfirmation(false)}
          onConfirm={onConfirmPublishChanges}
        />
        <EventRoutePlaceholder
          title="Seatmap"
          event={event}
          onBack={() => navigate("/")}
        />
        <DraftActionFooter
          stagedCount={pendingChanges.total}
          onDiscard={onDiscardChanges}
          onPublish={onPublishChanges}
        />
      </>
    );
  }

  if (route.type === "reporting") {
    const event = draftEvents.find((item) => item.id === route.eventId);

    return (
      <>
        <PublishConfirmationModal
          open={showPublishConfirmation}
          changeRows={publishChangeRows}
          onCancel={() => setShowPublishConfirmation(false)}
          onConfirm={onConfirmPublishChanges}
        />
        <EventReportingDashboard
          event={event}
          onBack={() => navigate("/")}
          onOpenSeatmap={() =>
            event ? navigate(`/seatmap/${encodeURIComponent(event.id)}`) : undefined
          }
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(9,119,180,0.12),_transparent_42%),linear-gradient(180deg,_hsl(210_33%_98%)_0%,_hsl(210_30%_95%)_100%)] px-4 py-8 pb-28 sm:px-6 lg:px-8">
      <main className="mx-auto max-w-[1450px]">
        <PublishedOverlay visible={showPublishOverlay} />
        <PublishConfirmationModal
          open={showPublishConfirmation}
          changeRows={publishChangeRows}
          onCancel={() => setShowPublishConfirmation(false)}
          onConfirm={onConfirmPublishChanges}
        />
        <RecommendedReviewModal
          open={showRecommendedReviewModal}
          changeRows={recommendedReviewChangeRows}
          valueById={recommendedReviewValuesById}
          onValueChange={onRecommendedReviewValueChange}
          onCancel={() => setShowRecommendedReviewModal(false)}
          onConfirm={stageReviewedRecommendedChanges}
          onConfirmAndPublish={publishReviewedRecommendedChanges}
        />
        <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground">
              Pricing Tool
            </h1>
            <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
              Search, filter, and stage pricing updates across active events before publishing.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/mvp")}
            className="flex items-center gap-1.5 rounded-lg border border-border/60 bg-card px-3.5 py-2 text-sm font-medium text-muted-foreground shadow-sm hover:text-foreground hover:bg-muted/40 transition-colors"
          >
            MVP
          </button>
        </header>

        <section className="overflow-hidden rounded-2xl border bg-card/95 shadow-[0_24px_70px_-45px_rgba(15,23,42,0.65)] backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-card px-4 py-2.5 sm:px-6">
            {/* Filter tabs — shadcn Tabs style */}
            <div className="inline-flex items-center gap-1 rounded-lg bg-muted p-1">
              {(
                [
                  { value: "all", label: "All events" },
                  { value: "attention", label: "Needs attention", dot: "bg-warning" },
                  { value: "on-sale", label: "On sale" },
                  { value: "unpublished", label: "Unpublished" },
                ] as { value: FilterValue; label: string; dot?: string }[]
              ).map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setStatusFilter(tab.value)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all",
                    statusFilter === tab.value
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {tab.dot && <span className={cn("h-2 w-2 rounded-full", tab.dot)} />}
                  {tab.label}
                  <span
                    className={cn(
                      "text-xs",
                      statusFilter === tab.value ? "text-muted-foreground" : "text-muted-foreground/50",
                    )}
                  >
                    {filterTabCounts[tab.value]}
                  </span>
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative flex items-center">
              <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground/60" />
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="h-9 w-56 pl-9 text-sm"
                placeholder="Search events or venue"
                aria-label="Search events"
              />
            </div>
          </div>

          {/* Filter strip */}
          <div className="flex flex-wrap items-center gap-2.5 border-b border-border/70 bg-muted/20 px-4 py-2.5 sm:px-6">
            {/* Location */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">Location</span>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="h-7 rounded-md border border-border/60 bg-background px-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="all">All</option>
                {uniqueLocations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div className="h-4 w-px bg-border/60" />

            {/* Date range */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">Date</span>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="h-7 rounded-md border border-border/60 bg-background px-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <span className="text-xs text-muted-foreground">–</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="h-7 rounded-md border border-border/60 bg-background px-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="h-4 w-px bg-border/60" />

            {/* Daypart */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">Daypart</span>
              <select
                value={daypartFilter}
                onChange={(e) => setDaypartFilter(e.target.value)}
                className="h-7 rounded-md border border-border/60 bg-background px-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="all">All</option>
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
              </select>
            </div>

            {/* Clear button */}
            {activeFilterCount > 0 && (
              <>
                <div className="h-4 w-px bg-border/60" />
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                >
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                    {activeFilterCount}
                  </span>
                  Clear filters
                </button>
              </>
            )}
          </div>

          {pendingChanges.total > 0 && (
            <div className="border-b bg-primary/5 px-4 py-2 text-sm text-primary sm:px-6">
              {pendingChanges.total} staged pricing update{pendingChanges.total === 1 ? "" : "s"} ready
              to publish.
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 border-b border-border/70 bg-card px-4 py-3 sm:px-6">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-foreground">
                  {selectedEventIds.length > 0
                    ? `${selectedEventIds.length} of ${visibleEventIds.length} selected`
                    : `${visibleEventIds.length} event${visibleEventIds.length === 1 ? "" : "s"}`}
                </p>
                {scopedRecommendations.length > 0 && (
                  <>
                    <span className="text-sm text-muted-foreground">·</span>
                    <span className="text-sm text-muted-foreground">
                      {scopedRecommendations.length} recommendation{scopedRecommendations.length === 1 ? "" : "s"}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2.5 text-xs font-semibold text-primary hover:text-primary hover:bg-primary/10"
                      onClick={applyAllRecommendations}
                    >
                      {selectedEventIds.length > 0 ? "Apply to Selected" : "Apply All"}
                    </Button>
                  </>
                )}
              </div>

              {selectedEventIds.length > 0 && (
                <div className="relative flex items-center gap-1">
                  <Button
                    ref={eventBulkEditBtnRef}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setShowEventBulkEditOverlay((current) => !current)}
                    disabled={sharedEventEditableFields.length === 0}
                    aria-label={`Edit ${selectedEventIds.length} selected events`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={clearEventSelection}
                    aria-label={`Clear ${selectedEventIds.length} selected events`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>

                  <BulkEditEventsModal
                    open={showEventBulkEditOverlay}
                    selectedEvents={selectedEvents}
                    sharedFields={sharedEventEditableFields}
                    summaries={eventBulkFieldSummaries}
                    values={bulkEventEditValues}
                    modes={bulkEventEditModes}
                    readyFields={bulkEventFieldsReadyToApply}
                    onClose={() => setShowEventBulkEditOverlay(false)}
                    onSetValue={setBulkEventFieldValue}
                    onSetMode={setBulkEventFieldMode}
                    onApply={applyBulkEventEdits}
                    onPublish={() => { applyBulkEventEdits(); setShowPublishOverlay(true); }}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="overflow-auto max-h-[calc(100vh-280px)]">
            <Table className="table-fixed" wrapperClassName="overflow-visible">
              <colgroup>
                <col style={{width: '420px'}} />
                <col style={{width: '130px'}} />
                <col style={{width: '170px'}} />
                <col style={{width: '160px'}} />
                <col style={{width: '105px'}} />
                <col style={{width: '180px'}} />
                <col style={{width: '120px'}} />
                <col style={{width: '120px'}} />
                <col style={{width: '100px'}} />
                <col style={{width: '110px'}} />
                <col style={{width: '90px'}} />
                <col style={{width: '100px'}} />
                <col style={{width: '110px'}} />
                <col style={{width: '90px'}} />
                <col style={{width: '100px'}} />
                <col style={{width: '110px'}} />
                <col style={{width: '90px'}} />
                <col style={{width: '160px'}} />
                <col style={{width: '150px'}} />
                <col style={{width: '130px'}} />
                <col style={{width: '140px'}} />
                <col style={{width: '110px'}} />
                <col style={{width: '150px'}} />
                <col style={{width: '120px'}} />
                <col style={{width: '70px'}} />
              </colgroup>
              <TableHeader className="bg-card sticky top-0 z-10 shadow-[0_1px_3px_0_rgba(0,0,0,0.06)]">
                <TableRow className="bg-card hover:bg-card">
                  <TableHead
                    colSpan={5}
                    className="h-5 border-x border-b border-border/60 bg-secondary/20 p-0 text-center"
                  >
                    <div className="flex h-full items-center justify-center">
                      <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/60">Event Details</span>
                    </div>
                  </TableHead>
                  <TableHead
                    colSpan={3}
                    className="h-5 border-x border-b border-border/60 bg-secondary/20 p-0 text-center"
                  >
                    <div className="flex h-full items-center justify-center">
                      <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/60">Pricing</span>
                    </div>
                  </TableHead>
                  <TableHead
                    colSpan={3}
                    className="w-[330px] h-5 border-x border-b border-border/60 bg-secondary/20 p-0 text-center"
                  >
                    <div className="flex h-full items-center justify-center">
                      <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/60">Dome</span>
                    </div>
                  </TableHead>
                  <TableHead
                    colSpan={3}
                    className="w-[330px] h-5 border-x border-b border-border/60 bg-secondary/20 p-0 text-center"
                  >
                    <div className="flex h-full items-center justify-center">
                      <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/60">Hall</span>
                    </div>
                  </TableHead>
                  <TableHead
                    colSpan={3}
                    className="w-[330px] h-5 border-x border-b border-border/60 bg-secondary/20 p-0 text-center"
                  >
                    <div className="flex h-full items-center justify-center">
                      <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/60">GA</span>
                    </div>
                  </TableHead>
                  <TableHead
                    colSpan={3}
                    className="w-[510px] h-5 border-x border-b border-border/60 bg-secondary/20 p-0 text-center"
                  >
                    <div className="flex h-full items-center justify-center">
                      <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/60">Revenue</span>
                    </div>
                  </TableHead>
                  <TableHead colSpan={5} className="w-[780px] h-5 border-b border-border/60 bg-secondary/20 p-0 text-center">
                    <div className="flex h-full items-center justify-center">
                      <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/60">Funnel Performance</span>
                    </div>
                  </TableHead>
                </TableRow>
                <TableRow className="hover:bg-card bg-card">
                  <TableHead className="w-[420px] whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={visibleEventIds.length > 0 && selectedVisibleEventCount === visibleEventIds.length}
                        indeterminate={
                          selectedVisibleEventCount > 0 &&
                          selectedVisibleEventCount < visibleEventIds.length
                        }
                        onCheckedChange={(checked) => toggleAllVisibleEvents(visibleEventIds, checked)}
                        aria-label="Select all visible events"
                      />
                      <button
                        type="button"
                        onClick={() => onSort("event")}
                        className="group flex items-center gap-1.5 whitespace-nowrap"
                      >
                        {sortLabelMap.event}
                        {sortIconForKey("event")}
                      </button>
                    </div>
                  </TableHead>
                  <TableHead className="w-[130px] whitespace-nowrap text-center">
                    Health
                  </TableHead>
                  <TableHead className="w-[170px] whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => onSort("startTime")}
                      className="group flex items-center gap-1.5 whitespace-nowrap"
                    >
                      {sortLabelMap.startTime}
                      {sortIconForKey("startTime")}
                    </button>
                  </TableHead>
                  <TableHead className="w-[160px] whitespace-nowrap">
                    Days / Window
                  </TableHead>
                  <TableHead className="w-[105px] whitespace-nowrap">% Cycle</TableHead>
                  <TableHead className="w-[180px] whitespace-nowrap border-l border-border/70 text-center">
                    Dome
                  </TableHead>
                  <TableHead className="w-[120px] whitespace-nowrap text-center">Hall</TableHead>
                  <TableHead className="w-[120px] whitespace-nowrap border-r border-border/70 text-center">GA</TableHead>
                  <TableHead className="w-[100px] whitespace-nowrap text-center border-l border-border/70">Sold</TableHead>
                  <TableHead className="w-[110px] whitespace-nowrap text-center">Proj. Sold</TableHead>
                  <TableHead className="w-[90px] whitespace-nowrap text-center border-r border-border/70">% Sold</TableHead>
                  <TableHead className="w-[100px] whitespace-nowrap text-center">Sold</TableHead>
                  <TableHead className="w-[110px] whitespace-nowrap text-center">Proj. Sold</TableHead>
                  <TableHead className="w-[90px] whitespace-nowrap text-center border-r border-border/70">% Sold</TableHead>
                  <TableHead className="w-[100px] whitespace-nowrap text-center">Sold</TableHead>
                  <TableHead className="w-[110px] whitespace-nowrap text-center">Proj. Sold</TableHead>
                  <TableHead className="w-[90px] whitespace-nowrap text-center border-r border-border/70">% Sold</TableHead>
                  <TableHead className="w-[160px] whitespace-nowrap border-l border-border/70 text-center px-5">
                    Net Ticket Rev
                  </TableHead>
                  <TableHead className="w-[150px] whitespace-nowrap text-center px-5">
                    Proj. Net Rev
                  </TableHead>
                  <TableHead className="w-[130px] whitespace-nowrap border-r border-border/70 text-center px-5">
                    Opt. Proj
                  </TableHead>
                  <TableHead className="w-[140px] whitespace-nowrap">TOF</TableHead>
                  <TableHead className="w-[110px] whitespace-nowrap">FCR</TableHead>
                  <TableHead className="w-[150px] whitespace-nowrap">FCR vs. Exp.</TableHead>
                  <TableHead className="w-[120px] whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => onSort("status")}
                      className="group flex items-center gap-1.5 whitespace-nowrap"
                    >
                      {sortLabelMap.status}
                      {sortIconForKey("status")}
                    </button>
                  </TableHead>
                  <TableHead className="w-[70px]" />
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredAndSortedEvents.map((event) => {
                  const hasSeatGroups = event.seatGroups.length > 0;
                  const isExpanded = expandedRows.has(event.id);
                  const isPendingPublish = pendingChanges.changedEventIds.has(event.id);
                  const publishedEvent = publishedById.get(event.id);
                  const selectedSeatGroupIds = selectedSeatGroupsByEvent[event.id] ?? [];
                  const allSeatGroupsSelected =
                    hasSeatGroups && selectedSeatGroupIds.length === event.seatGroups.length;
                  const hasSelectedSeatGroups = selectedSeatGroupIds.length > 0;
                  const bulkSeatEditValue = bulkSeatEditValues[event.id] ?? "";
                  const bulkSeatEditField = bulkSeatEditFieldByEvent[event.id] ?? "currentPrice";
                  const bulkSeatEditMode = bulkSeatEditModeByEvent[event.id] ?? "set";
                  const isBulkEditOverlayOpen = activeBulkEditEventId === event.id;
                  const domePriceRange = formatSeatGroupPriceRange(event, "currentPrice");
                  const domeSellthroughLift = getSellthroughLift(
                    event.soldPct,
                    event.domeProjectedSellthroughPct,
                  );
                  const hallProjectedSellthrough = projectSellthroughMetric(
                    event.hallSoldPct,
                    domeSellthroughLift,
                    0.85,
                  );
                  const gaSoldPct = getSeatGroupByName(event, "GA")?.soldPct ?? null;
                  const gaProjectedSellthrough = projectSellthroughMetric(
                    gaSoldPct,
                    domeSellthroughLift,
                    0.65,
                  );
                  const netTicketRevenueBreakdown = getNetTicketRevenueBreakdown(event);

                  return (
                    <Fragment key={event.id}>
                      <TableRow
                        onClick={() => toggleExpanded(event.id)}
                        className={cn(
                          "cursor-pointer hover:bg-muted/35",
                          event.attention === "underperforming" && !isExpanded && "bg-warning/5",
                          isExpanded && "bg-primary/[0.03] border-l-2 border-l-primary",
                        )}
                      >
                        <TableCell>
                          <div className="flex items-start gap-3">
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); toggleExpanded(event.id); }}
                              aria-label={isExpanded ? "Collapse event details" : "Expand event details"}
                              className={cn(
                                "flex h-6 w-6 shrink-0 items-center justify-center rounded transition-colors",
                                isExpanded
                                  ? "bg-foreground/8 text-foreground"
                                  : "text-muted-foreground hover:text-foreground"
                              )}
                            >
                              <ChevronRight
                                className={cn("h-3.5 w-3.5 transition-transform duration-150", isExpanded && "rotate-90")}
                              />
                            </button>
                            <Checkbox
                              className="mt-1"
                              checked={selectedEventIds.includes(event.id)}
                              onCheckedChange={(checked) => toggleEventSelection(event.id, checked)}
                              onClick={(e) => e.stopPropagation()}
                              aria-label={`Select ${event.event}`}
                            />

                            <div className="min-w-0">
                              <p className="max-w-[540px] whitespace-normal text-xs leading-tight">
                                {event.event}
                              </p>
                              <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
                                <p className="text-xs text-muted-foreground">{event.venueName}</p>
                                {attentionBadge(event)}
                                {isPendingPublish && (
                                  <Badge variant="secondary" className="bg-primary/12 text-primary">
                                    Pending Publish
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="text-center">
                          <EventHealthBadge score={event.eventHealth} />
                        </TableCell>

                        <TableCell>
                          <div>
                            <p className="text-foreground">{formatStartDate(event.startTimeValue)}</p>
                            <p className="text-xs text-muted-foreground">
                              {event.weekdayLabel} {formatStartTime(event.startTimeValue)} {getVenueTimezone(event.venueName)}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {event.daysInMarket !== null && event.salesWindowDays !== null
                            ? `${event.daysInMarket} / ${event.salesWindowDays}`
                            : event.daysInMarket ?? "--"}
                        </TableCell>
                        <TableCell>
                          {formatCycleComplete(event.daysInMarket, event.salesWindowDays)}
                        </TableCell>
                        <TableCell className="whitespace-nowrap border-l border-border/40 text-center">
                          {domePriceRange}
                        </TableCell>
                        <TableCell className="text-center">
                          {event.hallAtp !== null ? formatCurrency(event.hallAtp) : "--"}
                        </TableCell>
                        <TableCell className="text-center border-r border-border/40">
                          {event.gaAtp !== null ? formatCurrency(event.gaAtp) : "--"}
                        </TableCell>
                        <TableCell className="text-center border-l border-border/40">
                          {event.domeSold !== null ? formatWholeNumber(event.domeSold) : "--"}
                        </TableCell>
                        <TableCell className="text-center">
                          {event.domeSoldProjected !== null ? formatWholeNumber(event.domeSoldProjected) : "--"}
                        </TableCell>
                        <TableCell className="text-center border-r border-border/40">
                          <SellThroughBar pct={event.soldPct} />
                        </TableCell>
                        <TableCell className="text-center">
                          {event.hallSold !== null ? formatWholeNumber(event.hallSold) : "--"}
                        </TableCell>
                        <TableCell className="text-center">
                          {event.hallSoldProjected !== null ? formatWholeNumber(event.hallSoldProjected) : "--"}
                        </TableCell>
                        <TableCell className="text-center border-r border-border/40">
                          <SellThroughBar pct={event.hallSoldPct} />
                        </TableCell>
                        <TableCell className="text-center">
                          {event.gaSold !== null ? formatWholeNumber(event.gaSold) : "--"}
                        </TableCell>
                        <TableCell className="text-center">
                          {event.gaSoldProjected !== null ? formatWholeNumber(event.gaSoldProjected) : "--"}
                        </TableCell>
                        <TableCell className="text-center border-r border-border/40">
                          <SellThroughBar pct={gaSoldPct} />
                        </TableCell>
                        <TableCell
                          className={cn(
                            "border-l border-border/40 text-center px-5",
                            event.attention === "underperforming" && "text-destructive",
                          )}
                        >
                          {event.netTicketRevenue === null ? (
                            "--"
                          ) : (
                            <div className="group relative inline-flex">
                              <span
                                tabIndex={0}
                                className={cn(
                                  "cursor-help underline decoration-dotted underline-offset-4 transition-colors focus:outline-none",
                                  event.attention === "underperforming"
                                    ? "text-destructive hover:text-destructive focus:text-destructive"
                                    : "text-foreground hover:text-primary focus:text-primary",
                                )}
                              >
                                {formatCurrency(event.netTicketRevenue)}
                              </span>
                              <div className="pointer-events-none absolute left-1/2 top-full z-20 mt-1.5 w-[220px] -translate-x-1/2 rounded-lg border border-border/80 bg-card p-3 text-left shadow-xl opacity-0 transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
                                <p className="mb-2 text-xs font-semibold text-foreground">
                                  Net Ticket Revenue
                                </p>
                                <ul className="space-y-1.5">
                                  <li className="flex items-center justify-between gap-3 text-xs">
                                    <span className="font-medium text-foreground">Group Sales</span>
                                    <span className="text-muted-foreground">{formatCurrency(netTicketRevenueBreakdown.groupSales)}</span>
                                  </li>
                                  <li className="flex items-center justify-between gap-3 text-xs">
                                    <span className="font-medium text-foreground">Consumer</span>
                                    <span className="text-muted-foreground">{formatCurrency(netTicketRevenueBreakdown.consumer)}</span>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-center px-5">
                          {formatCurrency(event.projectedNetRevenue)}
                        </TableCell>
                        <TableCell className="border-r border-border/40 text-center px-5">
                          {formatCurrency(event.optimizedProjected)}
                        </TableCell>
                        <TableCell>{formatWholeNumber(event.tof)}</TableCell>
                        <TableCell>{formatPercent(event.fcrPct)}</TableCell>
                        <TableCell
                          className={cn(
                            "font-semibold",
                            event.fcrVsExpectedPct === null && "text-muted-foreground",
                            event.fcrVsExpectedPct !== null && event.fcrVsExpectedPct < 0 && "text-destructive",
                            event.fcrVsExpectedPct !== null && event.fcrVsExpectedPct > 0 && "text-success",
                          )}
                        >
                          {formatSignedPercent(event.fcrVsExpectedPct)}
                        </TableCell>

                        <TableCell>
                          {event.status === "On Sale" ? (
                            <Badge variant="secondary" className="bg-success/15 text-success">
                              {event.status}
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-muted text-muted-foreground">
                              {event.status}
                            </Badge>
                          )}
                        </TableCell>

                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onSelect={(selectionEvent) => {
                                  selectionEvent.preventDefault();
                                  navigate(`/seatmap/${encodeURIComponent(event.id)}`);
                                }}
                              >
                                View Seatmap
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onSelect={(selectionEvent) => {
                                  selectionEvent.preventDefault();
                                  navigate(`/reporting/${encodeURIComponent(event.id)}`);
                                }}
                              >
                                Go to Reporting
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>

                      {isExpanded && (
                        <TableRow className="bg-muted/20 hover:bg-muted/20 border-l-2 border-l-primary">
                          <TableCell colSpan={20} className="p-0">
                            <div className="mx-5 my-4 max-w-[1100px] overflow-clip rounded-lg border border-border/60 bg-card shadow-sm">
                              {hasSeatGroups ? (
                                <>
                                  <div className="sticky top-[68.5px] z-[5] bg-card">
                                  <div className="flex flex-wrap items-center gap-3 border-b border-border/70 bg-secondary/35 px-4 py-3">
                                    <div className="flex items-center gap-2">
                                      <p className="text-sm font-medium text-foreground">
                                        {hasSelectedSeatGroups
                                          ? `${selectedSeatGroupIds.length} seat group${
                                              selectedSeatGroupIds.length === 1 ? "" : "s"
                                            } selected`
                                          : "Seat Group Pricing"}
                                      </p>
                                      {hasSelectedSeatGroups && (
                                        <div className="relative flex items-center gap-1">
                                          <Button
                                            ref={(el) => { seatBulkEditBtnRefs.current[event.id] = el; }}
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7"
                                            onClick={() =>
                                              setActiveBulkEditEventId((current) =>
                                                current === event.id ? null : event.id,
                                              )
                                            }
                                            aria-label={`Edit ${selectedSeatGroupIds.length} selected seat groups`}
                                          >
                                            <Pencil className="h-3.5 w-3.5" />
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                            onClick={() => clearSeatGroupSelection(event.id)}
                                            aria-label={`Clear ${selectedSeatGroupIds.length} selected seat groups`}
                                          >
                                            <Trash2 className="h-3.5 w-3.5" />
                                          </Button>
                                        {isBulkEditOverlayOpen && createPortal(
                                          <div
                                            className="fixed z-50 w-[280px] rounded-xl border border-border/80 bg-card p-3 shadow-xl"
                                            style={(() => {
                                              const rect = seatBulkEditBtnRefs.current[event.id]?.getBoundingClientRect();
                                              return rect ? { top: rect.bottom + 8, left: Math.max(8, rect.right - 280) } : { top: 0, left: 0 };
                                            })()}
                                          >
                                            <div className="space-y-3">
                                              <Select
                                                value={bulkSeatEditField}
                                                onValueChange={(next) =>
                                                  {
                                                    setBulkSeatEditFieldByEvent((current) => ({
                                                      ...current,
                                                      [event.id]: next as SeatGroupEditableField,
                                                    }));
                                                    setBulkSeatEditModeByEvent((current) => ({
                                                      ...current,
                                                      [event.id]: "set",
                                                    }));
                                                  }
                                                }
                                              >
                                                <SelectTrigger className="h-8 w-full bg-background">
                                                  <SelectValue placeholder="Field" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  <SelectItem value="name">Seat Group</SelectItem>
                                                  <SelectItem value="currentPrice">Current Price</SelectItem>
                                                </SelectContent>
                                              </Select>
                                              {bulkSeatEditField === "currentPrice" && (
                                                <Select
                                                  value={bulkSeatEditMode}
                                                  onValueChange={(next) =>
                                                    setBulkSeatEditModeByEvent((current) => ({
                                                      ...current,
                                                      [event.id]: next as NumericBulkEditMode,
                                                    }))
                                                  }
                                                >
                                                  <SelectTrigger className="h-8 w-full bg-background">
                                                    <SelectValue placeholder="Mode" />
                                                  </SelectTrigger>
                                                  <SelectContent>
                                                    {numericBulkEditModes.map((mode) => (
                                                      <SelectItem key={mode.value} value={mode.value}>
                                                        {mode.label}
                                                      </SelectItem>
                                                    ))}
                                                  </SelectContent>
                                                </Select>
                                              )}
                                              <Input
                                                type={bulkSeatEditField === "currentPrice" ? "number" : "text"}
                                                inputMode={bulkSeatEditField === "currentPrice" ? "decimal" : "text"}
                                                step={bulkSeatEditField === "currentPrice" ? "0.01" : undefined}
                                                value={bulkSeatEditValue}
                                                onChange={(selectionEvent) =>
                                                  setBulkSeatEditValues((current) => ({
                                                    ...current,
                                                    [event.id]: selectionEvent.target.value,
                                                  }))
                                                }
                                                onKeyDown={(selectionEvent) => {
                                                  if (selectionEvent.key === "Enter") {
                                                    applyBulkSeatEdit(event.id);
                                                  }
                                                  if (selectionEvent.key === "Escape") {
                                                    setActiveBulkEditEventId(null);
                                                  }
                                                }}
                                                className="h-8 w-full bg-background"
                                                placeholder={
                                                  bulkSeatEditField === "name"
                                                    ? "Set name"
                                                    : bulkSeatEditMode === "percent"
                                                      ? "Increase by %"
                                                      : bulkSeatEditMode === "flat"
                                                        ? "Increase by amount"
                                                        : "Set price"
                                                }
                                                aria-label={`Bulk edit ${bulkSeatEditField} for ${event.event}`}
                                              />
                                              <div className="flex items-center justify-end gap-2">
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => setActiveBulkEditEventId(null)}
                                                >
                                                  Cancel
                                                </Button>
                                                <Button
                                                  variant="secondary"
                                                  size="sm"
                                                  onClick={() => applyBulkSeatEdit(event.id)}
                                                  disabled={bulkSeatEditValue.trim() === ""}
                                                >
                                                  Apply
                                                </Button>
                                              </div>
                                            </div>
                                          </div>,
                                          document.body,
                                        )}
                                      </div>
                                    )}
                                    </div>
                                  </div>
                                  </div>
                                  <Table className="table-fixed" wrapperClassName="overflow-visible">
                                    <TableHeader className="sticky top-[113.5px] z-[4] bg-secondary/55">
                                      <TableRow className="bg-card [&_th]:bg-secondary/55 hover:bg-secondary/55">
                                        <TableHead className="w-[40px] whitespace-nowrap">
                                          <Checkbox
                                            checked={allSeatGroupsSelected}
                                            indeterminate={hasSelectedSeatGroups && !allSeatGroupsSelected}
                                            onCheckedChange={(checked) =>
                                              toggleAllSeatGroupsForEvent(
                                                event.id,
                                                event.seatGroups,
                                                checked,
                                              )
                                            }
                                            aria-label={`Select all seat groups for ${event.event}`}
                                          />
                                        </TableHead>
                                        <TableHead className="w-[120px] whitespace-nowrap">Seat Group</TableHead>
                                        <TableHead className="w-[100px] whitespace-nowrap">Original Price</TableHead>
                                        <TableHead className="w-[130px] whitespace-nowrap">Current Price</TableHead>
                                        <TableHead className="w-[100px] whitespace-nowrap text-center">% Sold</TableHead>
                                        <TableHead className="w-[80px] whitespace-nowrap">Tkt Rem.</TableHead>
                                        <TableHead className="w-[110px] whitespace-nowrap">Proj. Revenue</TableHead>
                                        <TableHead className="w-[80px] whitespace-nowrap">Yield</TableHead>
                                      </TableRow>
                                    </TableHeader>

                                    <TableBody>
                                      {event.seatGroups.map((seatGroup) => {
                                        const publishedSeatGroup = publishedEvent?.seatGroups.find(
                                          (item) => item.id === seatGroup.id,
                                        );
                                        const isSeatRecommendationDifferent = !arePriceValuesEqual(
                                          seatGroup.recTicketPrice,
                                          seatGroup.currentPrice,
                                        );
                                        const seatRecommendationKey = `${event.id}:${seatGroup.id}`;
                                        const isSeatRecommendationUndo =
                                          draftSeatRecommendationUndoById[seatRecommendationKey] !== undefined &&
                                          arePriceValuesEqual(
                                            seatGroup.recTicketPrice,
                                            seatGroup.currentPrice,
                                          );
                                        const isSeatNameDirty =
                                          seatGroup.name !== (publishedSeatGroup?.name ?? seatGroup.name);
                                        const isSeatPriceDirty =
                                          seatGroup.currentPrice !==
                                          (publishedSeatGroup?.currentPrice ?? seatGroup.currentPrice);

                                        return (
                                          <TableRow key={seatGroup.id}>
                                        <TableCell>
                                          <Checkbox
                                            checked={selectedSeatGroupIds.includes(seatGroup.id)}
                                            onCheckedChange={(checked) =>
                                              toggleSeatGroupSelection(
                                                event.id,
                                                seatGroup.id,
                                                checked,
                                              )
                                            }
                                            aria-label={`Select ${seatGroup.name}`}
                                          />
                                        </TableCell>
                                        <TableCell>
                                          {editingSeatCell?.eventId === event.id &&
                                          editingSeatCell.seatGroupId === seatGroup.id &&
                                          editingSeatCell.field === "name" ? (
                                            <Input
                                              type="text"
                                              autoFocus
                                              value={editingSeatValue}
                                              onChange={(selectionEvent) =>
                                                setEditingSeatValue(selectionEvent.target.value)
                                              }
                                              onKeyDown={(selectionEvent) => {
                                                if (selectionEvent.key === "Enter") {
                                                  commitSeatCellEdit();
                                                }
                                                if (selectionEvent.key === "Escape") {
                                                  cancelSeatPriceEdit();
                                                }
                                              }}
                                              onBlur={cancelSeatPriceEdit}
                                              className="h-8 w-[150px] bg-background"
                                              aria-label={`Seat group name for ${seatGroup.name}`}
                                            />
                                          ) : (
                                            <button
                                              type="button"
                                              onDoubleClick={() => beginSeatCellEdit(event.id, seatGroup, "name")}
                                              className={cn(
                                                "rounded px-1 text-left font-medium",
                                                isSeatNameDirty ? "text-orange-500" : "text-foreground",
                                              )}
                                              aria-label={`Edit seat group name for ${seatGroup.name}`}
                                            >
                                              {seatGroup.name}
                                            </button>
                                          )}
                                        </TableCell>
                                        <TableCell>{formatCurrency(seatGroup.originalPrice)}</TableCell>
                                        <TableCell>
                                          <div className="flex flex-col items-start gap-1">
                                            {editingSeatCell?.eventId === event.id &&
                                            editingSeatCell.seatGroupId === seatGroup.id &&
                                            editingSeatCell.field === "currentPrice" ? (
                                              <Input
                                                type="number"
                                                inputMode="decimal"
                                                min="0"
                                                step="0.01"
                                                autoFocus
                                                value={editingSeatValue}
                                                onChange={(selectionEvent) =>
                                                  setEditingSeatValue(selectionEvent.target.value)
                                                }
                                                onKeyDown={(selectionEvent) => {
                                                  if (selectionEvent.key === "Enter") {
                                                    commitSeatCellEdit();
                                                  }
                                                  if (selectionEvent.key === "Escape") {
                                                    cancelSeatPriceEdit();
                                                  }
                                                }}
                                                onBlur={cancelSeatPriceEdit}
                                                className="h-8 w-[110px] bg-background"
                                                aria-label={`Current price for ${seatGroup.name}`}
                                              />
                                            ) : (
                                              <button
                                                type="button"
                                                onDoubleClick={() =>
                                                  beginSeatCellEdit(event.id, seatGroup, "currentPrice")
                                                }
                                                className={cn(
                                                  "rounded px-1 text-left",
                                                  isSeatPriceDirty ? "text-orange-500" : "text-foreground",
                                                )}
                                                aria-label={`Edit current price for ${seatGroup.name}`}
                                              >
                                                {formatCurrency(seatGroup.currentPrice)}
                                              </button>
                                            )}
                                            <div className="flex items-center gap-1.5 text-xs">
                                              <span className="text-muted-foreground">Rec.</span>
                                              <button
                                                type="button"
                                                onClick={() =>
                                                  isSeatRecommendationUndo
                                                    ? undoDraftSeatGroupRecommendation(event.id, seatGroup.id)
                                                    : applyDraftSeatGroupRecommendation(
                                                        event.id,
                                                        seatGroup.id,
                                                        seatGroup.currentPrice,
                                                        seatGroup.recTicketPrice,
                                                      )
                                                }
                                                disabled={
                                                  !isSeatRecommendationDifferent && !isSeatRecommendationUndo
                                                }
                                                className={cn(
                                                  "inline-flex h-6 items-center rounded-full border px-2.5 text-[11px] font-semibold transition",
                                                  isSeatRecommendationUndo
                                                    ? "border-warning/50 bg-warning/10 text-warning hover:bg-warning/15"
                                                    : isSeatRecommendationDifferent
                                                      ? "border-primary/40 bg-primary/10 text-primary hover:bg-primary/15"
                                                      : "cursor-default border-border/70 bg-secondary/20 text-muted-foreground",
                                                )}
                                                aria-label={
                                                  isSeatRecommendationUndo
                                                    ? `Undo recommended price for ${seatGroup.name}`
                                                    : `Apply recommended price for ${seatGroup.name}`
                                                }
                                              >
                                                {isSeatRecommendationUndo
                                                  ? "Undo"
                                                  : formatCurrency(seatGroup.recTicketPrice)}
                                              </button>
                                            </div>
                                          </div>
                                        </TableCell>
                                        <TableCell className="text-center"><SellThroughBar pct={seatGroup.soldPct} compact /></TableCell>
                                        <TableCell>{seatGroup.ticketsRemaining}</TableCell>
                                        <TableCell>{formatCurrency(seatGroup.projectedRevenue)}</TableCell>
                                        <TableCell>{formatCurrency(seatGroup.yield)}</TableCell>
                                          </TableRow>
                                        );
                                      })}
                                    </TableBody>
                                  </Table>
                                </>
                              ) : (
                                <div className="px-4 py-6 text-sm text-muted-foreground">
                                  No seat group pricing is available for this event yet.
                                </div>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </section>
      </main>
      <DraftActionFooter
        stagedCount={pendingChanges.total}
        onDiscard={onDiscardChanges}
        onPublish={onPublishChanges}
      />
    </div>
  );
}

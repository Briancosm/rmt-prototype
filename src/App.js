import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Fragment, useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowDown, ArrowUp, ArrowUpDown, Check, ChevronRight, MoreHorizontal, Pencil, Search, Trash2, } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { cn } from "@/lib/utils";
const initialEvents = [
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
        recAtp: 55,
        soldPct: 60,
        domeProjectedSellthroughPct: 60,
        hallSoldPct: 60,
        daysRemaining: 14,
        projectedRevenue: 40000,
        netTicketRevenue: 15000,
        projectedNetRevenue: 15000,
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
        recAtp: 55,
        soldPct: 60,
        domeProjectedSellthroughPct: 62,
        hallSoldPct: 58,
        daysRemaining: 14,
        projectedRevenue: 40000,
        netTicketRevenue: 14850,
        projectedNetRevenue: 15425,
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
        recAtp: 52,
        soldPct: 83,
        domeProjectedSellthroughPct: 86,
        hallSoldPct: 79,
        daysRemaining: 14,
        projectedRevenue: 42200,
        netTicketRevenue: 18125,
        projectedNetRevenue: 17680,
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
        recAtp: 55,
        soldPct: 60,
        domeProjectedSellthroughPct: 64,
        hallSoldPct: 57,
        daysRemaining: 14,
        projectedRevenue: 40000,
        netTicketRevenue: 15240,
        projectedNetRevenue: 15890,
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
        recAtp: null,
        soldPct: null,
        domeProjectedSellthroughPct: null,
        hallSoldPct: null,
        daysRemaining: null,
        projectedRevenue: null,
        netTicketRevenue: null,
        projectedNetRevenue: null,
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
];
const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});
const statusFilterOptions = [
    { label: "All Events", value: "all" },
    { label: "Needs Attention", value: "attention" },
    { label: "On Sale", value: "on-sale" },
    { label: "Unpublished", value: "unpublished" },
];
const sortLabelMap = {
    event: "Event",
    startTime: "Start Time",
    domeAtp: "Dome ATP",
    recAtp: "Rec. ATP",
    soldPct: "% Sold",
    daysRemaining: "Days Remaining",
    projectedRevenue: "Proj. Revenue",
    status: "Status",
};
function cloneEvents(events) {
    return events.map((event) => ({
        ...event,
        priceTierOptions: [...event.priceTierOptions],
        seatGroups: event.seatGroups.map((seatGroup) => ({ ...seatGroup })),
    }));
}
function formatCurrency(value) {
    if (value === null) {
        return "--";
    }
    return currencyFormatter.format(value);
}
function formatWholeNumber(value) {
    if (value === null) {
        return "--";
    }
    return value.toLocaleString("en-US");
}
function summarizeBulkEditValues(values, formatter) {
    if (values.length === 0) {
        return { valueLabel: "--", rawValue: null, isMixed: false };
    }
    const firstValue = values[0];
    if (values.every((value) => value === firstValue)) {
        return {
            valueLabel: formatter(firstValue),
            rawValue: firstValue,
            isMixed: false,
        };
    }
    return { valueLabel: "Mixed", rawValue: null, isMixed: true };
}
function formatPercent(value) {
    if (value === null) {
        return "--";
    }
    return `${value}%`;
}
function formatSignedPercent(value) {
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
function formatCycleComplete(daysOnSale, totalWindowDays) {
    if (daysOnSale === null || totalWindowDays === null || totalWindowDays <= 0) {
        return "--";
    }
    const percentComplete = roundTo((daysOnSale / totalWindowDays) * 100, 1);
    return formatPercent(percentComplete);
}
function getSellthroughLift(actualPct, projectedPct) {
    if (actualPct === null || projectedPct === null) {
        return 0;
    }
    return projectedPct - actualPct;
}
function projectSellthroughMetric(actualPct, projectionLift, multiplier) {
    if (actualPct === null) {
        return null;
    }
    return roundTo(clamp(actualPct + projectionLift * multiplier, 0, 100), 1);
}
function getSeatGroupByName(event, seatGroupName) {
    return event.seatGroups.find((seatGroup) => seatGroup.name.trim().toLowerCase() === seatGroupName.trim().toLowerCase());
}
function formatSeatGroupPriceRange(event, field) {
    if (event.seatGroups.length === 0) {
        return "--";
    }
    const values = event.seatGroups.map((seatGroup) => seatGroup[field]);
    const minimum = Math.min(...values);
    const maximum = Math.max(...values);
    return `${formatCurrency(minimum)} - ${formatCurrency(maximum)}`;
}
function getNetTicketRevenueBreakdown(event) {
    if (event.netTicketRevenue === null) {
        return {
            groupSales: null,
            consumer: null,
        };
    }
    const groupSalesRatio = clamp(0.24 + ((event.hallSoldPct ?? event.soldPct ?? 50) - 50) / 250, 0.18, 0.46);
    const groupSales = roundTo(event.netTicketRevenue * groupSalesRatio, 2);
    const consumer = roundTo(event.netTicketRevenue - groupSales, 2);
    return {
        groupSales,
        consumer,
    };
}
function RealtimeColumnLabel({ children }) {
    return (_jsx("span", { className: "inline-flex whitespace-nowrap rounded-md bg-warning/20 px-2 py-1 font-semibold text-foreground ring-1 ring-warning/35", children: children }));
}
function parseRoute(pathname) {
    const seatmapMatch = pathname.match(/^\/seatmap\/([^/]+)\/?$/);
    if (seatmapMatch) {
        return { type: "seatmap", eventId: decodeURIComponent(seatmapMatch[1]) };
    }
    const reportingMatch = pathname.match(/^\/reporting\/([^/]+)\/?$/);
    if (reportingMatch) {
        return { type: "reporting", eventId: decodeURIComponent(reportingMatch[1]) };
    }
    return { type: "price-adjustment" };
}
function calculatePendingChanges(publishedEvents, draftEvents) {
    const publishedById = new Map(publishedEvents.map((event) => [event.id, event]));
    const changedEventIds = new Set();
    let total = 0;
    for (const draftEvent of draftEvents) {
        const publishedEvent = publishedById.get(draftEvent.id);
        if (!publishedEvent) {
            continue;
        }
        const eventLevelDirty = draftEvent.priceTier !== publishedEvent.priceTier || draftEvent.domeAtp !== publishedEvent.domeAtp;
        if (eventLevelDirty) {
            total += 1;
            changedEventIds.add(draftEvent.id);
        }
        const publishedSeatGroups = new Map(publishedEvent.seatGroups.map((seatGroup) => [seatGroup.id, seatGroup]));
        for (const draftSeatGroup of draftEvent.seatGroups) {
            const publishedSeatGroup = publishedSeatGroups.get(draftSeatGroup.id);
            if (!publishedSeatGroup) {
                continue;
            }
            if (draftSeatGroup.name !== publishedSeatGroup.name ||
                draftSeatGroup.currentPrice !== publishedSeatGroup.currentPrice) {
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
function attentionBadge(attention) {
    if (attention === "underperforming") {
        return (_jsx(Badge, { variant: "warning", className: "ml-1.5 shrink-0 whitespace-nowrap", children: "Needs Attention" }));
    }
    return null;
}
function PublishedOverlay({ visible }) {
    return (_jsx("div", { className: cn("pointer-events-none fixed left-1/2 top-5 z-[80] -translate-x-1/2 transform transition-all duration-500", visible ? "translate-y-0 scale-100 opacity-100" : "-translate-y-2 scale-95 opacity-0"), "aria-live": "polite", children: _jsxs("span", { className: "inline-flex items-center gap-2 rounded-xl border bg-card px-6 py-3 text-base font-semibold text-foreground shadow-2xl", children: [_jsx(Check, { className: "h-5 w-5 text-success" }), "Changes published"] }) }));
}
function DraftActionFooter({ stagedCount, onDiscard, onPublish, scopeLabel, extraActionLabel, onExtraAction, extraActionDisabled, }) {
    const hasChanges = stagedCount > 0;
    const scopeSuffix = scopeLabel ? ` ${scopeLabel}` : "";
    return (_jsx("footer", { className: "fixed inset-x-0 bottom-0 z-[70] border-t border-border/60 bg-card/98 backdrop-blur-sm", children: _jsxs("div", { className: "mx-auto flex max-w-[1450px] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: cn("h-1.5 w-1.5 rounded-full", hasChanges ? "bg-warning" : "bg-muted-foreground/30") }), _jsx("p", { className: cn("text-sm", hasChanges ? "font-medium text-foreground" : "text-muted-foreground"), children: hasChanges
                                ? `${stagedCount} staged change${stagedCount === 1 ? "" : "s"}${scopeSuffix} ready to publish`
                                : `No staged changes${scopeSuffix}` })] }), _jsxs("div", { className: "flex items-center gap-2", children: [extraActionLabel && onExtraAction && (_jsx(Button, { variant: "secondary", onClick: onExtraAction, disabled: extraActionDisabled, children: extraActionLabel })), _jsx(Button, { variant: "ghost", onClick: onDiscard, disabled: !hasChanges, className: "text-muted-foreground hover:text-foreground", children: "Discard Draft" }), _jsx(Button, { onClick: onPublish, disabled: !hasChanges, className: cn(!hasChanges && "opacity-40"), children: hasChanges ? `Publish ${stagedCount} Change${stagedCount === 1 ? "" : "s"}` : "Publish Changes" })] })] }) }));
}
function SvgPointTooltip({ x, y, width, height, left, right, top, bottom, title, lines, }) {
    const tooltipWidth = 214;
    const lineHeight = 14;
    const tooltipHeight = 26 + lines.length * lineHeight;
    const placeAbove = y - tooltipHeight - 10 >= top;
    const rawX = x - tooltipWidth / 2;
    const tooltipX = clamp(rawX, left + 4, width - right - tooltipWidth - 4);
    const tooltipY = placeAbove
        ? y - tooltipHeight - 10
        : clamp(y + 10, top + 4, height - bottom - tooltipHeight - 4);
    return (_jsxs("g", { transform: `translate(${tooltipX},${tooltipY})`, pointerEvents: "none", children: [_jsx("rect", { width: tooltipWidth, height: tooltipHeight, rx: 10, ry: 10, fill: "hsl(var(--card))", stroke: "hsl(var(--border))" }), _jsx("text", { x: 12, y: 16, fontSize: 11, fontWeight: 700, fill: "hsl(var(--foreground))", children: title }), lines.map((line, index) => (_jsx("text", { x: 12, y: 34 + index * lineHeight, fontSize: 11, fill: "hsl(var(--muted-foreground))", children: line }, `${title}-${line}-${index}`)))] }));
}
function sortValueForKey(row, key) {
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
const numericBulkEditModes = [
    { value: "set", label: "Set value" },
    { value: "flat", label: "Increase by amount" },
    { value: "percent", label: "Increase by %" },
];
function formatPublishValue(value) {
    if (typeof value === "number") {
        return formatCurrency(value);
    }
    if (value === null) {
        return "--";
    }
    return value;
}
function formatRecommendationReviewValue(value, format) {
    if (format === "percent") {
        return `${roundTo(value, 1)}%`;
    }
    return formatCurrency(value);
}
function formatRecommendationReviewInputValue(value, decimals) {
    return String(roundTo(value, decimals));
}
function intersectOptions(optionGroups) {
    if (optionGroups.length === 0) {
        return [];
    }
    return optionGroups.reduce((sharedOptions, options) => sharedOptions.filter((option) => options.includes(option)));
}
function buildPublishChangeRows(publishedEvents, draftEvents) {
    const publishedById = new Map(publishedEvents.map((event) => [event.id, event]));
    const changeRows = [];
    for (const draftEvent of draftEvents) {
        const publishedEvent = publishedById.get(draftEvent.id);
        if (!publishedEvent) {
            continue;
        }
        const eventChanges = [];
        if (draftEvent.priceTier !== publishedEvent.priceTier) {
            eventChanges.push({
                fieldLabel: "Price Tier",
                previousValue: formatPublishValue(publishedEvent.priceTier),
                nextValue: formatPublishValue(draftEvent.priceTier),
            });
        }
        if (draftEvent.domeAtp !== publishedEvent.domeAtp) {
            eventChanges.push({
                fieldLabel: "Dome ATP",
                previousValue: formatPublishValue(publishedEvent.domeAtp),
                nextValue: formatPublishValue(draftEvent.domeAtp),
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
        const publishedSeatGroups = new Map(publishedEvent.seatGroups.map((seatGroup) => [seatGroup.id, seatGroup]));
        for (const draftSeatGroup of draftEvent.seatGroups) {
            const publishedSeatGroup = publishedSeatGroups.get(draftSeatGroup.id);
            if (!publishedSeatGroup) {
                continue;
            }
            const seatGroupChanges = [];
            if (draftSeatGroup.name !== publishedSeatGroup.name) {
                seatGroupChanges.push({
                    fieldLabel: "Seat Group",
                    previousValue: formatPublishValue(publishedSeatGroup.name),
                    nextValue: formatPublishValue(draftSeatGroup.name),
                });
            }
            if (draftSeatGroup.currentPrice !== publishedSeatGroup.currentPrice) {
                seatGroupChanges.push({
                    fieldLabel: "Current Price",
                    previousValue: formatPublishValue(publishedSeatGroup.currentPrice),
                    nextValue: formatPublishValue(draftSeatGroup.currentPrice),
                });
            }
            if (seatGroupChanges.length > 0) {
                changeRows.push({
                    id: `seat-group-${draftEvent.id}-${draftSeatGroup.id}`,
                    rowLabel: draftSeatGroup.name,
                    contextLabel: `${draftEvent.event} / Seat Group`,
                    changes: seatGroupChanges,
                });
            }
        }
    }
    return changeRows;
}
function PublishConfirmationModal({ open, changeRows, onCancel, onConfirm, }) {
    if (!open) {
        return null;
    }
    const fieldChangeCount = changeRows.reduce((total, row) => total + row.changes.length, 0);
    return (_jsx("div", { className: "fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/45 px-4 py-8", children: _jsxs("div", { className: "max-h-[85vh] w-full max-w-4xl overflow-hidden rounded-2xl border bg-card shadow-2xl", children: [_jsxs("div", { className: "border-b px-6 py-4", children: [_jsx("h2", { className: "font-heading text-xl font-semibold text-foreground", children: "Confirm Publish Changes" }), _jsxs("p", { className: "mt-1 text-sm text-muted-foreground", children: ["Review ", changeRows.length, " edited row", changeRows.length === 1 ? "" : "s", " across", " ", fieldChangeCount, " field change", fieldChangeCount === 1 ? "" : "s", " before publishing."] })] }), _jsx("div", { className: "max-h-[58vh] space-y-4 overflow-y-auto px-6 py-5", children: changeRows.map((row) => (_jsxs("div", { className: "rounded-xl border border-border/70 bg-secondary/15 p-4", children: [_jsxs("div", { className: "mb-3", children: [_jsx("p", { className: "text-sm font-medium text-foreground", children: row.rowLabel }), _jsx("p", { className: "text-xs text-muted-foreground", children: row.contextLabel })] }), _jsx("div", { className: "space-y-2", children: row.changes.map((change) => (_jsxs("div", { className: "grid gap-2 rounded-lg border border-border/60 bg-card px-3 py-2 sm:grid-cols-[140px,1fr,1fr]", children: [_jsx("p", { className: "text-xs font-medium uppercase tracking-wide text-muted-foreground", children: change.fieldLabel }), _jsxs("div", { children: [_jsx("p", { className: "text-[11px] uppercase tracking-wide text-muted-foreground", children: "Old" }), _jsx("p", { className: "text-sm text-foreground", children: change.previousValue })] }), _jsxs("div", { children: [_jsx("p", { className: "text-[11px] uppercase tracking-wide text-muted-foreground", children: "New" }), _jsx("p", { className: "text-sm font-medium text-foreground", children: change.nextValue })] })] }, `${row.id}-${change.fieldLabel}`))) })] }, row.id))) }), _jsxs("div", { className: "flex items-center justify-end gap-2 border-t px-6 py-4", children: [_jsx(Button, { variant: "outline", onClick: onCancel, children: "Cancel" }), _jsx(Button, { onClick: onConfirm, children: "Confirm Publish" })] })] }) }));
}
function RecommendedReviewModal({ open, changeRows, valueById, onValueChange, onCancel, onConfirm, onConfirmAndPublish, }) {
    if (!open) {
        return null;
    }
    const invalidRowIds = new Set(changeRows
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
        .map((row) => row.id));
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
    return (_jsx("div", { className: "fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/45 px-4 py-8", children: _jsxs("div", { className: "max-h-[85vh] w-full max-w-5xl overflow-hidden rounded-2xl border bg-card shadow-2xl", children: [_jsxs("div", { className: "border-b px-6 py-4", children: [_jsx("h2", { className: "font-heading text-xl font-semibold text-foreground", children: "Review Recommended Changes" }), _jsxs("p", { className: "mt-1 text-sm text-muted-foreground", children: ["Review ", changeRows.length, " recommended change", changeRows.length === 1 ? "" : "s", " and adjust any reviewed value before staging them in draft or publishing them live."] })] }), _jsx("div", { className: "max-h-[58vh] space-y-4 overflow-y-auto px-6 py-5", children: changeRows.map((row) => {
                        const isInvalid = invalidRowIds.has(row.id);
                        return (_jsxs("div", { className: "rounded-xl border border-border/70 bg-secondary/15 p-4", children: [_jsxs("div", { className: "mb-3", children: [_jsx("p", { className: "text-sm font-medium text-foreground", children: row.rowLabel }), _jsx("p", { className: "text-xs text-muted-foreground", children: row.contextLabel })] }), _jsxs("div", { className: "grid gap-2 rounded-lg border border-border/60 bg-card px-3 py-3 sm:grid-cols-3", children: [_jsxs("div", { children: [_jsx("p", { className: "text-[11px] uppercase tracking-wide text-muted-foreground", children: "Current" }), _jsx("p", { className: "mt-1 text-sm text-foreground", children: formatRecommendationReviewValue(row.currentValue, row.format) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-[11px] uppercase tracking-wide text-muted-foreground", children: "Suggested" }), _jsx("p", { className: "mt-1 text-sm font-medium text-foreground", children: formatRecommendationReviewValue(row.suggestedValue, row.format) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-[11px] uppercase tracking-wide text-muted-foreground", children: "Reviewed Value" }), _jsxs("div", { className: "mt-1 flex items-center gap-2", children: [_jsx(Input, { type: "number", inputMode: "decimal", min: "0", max: row.maximum !== undefined ? String(row.maximum) : undefined, step: row.inputStep, value: valueById[row.id] ?? "", onChange: (event) => onValueChange(row.id, event.target.value), className: cn("h-9 bg-background", isInvalid && "border-destructive"), "aria-label": `Reviewed value for ${row.rowLabel}` }), row.format === "percent" && (_jsx("span", { className: "text-sm text-muted-foreground", children: "%" }))] }), isInvalid && (_jsxs("p", { className: "mt-1 text-xs text-destructive", children: ["Enter a valid non-negative ", row.format === "percent" ? "percent" : "amount", "."] }))] })] })] }, row.id));
                    }) }), _jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3 border-t px-6 py-4", children: [_jsxs("p", { className: "text-sm text-muted-foreground", children: [reviewedChangeCount, " reviewed change", reviewedChangeCount === 1 ? "" : "s", " ready to stage or publish."] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Button, { variant: "outline", onClick: onCancel, children: "Cancel" }), _jsx(Button, { variant: "secondary", onClick: onConfirm, disabled: changeRows.length === 0 || invalidRowIds.size > 0, children: "Stage Reviewed Changes" }), _jsx(Button, { onClick: onConfirmAndPublish, disabled: changeRows.length === 0 || invalidRowIds.size > 0, children: "Publish Reviewed Changes" })] })] })] }) }));
}
const fallbackReportingPricingRows = [
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
const reportingYieldRows = [
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
const comparablePaceRows = [
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
const baseEventHealthTrend = [
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
function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}
function buildEventHealthTrend(event) {
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
const offerSeedRows = [
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
const discountRows = [
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
function cloneReportingPricingRows(rows) {
    return rows.map((row) => ({ ...row }));
}
function roundTo(value, decimals = 0) {
    const factor = 10 ** decimals;
    return Math.round(value * factor) / factor;
}
function arePriceValuesEqual(left, right) {
    if (left === null || right === null) {
        return left === right;
    }
    return Math.abs(left - right) < 0.005;
}
function healthRecommendationAdjustmentPct(healthScore) {
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
function healthAdjustedRecommendation(basePrice, healthScore) {
    const adjustment = healthRecommendationAdjustmentPct(healthScore);
    const nextPrice = basePrice * (1 + adjustment / 100);
    return roundTo(Math.max(1, nextPrice), 2);
}
function applyNumericBulkEdit(currentValue, rawValue, mode) {
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
function estimateTicketsSoldFromSeatGroup(soldPct, ticketsLeft) {
    if (soldPct <= 0) {
        return 0;
    }
    if (soldPct >= 100) {
        return ticketsLeft > 0 ? ticketsLeft * 4 : 0;
    }
    return Math.round((ticketsLeft * soldPct) / (100 - soldPct));
}
function buildReportingPricingRows(event) {
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
function buildTrendSeries(labels, actualFinal, expectedFinal, volatility) {
    const finalActual = Math.max(0, actualFinal);
    const finalExpected = Math.max(0, expectedFinal);
    const precision = Math.max(finalActual, finalExpected) < 10 ? 2 : Math.max(finalActual, finalExpected) < 100 ? 1 : 0;
    return labels.map((label, index) => {
        const progress = (index + 1) / labels.length;
        const curve = Math.pow(progress, 1.15);
        const wave = Math.sin(progress * Math.PI * 1.2) * volatility;
        const expected = index === labels.length - 1 ? finalExpected : finalExpected * curve;
        const actual = index === labels.length - 1 ? finalActual : Math.max(0, finalActual * curve * (1 + wave * 0.14));
        return {
            id: `trend-${label}`,
            label,
            actual: roundTo(actual, precision),
            expected: roundTo(expected, precision),
        };
    });
}
function buildEventPerformanceModel(event, pricingRows) {
    const mode = event.status === "On Sale" ? "active" : "future";
    const soldPctBase = event.soldPct ?? 0;
    const daysInMarket = event.daysInMarket ?? 0;
    const salesWindowDays = event.salesWindowDays ?? Math.max(daysInMarket + (event.daysRemaining ?? 0), 1);
    const salesWindowPassedPct = clamp(Math.round((daysInMarket / Math.max(1, salesWindowDays)) * 100), 0, 100);
    const ticketSummary = pricingRows.reduce((accumulator, row) => {
        if (row.soldPct === null || row.ticketsLeft === null) {
            return accumulator;
        }
        const soldTickets = estimateTicketsSoldFromSeatGroup(row.soldPct, row.ticketsLeft);
        return {
            sold: accumulator.sold + soldTickets,
            remaining: accumulator.remaining + row.ticketsLeft,
        };
    }, { sold: 0, remaining: 0 });
    const fallbackCapacity = 1200;
    const fallbackSold = Math.round((soldPctBase / 100) * fallbackCapacity);
    const ticketsSoldTotal = ticketSummary.sold > 0 ? ticketSummary.sold : fallbackSold;
    const ticketsRemainingTotal = ticketSummary.remaining > 0 ? ticketSummary.remaining : Math.max(0, fallbackCapacity - fallbackSold);
    const projectedNetRevenueCurrent = Math.round(event.projectedRevenue ?? pricingRows.reduce((sum, row) => sum + row.currentPrice * 65, 0)) || 0;
    const recommendedMultiplier = event.domeAtp && event.recAtp ? event.recAtp / event.domeAtp : 1.06;
    const projectedNetRevenueRecommended = Math.round(projectedNetRevenueCurrent * clamp(recommendedMultiplier * 1.03, 1.01, 1.26));
    const pricingOpportunity = projectedNetRevenueRecommended - projectedNetRevenueCurrent;
    const pricingOpportunityPct = projectedNetRevenueCurrent > 0
        ? roundTo((pricingOpportunity / projectedNetRevenueCurrent) * 100, 1)
        : 0;
    let expectedSellthroughNow = mode === "active"
        ? clamp(Math.round(salesWindowPassedPct * 0.93 + 7), 6, 96)
        : clamp(Math.round(68 + pricingOpportunityPct * 0.35), 10, 95);
    let actualSellthroughNow = mode === "active"
        ? soldPctBase
        : clamp(Math.round(expectedSellthroughNow + 5 + (event.recAtp ? 2 : 0)), 10, 98);
    let expectedRevenueNow = mode === "active"
        ? Math.round(projectedNetRevenueCurrent * clamp(expectedSellthroughNow / 100, 0.1, 0.98))
        : Math.round(projectedNetRevenueCurrent * 0.9);
    let currentNetRevenue = mode === "active"
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
    const revenueVsExpectedPct = expectedRevenueNow > 0 ? roundTo((expectedRevenueDelta / expectedRevenueNow) * 100, 1) : 0;
    const sellthroughVsExpectedPts = roundTo(actualSellthroughNow - expectedSellthroughNow, 1);
    const currentGrossRevenue = Math.round(currentNetRevenue / 0.855);
    const domeGrossRevenue = Math.round(currentGrossRevenue * 0.73);
    const hallGrossRevenue = currentGrossRevenue - domeGrossRevenue;
    const domeNetRevenue = Math.round(domeGrossRevenue * 0.87);
    const hallNetRevenue = Math.round(hallGrossRevenue * 0.82);
    const adSpend = mode === "active"
        ? Math.round(30000 + actualSellthroughNow * 920)
        : Math.round(22000 + projectedNetRevenueCurrent * 0.055);
    const roas = roundTo(currentNetRevenue / Math.max(1, adSpend), 2);
    const compRoas = roundTo(roas *
        (mode === "active"
            ? event.attention === "underperforming"
                ? 1.12
                : 0.95
            : 0.96), 2);
    const funnelEntries = mode === "active"
        ? Math.round(18000 + actualSellthroughNow * 340)
        : Math.round(23000 + projectedNetRevenueRecommended * 0.09);
    const funnelCompletion = roundTo(mode === "active"
        ? clamp(1.4 + actualSellthroughNow * 0.046, 0.4, 8.9)
        : clamp(1.9 + pricingOpportunityPct * 0.11, 0.5, 8.9), 2);
    const compFunnelEntries = Math.round(funnelEntries * (mode === "active" ? 0.94 : 0.9));
    const compFunnelCompletion = roundTo(funnelCompletion - (mode === "active" ? 0.34 : 0.22), 2);
    const averageYield = pricingRows.filter((row) => row.yield !== null).reduce((sum, row) => sum + (row.yield ?? 0), 0) /
        Math.max(1, pricingRows.filter((row) => row.yield !== null).length);
    const yieldScore = clamp((averageYield / 210) * 100, 0, 130);
    const revenueAttainment = clamp((currentNetRevenue / Math.max(1, expectedRevenueNow)) * 100, 0, 180);
    const sellthroughAttainment = clamp((actualSellthroughNow / Math.max(1, expectedSellthroughNow)) * 100, 0, 180);
    const marketingScore = clamp((roas / Math.max(0.01, compRoas)) * 100, 0, 160);
    const healthScore = Math.round(clamp(revenueAttainment * 0.34 + sellthroughAttainment * 0.28 + yieldScore * 0.2 + marketingScore * 0.18, 0, 100));
    const pricingOpportunityScore = Math.round(clamp(pricingOpportunityPct * 2.1 + (mode === "active" ? 10 : 20), 0, 100));
    const riskFlag = mode === "future"
        ? "Pre-Sale Planning"
        : healthScore < 55
            ? "Underperforming"
            : "On Track";
    const timelineLabels = baseEventHealthTrend.map((point) => point.label);
    const revenueTrend = buildTrendSeries(timelineLabels, currentNetRevenue, expectedRevenueNow, revenueVsExpectedPct / 100);
    const sellthroughTrend = buildTrendSeries(timelineLabels, actualSellthroughNow, expectedSellthroughNow, sellthroughVsExpectedPts / 100);
    const funnelEntriesTrend = buildTrendSeries(timelineLabels, funnelEntries, compFunnelEntries, (funnelEntries - compFunnelEntries) / Math.max(1, compFunnelEntries));
    const funnelCompletionTrend = buildTrendSeries(timelineLabels, funnelCompletion, compFunnelCompletion, (funnelCompletion - compFunnelCompletion) / Math.max(0.25, compFunnelCompletion));
    const roasTrend = buildTrendSeries(timelineLabels, roas, compRoas, (roas - compRoas) / Math.max(0.1, compRoas));
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
function formatCompactDateTime(value) {
    return new Intl.DateTimeFormat("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    }).format(value);
}
function formatDollarInteger(value) {
    return `$${value.toLocaleString("en-US")}`;
}
function formatCompactNumber(value) {
    if (Math.abs(value) >= 1000000) {
        return `${roundTo(value / 1000000, 1)}M`;
    }
    if (Math.abs(value) >= 1000) {
        return `${roundTo(value / 1000, 1)}K`;
    }
    return `${Math.round(value)}`;
}
function parsePercentLabel(label) {
    const match = label.match(/-?\d+(\.\d+)?/);
    if (!match) {
        return 0;
    }
    const parsed = Number.parseFloat(match[0]);
    return Number.isFinite(parsed) ? parsed : 0;
}
function averageOfferDiscountPct(rows) {
    if (rows.length === 0) {
        return 0;
    }
    const total = rows.reduce((sum, row) => sum + parsePercentLabel(row.amountLabel), 0);
    return roundTo(total / rows.length, 1);
}
function getNiceTickStep(value) {
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
    if (value <= 2000) {
        return 200;
    }
    if (value <= 10000) {
        return 1000;
    }
    if (value <= 50000) {
        return 5000;
    }
    if (value <= 250000) {
        return 25000;
    }
    return 50000;
}
function buildComparisonChartGeometry(series, fixedMax) {
    const width = 860;
    const height = 270;
    const left = 50;
    const right = 16;
    const top = 16;
    const bottom = 36;
    const drawableWidth = width - left - right;
    const drawableHeight = height - top - bottom;
    const yMaxFromData = Math.max(1, ...series.flatMap((point) => [point.actual, point.expected]));
    const yMax = fixedMax ??
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
        .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(1)} ${point.expectedY.toFixed(1)}`)
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
function EventRoutePlaceholder({ title, event, onBack, }) {
    return (_jsx("div", { className: "min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(9,119,180,0.12),_transparent_42%),linear-gradient(180deg,_hsl(210_33%_98%)_0%,_hsl(210_30%_95%)_100%)] px-4 py-8 pb-28 sm:px-6 lg:px-8", children: _jsxs("main", { className: "mx-auto max-w-4xl rounded-2xl border bg-card p-8 shadow-[0_24px_70px_-45px_rgba(15,23,42,0.65)]", children: [_jsx("p", { className: "text-sm font-medium uppercase tracking-[0.14em] text-muted-foreground", children: "Event Route" }), _jsx("h1", { className: "mt-2 font-heading text-3xl font-semibold", children: title }), _jsx("p", { className: "mt-2 text-muted-foreground", children: event
                        ? `Event: ${event.event} · Venue: ${event.venueName}`
                        : "Event not found. This route is wired and ready for the next screen build." }), _jsx("div", { className: "mt-6 rounded-lg border bg-secondary/40 p-4 text-sm text-muted-foreground", children: "Placeholder route implemented for v1 navigation. We can replace this with full seatmap and reporting screens next." }), _jsx(Button, { className: "mt-6", onClick: onBack, children: "Back to Price Adjustment" })] }) }));
}
function EventReportingDashboard({ event, onBack, onOpenSeatmap, }) {
    const initialPricingRows = useMemo(() => buildReportingPricingRows(event), [event]);
    const initialDiscountRate = useMemo(() => averageOfferDiscountPct(offerSeedRows), []);
    const [savedPricingRows, setSavedPricingRows] = useState(initialPricingRows);
    const [pricingRows, setPricingRows] = useState(initialPricingRows);
    const [offerRows, setOfferRows] = useState(() => offerSeedRows.map((offer) => ({ ...offer })));
    const [savedDiscountRate, setSavedDiscountRate] = useState(initialDiscountRate);
    const [discountRate, setDiscountRate] = useState(initialDiscountRate);
    const [savedMarketingSpend, setSavedMarketingSpend] = useState(0);
    const [marketingSpend, setMarketingSpend] = useState(0);
    const [showPublishOverlay, setShowPublishOverlay] = useState(false);
    const [showRecommendedReviewModal, setShowRecommendedReviewModal] = useState(false);
    const [recommendedReviewValuesById, setRecommendedReviewValuesById] = useState({});
    const [pricingRecommendationUndoById, setPricingRecommendationUndoById] = useState({});
    const [activeTab, setActiveTab] = useState("performance");
    const [activePerformanceMetric, setActivePerformanceMetric] = useState("revenue");
    const [editingPricingRowId, setEditingPricingRowId] = useState(null);
    const [editingPricingValue, setEditingPricingValue] = useState("");
    const [hoveredPerformanceMetricPointId, setHoveredPerformanceMetricPointId] = useState(null);
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
    const savedPricingById = useMemo(() => new Map(savedPricingRows.map((row) => [row.id, row.currentPrice])), [savedPricingRows]);
    const pricingDraftCount = useMemo(() => pricingRows.reduce((count, row) => count + (savedPricingById.get(row.id) !== row.currentPrice ? 1 : 0), 0), [pricingRows, savedPricingById]);
    const hasDiscountDraft = !arePriceValuesEqual(discountRate, savedDiscountRate);
    const hasMarketingDraft = !arePriceValuesEqual(marketingSpend, savedMarketingSpend);
    const stagedActionCount = pricingDraftCount + (hasDiscountDraft ? 1 : 0) + (hasMarketingDraft ? 1 : 0);
    const unsavedChanges = useMemo(() => {
        return stagedActionCount > 0;
    }, [stagedActionCount]);
    const eventPerformance = useMemo(() => (event ? buildEventPerformanceModel(event, pricingRows) : null), [event, pricingRows]);
    const yieldTotals = useMemo(() => {
        const totals = reportingYieldRows.reduce((accumulator, row) => {
            return {
                ticketsSold: accumulator.ticketsSold + row.ticketsSold,
                sellThroughPct: accumulator.sellThroughPct + row.sellThroughPct,
                yield: accumulator.yield + row.yield,
                grossYield: accumulator.grossYield + row.grossYield,
            };
        }, {
            ticketsSold: 0,
            sellThroughPct: 0,
            yield: 0,
            grossYield: 0,
        });
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
    const salesWindowPassedPct = event?.daysInMarket !== null &&
        event?.daysInMarket !== undefined &&
        event?.salesWindowDays !== null &&
        event?.salesWindowDays !== undefined
        ? clamp(Math.round((event.daysInMarket / Math.max(1, event.salesWindowDays)) * 100), 0, 100)
        : event?.daysRemaining === null || event?.daysRemaining === undefined
            ? 0
            : clamp(Math.round(((28 - event.daysRemaining) / 28) * 100), 0, 100);
    const salesWindowPassedLabel = event?.status === "Unpublished" ? "--" : `${salesWindowPassedPct}%`;
    const eventHealthTrend = useMemo(() => buildEventHealthTrend(event), [event?.id, event?.soldPct, event?.attention]);
    const latestHealthScore = eventPerformance?.healthScore ?? eventHealthTrend[eventHealthTrend.length - 1]?.health ?? 0;
    const recommendationAdjustmentPct = healthRecommendationAdjustmentPct(latestHealthScore);
    const recommendationDirectionLabel = recommendationAdjustmentPct >= 0 ? "Lift pricing bias" : "Demand stimulation bias";
    const recommendedDiscountRate = clamp(roundTo(discountRate +
        (latestHealthScore < 55 ? 5 : latestHealthScore >= 75 ? -4 : 2), 1), 0, 80);
    const recommendedMarketingSpend = Math.max(0, Math.round(marketingSpend *
        (latestHealthScore < 55 ? 1.12 : latestHealthScore >= 75 ? 0.94 : 1.03)));
    const currentPricingProjection = eventPerformance?.projectedNetRevenueCurrent ?? 0;
    const recommendedPricingProjection = eventPerformance?.projectedNetRevenueRecommended ?? 0;
    const currentNetProjectionAfterActions = Math.round(currentPricingProjection * (1 - discountRate / 100) - marketingSpend);
    const projectedNetAfterActions = Math.round(recommendedPricingProjection * (1 - recommendedDiscountRate / 100) - recommendedMarketingSpend);
    const netProjectionDelta = projectedNetAfterActions - currentNetProjectionAfterActions;
    const currentSeatGroupPrice = useMemo(() => pricingRows.length === 0
        ? 0
        : roundTo(pricingRows.reduce((sum, row) => sum + row.currentPrice, 0) / pricingRows.length, 2), [pricingRows]);
    const recommendedSeatGroupPrice = useMemo(() => pricingRows.length === 0
        ? 0
        : roundTo(pricingRows.reduce((sum, row) => sum + healthAdjustedRecommendation(row.recPrice, latestHealthScore), 0) / pricingRows.length, 2), [latestHealthScore, pricingRows]);
    const recommendedReviewChangeRows = useMemo(() => {
        const nextRows = pricingRows.flatMap((row) => {
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
                    format: "currency",
                    inputStep: "0.01",
                    inputDecimals: 2,
                    target: { type: "seat-group-price", rowId: row.id },
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
    const actionProjectionSeries = useMemo(() => {
        const labels = baseEventHealthTrend.map((point) => point.label);
        const currentProjectionBase = Math.max(currentPricingProjection, eventPerformance?.currentNetRevenue ?? 0, 25000);
        const expectedProjectionBase = Math.max(recommendedPricingProjection, currentProjectionBase * 1.08, 28000);
        return buildTrendSeries(labels, currentProjectionBase, expectedProjectionBase, 0.08);
    }, [currentPricingProjection, eventPerformance?.currentNetRevenue, recommendedPricingProjection]);
    const actionProjectionChart = useMemo(() => buildComparisonChartGeometry(actionProjectionSeries), [actionProjectionSeries]);
    const emptyMetricTrend = useMemo(() => baseEventHealthTrend.map((point) => ({
        id: `fallback-${point.id}`,
        label: point.label,
        actual: 0,
        expected: 0,
    })), []);
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
                    formatAxis: (value) => formatCompactNumber(value),
                    formatTooltip: (value) => formatCompactNumber(value),
                    formatVariance: (actual, expected) => `${actual - expected >= 0 ? "+" : ""}${formatCompactNumber(actual - expected)}`,
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
                    formatAxis: (value) => `${roundTo(value, 1)}%`,
                    formatTooltip: (value) => `${roundTo(value, 2)}%`,
                    formatVariance: (actual, expected) => `${actual - expected >= 0 ? "+" : ""}${roundTo(actual - expected, 2)} pts`,
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
                    formatAxis: (value) => `${roundTo(value, 1)}%`,
                    formatTooltip: (value) => `${roundTo(value, 1)}%`,
                    formatVariance: (actual, expected) => `${actual - expected >= 0 ? "+" : ""}${roundTo(actual - expected, 1)} pts`,
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
                    formatAxis: (value) => `${roundTo(value, 1)}x`,
                    formatTooltip: (value) => `${roundTo(value, 2)}x`,
                    formatVariance: (actual, expected) => `${actual - expected >= 0 ? "+" : ""}${roundTo(actual - expected, 2)}x`,
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
                    formatAxis: (value) => `$${formatCompactNumber(value)}`,
                    formatTooltip: (value) => formatCurrency(value),
                    formatVariance: (actual, expected) => `${actual - expected >= 0 ? "+" : ""}${formatCurrency(actual - expected)}`,
                };
        }
    }, [activePerformanceMetric, emptyMetricTrend, eventPerformance]);
    const activePerformanceTrendChart = useMemo(() => buildComparisonChartGeometry(activePerformanceMetricConfig.series, activePerformanceMetricConfig.fixedMax), [activePerformanceMetricConfig]);
    const hoveredPerformanceMetricPoint = activePerformanceTrendChart.points.find((point) => point.id === hoveredPerformanceMetricPointId) ?? null;
    const riskBadgeVariant = eventPerformance?.riskFlag === "On Track"
        ? "secondary"
        : eventPerformance?.riskFlag === "Pre-Sale Planning"
            ? "outline"
            : "warning";
    const beginPricingRowEdit = (row) => {
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
    const onCurrentPriceChange = (rowId, nextValue) => {
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
        setPricingRows((current) => current.map((row) => row.id === rowId
            ? {
                ...row,
                currentPrice: normalizedValue,
            }
            : row));
    };
    const applyPricingRecommendation = (rowId, currentPrice, recommendedPrice) => {
        if (arePriceValuesEqual(currentPrice, recommendedPrice)) {
            return;
        }
        setEditingPricingRowId(null);
        setEditingPricingValue("");
        setPricingRecommendationUndoById((current) => ({
            ...current,
            [rowId]: currentPrice,
        }));
        setPricingRows((current) => current.map((row) => row.id === rowId
            ? {
                ...row,
                currentPrice: recommendedPrice,
            }
            : row));
    };
    const undoPricingRecommendation = (rowId) => {
        const previousPrice = pricingRecommendationUndoById[rowId];
        if (previousPrice === undefined) {
            return;
        }
        setPricingRows((current) => current.map((row) => row.id === rowId
            ? {
                ...row,
                currentPrice: previousPrice,
            }
            : row));
        setPricingRecommendationUndoById((current) => {
            const { [rowId]: _removed, ...rest } = current;
            return rest;
        });
    };
    const openRecommendedReviewModal = () => {
        setRecommendedReviewValuesById(Object.fromEntries(recommendedReviewChangeRows.map((row) => [
            row.id,
            formatRecommendationReviewInputValue(row.suggestedValue, row.inputDecimals),
        ])));
        setEditingPricingRowId(null);
        setEditingPricingValue("");
        setShowRecommendedReviewModal(true);
    };
    const onRecommendedReviewValueChange = (rowId, nextValue) => {
        setRecommendedReviewValuesById((current) => ({
            ...current,
            [rowId]: nextValue,
        }));
    };
    const getReviewedRecommendedValues = () => {
        const seatGroupPriceById = new Map();
        let nextDiscountRateValue = null;
        let nextMarketingSpendValue = null;
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
        setPricingRows((current) => current.map((row) => seatGroupPriceById.has(row.id)
            ? {
                ...row,
                currentPrice: seatGroupPriceById.get(row.id) ?? row.currentPrice,
            }
            : row));
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
        const nextPricingRows = pricingRows.map((row) => seatGroupPriceById.has(row.id)
            ? {
                ...row,
                currentPrice: seatGroupPriceById.get(row.id) ?? row.currentPrice,
            }
            : row);
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
    const toggleOfferPublished = (offerId) => {
        setOfferRows((current) => current.map((offer) => offer.id === offerId ? { ...offer, published: !offer.published } : offer));
    };
    if (!event) {
        return (_jsx(EventRoutePlaceholder, { title: "Reporting", event: event, onBack: onBack }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(9,119,180,0.12),_transparent_42%),linear-gradient(180deg,_hsl(210_33%_98%)_0%,_hsl(210_30%_95%)_100%)] px-4 py-6 pb-28 sm:px-6 lg:px-8", children: [_jsxs("main", { className: "mx-auto max-w-[1450px] rounded-2xl border bg-card p-4 shadow-[0_24px_70px_-45px_rgba(15,23,42,0.65)] sm:p-6 lg:p-8", children: [_jsx(PublishedOverlay, { visible: showPublishOverlay }), _jsx(RecommendedReviewModal, { open: showRecommendedReviewModal, changeRows: recommendedReviewChangeRows, valueById: recommendedReviewValuesById, onValueChange: onRecommendedReviewValueChange, onCancel: () => setShowRecommendedReviewModal(false), onConfirm: stageReviewedRecommendedChanges, onConfirmAndPublish: publishReviewedRecommendedChanges }), _jsxs("header", { className: "border-b pb-4", children: [_jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [_jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [_jsxs("button", { type: "button", onClick: onBack, className: "flex items-center gap-2 font-heading text-4xl font-semibold tracking-tight text-foreground", children: [_jsx(ArrowLeft, { className: "h-7 w-7" }), _jsx("span", { className: "text-3xl", children: event.event })] }), _jsx(Badge, { variant: eventPerformance?.mode === "active" ? "success" : "outline", children: eventPerformance?.mode === "active" ? "Active Event" : "Future Event" })] }), _jsx(Button, { variant: "secondary", className: "px-8 text-base", children: "Reporting" })] }), _jsxs("div", { className: "mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-foreground/90", children: [_jsx("span", { className: "rounded bg-secondary px-2 py-0.5 font-medium", children: event.venueName }), _jsx("span", { className: "rounded bg-accent px-2 py-0.5 font-medium text-accent-foreground", children: event.eventCategory }), _jsxs("span", { children: [_jsx("span", { className: "font-semibold", children: "Weekday:" }), " ", event.weekdayLabel] }), _jsxs("span", { children: [_jsx("span", { className: "font-semibold", children: "Start Time:" }), " ", startTimeLabel] }), _jsxs("span", { children: [_jsx("span", { className: "font-semibold", children: "Local Time:" }), " ", event.localStartTimeLabel] }), _jsxs("span", { children: [_jsx("span", { className: "font-semibold", children: "On-Sale Date:" }), " ", event.onSaleDateLabel] }), _jsxs("span", { children: [_jsx("span", { className: "font-semibold", children: "Days In-Market:" }), " ", daysInMarketLabel] }), _jsxs("span", { children: [_jsx("span", { className: "font-semibold", children: "Sales Window:" }), " ", salesWindowLabel] }), _jsxs("span", { children: [_jsx("span", { className: "font-semibold", children: "TOS Time:" }), " ", tosTimeLabel] }), _jsxs("span", { children: [_jsx("span", { className: "font-semibold", children: "Days Remaining:" }), " ", daysRemainingLabel] }), _jsxs("span", { children: [_jsx("span", { className: "font-semibold", children: "Sales Window Passed:" }), " ", salesWindowPassedLabel] })] })] }), _jsxs("div", { className: "mt-6", children: [_jsx("h2", { className: "mb-3 font-heading text-2xl font-semibold", children: "Summary" }), _jsxs("section", { className: "mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4", children: [_jsxs("div", { className: "rounded-lg border bg-secondary/20 p-3", children: [_jsx("p", { className: "text-[11px] uppercase tracking-[0.08em] text-muted-foreground", children: "Health Score" }), _jsx("p", { className: "mt-1 text-2xl font-semibold", children: eventPerformance?.healthScore ?? "--" })] }), _jsxs("div", { className: "rounded-lg border bg-secondary/20 p-3", children: [_jsx("p", { className: "text-[11px] uppercase tracking-[0.08em] text-muted-foreground", children: "Risk Flag" }), _jsx("div", { className: "mt-1", children: _jsx(Badge, { variant: riskBadgeVariant, children: eventPerformance?.riskFlag ?? "--" }) })] }), _jsxs("div", { className: "rounded-lg border bg-secondary/20 p-3", children: [_jsx("p", { className: "text-[11px] uppercase tracking-[0.08em] text-muted-foreground", children: eventPerformance?.mode === "active"
                                                    ? "Net Revenue (Right Now)"
                                                    : "Projected Net Revenue (Current)" }), _jsx("p", { className: "mt-1 text-2xl font-semibold", children: formatCurrency(eventPerformance?.currentNetRevenue ?? 0) })] }), _jsxs("div", { className: "rounded-lg border bg-secondary/20 p-3", children: [_jsx("p", { className: "text-[11px] uppercase tracking-[0.08em] text-muted-foreground", children: eventPerformance?.mode === "active"
                                                    ? "Expected Revenue (Right Now)"
                                                    : "Projected Net Revenue (Recommended)" }), _jsx("p", { className: "mt-1 text-2xl font-semibold", children: formatCurrency(eventPerformance?.mode === "active"
                                                    ? eventPerformance?.expectedRevenueNow ?? 0
                                                    : eventPerformance?.projectedNetRevenueRecommended ?? 0) })] }), _jsxs("div", { className: "rounded-lg border bg-secondary/20 p-3", children: [_jsx("p", { className: "text-[11px] uppercase tracking-[0.08em] text-muted-foreground", children: eventPerformance?.mode === "active"
                                                    ? "Sellthrough (Actual / Expected)"
                                                    : "Projected Sellthrough (Rec / Baseline)" }), _jsxs("p", { className: "mt-1 text-2xl font-semibold", children: [eventPerformance?.actualSellthroughNow ?? 0, "% / ", eventPerformance?.expectedSellthroughNow ?? 0, "%"] })] }), _jsxs("div", { className: "rounded-lg border bg-secondary/20 p-3", children: [_jsx("p", { className: "text-[11px] uppercase tracking-[0.08em] text-muted-foreground", children: "Revenue Vs Expected" }), _jsxs("p", { className: cn("mt-1 text-2xl font-semibold", (eventPerformance?.revenueVsExpectedPct ?? 0) >= 0 ? "text-success" : "text-destructive"), children: [(eventPerformance?.revenueVsExpectedPct ?? 0) >= 0 ? "+" : "", eventPerformance?.revenueVsExpectedPct ?? 0, "%"] })] }), _jsxs("div", { className: "rounded-lg border bg-secondary/20 p-3", children: [_jsx("p", { className: "text-[11px] uppercase tracking-[0.08em] text-muted-foreground", children: "Sellthrough Vs Expected" }), _jsxs("p", { className: cn("mt-1 text-2xl font-semibold", (eventPerformance?.sellthroughVsExpectedPts ?? 0) >= 0 ? "text-success" : "text-destructive"), children: [(eventPerformance?.sellthroughVsExpectedPts ?? 0) >= 0 ? "+" : "", eventPerformance?.sellthroughVsExpectedPts ?? 0, " pts"] })] }), _jsxs("div", { className: "rounded-lg border bg-secondary/20 p-3", children: [_jsx("p", { className: "text-[11px] uppercase tracking-[0.08em] text-muted-foreground", children: "Pricing Opportunity" }), _jsx("p", { className: "mt-1 text-2xl font-semibold", children: formatCurrency(eventPerformance?.pricingOpportunity ?? 0) }), _jsxs("p", { className: "text-xs text-muted-foreground", children: ["Score: ", eventPerformance?.pricingOpportunityScore ?? 0] })] }), _jsxs("div", { className: "rounded-lg border bg-secondary/20 p-3", children: [_jsx("p", { className: "text-[11px] uppercase tracking-[0.08em] text-muted-foreground", children: "Left-To-Go Tickets" }), _jsx("p", { className: "mt-1 text-2xl font-semibold", children: formatCompactNumber(eventPerformance?.ticketsRemainingTotal ?? 0) }), _jsxs("p", { className: "text-xs text-muted-foreground", children: ["Sold: ", formatCompactNumber(eventPerformance?.ticketsSoldTotal ?? 0)] })] })] }), _jsxs("section", { className: "mb-6 rounded-xl border bg-background p-4 sm:p-5", children: [_jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [_jsxs("div", { children: [_jsx("h2", { className: "font-heading text-2xl font-semibold", children: "Recommended Actions" }), _jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Current versus recommended seat-group pricing and offer rate, with projected revenue impact." })] }), _jsx("p", { className: "text-sm font-medium text-muted-foreground", children: "Use the footer to review and stage these recommendations." })] }), _jsxs("div", { className: "mt-4 grid gap-4 lg:grid-cols-[1.1fr_1fr]", children: [_jsx("div", { className: "overflow-x-auto rounded-lg border", children: _jsxs(Table, { className: "min-w-[560px]", children: [_jsx(TableHeader, { className: "bg-secondary/35", children: _jsxs(TableRow, { className: "hover:bg-secondary/35", children: [_jsx(TableHead, { children: "Action" }), _jsx(TableHead, { className: "text-right", children: "Current" }), _jsx(TableHead, { className: "text-right", children: "Recommended" }), _jsx(TableHead, { className: "text-right", children: "Delta" })] }) }), _jsxs(TableBody, { children: [_jsxs(TableRow, { children: [_jsx(TableCell, { children: "Seat Group Price" }), _jsx(TableCell, { className: "text-right font-medium", children: formatCurrency(currentSeatGroupPrice) }), _jsx(TableCell, { className: "text-right font-medium", children: formatCurrency(recommendedSeatGroupPrice) }), _jsxs(TableCell, { className: cn("text-right font-semibold", recommendedSeatGroupPrice - currentSeatGroupPrice >= 0
                                                                                ? "text-success"
                                                                                : "text-warning"), children: [(recommendedSeatGroupPrice - currentSeatGroupPrice) >= 0 ? "+" : "", formatCurrency(recommendedSeatGroupPrice - currentSeatGroupPrice)] })] }), _jsxs(TableRow, { children: [_jsx(TableCell, { children: "Offer Rate" }), _jsxs(TableCell, { className: "text-right font-medium", children: [discountRate, "%"] }), _jsxs(TableCell, { className: "text-right font-medium", children: [recommendedDiscountRate, "%"] }), _jsxs(TableCell, { className: cn("text-right font-semibold", recommendedDiscountRate - discountRate <= 0 ? "text-success" : "text-warning"), children: [recommendedDiscountRate - discountRate >= 0 ? "+" : "", roundTo(recommendedDiscountRate - discountRate, 1), " pts"] })] }), _jsxs(TableRow, { children: [_jsx(TableCell, { children: "Marketing Spend" }), _jsx(TableCell, { className: "text-right font-medium", children: formatCurrency(marketingSpend) }), _jsx(TableCell, { className: "text-right font-medium", children: formatCurrency(recommendedMarketingSpend) }), _jsxs(TableCell, { className: cn("text-right font-semibold", recommendedMarketingSpend - marketingSpend <= 0
                                                                                ? "text-success"
                                                                                : "text-warning"), children: [(recommendedMarketingSpend - marketingSpend) >= 0 ? "+" : "", formatCurrency(recommendedMarketingSpend - marketingSpend)] })] })] })] }) }), _jsxs("div", { className: "rounded-lg border p-3", children: [_jsx("p", { className: "text-xs uppercase tracking-[0.1em] text-muted-foreground", children: "Revenue Projection" }), _jsx("div", { className: "mt-3 overflow-x-auto", children: _jsxs("svg", { viewBox: `0 0 ${actionProjectionChart.width} ${actionProjectionChart.height}`, className: "h-[220px] w-full", role: "img", "aria-label": "Current versus expected revenue projections", children: [actionProjectionChart.yTicks.map((tick) => {
                                                                    const y = actionProjectionChart.top +
                                                                        ((actionProjectionChart.yMax - tick) / actionProjectionChart.yMax) *
                                                                            (actionProjectionChart.height -
                                                                                actionProjectionChart.top -
                                                                                actionProjectionChart.bottom);
                                                                    return (_jsxs("g", { children: [_jsx("line", { x1: actionProjectionChart.left, y1: y, x2: actionProjectionChart.width - actionProjectionChart.right, y2: y, stroke: "hsl(var(--border))", strokeWidth: 1 }), _jsx("text", { x: 36, y: y + 4, textAnchor: "end", fontSize: 11, fill: "hsl(var(--muted-foreground))", children: `$${formatCompactNumber(tick)}` })] }, `action-tick-${tick}`));
                                                                }), _jsx("path", { d: actionProjectionChart.actualPath, fill: "none", stroke: "hsl(var(--primary))", strokeWidth: 3 }), _jsx("path", { d: actionProjectionChart.expectedPath, fill: "none", stroke: "hsl(var(--success))", strokeWidth: 3 }), actionProjectionChart.points.map((point) => (_jsxs("g", { children: [_jsx("circle", { cx: point.x, cy: point.actualY, r: 3.3, fill: "hsl(var(--primary))" }), _jsx("circle", { cx: point.x, cy: point.expectedY, r: 3.3, fill: "hsl(var(--success))" }), _jsx("text", { x: point.x, y: actionProjectionChart.baseY + 16, textAnchor: "middle", fontSize: 11, fill: "hsl(var(--muted-foreground))", children: point.label })] }, `action-point-${point.id}`)))] }) }), _jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground", children: [_jsxs("span", { className: "inline-flex items-center gap-2", children: [_jsx("span", { className: "h-2.5 w-2.5 rounded-full bg-primary" }), "Current Revenue"] }), _jsxs("span", { className: "inline-flex items-center gap-2", children: [_jsx("span", { className: "h-2.5 w-2.5 rounded-full bg-success" }), "Expected Revenue"] })] }), _jsxs("div", { className: "mt-3 rounded border bg-secondary/20 px-3 py-2 text-sm", children: [_jsx("span", { className: "text-muted-foreground", children: "Projected net impact:" }), " ", _jsxs("span", { className: cn("font-semibold", netProjectionDelta >= 0 ? "text-success" : "text-destructive"), children: [netProjectionDelta >= 0 ? "+" : "", formatCurrency(netProjectionDelta)] })] })] })] })] }), _jsxs("div", { className: "mb-6 inline-flex rounded-lg border bg-secondary/40 p-1", children: [_jsx(Button, { variant: activeTab === "performance" ? "default" : "ghost", size: "sm", className: "h-9 px-5", onClick: () => setActiveTab("performance"), children: "Performance" }), _jsx(Button, { variant: activeTab === "pricing-details" ? "default" : "ghost", size: "sm", className: "h-9 px-5", onClick: () => setActiveTab("pricing-details"), children: "Pricing Details" })] }), activeTab === "performance" ? (_jsxs("section", { className: "space-y-6", children: [_jsxs("div", { className: "rounded-xl border bg-background p-4 sm:p-5", children: [_jsxs("div", { className: "flex flex-wrap items-start justify-between gap-4", children: [_jsxs("div", { children: [_jsx("h2", { className: "font-heading text-2xl font-semibold", children: activePerformanceMetricConfig.title }), _jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: activePerformanceMetricConfig.description })] }), _jsxs("div", { className: "grid min-w-[260px] gap-2 sm:grid-cols-3", children: [_jsxs("div", { className: "rounded-lg border bg-secondary/25 px-3 py-2", children: [_jsx("p", { className: "text-[11px] uppercase tracking-[0.08em] text-muted-foreground", children: activePerformanceMetricConfig.actualLabel }), _jsx("p", { className: "mt-1 text-lg font-semibold", children: activePerformanceMetricConfig.formatTooltip(activePerformanceMetricConfig.series[activePerformanceMetricConfig.series.length - 1]?.actual ?? 0) })] }), _jsxs("div", { className: "rounded-lg border bg-secondary/25 px-3 py-2", children: [_jsx("p", { className: "text-[11px] uppercase tracking-[0.08em] text-muted-foreground", children: activePerformanceMetricConfig.expectedLabel }), _jsx("p", { className: "mt-1 text-lg font-semibold", children: activePerformanceMetricConfig.formatTooltip(activePerformanceMetricConfig.series[activePerformanceMetricConfig.series.length - 1]?.expected ?? 0) })] }), _jsxs("div", { className: "rounded-lg border bg-secondary/25 px-3 py-2", children: [_jsx("p", { className: "text-[11px] uppercase tracking-[0.08em] text-muted-foreground", children: "Variance" }), _jsx("p", { className: cn("mt-1 text-lg font-semibold", (activePerformanceMetricConfig.series[activePerformanceMetricConfig.series.length - 1]?.actual ?? 0) -
                                                                            (activePerformanceMetricConfig.series[activePerformanceMetricConfig.series.length - 1]?.expected ?? 0) >=
                                                                            0
                                                                            ? "text-success"
                                                                            : "text-destructive"), children: activePerformanceMetricConfig.formatVariance(activePerformanceMetricConfig.series[activePerformanceMetricConfig.series.length - 1]?.actual ?? 0, activePerformanceMetricConfig.series[activePerformanceMetricConfig.series.length - 1]?.expected ?? 0) })] })] })] }), _jsx("div", { className: "mt-4 inline-flex flex-wrap rounded-lg border bg-secondary/35 p-1", children: [
                                                    { value: "revenue", label: "Revenue" },
                                                    { value: "funnel-entries", label: "Funnel Entries" },
                                                    { value: "funnel-completion", label: "Funnel Completion" },
                                                    { value: "sold", label: "% Sold" },
                                                    { value: "roas", label: "ROAS" },
                                                ].map((metric) => (_jsx(Button, { variant: activePerformanceMetric === metric.value ? "default" : "ghost", size: "sm", className: "h-9 px-4", onClick: () => {
                                                        setActivePerformanceMetric(metric.value);
                                                        setHoveredPerformanceMetricPointId(null);
                                                    }, children: metric.label }, metric.value))) }), _jsx("div", { className: "mt-4 overflow-x-auto", children: _jsxs("svg", { viewBox: `0 0 ${activePerformanceTrendChart.width} ${activePerformanceTrendChart.height}`, className: "h-[290px] w-full", role: "img", "aria-label": `${activePerformanceMetricConfig.title} over time chart`, onMouseLeave: () => setHoveredPerformanceMetricPointId(null), children: [_jsx("defs", { children: _jsxs("linearGradient", { id: "performance-metric-fill", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "0%", stopColor: activePerformanceMetricConfig.areaColor, stopOpacity: "0.26" }), _jsx("stop", { offset: "100%", stopColor: activePerformanceMetricConfig.areaColor, stopOpacity: "0.02" })] }) }), activePerformanceTrendChart.yTicks.map((tick) => {
                                                            const y = activePerformanceTrendChart.top +
                                                                ((activePerformanceTrendChart.yMax - tick) / activePerformanceTrendChart.yMax) *
                                                                    (activePerformanceTrendChart.height -
                                                                        activePerformanceTrendChart.top -
                                                                        activePerformanceTrendChart.bottom);
                                                            return (_jsxs("g", { children: [_jsx("line", { x1: activePerformanceTrendChart.left, y1: y, x2: activePerformanceTrendChart.width - activePerformanceTrendChart.right, y2: y, stroke: "hsl(var(--border))", strokeWidth: 1 }), _jsx("text", { x: 36, y: y + 4, textAnchor: "end", fontSize: 11, fill: "hsl(var(--muted-foreground))", children: activePerformanceMetricConfig.formatAxis(tick) })] }, `perf-tick-${tick}`));
                                                        }), _jsx("path", { d: activePerformanceTrendChart.areaPath, fill: "url(#performance-metric-fill)" }), _jsx("path", { d: activePerformanceTrendChart.expectedPath, fill: "none", stroke: "hsl(var(--warning))", strokeDasharray: "6 4", strokeWidth: 2 }), _jsx("path", { d: activePerformanceTrendChart.actualPath, fill: "none", stroke: activePerformanceMetricConfig.actualStroke, strokeWidth: 3 }), activePerformanceTrendChart.points.map((point) => {
                                                            const isHovered = hoveredPerformanceMetricPointId === point.id;
                                                            return (_jsxs("g", { children: [_jsx("circle", { cx: point.x, cy: point.actualY, r: isHovered ? 5.2 : 3.8, fill: activePerformanceMetricConfig.actualStroke, stroke: isHovered ? "hsl(var(--card))" : "none", strokeWidth: isHovered ? 2 : 0, onMouseEnter: () => setHoveredPerformanceMetricPointId(point.id), onFocus: () => setHoveredPerformanceMetricPointId(point.id), onBlur: () => setHoveredPerformanceMetricPointId(null), tabIndex: 0 }), _jsx("text", { x: point.x, y: activePerformanceTrendChart.baseY + 16, textAnchor: "middle", fontSize: 11, fill: "hsl(var(--muted-foreground))", children: point.label })] }, `perf-point-${point.id}`));
                                                        }), hoveredPerformanceMetricPoint && (_jsx(SvgPointTooltip, { x: hoveredPerformanceMetricPoint.x, y: hoveredPerformanceMetricPoint.actualY, width: activePerformanceTrendChart.width, height: activePerformanceTrendChart.height, left: activePerformanceTrendChart.left, right: activePerformanceTrendChart.right, top: activePerformanceTrendChart.top, bottom: activePerformanceTrendChart.bottom, title: `Period: ${hoveredPerformanceMetricPoint.label}`, lines: [
                                                                `${activePerformanceMetricConfig.actualLabel}: ${activePerformanceMetricConfig.formatTooltip(hoveredPerformanceMetricPoint.actual)}`,
                                                                `${activePerformanceMetricConfig.expectedLabel}: ${activePerformanceMetricConfig.formatTooltip(hoveredPerformanceMetricPoint.expected)}`,
                                                                `Variance: ${activePerformanceMetricConfig.formatVariance(hoveredPerformanceMetricPoint.actual, hoveredPerformanceMetricPoint.expected)}`,
                                                            ] }))] }) }), _jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground", children: [_jsxs("span", { className: "inline-flex items-center gap-2", children: [_jsx("span", { className: "h-2.5 w-2.5 rounded-full", style: { backgroundColor: activePerformanceMetricConfig.actualStroke } }), activePerformanceMetricConfig.actualLabel] }), _jsxs("span", { className: "inline-flex items-center gap-2", children: [_jsx("span", { className: "h-0 w-6 border-t-2 border-dashed border-warning" }), activePerformanceMetricConfig.expectedLabel] })] })] }), _jsxs("div", { className: "grid gap-6 xl:grid-cols-[1fr_1fr]", children: [_jsxs("div", { className: "rounded-xl border bg-background p-4 sm:p-5", children: [_jsx("h3", { className: "font-heading text-xl font-semibold", children: "Dome vs Hall Summary" }), _jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Gross and net breakout across venue areas." }), _jsxs("div", { className: "mt-4 space-y-3", children: [_jsxs("div", { className: "space-y-1", children: [_jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsx("span", { className: "font-medium text-foreground", children: "Dome Net" }), _jsx("span", { children: formatCurrency(eventPerformance?.domeNetRevenue ?? 0) })] }), _jsx("div", { className: "h-2 rounded-full bg-muted", children: _jsx("div", { className: "h-2 rounded-full bg-primary", style: {
                                                                                width: `${clamp(((eventPerformance?.domeNetRevenue ?? 0) /
                                                                                    Math.max(1, (eventPerformance?.domeNetRevenue ?? 0) +
                                                                                        (eventPerformance?.hallNetRevenue ?? 0))) *
                                                                                    100, 0, 100)}%`,
                                                                            } }) })] }), _jsxs("div", { className: "space-y-1", children: [_jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsx("span", { className: "font-medium text-foreground", children: "Hall Net" }), _jsx("span", { children: formatCurrency(eventPerformance?.hallNetRevenue ?? 0) })] }), _jsx("div", { className: "h-2 rounded-full bg-muted", children: _jsx("div", { className: "h-2 rounded-full bg-success", style: {
                                                                                width: `${clamp(((eventPerformance?.hallNetRevenue ?? 0) /
                                                                                    Math.max(1, (eventPerformance?.domeNetRevenue ?? 0) +
                                                                                        (eventPerformance?.hallNetRevenue ?? 0))) *
                                                                                    100, 0, 100)}%`,
                                                                            } }) })] })] }), _jsxs("div", { className: "mt-4 grid gap-2 sm:grid-cols-2", children: [_jsxs("div", { className: "rounded border bg-secondary/20 p-2", children: [_jsx("p", { className: "text-[11px] uppercase tracking-[0.08em] text-muted-foreground", children: "Dome Gross" }), _jsx("p", { className: "mt-1 font-semibold", children: formatCurrency(eventPerformance?.domeGrossRevenue ?? 0) })] }), _jsxs("div", { className: "rounded border bg-secondary/20 p-2", children: [_jsx("p", { className: "text-[11px] uppercase tracking-[0.08em] text-muted-foreground", children: "Hall Gross" }), _jsx("p", { className: "mt-1 font-semibold", children: formatCurrency(eventPerformance?.hallGrossRevenue ?? 0) })] })] })] }), _jsxs("div", { className: "rounded-xl border bg-background p-4 sm:p-5", children: [_jsx("h3", { className: "font-heading text-xl font-semibold", children: "Marketing + Site Metrics" }), _jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "ROAS, funnel traffic, and completion against comparable benchmarks." }), _jsxs("div", { className: "mt-4 grid gap-2 sm:grid-cols-2", children: [_jsxs("div", { className: "rounded border bg-secondary/20 p-2", children: [_jsx("p", { className: "text-[11px] uppercase tracking-[0.08em] text-muted-foreground", children: "Ad Spend" }), _jsx("p", { className: "mt-1 font-semibold", children: formatCurrency(eventPerformance?.adSpend ?? 0) })] }), _jsxs("div", { className: "rounded border bg-secondary/20 p-2", children: [_jsx("p", { className: "text-[11px] uppercase tracking-[0.08em] text-muted-foreground", children: "ROAS / Comp" }), _jsxs("p", { className: "mt-1 font-semibold", children: [eventPerformance?.roas ?? 0, "x / ", eventPerformance?.compRoas ?? 0, "x"] })] }), _jsxs("div", { className: "rounded border bg-secondary/20 p-2", children: [_jsx("p", { className: "text-[11px] uppercase tracking-[0.08em] text-muted-foreground", children: "Funnel Entries" }), _jsxs("p", { className: "mt-1 font-semibold", children: [formatCompactNumber(eventPerformance?.funnelEntries ?? 0), _jsxs("span", { className: "ml-1 text-xs text-muted-foreground", children: ["(Comp ", formatCompactNumber(eventPerformance?.compFunnelEntries ?? 0), ")"] })] })] }), _jsxs("div", { className: "rounded border bg-secondary/20 p-2", children: [_jsx("p", { className: "text-[11px] uppercase tracking-[0.08em] text-muted-foreground", children: "Funnel Completion" }), _jsxs("p", { className: "mt-1 font-semibold", children: [eventPerformance?.funnelCompletion ?? 0, "%", _jsxs("span", { className: "ml-1 text-xs text-muted-foreground", children: ["(Comp ", eventPerformance?.compFunnelCompletion ?? 0, "%)"] })] })] })] })] }), _jsx("div", { className: "rounded-xl border bg-background", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs(Table, { className: "min-w-[520px]", children: [_jsx(TableHeader, { className: "bg-secondary/40", children: _jsxs(TableRow, { className: "hover:bg-secondary/40", children: [_jsx(TableHead, { children: "Tickets Sold" }), _jsx(TableHead, { children: "Seat Group S.." }), _jsx(TableHead, { children: "Yield" }), _jsx(TableHead, { children: "Gross Yield" })] }) }), _jsxs(TableBody, { children: [reportingYieldRows.map((row) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: row.ticketsSold }), _jsxs(TableCell, { children: [row.sellThroughPct, "%"] }), _jsx(TableCell, { children: formatDollarInteger(row.yield) }), _jsx(TableCell, { children: formatDollarInteger(row.grossYield) })] }, row.id))), _jsxs(TableRow, { className: "bg-secondary/30 font-semibold", children: [_jsx(TableCell, { children: yieldTotals.ticketsSold }), _jsxs(TableCell, { children: [yieldTotals.sellThroughPct, "%"] }), _jsx(TableCell, { children: formatDollarInteger(yieldTotals.yield) }), _jsx(TableCell, { children: formatDollarInteger(yieldTotals.grossYield) })] })] })] }) }) }), _jsxs("div", { className: "rounded-xl border bg-background", children: [_jsxs("div", { className: "border-b bg-secondary/30 px-4 py-3 text-center", children: [_jsx("p", { className: "text-xs uppercase tracking-[0.16em] text-muted-foreground", children: "Comparable Event" }), _jsx("p", { className: "mt-1 text-sm text-foreground", children: "2025 Concacaf Gold Cup: USA vs. Mexico - 7/6/25 @ 4P" })] }), _jsx("div", { className: "overflow-x-auto", children: _jsxs(Table, { className: "min-w-[520px]", children: [_jsx(TableHeader, { className: "bg-secondary/40", children: _jsxs(TableRow, { className: "hover:bg-secondary/40", children: [_jsx(TableHead, { children: "Presale" }), _jsx(TableHead, { children: "Tickets Sold" }), _jsx(TableHead, { children: "% Sold" }), _jsx(TableHead, { children: "Comp Yield" })] }) }), _jsx(TableBody, { children: comparablePaceRows.map((row) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: row.phase }), _jsx(TableCell, { children: row.ticketsSold }), _jsxs(TableCell, { children: [row.soldPct, "%"] }), _jsx(TableCell, { children: formatDollarInteger(row.compYield) })] }, row.id))) })] }) })] })] })] })) : (_jsxs("section", { className: "space-y-6", children: [_jsxs("div", { className: "grid gap-3 sm:grid-cols-2 xl:grid-cols-4", children: [_jsxs("div", { className: "rounded-lg border bg-secondary/20 p-3", children: [_jsx("p", { className: "text-[11px] uppercase tracking-[0.08em] text-muted-foreground", children: "Projected Net Revenue (Current)" }), _jsx("p", { className: "mt-1 text-xl font-semibold", children: formatCurrency(eventPerformance?.projectedNetRevenueCurrent ?? 0) })] }), _jsxs("div", { className: "rounded-lg border bg-secondary/20 p-3", children: [_jsx("p", { className: "text-[11px] uppercase tracking-[0.08em] text-muted-foreground", children: "Projected Net Revenue (Recommended)" }), _jsx("p", { className: "mt-1 text-xl font-semibold", children: formatCurrency(eventPerformance?.projectedNetRevenueRecommended ?? 0) })] }), _jsxs("div", { className: "rounded-lg border bg-secondary/20 p-3", children: [_jsx("p", { className: "text-[11px] uppercase tracking-[0.08em] text-muted-foreground", children: "Pricing Opportunity" }), _jsx("p", { className: "mt-1 text-xl font-semibold", children: formatCurrency(eventPerformance?.pricingOpportunity ?? 0) })] }), _jsxs("div", { className: "rounded-lg border bg-secondary/20 p-3", children: [_jsx("p", { className: "text-[11px] uppercase tracking-[0.08em] text-muted-foreground", children: "Dome ATP (Release / Current / Rec)" }), _jsxs("p", { className: "mt-1 text-xl font-semibold", children: [formatCurrency(event.programReleaseDomeAtp), " / ", formatCurrency(event.domeAtp), " /", " ", formatCurrency(event.recAtp)] })] })] }), _jsxs("div", { children: [_jsx("h2", { className: "mb-2 font-heading text-3xl font-semibold", children: "Pricing" }), _jsxs("div", { className: "rounded-xl border bg-background", children: [_jsx("div", { className: "flex flex-wrap items-center justify-end gap-3 border-b p-3", children: _jsx(Button, { variant: "default", className: "h-9", onClick: onOpenSeatmap, children: "Edit Seat Map Pricing" }) }), _jsxs("div", { className: "border-b bg-secondary/25 px-3 py-2 text-xs text-muted-foreground", children: ["Health-adjusted recommendation:", _jsxs("span", { className: cn("ml-1 font-semibold", recommendationAdjustmentPct >= 0 ? "text-success" : "text-warning"), children: [recommendationAdjustmentPct >= 0 ? "+" : "", recommendationAdjustmentPct, "% (", recommendationDirectionLabel, ")"] })] }), unsavedChanges && (_jsxs("div", { className: "border-b bg-warning/10 px-3 py-2 text-sm text-warning-foreground", children: [stagedActionCount, " staged change", stagedActionCount === 1 ? "" : "s", " pending publish."] })), _jsx("div", { className: "overflow-x-auto", children: _jsxs(Table, { className: "min-w-[760px]", children: [_jsx(TableHeader, { className: "bg-secondary/40", children: _jsxs(TableRow, { className: "hover:bg-secondary/40", children: [_jsx(TableHead, { className: "w-[15%]", children: "Original" }), _jsx(TableHead, { className: "w-[15%]", children: "Current" }), _jsx(TableHead, { className: "w-[12%]", children: "% Sold" }), _jsx(TableHead, { className: "w-[15%]", children: "Left-To-Go" }), _jsx(TableHead, { className: "w-[12%]", children: "Yield" }), _jsx(TableHead, { className: "w-[31%]", children: "Recommendation" })] }) }), _jsx(TableBody, { children: pricingRows.map((row) => {
                                                                        const recommendedPrice = healthAdjustedRecommendation(row.recPrice, latestHealthScore);
                                                                        const recommendationDelta = roundTo(recommendedPrice - row.currentPrice, 2);
                                                                        const isRecommendationDifferent = !arePriceValuesEqual(recommendedPrice, row.currentPrice);
                                                                        const isRecommendationUndo = pricingRecommendationUndoById[row.id] !== undefined &&
                                                                            arePriceValuesEqual(recommendedPrice, row.currentPrice);
                                                                        const isRowStaged = savedPricingById.get(row.id) !== row.currentPrice;
                                                                        return (_jsxs(TableRow, { className: cn(isRowStaged && "bg-primary/5"), children: [_jsx(TableCell, { children: formatCurrency(row.originalPrice) }), _jsx(TableCell, { children: editingPricingRowId === row.id ? (_jsx(Input, { type: "number", inputMode: "decimal", min: "0", step: "0.01", autoFocus: true, value: editingPricingValue, onChange: (event) => setEditingPricingValue(event.target.value), onKeyDown: (event) => {
                                                                                            if (event.key === "Enter") {
                                                                                                commitPricingRowEdit();
                                                                                            }
                                                                                            if (event.key === "Escape") {
                                                                                                cancelPricingRowEdit();
                                                                                            }
                                                                                        }, onBlur: cancelPricingRowEdit, className: "h-8 w-[104px] bg-card", "aria-label": `Current price for ${row.label}` })) : (_jsx("button", { type: "button", onDoubleClick: () => beginPricingRowEdit(row), className: cn("rounded px-1 text-left font-medium", isRowStaged ? "text-orange-500" : "text-foreground"), "aria-label": `Edit current price for ${row.label}`, children: formatCurrency(row.currentPrice) })) }), _jsx(TableCell, { children: row.soldPct !== null ? `${row.soldPct}%` : "--" }), _jsx(TableCell, { children: row.ticketsLeft !== null ? row.ticketsLeft : "--" }), _jsx(TableCell, { children: row.yield !== null ? formatDollarInteger(row.yield) : "--" }), _jsx(TableCell, { children: _jsx("div", { className: "flex items-center justify-between gap-2", children: _jsxs("div", { className: "text-sm", children: [_jsx("button", { type: "button", onClick: () => isRecommendationUndo
                                                                                                        ? undoPricingRecommendation(row.id)
                                                                                                        : applyPricingRecommendation(row.id, row.currentPrice, recommendedPrice), disabled: !isRecommendationDifferent && !isRecommendationUndo, className: cn("inline-flex h-7 items-center rounded-full border px-2.5 text-xs font-semibold transition", isRecommendationUndo
                                                                                                        ? "border-warning/50 bg-warning/10 text-warning hover:bg-warning/15"
                                                                                                        : isRecommendationDifferent
                                                                                                            ? "border-primary/40 bg-primary/10 text-primary hover:bg-primary/15"
                                                                                                            : "cursor-default border-border/70 bg-secondary/20 text-muted-foreground"), "aria-label": isRecommendationUndo
                                                                                                        ? `Undo recommended price for ${row.label}`
                                                                                                        : `Apply recommended price for ${row.label}`, children: isRecommendationUndo ? "Undo" : formatCurrency(recommendedPrice) }), _jsxs("p", { className: cn("text-xs", recommendationDelta > 0
                                                                                                        ? "text-success"
                                                                                                        : recommendationDelta < 0
                                                                                                            ? "text-warning"
                                                                                                            : "text-muted-foreground"), children: [recommendationDelta >= 0 ? "+" : "", formatCurrency(recommendationDelta)] })] }) }) })] }, row.id));
                                                                    }) })] }) })] })] }), _jsxs("div", { children: [_jsx("h2", { className: "mb-2 font-heading text-3xl font-semibold", children: "Offers" }), _jsx("div", { className: "rounded-xl border bg-background", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs(Table, { className: "min-w-[760px]", children: [_jsx(TableHeader, { className: "bg-secondary/40", children: _jsxs(TableRow, { className: "hover:bg-secondary/40", children: [_jsx(TableHead, { children: "Offer" }), _jsx(TableHead, { children: "Type" }), _jsx(TableHead, { children: "Amount" }), _jsx(TableHead, { children: "Start" }), _jsx(TableHead, { children: "End" }), _jsx(TableHead, { className: "text-center", children: "Publish" })] }) }), _jsx(TableBody, { children: offerRows.map((offer) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: offer.offer }), _jsx(TableCell, { children: offer.type }), _jsx(TableCell, { children: offer.amountLabel }), _jsx(TableCell, { children: offer.startLabel }), _jsx(TableCell, { children: offer.endLabel }), _jsx(TableCell, { className: "text-center", children: _jsx("button", { type: "button", onClick: () => toggleOfferPublished(offer.id), className: "inline-flex h-6 w-6 items-center justify-center rounded-full border border-transparent transition hover:border-border", "aria-label": `Toggle ${offer.offer} publish`, children: _jsx("span", { className: cn("h-3.5 w-3.5 rounded-full", offer.published ? "bg-success" : "bg-muted-foreground/40") }) }) })] }, offer.id))) })] }) }) })] }), _jsxs("div", { children: [_jsx("h2", { className: "mb-2 font-heading text-3xl font-semibold", children: "Active Discounts" }), _jsx("div", { className: "rounded-xl border bg-background", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs(Table, { className: "min-w-[700px]", children: [_jsx(TableHeader, { className: "bg-secondary/40", children: _jsxs(TableRow, { className: "hover:bg-secondary/40", children: [_jsx(TableHead, { children: "Discount" }), _jsx(TableHead, { children: "Code" }), _jsx(TableHead, { children: "Amount" }), _jsx(TableHead, { children: "Start" }), _jsx(TableHead, { children: "End" })] }) }), _jsx(TableBody, { children: discountRows.map((discount) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: discount.discount }), _jsx(TableCell, { children: discount.code }), _jsx(TableCell, { children: discount.amountLabel }), _jsx(TableCell, { children: discount.startLabel }), _jsx(TableCell, { children: discount.endLabel })] }, discount.id))) })] }) }) })] })] }))] })] }), _jsx(DraftActionFooter, { stagedCount: stagedActionCount, onDiscard: onDiscardPricingDraft, onPublish: onPublishPricingChanges, scopeLabel: "for this event", extraActionLabel: "Review Recommendations", onExtraAction: openRecommendedReviewModal, extraActionDisabled: recommendedReviewChangeRows.length === 0 })] }));
}
export default function App() {
    const [publishedEvents, setPublishedEvents] = useState(() => cloneEvents(initialEvents));
    const [draftEvents, setDraftEvents] = useState(() => cloneEvents(initialEvents));
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [expandedRows, setExpandedRows] = useState(new Set(["evt-001"]));
    const [sortState, setSortState] = useState({
        key: "startTime",
        direction: "asc",
    });
    const [editingEventId, setEditingEventId] = useState(null);
    const [editingEventValue, setEditingEventValue] = useState("");
    const [selectedEventIds, setSelectedEventIds] = useState([]);
    const [bulkEventEditValuesByField, setBulkEventEditValuesByField] = useState({});
    const [bulkEventEditModesByField, setBulkEventEditModesByField] = useState({});
    const [showEventBulkEditOverlay, setShowEventBulkEditOverlay] = useState(false);
    const [editingSeatCell, setEditingSeatCell] = useState(null);
    const [editingSeatValue, setEditingSeatValue] = useState("");
    const [selectedSeatGroupsByEvent, setSelectedSeatGroupsByEvent] = useState({});
    const [bulkSeatEditValues, setBulkSeatEditValues] = useState({});
    const [bulkSeatEditFieldByEvent, setBulkSeatEditFieldByEvent] = useState({});
    const [bulkSeatEditModeByEvent, setBulkSeatEditModeByEvent] = useState({});
    const [activeBulkEditEventId, setActiveBulkEditEventId] = useState(null);
    const [showPublishConfirmation, setShowPublishConfirmation] = useState(false);
    const [showPublishOverlay, setShowPublishOverlay] = useState(false);
    const [showRecommendedReviewModal, setShowRecommendedReviewModal] = useState(false);
    const [recommendedReviewValuesById, setRecommendedReviewValuesById] = useState({});
    const [draftSeatRecommendationUndoById, setDraftSeatRecommendationUndoById] = useState({});
    const [route, setRoute] = useState(() => {
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
    const navigate = (path) => {
        window.history.pushState({}, "", path);
        setRoute(parseRoute(path));
    };
    const pendingChanges = useMemo(() => calculatePendingChanges(publishedEvents, draftEvents), [publishedEvents, draftEvents]);
    const publishChangeRows = useMemo(() => buildPublishChangeRows(publishedEvents, draftEvents), [publishedEvents, draftEvents]);
    const publishedById = useMemo(() => new Map(publishedEvents.map((event) => [event.id, event])), [publishedEvents]);
    const selectedEvents = useMemo(() => draftEvents.filter((event) => selectedEventIds.includes(event.id)), [draftEvents, selectedEventIds]);
    const sharedEventPriceTierOptions = useMemo(() => intersectOptions(selectedEvents.map((event) => event.priceTierOptions)), [selectedEvents]);
    const sharedEventSeatGroupNames = useMemo(() => Array.from(new Set(selectedEvents.flatMap((event) => event.seatGroups.map((seatGroup) => seatGroup.name)))), [selectedEvents]);
    const canBulkEditDomeAtp = useMemo(() => selectedEvents.length > 0 && selectedEvents.every((event) => event.status === "On Sale"), [selectedEvents]);
    const sharedEventEditableFields = useMemo(() => [
        ...(canBulkEditDomeAtp
            ? [
                {
                    value: "domeAtp",
                    label: "Dome ATP",
                    inputType: "number",
                    group: "event",
                },
            ]
            : []),
        ...(sharedEventPriceTierOptions.length > 0
            ? [
                {
                    value: "priceTier",
                    label: "Price Tier",
                    inputType: "select",
                    group: "event",
                    selectOptions: sharedEventPriceTierOptions,
                },
            ]
            : []),
        ...sharedEventSeatGroupNames.map((seatGroupName) => ({
            value: `seatGroup:${seatGroupName}`,
            label: seatGroupName,
            inputType: "number",
            group: "seatGroup",
            availabilityCount: selectedEvents.filter((event) => event.seatGroups.some((seatGroup) => seatGroup.name === seatGroupName)).length,
        })),
    ], [
        canBulkEditDomeAtp,
        sharedEventPriceTierOptions,
        sharedEventSeatGroupNames,
        selectedEvents,
    ]);
    const eventBulkFieldSummaries = useMemo(() => Object.fromEntries(sharedEventEditableFields.map((field) => {
        if (field.value === "domeAtp") {
            return [
                field.value,
                summarizeBulkEditValues(selectedEvents.map((event) => event.domeAtp), (value) => formatCurrency(value)),
            ];
        }
        if (field.value === "priceTier") {
            return [
                field.value,
                summarizeBulkEditValues(selectedEvents.map((event) => event.priceTier), (value) => value),
            ];
        }
        const seatGroupName = field.value.replace("seatGroup:", "");
        const matchingSeatGroups = selectedEvents
            .map((event) => getSeatGroupByName(event, seatGroupName))
            .filter((seatGroup) => seatGroup !== undefined);
        const summary = summarizeBulkEditValues(matchingSeatGroups.map((seatGroup) => seatGroup.currentPrice), (value) => formatCurrency(value));
        const availabilityCount = field.availabilityCount ?? matchingSeatGroups.length;
        return [
            field.value,
            {
                ...summary,
                detailLabel: availabilityCount < selectedEvents.length
                    ? `${availabilityCount} of ${selectedEvents.length} events`
                    : "All selected events",
            },
        ];
    })), [selectedEvents, sharedEventEditableFields]);
    const bulkEventEditValues = useMemo(() => Object.fromEntries(sharedEventEditableFields.map((field) => [field.value, bulkEventEditValuesByField[field.value] ?? ""])), [bulkEventEditValuesByField, sharedEventEditableFields]);
    const bulkEventEditModes = useMemo(() => Object.fromEntries(sharedEventEditableFields.map((field) => [field.value, bulkEventEditModesByField[field.value] ?? "set"])), [bulkEventEditModesByField, sharedEventEditableFields]);
    const filteredAndSortedEvents = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        const filtered = draftEvents.filter((event) => {
            if (term.length > 0 &&
                !event.event.toLowerCase().includes(term) &&
                !event.venueName.toLowerCase().includes(term)) {
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
            const compareResult = typeof left === "number" && typeof right === "number"
                ? left - right
                : String(left).localeCompare(String(right));
            return sortState.direction === "asc" ? compareResult : compareResult * -1;
        });
        return sorted;
    }, [draftEvents, searchTerm, statusFilter, sortState]);
    const recommendedReviewChangeRows = useMemo(() => draftEvents.flatMap((event) => event.seatGroups.flatMap((seatGroup) => {
        if (arePriceValuesEqual(seatGroup.recTicketPrice, seatGroup.currentPrice)) {
            return [];
        }
        return [
            {
                id: `draft-seat-group-price-${event.id}-${seatGroup.id}`,
                rowLabel: seatGroup.name,
                contextLabel: event.event,
                currentValue: seatGroup.currentPrice,
                suggestedValue: seatGroup.recTicketPrice,
                format: "currency",
                inputStep: "0.01",
                inputDecimals: 2,
                target: {
                    type: "draft-seat-group-price",
                    eventId: event.id,
                    seatGroupId: seatGroup.id,
                },
            },
        ];
    })), [draftEvents]);
    const visibleEventIds = useMemo(() => filteredAndSortedEvents.map((event) => event.id), [filteredAndSortedEvents]);
    const selectedVisibleEventCount = useMemo(() => visibleEventIds.filter((eventId) => selectedEventIds.includes(eventId)).length, [selectedEventIds, visibleEventIds]);
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
    const onSort = (key) => {
        setSortState((current) => {
            if (current.key === key) {
                return { key, direction: current.direction === "asc" ? "desc" : "asc" };
            }
            return { key, direction: "asc" };
        });
    };
    const beginEventPriceEdit = (eventRecord) => {
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
    const setBulkEventFieldValue = (field, nextValue) => {
        setBulkEventEditValuesByField((current) => ({
            ...current,
            [field]: nextValue,
        }));
    };
    const setBulkEventFieldMode = (field, nextMode) => {
        setBulkEventEditModesByField((current) => ({
            ...current,
            [field]: nextMode,
        }));
    };
    const beginSeatCellEdit = (eventId, seatGroup, field) => {
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
        }
        else {
            onSeatGroupCurrentPriceChange(editingSeatCell.eventId, editingSeatCell.seatGroupId, editingSeatValue);
        }
        setEditingSeatCell(null);
        setEditingSeatValue("");
    };
    const onDomeAtpChange = (eventId, nextValue) => {
        setDraftEvents((current) => current.map((event) => {
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
        }));
    };
    const onPriceTierChange = (eventId, nextValue) => {
        const trimmedValue = nextValue.trim();
        if (trimmedValue.length === 0) {
            return;
        }
        setDraftEvents((current) => current.map((event) => {
            if (event.id !== eventId || !event.priceTierOptions.includes(trimmedValue)) {
                return event;
            }
            return {
                ...event,
                priceTier: trimmedValue,
            };
        }));
    };
    const onBulkEventEdit = (eventIds, field, nextValue, editMode) => {
        if (eventIds.length === 0) {
            return;
        }
        const selectedIds = new Set(eventIds);
        if (field.startsWith("seatGroup:")) {
            const seatGroupName = field.replace("seatGroup:", "");
            if (!Number.isFinite(Number.parseFloat(nextValue))) {
                return;
            }
            setDraftEvents((current) => current.map((event) => selectedIds.has(event.id)
                ? {
                    ...event,
                    seatGroups: event.seatGroups.map((seatGroup) => seatGroup.name === seatGroupName
                        ? {
                            ...seatGroup,
                            currentPrice: applyNumericBulkEdit(seatGroup.currentPrice, nextValue, editMode) ??
                                seatGroup.currentPrice,
                        }
                        : seatGroup),
                }
                : event));
            return;
        }
        if (field === "priceTier") {
            const trimmedValue = nextValue.trim();
            if (trimmedValue.length === 0) {
                return;
            }
            setDraftEvents((current) => current.map((event) => selectedIds.has(event.id) && event.priceTierOptions.includes(trimmedValue)
                ? {
                    ...event,
                    priceTier: trimmedValue,
                }
                : event));
            return;
        }
        if (!Number.isFinite(Number.parseFloat(nextValue))) {
            return;
        }
        setDraftEvents((current) => current.map((event) => selectedIds.has(event.id) && event.status === "On Sale"
            ? {
                ...event,
                domeAtp: applyNumericBulkEdit(event.domeAtp, nextValue, editMode),
            }
            : event));
    };
    const toggleEventSelection = (eventId, checked) => {
        setSelectedEventIds((current) => checked
            ? current.includes(eventId)
                ? current
                : [...current, eventId]
            : current.filter((id) => id !== eventId));
    };
    const toggleAllVisibleEvents = (eventIds, checked) => {
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
    const isBulkEventApplyDisabled = (field) => {
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
    const bulkEventFieldsReadyToApply = sharedEventEditableFields.filter((field) => !isBulkEventApplyDisabled(field));
    const applyBulkEventEdits = () => {
        if (selectedEventIds.length === 0 || bulkEventFieldsReadyToApply.length === 0) {
            return;
        }
        cancelEventPriceEdit();
        setDraftSeatRecommendationUndoById({});
        bulkEventFieldsReadyToApply.forEach((field) => {
            onBulkEventEdit(selectedEventIds, field.value, bulkEventEditValues[field.value] ?? "", bulkEventEditModes[field.value] ?? "set");
        });
        setBulkEventEditValuesByField({});
        setBulkEventEditModesByField({});
        setShowEventBulkEditOverlay(false);
    };
    const onSeatGroupCurrentPriceChange = (eventId, seatGroupId, nextValue) => {
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
        setDraftEvents((current) => current.map((event) => {
            if (event.id !== eventId) {
                return event;
            }
            const seatGroups = event.seatGroups.map((group) => group.id === seatGroupId
                ? {
                    ...group,
                    currentPrice: roundTo(Math.max(0, parsedValue), 2),
                }
                : group);
            return {
                ...event,
                seatGroups,
            };
        }));
    };
    const applyDraftSeatGroupRecommendation = (eventId, seatGroupId, currentPrice, recommendedPrice) => {
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
        setDraftEvents((current) => current.map((event) => event.id === eventId
            ? {
                ...event,
                seatGroups: event.seatGroups.map((seatGroup) => seatGroup.id === seatGroupId
                    ? {
                        ...seatGroup,
                        currentPrice: recommendedPrice,
                    }
                    : seatGroup),
            }
            : event));
    };
    const undoDraftSeatGroupRecommendation = (eventId, seatGroupId) => {
        const recommendationKey = `${eventId}:${seatGroupId}`;
        const previousPrice = draftSeatRecommendationUndoById[recommendationKey];
        if (previousPrice === undefined) {
            return;
        }
        setDraftEvents((current) => current.map((event) => event.id === eventId
            ? {
                ...event,
                seatGroups: event.seatGroups.map((seatGroup) => seatGroup.id === seatGroupId
                    ? {
                        ...seatGroup,
                        currentPrice: previousPrice,
                    }
                    : seatGroup),
            }
            : event));
        setDraftSeatRecommendationUndoById((current) => {
            const { [recommendationKey]: _removed, ...rest } = current;
            return rest;
        });
    };
    const onSeatGroupNameChange = (eventId, seatGroupId, nextValue) => {
        const trimmedValue = nextValue.trim();
        if (trimmedValue.length === 0) {
            return;
        }
        setDraftEvents((current) => current.map((event) => {
            if (event.id !== eventId) {
                return event;
            }
            const seatGroups = event.seatGroups.map((group) => group.id === seatGroupId
                ? {
                    ...group,
                    name: trimmedValue,
                }
                : group);
            return {
                ...event,
                seatGroups,
            };
        }));
    };
    const onSeatGroupBulkEdit = (eventId, seatGroupIds, field, nextValue, editMode) => {
        if (seatGroupIds.length === 0) {
            return;
        }
        const selectedSeatGroupIds = new Set(seatGroupIds);
        let nextName = null;
        if (field === "name") {
            const trimmedValue = nextValue.trim();
            if (trimmedValue.length === 0) {
                return;
            }
            nextName = trimmedValue;
        }
        else {
            if (!Number.isFinite(Number.parseFloat(nextValue))) {
                return;
            }
        }
        setDraftEvents((current) => current.map((event) => {
            if (event.id !== eventId) {
                return event;
            }
            const seatGroups = event.seatGroups.map((group) => selectedSeatGroupIds.has(group.id)
                ? {
                    ...group,
                    ...(field === "name"
                        ? { name: nextName }
                        : {
                            currentPrice: applyNumericBulkEdit(group.currentPrice, nextValue, editMode) ??
                                group.currentPrice,
                        }),
                }
                : group);
            return {
                ...event,
                seatGroups,
            };
        }));
    };
    const toggleSeatGroupSelection = (eventId, seatGroupId, checked) => {
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
    const toggleAllSeatGroupsForEvent = (eventId, seatGroups, checked) => {
        setSelectedSeatGroupsByEvent((current) => ({
            ...current,
            [eventId]: checked ? seatGroups.map((seatGroup) => seatGroup.id) : [],
        }));
    };
    const clearSeatGroupSelection = (eventId) => {
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
    const applyBulkSeatEdit = (eventId) => {
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
        setRecommendedReviewValuesById(Object.fromEntries(recommendedReviewChangeRows.map((row) => [
            row.id,
            formatRecommendationReviewInputValue(row.suggestedValue, row.inputDecimals),
        ])));
        setEditingEventId(null);
        setEditingEventValue("");
        setEditingSeatCell(null);
        setEditingSeatValue("");
        setShowRecommendedReviewModal(true);
    };
    const onRecommendedReviewValueChange = (rowId, nextValue) => {
        setRecommendedReviewValuesById((current) => ({
            ...current,
            [rowId]: nextValue,
        }));
    };
    const getNextDraftEventsWithReviewedRecommendations = () => {
        const reviewedSeatGroupPrices = new Map();
        for (const row of recommendedReviewChangeRows) {
            const parsedValue = Number.parseFloat(recommendedReviewValuesById[row.id] ?? "");
            if (!Number.isFinite(parsedValue) || parsedValue < 0) {
                return;
            }
            if (row.maximum !== undefined && parsedValue > row.maximum) {
                return;
            }
            if (row.target.type === "draft-seat-group-price") {
                reviewedSeatGroupPrices.set(`${row.target.eventId}:${row.target.seatGroupId}`, roundTo(parsedValue, 2));
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
    const onConfirmPublishChanges = () => {
        if (pendingChanges.total === 0) {
            return;
        }
        setPublishedEvents(cloneEvents(draftEvents));
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
    const toggleExpanded = (eventId) => {
        setExpandedRows((current) => {
            const next = new Set(current);
            if (next.has(eventId)) {
                next.delete(eventId);
            }
            else {
                next.add(eventId);
            }
            return next;
        });
    };
    const sortIconForKey = (key) => {
        if (sortState.key !== key) {
            return _jsx(ArrowUpDown, { className: "h-3 w-3 text-muted-foreground/40 transition-opacity group-hover:text-muted-foreground/70" });
        }
        return sortState.direction === "asc" ? (_jsx(ArrowUp, { className: "h-3 w-3 text-foreground" })) : (_jsx(ArrowDown, { className: "h-3 w-3 text-foreground" }));
    };
    if (route.type === "seatmap") {
        const event = draftEvents.find((item) => item.id === route.eventId);
        return (_jsxs(_Fragment, { children: [_jsx(PublishConfirmationModal, { open: showPublishConfirmation, changeRows: publishChangeRows, onCancel: () => setShowPublishConfirmation(false), onConfirm: onConfirmPublishChanges }), _jsx(EventRoutePlaceholder, { title: "Seatmap", event: event, onBack: () => navigate("/") }), _jsx(DraftActionFooter, { stagedCount: pendingChanges.total, onDiscard: onDiscardChanges, onPublish: onPublishChanges })] }));
    }
    if (route.type === "reporting") {
        const event = draftEvents.find((item) => item.id === route.eventId);
        return (_jsxs(_Fragment, { children: [_jsx(PublishConfirmationModal, { open: showPublishConfirmation, changeRows: publishChangeRows, onCancel: () => setShowPublishConfirmation(false), onConfirm: onConfirmPublishChanges }), _jsx(EventReportingDashboard, { event: event, onBack: () => navigate("/"), onOpenSeatmap: () => event ? navigate(`/seatmap/${encodeURIComponent(event.id)}`) : undefined })] }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(9,119,180,0.12),_transparent_42%),linear-gradient(180deg,_hsl(210_33%_98%)_0%,_hsl(210_30%_95%)_100%)] px-4 py-8 pb-28 sm:px-6 lg:px-8", children: [_jsxs("main", { className: "mx-auto max-w-[1450px]", children: [_jsx(PublishedOverlay, { visible: showPublishOverlay }), _jsx(PublishConfirmationModal, { open: showPublishConfirmation, changeRows: publishChangeRows, onCancel: () => setShowPublishConfirmation(false), onConfirm: onConfirmPublishChanges }), _jsx(RecommendedReviewModal, { open: showRecommendedReviewModal, changeRows: recommendedReviewChangeRows, valueById: recommendedReviewValuesById, onValueChange: onRecommendedReviewValueChange, onCancel: () => setShowRecommendedReviewModal(false), onConfirm: stageReviewedRecommendedChanges, onConfirmAndPublish: publishReviewedRecommendedChanges }), _jsx("header", { className: "mb-6 flex flex-wrap items-end justify-between gap-4", children: _jsxs("div", { children: [_jsx("h1", { className: "font-heading text-3xl font-semibold tracking-tight text-foreground", children: "Pricing Test" }), _jsx("p", { className: "mt-1 max-w-3xl text-sm text-muted-foreground", children: "Search, filter, and stage pricing updates across active events before publishing." })] }) }), _jsxs("section", { className: "overflow-hidden rounded-2xl border bg-card/95 shadow-[0_24px_70px_-45px_rgba(15,23,42,0.65)] backdrop-blur", children: [_jsx("div", { className: "flex flex-wrap items-center justify-between gap-3 border-b bg-secondary/65 px-4 py-3 sm:px-6", children: _jsx("div", { className: "flex flex-1 flex-wrap items-center gap-2", children: _jsxs("div", { className: "flex min-w-[320px] flex-1 items-center overflow-hidden rounded-lg border border-border bg-background shadow-sm sm:max-w-md", children: [_jsxs("div", { className: "relative flex-1", children: [_jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), _jsx(Input, { value: searchTerm, onChange: (event) => setSearchTerm(event.target.value), className: "rounded-none border-0 pl-9 shadow-none focus-visible:ring-0", placeholder: "Search events or venue", "aria-label": "Search events" })] }), _jsx("div", { className: "h-5 w-px bg-border" }), _jsxs(Select, { value: statusFilter, onValueChange: (next) => setStatusFilter(next), children: [_jsx(SelectTrigger, { className: "w-[150px] rounded-none border-0 shadow-none focus:ring-0 focus-visible:ring-0", children: _jsx(SelectValue, { placeholder: "Filter" }) }), _jsx(SelectContent, { children: statusFilterOptions.map((option) => (_jsx(SelectItem, { value: option.value, children: option.label }, option.value))) })] })] }) }) }), pendingChanges.total > 0 && (_jsxs("div", { className: "border-b bg-primary/5 px-4 py-2 text-sm text-primary sm:px-6", children: [pendingChanges.total, " staged pricing update", pendingChanges.total === 1 ? "" : "s", " ready to publish."] })), _jsx("div", { className: "flex flex-wrap items-center gap-3 border-b border-border/70 bg-card px-4 py-3 sm:px-6", children: _jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [_jsx("div", { children: _jsx("p", { className: "text-sm font-medium text-foreground", children: selectedEventIds.length > 0
                                                    ? `${selectedEventIds.length} of ${visibleEventIds.length} selected`
                                                    : `${visibleEventIds.length} event${visibleEventIds.length === 1 ? "" : "s"}` }) }), selectedEventIds.length > 0 && (_jsxs("div", { className: "relative flex items-center gap-1", children: [_jsx(Button, { variant: "ghost", size: "icon", className: "h-8 w-8", onClick: () => setShowEventBulkEditOverlay((current) => !current), disabled: sharedEventEditableFields.length === 0, "aria-label": `Edit ${selectedEventIds.length} selected events`, children: _jsx(Pencil, { className: "h-4 w-4" }) }), _jsx(Button, { variant: "ghost", size: "icon", className: "h-8 w-8 text-muted-foreground hover:text-destructive", onClick: clearEventSelection, "aria-label": `Clear ${selectedEventIds.length} selected events`, children: _jsx(Trash2, { className: "h-4 w-4" }) }), showEventBulkEditOverlay && (_jsxs("div", { className: "absolute left-0 top-full z-20 mt-2 w-[760px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-border/80 bg-card shadow-xl", children: [_jsxs("div", { className: "border-b border-border/70 bg-secondary/20 px-4 py-3", children: [_jsx("p", { className: "text-sm font-medium text-foreground", children: "Bulk Edit Events" }), _jsxs("p", { className: "text-xs text-muted-foreground", children: ["Shared editable fields across ", selectedEventIds.length, " selected event", selectedEventIds.length === 1 ? "" : "s", "."] })] }), _jsx("div", { className: "max-h-[440px] overflow-auto", children: _jsxs(Table, { className: "min-w-[700px]", children: [_jsx(TableHeader, { className: "bg-secondary/35", children: _jsxs(TableRow, { className: "hover:bg-secondary/35", children: [_jsx(TableHead, { className: "w-[190px]", children: "Field" }), _jsx(TableHead, { className: "w-[170px]", children: "Current" }), _jsx(TableHead, { className: "w-[340px]", children: "Edit" })] }) }), _jsx(TableBody, { children: ["event", "seatGroup"].map((group) => {
                                                                            const fields = sharedEventEditableFields.filter((field) => field.group === group);
                                                                            if (fields.length === 0) {
                                                                                return null;
                                                                            }
                                                                            return (_jsxs(Fragment, { children: [_jsx(TableRow, { className: "bg-secondary/10 hover:bg-secondary/10", children: _jsx(TableCell, { colSpan: 3, className: "py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground", children: group === "event" ? "Event Fields" : "Seat Groups" }) }), fields.map((field) => {
                                                                                        const summary = eventBulkFieldSummaries[field.value] ?? {
                                                                                            valueLabel: "--",
                                                                                        };
                                                                                        const fieldValue = bulkEventEditValues[field.value] ?? "";
                                                                                        const fieldMode = bulkEventEditModes[field.value] ?? "set";
                                                                                        return (_jsxs(TableRow, { className: "align-top", children: [_jsx(TableCell, { className: "py-3", children: _jsxs("div", { children: [_jsx("p", { className: "font-medium text-foreground", children: field.label }), field.group === "seatGroup" && (_jsx("p", { className: "text-xs text-muted-foreground", children: "Current Price" }))] }) }), _jsx(TableCell, { className: "py-3", children: _jsxs("div", { children: [_jsx("p", { className: cn("font-medium text-foreground", summary.valueLabel === "Mixed" && "text-muted-foreground"), children: summary.valueLabel }), summary.detailLabel && (_jsx("p", { className: "text-xs text-muted-foreground", children: summary.detailLabel }))] }) }), _jsx(TableCell, { className: "py-3", children: _jsx("div", { className: "space-y-2", children: field.inputType === "select" ? (_jsx("div", { children: _jsxs(Select, { value: fieldValue, onValueChange: (next) => setBulkEventFieldValue(field.value, next), children: [_jsx(SelectTrigger, { className: "h-8 w-full bg-background", children: _jsx(SelectValue, { placeholder: "Select value" }) }), _jsx(SelectContent, { children: (field.selectOptions ?? []).map((option) => (_jsx(SelectItem, { value: option, children: option }, option))) })] }) })) : (_jsxs(_Fragment, { children: [_jsxs(Select, { value: fieldMode, onValueChange: (next) => setBulkEventFieldMode(field.value, next), children: [_jsx(SelectTrigger, { className: "h-8 w-full bg-background", children: _jsx(SelectValue, { placeholder: "Mode" }) }), _jsx(SelectContent, { children: numericBulkEditModes.map((mode) => (_jsx(SelectItem, { value: mode.value, children: mode.label }, mode.value))) })] }), _jsx("div", { children: _jsx(Input, { type: "number", inputMode: "decimal", step: "0.01", value: fieldValue, onChange: (selectionEvent) => setBulkEventFieldValue(field.value, selectionEvent.target.value), onKeyDown: (selectionEvent) => {
                                                                                                                            if (selectionEvent.key === "Enter") {
                                                                                                                                applyBulkEventEdits();
                                                                                                                            }
                                                                                                                            if (selectionEvent.key === "Escape") {
                                                                                                                                setShowEventBulkEditOverlay(false);
                                                                                                                            }
                                                                                                                        }, className: "h-8 w-full bg-background", placeholder: fieldMode === "percent"
                                                                                                                            ? "Increase by %"
                                                                                                                            : fieldMode === "flat"
                                                                                                                                ? "Increase by amount"
                                                                                                                                : field.value.startsWith("seatGroup:")
                                                                                                                                    ? "Set price"
                                                                                                                                    : "Set value", "aria-label": `Bulk edit ${field.label}` }) })] })) }) })] }, field.value));
                                                                                    })] }, group));
                                                                        }) })] }) }), _jsxs("div", { className: "flex items-center justify-end gap-2 border-t border-border/70 px-4 py-3", children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: () => setShowEventBulkEditOverlay(false), children: "Close" }), _jsx(Button, { variant: "secondary", size: "sm", onClick: applyBulkEventEdits, disabled: bulkEventFieldsReadyToApply.length === 0, children: "Apply" })] })] }))] }))] }) }), _jsx("div", { className: "overflow-x-auto", children: _jsxs(Table, { className: "w-[3240px] table-fixed", children: [_jsxs("colgroup", { children: [_jsx("col", { style: { width: '650px' } }), _jsx("col", { style: { width: '170px' } }), _jsx("col", { style: { width: '150px' } }), _jsx("col", { style: { width: '150px' } }), _jsx("col", { style: { width: '180px' } }), _jsx("col", { style: { width: '250px' } }), _jsx("col", { style: { width: '90px' } }), _jsx("col", { style: { width: '90px' } }), _jsx("col", { style: { width: '90px' } }), _jsx("col", { style: { width: '100px' } }), _jsx("col", { style: { width: '100px' } }), _jsx("col", { style: { width: '100px' } }), _jsx("col", { style: { width: '170px' } }), _jsx("col", { style: { width: '170px' } }), _jsx("col", { style: { width: '140px' } }), _jsx("col", { style: { width: '190px' } }), _jsx("col", { style: { width: '100px' } }), _jsx("col", { style: { width: '160px' } }), _jsx("col", { style: { width: '120px' } }), _jsx("col", { style: { width: '70px' } })] }), _jsxs(TableHeader, { className: "bg-secondary/40", children: [_jsxs(TableRow, { className: "hover:bg-secondary/40", children: [_jsx(TableHead, { colSpan: 5, className: "w-[1300px] h-5 border-x border-b border-border/60 bg-secondary/20 p-0 text-center", children: _jsx("div", { className: "flex h-full items-center justify-center", children: _jsx("span", { className: "text-[9px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/60", children: "Event Details" }) }) }), _jsx(TableHead, { colSpan: 1, className: "w-[250px] h-5 border-x border-b border-border/60 bg-secondary/20 p-0 text-center", children: _jsx("div", { className: "flex h-full items-center justify-center", children: _jsx("span", { className: "text-[9px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/60", children: "Pricing" }) }) }), _jsx(TableHead, { colSpan: 3, className: "w-[270px] h-5 border-x border-b border-border/60 bg-secondary/20 p-0 text-center", children: _jsx("div", { className: "flex h-full items-center justify-center", children: _jsx("span", { className: "text-[9px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/60", children: "Percent Sold" }) }) }), _jsx(TableHead, { colSpan: 3, className: "w-[300px] h-5 border-x border-b border-border/60 bg-secondary/20 p-0 text-center", children: _jsx("div", { className: "flex h-full items-center justify-center", children: _jsx("span", { className: "text-[9px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/60", children: "Sell Through" }) }) }), _jsx(TableHead, { colSpan: 2, className: "w-[340px] h-5 border-x border-b border-border/60 bg-secondary/20 p-0 text-center", children: _jsx("div", { className: "flex h-full items-center justify-center", children: _jsx("span", { className: "text-[9px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/60", children: "Revenue" }) }) }), _jsx(TableHead, { colSpan: 6, className: "w-[780px] h-5 border-b border-border/60 bg-secondary/20" })] }), _jsxs(TableRow, { className: "hover:bg-secondary/40", children: [_jsx(TableHead, { className: "w-[650px] whitespace-nowrap", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Checkbox, { checked: visibleEventIds.length > 0 && selectedVisibleEventCount === visibleEventIds.length, indeterminate: selectedVisibleEventCount > 0 &&
                                                                            selectedVisibleEventCount < visibleEventIds.length, onCheckedChange: (checked) => toggleAllVisibleEvents(visibleEventIds, checked), "aria-label": "Select all visible events" }), _jsxs("button", { type: "button", onClick: () => onSort("event"), className: "group flex items-center gap-1.5 whitespace-nowrap", children: [sortLabelMap.event, sortIconForKey("event")] })] }) }), _jsx(TableHead, { className: "w-[170px] whitespace-nowrap", children: _jsxs("button", { type: "button", onClick: () => onSort("startTime"), className: "group flex items-center gap-1.5 whitespace-nowrap", children: [sortLabelMap.startTime, sortIconForKey("startTime")] }) }), _jsx(TableHead, { className: "w-[150px] whitespace-nowrap", children: "Days on Sale" }), _jsx(TableHead, { className: "w-[150px] whitespace-nowrap", children: _jsxs("button", { type: "button", onClick: () => onSort("daysRemaining"), className: "group flex items-center gap-1.5 whitespace-nowrap", children: [sortLabelMap.daysRemaining, sortIconForKey("daysRemaining")] }) }), _jsx(TableHead, { className: "w-[180px] whitespace-nowrap", children: "Percent Cycle Complete" }), _jsx(TableHead, { className: "w-[250px] whitespace-nowrap border-x border-border/70", children: "Dome Price Range" }), _jsx(TableHead, { className: "w-[90px] whitespace-nowrap text-center border-l border-border/70", children: "Dome" }), _jsx(TableHead, { className: "w-[90px] whitespace-nowrap text-center", children: "Hall" }), _jsx(TableHead, { className: "w-[90px] whitespace-nowrap text-center border-r border-border/70", children: "GA" }), _jsx(TableHead, { className: "w-[100px] whitespace-nowrap text-center border-l border-border/70", children: "Dome" }), _jsx(TableHead, { className: "w-[100px] whitespace-nowrap text-center", children: "Hall" }), _jsx(TableHead, { className: "w-[100px] whitespace-nowrap text-center border-r border-border/70", children: "GA" }), _jsx(TableHead, { className: "w-[170px] whitespace-nowrap border-l border-border/70", children: "Net Ticket Revenue" }), _jsx(TableHead, { className: "w-[170px] whitespace-nowrap border-r border-border/70", children: "Proj. Net Revenue" }), _jsx(TableHead, { className: "w-[140px] whitespace-nowrap", children: "TOF" }), _jsx(TableHead, { className: "w-[190px] whitespace-nowrap", children: "Funnel Entries vs. Expected" }), _jsx(TableHead, { className: "w-[100px] whitespace-nowrap", children: "FCR" }), _jsx(TableHead, { className: "w-[160px] whitespace-nowrap", children: "FCR vs. Expected" }), _jsx(TableHead, { className: "w-[120px] whitespace-nowrap", children: _jsxs("button", { type: "button", onClick: () => onSort("status"), className: "group flex items-center gap-1.5 whitespace-nowrap", children: [sortLabelMap.status, sortIconForKey("status")] }) }), _jsx(TableHead, { className: "w-[70px]" })] })] }), _jsx(TableBody, { children: filteredAndSortedEvents.map((event) => {
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
                                                const domeSellthroughLift = getSellthroughLift(event.soldPct, event.domeProjectedSellthroughPct);
                                                const hallProjectedSellthrough = projectSellthroughMetric(event.hallSoldPct, domeSellthroughLift, 0.85);
                                                const gaSoldPct = getSeatGroupByName(event, "GA")?.soldPct ?? null;
                                                const gaProjectedSellthrough = projectSellthroughMetric(gaSoldPct, domeSellthroughLift, 0.65);
                                                const netTicketRevenueBreakdown = getNetTicketRevenueBreakdown(event);
                                                return (_jsxs(Fragment, { children: [_jsxs(TableRow, { onClick: () => toggleExpanded(event.id), className: cn("cursor-pointer hover:bg-muted/35", event.attention === "underperforming" && "bg-warning/5"), children: [_jsx(TableCell, { children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("button", { type: "button", onClick: (e) => { e.stopPropagation(); toggleExpanded(event.id); }, "aria-label": isExpanded ? "Collapse event details" : "Expand event details", className: cn("flex h-6 w-6 shrink-0 items-center justify-center rounded transition-colors", isExpanded
                                                                                    ? "bg-foreground/8 text-foreground"
                                                                                    : "text-muted-foreground hover:text-foreground"), children: _jsx(ChevronRight, { className: cn("h-3.5 w-3.5 transition-transform duration-150", isExpanded && "rotate-90") }) }), _jsx(Checkbox, { className: "mt-1", checked: selectedEventIds.includes(event.id), onCheckedChange: (checked) => toggleEventSelection(event.id, checked), onClick: (e) => e.stopPropagation(), "aria-label": `Select ${event.event}` }), _jsxs("div", { className: "min-w-0", children: [_jsx("p", { className: "max-w-[540px] whitespace-normal text-base font-medium leading-tight", children: event.event }), _jsxs("div", { className: "mt-0.5 flex flex-wrap items-center gap-1.5", children: [_jsx("p", { className: "text-xs text-muted-foreground", children: event.venueName }), attentionBadge(event.attention), isPendingPublish && (_jsx(Badge, { variant: "secondary", className: "bg-primary/12 text-primary", children: "Pending Publish" }))] })] })] }) }), _jsx(TableCell, { children: _jsxs("div", { children: [_jsx("p", { className: "font-medium text-foreground", children: event.startTimeLabel }), _jsx("p", { className: "text-xs text-muted-foreground", children: event.weekdayLabel })] }) }), _jsx(TableCell, { children: event.daysInMarket ?? "--" }), _jsx(TableCell, { children: event.daysRemaining ?? "--" }), _jsx(TableCell, { children: formatCycleComplete(event.daysInMarket, event.salesWindowDays) }), _jsx(TableCell, { className: "border-x border-border/40 font-semibold", children: domePriceRange }), _jsx(TableCell, { className: cn("text-center border-l border-border/40", event.attention === "underperforming" && "font-semibold text-destructive"), children: formatPercent(event.soldPct) }), _jsx(TableCell, { className: "text-center", children: formatPercent(event.hallSoldPct) }), _jsx(TableCell, { className: "text-center border-r border-border/40", children: formatPercent(gaSoldPct) }), _jsx(TableCell, { className: "text-center border-l border-border/40", children: formatPercent(event.domeProjectedSellthroughPct) }), _jsx(TableCell, { className: "text-center", children: formatPercent(hallProjectedSellthrough) }), _jsx(TableCell, { className: "text-center border-r border-border/40", children: formatPercent(gaProjectedSellthrough) }), _jsx(TableCell, { className: cn("border-l border-border/40 font-semibold", event.attention === "underperforming" && "text-destructive"), children: event.netTicketRevenue === null ? ("--") : (_jsxs("div", { className: "group relative inline-flex", children: [_jsx("span", { tabIndex: 0, className: cn("cursor-help underline decoration-dotted underline-offset-4 transition-colors focus:outline-none", event.attention === "underperforming"
                                                                                    ? "text-destructive hover:text-destructive focus:text-destructive"
                                                                                    : "text-foreground hover:text-primary focus:text-primary"), children: formatCurrency(event.netTicketRevenue) }), _jsxs("div", { className: "pointer-events-none absolute left-1/2 top-full z-20 mt-2 w-[190px] -translate-x-1/2 rounded-lg border border-border/80 bg-card p-3 text-left shadow-xl opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100", children: [_jsx("p", { className: "text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground", children: "Net Ticket Revenue" }), _jsxs("div", { className: "mt-2 space-y-1.5 text-sm", children: [_jsxs("div", { className: "flex items-center justify-between gap-3", children: [_jsx("span", { className: "text-muted-foreground", children: "Group Sales" }), _jsx("span", { children: formatCurrency(netTicketRevenueBreakdown.groupSales) })] }), _jsxs("div", { className: "flex items-center justify-between gap-3", children: [_jsx("span", { className: "text-muted-foreground", children: "Consumer" }), _jsx("span", { children: formatCurrency(netTicketRevenueBreakdown.consumer) })] })] })] })] })) }), _jsx(TableCell, { className: "border-r border-border/40 font-semibold", children: formatCurrency(event.projectedNetRevenue) }), _jsx(TableCell, { children: formatWholeNumber(event.tof) }), _jsx(TableCell, { className: cn("font-semibold", event.funnelEntriesVsExpectedPct === null && "text-muted-foreground", event.funnelEntriesVsExpectedPct !== null &&
                                                                        event.funnelEntriesVsExpectedPct < 0 &&
                                                                        "text-destructive", event.funnelEntriesVsExpectedPct !== null &&
                                                                        event.funnelEntriesVsExpectedPct > 0 &&
                                                                        "text-success"), children: formatSignedPercent(event.funnelEntriesVsExpectedPct) }), _jsx(TableCell, { children: formatPercent(event.fcrPct) }), _jsx(TableCell, { className: cn("font-semibold", event.fcrVsExpectedPct === null && "text-muted-foreground", event.fcrVsExpectedPct !== null &&
                                                                        event.fcrVsExpectedPct < 0 &&
                                                                        "text-destructive", event.fcrVsExpectedPct !== null &&
                                                                        event.fcrVsExpectedPct > 0 &&
                                                                        "text-success"), children: formatSignedPercent(event.fcrVsExpectedPct) }), _jsx(TableCell, { children: event.status === "On Sale" ? (_jsx(Badge, { variant: "secondary", className: "bg-success/15 text-success", children: event.status })) : (_jsx(Badge, { variant: "secondary", className: "bg-muted text-muted-foreground", children: event.status })) }), _jsx(TableCell, { children: _jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsx(Button, { variant: "ghost", size: "icon", className: "h-8 w-8", children: _jsx(MoreHorizontal, { className: "h-4 w-4" }) }) }), _jsxs(DropdownMenuContent, { align: "end", children: [_jsx(DropdownMenuItem, { onSelect: (selectionEvent) => {
                                                                                            selectionEvent.preventDefault();
                                                                                            navigate(`/seatmap/${encodeURIComponent(event.id)}`);
                                                                                        }, children: "View Seatmap" }), _jsx(DropdownMenuItem, { onSelect: (selectionEvent) => {
                                                                                            selectionEvent.preventDefault();
                                                                                            navigate(`/reporting/${encodeURIComponent(event.id)}`);
                                                                                        }, children: "Go to Reporting" })] })] }) })] }), isExpanded && (_jsx(TableRow, { className: "bg-muted/30 hover:bg-muted/30", children: _jsx(TableCell, { colSpan: 20, className: "p-0", children: _jsx("div", { className: "mx-4 my-3 overflow-hidden rounded-lg border border-border/70 bg-card shadow-sm", children: hasSeatGroups ? (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3 border-b border-border/70 bg-secondary/35 px-4 py-3", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-foreground", children: hasSelectedSeatGroups
                                                                                                    ? `${selectedSeatGroupIds.length} seat group${selectedSeatGroupIds.length === 1 ? "" : "s"} selected`
                                                                                                    : "Seat Group Pricing" }), hasSelectedSeatGroups && (_jsxs("p", { className: "text-xs text-muted-foreground", children: [selectedSeatGroupIds.length, " selection", selectedSeatGroupIds.length === 1 ? "" : "s", " checked"] }))] }), hasSelectedSeatGroups && (_jsxs("div", { className: "relative flex items-center gap-1", children: [_jsx(Button, { variant: "ghost", size: "icon", className: "h-8 w-8", onClick: () => setActiveBulkEditEventId((current) => current === event.id ? null : event.id), "aria-label": `Edit ${selectedSeatGroupIds.length} selected seat groups`, children: _jsx(Pencil, { className: "h-4 w-4" }) }), _jsx(Button, { variant: "ghost", size: "icon", className: "h-8 w-8 text-muted-foreground hover:text-destructive", onClick: () => clearSeatGroupSelection(event.id), "aria-label": `Clear ${selectedSeatGroupIds.length} selected seat groups`, children: _jsx(Trash2, { className: "h-4 w-4" }) }), isBulkEditOverlayOpen && (_jsx("div", { className: "absolute right-0 top-full z-20 mt-2 w-[280px] rounded-xl border border-border/80 bg-card p-3 shadow-xl", children: _jsxs("div", { className: "space-y-3", children: [_jsxs(Select, { value: bulkSeatEditField, onValueChange: (next) => {
                                                                                                                setBulkSeatEditFieldByEvent((current) => ({
                                                                                                                    ...current,
                                                                                                                    [event.id]: next,
                                                                                                                }));
                                                                                                                setBulkSeatEditModeByEvent((current) => ({
                                                                                                                    ...current,
                                                                                                                    [event.id]: "set",
                                                                                                                }));
                                                                                                            }, children: [_jsx(SelectTrigger, { className: "h-8 w-full bg-background", children: _jsx(SelectValue, { placeholder: "Field" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "name", children: "Seat Group" }), _jsx(SelectItem, { value: "currentPrice", children: "Current Price" })] })] }), bulkSeatEditField === "currentPrice" && (_jsxs(Select, { value: bulkSeatEditMode, onValueChange: (next) => setBulkSeatEditModeByEvent((current) => ({
                                                                                                                ...current,
                                                                                                                [event.id]: next,
                                                                                                            })), children: [_jsx(SelectTrigger, { className: "h-8 w-full bg-background", children: _jsx(SelectValue, { placeholder: "Mode" }) }), _jsx(SelectContent, { children: numericBulkEditModes.map((mode) => (_jsx(SelectItem, { value: mode.value, children: mode.label }, mode.value))) })] })), _jsx(Input, { type: bulkSeatEditField === "currentPrice" ? "number" : "text", inputMode: bulkSeatEditField === "currentPrice" ? "decimal" : "text", step: bulkSeatEditField === "currentPrice" ? "0.01" : undefined, value: bulkSeatEditValue, onChange: (selectionEvent) => setBulkSeatEditValues((current) => ({
                                                                                                                ...current,
                                                                                                                [event.id]: selectionEvent.target.value,
                                                                                                            })), onKeyDown: (selectionEvent) => {
                                                                                                                if (selectionEvent.key === "Enter") {
                                                                                                                    applyBulkSeatEdit(event.id);
                                                                                                                }
                                                                                                                if (selectionEvent.key === "Escape") {
                                                                                                                    setActiveBulkEditEventId(null);
                                                                                                                }
                                                                                                            }, className: "h-8 w-full bg-background", placeholder: bulkSeatEditField === "name"
                                                                                                                ? "Set name"
                                                                                                                : bulkSeatEditMode === "percent"
                                                                                                                    ? "Increase by %"
                                                                                                                    : bulkSeatEditMode === "flat"
                                                                                                                        ? "Increase by amount"
                                                                                                                        : "Set price", "aria-label": `Bulk edit ${bulkSeatEditField} for ${event.event}` }), _jsxs("div", { className: "flex items-center justify-end gap-2", children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: () => setActiveBulkEditEventId(null), children: "Cancel" }), _jsx(Button, { variant: "secondary", size: "sm", onClick: () => applyBulkSeatEdit(event.id), disabled: bulkSeatEditValue.trim() === "", children: "Apply" })] })] }) }))] }))] }), _jsxs(Table, { className: "min-w-[820px]", children: [_jsx(TableHeader, { className: "bg-secondary/55", children: _jsxs(TableRow, { className: "hover:bg-secondary/55", children: [_jsx(TableHead, { className: "w-[56px] whitespace-nowrap", children: _jsx(Checkbox, { checked: allSeatGroupsSelected, indeterminate: hasSelectedSeatGroups && !allSeatGroupsSelected, onCheckedChange: (checked) => toggleAllSeatGroupsForEvent(event.id, event.seatGroups, checked), "aria-label": `Select all seat groups for ${event.event}` }) }), _jsx(TableHead, { className: "w-[180px] whitespace-nowrap", children: "Seat Group" }), _jsx(TableHead, { className: "w-[150px] whitespace-nowrap", children: "Original Price" }), _jsx(TableHead, { className: "w-[220px] whitespace-nowrap", children: "Current Price" }), _jsx(TableHead, { className: "w-[110px] whitespace-nowrap", children: _jsx(RealtimeColumnLabel, { children: "% Sold" }) }), _jsx(TableHead, { className: "w-[160px] whitespace-nowrap", children: _jsx(RealtimeColumnLabel, { children: "Tickets Remaining" }) }), _jsx(TableHead, { className: "w-[160px] whitespace-nowrap", children: "Proj. Revenue" }), _jsx(TableHead, { className: "w-[120px] whitespace-nowrap", children: "Yield" })] }) }), _jsx(TableBody, { children: event.seatGroups.map((seatGroup) => {
                                                                                            const publishedSeatGroup = publishedEvent?.seatGroups.find((item) => item.id === seatGroup.id);
                                                                                            const isSeatRecommendationDifferent = !arePriceValuesEqual(seatGroup.recTicketPrice, seatGroup.currentPrice);
                                                                                            const seatRecommendationKey = `${event.id}:${seatGroup.id}`;
                                                                                            const isSeatRecommendationUndo = draftSeatRecommendationUndoById[seatRecommendationKey] !== undefined &&
                                                                                                arePriceValuesEqual(seatGroup.recTicketPrice, seatGroup.currentPrice);
                                                                                            const isSeatNameDirty = seatGroup.name !== (publishedSeatGroup?.name ?? seatGroup.name);
                                                                                            const isSeatPriceDirty = seatGroup.currentPrice !==
                                                                                                (publishedSeatGroup?.currentPrice ?? seatGroup.currentPrice);
                                                                                            return (_jsxs(TableRow, { children: [_jsx(TableCell, { children: _jsx(Checkbox, { checked: selectedSeatGroupIds.includes(seatGroup.id), onCheckedChange: (checked) => toggleSeatGroupSelection(event.id, seatGroup.id, checked), "aria-label": `Select ${seatGroup.name}` }) }), _jsx(TableCell, { children: editingSeatCell?.eventId === event.id &&
                                                                                                            editingSeatCell.seatGroupId === seatGroup.id &&
                                                                                                            editingSeatCell.field === "name" ? (_jsx(Input, { type: "text", autoFocus: true, value: editingSeatValue, onChange: (selectionEvent) => setEditingSeatValue(selectionEvent.target.value), onKeyDown: (selectionEvent) => {
                                                                                                                if (selectionEvent.key === "Enter") {
                                                                                                                    commitSeatCellEdit();
                                                                                                                }
                                                                                                                if (selectionEvent.key === "Escape") {
                                                                                                                    cancelSeatPriceEdit();
                                                                                                                }
                                                                                                            }, onBlur: cancelSeatPriceEdit, className: "h-8 w-[150px] bg-background", "aria-label": `Seat group name for ${seatGroup.name}` })) : (_jsx("button", { type: "button", onDoubleClick: () => beginSeatCellEdit(event.id, seatGroup, "name"), className: cn("rounded px-1 text-left font-medium", isSeatNameDirty ? "text-orange-500" : "text-foreground"), "aria-label": `Edit seat group name for ${seatGroup.name}`, children: seatGroup.name })) }), _jsx(TableCell, { children: formatCurrency(seatGroup.originalPrice) }), _jsx(TableCell, { children: _jsxs("div", { className: "flex flex-col items-start gap-1", children: [editingSeatCell?.eventId === event.id &&
                                                                                                                    editingSeatCell.seatGroupId === seatGroup.id &&
                                                                                                                    editingSeatCell.field === "currentPrice" ? (_jsx(Input, { type: "number", inputMode: "decimal", min: "0", step: "0.01", autoFocus: true, value: editingSeatValue, onChange: (selectionEvent) => setEditingSeatValue(selectionEvent.target.value), onKeyDown: (selectionEvent) => {
                                                                                                                        if (selectionEvent.key === "Enter") {
                                                                                                                            commitSeatCellEdit();
                                                                                                                        }
                                                                                                                        if (selectionEvent.key === "Escape") {
                                                                                                                            cancelSeatPriceEdit();
                                                                                                                        }
                                                                                                                    }, onBlur: cancelSeatPriceEdit, className: "h-8 w-[110px] bg-background", "aria-label": `Current price for ${seatGroup.name}` })) : (_jsx("button", { type: "button", onDoubleClick: () => beginSeatCellEdit(event.id, seatGroup, "currentPrice"), className: cn("rounded px-1 text-left font-medium", isSeatPriceDirty ? "text-orange-500" : "text-foreground"), "aria-label": `Edit current price for ${seatGroup.name}`, children: formatCurrency(seatGroup.currentPrice) })), _jsxs("div", { className: "flex items-center gap-1.5 text-xs", children: [_jsx("span", { className: "text-muted-foreground", children: "Rec." }), _jsx("button", { type: "button", onClick: () => isSeatRecommendationUndo
                                                                                                                                ? undoDraftSeatGroupRecommendation(event.id, seatGroup.id)
                                                                                                                                : applyDraftSeatGroupRecommendation(event.id, seatGroup.id, seatGroup.currentPrice, seatGroup.recTicketPrice), disabled: !isSeatRecommendationDifferent && !isSeatRecommendationUndo, className: cn("inline-flex h-6 items-center rounded-full border px-2.5 text-[11px] font-semibold transition", isSeatRecommendationUndo
                                                                                                                                ? "border-warning/50 bg-warning/10 text-warning hover:bg-warning/15"
                                                                                                                                : isSeatRecommendationDifferent
                                                                                                                                    ? "border-primary/40 bg-primary/10 text-primary hover:bg-primary/15"
                                                                                                                                    : "cursor-default border-border/70 bg-secondary/20 text-muted-foreground"), "aria-label": isSeatRecommendationUndo
                                                                                                                                ? `Undo recommended price for ${seatGroup.name}`
                                                                                                                                : `Apply recommended price for ${seatGroup.name}`, children: isSeatRecommendationUndo
                                                                                                                                ? "Undo"
                                                                                                                                : formatCurrency(seatGroup.recTicketPrice) })] })] }) }), _jsx(TableCell, { children: formatPercent(seatGroup.soldPct) }), _jsx(TableCell, { children: seatGroup.ticketsRemaining }), _jsx(TableCell, { children: formatCurrency(seatGroup.projectedRevenue) }), _jsx(TableCell, { children: formatCurrency(seatGroup.yield) })] }, seatGroup.id));
                                                                                        }) })] })] })) : (_jsx("div", { className: "px-4 py-6 text-sm text-muted-foreground", children: "No seat group pricing is available for this event yet." })) }) }) }))] }, event.id));
                                            }) })] }) })] })] }), _jsx(DraftActionFooter, { stagedCount: pendingChanges.total, onDiscard: onDiscardChanges, onPublish: onPublishChanges, extraActionLabel: "Review Recommendations", onExtraAction: openRecommendedReviewModal, extraActionDisabled: recommendedReviewChangeRows.length === 0 })] }));
}

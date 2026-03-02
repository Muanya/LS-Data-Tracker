import type { ActivityName, ReportFilters } from '../../utils/types';

export function fmtDate(dateStr: string): string {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function buildQueryParams(activity: ActivityName, filters: ReportFilters): URLSearchParams {
    const p = new URLSearchParams({ activity });
    if (filters.mode === "single" && filters.singleDate) {
        p.set("dateFrom", filters.singleDate);
        p.set("dateTo", filters.singleDate);
    } else if (filters.mode === "range") {
        if (filters.dateFrom) p.set("dateFrom", filters.dateFrom);
        if (filters.dateTo) p.set("dateTo", filters.dateTo);
    }
    if (activity === "Circle" && filters.group) p.set("group", filters.group);
    return p;
}

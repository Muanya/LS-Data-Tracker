import { useState, useCallback, useRef } from 'react';
import { QuarterReportHeader } from '../components/report/QuarterReportHeader';
import { QuarterReportControls } from '../components/report/QuarterReportControls';
import { QuarterReportTable } from '../components/report/QuarterReportTable';
import { Card } from '../components/ui/Card';
import apiService from '../services/apiService';
import type { QuarterReportData, QuarterReportFilters, Quarter, MonthStats } from '../utils/types';

// Mock data function for preview when no API is available
function mockData(quarter: Quarter, year: number): QuarterReportData {
    const QUARTER_MONTHS: Record<Quarter, [string, string, string]> = {
        Q1: ["January",   "February",  "March"],
        Q2: ["April",     "May",       "June"],
        Q3: ["July",      "August",    "September"],
        Q4: ["October",   "November",  "December"],
    };

    const months = QUARTER_MONTHS[quarter];
    return {
        centre: "LAKESIDE SR",
        quarter,
        year,
        months: months.map((month, i) => ({
            month,
            personsInWork:               17,
            boysInContact:               126,
            boysGoingToSD:               0,
            boysDoctrineAvg:             [4, 5, 3][i],
            catechismBreakdown:          "Lakeside – 3\nKC – 25\nFSTC – 10",
            numCircles:                  4,
            boysAttendingCircles:        [12, 12, 13][i],
            numProfClasses:              [0, 0, 1][i],
            boysAttendingProfClasses:    [0, 0, 1][i],
            boysVisitedPoor:             0,
            boysTeachingCatechism:       0,
            numMeditations:              0,
            boysAttendingMeditationsAvg: 0,
            numMonthlyRetreats:          1,
            boysMonthlyRetreats:         [10, 9, 15][i],
            numLongRetreats:             [0, 1, 1][i],
            boysLongRetreats:            [0, 1, 6][i],
            boysAttendedCV:              [0, 2, 0][i],
            totalSRBoys:                 24,
        })),
    };
}

// Print styles for export
const PRINT_STYLES = `
@media print {
  body * { visibility: hidden !important; }
  #report-print-area, #report-print-area * { visibility: visible !important; }
  #report-print-area {
    position: fixed !important;
    top: 0 !important; left: 0 !important;
    width: 100% !important;
    background: white !important;
    padding: 24px !important;
  }
  .no-print { display: none !important; }
}
`;

export default function QuarterReport() {
    const [filters, setFilters] = useState<QuarterReportFilters>({
        centre: "LAKESIDE SR",
        quarter: "Q4",
        year: 2024,
        useMock: true,
    });
    
    const [data, setData] = useState<QuarterReportData | null>(mockData("Q4", 2024));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const printRef = useRef<HTMLDivElement>(null);

    // Fetch quarter report data
    const fetchReport = useCallback(async () => {
        if (filters.useMock) {
            setData(mockData(filters.quarter, filters.year));
            return;
        }

        setLoading(true);
        setError("");
        try {
            const reportData = await apiService.getQuarterReport(
                filters.quarter, 
                filters.year, 
                filters.centre
            );
            setData(reportData);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Failed to fetch report.");
            setData(null);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    // Handle print/export
    const handlePrint = () => {
        // Inject print styles
        let style = document.getElementById("__print_styles__") as HTMLStyleElement | null;
        if (!style) {
            style = document.createElement("style");
            style.id = "__print_styles__";
            document.head.appendChild(style);
        }
        style.textContent = PRINT_STYLES;
        window.print();
    };

    // Handle CSV export
    const handleCSV = () => {
        if (!data) return;

        const ROWS = [
            { num: 1,  label: "Number of persons in the work of sr Apostolate",                              key: "personsInWork" as keyof MonthStats },
            { num: 2,  label: "Number of boys in contact",                                                    key: "boysInContact" as keyof MonthStats },
            { num: 3,  label: "Number of boys going regularly (every 2 weeks at least) to spiritual direction with sacd of the work", key: "boysGoingToSD" as keyof MonthStats },
            { num: 4,  label: "Number of boys that attend classes of doctrine and human formation (average per week)", key: "boysDoctrineAvg" as keyof MonthStats },
            { num: 5,  label: "Number of boys that attend catechism classes",                                key: "catechismBreakdown" as keyof MonthStats },
            { num: 6,  label: "Number of circles (prep classes)",                                            key: "numCircles" as keyof MonthStats },
            { num: 7,  label: "Number of boys attending circles",                                             key: "boysAttendingCircles" as keyof MonthStats },
            { num: 8,  label: "Number of professional classes",                                              key: "numProfClasses" as keyof MonthStats },
            { num: 9,  label: "Number of boys attending professional classes",                               key: "boysAttendingProfClasses" as keyof MonthStats },
            { num: 10, label: "Number of boys that have visited the poor of our lady",                      key: "boysVisitedPoor" as keyof MonthStats },
            { num: 11, label: "Number of boys teaching catechism",                                           key: "boysTeachingCatechism" as keyof MonthStats },
            { num: 12, label: "Number of meditations held",                                                  key: "numMeditations" as keyof MonthStats },
            { num: 13, label: "Number of boys attending meditations (average per week)",                    key: "boysAttendingMeditationsAvg" as keyof MonthStats },
            { num: 14, label: "Number of Monthly retreats",                                                  key: "numMonthlyRetreats" as keyof MonthStats },
            { num: 15, label: "Boys attending monthly retreats (Total for the month)",                      key: "boysMonthlyRetreats" as keyof MonthStats },
            { num: 16, label: "Number of Long retreats",                                                     key: "numLongRetreats" as keyof MonthStats },
            { num: 17, label: "Boys that have attended long retreats",                                       key: "boysLongRetreats" as keyof MonthStats },
            { num: 18, label: "Boys that have attended cv",                                                  key: "boysAttendedCV" as keyof MonthStats },
            { num: 19, label: "Total number of sr boys",                                                     key: "totalSRBoys" as keyof MonthStats },
        ];

        const months = data.months;
        const header = ["#", "Metric", ...months.map(m => m.month)].join(",");
        const rows = ROWS.map(row => {
            const vals = months.map(m => {
                const v = m[row.key];
                const str = String(v).replace(/\n/g, " | ").replace(/,/g, ";");
                return `"${str}"`;
            });
            return [`${row.num}`, `"${row.label}"`, ...vals].join(",");
        });
        const csv = [header, ...rows].join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${data.centre.replace(/\s/g, "_")}_${data.quarter}_${data.year}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="min-h-screen bg-gray-50 font-['Outfit',_sans-serif] text-gray-900">
            <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Crimson+Pro:wght@400;600;700&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet" />

            {/* Ambient glow */}
            <div 
                className="fixed inset-0 pointer-events-none z-0 transition-all duration-500"
                style={{
                    background: "radial-gradient(ellipse 60% 40% at 50% 0%, #3b82f618 0%, transparent 70%)",
                }}
            />

            <div className="relative z-10">
                {/* Header */}
                <QuarterReportHeader 
                    data={data} 
                    onExportCSV={handleCSV} 
                    onPrint={handlePrint} 
                />

                <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-4 sm:gap-6">
                    {/* Controls */}
                    <QuarterReportControls
                        filters={filters}
                        onFiltersChange={setFilters}
                        onGenerate={fetchReport}
                        loading={loading}
                        onExportCSV={handleCSV}
                        onPrint={handlePrint}
                        hasData={!!data}
                    />

                    {/* Error */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 text-red-700 text-sm">
                            ⚠️ {error}
                        </div>
                    )}

                    {/* Report Table */}
                    {data && (
                        <Card className="p-0 overflow-hidden">
                            {/* Screen header bar */}
                            <div className="no-print px-4 sm:px-6 py-3.5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between bg-gray-50 gap-3 sm:gap-0">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-2 h-2 rounded-full bg-green-500" />
                                    <span className="text-xs font-bold text-gray-600">
                                        {data.centre} — {data.quarter} {data.year}
                                    </span>
                                </div>
                                <span className="text-xs text-gray-500">
                                    {data.months.length} months · 19 metrics
                                </span>
                            </div>

                            {/* Printable area */}
                            <div id="report-print-area" ref={printRef} className="p-4 sm:p-7">
                                <QuarterReportTable data={data} />
                            </div>
                        </Card>
                    )}

                    {/* Empty state */}
                    {!data && !loading && !error && (
                        <Card className="text-center py-12 sm:py-16">
                            <div className="text-4xl sm:text-5xl mb-4">📋</div>
                            <div className="font-bold text-base sm:text-lg text-gray-700 mb-2">
                                Configure and generate your report
                            </div>
                            <div className="text-sm text-gray-600 px-4">
                                Select centre, quarter, and year to generate a Form E6 quarterly report
                            </div>
                        </Card>
                    )}
                </main>
            </div>
        </div>
    );
}

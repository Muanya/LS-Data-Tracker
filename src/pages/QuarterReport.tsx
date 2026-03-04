import { useState, useCallback, useRef, useMemo } from 'react';
import Header from '../components/Header';
import { QuarterReportControls } from '../components/report/QuarterReportControls';
import { QuarterReportTable, ALL_ROWS, DEFAULT_VISIBLE_ROWS, type RowConfig } from '../components/report/QuarterReportTable';
import { Card } from '../components/ui/Card';
import apiService from '../services/apiService';
import type { QuarterReportData, QuarterReportFilters, MonthStats, QuarterReportBackendConfig } from '../utils/types';

// Print styles for export
const PRINT_STYLES = `
@media print {
  body * { visibility: hidden !important; }
  #report-print-area, #report-print-area * { visibility: visible !important; }
  #report-print-area {
    position: absolute !important;
    top: 0 !important; left: 0 !important;
    width: 100% !important;
    background: white !important;
    padding: 24px !important;
    page-break-inside: avoid !important;
  }
  .no-print { display: none !important; }
}
`;

export default function QuarterReport() {
    const [filters, setFilters] = useState<QuarterReportFilters>({
        centre: "LAKESIDE SR",
        quarter: "Q1",
        year: 2026,
    });
    
    const [data, setData] = useState<QuarterReportData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [editedData, setEditedData] = useState<QuarterReportData | null>(null);
    const [showConfig, setShowConfig] = useState(false);
    const [rowConfig, setRowConfig] = useState<RowConfig>({ visibleRows: DEFAULT_VISIBLE_ROWS });
    const [backendConfig, setBackendConfig] = useState<QuarterReportBackendConfig | null>(null);

    // Toggle row visibility
    const toggleRow = (key: keyof MonthStats) => {
        setRowConfig(prev => {
            const isVisible = prev.visibleRows.includes(key);
            const newVisibleRows = isVisible
                ? prev.visibleRows.filter(k => k !== key)
                : [...prev.visibleRows, key];
            return { ...prev, visibleRows: newVisibleRows };
        });
    };

    // Select all rows
    const selectAllRows = () => {
        setRowConfig(prev => ({ ...prev, visibleRows: ALL_ROWS.map(r => r.key) }));
    };

    // Reset to defaults
    const resetRows = () => {
        setRowConfig({ visibleRows: DEFAULT_VISIBLE_ROWS });
    };

    const printRef = useRef<HTMLDivElement>(null);

    // Get available rows - from backend config or fallback to ALL_ROWS
    const availableRows = useMemo(() => {
        if (backendConfig?.fields && backendConfig.fields.length > 0) {
            return backendConfig.fields
                .sort((a, b) => a.displayOrder - b.displayOrder)
                .map((field, idx) => ({
                    num: idx + 1,
                    label: field.label,
                    key: field.key as keyof MonthStats,
                }));
        }
        return ALL_ROWS;
    }, [backendConfig]);

    // Get current visible rows for CSV export
    const currentRows = useMemo(() => {
        return availableRows.filter(row => rowConfig.visibleRows.includes(row.key));
    }, [availableRows, rowConfig.visibleRows]);

    // Fetch quarter report data
    const fetchReport = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            // Fetch both report data and config
            const [reportData, configData] = await Promise.all([
                apiService.getQuarterReport(
                    filters.quarter, 
                    filters.year, 
                    filters.centre
                ),
                apiService.getQuarterReportConfig?.() ?? Promise.resolve(null),
            ]);
            setData(reportData);
            
            // If backend returns config, use it
            if (configData) {
                setBackendConfig(configData);
                // Initialize visible rows with backend defaults
                const defaultVisible = configData.fields
                    .filter((f: { isVisibleByDefault: boolean }) => f.isVisibleByDefault)
                    .map((f: { key: string }) => f.key as keyof MonthStats);
                setRowConfig(prev => ({ ...prev, visibleRows: defaultVisible, backendConfig: configData }));
            }
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
        const exportData = editedData || data;
        if (!exportData) return;

        const months = exportData.months;
        const header = ["#", "Metric", ...months.map(m => m.month)].join(",");
        const rows = currentRows.map((row, idx) => {
            const vals = months.map(m => {
                const v = m[row.key];
                const str = String(v).replace(/\n/g, " | ").replace(/,/g, ";");
                return `"${str}"`;
            });
            return [`${idx + 1}`, `"${row.label}"`, ...vals].join(",");
        });
        const csv = [header, ...rows].join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${exportData.centre.replace(/\s/g, "_")}_${exportData.quarter}_${exportData.year}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // Callback to receive edited data from table
    const handleDataChange = (newData: QuarterReportData) => {
        setEditedData(newData);
    };

    return (
        <div className="min-h-screen bg-gray-50 font-['Outfit',_sans-serif] text-gray-900">
            <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Crimson+Pro:wght@400;600;700&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet" />

            {/* Header */}
            <Header 
                title="Quarter Report"
                subtitle="Form E6 Generator"
            >
                {/* Export buttons - only show when data exists */}
                {data && (
                    <div className="flex gap-2 sm:gap-3">
                        <button
                            onClick={handleCSV}
                            className="px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl border border-green-600/40 bg-green-50 text-green-700 font-bold text-xs sm:text-sm cursor-pointer font-inherit transition-all duration-200 hover:bg-green-100 hover:border-green-600/60 whitespace-nowrap"
                        >
                            ⬇ Export CSV
                        </button>
                        <button
                            onClick={handlePrint}
                            className="px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl border border-blue-600/40 bg-blue-50 text-blue-700 font-bold text-xs sm:text-sm cursor-pointer font-inherit transition-all duration-200 hover:bg-blue-100 hover:border-blue-600/60 whitespace-nowrap"
                        >
                            🖨 Print / PDF
                        </button>
                    </div>
                )}
            </Header>

            {/* Ambient glow */}
            <div 
                className="fixed inset-0 pointer-events-none z-0 transition-all duration-500"
                style={{
                    background: "radial-gradient(ellipse 60% 40% at 50% 0%, #3b82f618 0%, transparent 70%)",
                }}
            />

            <div className="relative z-10">
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
                                    {data.months.length} months · {currentRows.length} metrics
                                </span>
                                <button
                                    onClick={() => setShowConfig(!showConfig)}
                                    className="ml-3 px-2 py-1 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                                >
                                    ⚙️ Configure
                                </button>
                            </div>

                            {/* Printable area */}
                            <div id="report-print-area" ref={printRef} className="p-4 sm:p-7">
                                <QuarterReportTable data={data} onDataChange={handleDataChange} rowConfig={rowConfig} />
                            </div>
                                                        {/* Configuration Panel */}
                            {showConfig && (
                                <div className="no-print border-t border-gray-100 bg-gray-50 p-4 sm:p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-sm font-bold text-gray-700">Report Configuration</h3>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={selectAllRows}
                                                className="px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                            >
                                                Select All
                                            </button>
                                            <button
                                                onClick={resetRows}
                                                className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded transition-colors"
                                            >
                                                Reset
                                            </button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                                        {availableRows.map((row) => (
                                            <label
                                                key={String(row.key)}
                                                className="flex items-start gap-2 p-2 rounded-lg hover:bg-white cursor-pointer transition-colors"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={rowConfig.visibleRows.includes(row.key)}
                                                    onChange={() => toggleRow(row.key)}
                                                    className="mt-0.5 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <span className="text-xs text-gray-600 leading-tight">
                                                    {row.label}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                    {backendConfig && (
                                        <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
                                            Config version: {backendConfig.version} • Last updated: {new Date(backendConfig.lastUpdated).toLocaleDateString()}
                                        </div>
                                    )}
                                </div>
                            )}
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

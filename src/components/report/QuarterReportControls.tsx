import React from 'react';
import { Button } from '../ui/Button';
import type { QuarterReportFilters, Quarter } from '../../utils/types';

interface QuarterReportControlsProps {
    filters: QuarterReportFilters;
    onFiltersChange: (filters: QuarterReportFilters) => void;
    onGenerate: () => void;
    loading: boolean;
    onExportCSV: () => void;
    onPrint: () => void;
    hasData: boolean;
}

const QUARTER_MONTHS: Record<Quarter, [string, string, string]> = {
    Q1: ["January",   "February",  "March"],
    Q2: ["April",     "May",       "June"],
    Q3: ["July",      "August",    "September"],
    Q4: ["October",   "November",  "December"],
};

export const QuarterReportControls: React.FC<QuarterReportControlsProps> = ({
    filters,
    onFiltersChange,
    onGenerate,
    loading,
    onExportCSV,
    onPrint,
    hasData
}) => {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

    const handleFilterChange = (key: keyof QuarterReportFilters, value: any) => {
        onFiltersChange({ ...filters, [key]: value });
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 shadow-soft">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
                {/* Centre */}
                <div className="flex flex-col w-full lg:w-auto">
                    <label className="text-xs font-bold text-gray-600 tracking-widest uppercase mb-2 block">
                        Centre Name
                    </label>
                    <input
                        value={filters.centre}
                        onChange={e => handleFilterChange('centre', e.target.value)}
                        className="px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm font-medium outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 w-full lg:min-w-[140px]"
                        placeholder="e.g. LAKESIDE SR"
                    />
                </div>

                {/* Year */}
                <div className="flex flex-col w-full lg:w-auto">
                    <label className="text-xs font-bold text-gray-600 tracking-widest uppercase mb-2 block">
                        Year
                    </label>
                    <select 
                        value={filters.year} 
                        onChange={e => handleFilterChange('year', Number(e.target.value))} 
                        className="px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm font-medium outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 w-full lg:min-w-[140px]"
                    >
                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                </div>

                {/* Quarter */}
                <div className="flex flex-col w-full lg:w-auto">
                    <label className="text-xs font-bold text-gray-600 tracking-widest uppercase mb-2 block">
                        Quarter
                    </label>
                    <div className="flex rounded-xl overflow-hidden border border-gray-200 bg-white">
                        {(["Q1", "Q2", "Q3", "Q4"] as Quarter[]).map(q => (
                            <button 
                                key={q} 
                                onClick={() => handleFilterChange('quarter', q)} 
                                className={`flex-1 px-3 sm:px-4 py-2.5 border-none font-bold text-sm cursor-pointer font-inherit transition-all duration-200 ${
                                    filters.quarter === q 
                                        ? "bg-primary-600 text-white" 
                                        : "bg-transparent text-gray-600 hover:bg-gray-50"
                                }`}
                                style={{
                                    borderRight: q !== "Q4" ? "1px solid #e5e7eb" : "none",
                                }}
                            >
                                {q}
                            </button>
                        ))}
                    </div>
                </div>

                <Button
                    onClick={onGenerate}
                    disabled={loading}
                    loading={loading}
                    className="w-full lg:w-auto px-7 py-2.5 font-extrabold tracking-wide bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg hover:shadow-xl active:scale-95"
                >
                    {loading ? "Loading..." : "📋 Generate Report"}
                </Button>
            </div>

            {/* Quarter month preview */}
            <div className="mt-4 flex flex-wrap gap-2">
                {QUARTER_MONTHS[filters.quarter].map(m => (
                    <span 
                        key={m} 
                        className="px-3 py-1.5 rounded-lg bg-primary-50 text-primary-700 text-xs font-bold border border-primary-200"
                    >
                        {m}
                    </span>
                ))}
            </div>

            {/* Export buttons */}
            {hasData && (
                <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
                    <Button
                        onClick={onExportCSV}
                        variant="secondary"
                        className="w-full sm:w-auto px-5 py-2 text-sm"
                    >
                        ⬇ Export CSV
                    </Button>
                    <Button
                        onClick={onPrint}
                        variant="secondary"
                        className="w-full sm:w-auto px-5 py-2 text-sm"
                    >
                        🖨 Print / PDF
                    </Button>
                </div>
            )}
        </div>
    );
};

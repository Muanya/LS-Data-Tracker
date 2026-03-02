import type { FC } from 'react';
import type { ReportFilters, FilterMode } from '../../utils/types';

interface FilterBarProps {
    isCircle: boolean;
    filters: ReportFilters;
    onChange: (f: ReportFilters) => void;
    groups: string[];
    accent: string;
}

const FilterBar: FC<FilterBarProps> = ({ isCircle, filters, onChange, groups, accent }) => {
    const resetDates = (mode: FilterMode): ReportFilters => ({
        ...filters, mode, singleDate: "", dateFrom: "", dateTo: "",
    });

    return (
        <div className="flex flex-wrap gap-3.5 items-end">
            {/* Mode toggle */}
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Filter Mode
                </label>
                <div className="flex rounded-lg overflow-hidden border border-gray-200">
                    {(["single", "range"] as FilterMode[]).map(m => (
                        <button 
                            key={m} 
                            onClick={() => onChange(resetDates(m))} 
                            className={`px-4 py-2 border-none font-bold text-xs cursor-pointer capitalize font-inherit transition-all duration-150 ${
                                filters.mode === m 
                                    ? `bg-[${accent}]/20 text-[${accent}]` 
                                    : "bg-white text-gray-600 hover:bg-gray-50"
                            }`}
                            style={{
                                background: filters.mode === m ? `${accent}20` : "#ffffff",
                                color: filters.mode === m ? accent : "#4b5563",
                            }}
                        >
                            {m === "single" ? "Single Day" : "Date Range"}
                        </button>
                    ))}
                </div>
            </div>

            {/* Date inputs */}
            {filters.mode === "single" ? (
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Date
                    </label>
                    <input
                        type="date"
                        value={filters.singleDate}
                        onChange={e => onChange({ ...filters, singleDate: e.target.value })}
                        className="px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm font-inherit outline-none min-w-[140px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            ) : (
                <>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                            From
                        </label>
                        <input 
                            type="date" 
                            value={filters.dateFrom}
                            onChange={e => onChange({ ...filters, dateFrom: e.target.value })} 
                            className="px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm font-inherit outline-none min-w-[140px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                            To
                        </label>
                        <input 
                            type="date" 
                            value={filters.dateTo}
                            onChange={e => onChange({ ...filters, dateTo: e.target.value })} 
                            className="px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm font-inherit outline-none min-w-[140px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </>
            )}

            {/* Group filter (Circle only) */}
            {isCircle && (
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Group
                    </label>
                    <select 
                        value={filters.group} 
                        onChange={e => onChange({ ...filters, group: e.target.value })} 
                        className="px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm font-inherit outline-none min-w-[140px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">All Groups</option>
                        {groups.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                </div>
            )}
        </div>
    );
};

export default FilterBar;

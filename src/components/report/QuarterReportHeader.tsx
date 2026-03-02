import React from 'react';
import type { QuarterReportData } from '../../utils/types';

interface QuarterReportHeaderProps {
    data?: QuarterReportData | null;
    onExportCSV: () => void;
    onPrint: () => void;
}

export const QuarterReportHeader: React.FC<QuarterReportHeaderProps> = ({ 
    data, 
    onExportCSV, 
    onPrint 
}) => {
    return (
        <header className="border-b border-gray-200 bg-white/80 backdrop-blur-3xl sticky top-0 z-100">
            <div className="px-4 sm:px-6 lg:px-10 py-4 sm:py-5 flex items-center justify-between">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <div 
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-sm sm:text-lg shadow-lg flex-shrink-0"
                        style={{
                            background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                            boxShadow: "0 0 20px #3b82f660",
                        }}
                    >
                        📊
                    </div>
                    <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-bold text-gray-600 tracking-widest uppercase">
                            Statistics Report
                        </div>
                        <div className="text-base sm:text-xl font-extrabold text-gray-900 tracking-tight truncate">
                            Form E6 Generator
                        </div>
                    </div>
                </div>

                {/* Export buttons - only show when data exists */}
                {data && (
                    <div className="flex gap-2 sm:gap-3">
                        <button
                            onClick={onExportCSV}
                            className="px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl border border-green-600/40 bg-green-50 text-green-700 font-bold text-xs sm:text-sm cursor-pointer font-inherit transition-all duration-200 hover:bg-green-100 hover:border-green-600/60 whitespace-nowrap"
                        >
                            ⬇ Export CSV
                        </button>
                        <button
                            onClick={onPrint}
                            className="px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl border border-blue-600/40 bg-blue-50 text-blue-700 font-bold text-xs sm:text-sm cursor-pointer font-inherit transition-all duration-200 hover:bg-blue-100 hover:border-blue-600/60 whitespace-nowrap"
                        >
                            🖨 Print / PDF
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

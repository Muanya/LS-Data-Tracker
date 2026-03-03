import { useState, useEffect } from 'react';
import type { FC } from 'react';
import type { AttendeeRow } from '../../utils/types';

interface AttendeeTableProps {
    rows: AttendeeRow[];
    isCircle: boolean;
    accent: string;
}

const PER_PAGE = 20;

const AttendeeTable: FC<AttendeeTableProps> = ({ rows, isCircle, accent }) => {
    const [page, setPage] = useState(0);
    useEffect(() => setPage(0), [rows]);

    if (!rows.length) return (
        <div className="text-center py-15 text-gray-600">
            <div className="text-5xl mb-3">🔍</div>
            <p className="font-semibold">No records found for this filter.</p>
        </div>
    );

    const totalPages = Math.ceil(rows.length / PER_PAGE);
    const paged = rows.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

    return (
        <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 font-semibold">
                    {rows.length} record{rows.length !== 1 ? "s" : ""}
                </span>
                {totalPages > 1 && (
                    <div className="flex gap-2 items-center">
                        <button 
                            onClick={() => setPage(p => Math.max(0, p - 1))} 
                            disabled={page === 0} 
                            className="px-3.5 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 text-xs font-bold cursor-pointer font-inherit disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            ← Prev
                        </button>
                        <span className="text-xs text-gray-400 font-semibold">
                            {page + 1} / {totalPages}
                        </span>
                        <button 
                            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} 
                            disabled={page === totalPages - 1} 
                            className="px-3.5 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 text-xs font-bold cursor-pointer font-inherit disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            Next →
                        </button>
                    </div>
                )}
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full border-collapse text-sm">
                    <thead>
                        <tr className="bg-gray-50">
                            {["#", "Attendee ID", "Name", ...(isCircle ? ["Group"] : []), "Date"].map(h => (
                                <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b border-gray-200">
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paged.map((r, i) => (
                            <tr 
                                key={String(r.id) + i} 
                                className={i % 2 === 0 ? "bg-transparent" : "bg-gray-50 transition-background duration-100"}
                            >
                                <td className="px-4 py-2.5 border-b border-gray-100">
                                    <span className="text-xs text-gray-500">{page * PER_PAGE + i + 1}</span>
                                </td>
                                <td className="px-4 py-2.5 border-b border-gray-100">
                                    <code className="text-xs text-gray-600">{r.attendeeId}</code>
                                </td>
                                <td className="px-4 py-2.5 border-b border-gray-100 font-bold text-gray-900">
                                    {r.attendeeName}
                                </td>
                                {isCircle && (
                                    <td className="px-4 py-2.5 border-b border-gray-100">
                                        <span 
                                            className="rounded-md px-2.5 py-0.5 text-xs font-bold"
                                            style={{
                                                backgroundColor: `${accent}25`, 
                                                color: accent,
                                            }}
                                        >
                                            {r.groupName || "—"}
                                        </span>
                                    </td>
                                )}
                                <td className="px-4 py-2.5 border-b border-gray-100 text-gray-600">
                                    {new Date(r.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AttendeeTable;

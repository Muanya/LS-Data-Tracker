import type { FC } from 'react';
import StatCard from './StatCard';
import type { AttendeeRow, AttendanceRecord, Activity } from '../../utils/types';

interface StatsPanelProps {
    rows: AttendeeRow[];
    allData: AttendanceRecord[];
    isCircle: boolean;
    accent: string;
    activities: Activity[];
}

const StatsPanel: FC<StatsPanelProps> = ({ rows, allData, isCircle, accent, activities }) => {
    if (!allData.length) return (
        <div className="text-center py-10 text-gray-600">No data to analyse.</div>
    );

    // Calculate statistics across all activities
    const total = allData.length;
    const uniqueAttendees = new Set(allData.map(r => r.attendeeId)).size;

    const perDate: Record<string, number> = {};
    allData.forEach(r => { const d = r.date.split("T")[0]; perDate[d] = (perDate[d] || 0) + 1; });
    const dates = Object.keys(perDate);
    const avgPerDay = dates.length ? (total / dates.length).toFixed(1) : "—";
    const maxDay = dates.length ? Math.max(...Object.values(perDate)) : 0;
    const minDay = dates.length ? Math.min(...Object.values(perDate)) : "—";

    const freq: Record<string, number> = {};
    allData.forEach(r => { freq[r.attendeeId] = (freq[r.attendeeId] || 0) + 1; });
    const mostFrequent = Object.keys(freq).length ? Math.max(...Object.values(freq)) : "—";
    const returnees = Object.values(freq).filter(c => c > 1).length;

    // Per-activity statistics
    const perActivity: Record<string, number> = {};
    allData.forEach(r => { perActivity[r.activity] = (perActivity[r.activity] || 0) + 1; });

    // Per-group statistics (Circle only)
    const perGroup: Record<string, number> = {};
    if (isCircle) {
        allData.forEach(r => {
            const g = r.groupName || "Unknown";
            perGroup[g] = (perGroup[g] || 0) + 1;
        });
    }

    const sortedDates = [...dates].sort();

    return (
        <div className="flex flex-col gap-7">
            {/* Stat cards grid */}
            <div>
                <h3 className="text-base font-extrabold text-gray-900 mb-3.5">📊 Summary</h3>
                <div className="flex flex-wrap gap-3">
                    <StatCard label="Total Records" value={total} accent={accent} icon="📋" />
                    <StatCard label="Unique Attendees" value={uniqueAttendees} accent="#38bdf8" icon="👥" />
                    <StatCard label="Sessions" value={dates.length} accent="#818cf8" icon="📅" />
                    <StatCard label="Avg / Session" value={avgPerDay} accent="#34d399" icon="📈" />
                    <StatCard label="Peak Session" value={maxDay} accent="#fbbf24" icon="🔥" />
                    <StatCard label="Lowest Session" value={minDay} accent="#f87171" icon="📉" />
                    <StatCard label="Max Repeats" value={mostFrequent} accent="#e879f9" icon="🔁" />
                    <StatCard label="Returnees" value={returnees} accent="#fb923c" icon="↩️" />
                </div>
            </div>

            {/* Per-activity statistics */}
            <div>
                <h3 className="text-base font-extrabold text-gray-900 mb-3.5">🎯 Attendance by Activity</h3>
                <div className="overflow-x-auto rounded-xl border border-gray-200">
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr className="bg-gray-50">
                                {["Activity", "Records", "% of Total", "Bar"].map(h => (
                                    <th key={h} className="px-4 py-2.5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b border-gray-200">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(perActivity).sort((a, b) => b[1] - a[1]).map(([activityName, count], i) => {
                                const pct = ((count / total) * 100).toFixed(1);
                                const barW = ((count / Math.max(...Object.values(perActivity))) * 100).toFixed(0);
                                const activityAccent = activities.find(a => a.id === activityName)?.color || "#818cf8";
                                return (
                                    <tr key={activityName} className={i % 2 === 0 ? "bg-transparent" : "bg-gray-50"}>
                                        <td className="px-4 py-2.5 border-b border-gray-100">
                                            <span
                                                className="rounded-md px-2.5 py-0.5 text-xs font-bold"
                                                style={{
                                                    backgroundColor: `${activityAccent}25`,
                                                    color: activityAccent,
                                                }}
                                            >
                                                {activityName}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2.5 border-b border-gray-100 font-bold text-gray-900">{count}</td>
                                        <td className="px-4 py-2.5 border-b border-gray-100 text-gray-600">{pct}%</td>
                                        <td className="px-4 py-2.5 border-b border-gray-100">
                                            <div className="bg-gray-100 rounded h-2 w-35">
                                                <div
                                                    className="rounded h-2 transition-all duration-400"
                                                    style={{
                                                        backgroundColor: activityAccent,
                                                        width: `${barW}%`,
                                                    }}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Per-date table */}
            {sortedDates.length > 0 && (
                <div>
                    <h3 className="text-base font-extrabold text-gray-900 mb-3.5">📅 Attendance by Date</h3>
                    <div className="overflow-x-auto rounded-xl border border-gray-200">
                        <table className="w-full border-collapse text-sm">
                            <thead>
                                <tr className="bg-gray-50">
                                    {["Date", "Count", "% of Total", "Bar"].map(h => (
                                        <th key={h} className="px-4 py-2.5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b border-gray-200">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {sortedDates.map((d, i) => {
                                    const c = perDate[d];
                                    const pct = ((c / total) * 100).toFixed(1);
                                    const barW = ((c / maxDay) * 100).toFixed(0);
                                    return (
                                        <tr key={d} className={i % 2 === 0 ? "bg-transparent" : "bg-gray-50"}>
                                            <td className="px-4 py-2.5 border-b border-gray-100">
                                                {new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                            </td>
                                            <td className="px-4 py-2.5 border-b border-gray-100 font-bold text-gray-900">{c}</td>
                                            <td className="px-4 py-2.5 border-b border-gray-100 text-gray-600">{pct}%</td>
                                            <td className="px-4 py-2.5 border-b border-gray-100">
                                                <div className="bg-gray-100 rounded h-2 w-35">
                                                    <div
                                                        className="rounded h-2 transition-all duration-400"
                                                        style={{
                                                            backgroundColor: accent,
                                                            width: `${barW}%`,
                                                        }}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Per-group table (Circle only) */}
            {isCircle && Object.keys(perGroup).length > 0 && (
                <div>
                    <h3 className="text-base font-extrabold text-gray-900 mb-3.5">🔵 Attendance by Group</h3>
                    <div className="overflow-x-auto rounded-xl border border-gray-200">
                        <table className="w-full border-collapse text-sm">
                            <thead>
                                <tr className="bg-gray-50">
                                    {["Group", "Records", "% of Total", "Bar"].map(h => (
                                        <th key={h} className="px-4 py-2.5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b border-gray-200">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(perGroup).sort((a, b) => b[1] - a[1]).map(([g, c], i) => {
                                    const pct = ((c / total) * 100).toFixed(1);
                                    const maxG = Math.max(...Object.values(perGroup));
                                    const barW = ((c / maxG) * 100).toFixed(0);
                                    return (
                                        <tr key={g} className={i % 2 === 0 ? "bg-transparent" : "bg-gray-50"}>
                                            <td className="px-4 py-2.5 border-b border-gray-100">
                                                <span
                                                    className="rounded-md px-2.5 py-0.5 text-xs font-bold"
                                                    style={{
                                                        backgroundColor: `${accent}25`,
                                                        color: accent,
                                                    }}
                                                >
                                                    {g}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2.5 border-b border-gray-100 font-bold text-gray-900">{c}</td>
                                            <td className="px-4 py-2.5 border-b border-gray-100 text-gray-600">{pct}%</td>
                                            <td className="px-4 py-2.5 border-b border-gray-100">
                                                <div className="bg-gray-100 rounded h-2 w-35">
                                                    <div
                                                        className="rounded h-2 transition-all duration-400"
                                                        style={{
                                                            backgroundColor: accent,
                                                            width: `${barW}%`,
                                                        }}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Top attendees */}
            <div>
                <h3 className="text-base font-extrabold text-gray-900 mb-3.5">🏅 Top Attendees</h3>
                <div className="overflow-x-auto rounded-xl border border-gray-200">
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr className="bg-gray-50">
                                {["Rank", "Name", "Attendee ID", "Sessions"].map(h => (
                                    <th key={h} className="px-4 py-2.5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b border-gray-200">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(freq)
                                .sort((a, b) => b[1] - a[1])
                                .slice(0, 10)
                                .map(([id, count], i) => {
                                    const name = rows.find(r => r.attendeeId === id)?.attendeeName || "Unknown";
                                    return (
                                        <tr key={id} className={i % 2 === 0 ? "bg-transparent" : "bg-gray-50"}>
                                            <td className="px-4 py-2.5 border-b border-gray-100">
                                                <span className="text-base" style={{ opacity: i < 3 ? 1 : 0.4 }}>
                                                    {["🥇", "🥈", "🥉"][i] || `#${i + 1}`}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2.5 border-b border-gray-100 font-bold text-gray-900">{name}</td>
                                            <td className="px-4 py-2.5 border-b border-gray-100">
                                                <code className="text-xs text-gray-600">{id}</code>
                                            </td>
                                            <td className="px-4 py-2.5 border-b border-gray-100 font-bold" style={{ color: accent }}>
                                                {count}
                                            </td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StatsPanel;

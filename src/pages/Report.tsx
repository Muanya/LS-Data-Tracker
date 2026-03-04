import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import FilterBar from '../components/report/FilterBar';
import AttendeeTable from '../components/report/AttendeeTable';
import StatsPanel from '../components/report/StatsPanel';
import apiService from '../services/apiService';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import type { Activity, ReportFilters, TabName, AttendeeRow, AttendanceRecord } from '../utils/types';
import { getIcon } from '../utils/iconMapping';

export default function Report() {
    const navigate = useNavigate();
    const [activities, setActivities] = useState<Activity[]>([]);
    const [activity, setActivity] = useState<string>("");
    const [filters, setFilters] = useState<ReportFilters>({
        mode: "single", singleDate: "", dateFrom: "", dateTo: "", group: "",
    });
    const [rows, setRows] = useState<AttendeeRow[]>([]);
    const [allData, setAllData] = useState<AttendanceRecord[]>([]);
    const [groups, setGroups] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [tab, setTab] = useState<TabName>("records");
    const [activitiesLoading, setActivitiesLoading] = useState(true);

    const currentActivity = activities.find(a => a.id === activity || a.name === activity);
    const requiresGroup = currentActivity?.requiresGroup ?? false;
    const accent = currentActivity?.color || "#818cf8";

    // Fetch activities from backend on mount
    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await apiService.getActivities();
                setActivities(response.activities);
                // Set first activity as default if available
                if (response.activities.length > 0) {
                    setActivity(response.activities[0].id);
                }
            } catch (error) {
                console.error('Failed to fetch activities:', error);
                setError('Failed to load activities');
            } finally {
                setActivitiesLoading(false);
            }
        };
        fetchActivities();
    }, []);

    // Fetch groups when switching to an activity that requires groups
    useEffect(() => {
        if (!requiresGroup || !currentActivity) return;
        const fetchGroups = async () => {
            try {
                const activityGroups = await apiService.getActivityGroups(currentActivity.id);
                setGroups(activityGroups.groups.map(g => g.name));
            } catch (error) {
                console.error('Failed to fetch activity groups:', error);
            }
        };
        fetchGroups();
    }, [requiresGroup, currentActivity]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            // Build date range from filters
            const startDate = filters.mode === "single" ? filters.singleDate : filters.dateFrom;
            const endDate = filters.mode === "single" ? filters.singleDate : filters.dateTo;
            
            if (!startDate || !endDate) {
                setError("Please select valid date range");
                return;
            }

            // Fetch all attendance data for the date range
            const attendanceData = await apiService.getAllAttendance(startDate, endDate);
            setAllData(attendanceData);
            
            // Filter by activity for the records table
            const filteredData = attendanceData.filter(record => 
                record.activity === activity && 
                (!requiresGroup || !filters.group || record.groupName === filters.group)
            );

            // Transform to AttendeeRow format for the table
            const transformedRows: AttendeeRow[] = filteredData.map((record, index) => ({
                id: index,
                attendeeId: record.attendeeId,
                attendeeName: record.attendeeName,
                date: record.date,
                groupId: record.groupId,
                groupName: record.groupName,
            }));

            setRows(transformedRows);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Failed to fetch data.");
            setRows([]);
            setAllData([]);
        } finally {
            setLoading(false);
        }
    }, [activity, filters, requiresGroup]);

    const switchActivity = (activityId: string) => {
        setActivity(activityId);
        setFilters({ mode: "single", singleDate: "", dateFrom: "", dateTo: "", group: "" });
        setRows([]);
        setError("");
        setTab("records");
    };

    return (
        <div className="min-h-screen bg-gray-50 font-['Outfit',_sans-serif] text-gray-900">
            <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />

            {/* Header */}
            <Header 
                title="Activity Dashboard"
                subtitle="Attendance Management System"
            >
                {/* Navigation Button */}
                <Button
                    onClick={() => navigate('/quarter-report')}
                    variant="secondary"
                    className="px-4 py-2 text-sm"
                >
                    📊 Quarter Report
                </Button>
            </Header>

            {/* Ambient glow */}
            <div 
                className="fixed inset-0 pointer-events-none z-0 transition-all duration-500"
                style={{
                    background: `radial-gradient(ellipse 60% 40% at 50% 0%, ${accent}18 0%, transparent 70%)`,
                }}
            />

            <div className="relative z-1">
                <main className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-6">

                    {/* Activity selector */}
                    {activitiesLoading ? (
                        <div className="flex flex-wrap gap-2.5">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="px-5 py-2.5 rounded-xl bg-gray-200 animate-pulse w-24 h-10" />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-2.5">
                            {activities.map((a: Activity) => {
                                const ac = a.color;
                                const active = activity === a.id;
                                return (
                                    <button 
                                        key={a.id} 
                                        onClick={() => switchActivity(a.id)} 
                                        className={`px-5 py-2.5 rounded-xl border font-bold text-sm cursor-pointer font-inherit flex items-center gap-2 transition-all duration-200 ${
                                            active 
                                                ? "border-transparent bg-gradient-to-r from-accent-start to-accent-end text-white shadow-lg" 
                                                : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                                        }`}
                                        style={{
                                            ...(active && {
                                                background: `linear-gradient(135deg, ${ac}, ${ac}80)`,
                                                boxShadow: `0 0 20px ${ac}60`,
                                            }),
                                        }}
                                    >
                                        <span className="text-base">{getIcon(a.icon) || '🔵'}</span>
                                        {a.name}
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* Filters */}
                    <FilterBar
                        filters={filters}
                        onChange={setFilters}
                        isCircle={requiresGroup}
                        groups={groups}
                        accent={accent}
                    />

                    {/* Generate Button */}
                    <div className="flex justify-end">
                        <Button
                            onClick={fetchData}
                            disabled={loading}
                            loading={loading}
                            className="px-7 py-2.5 font-extrabold tracking-wide bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg hover:shadow-xl active:scale-95"
                        >
                            {loading ? "Loading..." : "🔍 Fetch Data"}
                        </Button>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 text-red-700 text-sm">
                            ⚠️ {error}
                        </div>
                    )}

                    {/* Tabs */}
                    <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit">
                        {(["records", "stats"] as TabName[]).map(t => (
                            <button
                                key={t}
                                onClick={() => setTab(t)}
                                className={`px-6 py-2.5 border-none font-bold text-sm cursor-pointer font-inherit transition-all duration-150 ${
                                    tab === t 
                                        ? `bg-[${accent}]/25 text-[${accent}]` 
                                        : "bg-transparent text-gray-600"
                                }`}
                                style={{
                                    background: tab === t ? `${accent}25` : "transparent",
                                    color: tab === t ? accent : "#4b5563",
                                    borderRight: t === "records" ? "1.5px solid #e5e7eb" : "none",
                                }}
                            >
                                {t === "records" ? "📋 Records" : "📊 Statistics"}
                            </button>
                        ))}
                    </div>

                    <Card>
                        {tab === "records" ? (
                            <AttendeeTable rows={rows} isCircle={requiresGroup} accent={accent} />
                        ) : (
                            <StatsPanel rows={rows} allData={allData} isCircle={requiresGroup} accent={accent} />
                        )}
                    </Card>

                    {/* Empty state */}
                    {!rows.length && !loading && !error && (
                        <Card className="text-center py-16">
                            <div className="text-5xl mb-4">{currentActivity?.icon || '🔵'}</div>
                            <div className="font-bold text-lg text-gray-700 mb-2">Select filters and fetch records</div>
                            <div className="text-sm text-gray-600">
                                {requiresGroup
                                    ? "Filter by date range and optionally by group"
                                    : "Filter by a specific day or a date range"
                                }
                            </div>
                        </Card>
                    )}
                </main>
            </div>
        </div>
    );
}

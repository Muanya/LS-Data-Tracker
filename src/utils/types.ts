export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    dob?: string;
    phone?: string;
    school?: string;
    avatarColor?: string;
    totalSessions?: number;
    lastAttendance?: string;
}

export interface CircleGroup {
    id: string;
    name: string;
}

export interface AttendanceRecord {
    id: string;
    attendeeId: string;
    attendeeName: string;
    activity: string;
    date: string;
    groupId?: string;
    groupName?: string;
    timestamp: string;
}

export interface ActivitySummary {
    activity: string;
    totalSessions: number;
    totalAttendance: number;
    averageAttendance: number;
    uniqueAttendees: number;
    topAttendees?: Array<{ id: string; name: string; count: number }>;
    sessions?: string[];
    attendanceByDate?: Record<string, number>;
}

export interface AttendeeSummary {
    attendeeId: string;
    attendeeName: string;
    totalAttendance: number;
    activityBreakdown: Record<string, number>;
    monthlyAttendance?: Record<string, number>;
    recentAttendance?: Array<{ activity: string; date: string; timestamp: string }>;
}

export interface DateRange {
    start: string;
    end: string;
}


export interface Activity {
    id: string;
    name: string;
    frequency: string;
    icon: React.ReactNode;
    color: string;
    gradient: string;
}

export interface BulkAttendanceResponse {
    success: boolean;
    total: number;
    successful: number;
    failed: number;
    errors: any[];
    records?: any[];
}



export interface Message {
    text: string;
    type: 'success' | 'error' | 'info' | 'warning';
}



export interface Attendee {
    id: string;
    name: string;
    email?: string;
}


export interface ActivityStats {
    totalAttendees: number;
    attendanceRate: string;
    peakTime: string;
    topAttendee: string;
    dailyAverage: number;
    uniqueAttendees: number;
}

export interface DashboardActivity extends Activity {
    stats: ActivityStats;
}

export interface SummaryMetrics {
    totalParticipants: number;
    totalRecords: number;
    avgAttendanceRate: string;
    mostPopularActivity: string;
    peakHours: string;
    crossActivityRate: string;
}

export interface TrendDataPoint {
    day: string;
    [key: string]: number | string;
}

export interface CrossActivityAttendee {
    attendeeId: string;
    attendeeName: string;
    activities: string[];
    activityCount: number;
}

export interface ActivityOverlap {
    pair: string;
    overlap: string;
    correlation: 'High' | 'Medium' | 'Low';
}

export interface CrossActivityData {
    multiActivityAttendees: CrossActivityAttendee[];
    activityOverlaps: ActivityOverlap[];
    crossActivityRate: string;
}

export interface DashboardData {
    summary: SummaryMetrics;
    activities: DashboardActivity[];
    trends: {
        labels: string[];
        datasets: Array<{
            label: string;
            data: number[];
            borderColor: string;
        }>;
    };
    crossActivity: CrossActivityData;
    lastUpdated: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    error?: string;
    message?: string;

}

export interface AddAttendanceRequest {
    activityId: string;
    attendeeId: string;
    attendeeName: string;
    date?: string;
    timestamp?: string;
    checkinType?: string;
}

export type ViewType = 'record' | 'summary';
export type SummaryViewType = 'activity' | 'attendee';

// Report-specific types
export type ActivityName = "Med" | "Retreat" | "Recollection" | "Circle";
export type FilterMode = "single" | "range";
export type TabName = "records" | "stats";

export interface AttendeeRow {
    id: string | number;
    attendeeId: string;
    attendeeName: string;
    date: string;
    groupId?: string;
    groupName?: string;
}

export interface ReportFilters {
    mode: FilterMode;
    singleDate: string;
    dateFrom: string;
    dateTo: string;
    group: string;
}

export interface ReportApiResponse {
    rows: AttendeeRow[];
    groups?: string[];
    error?: string;
}

// Quarter Report Types
export type Quarter = "Q1" | "Q2" | "Q3" | "Q4";

export interface MonthStats {
    month: string;
    personsInWork: number;
    boysInContact: number;
    boysGoingToSD: number;
    boysDoctrineAvg: number;
    catechismBreakdown: string;
    numCircles: number;
    boysAttendingCircles: number;
    numProfClasses: number;
    boysAttendingProfClasses: number;
    boysVisitedPoor: number;
    boysTeachingCatechism: number;
    numMeditations: number;
    boysAttendingMeditationsAvg: number;
    numMonthlyRetreats: number;
    boysMonthlyRetreats: number;
    numLongRetreats: number;
    boysLongRetreats: number;
    boysAttendedCV: number;
    totalSRBoys: number;
}

export interface QuarterReportData {
    centre: string;
    quarter: Quarter;
    year: number;
    months: MonthStats[];
}

export interface QuarterReportFilters {
    centre: string;
    quarter: Quarter;
    year: number;
    useMock: boolean;
}

export interface QuarterReportApiResponse {
    success: boolean;
    data: QuarterReportData;
    error?: string;
    message?: string;
}
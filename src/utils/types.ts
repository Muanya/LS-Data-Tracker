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
    displayName: string;
    category: string;
    frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Yearly' | 'Quarterly';
    type: 'simple' | 'grouped' | 'complex';
    icon: string;
    color: string;
    gradient: string;
    dataType: 'number' | 'text' | 'boolean' | 'array' | 'grouped';
    reportKey: string;
    displayOrder: number;
    requiresGroup?: boolean;
    groupType?: 'circle' | 'class' | 'retreat' | 'section';
    allowMultipleGroups?: boolean;
    includeInQuarterReport: boolean;
    includeInAttendanceTracking: boolean;
    aggregationMethod?: 'sum' | 'average' | 'count' | 'max';
    required?: boolean;
    min?: number;
    max?: number;
    validation?: {
        pattern?: string;
        message?: string;
    };
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

export interface DashboardActivity {
    id: string;
    name: string;
    color: string;
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

export interface SessionTrends {
    trends: {
        labels: string[];
        datasets: Array<{
            label: string;
            data: number[];
            borderColor: string;
            backgroundColor: string;
            sessions: number;
            totalAttendance: number;
            averageAttendance: number;
        }>;
    };
    summary: {
        totalSessions: number;
        totalAttendance: number;
        averageSessionAttendance: number;
        mostRecentSession?: {
            activity: string;
            date: string;
            attendees: Set<string>;
            timestamp: string;
        };
        sessionGrowth: 'Growing' | 'Declining' | 'Stable' | 'Insufficient data';
    };
}

export interface DashboardData {
    summary: SummaryMetrics;
    activities: DashboardActivity[];
    trends: SessionTrends;
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
    numDoctrineCls: number;
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
    // New fields from backend
    numEucharisticVigils: number;
    numSpiritualDirection: number;
    numVisitsToThePoor: number;
    numProfessionalGetTogethers: number;
    numWorkshops: number;
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
}

export interface ActivityConfigResponse {
    activities: Activity[];
    categories: Array<{
        id: string;
        name: string;
        displayOrder: number;
    }>;
    lastUpdated: string;
}

export interface ActivityGroup {
    id: string;
    name: string;
    activityId: string;
    activityType: string;
    description?: string;
    capacity?: number;
    isActive: boolean;
    metadata?: Record<string, any>;
}

export interface ActivityGroupResponse {
    groups: ActivityGroup[];
    activityId: string;
    totalCount: number;
    activeCount: number;
}

export interface GroupedActivityData {
    total: number;
    groups: Array<{
        groupId: string;
        groupName: string;
        count: number;
        average?: number;
        trend?: 'up' | 'down' | 'stable';
    }>;
    metadata?: Record<string, any>;
}

// Backend-driven field configuration
export interface QuarterReportFieldConfig {
    key: string;
    label: string;
    dataType: 'number' | 'text' | 'boolean';
    isVisibleByDefault: boolean;
    displayOrder: number;
    description?: string;
}

export interface QuarterReportBackendConfig {
    fields: QuarterReportFieldConfig[];
  
    version: string;
    lastUpdated: string;
}

export interface QuarterReportApiResponse {
    success: boolean;
    data: QuarterReportData;
    config?: QuarterReportBackendConfig;
    error?: string;
    message?: string;
}
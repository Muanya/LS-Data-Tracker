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


export type ViewType = 'record' | 'summary';
export type SummaryViewType = 'activity' | 'attendee';
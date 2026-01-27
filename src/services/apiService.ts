import type { User, CircleGroup, AttendanceRecord, ActivitySummary, AttendeeSummary, BulkAttendanceResponse } from '../utils/types';

const API_URL = 'https://script.google.com/macros/s/AKfycbzkSZBQ1sDzY5xUDGR99yMc_31JwtET0zBccq4QX2HzkiZBJ1fxj20n6WxUnjaR1y7EEA/exec';

interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

export class ApiService {
    static async getAttendees(): Promise<User[]> {
        try {
            const response = await fetch(`${API_URL}?action=getAttendees`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result: ApiResponse<User[]> = await response.json();
            if (!result.success) {
                throw new Error(result.message || 'Failed to fetch attendees');
            }
            return result.data;
        } catch (error) {
            throw new Error(`Failed to get attendees: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    static async getCircleGroups(): Promise<CircleGroup[]> {
        try {
            const response = await fetch(`${API_URL}?action=getCircleGroups`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result: ApiResponse<CircleGroup[]> = await response.json();
            if (!result.success) {
                throw new Error(result.message || 'Failed to fetch circle groups');
            }
            return result.data;
        } catch (error) {
            throw new Error(`Failed to get circle groups: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    static async getAllAttendance(startDate: string, endDate: string): Promise<AttendanceRecord[]> {
        try {
            const response = await fetch(`${API_URL}?action=getAllAttendance&startDate=${startDate}&endDate=${endDate}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result: ApiResponse<AttendanceRecord[]> = await response.json();
            if (!result.success) {
                throw new Error(result.message || 'Failed to fetch attendance records');
            }
            return result.data;
        } catch (error) {
            throw new Error(`Failed to get all attendance: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    static async getAllActivitySummaries(startDate: string, endDate: string): Promise<Record<string, ActivitySummary>> {
        try {
            const response = await fetch(
                `${API_URL}?action=getAllActivitySummaries&startDate=${startDate}&endDate=${endDate}`
            );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result: ApiResponse<Record<string, ActivitySummary>> = await response.json();
            if (!result.success) {
                throw new Error(result.message || 'Failed to fetch activity summaries');
            }
            return result.data;
        } catch (error) {
            throw new Error(`Failed to get all activity summaries: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    static async getAllAttendeeSummaries(startDate: string, endDate: string): Promise<AttendeeSummary[]> {
        try {
            const response = await fetch(
                `${API_URL}?action=getAllAttendeeSummaries&startDate=${startDate}&endDate=${endDate}`
            );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result: ApiResponse<AttendeeSummary[]> = await response.json();
            if (!result.success) {
                throw new Error(result.message || 'Failed to fetch attendee summaries');
            }
            return result.data;
        } catch (error) {
            throw new Error(`Failed to get all attendee summaries: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    static async searchAttendee(name: string): Promise<User[]> {
        try {
            const response = await fetch(`${API_URL}?action=searchAttendee&name=${encodeURIComponent(name)}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result: ApiResponse<User[]> = await response.json();
            if (!result.success) {
                throw new Error(result.message || 'Failed to search attendees');
            }
            return result.data;
        } catch (error) {
            throw new Error(`Failed to search attendee: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    static async searchCircleGroup(name: string): Promise<CircleGroup[]> {
        try {
            const response = await fetch(`${API_URL}?action=searchCircleGroup&name=${encodeURIComponent(name)}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result: ApiResponse<CircleGroup[]> = await response.json();
            if (!result.success) {
                throw new Error(result.message || 'Failed to search circle groups');
            }
            return result.data;
        } catch (error) {
            throw new Error(`Failed to search circle group: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    static async addAttendee(firstName: string, lastName: string, email: string, phone?: string): Promise<User> {
        try {
            const body = new URLSearchParams({
                action: 'addAttendee',
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: email.trim(),
                ...(phone ? { phone: phone.trim() } : {})
            });
            const response = await fetch(API_URL, {
                method: 'POST',
                body

            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result: ApiResponse<User> = await response.json();
            if (!result.success) {
                throw new Error(result.message || 'Failed to add attendee');
            }
            return result.data;
        } catch (error) {
            throw new Error(`Failed to add attendee: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    static async addCircleGroup(name: string): Promise<CircleGroup> {
        try {
            const body = new URLSearchParams({
                action: 'addCircleGroup',
                name: name.trim()
            });
            const response = await fetch(API_URL, {
                method: 'POST',
                body
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result: ApiResponse<CircleGroup> = await response.json();
            if (!result.success) {
                throw new Error(result.message || 'Failed to add circle group');
            }
            return result.data;
        } catch (error) {
            throw new Error(`Failed to add circle group: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    static async recordAttendance(data: {
        attendees: Array<{
            id: string;
            name: string;
        }>;
        activity: string;
        date: string;
        groupId?: string;
        groupName?: string;
    }): Promise<BulkAttendanceResponse> {
        try {
            const body = new URLSearchParams({
                action: 'recordAttendance',
                attendeeData: JSON.stringify(data.attendees),
                activity: data.activity,
                date: data.date,
                ...(data.groupId ? { groupId: data.groupId } : {}),
                ...(data.groupName ? { groupName: data.groupName } : {})
            });

            const response = await fetch(API_URL, {
                method: 'POST',
                body
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result;

        } catch (error) {
            throw new Error(`Failed to record bulk attendance: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    static async removeAttendance(data: {
        attendeeId: string;
        activity: string;
        date: string;
        groupId?: string;
    }): Promise<boolean> {
        try {
            const body = new URLSearchParams({
                action: 'removeAttendance',
                attendeeId: data.attendeeId,
                activity: data.activity,
                date: data.date,
                ...(data.groupId ? { groupId: data.groupId } : {})
            });
            const response = await fetch(API_URL, {
                method: 'POST',
                body
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            if (!result.success) {
                throw new Error(result.message || 'Failed to remove attendance');
            }
            return result.success;
        } catch (error) {
            throw new Error(`Failed to remove attendance: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    static async getActivitySummary(activity: string, startDate: string, endDate: string): Promise<ActivitySummary> {
        try {
            const response = await fetch(
                `${API_URL}?action=getActivitySummary&activity=${activity}&startDate=${startDate}&endDate=${endDate}`
            );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result: ApiResponse<ActivitySummary> = await response.json();
            if (!result.success) {
                throw new Error(result.message || 'Failed to fetch activity summary');
            }
            return result.data;
        } catch (error) {
            throw new Error(`Failed to get activity summary: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    static async getAttendeeSummary(attendeeId: string, startDate: string, endDate: string): Promise<AttendeeSummary> {
        try {
            const response = await fetch(
                `${API_URL}?action=getAttendeeSummary&attendeeId=${attendeeId}&startDate=${startDate}&endDate=${endDate}`
            );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result: ApiResponse<AttendeeSummary> = await response.json();
            if (!result.success) {
                throw new Error(result.message || 'Failed to fetch attendee summary');
            }
            return result.data;
        } catch (error) {
            throw new Error(`Failed to get attendee summary: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}
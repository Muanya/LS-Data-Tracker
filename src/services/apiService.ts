import axios, { type AxiosInstance } from 'axios';
import type { User, CircleGroup, AttendanceRecord, ActivitySummary, AttendeeSummary, BulkAttendanceResponse, ApiResponse, DashboardData, QuarterReportData, QuarterReportApiResponse } from '../utils/types';
import { environment } from '../environment';

const API_URL = environment.BASE_API_URL;

class ApiService {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: API_URL,
            timeout: 20000
        });
    }

    async getAttendees(): Promise<User[]> {
        try {
            const result: ApiResponse<User[]> = (await this.client.get('', { params: { action: 'getAttendees' } })).data;
            if (!result.success) {
                throw new Error(result.message || 'Failed to fetch attendees');
            }
            return result.data;
        } catch (error) {
            throw new Error(`Failed to get attendees: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async getCircleGroups(): Promise<CircleGroup[]> {
        try {
            const result: ApiResponse<CircleGroup[]> = (await this.client.get('', { params: { action: 'getCircleGroups' } })).data;
            if (!result.success) {
                throw new Error(result.message || 'Failed to fetch circle groups');
            }
            return result.data;
        } catch (error) {
            throw new Error(`Failed to get circle groups: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async getAllAttendance(startDate: string, endDate: string): Promise<AttendanceRecord[]> {
        try {
            const result: ApiResponse<AttendanceRecord[]> = (await this.client.get('', { 
                params: { action: 'getAllAttendance', startDate, endDate } 
            })).data;
            if (!result.success) {
                throw new Error(result.message || 'Failed to fetch attendance records');
            }
            return result.data;
        } catch (error) {
            throw new Error(`Failed to get all attendance: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async getAllActivitySummaries(startDate: string, endDate: string): Promise<Record<string, ActivitySummary>> {
        try {
            const result: ApiResponse<Record<string, ActivitySummary>> = (await this.client.get('', { 
                params: { action: 'getAllActivitySummaries', startDate, endDate } 
            })).data;
            if (!result.success) {
                throw new Error(result.message || 'Failed to fetch activity summaries');
            }
            return result.data;
        } catch (error) {
            throw new Error(`Failed to get all activity summaries: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async getAllAttendeeSummaries(startDate: string, endDate: string): Promise<AttendeeSummary[]> {
        try {
            const result: ApiResponse<AttendeeSummary[]> = (await this.client.get('', { 
                params: { action: 'getAllAttendeeSummaries', startDate, endDate } 
            })).data;
            if (!result.success) {
                throw new Error(result.message || 'Failed to fetch attendee summaries');
            }
            return result.data;
        } catch (error) {
            throw new Error(`Failed to get all attendee summaries: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async searchAttendee(name: string): Promise<User[]> {
        try {
            const result: ApiResponse<User[]> = (await this.client.get('', { 
                params: { action: 'searchAttendee', name } 
            })).data;
            if (!result.success) {
                throw new Error(result.message || 'Failed to search attendees');
            }
            return result.data;
        } catch (error) {
            throw new Error(`Failed to search attendee: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async searchCircleGroup(name: string): Promise<CircleGroup[]> {
        try {
            const result: ApiResponse<CircleGroup[]> = (await this.client.get('', { 
                params: { action: 'searchCircleGroup', name } 
            })).data;
            if (!result.success) {
                throw new Error(result.message || 'Failed to search circle groups');
            }
            return result.data;
        } catch (error) {
            throw new Error(`Failed to search circle group: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async addAttendee(firstName: string, lastName: string, email: string, phone?: string): Promise<User> {
        try {
            const body = new URLSearchParams({
                action: 'addAttendee',
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: email.trim(),
                ...(phone ? { phone: phone.trim() } : {})
            });
            const result: ApiResponse<User> = (await this.client.post('', body)).data;
            if (!result.success) {
                throw new Error(result.message || 'Failed to add attendee');
            }
            return result.data;
        } catch (error) {
            throw new Error(`Failed to add attendee: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async addCircleGroup(name: string): Promise<CircleGroup> {
        try {
            const body = new URLSearchParams({
                action: 'addCircleGroup',
                name: name.trim()
            });
            const result: ApiResponse<CircleGroup> = (await this.client.post('', body)).data;
            if (!result.success) {
                throw new Error(result.message || 'Failed to add circle group');
            }
            return result.data;
        } catch (error) {
            throw new Error(`Failed to add circle group: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async recordAttendance(data: {
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

            const result = (await this.client.post('', body)).data;
            return result;
        } catch (error) {
            throw new Error(`Failed to record bulk attendance: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async removeAttendance(data: {
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
            const result = (await this.client.post('', body)).data;
            if (!result.success) {
                throw new Error(result.message || 'Failed to remove attendance');
            }
            return result.success;
        } catch (error) {
            throw new Error(`Failed to remove attendance: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async getActivitySummary(activity: string, startDate: string, endDate: string): Promise<ActivitySummary> {
        try {
            const result: ApiResponse<ActivitySummary> = (await this.client.get('', { 
                params: { action: 'getActivitySummary', activity, startDate, endDate } 
            })).data;
            if (!result.success) {
                throw new Error(result.message || 'Failed to fetch activity summary');
            }
            return result.data;
        } catch (error) {
            throw new Error(`Failed to get activity summary: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async getAttendeeSummary(attendeeId: string, startDate: string, endDate: string): Promise<AttendeeSummary> {
        try {
            const result: ApiResponse<AttendeeSummary> = (await this.client.get('', { 
                params: { action: 'getAttendeeSummary', attendeeId, startDate, endDate } 
            })).data;
            if (!result.success) {
                throw new Error(result.message || 'Failed to fetch attendee summary');
            }
            return result.data;
        } catch (error) {
            throw new Error(`Failed to get attendee summary: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    // Dashboard Data
    async getDashboardData(): Promise<DashboardData> {
        try {
            const result: ApiResponse<DashboardData> = (await this.client.get('', {
                params: { action: 'getDashboardData' }
            })).data;
            if (!result.success) {
                throw new Error(result.message || 'No data received from server');
            }
            return result.data;
        } catch (error) {
            throw new Error(`Failed to fetch dashboard data: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    // Health Check
    async healthCheck(): Promise<boolean> {
        try {
            await this.client.get('', {
                params: { action: 'health' },
                timeout: 5000
            });
            return true;
        } catch (error) {
            console.warn('Health check failed:', error instanceof Error ? error.message : 'Unknown error');
            return false;
        }
    }

    // Quarter Report Methods
    async getQuarterReport(quarter: string, year: number, centre: string): Promise<QuarterReportData> {
        try {
            const result: QuarterReportApiResponse = (await this.client.get('', { 
                params: { action: 'getQuarterReport', quarter, year: String(year), centre } 
            })).data;
            if (!result.success) {
                throw new Error(result.message || 'Failed to fetch quarter report');
            }
            return result.data;
        } catch (error) {
            throw new Error(`Failed to get quarter report: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}

// Export singleton instance
export default new ApiService();
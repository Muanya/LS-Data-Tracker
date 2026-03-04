import { useQuery } from '@tanstack/react-query';
import apiService from '../services/apiService';
import type { DashboardData, User, ActivityConfigResponse, ActivityGroupResponse } from '../utils/types';

// Query keys
export const attendanceKeys = {
    all: ['attendance'] as const,
    dashboard: () => [...attendanceKeys.all, 'dashboard'] as const,
    users: () => [...attendanceKeys.all, 'users'] as const,
    activities: () => [...attendanceKeys.all, 'activities'] as const,
    activityGroups: (activityId: string) => [...attendanceKeys.all, 'activityGroups', activityId] as const,
} as const;


// Health check hook
export const useApiHealth = () => {
    return useQuery({
        queryKey: ['health'],
        queryFn: () => apiService.healthCheck(),
        refetchInterval: 10 * 60 * 1000, // Check every 10 minute
        staleTime: 5 * 60 * 1000, // Consider healthy for 5 minutes
    });
};

// Dashboard data hook
export const useDashboardData = () => {
    return useQuery<DashboardData, Error>({
        queryKey: attendanceKeys.dashboard(),
        queryFn: () => apiService.getDashboardData(),
        refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
    });
};


// User data hook
export const useAttendeesData = () => {
    return useQuery<User[], Error>({
        queryKey: attendanceKeys.users(),
        queryFn: () => apiService.getAttendees(),
        refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
    });
};

// Activities data hook
export const useActivitiesData = () => {
    return useQuery<ActivityConfigResponse, Error>({
        queryKey: attendanceKeys.activities(),
        queryFn: () => apiService.getActivities(),
        refetchInterval: 15 * 60 * 1000, // Refresh every 15 minutes
        staleTime: 10 * 60 * 1000, // Consider fresh for 10 minutes
    });
};

// Activity groups data hook
export const useActivityGroupsData = (activityId?: string) => {
    return useQuery<ActivityGroupResponse, Error>({
        queryKey: attendanceKeys.activityGroups(activityId || ''),
        queryFn: () => apiService.getActivityGroups(activityId || ''),
        enabled: !!activityId,
        refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
    });
};
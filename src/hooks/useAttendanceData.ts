import { useQuery } from '@tanstack/react-query';
import apiService from '../services/apiService';
import type { CircleGroup, DashboardData, User } from '../utils/types';

// Query keys
export const attendanceKeys = {
    all: ['attendance'] as const,
    dashboard: () => [...attendanceKeys.all, 'dashboard'] as const,
    users: () => [...attendanceKeys.all, 'users'] as const,
    circleGroups: () => [...attendanceKeys.all, 'circle', 'groups'] as const,
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

export const useCircleGroupsData = () => {
    return useQuery<CircleGroup[], Error>({
        queryKey: attendanceKeys.circleGroups(),
        queryFn: () => apiService.getCircleGroups(),
        refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
    });
};
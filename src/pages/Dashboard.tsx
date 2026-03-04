import React from 'react';
import { useNavigate } from 'react-router-dom';
import ActivityCard from "../components/ActivityCard";
import AttendanceChart from "../components/AttendanceChart";
import CrossActivityAnalysis from "../components/CrossActivityAnalysis";
import SummaryMetrics from "../components/SummaryMetrics";
import { useDashboardData, useApiHealth } from '../hooks/useAttendanceData';
import ErrorMessage from '../components/ErrorMessage';
import HealthStatus from '../components/HealthStatus';
import LoadingSpinner from '../components/LoadingSpinner';
import Header from '../components/Header';
import { Button } from '../components/ui/Button';



const Dashboard: React.FC = () => {
    const { data, isLoading, error, refetch } = useDashboardData();
    const { data: isHealthy, isLoading: healthLoading } = useApiHealth();

    const navigate = useNavigate();
    const handleTakeAttendance = () => {
        navigate('/attendance');
    };

    const handleViewReports = () => {
        navigate('/report');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <LoadingSpinner message="Loading dashboard data..." fullScreen />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <ErrorMessage
                    message="Failed to load dashboard data"
                    error={error}
                    onRetry={() => refetch()}
                />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <ErrorMessage
                    message="No data available"
                    onRetry={() => refetch()}
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header
                title="Dashboard"
                subtitle={`Last updated: ${new Date(data.lastUpdated).toLocaleString()}`}
            >
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end">
                    <HealthStatus isHealthy={isHealthy} isLoading={healthLoading} />

                    <Button variant='primary' onClick={handleTakeAttendance}>
                        Add Attendance
                    </Button>

                    <Button variant='secondary' onClick={handleViewReports}>
                        View Reports
                    </Button>

                    <button
                        onClick={() => refetch()}
                        className="px-3 sm:px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm sm:text-base"
                    >
                        Refresh
                    </button>
                </div>
            </Header>

            {/* Add transition to main content */}
            <main className="p-4 sm:p-5 md:p-6 transition-all duration-300 max-w-7xl mx-auto lg:mx-0">
                {/* Summary Metrics */}
                <SummaryMetrics summary={data.summary} />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
                    {/* Activity Cards */}
                    <div className="md:col-span-2">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Activities Overview</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            {data.activities.map((activity) => (
                                <ActivityCard key={activity.id} activity={activity} />
                            ))}
                        </div>
                    </div>

                    {/* Attendance Trends Chart */}
                    <div className="md:col-span-1">
                        <AttendanceChart trends={data.trends} />
                    </div>
                </div>

                {/* Cross-Activity Analysis */}
                <CrossActivityAnalysis crossActivity={data.crossActivity} />


            </main>
        </div>
    );
};

export default Dashboard;
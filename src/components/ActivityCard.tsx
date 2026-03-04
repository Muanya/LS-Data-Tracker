import React from 'react';
import { TrendingUp, Users, Clock, User, Calendar, BarChart } from 'lucide-react';
import type { DashboardActivity } from '../utils/types';

interface ActivityCardProps {
  activity: DashboardActivity;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => {

  const formatDateWithDay = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString(undefined, { year: '2-digit', month: 'short', day: 'numeric' });
  };

  const stats = {
    totalAttendees: activity.stats.totalAttendees,
    attendanceRate: activity.stats.attendanceRate,
    peakTime: formatDateWithDay(activity.stats.peakTime),
    topAttendee: activity.stats.topAttendee,
    dailyAverage: activity.stats.dailyAverage,
    uniqueAttendees: activity.stats.uniqueAttendees,
  };

  console.log(activity, activity.name);

  return (
    <div
      className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-5 hover:shadow-lg transition-all duration-200 border-l-4"
      style={{ borderLeftColor: activity.color }}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-xl font-semibold text-gray-800 truncate">{activity.name}</h3>
          {activity.name && (
            <p className="text-gray-600 text-xs sm:text-sm mt-0.5 line-clamp-1"> {activity.name}</p>
          )}
        </div>
        <div
          className="w-4 h-4 rounded-full flex-shrink-0"
          style={{ backgroundColor: activity.color }}
          title={`Activity ${activity.id}`}
        ></div>
      </div>

      <div className="space-y-2 sm:space-y-3">
        <StatItem
          label="Total Attendees"
          value={stats.totalAttendees.toString()}
          icon={<Users className="w-3.5 sm:w-4 h-3.5 sm:h-4" />}
        />
        <StatItem
          label="Attendance Rate"
          value={stats.attendanceRate}
          icon={<TrendingUp className="w-3.5 sm:w-4 h-3.5 sm:h-4" />}
        />
        <StatItem
          label="Unique Attendees"
          value={stats.uniqueAttendees.toString()}
          icon={<User className="w-3.5 sm:w-4 h-3.5 sm:h-4" />}
        />
        <StatItem
          label="Daily Average"
          value={stats.dailyAverage.toString()}
          icon={<Calendar className="w-3.5 sm:w-4 h-3.5 sm:h-4" />}
        />
        <StatItem
          label="Peak Time"
          value={stats.peakTime}
          icon={<Clock className="w-3.5 sm:w-4 h-3.5 sm:h-4" />}
        />
        <StatItem
          label="Top Attendee"
          value={stats.topAttendee}
          icon={<BarChart className="w-3.5 sm:w-4 h-3.5 sm:h-4" />}
        />
      </div>
    </div>
  );
};

const StatItem: React.FC<{
  label: string;
  value: string;
  icon: React.ReactNode;
  loading?: boolean;
}> = ({ label, value, icon, loading = false }) => (
  <div className="flex justify-between items-center py-1.5 sm:py-2 border-b border-gray-100 last:border-0 gap-3 sm:gap-4 min-w-0">
    <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
      <span className="text-gray-400 flex-shrink-0">{icon}</span>
      <span className="text-gray-600 text-sm sm:text-base">{label}</span>
    </div>
    {loading ? (
      <div className="h-5 sm:h-6 w-16 bg-gray-200 animate-pulse rounded flex-shrink-0"></div>
    ) : (
      <span className="font-semibold text-gray-900 text-sm sm:text-base truncate min-w-0" title={value}>{value}</span>
    )}
  </div>
);

export default ActivityCard;
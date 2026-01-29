import React from 'react';
import { TrendingUp, Users, Clock, User, Calendar, BarChart } from 'lucide-react';
import type { DashboardActivity } from '../utils/types';

interface ActivityCardProps {
  activity: DashboardActivity;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => {

  const stats = {
    totalAttendees: activity.stats.totalAttendees,
    attendanceRate: activity.stats.attendanceRate,
    peakTime: activity.stats.peakTime,
    topAttendee: activity.stats.topAttendee,
    dailyAverage: activity.stats.dailyAverage,
    uniqueAttendees: activity.stats.uniqueAttendees,
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-all duration-200 border-l-4"
      style={{ borderLeftColor: activity.color }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">{activity.name}</h3>
          {activity.name && (
            <p className="text-gray-600 text-sm mt-1">{activity.name}</p>
          )}
        </div>
        <div 
          className="w-4 h-4 rounded-full" 
          style={{ backgroundColor: activity.color }}
          title={`Activity ${activity.id}`}
        ></div>
      </div>
      
      <div className="space-y-3">
        <StatItem 
          label="Total Attendees" 
          value={stats.totalAttendees.toString()} 
          icon={<Users className="w-4 h-4" />}
        />
        <StatItem 
          label="Attendance Rate" 
          value={stats.attendanceRate} 
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <StatItem 
          label="Unique Attendees" 
          value={stats.uniqueAttendees.toString()} 
          icon={<User className="w-4 h-4" />}
        />
        <StatItem 
          label="Daily Average" 
          value={stats.dailyAverage.toString()} 
          icon={<Calendar className="w-4 h-4" />}
        />
        <StatItem 
          label="Peak Time" 
          value={stats.peakTime} 
          icon={<Clock className="w-4 h-4" />}
        />
        <StatItem 
          label="Top Attendee" 
          value={stats.topAttendee} 
          icon={<BarChart className="w-4 h-4" />}
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
  <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
    <div className="flex items-center gap-2">
      <span className="text-gray-400">{icon}</span>
      <span className="text-gray-600">{label}</span>
    </div>
    {loading ? (
      <div className="h-6 w-16 bg-gray-200 animate-pulse rounded"></div>
    ) : (
      <span className="font-semibold text-gray-900">{value}</span>
    )}
  </div>
);

export default ActivityCard;
// components/SummaryMetrics.tsx
import React from 'react';
import { Users, TrendingUp, Clock, Repeat, Calendar, Award } from 'lucide-react';
import type { SummaryMetrics as SummaryMetricsType } from '../utils/types';

interface SummaryMetricsProps {
  summary: SummaryMetricsType;
}

const SummaryMetrics: React.FC<SummaryMetricsProps> = ({ summary }) => {
  const metrics = [
    { 
      title: 'Total Participants', 
      value: summary.totalParticipants.toString(), 
      change: '+12%', 
      icon: <Users className="w-6 h-6" />,
      color: 'bg-blue-100 text-blue-600',
      description: 'Unique individuals attended'
    },
    { 
      title: 'Total Records', 
      value: summary.totalRecords.toString(), 
      change: '+18%', 
      icon: <Calendar className="w-6 h-6" />,
      color: 'bg-purple-100 text-purple-600',
      description: 'Attendance entries'
    },
    { 
      title: 'Avg. Attendance Rate', 
      value: summary.avgAttendanceRate, 
      change: '+5%', 
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'bg-green-100 text-green-600',
      description: 'Average across activities'
    },
    { 
      title: 'Peak Hours', 
      value: summary.peakHours, 
      change: 'Consistent', 
      icon: <Clock className="w-6 h-6" />,
      color: 'bg-amber-100 text-amber-600',
      description: 'Most active time'
    },
    { 
      title: 'Cross-Activity', 
      value: summary.crossActivityRate, 
      change: '+8%', 
      icon: <Repeat className="w-6 h-6" />,
      color: 'bg-indigo-100 text-indigo-600',
      description: 'Multi-activity attendees'
    },
    { 
      title: 'Most Popular', 
      value: summary.mostPopularActivity, 
      change: 'Trending', 
      icon: <Award className="w-6 h-6" />,
      color: 'bg-rose-100 text-rose-600',
      description: 'Highest attendance'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
      {metrics.map((metric, index) => (
        <div 
          key={index} 
          className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-2 rounded-lg ${metric.color}`}>
              {metric.icon}
            </div>
            <span className={`text-sm font-medium ${
              metric.change === 'Consistent' || metric.change === 'Trending' 
                ? 'text-amber-600' 
                : 'text-green-600'
            }`}>
              {metric.change}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</h3>
          <p className="text-gray-900 font-medium text-sm mb-1">{metric.title}</p>
          <p className="text-gray-500 text-xs">{metric.description}</p>
        </div>
      ))}
    </div>
  );
};

export default SummaryMetrics;
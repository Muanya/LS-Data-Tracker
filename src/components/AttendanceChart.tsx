import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import type { DashboardActivity } from '../utils/types';

interface AttendanceChartProps {
  activities: DashboardActivity[];
  trends: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      borderColor: string;
    }>;
  };
}

const AttendanceChart: React.FC<AttendanceChartProps> = ({ activities, trends }) => {
  // Transform data for Recharts
  const chartData = trends.labels.map((label, index) => {
    const dataPoint: any = { day: label };
    trends.datasets.forEach(dataset => {
      dataPoint[dataset.label] = dataset.data[index] || 0;
    });
    return dataPoint;
  });

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: <span className="font-semibold">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-5 h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Weekly Attendance Trend</h3>
        <select className="text-sm border border-gray-300 rounded-lg px-3 py-1">
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
        </select>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis
              dataKey="day"
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis
              stroke="#6b7280"
              fontSize={12}
              label={{
                value: 'Attendees',
                angle: -90,
                position: 'insideLeft',
                fontSize: 12,
                fill: '#6b7280'
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              height={36}
              wrapperStyle={{ fontSize: '12px' }}
            />
            {activities.map((activity) => (
              <Line
                key={activity.id}
                type="monotone"
                dataKey={activity.name}
                stroke={activity.color}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5, strokeWidth: 0 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap gap-3 mt-6 justify-center">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center">
            <div
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: activity.color }}
            ></div>
            <span className="text-sm text-gray-600">{activity.name}</span>
            <span className="text-xs text-gray-400 ml-1">
              ({activity.stats.totalAttendees})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendanceChart;
import React, { useState } from 'react';
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
import type { SessionTrends } from '../utils/types';

interface AttendanceChartProps {
  trends: SessionTrends;
}

const AttendanceChart: React.FC<AttendanceChartProps> = ({ trends }) => {
  // State for selected activities (default all selected)
  const [selectedActivities, setSelectedActivities] = useState<Set<string>>(
    () => new Set(trends.trends.datasets.map(d => d.label))
  );

  // Toggle activity selection
  const toggleActivity = (label: string) => {
    setSelectedActivities(prev => {
      const newSet = new Set(prev);
      if (newSet.has(label)) {
        newSet.delete(label);
      } else {
        newSet.add(label);
      }
      return newSet;
    });
  };

  // Select all activities
  const selectAll = () => {
    setSelectedActivities(new Set(trends.trends.datasets.map(d => d.label)));
  };

  // Clear all selections
  const clearAll = () => {
    setSelectedActivities(new Set());
  };

  // Filter datasets based on selection
  const filteredDatasets = trends.trends.datasets.filter(d => selectedActivities.has(d.label));
  // Transform data for Recharts - only include selected activities
  const chartData = trends.trends.labels.map((label, index) => {
    const dataPoint: any = { day: label };
    filteredDatasets.forEach(dataset => {
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
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Session Attendance Trends</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
            {trends.summary.sessionGrowth}
          </span>
        </div>
      </div>

      {/* Activity Selector */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">Show Activities</span>
          <div className="flex gap-2">
            <button
              onClick={selectAll}
              className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
            >
              All
            </button>
            <button
              onClick={clearAll}
              className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
            >
              None
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {trends.trends.datasets.map((dataset) => (
            <button
              key={dataset.label}
              onClick={() => toggleActivity(dataset.label)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all ${
                selectedActivities.has(dataset.label)
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: selectedActivities.has(dataset.label) ? 'white' : dataset.borderColor }}
              />
              {dataset.label}
            </button>
          ))}
        </div>
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
            {filteredDatasets.map((dataset) => (
              <Line
                key={dataset.label}
                type="monotone"
                dataKey={dataset.label}
                stroke={dataset.borderColor}
                fill={dataset.backgroundColor}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5, strokeWidth: 0 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-100">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">{trends.summary.totalSessions}</p>
          <p className="text-xs text-gray-500">Total Sessions</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">{trends.summary.totalAttendance}</p>
          <p className="text-xs text-gray-500">Total Attendance</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">{trends.summary.averageSessionAttendance}</p>
          <p className="text-xs text-gray-500">Avg per Session</p>
        </div>
      </div>

      {/* Activity Legend - show filtered stats */}
      <div className="flex flex-wrap gap-3 mt-6 justify-center">
        {filteredDatasets.map((dataset) => (
          <div key={dataset.label} className="flex items-center">
            <div
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: dataset.borderColor }}
            ></div>
            <span className="text-sm text-gray-600">{dataset.label}</span>
            <span className="text-xs text-gray-400 ml-1">
              ({dataset.sessions} sessions, avg: {dataset.averageAttendance})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendanceChart;
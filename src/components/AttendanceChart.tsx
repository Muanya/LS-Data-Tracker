import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Activity {
  id: string | number;
  name: string;
  color: string;
}

const AttendanceChart = ({ activities }: { activities: Activity[] }) => {
  const data = [
    { day: 'Mon', ActivityA: 42, ActivityB: 38, ActivityC: 45, ActivityD: 31 },
    { day: 'Tue', ActivityA: 45, ActivityB: 40, ActivityC: 42, ActivityD: 35 },
    { day: 'Wed', ActivityA: 38, ActivityB: 45, ActivityC: 38, ActivityD: 42 },
    { day: 'Thu', ActivityA: 50, ActivityB: 38, ActivityC: 45, ActivityD: 40 },
    { day: 'Fri', ActivityA: 42, ActivityB: 42, ActivityC: 40, ActivityD: 38 },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-5 h-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Weekly Attendance Trend</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="ActivityA" stroke="#3B82F6" strokeWidth={2} />
            <Line type="monotone" dataKey="ActivityB" stroke="#10B981" strokeWidth={2} />
            <Line type="monotone" dataKey="ActivityC" stroke="#F59E0B" strokeWidth={2} />
            <Line type="monotone" dataKey="ActivityD" stroke="#EF4444" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap gap-3 mt-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: activity.color }}></div>
            <span className="text-sm text-gray-600">{activity.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendanceChart;
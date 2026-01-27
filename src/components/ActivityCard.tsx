import { Calendar } from 'lucide-react';

interface ActivityCardProps {
  activity: { color: string; name: string; sheetName: string };
  onTakeAttendance: () => void;
}

interface StatItemProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}

const ActivityCard = ({ activity, onTakeAttendance }: ActivityCardProps) => {
  const stats = {
    totalAttendees: 42,
    attendanceRate: '78%',
    peakTime: '10:00 AM',
    topAttendee: 'John Doe',
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div 
            className="w-4 h-4 rounded-full" 
            style={{ backgroundColor: activity.color }}
          ></div>
          <h3 className="text-xl font-semibold text-gray-800">{activity.name}</h3>
        </div>
        <span className="text-sm text-gray-500">ID: {activity.sheetName}</span>
      </div>
      
      <div className="space-y-3 mb-6">
        <StatItem label="Total Attendees" value={stats.totalAttendees} icon="👥" />
        <StatItem label="Attendance Rate" value={stats.attendanceRate} icon="📊" />
        <StatItem label="Peak Time" value={stats.peakTime} icon="⏰" />
        <StatItem label="Top Attendee" value={stats.topAttendee} icon="👑" />
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={onTakeAttendance}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition font-medium text-sm"
        >
          <Calendar className="w-4 h-4" />
          Mark Attendance
        </button>
        <button className="px-4 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition text-sm font-medium">
          Details
        </button>
      </div>
    </div>
  );
};



const StatItem = ({ label, value, icon }: StatItemProps) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
    <div className="flex items-center gap-2">
      <span className="text-lg">{icon}</span>
      <span className="text-gray-600">{label}</span>
    </div>
    <span className="font-semibold text-gray-900">{value}</span>
  </div>
);

export default ActivityCard;
import { useNavigate } from 'react-router-dom';
import { CalendarCheck, Users, TrendingUp, Clock, Repeat, LogIn, LogOut } from 'lucide-react';

import ActivityCard from "../components/ActivityCard";
import AttendanceChart from "../components/AttendanceChart";
import CrossActivityAnalysis from "../components/CrossActivityAnalysis";
import SummaryMetrics from "../components/SummaryMetrics";
import { Button } from '../components/ui/Button';
import { UtilService } from '../services/utilService';


const Dashboard = () => {
  const navigate = useNavigate();

  // Mock data - replace with actual API calls
  const activities = [
    { id: 1, name: 'Activity A', color: '#3B82F6', sheetName: 'Activity_A' },
    { id: 2, name: 'Activity B', color: '#10B981', sheetName: 'Activity_B' },
    { id: 3, name: 'Activity C', color: '#F59E0B', sheetName: 'Activity_C' },
    { id: 4, name: 'Activity D', color: '#EF4444', sheetName: 'Activity_D' },
  ];

  const handleTakeAttendance = () => {
    navigate('/attendance');
  };

  const handleLogout = () => {
    localStorage.removeItem('lakeside_auth');
    navigate('/', { replace: true });
  };


  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header with Quick Actions */}
      <header className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Activity Attendance Dashboard</h1>
            <p className="text-gray-600 mt-2">Monitor participation across all activities</p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button variant='primary' icon={LogIn} onClick={handleTakeAttendance} >
              Take Attendance
            </Button>

            <button className="flex items-center gap-2 px-4 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition shadow-sm">
              <CalendarCheck className="w-5 h-5" />
              <span>Generate Report</span>
            </button>

            <Button variant='danger' icon={LogOut} onClick={UtilService.handleLogout} />
           
          </div>
        </div>

        {/* Stats Summary Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-4 rounded-xl shadow-sm">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">156</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">Total Participants</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="text-2xl font-bold text-gray-900">82%</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">Avg. Attendance</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <Clock className="w-5 h-5 text-amber-600" />
              <span className="text-2xl font-bold text-gray-900">9-11 AM</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">Peak Hours</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <Repeat className="w-5 h-5 text-purple-600" />
              <span className="text-2xl font-bold text-gray-900">34%</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">Cross-Activity</p>
          </div>
        </div>
      </header>

      {/* Overall Summary Metrics */}
      <SummaryMetrics />

      {/* Quick Attendance Actions */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Quick Attendance</h2>
          <span className="text-sm text-gray-500">Select activity to mark attendance</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {activities.map((activity) => (
            <button
              key={activity.id}
              onClick={() => handleTakeAttendance()}
              className="group flex flex-col items-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition border border-gray-200 hover:border-blue-300"
            >
              <div
                className="w-12 h-12 rounded-lg mb-3 flex items-center justify-center group-hover:scale-110 transition"
                style={{ backgroundColor: activity.color + '20' }} // 20 = 12% opacity
              >
                <div
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: activity.color }}
                ></div>
              </div>
              <span className="font-medium text-gray-900 mb-1">{activity.name}</span>
              <span className="text-sm text-gray-600">Click to mark attendance</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Activity Cards */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Activity Overview</h2>
            <select className="text-sm border border-gray-300 rounded-lg px-3 py-2">
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Year</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onTakeAttendance={() => handleTakeAttendance()}
              />
            ))}
          </div>
        </div>

        {/* Attendance Trends Chart */}
        <div className="lg:col-span-1">
          <AttendanceChart activities={activities} />
        </div>
      </div>

      {/* Cross-Activity Analysis */}
      {/* <CrossActivityAnalysis activities={activities} /> */}
      <CrossActivityAnalysis />

      {/* Bottom Navigation */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex flex-wrap gap-4 justify-between">
          <div className="flex gap-3">
            <button
              onClick={() => handleTakeAttendance()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2"
            >
              <LogIn className="w-5 h-5" />
              Take Attendance
            </button>
            <button className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium">
              View All Records
            </button>
          </div>

          <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium">
            Export Dashboard Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
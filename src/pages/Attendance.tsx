// AttendanceApp.tsx (Updated)
import React, { useState, useEffect, useMemo } from 'react';
import {
  Users, Calendar, Save, CheckCircle,
  Moon, Sun, Sparkles,
  Activity, Target, RefreshCw, ShieldCheck,
  Download, Eye,
  LogOut
} from 'lucide-react';
import type { User, Activity as ActivityType } from '../utils/types';
import { UserList } from '../components/UserList';
import { CreateUserModal } from '../components/CreateUserModal';
import { PreviewModal } from '../components/PreviewModal';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ApiService } from '../services/apiService';
import { UtilService } from '../services/utilService';


const Attendance: React.FC = () => {
  // State
  const [attendees, setAttendees] = useState<User[]>([]);
  const [selectedAttendees, setSelectedAttendees] = useState<User[]>([]);
  const [activities] = useState<ActivityType[]>([
    { id: 'Med', name: 'Meditation', frequency: 'Weekly', icon: <Moon />, color: 'blue', gradient: 'from-blue-500 to-cyan-500' },
    { id: 'Circle', name: 'Circle', frequency: 'Weekly', icon: <Users />, color: 'purple', gradient: 'from-purple-500 to-pink-500' },
    { id: 'Recollection', name: 'Recollection', frequency: 'Monthly', icon: <Activity />, color: 'emerald', gradient: 'from-emerald-500 to-green-500' },
    { id: 'Retreat', name: 'Retreat', frequency: 'Yearly', icon: <Target />, color: 'amber', gradient: 'from-amber-500 to-orange-500' },
  ]);
  const [selectedActivity, setSelectedActivity] = useState<string>('Med');
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' }>({ text: '', type: 'info' });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    todayAttendance: 0,
    monthlyAvg: 0,
    activityStats: {}
  });

  // Filter attendees based on search
  const filteredAttendees = useMemo(() => {
    if (!searchQuery.trim()) return attendees;

    const query = searchQuery.toLowerCase();
    return attendees.filter(attendee =>
      attendee.firstName.toLowerCase().includes(query) ||
      attendee.lastName.toLowerCase().includes(query) ||
      attendee.email?.toLowerCase().includes(query) ||
      attendee.phone?.includes(query)
    );
  }, [attendees, searchQuery]);

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const temp = await ApiService.getAttendees();
      const data = UtilService.processUser(temp);
      setAttendees(data);

      // TODO: Fetch and compute stats properly
      setStats({
        totalUsers: data.length,
        todayAttendance: 12,
        monthlyAvg: 85,
        activityStats: {}
      });

      showMessage('Data loaded successfully', 'success');
    } catch (error) {
      showMessage('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: 'info' }), 4000);
  };

  const handleSelectAttendee = (attendee: User) => {
    setSelectedAttendees(prev => [...prev, attendee]);
  };

  const handleDeselectAttendee = (attendeeId: string) => {
    setSelectedAttendees(prev => prev.filter(a => a.id !== attendeeId));
  };

  const handleCreateAttendee = async (data: { firstName: string; lastName: string; email: string; phone?: string }) => {
    setLoading(true);
    try {
      const newAttendeeTemp = await ApiService.addAttendee(data.firstName, data.lastName, data.email, data.phone);
      const newAttendee = UtilService.processUser([newAttendeeTemp])[0];
      setAttendees(prev => [...prev, newAttendee]);
      setSelectedAttendees(prev => [...prev, newAttendee]);
      setShowCreateModal(false);
      showMessage('Attendee created successfully', 'success');
    } catch (error) {
      showMessage('Failed to create attendee', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAttendance = async () => {
    if (selectedAttendees.length === 0) {
      showMessage('Please select at least one attendee', 'error');
      return;
    }

    setSaving(true);
    try {
      const dataToSave = { attendees: selectedAttendees.map(a => ({ id: a.id, name: a.firstName + ' ' + a.lastName })), activity: selectedActivity, date: selectedDate };
      await ApiService.recordAttendance(dataToSave);
      showMessage(`Attendance saved for ${selectedAttendees.length} attendees`, 'success');
      setSelectedAttendees([]);
      setShowPreviewModal(false);
    } catch (error) {
      showMessage('Failed to save attendance', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = () => {
    if (selectedAttendees.length === 0) {
      showMessage('Please select at least one attendee', 'error');
      return;
    }
    setShowPreviewModal(true);
  };

  const selectedActivityData = activities.find(a => a.id === selectedActivity);

  return (
    <div className={`min-h-screen transition-colors duration-500 ${darkMode
      ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900/20 text-white'
      : 'bg-gradient-to-br from-gray-50 via-white to-blue-50/30'
      }`}>
      {/* Message Banner */}
      {message.text && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md animate-slide-down">
          <div className={`rounded-xl p-4 shadow-lg ${message.type === 'success'
            ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-800'
            : message.type === 'error'
              ? 'bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 text-red-800'
              : 'bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 text-blue-800'
            }`}>
            <div className="flex items-center gap-3">
              {message.type === 'success' && <CheckCircle className="w-5 h-5" />}
              <span className="font-medium">{message.text}</span>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-success-500 rounded-full border-2 border-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">LS Data Tracker</h1>
                <p className="text-sm text-gray-500"> User Attendance System</p>
              </div>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-3 rounded-2xl transition-all duration-300 ${darkMode
                ? 'bg-gray-800 text-yellow-300 hover:bg-gray-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <Button variant='danger' icon={LogOut} onClick={UtilService.handleLogout} />

          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card hoverable>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalUsers}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>

          <Card hoverable>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Selected</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{selectedAttendees.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>

          <Card hoverable>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Activity</p>
                <p className="text-lg font-bold text-gray-900 mt-2">
                  {selectedActivityData?.name}
                </p>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-r ${selectedActivityData?.gradient} rounded-xl flex items-center justify-center`}>
                {selectedActivityData?.icon}
              </div>
            </div>
          </Card>

          <Card hoverable>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="text-lg font-bold text-gray-900 mt-2">
                  {new Date(selectedDate).toLocaleDateString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
        </div>

        {/* Main Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Activity & Date Selection */}
          <div className="lg:col-span-1">
            <Card>
              <div className="space-y-6">
                {/* Activity Selection */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary-500" />
                    Select Activity
                  </h3>
                  <div className="space-y-3">
                    {activities.map((activity) => (
                      <button
                        key={activity.id}
                        onClick={() => setSelectedActivity(activity.id)}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 ${selectedActivity === activity.id
                          ? `border-${activity.color}-500 bg-${activity.color}-50 ring-2 ring-${activity.color}-200`
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                      >
                        <div className={`w-12 h-12 bg-gradient-to-r ${activity.gradient} rounded-xl flex items-center justify-center`}>
                          <div className="w-6 h-6 text-white">
                            {activity.icon}
                          </div>
                        </div>
                        <div className="text-left flex-1">
                          <div className="font-semibold text-gray-900">{activity.name}</div>
                          <div className="text-sm text-gray-500">{activity.frequency}</div>
                        </div>
                        {selectedActivity === activity.id && (
                          <CheckCircle className="w-5 h-5 text-primary-500" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date Selection */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Select Date</h3>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Quick Stats */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <span className="text-gray-600">Selected</span>
                      <Badge variant="primary">{selectedAttendees.length}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <span className="text-gray-600">Total Available</span>
                      <span className="font-semibold">{attendees.length}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <span className="text-gray-600">Search Results</span>
                      <span className="font-semibold">{filteredAttendees.length}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    variant="secondary"
                    icon={Eye}
                    onClick={handlePreview}
                    disabled={selectedAttendees.length === 0}
                    fullWidth
                  >
                    Preview Attendance
                  </Button>
                  <Button
                    variant="primary"
                    icon={Save}
                    loading={saving}
                    onClick={handlePreview}
                    disabled={selectedAttendees.length === 0}
                    fullWidth
                  >
                    Save Attendance ({selectedAttendees.length})
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Attendee List */}
          <div className="lg:col-span-2">
            <UserList
              users={filteredAttendees}
              selectedAttendees={selectedAttendees}
              onSelect={handleSelectAttendee}
              onDeselect={handleDeselectAttendee}
              onCreateNew={() => setShowCreateModal(true)}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              isLoading={loading}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`${darkMode ? 'bg-gray-900/50' : 'bg-white/50'} backdrop-blur-md border-t ${darkMode ? 'border-gray-800' : 'border-gray-100'} mt-12`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-primary-500" />
              <span className="text-sm text-gray-600">
                Secured with end-to-end encryption
              </span>
            </div>
            <div className="flex items-center gap-6">
              <Button
                variant="ghost"
                size="sm"
                icon={RefreshCw}
                onClick={loadData}
                loading={loading}
              >
                Refresh
              </Button>
              <Button
                variant="secondary"
                size="sm"
                icon={Download}
              >
                Export Data
              </Button>
            </div>
          </div>
        </div>
      </footer>

      {/* Create Attendee Modal */}
      <CreateUserModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateAttendee}
        loading={loading}
      />

      {/* Preview Modal */}
      <PreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        onSubmit={handleSaveAttendance}
        onEdit={() => setShowPreviewModal(false)}
        selectedAttendees={selectedAttendees}
        selectedActivity={selectedActivity}
        selectedDate={selectedDate}
        activities={activities}
        loading={saving}
      />
    </div>
  );
};

export default Attendance;
import React, { useState, useEffect, useMemo } from 'react';
import {
  Users, Calendar, Save, CheckCircle,
  Moon, Sun, Sparkles,
  Activity, Target, RefreshCw, ShieldCheck,
  Download, Eye,
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import type { User, Activity as ActivityType, CircleGroup } from '../utils/types';
import { UserList } from '../components/UserList';
import { CreateUserModal } from '../components/CreateUserModal';
import { PreviewModal } from '../components/PreviewModal';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import apiService from '../services/apiService';
import { UtilService } from '../services/utilService';
import { useAttendeesData, useCircleGroupsData } from '../hooks/useAttendanceData';
import Header from '../components/Header';
import ActivitySelectModal from '../components/AcitivitySelectModal';



const Attendance: React.FC = () => {
  // State
  const [selectedAttendees, setSelectedAttendees] = useState<User[]>([]);
  const [activities] = useState<ActivityType[]>([
    { id: 'Med', name: 'Meditation', frequency: 'Weekly', icon: <Moon />, color: 'blue', gradient: 'from-blue-500 to-cyan-500' },
    { id: 'Circle', name: 'Circle', frequency: 'Weekly', icon: <Users />, color: 'purple', gradient: 'from-purple-500 to-pink-500' },
    { id: 'Recollection', name: 'Recollection', frequency: 'Monthly', icon: <Activity />, color: 'emerald', gradient: 'from-emerald-500 to-green-500' },
    { id: 'Retreat', name: 'Retreat', frequency: 'Yearly', icon: <Target />, color: 'amber', gradient: 'from-amber-500 to-orange-500' },
  ]);

  const [circleGroups, setCircleGroups] = useState<ActivityType[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<ActivityType>(activities[0]);
  const [selectedCircleGroup, setSelectedCircleGroup] = useState<ActivityType | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' }>({ text: '', type: 'info' });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showSelectActivityModal, setShowSelectActivityModal] = useState(false);
  const [showSelectCircleModal, setShowSelectCircleModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const { data: attendeesData, isLoading, error, refetch } = useAttendeesData();
  const { data: circleGroupsData, isLoading: isCircleGroupsLoading, refetch: refetchCircleGroups } = useCircleGroupsData();


  // Process attendees data when loaded
  const attendees = useMemo(() => {
    if (!attendeesData) return [];
    return UtilService.processUser(attendeesData);
  }, [attendeesData]);

  const processCircleGroups = (circleGroupsData: CircleGroup[]): ActivityType[] => {
    return circleGroupsData.map(cg => ({
      id: cg.id,
      name: cg.name,
      frequency: 'Weekly',
      icon: <Users />,
      color: 'amber',
      gradient: 'from-amber-500 to-orange-500'
    }));

  }

  useMemo(() => {
    if (!circleGroupsData) return [];
    const cg = processCircleGroups(circleGroupsData);
    setCircleGroups(cg);
  }, [circleGroupsData]);

  // Compute stats
  const stats = useMemo(() => {
    const totalUsers = attendees.length;
    const todayAttendance = selectedAttendees.length;

    // Calculate monthly average (placeholder logic - adjust as needed)
    const monthlyAvg = totalUsers > 0
      ? Math.min(Math.round((selectedAttendees.length / totalUsers) * 100), 100)
      : 0;

    const activityStats = activities.reduce((acc, activity) => {
      acc[activity.id] = {
        total: Math.floor(Math.random() * 50) + 10,
        average: Math.floor(Math.random() * 30) + 5
      };
      return acc;
    }, {} as Record<string, { total: number; average: number }>);

    return {
      totalUsers,
      todayAttendance,
      monthlyAvg,
      activityStats
    };
  }, [attendees.length, selectedAttendees.length, activities]);

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

  // Show message when data loads or errors occur
  useEffect(() => {
    if (error) {
      showMessage('Failed to load data', 'error');
    } else if (attendeesData && !isLoading) {
      showMessage('Data loaded successfully', 'success');
    }
  }, [error, attendeesData, isLoading]);

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
    try {
      const newAttendeeTemp = await apiService.addAttendee(data.firstName, data.lastName, data.email, data.phone);
      const newAttendee = UtilService.processUser([newAttendeeTemp])[0];

      // Invalidate and refetch the attendees data
      await refetch();

      // Add to selected attendees
      setSelectedAttendees(prev => [...prev, newAttendee]);
      setShowCreateModal(false);
      showMessage('Attendee created successfully', 'success');
    } catch (error) {
      showMessage('Failed to create attendee', 'error');
    }
  };

  const handleSaveAttendance = async () => {
    if (selectedAttendees.length === 0) {
      showMessage('Please select at least one attendee', 'error');
      return;
    }

    if (!selectedDate) {
      showMessage('Please select a date', 'error');
      return;
    }

    if (selectedActivity.id === 'Circle' && selectedCircleGroup === null) {
      showMessage('Please select a circle group', 'error');
      return;
    }

    setSaving(true);
    try {
      const dataToSave = {
        attendees: selectedAttendees.map(a => ({
          id: a.id,
          name: a.firstName + ' ' + a.lastName
        })),
        activity: selectedActivity.id,
        date: selectedDate,
        groupId: selectedCircleGroup!.id,
        groupName: selectedCircleGroup!.name
      };
      await apiService.recordAttendance(dataToSave);
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

  const openSelectActivityModal = () => {
    setShowSelectActivityModal(true);
  };

  const openSelectCircleGroupModal = () => {
    setShowSelectCircleModal(true);
  };


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
              {message.type === 'error' && <AlertCircle className="w-5 h-5" />}
              <span className="font-medium">{message.text}</span>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <Header title="Take Attendance" >
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-3 rounded-2xl transition-all duration-300 ${darkMode
            ? 'bg-gray-800 text-yellow-300 hover:bg-gray-700'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </Header>

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
                  {selectedActivity?.name}
                </p>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-r ${selectedActivity?.gradient} rounded-xl flex items-center justify-center`}>
                {selectedActivity.icon}
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

                {/* Activity Selection */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary-500" />
                    Select Activity
                  </h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => openSelectActivityModal()}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 ${selectedActivity
                        ? `border-${selectedActivity.color}-500 bg-${selectedActivity.color}-50 ring-2 ring-${selectedActivity.color}-200`
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                      <div className={`w-12 h-12 bg-gradient-to-r ${selectedActivity?.gradient} rounded-xl flex items-center justify-center`}>
                        <div className="w-6 h-6 text-white">
                          {selectedActivity?.icon}
                        </div>
                      </div>
                      <div className="text-left flex-1">
                        <div className="font-semibold text-gray-900">{selectedActivity?.name}</div>
                        <div className="text-sm text-gray-500">{selectedActivity?.frequency}</div>
                      </div>

                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>


                {/* Circle Group Selection - only when circle is selected */}
                {selectedActivity?.id === 'Circle' && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary-500" />
                      Selected Circle Group
                    </h3>
                    {isCircleGroupsLoading ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {[...Array(8)].map((_, i) => (
                          <Card key={i} className="animate-pulse">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gray-200 rounded-xl" />
                              <div className="space-y-2 flex-1">
                                <div className="h-4 bg-gray-200 rounded w-3/4" />
                                <div className="h-3 bg-gray-200 rounded w-1/2" />
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    ) : circleGroups.length == 0 ? (
                      <div className="text-center py-8">
                        <div className="text-gray-500 mb-2">No circle groups available</div>
                        <Button variant="danger" onClick={()=> refetchCircleGroups()}>
                          Retry
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <button
                          onClick={() => openSelectCircleGroupModal()}
                          className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 ${selectedCircleGroup
                            ? `border-${selectedCircleGroup.color}-500 bg-${selectedCircleGroup.color}-50 ring-2 ring-${selectedCircleGroup.color}-200`
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                          <div className={`w-12 h-12 bg-gradient-to-r ${selectedCircleGroup?.gradient} rounded-xl flex items-center justify-center`}>
                            <div className="w-6 h-6 text-white">
                              {selectedCircleGroup?.icon}
                            </div>
                          </div>
                          <div className="text-left flex-1">
                            <div className="font-semibold text-gray-900">{selectedCircleGroup?.name}</div>
                            <div className="text-sm text-gray-500">{selectedCircleGroup?.frequency}</div>
                          </div>

                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    )}

                  </div>

                )}


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
                    onClick={handleSaveAttendance}
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
              isLoading={isLoading}
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
                onClick={() => refetch()}
                loading={isLoading}
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
        loading={isLoading}
      />

      {/* Preview Modal */}
      <PreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        onSubmit={handleSaveAttendance}
        onEdit={() => setShowPreviewModal(false)}
        selectedAttendees={selectedAttendees}
        selectedActivity={selectedActivity.id}
        selectedCircleGroup={selectedCircleGroup?.name || ''}
        selectedDate={selectedDate}
        activities={activities}
        loading={saving}
      />
      {/* Activity Select Modal */}
      <ActivitySelectModal
        isOpen={showSelectActivityModal}
        selectedActivity={selectedActivity.id}
        onClose={() => setShowSelectActivityModal(false)}
        activities={activities}
        onSelectActivity={(activity) => setSelectedActivity(activity)}
      />

      {/* Circle Select Modal Select Modal */}
      <ActivitySelectModal
        isOpen={showSelectCircleModal}
        selectedActivity={selectedCircleGroup?.id || ''}
        onClose={() => setShowSelectCircleModal(false)}
        activities={circleGroups}
        onSelectActivity={(circleGroup) => setSelectedCircleGroup(circleGroup)}
      />
    </div>
  );
};

export default Attendance;
// components/PreviewModal.tsx
import React from 'react';
import {
  X, Calendar, Users, Activity, CheckCircle,
  AlertCircle, Save, Edit2, Clock, Hash,
  UserCheck, Mail, Phone
} from 'lucide-react';
import type { User } from '../utils/types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onEdit: () => void;
  selectedAttendees: User[];
  selectedActivity: string;
  selectedCircleGroup: string;
  selectedDate: string;
  activities: Array<{
    id: string;
    name: string;
    frequency: string;
    icon: React.ReactNode;
    color: string;
    gradient: string;
  }>;
  loading?: boolean;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onEdit,
  selectedAttendees,
  selectedActivity,
  selectedCircleGroup,
  selectedDate,
  activities,
  loading = false,
}) => {
  if (!isOpen) return null;

  const selectedActivityData = activities.find(a => a.id === selectedActivity);
  const formattedDate = new Date(selectedDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const totalSessions = selectedAttendees.reduce((sum, attendee) => sum + (attendee?.totalSessions || 0), 0);
  const avgSessions = selectedAttendees.length > 0 ? Math.round(totalSessions / selectedAttendees.length) : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity animate-fade-in"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative w-full max-w-4xl">
          <Card className="animate-slide-up max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                    <UserCheck className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Review Attendance</h3>
                    <p className="text-gray-600">Preview and confirm attendance details</p>
                  </div>
                </div>

                {/* Summary Badges */}
                <div className="flex flex-wrap items-center gap-3 mt-4">
                  <Badge variant="primary">
                    <Activity className="w-3 h-3 mr-1" />
                    {selectedActivityData?.name}
                  </Badge>
                  <Badge variant="success">
                    <Calendar className="w-3 h-3 mr-1" />
                    {formattedDate}
                  </Badge>
                  <Badge variant="warning">
                    <Users className="w-3 h-3 mr-1" />
                    {selectedAttendees.length} attendees
                  </Badge>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin">
              <div className="space-y-6">
                {/* Activity & Date Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Activity Card */}
                  <Card className="lg:col-span-2">
                    <div className="flex items-start gap-4">
                      <div className={`w-16 h-16 bg-gradient-to-r ${selectedActivityData?.gradient} rounded-2xl flex items-center justify-center`}>
                        <div className="w-8 h-8 text-white">
                          {selectedActivityData?.icon}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 text-lg">{selectedActivityData?.name}</h4>
                        <p className="text-gray-600 mb-3">{selectedActivityData?.frequency} Session</p>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>Date: {formattedDate}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Hash className="w-4 h-4" />
                            <span>ID: {selectedActivity}</span>
                          </div>
                          {selectedCircleGroup && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <Users className="w-4 h-4" />
                              <span>Circle Group: {selectedCircleGroup}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Stats Card */}
                  <Card>
                    <h5 className="font-semibold text-gray-900 mb-4">Attendance Summary</h5>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Total Attendees</span>
                        <span className="font-bold text-gray-900">{selectedAttendees.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">New Attendees</span>
                        <span className="font-bold text-green-600">
                          {selectedAttendees.filter(a => !a.lastAttendance).length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Avg. Sessions</span>
                        <span className="font-bold text-blue-600">{avgSessions}</span>
                      </div>
                      <div className="pt-3 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-gray-900">Total Sessions</span>
                          <span className="font-bold text-primary-600">{totalSessions}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Selected Attendees */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary-500" />
                      Selected Attendees ({selectedAttendees.length})
                    </h4>
                    <Badge variant="primary">
                      {selectedAttendees.length} selected
                    </Badge>
                  </div>

                  {/* Attendee Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedAttendees.map((attendee) => (
                      <Card key={attendee.id} hoverable className="relative">
                        <div className="flex items-start gap-3">
                          {/* Avatar */}
                          <div className="relative">
                            <div
                              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold"
                              style={{ backgroundColor: attendee.avatarColor }}
                            >
                              {getInitials(attendee.firstName + ' ' + attendee.lastName)}
                            </div>
                            {!attendee.lastAttendance && (
                              <div className="absolute -top-1 -right-1">
                                <Badge variant="success" size="sm">
                                  New
                                </Badge>
                              </div>
                            )}
                          </div>

                          {/* Details */}
                          <div className="flex-1 min-w-0">
                            <h5 className="font-semibold text-gray-900 truncate">{attendee.firstName}</h5>
                            <div className="space-y-1 mt-2">
                              {attendee.email && (
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Mail className="w-3 h-3" />
                                  <span className="truncate">{attendee.email}</span>
                                </div>
                              )}
                              {attendee.phone && (
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Phone className="w-3 h-3" />
                                  <span>{attendee.phone}</span>
                                </div>
                              )}
                            </div>

                            {/* Stats */}
                            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
                              <div className="flex items-center gap-1 text-sm">
                                <Activity className="w-3 h-3 text-gray-400" />
                                <span className="font-medium">{attendee.totalSessions}</span>
                                <span className="text-gray-500">sessions</span>
                              </div>
                              {attendee.lastAttendance && (
                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                  <Calendar className="w-3 h-3" />
                                  <span>Last: {new Date(attendee.lastAttendance).toLocaleDateString()}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Check Mark */}
                        <div className="absolute top-3 right-3">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                      </Card>
                    ))}
                  </div>

                  {/* Empty State */}
                  {selectedAttendees.length === 0 && (
                    <Card className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Users className="w-8 h-8 text-gray-400" />
                      </div>
                      <h5 className="font-semibold text-gray-900 mb-2">No attendees selected</h5>
                      <p className="text-gray-600">Please select attendees to continue</p>
                    </Card>
                  )}
                </div>

                {/* Important Notes */}
                <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">Important Information</h5>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5" />
                          Attendance records are permanent and cannot be modified after submission
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5" />
                          You're recording attendance for {selectedAttendees.length} attendees
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5" />
                          Attendance will be marked for {selectedActivityData?.name} session on {formattedDate}
                        </li>
                      </ul>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 mt-6 border-t border-gray-200">
              <Button
                variant="ghost"
                onClick={onClose}
                fullWidth
                className="sm:flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="secondary"
                icon={Edit2}
                onClick={onEdit}
                fullWidth
                className="sm:flex-1"
              >
                Edit Selection
              </Button>
              <Button
                variant="primary"
                icon={Save}
                loading={loading}
                onClick={onSubmit}
                disabled={selectedAttendees.length === 0}
                fullWidth
                className="sm:flex-1"
              >
                Confirm & Save Attendance
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
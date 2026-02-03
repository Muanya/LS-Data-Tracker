import React, { useState } from 'react';
import { Search, UserPlus, Filter, Check, X, Users, Calendar } from 'lucide-react';
import type { User } from '../utils/types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

interface UserListProps {
  users: User[];
  selectedAttendees: User[];
  onSelect: (attendee: User) => void;
  onDeselect: (attendeeId: string) => void;
  onCreateNew: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isLoading?: boolean;
}

export const UserList: React.FC<UserListProps> = ({
  users: users,
  selectedAttendees,
  onSelect,
  onDeselect,
  onCreateNew,
  searchQuery,
  onSearchChange,
  isLoading = false,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterActive, setFilterActive] = useState(false);

  const isSelected = (attendeeId: string) => {
    return selectedAttendees.some(a => a.id === attendeeId);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Attendees</h2>
          <p className="text-gray-600 mt-1">
            {selectedAttendees.length} of {users.length} selected
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 lg:flex-none">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search attendees..."
              className="w-full lg:w-64 pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-primary-600'
                }`}
            >
              <div className="w-5 h-5 grid grid-cols-2 gap-0.5">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-full h-full bg-current rounded-sm" />
                ))}
              </div>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'list'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-primary-600'
                }`}
            >
              <div className="w-5 h-5 flex flex-col justify-between">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-full h-0.5 bg-current rounded-full" />
                ))}
              </div>
            </button>
          </div>

          {/* Create New */}
          <Button
            variant="secondary"
            icon={UserPlus}
            onClick={onCreateNew}
          >
            New
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => setFilterActive(!filterActive)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${filterActive
              ? 'bg-primary-50 text-primary-700 border border-primary-200'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
        >
          <Filter className="w-4 h-4" />
          Filters
        </button>

        {selectedAttendees.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <Badge variant="primary">
              {selectedAttendees.length} selected
            </Badge>
            <button
              onClick={() => selectedAttendees.forEach(a => onDeselect(a.id))}
              className="flex items-center gap-1 px-3 py-1 text-sm text-error-600 hover:text-error-700 hover:bg-error-50 rounded-lg transition-colors"
            >
              <X className="w-3 h-3" />
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Attendee Grid/List */}
      {isLoading ? (
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
      ) : users.length === 0 ? (
        <Card className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-600 mb-6">Try a different search or create a new user</p>
          <Button onClick={onCreateNew} icon={UserPlus}>
            Create First User
          </Button>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {users.map((attendee) => {
            const selected = isSelected(attendee.id);
            return (
              <Card
                key={attendee.id}
                hoverable
                className={`relative cursor-pointer transition-all duration-300 ${selected ? 'ring-2 ring-primary-500 ring-offset-2' : ''
                  }`}
              >
                <div
                  onClick={() => selected ? onDeselect(attendee.id) : onSelect(attendee)}
                  className="cursor-pointer"
                >
                  {selected && (
                    <div className="absolute -top-2 -right-2 z-10">
                      <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full flex items-center justify-center shadow-lg">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: attendee.avatarColor }}
                    >
                      {getInitials(attendee.firstName + ' ' + attendee.lastName)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 truncate">
                        {attendee.firstName} {attendee.lastName}
                      </h4>
                      {attendee.email && (
                        <p className="text-sm text-gray-500 truncate mt-1">
                          {attendee.email}
                        </p>
                      )}

                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Calendar className="w-3 h-3" />
                          <span>{attendee.totalSessions}</span>
                        </div>
                        {attendee.lastAttendance && (
                          <Badge variant="success" size="sm">
                            Recent
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        // List View
        <Card padding="none" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Sessions
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Last Attended
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((attendee) => {
                  const selected = isSelected(attendee.id);
                  return (
                    <tr
                      key={attendee.id}
                      className={`hover:bg-gray-50 cursor-pointer transition-colors ${selected ? 'bg-primary-50' : ''
                        }`}
                      onClick={() => selected ? onDeselect(attendee.id) : onSelect(attendee)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                            style={{ backgroundColor: attendee.avatarColor }}
                          >
                            {getInitials(attendee.firstName + ' ' + attendee.lastName)}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {attendee.firstName} {attendee.lastName}
                              {selected && (
                                <Check className="w-4 h-4 text-primary-600 inline ml-2" />
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {attendee.email && (
                            <div className="text-sm text-gray-600">{attendee.email}</div>
                          )}
                          {attendee.phone && (
                            <div className="text-sm text-gray-600">{attendee.phone}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">{attendee.totalSessions}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">
                          {attendee.lastAttendance || 'Never'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {attendee.lastAttendance ? (
                          <Badge variant="success">Active</Badge>
                        ) : (
                          <Badge variant="warning">New</Badge>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};
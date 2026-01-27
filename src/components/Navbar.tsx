import { Users, UserCheck, TrendingUp, RefreshCw } from 'lucide-react';

interface NavbarProps {
  view: string;
  setView: (view: 'record' | 'summary') => void;
  stats?: { todayAttendance: number; totalAttendees: number };
  loading?: boolean;
  onRefresh: () => void;
}

const Navbar = ({ 
  view, 
  setView, 
  stats = { todayAttendance: 0, totalAttendees: 0 }, 
  loading = false, 
  onRefresh 
}: NavbarProps) => {
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            {/* Logo Section */}
            <div className="flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">LS Tracker</h1>
                  <p className="text-xs text-gray-500">Attendance System</p>
                </div>
              </div>
            </div>

            {/* View Tabs */}
            <div className="ml-10 flex items-baseline space-x-4">
              <button
                onClick={() => setView('record')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  view === 'record'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                    : 'text-gray-700 hover:text-indigo-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4" />
                  Record
                </div>
              </button>
              
              <button
                onClick={() => setView('summary')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  view === 'summary'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                    : 'text-gray-700 hover:text-indigo-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Analytics
                </div>
              </button>
            </div>
          </div>

          {/* Stats & Actions */}
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Today's Attendance</p>
                <p className="text-lg font-bold text-gray-900">{stats.todayAttendance}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Attendees</p>
                <p className="text-lg font-bold text-gray-900">{stats.totalAttendees}</p>
              </div>
            </div>

            <button
              onClick={onRefresh}
              disabled={loading}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              title="Refresh"
            >
              <RefreshCw className={`w-5 h-5 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
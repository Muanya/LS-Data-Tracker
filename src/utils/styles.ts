export const styles = {
    container: 'min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4',
    mainContainer: 'max-w-7xl mx-auto',
    message: 'mb-4 p-4 bg-indigo-100 border border-indigo-300 text-indigo-800 rounded-lg',
    card: 'bg-white rounded-lg shadow-lg p-6 mb-6',
    header: 'flex items-center justify-between mb-6',
    titleContainer: 'flex items-center gap-3',
    titleIcon: 'w-8 h-8 text-indigo-600',
    title: 'text-3xl font-bold text-gray-800',
    viewToggleContainer: 'flex gap-2',
    viewToggleButton: (active: boolean) =>
        `px-4 py-2 rounded-lg font-medium transition-colors ${active
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`,

    // Search Section
    searchSection: 'bg-indigo-50 p-4 rounded-lg',
    sectionTitle: 'text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2',
    searchInput: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
    searchResults: 'absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto',
    searchResultItem: 'px-4 py-3 hover:bg-indigo-50 cursor-pointer border-b border-gray-100 last:border-b-0',
    createNewCard: 'absolute z-10 w-full mt-2 bg-white border border-green-300 rounded-lg shadow-lg p-4',
    selectedItem: 'mt-4 p-3 bg-white border-2 border-indigo-400 rounded-lg flex items-center justify-between',

    // Circle Group Section
    circleGroupSection: 'bg-purple-50 p-4 rounded-lg',

    // Attendance Section
    attendanceSection: 'bg-gray-50 p-4 rounded-lg',
    formGrid: 'grid grid-cols-1 md:grid-cols-2 gap-4 mb-4',
    formLabel: 'block text-sm font-medium text-gray-700 mb-2',
    selectInput: 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
    dateInput: 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent',

    // Buttons
    primaryButton: (color: string = 'indigo') =>
        `px-4 py-2 bg-${color}-600 text-white rounded-lg hover:bg-${color}-700 transition-colors`,
    createButton: 'flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50',
    clearButton: 'px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300',
    recordButton: (isPresent: boolean) =>
        `w-full py-3 rounded-lg font-semibold text-white transition-colors ${isPresent ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
        } disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`,

    // Today's Attendance
    todayAttendance: 'bg-blue-50 p-4 rounded-lg',
    attendanceRecord: 'bg-white p-3 rounded border border-gray-200',

    // Summary View
    dateRangeSection: 'bg-gray-50 p-4 rounded-lg',
    summaryToggleContainer: 'flex gap-2',
    summaryToggleButton: (active: boolean) =>
        `flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${active
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`,

    // Activity Summary
    activitySummarySection: 'bg-indigo-50 p-4 rounded-lg',
    summaryCard: 'bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-lg transition-shadow',
    exportButton: 'flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium',

    // Attendee Summary
    attendeeSummarySection: 'bg-green-50 p-4 rounded-lg',
    table: 'w-full bg-white rounded-lg overflow-hidden',
    tableHeader: 'bg-gray-100',
    tableRow: 'border-t border-gray-200 hover:bg-gray-50',
    tableCell: 'px-4 py-3',
    detailButton: 'text-sm px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700',

    // Detail Sections
    detailGrid: 'grid grid-cols-1 md:grid-cols-2 gap-4 mb-4',
    detailCard: 'bg-white p-4 rounded-lg',
    detailList: 'space-y-2 max-h-60 overflow-y-auto',
    detailItem: 'p-2 bg-gray-50 rounded',

    // Empty States
    emptyState: 'text-center text-gray-500 py-8',
    emptyAttendance: 'text-center text-gray-500 py-4',
};
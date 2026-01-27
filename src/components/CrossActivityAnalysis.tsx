

interface CrossActivityAnalysisProps {}

const CrossActivityAnalysis: React.FC<CrossActivityAnalysisProps> = () => {
  const crossAttendance = [
    { attendee: 'John Doe', activities: ['A', 'B', 'C'], count: 3 },
    { attendee: 'Jane Smith', activities: ['A', 'D'], count: 2 },
    { attendee: 'Bob Johnson', activities: ['B', 'C', 'D'], count: 3 },
    { attendee: 'Alice Brown', activities: ['A', 'B'], count: 2 },
  ];

  const activityComparison = [
    { pair: 'A & B', overlap: '65%', correlation: 'High' },
    { pair: 'B & C', overlap: '42%', correlation: 'Medium' },
    { pair: 'C & D', overlap: '38%', correlation: 'Medium' },
    { pair: 'A & D', overlap: '28%', correlation: 'Low' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-5">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Cross-Activity Analysis</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Multi-Activity Participants */}
        <div>
          <h4 className="font-medium text-gray-700 mb-4">Multi-Activity Participants</h4>
          <div className="space-y-3">
            {crossAttendance.map((person, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{person.attendee}</p>
                  <p className="text-sm text-gray-600">Activities: {person.activities.join(', ')}</p>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  {person.count} activities
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Relationships */}
        <div>
          <h4 className="font-medium text-gray-700 mb-4">Activity Relationships</h4>
          <div className="space-y-3">
            {activityComparison.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <span className="font-medium text-gray-900">{item.pair}</span>
                <div className="flex items-center gap-4">
                  <span className="text-gray-700">Overlap: {item.overlap}</span>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    item.correlation === 'High' ? 'bg-green-100 text-green-800' :
                    item.correlation === 'Medium' ? 'bg-amber-100 text-amber-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {item.correlation} correlation
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrossActivityAnalysis;
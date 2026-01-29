import React from 'react';
import { Users, TrendingUp, Link2, BarChart3 } from 'lucide-react';
import type { CrossActivityData } from '../utils/types';

interface CrossActivityAnalysisProps {
  crossActivity: CrossActivityData;
}

const CrossActivityAnalysis: React.FC<CrossActivityAnalysisProps> = ({ crossActivity }) => {

  return (
    <div className="bg-white rounded-xl shadow-md p-5 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Cross-Activity Analysis</h3>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Link2 className="w-4 h-4" />
          <span>Cross-activity rate: <strong>{crossActivity.crossActivityRate}</strong></span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Multi-Activity Participants */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-blue-600" />
            <h4 className="font-semibold text-gray-700">Multi-Activity Participants</h4>
          </div>

          <div className="space-y-3">
            {(crossActivity.multiActivityAttendees).slice(0, 5).map((attendee, index) => (
              <div
                key={attendee.attendeeId}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{attendee.attendeeName}</p>
                    <p className="text-sm text-gray-600">
                      Activities: {attendee.activities.join(', ')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                    {attendee.activityCount} activities
                  </span>
                </div>
              </div>
            ))}
          </div>


          <button className="w-full mt-4 py-2 text-center text-sm text-blue-600 hover:text-blue-800 font-medium border border-gray-200 rounded-lg hover:border-gray-300 transition">
            View All Participants →
          </button>
        </div>

        {/* Activity Relationships */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-green-600" />
            <h4 className="font-semibold text-gray-700">Activity Relationships</h4>
          </div>

          <div className="space-y-4">
            {crossActivity.activityOverlaps.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-900">{item.pair}</span>
                  <span className="text-sm text-gray-700">Overlap: {item.overlap}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${item.correlation === 'High' ? 'bg-green-500' :
                        item.correlation === 'Medium' ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                    style={{
                      width: `${parseInt(item.overlap)}%`,
                      maxWidth: '100%'
                    }}
                  ></div>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className={`text-xs ${item.correlation === 'High' ? 'text-green-600' :
                      item.correlation === 'Medium' ? 'text-amber-600' : 'text-red-600'
                    }`}>
                    {item.correlation} correlation
                  </span>
                  <span className="text-xs text-gray-500">
                    {parseInt(item.overlap) > 50 ? 'Strong relationship' : 'Weak relationship'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Insight</p>
                <p className="text-sm text-blue-700 mt-1">
                  Activities with over 50% overlap share similar attendee groups.
                  Consider scheduling these activities at different times to maximize participation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrossActivityAnalysis;
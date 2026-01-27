// components/SummaryMetrics.jsx
import { Users, TrendingUp, Clock, Repeat } from 'lucide-react';

const SummaryMetrics = () => {
  const metrics = [
    { 
      title: 'Total Participants', 
      value: '156', 
      change: '+12%', 
      icon: <Users className="w-6 h-6" />,
      color: 'bg-blue-100 text-blue-600'
    },
    { 
      title: 'Avg. Attendance Rate', 
      value: '82%', 
      change: '+5%', 
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'bg-green-100 text-green-600'
    },
    { 
      title: 'Peak Hours', 
      value: '9AM - 11AM', 
      change: 'Consistent', 
      icon: <Clock className="w-6 h-6" />,
      color: 'bg-amber-100 text-amber-600'
    },
    { 
      title: 'Cross-Activity', 
      value: '34%', 
      change: '+8%', 
      icon: <Repeat className="w-6 h-6" />,
      color: 'bg-purple-100 text-purple-600'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {metrics.map((metric, index) => (
        <div key={index} className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-2 rounded-lg ${metric.color}`}>
              {metric.icon}
            </div>
            <span className="text-sm font-medium text-green-600">{metric.change}</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</h3>
          <p className="text-gray-600 text-sm">{metric.title}</p>
        </div>
      ))}
    </div>
  );
};

export default SummaryMetrics;
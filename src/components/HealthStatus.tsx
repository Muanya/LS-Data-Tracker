// components/HealthStatus.tsx
import React from 'react';
import { Wifi, WifiOff, Loader2 } from 'lucide-react';

interface HealthStatusProps {
  isHealthy?: boolean;
  isLoading: boolean;
}

const HealthStatus: React.FC<HealthStatusProps> = ({ isHealthy, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-gray-500">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm">Checking API...</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${
      isHealthy ? 'text-green-600' : 'text-red-600'
    }`}>
      {isHealthy ? (
        <Wifi className="w-5 h-5" />
      ) : (
        <WifiOff className="w-5 h-5" />
      )}
      <span className="text-sm font-medium">
        API: {isHealthy ? 'Connected' : 'Disconnected'}
      </span>
    </div>
  );
};

export default HealthStatus;
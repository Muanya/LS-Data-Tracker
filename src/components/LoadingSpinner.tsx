// components/LoadingSpinner.tsx
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Loading...', 
  fullScreen = false 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center ${
      fullScreen ? 'min-h-screen' : 'py-20'
    }`}>
      <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
      <p className="text-gray-600">{message}</p>
      <p className="text-sm text-gray-400 mt-2">Fetching real-time data from API</p>
    </div>
  );
};

export default LoadingSpinner;
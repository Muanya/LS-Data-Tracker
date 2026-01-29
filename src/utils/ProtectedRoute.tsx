import React from 'react';
import { Navigate } from 'react-router-dom';
import { useApiHealth } from '../hooks/useAttendanceData';
import LoadingSpinner from '../components/LoadingSpinner';
import { AlertTriangle } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = localStorage.getItem('lakeside_auth') === 'authenticated';
  
  const { data: isHealthy, isLoading } = useApiHealth();

  if (isLoading) {
    return <LoadingSpinner message="Checking system status..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!isHealthy) {
    return (
      <div>
        {children}
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-300 text-red-800 px-4 py-2 rounded-lg shadow-lg">
          <AlertTriangle className="w-5 h-5 text-yellow-500" /> API connection lost. Some features may not work.
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
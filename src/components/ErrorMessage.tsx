// components/ErrorMessage.tsx
import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './ui/Button';

interface ErrorMessageProps {
  message: string;
  error?: Error;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, error, onRetry }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
            <h2 className="text-xl font-semibold text-red-900">{message}</h2>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 rounded-lg">
              <p className="text-sm text-red-800 font-medium">Error Details:</p>
              <p className="text-sm text-red-700 mt-1">{error.message}</p>
            </div>
          )}

          <p className="text-gray-600 mb-6">
            Please check your internet connection and ensure the backend API is running.
          </p>

          {onRetry && (
            <Button
              icon={RefreshCw}
              onClick={onRetry}
              fullWidth={true}
              variant='danger'
            >
              Retry Connection
            </Button>
          )}

          <div className="mt-6 pt-4 border-t border-red-200">
            <p className="text-sm text-gray-500">
              If the problem persists, contact your system administrator.
              Ensure the Apps Script backend is properly deployed and accessible.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
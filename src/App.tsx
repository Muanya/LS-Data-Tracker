import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Attendance from './pages/Attendance'
import Dashboard from './pages/Dashboard'
import Report from './pages/Report'
import QuarterReport from './pages/QuarterReport'
import Auth from './pages/Auth'
import ProtectedRoute from './utils/ProtectedRoute'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './services/queryClient'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
        <div className="App">
          <Routes>
            {/* Public route - Auth page */}
            <Route path="/" element={<Auth />} />
            
            {/* Protected routes - require authentication */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/attendance" 
              element={
                <ProtectedRoute>
                  <Attendance />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/report" 
              element={
                <ProtectedRoute>
                  <Report />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/quarter-report" 
              element={
                <ProtectedRoute>
                  <QuarterReport />
                </ProtectedRoute>
              } 
            />
            
            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;


import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // If authentication is still loading, show loading indicator
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#001430]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#01C8A9]"></div>
      </div>
    );
  }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the children
  return <>{children}</>;
};

export default ProtectedRoute;

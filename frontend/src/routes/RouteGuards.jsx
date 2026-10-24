import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Full-screen loading component while checking session
export const RouteLoader = () => (
  <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
    <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
    <p className="text-sm font-semibold text-slate-600">Connecting to Quick Notes...</p>
  </div>
);

export const PrivateRoute = ({ children, allowedRoles }) => {
  const location = useLocation();
  const { isAuthenticated, isLoading, role } = useSelector((state) => state.auth);

  if (isLoading) {
    return <RouteLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role-based access control
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    if (role === 'ADMIN') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/student/dashboard" replace />;
  }

  return children;
};

/**
 * PublicRoute Guard:
 * - Allows public access
 * - If restrictedForAuth is true (e.g. /login, /signup) and user is logged in,
 *   redirects them to their authorized dashboard.
 */
export const PublicRoute = ({ children, restrictedForAuth = false }) => {
  const { isAuthenticated, isLoading, role } = useSelector((state) => state.auth);

  // if (restrictedForAuth && isLoading) {
  //   return <RouteLoader />;
  // }

  if (restrictedForAuth && isAuthenticated) {
    if (role === 'ADMIN') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/student/dashboard" replace />;
  }

  return children;
};

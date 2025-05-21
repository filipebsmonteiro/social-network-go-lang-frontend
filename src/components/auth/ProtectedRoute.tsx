import { Navigate, useLocation } from 'react-router-dom';
import { JSX } from 'react';
import useAuth from '../../hooks/useAuth';

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
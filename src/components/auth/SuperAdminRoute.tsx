import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../lib/authStore';

interface SuperAdminRouteProps {
  children: React.ReactNode;
}

export default function SuperAdminRoute({ children }: SuperAdminRouteProps) {
  const { isAuthenticated, isSuperAdmin } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isSuperAdmin()) {
    // Non-super-admin users trying to access super admin pages go back to their dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

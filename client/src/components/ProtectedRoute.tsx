import { Navigate, Outlet } from 'react-router';
import { useAuthStore } from '@/stores/useAuthStore';

/**
 * Route guard that redirects unauthenticated users to /login.
 * Wrap protected routes with this component as a layout route.
 */
export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

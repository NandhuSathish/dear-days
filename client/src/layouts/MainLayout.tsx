import { Outlet, Link } from 'react-router';
import { useAuthStore } from '@/stores/useAuthStore';
import { Button } from '@/components/ui/button';

/**
 * Main layout wrapper providing consistent header and page structure.
 * Shows auth-aware navigation based on login state.
 */
export default function MainLayout() {
  const { isAuthenticated, user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-surface-dim text-on-surface">
      <header className="border-b border-border bg-background">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-xl font-bold text-primary">
            Dear Days
          </Link>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link to="/journals" className="text-sm hover:text-primary">
                  My Journals
                </Link>
                <span className="text-sm text-muted-foreground">{user?.displayName}</span>
                <Button variant="outline" size="sm" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm hover:text-primary">
                  Sign in
                </Link>
                <Button asChild size="sm">
                  <Link to="/register">Sign up</Link>
                </Button>
              </>
            )}
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}

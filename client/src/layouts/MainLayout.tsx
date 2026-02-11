import { Outlet, Link } from 'react-router';

/**
 * Main layout wrapper providing consistent header and page structure.
 * The Outlet renders the matched child route's component.
 */
export default function MainLayout() {
  return (
    <div className="min-h-screen bg-surface-dim text-on-surface">
      <header className="border-b border-gray-200 bg-surface">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-xl font-bold text-primary">
            Dear Days
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/journals" className="text-sm hover:text-primary">
              My Journals
            </Link>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}

import { Link } from 'react-router';

/**
 * 404 page displayed for unmatched routes.
 */
export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h1 className="text-6xl font-bold text-gray-300">404</h1>
      <p className="mt-4 text-lg text-gray-500">Page not found</p>
      <Link to="/" className="mt-6 text-primary hover:text-primary-dark">
        Back to Home
      </Link>
    </div>
  );
}

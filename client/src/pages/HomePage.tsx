import { Link } from 'react-router';

/**
 * Landing page with app introduction and navigation to journals.
 */
export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h1 className="text-5xl font-bold text-primary">Dear Days</h1>
      <p className="mt-4 max-w-lg text-lg text-gray-600">
        Create beautiful scrapbook-style digital journals. Drag, drop, and design your memories.
      </p>
      <Link
        to="/journals"
        className="mt-8 rounded-lg bg-primary px-6 py-3 text-white transition hover:bg-primary-dark"
      >
        Get Started
      </Link>
    </div>
  );
}

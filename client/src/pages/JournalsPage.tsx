/**
 * Journals listing page — displays a grid of the user's journals.
 */
export default function JournalsPage() {
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Journals</h1>
        <button className="rounded-lg bg-primary px-4 py-2 text-white transition hover:bg-primary-dark">
          New Journal
        </button>
      </div>
      <p className="text-gray-500">No journals yet. Create your first one!</p>
    </div>
  );
}

import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router';
import { useJournalStore } from '@/stores/useJournalStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { AxiosError } from 'axios';

/**
 * Journals dashboard — lists, creates, and deletes journals.
 */
export default function JournalsPage() {
  const { journals, isLoading, error, fetchJournals, createJournal, deleteJournal } =
    useJournalStore();

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [formError, setFormError] = useState('');
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchJournals();
  }, [fetchJournals]);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setFormError('');
    setCreating(true);
    try {
      await createJournal({ title: title.trim() });
      setTitle('');
      setShowForm(false);
    } catch (err) {
      if (err instanceof AxiosError) {
        setFormError(err.response?.data?.message || 'Failed to create journal');
      } else {
        setFormError('Failed to create journal');
      }
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this journal and all its pages? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await deleteJournal(id);
    } catch {
      // error is set in store
    } finally {
      setDeletingId(null);
    }
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Journals</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'New Journal'}
        </Button>
      </div>

      {/* Create form */}
      {showForm && (
        <form onSubmit={handleCreate} className="mb-8 flex items-start gap-3">
          <div className="flex-1">
            <Input
              placeholder="Journal title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              required
              maxLength={100}
            />
            {formError && <p className="mt-1 text-sm text-destructive">{formError}</p>}
          </div>
          <Button type="submit" disabled={creating || !title.trim()}>
            {creating ? 'Creating...' : 'Create'}
          </Button>
        </form>
      )}

      {/* Error state */}
      {error && (
        <div className="mb-6 rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Loading state */}
      {isLoading && <p className="text-muted-foreground">Loading journals...</p>}

      {/* Empty state */}
      {!isLoading && journals.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-lg text-muted-foreground">No journals yet.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Click "New Journal" to create your first one.
          </p>
        </div>
      )}

      {/* Journal grid */}
      {journals.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {journals.map((journal) => (
            <Card key={journal.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg">{journal.title}</CardTitle>
                {journal.description && (
                  <CardDescription className="line-clamp-2">
                    {journal.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardFooter className="mt-auto flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {journal.pageIds.length} {journal.pageIds.length === 1 ? 'page' : 'pages'} ·{' '}
                  {formatDate(journal.updatedAt)}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(journal.id)}
                    disabled={deletingId === journal.id}
                    className="text-destructive hover:text-destructive"
                  >
                    {deletingId === journal.id ? 'Deleting...' : 'Delete'}
                  </Button>
                  <Button asChild size="sm">
                    <Link to={`/journals/${journal.id}`}>Open</Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

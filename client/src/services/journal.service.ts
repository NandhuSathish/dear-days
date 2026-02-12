import type { IJournal, IJournalCreate } from '@dear-days/shared';
import { apiClient } from './api';

/**
 * Fetch all journals for the authenticated user.
 */
export async function fetchJournals(): Promise<IJournal[]> {
  const res = await apiClient.get<IJournal[]>('/journals');
  return res.data!;
}

/**
 * Create a new journal.
 */
export async function createJournal(data: IJournalCreate): Promise<IJournal> {
  const res = await apiClient.post<IJournal>('/journals', data);
  return res.data!;
}

/**
 * Delete a journal by ID.
 */
export async function deleteJournal(id: string): Promise<void> {
  await apiClient.delete(`/journals/${id}`);
}

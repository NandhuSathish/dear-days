import { create } from 'zustand';
import type { IJournal } from '@dear-days/shared';

/**
 * Journal state shape.
 */
interface JournalState {
  journals: IJournal[];
  currentJournal: IJournal | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Journal store actions.
 */
interface JournalActions {
  setJournals: (journals: IJournal[]) => void;
  setCurrentJournal: (journal: IJournal | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState: JournalState = {
  journals: [],
  currentJournal: null,
  isLoading: false,
  error: null,
};

/**
 * Zustand store for journal data and UI state.
 */
export const useJournalStore = create<JournalState & JournalActions>()((set) => ({
  ...initialState,
  setJournals: (journals) => set({ journals }),
  setCurrentJournal: (currentJournal) => set({ currentJournal }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  reset: () => set(initialState),
}));

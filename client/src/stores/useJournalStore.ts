import { create } from 'zustand';
import type { IJournal, IJournalCreate } from '@dear-days/shared';
import * as journalService from '@/services/journal.service';

interface JournalState {
  journals: IJournal[];
  currentJournal: IJournal | null;
  isLoading: boolean;
  error: string | null;
}

interface JournalActions {
  fetchJournals: () => Promise<void>;
  createJournal: (data: IJournalCreate) => Promise<IJournal>;
  deleteJournal: (id: string) => Promise<void>;
  setCurrentJournal: (journal: IJournal | null) => void;
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
export const useJournalStore = create<JournalState & JournalActions>()((set, get) => ({
  ...initialState,

  fetchJournals: async () => {
    set({ isLoading: true, error: null });
    try {
      const journals = await journalService.fetchJournals();
      set({ journals, isLoading: false });
    } catch {
      set({ error: 'Failed to load journals', isLoading: false });
    }
  },

  createJournal: async (data) => {
    set({ error: null });
    const journal = await journalService.createJournal(data);
    set({ journals: [journal, ...get().journals] });
    return journal;
  },

  deleteJournal: async (id) => {
    set({ error: null });
    await journalService.deleteJournal(id);
    set({ journals: get().journals.filter((j) => j.id !== id) });
  },

  setCurrentJournal: (currentJournal) => set({ currentJournal }),
  reset: () => set(initialState),
}));

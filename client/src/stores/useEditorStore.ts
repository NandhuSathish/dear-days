import { create } from 'zustand';
import type { IPage } from '@dear-days/shared';

/**
 * Active tool in the canvas editor.
 */
export type EditorTool = 'select' | 'text' | 'shape' | 'draw' | 'image';

/**
 * Editor state shape.
 */
interface EditorState {
  currentPage: IPage | null;
  selectedElementId: string | null;
  tool: EditorTool;
  zoom: number;
  history: IPage[];
  historyIndex: number;
}

/**
 * Editor store actions.
 */
interface EditorActions {
  setCurrentPage: (page: IPage | null) => void;
  setSelectedElementId: (id: string | null) => void;
  setTool: (tool: EditorTool) => void;
  setZoom: (zoom: number) => void;
  pushHistory: (page: IPage) => void;
  undo: () => void;
  redo: () => void;
  reset: () => void;
}

const initialState: EditorState = {
  currentPage: null,
  selectedElementId: null,
  tool: 'select',
  zoom: 1,
  history: [],
  historyIndex: -1,
};

/**
 * Zustand store for the canvas editor state, including tool selection,
 * element selection, zoom level, and undo/redo history.
 */
export const useEditorStore = create<EditorState & EditorActions>()((set, get) => ({
  ...initialState,
  setCurrentPage: (currentPage) => set({ currentPage }),
  setSelectedElementId: (selectedElementId) => set({ selectedElementId }),
  setTool: (tool) => set({ tool }),
  setZoom: (zoom) => set({ zoom }),

  pushHistory: (page) => {
    const { history, historyIndex } = get();
    // Discard any forward history when a new change is made
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(page);
    set({ history: newHistory, historyIndex: newHistory.length - 1 });
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      set({ historyIndex: newIndex, currentPage: history[newIndex] });
    }
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      set({ historyIndex: newIndex, currentPage: history[newIndex] });
    }
  },

  reset: () => set(initialState),
}));

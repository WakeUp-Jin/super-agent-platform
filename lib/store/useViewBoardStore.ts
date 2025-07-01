import { create } from 'zustand';
import { ViewBoardStoryOneInterface } from '@/lib/interface/viewInterface';

interface ViewBoardState {
  board?: ViewBoardStoryOneInterface;
  setBoard: (data: ViewBoardStoryOneInterface) => void;
  updateBoard: (patch: Partial<ViewBoardStoryOneInterface>) => void;
  clearBoard: () => void;
}

export const useViewBoardStore = create<ViewBoardState>((set) => ({
  board: undefined,
  setBoard: (data) => set({ board: data }),
  updateBoard: (patch) => set((s) => (s.board ? { board: { ...s.board, ...patch } } : {})),
  clearBoard: () => set({ board: undefined }),
}));

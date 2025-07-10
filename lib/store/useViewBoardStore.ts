import { create } from 'zustand';
import {
  ViewBoardStoryOneInterface,
  ViewBoardStoryTwoInfo,
  ViewBoardStoryTwoInterface,
} from '@/lib/interface/viewInterface';

//========== 视图画本的结构-第一步==========
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

//========== 视图画本的结构-第二步==========
interface ViewBoardTwoState {
  boardTwo?: ViewBoardStoryTwoInfo;
  setBoardTwo: (data: ViewBoardStoryTwoInfo) => void;
  updateBoardTwo: (patch: Partial<ViewBoardStoryTwoInfo>) => void;
  clearBoardTwo: () => void;
}

export const useViewBoardTwoStore = create<ViewBoardTwoState>((set) => ({
  boardTwo: undefined,
  setBoardTwo: (data) => set({ boardTwo: data }),
  updateBoardTwo: (patch) =>
    set((s) => (s.boardTwo ? { boardTwo: { ...s.boardTwo, ...patch } } : {})),
  clearBoardTwo: () => set({ boardTwo: undefined }),
}));

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { Draft } from 'immer';
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

export const useViewBoardStore = create<ViewBoardState>()(
  immer((set) => ({
    board: undefined,
    setBoard: (data: ViewBoardStoryOneInterface) =>
      set((state: Draft<ViewBoardState>) => {
        state.board = data;
      }),
    updateBoard: (patch: Partial<ViewBoardStoryOneInterface>) =>
      set((state: Draft<ViewBoardState>) => {
        if (state.board) {
          Object.assign(state.board, patch);
        }
      }),
    clearBoard: () =>
      set((state: Draft<ViewBoardState>) => {
        state.board = undefined;
      }),
  }))
);

//========== 视图画本的结构-第二步==========
interface ViewBoardTwoState {
  boardTwo?: ViewBoardStoryTwoInfo;
  setBoardTwo: (data: ViewBoardStoryTwoInfo) => void;
  updateBoardTwo: (patch: Partial<ViewBoardStoryTwoInfo>) => void;
  clearBoardTwo: () => void;
  // 添加更新故事数据的方法
  updateStoryData: (updater: (storyData: ViewBoardStoryTwoInterface[]) => void) => void;
}

export const useViewBoardTwoStore = create<ViewBoardTwoState>()(
  immer((set) => ({
    boardTwo: undefined,
    setBoardTwo: (data: ViewBoardStoryTwoInfo) =>
      set((state: Draft<ViewBoardTwoState>) => {
        state.boardTwo = data;
      }),
    updateBoardTwo: (patch: Partial<ViewBoardStoryTwoInfo>) =>
      set((state: Draft<ViewBoardTwoState>) => {
        if (state.boardTwo) {
          Object.assign(state.boardTwo, patch);
        }
      }),
    clearBoardTwo: () =>
      set((state: Draft<ViewBoardTwoState>) => {
        state.boardTwo = undefined;
      }),
    updateStoryData: (updater: (storyData: ViewBoardStoryTwoInterface[]) => void) =>
      set((state: Draft<ViewBoardTwoState>) => {
        if (state.boardTwo?.storyData) {
          updater(state.boardTwo.storyData);
        }
      }),
  }))
);

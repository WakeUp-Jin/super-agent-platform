import { create } from 'zustand';

interface UiState {
  isShowSfxAddress: boolean;
  toggleSfxAddress: () => void;
  setShowSfxAddress: (value: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  isShowSfxAddress: false,
  toggleSfxAddress: () => set((state) => ({ isShowSfxAddress: !state.isShowSfxAddress })),
  setShowSfxAddress: (value: boolean) => set({ isShowSfxAddress: value }),
}));

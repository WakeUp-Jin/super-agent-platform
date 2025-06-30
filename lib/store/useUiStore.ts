import { create, SetState } from 'zustand';

interface UiState {
  isShowSfxAddress: boolean;
  toggleSfxAddress: () => void;
  setShowSfxAddress: (value: boolean) => void;
}

export const useUiStore = create<UiState>((set: SetState<UiState>) => ({
  isShowSfxAddress: false,
  toggleSfxAddress: () =>
    set((state: UiState): Partial<UiState> => ({ isShowSfxAddress: !state.isShowSfxAddress })),
  setShowSfxAddress: (value: boolean) => set({ isShowSfxAddress: value }),
}));

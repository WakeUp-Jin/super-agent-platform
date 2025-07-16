import { create } from 'zustand';

interface ButtonState {
  // 文本审核按钮是否禁用
  isTextOneButtonDisabled: boolean;
  // 音频审核按钮是否禁用
  isAudioOneButtonDisabled: boolean;

  // 设置文本审核按钮状态
  setTextOneButtonDisabled: (disabled: boolean) => void;
  // 设置音频审核按钮状态
  setAudioOneButtonDisabled: (disabled: boolean) => void;
  // 重置所有按钮状态
  resetButtonStates: () => void;
}

export const useButtonStore = create<ButtonState>((set) => ({
  // 初始状态
  isTextOneButtonDisabled: true,
  isAudioOneButtonDisabled: true,

  // 状态更新方法
  setTextOneButtonDisabled: (disabled: boolean) => set({ isTextOneButtonDisabled: disabled }),

  setAudioOneButtonDisabled: (disabled: boolean) => set({ isAudioOneButtonDisabled: disabled }),

  resetButtonStates: () =>
    set({
      isTextOneButtonDisabled: false,
      isAudioOneButtonDisabled: false,
    }),
}));

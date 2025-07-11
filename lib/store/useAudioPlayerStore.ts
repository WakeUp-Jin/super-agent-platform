import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { Draft } from 'immer';

// 播放队列项类型
export interface PlaylistItem {
  src: string;
  title: string;
  type?: 'bgm' | 'voice' | 'sfx';
  storyIndex?: number;
  itemIndex?: number;
  valueIndex?: number;
}

interface AudioPlayerState {
  // 音频源路径
  audioSrc?: string;
  // 底部面板是否可见
  isBottomPanelVisible: boolean;
  // 当前播放状态
  isPlaying: boolean;
  // 当前播放的音频信息
  currentAudioInfo?: {
    title?: string;
    type?: 'bgm' | 'voice' | 'sfx';
    storyIndex?: number;
    itemIndex?: number;
    valueIndex?: number;
  };
  // 播放队列
  playlist: PlaylistItem[];
  // 当前播放队列索引
  currentPlaylistIndex: number;
  // 是否正在序列播放
  isSequentialPlaying: boolean;

  // 设置音频源并显示播放面板
  playAudio: (src: string, audioInfo?: AudioPlayerState['currentAudioInfo']) => void;
  // 序列播放音频列表
  playSequential: (playlist: PlaylistItem[]) => void;
  // 播放下一个音频
  playNext: () => void;
  // 停止播放并隐藏面板
  stopAudio: () => void;
  // 切换面板显示状态
  toggleBottomPanel: () => void;
  // 设置面板显示状态
  setBottomPanelVisible: (visible: boolean) => void;
  // 设置播放状态
  setPlaying: (playing: boolean) => void;
  // 清空所有状态
  clearAudioState: () => void;
  // 处理音频播放完成
  handleAudioEnded: () => void;
}

export const useAudioPlayerStore = create<AudioPlayerState>()(
  immer((set, get) => ({
    audioSrc: undefined,
    isBottomPanelVisible: false,
    isPlaying: false,
    currentAudioInfo: undefined,
    playlist: [],
    currentPlaylistIndex: 0,
    isSequentialPlaying: false,

    playAudio: (src: string, audioInfo?: AudioPlayerState['currentAudioInfo']) =>
      set((state: Draft<AudioPlayerState>) => {
        state.audioSrc = src;
        state.isBottomPanelVisible = true;
        state.currentAudioInfo = audioInfo;
        state.isSequentialPlaying = false;
        state.playlist = [];
        state.currentPlaylistIndex = 0;
      }),

    playSequential: (playlist: PlaylistItem[]) =>
      set((state: Draft<AudioPlayerState>) => {
        if (playlist.length === 0) return;

        state.playlist = playlist;
        state.currentPlaylistIndex = 0;
        state.isSequentialPlaying = true;
        state.isBottomPanelVisible = true;

        // 播放第一个音频
        const firstItem = playlist[0];
        state.audioSrc = firstItem.src;
        state.currentAudioInfo = {
          title: firstItem.title,
          type: firstItem.type,
          storyIndex: firstItem.storyIndex,
          itemIndex: firstItem.itemIndex,
          valueIndex: firstItem.valueIndex,
        };
      }),

    playNext: () =>
      set((state: Draft<AudioPlayerState>) => {
        if (!state.isSequentialPlaying || state.playlist.length === 0) return;

        const nextIndex = state.currentPlaylistIndex + 1;
        if (nextIndex < state.playlist.length) {
          // 播放下一个音频
          const nextItem = state.playlist[nextIndex];
          state.currentPlaylistIndex = nextIndex;
          state.audioSrc = nextItem.src;
          state.currentAudioInfo = {
            title: nextItem.title,
            type: nextItem.type,
            storyIndex: nextItem.storyIndex,
            itemIndex: nextItem.itemIndex,
            valueIndex: nextItem.valueIndex,
          };
        } else {
          // 播放完成，清空序列播放状态
          state.isSequentialPlaying = false;
          state.playlist = [];
          state.currentPlaylistIndex = 0;
          state.audioSrc = undefined;
          state.currentAudioInfo = undefined;
          state.isBottomPanelVisible = false;
        }
      }),

    stopAudio: () =>
      set((state: Draft<AudioPlayerState>) => {
        state.audioSrc = undefined;
        state.isBottomPanelVisible = false;
        state.isPlaying = false;
        state.currentAudioInfo = undefined;
        state.isSequentialPlaying = false;
        state.playlist = [];
        state.currentPlaylistIndex = 0;
      }),

    toggleBottomPanel: () =>
      set((state: Draft<AudioPlayerState>) => {
        state.isBottomPanelVisible = !state.isBottomPanelVisible;
      }),

    setBottomPanelVisible: (visible: boolean) =>
      set((state: Draft<AudioPlayerState>) => {
        state.isBottomPanelVisible = visible;
      }),

    setPlaying: (playing: boolean) =>
      set((state: Draft<AudioPlayerState>) => {
        state.isPlaying = playing;
      }),

    clearAudioState: () =>
      set((state: Draft<AudioPlayerState>) => {
        state.audioSrc = undefined;
        state.isBottomPanelVisible = false;
        state.isPlaying = false;
        state.currentAudioInfo = undefined;
        state.isSequentialPlaying = false;
        state.playlist = [];
        state.currentPlaylistIndex = 0;
      }),

    handleAudioEnded: () => {
      const state = get();
      if (state.isSequentialPlaying) {
        // 如果是序列播放，自动播放下一个
        state.playNext();
      } else {
        // 普通播放完成
        set((draft: Draft<AudioPlayerState>) => {
          draft.isPlaying = false;
        });
      }
    },
  }))
);

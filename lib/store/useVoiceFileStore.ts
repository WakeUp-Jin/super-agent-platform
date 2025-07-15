import { create } from 'zustand';
import { produce } from 'immer';
import { ViewBoardStoryTwoInterface } from '@/lib/interface/viewInterface';
import { useFileUpload } from '@/lib/useFileUpload';
import { type UploadParams } from '@/lib/api/upload';

interface VoiceFileStore {
  // Store里不直接存储storyData，而是提供更新函数的引用
  setStoryDataUpdater: (
    updater: React.Dispatch<React.SetStateAction<ViewBoardStoryTwoInterface[]>> | null
  ) => void;

  // URL更新函数
  updateStoryUrl: (storyIndex: number, newUrl: string) => void;
  updateTextUrl: (storyIndex: number, textIndex: number, newUrl: string) => void;
  updateSfxUrl: (storyIndex: number, sfxIndex: number, valueIndex: number, newUrl: string) => void;

  // 内部状态
  storyDataUpdater: React.Dispatch<React.SetStateAction<ViewBoardStoryTwoInterface[]>> | null;
}

export const useVoiceFileStore = create<VoiceFileStore>((set, get) => ({
  storyDataUpdater: null,

  setStoryDataUpdater: (updater) => {
    set({ storyDataUpdater: updater });
  },

  updateStoryUrl: (storyIndex: number, newUrl: string) => {
    const { storyDataUpdater } = get();
    if (!storyDataUpdater) {
      console.error('Story data updater not set');
      return;
    }

    console.log(`[Store] 更新故事 ${storyIndex} 的音频URL:`, newUrl);

    storyDataUpdater(
      produce((draft) => {
        if (draft[storyIndex]) {
          draft[storyIndex].originValue.url = newUrl;
        }
      })
    );
  },

  updateTextUrl: (storyIndex: number, textIndex: number, newUrl: string) => {
    const { storyDataUpdater } = get();
    if (!storyDataUpdater) {
      console.error('Story data updater not set');
      return;
    }

    console.log(`[Store] 更新故事 ${storyIndex} 文本项 ${textIndex} 的音频URL:`, newUrl);

    storyDataUpdater(
      produce((draft) => {
        const item = draft[storyIndex]?.items[textIndex];
        if (item && item.type === 'text') {
          item.originValue.url = newUrl;
        }
      })
    );
  },

  updateSfxUrl: (storyIndex: number, sfxIndex: number, valueIndex: number, newUrl: string) => {
    const { storyDataUpdater } = get();
    if (!storyDataUpdater) {
      console.error('Story data updater not set');
      return;
    }

    console.log(
      `[Store] 更新故事 ${storyIndex} 音效项 ${sfxIndex} 值 ${valueIndex} 的音频URL:`,
      newUrl
    );

    storyDataUpdater(
      produce((draft) => {
        const item = draft[storyIndex]?.items[sfxIndex];
        if (item && item.type === 'sfx') {
          const sfxValueItem = item.valuesList[valueIndex];
          if (sfxValueItem) {
            sfxValueItem.originValue.url = newUrl;
          }
        }
      })
    );
  },
}));

// 便捷Hook，结合位置信息和文件上传
interface UseStoreVoiceUploadOptions {
  type: 'story' | 'text' | 'sfx';
  storyIndex: number;
  itemIndex?: number;
  valueIndex?: number;
  storyBoardIndex?: number | string;
  storyBoardIndexType?: 'bgm' | 'audioPeople' | 'sfx';
  userId: string;
  sessionId: string;
}

export function useStoreVoiceUpload({
  type,
  storyIndex,
  itemIndex,
  valueIndex,
  storyBoardIndex,
  storyBoardIndexType,
  sessionId,
  userId,
}: UseStoreVoiceUploadOptions) {
  const { updateStoryUrl, updateTextUrl, updateSfxUrl } = useVoiceFileStore();

  // 构建上传参数
  const uploadParams: Omit<UploadParams, 'file'> = {
    storyBoardIndex,
    userId,
    sessionId,
    storyBoardIndexType,
  };

  // 成功回调函数
  const handleSuccess = (url: string) => {
    switch (type) {
      case 'story':
        updateStoryUrl(storyIndex, url);
        break;
      case 'text':
        if (itemIndex !== undefined) {
          updateTextUrl(storyIndex, itemIndex, url);
        }
        break;
      case 'sfx':
        if (itemIndex !== undefined && valueIndex !== undefined) {
          updateSfxUrl(storyIndex, itemIndex, valueIndex, url);
        }
        break;
    }
  };

  // 集成文件上传功能
  const fileUpload = useFileUpload({
    uploadParams,
    onSuccess: handleSuccess,
    onError: (error: string) => {
      console.error(`文件上传失败 (${type}):`, error);
    },
  });

  return {
    // 原有的handleSuccess方法（保持向后兼容）
    handleSuccess,
    // 文件上传相关功能
    ...fileUpload,
  };
}

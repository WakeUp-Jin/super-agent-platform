'use client';
import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { StoryItem, SfxMeta } from '@/lib/interface/viewInterface';
import { StoryItemComponent } from './StoryItemComponent';
import { useViewBoardStore } from '@/lib/store/useViewBoardStore';
import { createBoardStoryDiff, getView, updateView } from '@/lib/api/view';

// 常量定义
const CONTAINER_STYLES = {
  base: 'mt-3 flex w-full flex-col gap-5',
} as const;

const API_CONFIG = {
  defaultSessionId: '456',
  defaultUserId: '123',
  viewType: 'oneText',
} as const;

// 类型定义
interface ReviewCompletionChecker {
  currentStoryData: StoryItem[];
  previousPendingCount: number;
  isFirstLoad: boolean;
}

interface StoryContentState {
  storyData: StoryItem[];
  sfxMeta: SfxMeta[];
}

// 自定义Hook：审核完成检测
const useReviewCompletionDetection = () => {
  const previousPendingCountRef = useRef<number>(0);
  const isFirstLoadRef = useRef<boolean>(true);

  const checkReviewCompleted = useCallback((currentStoryData: StoryItem[]) => {
    const currentPendingCount = currentStoryData.filter((item) => item.status === 'pending').length;
    const previousPendingCount = previousPendingCountRef.current;
    const hasSfxItems = currentStoryData.some((item) => item.type === 'sfx');

    console.log('审核状态检测:', {
      currentPendingCount,
      previousPendingCount,
      hasSfxItems,
      isFirstLoad: isFirstLoadRef.current,
    });

    // 检查审核完成条件
    if (
      !isFirstLoadRef.current &&
      previousPendingCount > 0 &&
      currentPendingCount === 0 &&
      hasSfxItems
    ) {
      console.log('🎉 检测到审核完成：最后一个pending项目已变为review状态');
      console.log('当前故事数据:', currentStoryData);

      // 触发更新画本请求
      createBoardStoryDiff({
        sessionId: API_CONFIG.defaultSessionId,
        userId: API_CONFIG.defaultUserId,
        viewType: API_CONFIG.viewType,
      })
        .then((res) => {
          console.log('✅ 更新后端画本数据成功', res);
        })
        .catch((err) => {
          console.error('❌ 更新后端画本数据失败', err);
        });
    }

    // 更新状态
    previousPendingCountRef.current = currentPendingCount;
    isFirstLoadRef.current = false;
  }, []);

  return { checkReviewCompleted };
};

// 自定义Hook：故事数据管理
const useStoryDataManagement = (board: any) => {
  const [storyData, setStoryData] = useState<StoryItem[]>([]);
  const [sfxMeta, setSfxMeta] = useState<SfxMeta[]>([]);

  // 从全局store同步数据 - 使用useMemo优化
  const boardStoryData = useMemo(() => {
    return board?.audioScript?.storyItems ?? [];
  }, [board?.audioScript?.storyItems]);

  const boardSfxMeta = useMemo(() => {
    return board?.audioScript?.sfxMetas ?? [];
  }, [board?.audioScript?.sfxMetas]);

  // 同步数据到本地状态
  useEffect(() => {
    setStoryData(boardStoryData);
    setSfxMeta(boardSfxMeta);
  }, [boardStoryData, boardSfxMeta]);

  return {
    storyData,
    setStoryData,
    sfxMeta,
    setSfxMeta,
  };
};

// 自定义Hook：API操作
const useApiOperations = () => {
  const updateViewApi = useCallback(
    async (item: StoryItem, sfxMeta: SfxMeta[], approved: boolean) => {
      const sfxMetaResult = sfxMeta.find((desc) => desc.id === item.sfxMetaId);

      try {
        const res = await updateView({
          sessionId: API_CONFIG.defaultSessionId,
          userId: API_CONFIG.defaultUserId,
          path: item.sfxPath ?? '',
          sfxAddressPath: sfxMetaResult?.sfxAddressPath ?? '',
          approved,
        });
        console.log('更新后端画本数据成功', res);
        return res;
      } catch (err) {
        console.log('更新后端画本数据失败', err);
        throw err;
      }
    },
    []
  );

  return { updateViewApi };
};

// 主组件
export const StoryContent: React.FC = () => {
  const { board } = useViewBoardStore();
  const { checkReviewCompleted } = useReviewCompletionDetection();
  const { storyData, setStoryData, sfxMeta, setSfxMeta } = useStoryDataManagement(board);
  const { updateViewApi } = useApiOperations();

  // 监听storyData变化，检查审核完成状态
  useEffect(() => {
    if (storyData.length > 0) {
      checkReviewCompleted(storyData);
    }
  }, [storyData, checkReviewCompleted]);

  // 事件处理函数 - 使用useCallback优化
  const handleApprove = useCallback(
    (id: string) => {
      setStoryData((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                status: 'reviewed' as const,
                peopleSelectValue: 'updateValue' as const,
              }
            : item
        )
      );

      const item = storyData.find((item) => item.id === id);
      if (item) {
        updateViewApi(item, sfxMeta, true);
      }
    },
    [storyData, sfxMeta, updateViewApi]
  );

  const handleReject = useCallback(
    (id: string) => {
      setStoryData((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                status: 'reviewed' as const,
                peopleSelectValue: 'originValue' as const,
              }
            : item
        )
      );

      const item = storyData.find((item) => item.id === id);
      if (item) {
        updateViewApi(item, sfxMeta, false);
      }
    },
    [storyData, sfxMeta, updateViewApi]
  );

  const handleRemoveSfx = useCallback(
    (itemId: string, sfx: string) => {
      const item = storyData.find((item) => item.id === itemId);
      if (!item) return;

      const sfxMetaId = item.sfxMetaId;
      const sfxResult = sfxMeta.find((desc) => desc.id === sfxMetaId);

      if (sfxResult) {
        sfxResult.sfxAddress = sfxResult.sfxAddress?.replace(`(音效:${sfx})`, '');
        sfxResult.sfxList = sfxResult.sfxList?.filter((el) => el !== sfx);
      }

      if (Array.isArray(item.updateValue)) {
        item.updateValue = item.updateValue.filter((el) => el !== sfx);
      }
      if (Array.isArray(item.originValue)) {
        item.originValue = item.originValue.filter((el) => el !== sfx);
      }
    },
    [storyData, sfxMeta]
  );

  const handleUpdateSfxDescription = useCallback((sfxMetaId: string, newDescriptions: string[]) => {
    // 更新SfxMeta中的sfxList
    setSfxMeta((prev) =>
      prev.map((item) =>
        item.id === sfxMetaId
          ? {
              ...item,
              sfxList: newDescriptions,
              sfxAddress: (() => {
                let sfxIndex = 0;
                return item.sfxAddress.replace(/\(音效:[^)]+\)/g, () =>
                  newDescriptions[sfxIndex] ? `(音效:${newDescriptions[sfxIndex++]})` : ''
                );
              })(),
            }
          : item
      )
    );

    // 同时更新关联的StoryItem中的originValue/updateValue
    setStoryData((prev) =>
      prev.map((item) =>
        item.sfxMetaId === sfxMetaId
          ? {
              ...item,
              ...(item.peopleSelectValue === 'originValue' || item.peopleSelectValue === ''
                ? { originValue: newDescriptions }
                : { updateValue: newDescriptions }),
            }
          : item
      )
    );
  }, []);

  const handleDeleteSfxDescription = useCallback((descId: string) => {
    setSfxMeta((prev) => prev.filter((desc) => desc.id !== descId));
    setStoryData((prev) =>
      prev.map((item) => ({
        ...item,
        sfxMetaId: item.sfxMetaId === descId ? undefined : item.sfxMetaId,
      }))
    );
  }, []);

  const handleAddSfxDescription = useCallback((description: string) => {
    const newId = `sfx-desc-${Date.now()}`;
    const newSfxMeta: SfxMeta = {
      id: newId,
      sfxAddress: `新内容(音效:${description})`,
      sfxList: [description],
    };

    setSfxMeta((prev) => [...prev, newSfxMeta]);

    // 如果有音效描述类型的故事项，自动关联新的音效描述
    setStoryData((prev) =>
      prev.map((item) =>
        item.type === 'sfx' && !item.sfxMetaId ? { ...item, sfxMetaId: newId } : item
      )
    );
  }, []);

  // 获取故事项关联的音效描述 - 使用useCallback优化
  const getSfxMetaForItem = useCallback(
    (item: StoryItem): SfxMeta | undefined => {
      if (!item.sfxMetaId) return undefined;
      return sfxMeta.find((desc) => item.sfxMetaId === desc.id);
    },
    [sfxMeta]
  );

  // 渲染故事项列表 - 使用useMemo优化
  const renderStoryItems = useMemo(() => {
    return storyData.map((item) => (
      <StoryItemComponent
        key={item.id}
        item={item}
        onApprove={handleApprove}
        onReject={handleReject}
        onRemoveSfx={handleRemoveSfx}
        sfxMeta={getSfxMetaForItem(item)}
        onUpdateSfxDescription={handleUpdateSfxDescription}
      />
    ));
  }, [
    storyData,
    handleApprove,
    handleReject,
    handleRemoveSfx,
    getSfxMetaForItem,
    handleUpdateSfxDescription,
  ]);

  return <div className={CONTAINER_STYLES.base}>{renderStoryItems}</div>;
};

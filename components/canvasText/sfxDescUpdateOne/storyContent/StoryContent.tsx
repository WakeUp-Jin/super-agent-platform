'use client';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { StoryItem, SfxMeta } from '@/lib/interface/viewInterface';
import { StoryItemComponent } from './StoryItemComponent';
import { useViewBoardStore } from '@/lib/store/useViewBoardStore';
import { createBoardStoryDiff, getView, updateView } from '@/lib/api/view';

export function StoryContent() {
  const { board, setBoard } = useViewBoardStore();

  // 从全局 store 拿到 storyData / sfxMeta
  const [storyData, setStoryData] = useState<StoryItem[]>([]);
  const [sfxMeta, setSfxMeta] = useState<SfxMeta[]>([]);

  // 跟踪上一次的pending状态
  const previousPendingCountRef = useRef<number>(0);
  const isFirstLoadRef = useRef<boolean>(true);

  useEffect(() => {
    setStoryData(board?.audioScript?.storyItems ?? []);
    setSfxMeta(board?.audioScript?.sfxMetas ?? []);
  }, [board]);

  // 检测审核完成的逻辑
  const checkReviewCompleted = useCallback((currentStoryData: StoryItem[]) => {
    // 计算当前pending的数量
    const currentPendingCount = currentStoryData.filter((item) => item.status === 'pending').length;
    const previousPendingCount = previousPendingCountRef.current;

    // 检查是否存在sfx类型的项目
    const hasSfxItems = currentStoryData.some((item) => item.type === 'sfx');

    console.log('审核状态检测:', {
      currentPendingCount,
      previousPendingCount,
      hasSfxItems,
      isFirstLoad: isFirstLoadRef.current,
    });

    // 条件判断：
    // 1. 不是首次加载（避免初始化时误触发）
    // 2. 之前有pending项目，现在没有pending项目（最后一个pending变为了其他状态）
    // 3. 存在sfx类型的项目
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
        sessionId: '456',
        userId: '123',
        viewType: 'oneText',
      })
        .then((res) => {
          console.log('✅ 更新后端画本数据成功', res);
        })
        .catch((err) => {
          console.error('❌ 更新后端画本数据失败', err);
        });
    }

    // 更新上一次的pending数量
    previousPendingCountRef.current = currentPendingCount;
    // 标记已经不是首次加载了
    isFirstLoadRef.current = false;
  }, []);

  // 监听storyData变化，检查审核完成状态
  useEffect(() => {
    if (storyData.length > 0) {
      checkReviewCompleted(storyData);
    }
  }, [storyData, checkReviewCompleted]);

  // 当全局 board 更新时同步本地可编辑 state
  // 处理审核同意
  const handleApprove = (id: string) => {
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

    let item = storyData.find((item) => item.id === id);
    if (item) {
      let sfxMetaResult = sfxMeta.find((desc) => desc.id === item.sfxMetaId);
      updateView({
        sessionId: '456',
        userId: '123',
        path: item.sfxPath ?? '',
        sfxAddressPath: sfxMetaResult?.sfxAddressPath ?? '',
        approved: true,
      })
        .then((res) => {
          console.log('更新后端画本数据成功', res);
        })
        .catch((err) => {
          console.log('更新后端画本数据失败', err);
        });
    }
  };

  // 处理审核拒绝
  const handleReject = (id: string) => {
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
    let item = storyData.find((item) => item.id === id);
    if (item) {
      let sfxMetaResult = sfxMeta.find((desc) => desc.id === item.sfxMetaId);
      updateView({
        sessionId: '456',
        userId: '123',
        path: item.sfxPath ?? '',
        sfxAddressPath: sfxMetaResult?.sfxAddressPath ?? '',
        approved: false,
      })
        .then((res) => {
          console.log('更新后端画本数据成功', res);
        })
        .catch((err) => {
          console.log('更新后端画本数据失败', err);
        });
    }
  };

  // 处理音效删除
  const handleRemoveSfx = (itemId: string, sfx: string) => {
    let item = storyData.find((item) => item.id === itemId);
    if (item) {
      let sfxMetaId = item.sfxMetaId;
      let sfxResult = sfxMeta.find((desc) => desc.id === sfxMetaId);
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
    }
  };

  // 处理音效描述更新（同时更新 sfxList 和对应的 originValue/updateValue）
  const handleUpdateSfxDescription = (sfxMetaId: string, newDescriptions: string[]) => {
    // 更新 SfxMeta 中的 sfxList
    setSfxMeta((prev) =>
      prev.map((item) =>
        item.id === sfxMetaId
          ? {
              ...item,
              sfxList: newDescriptions,
              // 重新生成 sfxAddress，按顺序替换音效标签
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

    // 同时更新关联的 StoryItem 中的 originValue/updateValue
    setStoryData((prev) =>
      prev.map((item) =>
        item.sfxMetaId === sfxMetaId
          ? {
              ...item,
              // 根据当前选择的值更新对应字段
              ...(item.peopleSelectValue === 'originValue' || item.peopleSelectValue === ''
                ? { originValue: newDescriptions }
                : { updateValue: newDescriptions }),
            }
          : item
      )
    );
  };

  // 处理音效描述删除
  const handleDeleteSfxDescription = (descId: string) => {
    setSfxMeta((prev) => prev.filter((desc) => desc.id !== descId));
    // 同时更新故事数据中的关联
    setStoryData((prev) =>
      prev.map((item) => ({
        ...item,
        sfxMetaId: item.sfxMetaId === descId ? undefined : item.sfxMetaId,
      }))
    );
  };

  // 处理添加音效描述
  const handleAddSfxDescription = (description: string) => {
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
        item.type === 'sfx' && !item.sfxMetaId
          ? {
              ...item,
              sfxMetaId: newId,
            }
          : item
      )
    );
  };

  // 获取故事项关联的音效描述
  const getSfxMetaForItem = (item: StoryItem): SfxMeta | undefined => {
    if (!item.sfxMetaId) return undefined;
    return sfxMeta.find((desc) => item.sfxMetaId === desc.id);
  };

  return (
    <div className="mt-3 flex w-full flex-col gap-5">
      {storyData.map((item) => (
        <StoryItemComponent
          key={item.id}
          item={item}
          onApprove={handleApprove}
          onReject={handleReject}
          onRemoveSfx={handleRemoveSfx}
          sfxMeta={getSfxMetaForItem(item)}
          onUpdateSfxDescription={handleUpdateSfxDescription}
        />
      ))}
    </div>
  );
}

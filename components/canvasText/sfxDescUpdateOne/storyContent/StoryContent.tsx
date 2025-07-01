'use client';
import React, { useEffect, useState } from 'react';
import { StoryItem, SfxMeta } from '@/lib/interface/viewInterface';
import { StoryItemComponent } from './StoryItemComponent';
import { useViewBoardStore } from '@/lib/store/useViewBoardStore';
import { getView } from '@/lib/api/view';

export function StoryContent() {
  const { board, setBoard } = useViewBoardStore();

  // 首次挂载时拉取数据
  useEffect(() => {
    const fetchData = async () => {
      const data = await getView({
        sessionId: '456-debug3-800',
        userId: '123',
        viewStep: '1',
      });
      console.log(data);
      setBoard(data);
    };
    fetchData();
  }, [setBoard]);

  // 从全局 store 拿到 storyData / sfxMeta
  const [storyData, setStoryData] = useState<StoryItem[]>([]);
  const [sfxMeta, setSfxMeta] = useState<SfxMeta[]>([]);

  useEffect(() => {
    setStoryData(board?.audioScript?.storyItems ?? []);
    setSfxMeta(board?.audioScript?.sfxMetas ?? []);
  }, [board]);

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

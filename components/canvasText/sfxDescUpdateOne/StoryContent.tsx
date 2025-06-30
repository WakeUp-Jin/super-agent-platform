'use client';
import React, { useState } from 'react';
import { StoryItem, SfxMeta } from './types';
import { StoryItemComponent } from './storyContent/StoryItemComponent';

export function StoryContent() {
  // 使用新的数据结构
  const [storyData, setStoryData] = useState<StoryItem[]>([
    {
      id: 1,
      role: '旁白',
      type: 'text',
      status: 'normal',
      originValue:
        '角落里的桌子上坐着一个人，蓄着金色胡须的脸庞显得神采奕奕。他正是马克思的老友兼同事，弗里德里希·恩格斯。一看到马克思走进来，恩格斯立刻站起身来，挥手示意他过来。',
      updateValue: '',
      peopleSelectValue: '',
      sfxMetaId: 'sfx-desc-1', // 关联音效描述ID
    },
    {
      id: 2,
      role: '音效描述',
      type: 'sfx',
      status: 'reviewed',
      originValue: ['大风'],
      updateValue: ['大风', '大雪'],
      peopleSelectValue: 'updateValue',
      sfxMetaId: 'sfx-desc-1', // 关联音效描述ID
    },
    {
      id: 3,
      role: '恩格斯',
      type: 'text',
      status: 'pending',
      originValue: '"卡尔，过来这边！"',
      updateValue: '"卡尔，我的老朋友，快过来这边坐！"',
      peopleSelectValue: 'originValue',
    },
    {
      id: 4,
      role: '恩格斯',
      type: 'text',
      status: 'normal',
      originValue: '"卡尔，过来这边！"',
      updateValue: '"卡尔，我的老朋友，快过来这边坐！"',
      peopleSelectValue: 'originValue',
    },
    {
      id: 5,
      role: '音效描述',
      type: 'sfx',
      status: 'pending',
      originValue: ['大风'],
      updateValue: ['大风', '大雪'],
      peopleSelectValue: 'updateValue',
      sfxMetaId: 'sfx-desc-1', // 关联音效描述ID
    },
  ]);

  // 独立管理音效描述数据
  const [sfxMeta, setSfxMeta] = useState<SfxMeta[]>([
    {
      id: 'sfx-desc-1',
      sfxAddress:
        '角落里的桌子上坐着一个人(音效:大风)，蓄着金色胡须的脸庞显得神采奕奕(音效:大雪)。他正是马克思的老友兼同事，弗里德里希·恩格斯。一看到马克思走进来，恩格斯立刻站起身来，挥手示意他过来。',
      sfxList: ['大风', '大雪'],
    },
  ]);

  // 处理审核同意
  const handleApprove = (id: number) => {
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
  const handleReject = (id: number) => {
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
  const handleRemoveSfx = (itemId: number, sfx: string) => {
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

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { StoryItemComponentProps } from '../types';
import { TextItem } from './TextItem';
import { SfxDescItem } from './SfxDescItem';
import { ReviewCard } from './ReviewCard';

// 主要的故事项组件
export const StoryItemComponent = ({
  item,
  onApprove,
  onReject,
  onRemoveSfx,
  sfxMeta = undefined,
  onUpdateSfxDescription,
}: StoryItemComponentProps) => {
  const renderContent = () => {
    // 根据 status 决定渲染什么组件
    if (item.status === 'pending') {
      return (
        <ReviewCard
          item={item}
          onApprove={onApprove}
          onReject={onReject}
          onRemoveSfx={onRemoveSfx}
          sfxMeta={sfxMeta}
          onUpdateSfxDescription={onUpdateSfxDescription}
        />
      );
    }

    // normal 或 reviewed 状态，根据 type 决定渲染什么内容组件
    const finalContent =
      item.peopleSelectValue === 'originValue' ? item.originValue : item.updateValue;

    if (item.type === 'text') {
      return (
        <div className="relative h-full w-full">
          <TextItem
            content={finalContent as string}
            sfxMeta={sfxMeta}
            onRemoveSfx={(sfx) => onRemoveSfx(item.id, sfx)}
          />
        </div>
      );
    } else {
      // 音效描述类型，使用关联的音效描述数据
      return (
        <div className="relative h-full w-full">
          <SfxDescItem
            content={finalContent as string[]}
            sfxMeta={sfxMeta}
            onUpdateSfxDescription={onUpdateSfxDescription}
          />
        </div>
      );
    }
  };

  return (
    <div className="flex h-full w-full gap-2 rounded transition-colors duration-200 hover:bg-yellow-50">
      {/* <div className="flex w-1/8 self-stretch text-right font-sans text-base/6">
        <p className="flex h-full w-full items-start justify-end font-medium text-gray-700">
          {item.role}
        </p>
      </div> */}
      {renderContent()}
    </div>
  );
};

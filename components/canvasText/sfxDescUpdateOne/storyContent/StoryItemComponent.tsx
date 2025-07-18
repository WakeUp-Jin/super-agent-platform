'use client';
import React, { useCallback, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { StoryItemComponentProps } from './types';
import { TextItem } from './TextItem';
import { SfxDescItem } from './SfxDescItem';
import { ReviewCard } from './ReviewCard';

// 常量定义
const CONTAINER_STYLES = {
  base: 'flex h-full w-full gap-2 rounded transition-colors duration-200 hover:bg-yellow-50',
  contentWrapper: 'relative h-full w-full',
} as const;

// 类型定义
interface ContentRendererProps {
  item: StoryItemComponentProps['item'];
  content: string | string[];
  sfxMeta?: StoryItemComponentProps['sfxMeta'];
  onRemoveSfx: (sfx: string) => void;
  onUpdateSfxDescription?: StoryItemComponentProps['onUpdateSfxDescription'];
}

// 内容渲染器子组件
const ContentRenderer: React.FC<ContentRendererProps> = ({
  item,
  content,
  sfxMeta,
  onRemoveSfx,
  onUpdateSfxDescription,
}) => {
  if (item.type === 'text') {
    return (
      <TextItem
        content={content as string}
        role={item.role}
        storyBoardScriptId={item.storyBoardScriptId}
        sfxMeta={sfxMeta}
        onRemoveSfx={onRemoveSfx}
      />
    );
  }

  return (
    <SfxDescItem
      content={content as string[]}
      sfxMeta={sfxMeta}
      storyBoardScriptId={item.storyBoardScriptId}
      onUpdateSfxDescription={onUpdateSfxDescription}
      sfxDescPath={item.sfxPath}
    />
  );
};

// 主组件
export const StoryItemComponent: React.FC<StoryItemComponentProps> = ({
  item,
  onApprove,
  onReject,
  onRemoveSfx,
  sfxMeta,
  onUpdateSfxDescription,
}) => {
  // 计算最终显示的内容 - 使用 useMemo 优化
  const finalContent = useMemo(() => {
    switch (item.status) {
      case 'pending':
        return item.originValue;
      case 'reviewed':
        return item.peopleSelectValue === 'originValue' ? item.originValue : item.updateValue;
      case 'normal':
      default:
        return item.originValue;
    }
  }, [item.status, item.peopleSelectValue, item.originValue, item.updateValue]);

  // 事件处理函数 - 使用 useCallback 优化
  const handleRemoveSfx = useCallback(
    (sfx: string) => {
      onRemoveSfx(item.id, sfx);
    },
    [onRemoveSfx, item.id]
  );

  // 渲染内容组件 - 使用 useCallback 优化
  const renderContent = useCallback(() => {
    // pending状态使用ReviewCard进行对比显示
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

    // normal 或 reviewed 状态显示最终内容
    return (
      <div className={CONTAINER_STYLES.contentWrapper}>
        <ContentRenderer
          item={item}
          content={finalContent}
          sfxMeta={sfxMeta}
          onRemoveSfx={handleRemoveSfx}
          onUpdateSfxDescription={onUpdateSfxDescription}
        />
      </div>
    );
  }, [
    item,
    finalContent,
    sfxMeta,
    handleRemoveSfx,
    onApprove,
    onReject,
    onRemoveSfx,
    onUpdateSfxDescription,
  ]);

  return <div className={CONTAINER_STYLES.base}>{renderContent()}</div>;
};

'use client';
import React, { useCallback, useMemo } from 'react';
import { Check, Minus, Plus, XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ReviewCardProps } from './types';
import { TextItem } from './TextItem';
import { SfxDescItem } from './SfxDescItem';

// 常量定义
const CONTAINER_STYLES = {
  base: 'w-full space-y-2 rounded-lg border bg-gray-50 py-2',
  originalSection: 'bg-red-200',
  updatedSection: 'bg-green-200',
  contentContainer: 'flex h-full w-full gap-2',
  contentArea: 'min-w-0 flex-1',
  iconArea: 'flex flex-none items-center',
  actionArea: 'flex justify-end gap-2',
} as const;

const BADGE_STYLES = {
  approve: 'cursor-pointer bg-green-600 hover:bg-green-700',
  reject: 'cursor-pointer hover:bg-red-300',
} as const;

// 类型定义
interface ContentRendererProps {
  item: ReviewCardProps['item'];
  content: string | string[];
  highlight?: boolean;
  sfxMeta?: ReviewCardProps['sfxMeta'];
  onRemoveSfx?: (sfx: string) => void;
  onUpdateSfxDescription?: ReviewCardProps['onUpdateSfxDescription'];
}

interface VersionSectionProps {
  type: 'original' | 'updated';
  content: string | string[];
  item: ReviewCardProps['item'];
  sfxMeta?: ReviewCardProps['sfxMeta'];
  onRemoveSfx?: (sfx: string) => void;
  onUpdateSfxDescription?: ReviewCardProps['onUpdateSfxDescription'];
}

interface ActionButtonsProps {
  onApprove: () => void;
  onReject: () => void;
}

// 内容渲染器子组件
const ContentRenderer: React.FC<ContentRendererProps> = ({
  item,
  content,
  highlight = false,
  sfxMeta,
  onRemoveSfx,
  onUpdateSfxDescription,
}) => {
  if (item.type === 'text') {
    return (
      <TextItem
        content={content as string}
        role={item.role}
        sfxMeta={sfxMeta}
        onRemoveSfx={onRemoveSfx}
      />
    );
  }

  return (
    <SfxDescItem
      content={content as string[]}
      sfxMeta={sfxMeta}
      status={item.status}
      onUpdateSfxDescription={onUpdateSfxDescription}
      sfxDescPath={item.sfxPath}
      storyBoardScriptId={item.storyBoardScriptId}
    />
  );
};

// 版本对比区域子组件
const VersionSection: React.FC<VersionSectionProps> = ({
  type,
  content,
  item,
  sfxMeta,
  onRemoveSfx,
  onUpdateSfxDescription,
}) => {
  const sectionClassName = useMemo(() => {
    return type === 'original' ? CONTAINER_STYLES.originalSection : CONTAINER_STYLES.updatedSection;
  }, [type]);

  const iconComponent = useMemo(() => {
    return type === 'original' ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />;
  }, [type]);

  const highlight = useMemo(() => type === 'updated', [type]);

  return (
    <div className={sectionClassName}>
      <div className={CONTAINER_STYLES.contentContainer}>
        <div className={CONTAINER_STYLES.contentArea}>
          <ContentRenderer
            item={item}
            content={content}
            highlight={highlight}
            sfxMeta={sfxMeta}
            onRemoveSfx={onRemoveSfx}
            onUpdateSfxDescription={onUpdateSfxDescription}
          />
        </div>
        <div className={CONTAINER_STYLES.iconArea}>{iconComponent}</div>
      </div>
    </div>
  );
};

// 操作按钮组子组件
const ActionButtons: React.FC<ActionButtonsProps> = ({ onApprove, onReject }) => (
  <div className={CONTAINER_STYLES.actionArea}>
    <Badge onClick={onApprove} className={BADGE_STYLES.approve}>
      <Check className="mr-1 w-4" />
      同意
    </Badge>
    <Badge className={BADGE_STYLES.reject} variant="outline" onClick={onReject}>
      <XIcon className="mr-1 h-2 w-4" />
      拒绝
    </Badge>
  </div>
);

// 主组件
export const ReviewCard: React.FC<ReviewCardProps> = ({
  item,
  onApprove,
  onReject,
  onRemoveSfx,
  sfxMeta,
  onUpdateSfxDescription,
}) => {
  // 事件处理函数 - 使用 useCallback 优化
  const handleApprove = useCallback(() => {
    onApprove(item.id);
  }, [onApprove, item.id]);

  const handleReject = useCallback(() => {
    onReject(item.id);
  }, [onReject, item.id]);

  const handleRemoveSfx = useCallback(
    (sfx: string) => {
      onRemoveSfx?.(item.id, sfx);
    },
    [onRemoveSfx, item.id]
  );

  return (
    <div className={CONTAINER_STYLES.base}>
      {/* 原始版本区域 */}
      <VersionSection
        type="original"
        content={item.originValue}
        item={item}
        sfxMeta={sfxMeta}
        onRemoveSfx={handleRemoveSfx}
        onUpdateSfxDescription={onUpdateSfxDescription}
      />

      {/* 更新版本区域 */}
      <VersionSection
        type="updated"
        content={item.updateValue}
        item={item}
        sfxMeta={sfxMeta}
        onRemoveSfx={handleRemoveSfx}
        onUpdateSfxDescription={onUpdateSfxDescription}
      />

      {/* 操作按钮区域 */}
      <ActionButtons onApprove={handleApprove} onReject={handleReject} />
    </div>
  );
};

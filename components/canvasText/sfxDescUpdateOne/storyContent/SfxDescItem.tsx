'use client';
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SfxDescItemProps } from './types';
import { CustomeTabPopover } from '../CustomeTabPopover';
import { X, Plus, Minus, SquarePen, PenOff, Loader2 } from 'lucide-react';
import { updateSfxDescAPI } from '@/lib/api/sfxDesc';

// 常量定义
const CONTAINER_STYLES = {
  base: 'flex w-full gap-2',
  labelArea: 'h-full w-1/8',
  label: 'flex h-full w-full items-start justify-end font-medium text-gray-700',
  contentArea: 'flex h-full w-7/8 border-l-2 border-gray-300 pl-3',
  tagsContainer: 'flex w-full flex-wrap items-center gap-3',
  controlsArea: 'flex-none',
} as const;

const BADGE_STYLES = {
  base: 'group relative h-7 bg-[#3c6e71] text-sm',
  loading: 'group relative h-7 bg-gray-400 text-sm',
} as const;

const BUTTON_STYLES = {
  control: 'h-8 cursor-pointer',
} as const;

const INPUT_STYLES = {
  base: 'h-7 w-20 rounded-md border-2 border-gray-300',
} as const;

const API_CONFIG = {
  defaultUserId: '123',
  defaultSessionId: '456',
} as const;

// 类型定义
interface SfxTagProps {
  item: string;
  globalIndex: number;
  openPopover: string | null;
  canEdit: boolean;
  onOpenChange: (open: boolean, key: string) => void;
  onConfirmDelete: (item: string, index: number, reason: string) => void;
}

interface LoadingTagProps {
  item: string;
  index: number;
}

interface SfxInputProps {
  isVisible: boolean;
  value: string;
  onValueChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

interface ControlButtonProps {
  canEdit: boolean;
  isInputVisible: boolean;
  onClick: () => void;
}

// 音效标签子组件
const SfxTag: React.FC<SfxTagProps> = ({
  item,
  globalIndex,
  openPopover,
  canEdit,
  onOpenChange,
  onConfirmDelete,
}) => (
  <Badge key={`${item}-${globalIndex}`} className={BADGE_STYLES.base}>
    {item}
    <CustomeTabPopover
      open={openPopover === `${item}-${globalIndex}`}
      onOpenChange={(open) => onOpenChange(open, `${item}-${globalIndex}`)}
      onConfirm={(reason) => onConfirmDelete(item, globalIndex, reason)}
    >
      <button
        type="button"
        className="ml-1 cursor-pointer opacity-100 transition-opacity group-hover:opacity-100"
        aria-label={`删除音效描述: ${item}`}
        style={{ display: canEdit ? 'block' : 'none' }}
      >
        <X className="h-3 w-3" />
      </button>
    </CustomeTabPopover>
  </Badge>
);

// 加载中标签子组件
const LoadingTag: React.FC<LoadingTagProps> = ({ item, index }) => (
  <Badge key={`loading-${item}-${index}`} className={BADGE_STYLES.loading}>
    {item}
    <div className="ml-1">
      <Loader2 className="h-3 w-3 animate-spin" />
    </div>
  </Badge>
);

// 输入框子组件
const SfxInput: React.FC<SfxInputProps> = ({
  isVisible,
  value,
  onValueChange,
  onKeyDown,
  inputRef,
}) => (
  <input
    type="text"
    className={INPUT_STYLES.base}
    value={value}
    onChange={(e) => onValueChange(e.target.value)}
    onKeyDown={onKeyDown}
    style={{ display: isVisible ? 'block' : 'none' }}
    ref={inputRef}
    placeholder="添加音效"
  />
);

// 控制按钮子组件
const ControlButton: React.FC<ControlButtonProps> = ({ canEdit, isInputVisible, onClick }) => (
  <div className={CONTAINER_STYLES.controlsArea} style={{ display: canEdit ? 'block' : 'none' }}>
    <Button size="icon" variant="secondary" className={BUTTON_STYLES.control} onClick={onClick}>
      {isInputVisible ? <PenOff /> : <SquarePen />}
    </Button>
  </div>
);

// 主组件
export const SfxDescItem: React.FC<SfxDescItemProps> = ({
  content,
  sfxMeta,
  status,
  onUpdateSfxDescription,
  storyBoardScriptId,
  sfxDescPath,
}) => {
  // 状态管理
  const [openPopover, setOpenPopover] = useState<string | null>(null);
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [loadingItems, setLoadingItems] = useState<string[]>([]);

  // 引用
  const inputRef = useRef<HTMLInputElement>(null);

  // 计算属性 - 使用 useMemo 优化
  const displayContent = useMemo(() => {
    return Array.isArray(content) ? content : [content];
  }, [content]);

  const canEdit = useMemo(() => {
    return status !== 'pending';
  }, [status]);

  // 副作用 - 输入框自动聚焦
  useEffect(() => {
    if (isInputVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isInputVisible]);

  // 事件处理函数 - 使用 useCallback 优化
  const handlePopoverOpenChange = useCallback((open: boolean, key: string) => {
    setOpenPopover(open ? key : null);
  }, []);

  const handleConfirmDelete = useCallback(
    async (sfx: string, itemIndex: number, reason: string): Promise<void> => {
      if (!sfxMeta) return;

      console.log(
        `删除音效描述 "${sfx}"，序列：${itemIndex}，理由：${reason || '无'}，storyBoardScriptId：${storyBoardScriptId}`
      );

      try {
        const res = await updateSfxDescAPI({
          userId: API_CONFIG.defaultUserId,
          sessionId: API_CONFIG.defaultSessionId,
          storyBoardScriptId: `${storyBoardScriptId}`,
          index: itemIndex,
          type: 'delete',
          sfxDesc: sfx,
          sfxDescPath: sfxDescPath || '',
          sfxDescAddressPath: sfxMeta.sfxAddressPath || '',
          reason,
        });

        console.log('删除音效描述成功', res);

        const newDescriptions = displayContent.filter((_, index) => index !== itemIndex);
        onUpdateSfxDescription?.(sfxMeta.id, newDescriptions);
      } catch (err) {
        console.log('删除音效描述失败', err);
      }
    },
    [sfxMeta, storyBoardScriptId, sfxDescPath, displayContent, onUpdateSfxDescription]
  );

  const handleAddClick = useCallback(() => {
    if (isInputVisible) {
      setIsInputVisible(false);
      setInputValue('');
    } else {
      setIsInputVisible(true);
    }
  }, [isInputVisible]);

  const handleInputKeyDown = useCallback(
    async (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        const trimmedValue = inputValue.trim();
        console.log('trimmedValue', trimmedValue);

        if (trimmedValue && sfxMeta) {
          setLoadingItems((prev) => [...prev, trimmedValue]);
          setInputValue('');
          setIsInputVisible(false);

          try {
            const res = await updateSfxDescAPI({
              userId: API_CONFIG.defaultUserId,
              sessionId: API_CONFIG.defaultSessionId,
              storyBoardScriptId: `${storyBoardScriptId}`,
              index: displayContent.length,
              type: 'add',
              sfxDesc: trimmedValue,
              sfxDescPath: sfxDescPath || '',
              sfxDescAddressPath: sfxMeta.sfxAddressPath || '',
            });

            console.log('添加音效描述成功', res);

            setLoadingItems((prev) => prev.filter((item) => item !== trimmedValue));
            const newDescriptions = [...displayContent, trimmedValue];
            onUpdateSfxDescription?.(sfxMeta.id, newDescriptions);
          } catch (err) {
            console.log('添加音效描述失败', err);
            setLoadingItems((prev) => prev.filter((item) => item !== trimmedValue));
          }
        }
      }
    },
    [inputValue, sfxMeta, storyBoardScriptId, sfxDescPath, displayContent, onUpdateSfxDescription]
  );

  // 渲染函数 - 使用 useCallback 优化
  const renderSfxTags = useCallback(() => {
    return displayContent.map((item, globalIndex) => (
      <SfxTag
        key={`${item}-${globalIndex}`}
        item={item}
        globalIndex={globalIndex}
        openPopover={openPopover}
        canEdit={canEdit}
        onOpenChange={handlePopoverOpenChange}
        onConfirmDelete={handleConfirmDelete}
      />
    ));
  }, [displayContent, openPopover, canEdit, handlePopoverOpenChange, handleConfirmDelete]);

  const renderLoadingTags = useCallback(() => {
    return loadingItems.map((item, index) => (
      <LoadingTag key={`loading-${item}-${index}`} item={item} index={index} />
    ));
  }, [loadingItems]);

  return (
    <div className={CONTAINER_STYLES.base}>
      <div className={CONTAINER_STYLES.labelArea}>
        <p className={CONTAINER_STYLES.label}>音效描述</p>
      </div>

      <div className={CONTAINER_STYLES.contentArea}>
        <div className={CONTAINER_STYLES.tagsContainer}>
          {renderSfxTags()}
          {renderLoadingTags()}
          <SfxInput
            isVisible={isInputVisible}
            value={inputValue}
            onValueChange={setInputValue}
            onKeyDown={handleInputKeyDown}
            inputRef={inputRef}
          />
        </div>

        <ControlButton canEdit={canEdit} isInputVisible={isInputVisible} onClick={handleAddClick} />
      </div>
    </div>
  );
};

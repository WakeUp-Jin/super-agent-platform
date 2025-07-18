'use client';
import React, { useCallback, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { PencilLine, Play, Check, X, Upload, LoaderCircle } from 'lucide-react';
import { ViewTwoSfxValueItemFormat, ViewTwoValueItemFormat } from '@/lib/interface/viewInterface';
import { useAudioPlayerStore } from '@/lib/store/useAudioPlayerStore';
import { useStoreVoiceUpload } from '@/lib/store/useVoiceFileStore';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// 常量定义
const CONTAINER_STYLES = {
  base: 'group rounded-lg bg-white hover:bg-gray-50 border-l-2 border-purple-400',
} as const;

const BUTTON_STYLES = {
  playOriginal: 'h-7 w-7 text-red-500 hover:bg-blue-100',
  playUpdate: 'h-7 w-7 text-green-500 hover:bg-purple-100',
  playDefault: 'h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100',
  approve: 'h-4 text-green-600 hover:bg-green-100',
  reject: 'h-4 text-red-600 hover:bg-red-100',
} as const;

const VERSION_LABELS = {
  original: '原始版本',
  updated: '更新版本',
} as const;

// 类型定义
interface SfxItemProps {
  valueItem: ViewTwoSfxValueItemFormat;
  index: number;
  storyIndex: number;
  sfxIndex: number;
  parentStatus: 'normal' | 'pending' | 'reviewed';
  onApprove?: (itemIndex: number) => void;
  onReject?: (itemIndex: number) => void;
}

// 通用按钮样式计算函数
const getButtonClassName = (baseClassName: string, forceShow: boolean): string => {
  return forceShow ? baseClassName.replace('opacity-0', 'opacity-100') : baseClassName;
};

// 播放按钮组件
interface PlayButtonProps {
  value: ViewTwoValueItemFormat;
  className?: string;
  onClick: () => void;
  disabled?: boolean;
  forceShow?: boolean;
}

const PlayButton: React.FC<PlayButtonProps> = ({
  value,
  className = '',
  onClick,
  disabled,
  forceShow = false,
}) => (
  <Button
    variant="ghost"
    size="icon"
    className={getButtonClassName(className, forceShow)}
    onClick={onClick}
    title={`播放: ${value.name}`}
    disabled={disabled}
  >
    <Play className="h-3 w-3" />
  </Button>
);

// 编辑按钮组件
interface EditButtonProps {
  className?: string;
  forceShow?: boolean;
}

const EditButton: React.FC<EditButtonProps> = ({ className = '', forceShow = false }) => (
  <Button
    variant="ghost"
    size="icon"
    className={getButtonClassName(className, forceShow)}
    title="编辑"
  >
    <PencilLine className="h-3 w-3" />
  </Button>
);

// 审核按钮组件
interface ActionButtonProps {
  type: 'approve' | 'reject';
  onClick: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({ type, onClick }) => (
  <Button
    variant="ghost"
    size="sm"
    className={type === 'approve' ? BUTTON_STYLES.approve : BUTTON_STYLES.reject}
    onClick={onClick}
  >
    {type === 'approve' ? (
      <>
        <Check className="mr-1 h-3 w-3" />
        同意
      </>
    ) : (
      <>
        <X className="mr-1 h-3 w-3" />
        拒绝
      </>
    )}
  </Button>
);

export const SfxItem: React.FC<SfxItemProps> = ({
  valueItem,
  index,
  storyIndex,
  sfxIndex,
  parentStatus,
  onApprove,
  onReject,
}) => {
  const { playAudio } = useAudioPlayerStore();
  const [forceShowButtons, setForceShowButtons] = useState(false);

  // 使用store来处理音效文件上传，现在包含完整的上传功能
  const { isUploading, error, openFileDialog } = useStoreVoiceUpload({
    storyIndex,
    itemIndex: sfxIndex,
    valueIndex: index,
    type: 'sfx',
    storyBoardIndex: valueItem.storyBoardSfxFileUrlId,
    storyBoardIndexType: 'sfx',
    userId: '123',
    sessionId: '456',
  });

  // 计算当前显示的值 - 使用 useMemo 优化
  const currentValue = useMemo((): ViewTwoValueItemFormat => {
    if (valueItem.status === 'normal') {
      return valueItem.originValue;
    }

    // pending和reviewed状态都根据peopleSelectValue决定
    return valueItem.peopleSelectValue === 'updateValue'
      ? valueItem.updateValue
      : valueItem.originValue;
  }, [valueItem.status, valueItem.peopleSelectValue, valueItem.originValue, valueItem.updateValue]);

  // 计算版本标签 - 使用 useMemo 优化
  const versionLabel = useMemo((): string => {
    if (valueItem.status === 'normal') {
      return VERSION_LABELS.original;
    }

    return valueItem.peopleSelectValue === 'updateValue'
      ? VERSION_LABELS.updated
      : VERSION_LABELS.original;
  }, [valueItem.status, valueItem.peopleSelectValue]);

  // 事件处理函数 - 使用 useCallback 优化
  const handlePlay = useCallback(
    (value: ViewTwoValueItemFormat) => {
      if (value.url) {
        playAudio(value.url, {
          title: value.name,
          type: 'sfx',
          valueIndex: index,
        });
      }
    },
    [playAudio, index]
  );

  const handleApprove = useCallback(() => {
    onApprove?.(index);
  }, [onApprove, index]);

  const handleReject = useCallback(() => {
    onReject?.(index);
  }, [onReject, index]);

  // 渲染播放按钮组 - 拆分复杂的渲染逻辑
  const renderPlayButtons = useCallback(() => {
    switch (valueItem.status) {
      case 'pending':
        return (
          <div className="flex items-center gap-1">
            {valueItem.originValue.url && (
              <PlayButton
                value={valueItem.originValue}
                className={BUTTON_STYLES.playOriginal}
                onClick={() => handlePlay(valueItem.originValue)}
                disabled={!valueItem.originValue.url}
              />
            )}
            {valueItem.updateValue.url && (
              <PlayButton
                value={valueItem.updateValue}
                className={BUTTON_STYLES.playUpdate}
                onClick={() => handlePlay(valueItem.updateValue)}
              />
            )}
          </div>
        );
      case 'normal':
      case 'reviewed':
        return (
          <div className="flex items-center gap-1">
            {/* 上传状态：显示加载器，隐藏播放按钮 */}
            {isUploading ? (
              <LoaderCircle className="h-3 w-3 animate-spin" />
            ) : (
              currentValue.url && (
                <PlayButton
                  value={currentValue}
                  className={BUTTON_STYLES.playDefault}
                  onClick={() => handlePlay(currentValue)}
                  forceShow={forceShowButtons}
                />
              )
            )}
            <DropdownMenu onOpenChange={setForceShowButtons}>
              <DropdownMenuTrigger>
                <EditButton className={BUTTON_STYLES.playDefault} forceShow={forceShowButtons} />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={openFileDialog}
                  disabled={isUploading}
                  className="cursor-pointer"
                >
                  <Upload className="mr-2 h-3 w-3" />
                  {isUploading ? '上传中...' : '上传音频'}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <PencilLine className="mr-2 h-3 w-3" />
                  编辑音效
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      default:
        return null;
    }
  }, [
    valueItem.status,
    valueItem.originValue,
    valueItem.updateValue,
    currentValue,
    handlePlay,
    forceShowButtons,
    isUploading,
    openFileDialog,
  ]);

  // 渲染审核按钮组
  const renderActionButtons = useCallback(() => {
    if (valueItem.status !== 'pending') return null;

    return (
      <div className="flex justify-end gap-2 border-t border-red-200 p-2">
        <ActionButton type="approve" onClick={handleApprove} />
        <ActionButton type="reject" onClick={handleReject} />
      </div>
    );
  }, [valueItem.status, handleApprove, handleReject]);

  return (
    <div className={CONTAINER_STYLES.base}>
      {/* 主内容区域 */}
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex items-center gap-2">
          {/* 序号 */}
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-600">
            {index + 1}
          </div>

          {/* 音效内容 */}
          <div className="flex flex-col gap-1">
            <div className="text-sm font-medium">{currentValue.name}</div>
            <div className="text-xs text-gray-500">{versionLabel}</div>
          </div>
        </div>

        {/* 右侧操作按钮 */}
        {renderPlayButtons()}
      </div>

      {/* 底部审核按钮（仅pending状态显示） */}
      {renderActionButtons()}
    </div>
  );
};

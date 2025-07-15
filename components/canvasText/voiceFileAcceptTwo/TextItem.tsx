'use client';
import React, { useCallback, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { PencilLine, Play, Check, X, Upload } from 'lucide-react';
import { ViewTwoTextItemFormat, ViewTwoValueItemFormat } from '@/lib/interface/viewInterface';
import { useAudioPlayerStore } from '@/lib/store/useAudioPlayerStore';
import { useStoreVoiceUpload } from '@/lib/store/useVoiceFileStore';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// 常量定义
const CONTAINER_STYLES = {
  base: 'group rounded-xl bg-white hover:bg-gray-50 border-l-2 border-blue-400',
} as const;

const BUTTON_STYLES = {
  playOriginal: 'text-red-500 hover:bg-blue-100',
  playUpdate: 'text-green-500 hover:bg-purple-100',
  playDefault: 'opacity-0 transition-opacity group-hover:opacity-100',
  approve: 'h-4 text-green-600 hover:bg-green-100',
  reject: 'h-4 text-red-600 hover:bg-red-100',
} as const;

const VERSION_LABELS = {
  original: '原始版本',
  updated: '更新版本',
} as const;

// 类型定义
interface TextItemProps {
  textItem: ViewTwoTextItemFormat;
  index: number;
  storyIndex: number;
  parentStatus: 'normal' | 'pending' | 'reviewed';
  onApprove?: (itemIndex: number) => void;
  onReject?: (itemIndex: number) => void;
}

// 播放按钮组件
interface PlayButtonProps {
  value: ViewTwoValueItemFormat;
  className?: string;
  onClick: () => void;
  forceShow?: boolean;
}

const PlayButton: React.FC<PlayButtonProps> = ({
  value,
  className = '',
  onClick,
  forceShow = false,
}) => (
  <Button
    variant="ghost"
    size="icon"
    className={getButtonClassName(className, forceShow)}
    onClick={onClick}
    title={`播放: ${value.name}`}
  >
    <Play className="h-4 w-4" />
  </Button>
);

// 通用按钮样式计算函数
const getButtonClassName = (baseClassName: string, forceShow: boolean): string => {
  return forceShow ? baseClassName.replace('opacity-0', 'opacity-100') : baseClassName;
};

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
    <PencilLine className="h-4 w-4" />
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

export const TextItem: React.FC<TextItemProps> = ({
  textItem,
  index,
  storyIndex,
  parentStatus,
  onApprove,
  onReject,
}) => {
  const { playAudio } = useAudioPlayerStore();
  const [forceShowButtons, setForceShowButtons] = useState(false);

  // 使用store来处理文本文件上传，现在包含完整的上传功能
  const { isUploading, error, openFileDialog } = useStoreVoiceUpload({
    type: 'text',
    storyIndex,
    itemIndex: index,
    valueIndex: 0,
    storyBoardIndex: textItem.storyBoardAudioScriptId,
    storyBoardIndexType: 'audioPeople',
    userId: '123',
    sessionId: '456',
  });

  // 计算当前显示的值 - 使用 useMemo 优化
  const currentValue = useMemo((): ViewTwoValueItemFormat => {
    if (textItem.status === 'normal') {
      return textItem.originValue;
    }

    // pending和reviewed状态都根据peopleSelectValue决定
    return textItem.peopleSelectValue === 'updateValue'
      ? textItem.updateValue
      : textItem.originValue;
  }, [textItem.status, textItem.peopleSelectValue, textItem.originValue, textItem.updateValue]);

  // 计算版本标签 - 使用 useMemo 优化
  const versionLabel = useMemo((): string => {
    if (textItem.status === 'normal') {
      return VERSION_LABELS.original;
    }

    return textItem.peopleSelectValue === 'updateValue'
      ? VERSION_LABELS.updated
      : VERSION_LABELS.original;
  }, [textItem.status, textItem.peopleSelectValue]);

  // 事件处理函数 - 使用 useCallback 优化
  const handlePlay = useCallback(
    (value: ViewTwoValueItemFormat) => {
      if (value.url) {
        playAudio(value.url, {
          title: value.name,
          type: 'voice',
          itemIndex: index,
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
    switch (textItem.status) {
      case 'pending':
        return (
          <div className="flex items-center gap-1">
            {textItem.originValue.url && (
              <PlayButton
                value={textItem.originValue}
                className={BUTTON_STYLES.playOriginal}
                onClick={() => handlePlay(textItem.originValue)}
              />
            )}
            {textItem.updateValue.url && (
              <PlayButton
                value={textItem.updateValue}
                className={BUTTON_STYLES.playUpdate}
                onClick={() => handlePlay(textItem.updateValue)}
              />
            )}
          </div>
        );
      case 'normal':
      case 'reviewed':
        return (
          <div className="flex items-center gap-1">
            {currentValue.url && (
              <PlayButton
                value={currentValue}
                className={BUTTON_STYLES.playDefault}
                onClick={() => handlePlay(currentValue)}
                forceShow={forceShowButtons}
              />
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
                  <Upload className="mr-2 h-4 w-4" />
                  {isUploading ? '上传中...' : '上传音频'}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <PencilLine className="mr-2 h-4 w-4" />
                  编辑文本
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      default:
        return null;
    }
  }, [
    textItem.status,
    textItem.originValue,
    textItem.updateValue,
    currentValue,
    handlePlay,
    forceShowButtons,
  ]);

  // 渲染审核按钮组
  const renderActionButtons = useCallback(() => {
    if (textItem.status !== 'pending') return null;

    return (
      <div className="flex justify-end gap-2 border-t border-red-200 p-2">
        <ActionButton type="approve" onClick={handleApprove} />
        <ActionButton type="reject" onClick={handleReject} />
      </div>
    );
  }, [textItem.status, handleApprove, handleReject]);

  return (
    <div className={CONTAINER_STYLES.base}>
      {/* 主内容区域 */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          {/* 序号 */}
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-600">
            {index + 1}
          </div>

          {/* 文本内容 */}
          <div className="flex flex-col gap-1">
            <div className="font-medium">{currentValue.name}</div>
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

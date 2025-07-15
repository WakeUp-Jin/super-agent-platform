'use client';
import React, { useCallback, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Check, X, PencilLine, Upload } from 'lucide-react';
import { ViewBoardStoryTwoInterface, ViewTwoValueItemFormat } from '@/lib/interface/viewInterface';
import { StoryTwoTextItem } from './StoryTwoTextItem';
import { StoryTwoSfxItem } from './StoryTwoSfxItem';
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
  pending: 'bg-gray-100 border-l-4',
  default: 'bg-gray-200',
} as const;

const TITLE_STYLES = {
  pending: '',
  default: 'text-gray-700',
} as const;

const BUTTON_STYLES = {
  playOriginal: 'h-8 px-2 text-red-500 hover:bg-red-50',
  playUpdate: 'h-8 px-2 text-green-500 hover:bg-green-50',
  playDefault: 'h-8 px-2',
  approve: 'h-8 min-w-[60px] px-3 text-green-600 hover:bg-green-50',
  reject: 'h-8 min-w-[60px] px-3 text-red-600 hover:bg-red-50',
} as const;

// 类型定义
interface StoryTwoContainerProps {
  storyItem: ViewBoardStoryTwoInterface;
  index: number;
  onStoryApprove?: (storyIndex: number) => void;
  onStoryReject?: (storyIndex: number) => void;
  onTextApprove?: (storyIndex: number, textIndex: number) => void;
  onTextReject?: (storyIndex: number, textIndex: number) => void;
  onSfxApprove?: (storyIndex: number, sfxIndex: number, valueIndex: number) => void;
  onSfxReject?: (storyIndex: number, sfxIndex: number, valueIndex: number) => void;
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
    size="sm"
    className={forceShow ? getButtonClassName(className, forceShow) : className}
    onClick={onClick}
    title={`播放: ${value.name}`}
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
    size="sm"
    className={forceShow ? getButtonClassName(className, forceShow) : className}
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

export const StoryTwoContainer: React.FC<StoryTwoContainerProps> = ({
  storyItem,
  index,
  onStoryApprove,
  onStoryReject,
  onTextApprove,
  onTextReject,
  onSfxApprove,
  onSfxReject,
}) => {
  const { playAudio } = useAudioPlayerStore();
  const [forceShowButtons, setForceShowButtons] = useState(false);

  // 使用store来处理故事级别的文件上传，现在包含完整的上传功能
  const { isUploading, error, openFileDialog } = useStoreVoiceUpload({
    storyIndex: index,
    type: 'story',
    storyBoardIndex: storyItem.storyBoardBgmId,
    storyBoardIndexType: 'bgm',
    userId: '123',
    sessionId: '456',
  });

  // 样式计算 - 使用 useMemo 优化
  const containerStyle = useMemo(() => {
    const baseStyle = 'flex w-full flex-col gap-2 rounded-xl p-2';
    const statusStyle =
      storyItem.status === 'pending' ? CONTAINER_STYLES.pending : CONTAINER_STYLES.default;
    return `${baseStyle} ${statusStyle}`;
  }, [storyItem.status]);

  const titleStyle = useMemo(() => {
    const baseStyle = 'text-lg font-bold';
    const statusStyle =
      storyItem.status === 'pending' ? TITLE_STYLES.pending : TITLE_STYLES.default;
    return `${baseStyle} ${statusStyle}`;
  }, [storyItem.status]);

  // 事件处理函数 - 使用 useCallback 优化
  const handlePlay = useCallback(
    (value: ViewTwoValueItemFormat) => {
      if (value.url) {
        playAudio(value.url, {
          title: value.name,
          type: 'bgm',
          storyIndex: index,
        });
      }
    },
    [playAudio, index]
  );

  const handleStoryApprove = useCallback(() => {
    onStoryApprove?.(index);
  }, [onStoryApprove, index]);

  const handleStoryReject = useCallback(() => {
    onStoryReject?.(index);
  }, [onStoryReject, index]);

  const handleTextApprove = useCallback(
    (textIndex: number) => {
      onTextApprove?.(index, textIndex);
    },
    [onTextApprove, index]
  );

  const handleTextReject = useCallback(
    (textIndex: number) => {
      onTextReject?.(index, textIndex);
    },
    [onTextReject, index]
  );

  const handleSfxApprove = useCallback(
    (sfxIndex: number, valueIndex: number) => {
      onSfxApprove?.(index, sfxIndex, valueIndex);
    },
    [onSfxApprove, index]
  );

  const handleSfxReject = useCallback(
    (sfxIndex: number, valueIndex: number) => {
      onSfxReject?.(index, sfxIndex, valueIndex);
    },
    [onSfxReject, index]
  );

  // 渲染播放按钮组 - 拆分复杂的渲染逻辑
  const renderPlayButtons = useCallback(() => {
    switch (storyItem.status) {
      case 'pending':
        return (
          <div className="flex items-center gap-2">
            {storyItem.originValue.url && (
              <PlayButton
                value={storyItem.originValue}
                className={BUTTON_STYLES.playOriginal}
                onClick={() => handlePlay(storyItem.originValue)}
              />
            )}
            {storyItem.updateValue.url && (
              <PlayButton
                value={storyItem.updateValue}
                className={BUTTON_STYLES.playUpdate}
                onClick={() => handlePlay(storyItem.updateValue)}
              />
            )}
          </div>
        );
      case 'normal':
        return (
          <div className="flex items-center gap-2">
            <PlayButton
              value={storyItem.originValue}
              className={BUTTON_STYLES.playDefault}
              onClick={() => handlePlay(storyItem.originValue)}
              forceShow={forceShowButtons}
            />
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
                  编辑故事
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      default:
        const selectedValue =
          storyItem.peopleSelectValue === 'originValue'
            ? storyItem.originValue
            : storyItem.updateValue;
        return (
          <div className="flex items-center gap-2">
            <PlayButton
              value={selectedValue}
              className={BUTTON_STYLES.playDefault}
              onClick={() => handlePlay(selectedValue)}
              forceShow={forceShowButtons}
            />
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
                  编辑故事
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
    }
  }, [storyItem, handlePlay, forceShowButtons]);

  // 渲染审核按钮组
  const renderActionButtons = useCallback(() => {
    if (storyItem.status !== 'pending') return null;

    return (
      <>
        <div className="h-4 w-px bg-gray-300" />
        <div className="flex items-center gap-3">
          <ActionButton type="approve" onClick={handleStoryApprove} />
          <ActionButton type="reject" onClick={handleStoryReject} />
        </div>
      </>
    );
  }, [storyItem.status, handleStoryApprove, handleStoryReject]);

  // 渲染子项列表
  const renderItems = useCallback(() => {
    return storyItem.items.map((item, itemIndex) => {
      const key = `${item.type}-${itemIndex}`;

      if (item.type === 'text') {
        return (
          <StoryTwoTextItem
            key={key}
            textItem={item}
            index={itemIndex}
            storyIndex={index}
            parentStatus={storyItem.status}
            onApprove={handleTextApprove}
            onReject={handleTextReject}
          />
        );
      } else if (item.type === 'sfx') {
        return (
          <StoryTwoSfxItem
            key={key}
            sfxItem={item}
            index={itemIndex}
            storyIndex={index}
            parentStatus={storyItem.status}
            onSfxApprove={handleSfxApprove}
            onSfxReject={handleSfxReject}
          />
        );
      }
      return null;
    });
  }, [
    storyItem.items,
    storyItem.status,
    handleTextApprove,
    handleTextReject,
    handleSfxApprove,
    handleSfxReject,
  ]);

  return (
    <div className={containerStyle}>
      {/* 顶部标题栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={titleStyle}>第{index + 1}部分</div>
        </div>
        <div className="flex items-center gap-4">
          {renderPlayButtons()}
          {renderActionButtons()}
        </div>
      </div>

      {/* 子项列表 */}
      <div className="flex flex-col gap-2">{renderItems()}</div>
    </div>
  );
};

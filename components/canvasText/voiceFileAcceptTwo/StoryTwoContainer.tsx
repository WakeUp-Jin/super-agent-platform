'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Check, X } from 'lucide-react';
import { ViewBoardStoryTwoInterface } from '@/lib/interface/viewInterface';
import { StoryTwoTextItem } from './StoryTwoTextItem';
import { StoryTwoSfxItem } from './StoryTwoSfxItem';

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

export function StoryTwoContainer({
  storyItem,
  index,
  onStoryApprove,
  onStoryReject,
  onTextApprove,
  onTextReject,
  onSfxApprove,
  onSfxReject,
}: StoryTwoContainerProps) {
  // 根据status确定容器样式
  const getContainerStyle = () => {
    if (storyItem.status === 'pending') {
      return 'bg-gray-200 border-l-4 border-red-400';
    }
    return 'bg-gray-200';
  };

  // 根据status确定标题样式
  const getTitleStyle = () => {
    if (storyItem.status === 'pending') {
      return 'text-red-700';
    }
    return 'text-gray-700';
  };

  // 处理故事级别的审核同意
  const handleStoryApprove = () => {
    onStoryApprove?.(index);
  };

  // 处理故事级别的审核拒绝
  const handleStoryReject = () => {
    onStoryReject?.(index);
  };

  // 处理文本项的审核同意
  const handleTextApprove = (textIndex: number) => {
    onTextApprove?.(index, textIndex);
  };

  // 处理文本项的审核拒绝
  const handleTextReject = (textIndex: number) => {
    onTextReject?.(index, textIndex);
  };

  // 处理音效项的审核同意
  const handleSfxApprove = (sfxIndex: number, valueIndex: number) => {
    onSfxApprove?.(index, sfxIndex, valueIndex);
  };

  // 处理音效项的审核拒绝
  const handleSfxReject = (sfxIndex: number, valueIndex: number) => {
    onSfxReject?.(index, sfxIndex, valueIndex);
  };

  // 渲染操作按钮区域
  const renderActionButtons = () => {
    if (storyItem.status === 'pending') {
      // pending状态：4个按钮（2个播放 + 2个审核）
      return (
        <div className="flex items-center gap-2">
          {/* 原始版本播放按钮 */}
          <Button variant="ghost" size="icon" className="text-red-500 hover:bg-blue-100">
            <Play className="h-4 w-4" />
          </Button>
          <span className="text-xs text-red-500">原始</span>

          {/* 更新版本播放按钮 */}
          <Button variant="ghost" size="icon" className="text-green-500 hover:bg-purple-100">
            <Play className="h-4 w-4" />
          </Button>
          <span className="text-xs text-green-500">更新</span>

          {/* 审核按钮 */}
          <Button
            variant="ghost"
            size="icon"
            className="text-green-600 hover:bg-green-100"
            onClick={handleStoryApprove}
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-red-600 hover:bg-red-100"
            onClick={handleStoryReject}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      );
    } else {
      // normal/reviewed状态：只有播放按钮
      return (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Play className="h-4 w-4" />
          </Button>
        </div>
      );
    }
  };

  return (
    <div className={`flex w-full flex-col gap-2 rounded-xl p-2 ${getContainerStyle()}`}>
      {/* 顶部标题栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`text-lg font-bold ${getTitleStyle()}`}>第{index + 1}部分</div>
        </div>
        {renderActionButtons()}
      </div>

      {/* 子项列表 */}
      <div className="flex flex-col gap-2">
        {storyItem.items.map((item, itemIndex) => {
          if (item.type === 'text') {
            return (
              <StoryTwoTextItem
                key={`text-${itemIndex}`}
                textItem={item}
                index={itemIndex}
                parentStatus={storyItem.status}
                onApprove={handleTextApprove}
                onReject={handleTextReject}
              />
            );
          } else if (item.type === 'sfx') {
            return (
              <StoryTwoSfxItem
                key={`sfx-${itemIndex}`}
                sfxItem={item}
                index={itemIndex}
                parentStatus={storyItem.status}
                onSfxApprove={handleSfxApprove}
                onSfxReject={handleSfxReject}
              />
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}

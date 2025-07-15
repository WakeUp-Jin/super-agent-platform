'use client';
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronsDown, ChevronsUp, Play } from 'lucide-react';
import { ViewTwoSfxItemFormat } from '@/lib/interface/viewInterface';
import { SfxItem } from './SfxItem';
import { useAudioPlayerStore } from '@/lib/store/useAudioPlayerStore';
import { getPlayValueAllByStatus, getValueByStatus } from './utils';
import { Badge } from '@/components/ui/badge';

interface StoryTwoSfxItemProps {
  sfxItem: ViewTwoSfxItemFormat;
  index: number;
  storyIndex: number;
  parentStatus: 'normal' | 'pending' | 'reviewed';
  onSfxApprove?: (sfxIndex: number, valueIndex: number) => void;
  onSfxReject?: (sfxIndex: number, valueIndex: number) => void;
}

export const StoryTwoSfxItem: React.FC<StoryTwoSfxItemProps> = ({
  sfxItem,
  index,
  storyIndex,
  parentStatus,
  onSfxApprove,
  onSfxReject,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { playSequential } = useAudioPlayerStore();

  // 处理音效子项的审核同意 - 使用 useCallback 优化
  const handleSfxApprove = useCallback(
    (valueIndex: number) => {
      onSfxApprove?.(index, valueIndex);
    },
    [onSfxApprove, index]
  );

  // 处理音效子项的审核拒绝 - 使用 useCallback 优化
  const handleSfxReject = useCallback(
    (valueIndex: number) => {
      onSfxReject?.(index, valueIndex);
    },
    [onSfxReject, index]
  );

  // 处理播放全部音效 - 使用工具函数简化音频源选择
  const handlePlayAll = useCallback(() => {
    if (sfxItem.valuesList.length === 0) return;

    const playValueAll = getPlayValueAllByStatus(sfxItem.valuesList);

    const playlist = playValueAll
      .map((value, valueIndex) => {
        return {
          src: value.url,
          title: value.name,
          type: 'sfx' as const,
          itemIndex: index,
          valueIndex: valueIndex,
        };
      })
      .filter((item) => item.src);

    if (playlist.length > 0) {
      console.log('开始序列播放音效:', playlist);
      playSequential(playlist);
    }
  }, [sfxItem, parentStatus, index, playSequential]);

  return (
    <div className="flex items-center justify-between rounded-xl bg-white px-4 py-2">
      <Collapsible className="flex w-full flex-col" open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-3">
            {/* 序号 */}
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-600">
              {index + 1}
            </div>

            {/* 音效标题 */}
            <div className="flex flex-col gap-1">
              {/* <div className="font-medium">{sfxItem.title}</div> */}
              <div className="flex flex-wrap gap-2">
                {sfxItem.title.map((item, index) => (
                  <Badge
                    className={`group relative h-7 bg-[#3c6e71] text-sm`}
                    key={`${item}-${index}`}
                  >
                    {item}
                  </Badge>
                ))}
              </div>
              <div className="text-xs text-gray-500">
                {sfxItem.valuesList.length} 个音效项
                {isOpen ? '' : ' - 点击展开'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* 播放全部按钮 */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePlayAll}
              title={`按顺序播放所有 ${sfxItem.valuesList.length} 个音效`}
            >
              <Play className="h-4 w-4" />
            </Button>

            {/* 折叠切换按钮 */}
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="icon" className="cursor-pointer">
                {isOpen ? <ChevronsUp className="h-4 w-4" /> : <ChevronsDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
          </div>
        </div>

        <CollapsibleContent className="CollapsibleContent">
          <div className="flex w-full flex-col gap-2 pt-3">
            {sfxItem.valuesList.map((valueItem, valueIndex) => (
              <SfxItem
                key={valueIndex}
                valueItem={valueItem}
                index={valueIndex}
                storyIndex={storyIndex}
                sfxIndex={index}
                parentStatus={parentStatus}
                onApprove={handleSfxApprove}
                onReject={handleSfxReject}
              />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

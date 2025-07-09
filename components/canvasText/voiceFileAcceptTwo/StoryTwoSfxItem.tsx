'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronsDown, ChevronsUp, Play } from 'lucide-react';
import { ViewTwoSfxItemFormat } from '@/lib/interface/viewInterface';
import { SfxItem } from './SfxItem';

interface StoryTwoSfxItemProps {
  sfxItem: ViewTwoSfxItemFormat;
  index: number;
  parentStatus: 'normal' | 'pending' | 'reviewed';
  onSfxApprove?: (sfxIndex: number, valueIndex: number) => void;
  onSfxReject?: (sfxIndex: number, valueIndex: number) => void;
}

export function StoryTwoSfxItem({
  sfxItem,
  index,
  parentStatus,
  onSfxApprove,
  onSfxReject,
}: StoryTwoSfxItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  // 处理音效子项的审核同意
  const handleSfxApprove = (valueIndex: number) => {
    onSfxApprove?.(index, valueIndex);
  };

  // 处理音效子项的审核拒绝
  const handleSfxReject = (valueIndex: number) => {
    onSfxReject?.(index, valueIndex);
  };

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
              <div className="font-medium">{sfxItem.title}</div>
              <div className="text-xs text-gray-500">
                {sfxItem.valuesList.length} 个音效项
                {isOpen ? '' : ' - 点击展开'}
              </div>
            </div>

            {/* 状态汇总 */}
            {/* <div className="flex items-center gap-1">
              {sfxItem.valuesList.some((v) => v.status === 'pending') && (
                <span className="rounded bg-yellow-100 px-2 py-1 text-xs text-yellow-700">
                  {sfxItem.valuesList.filter((v) => v.status === 'pending').length} 待审核
                </span>
              )}
              {sfxItem.valuesList.some((v) => v.status === 'reviewed') && (
                <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-700">
                  {sfxItem.valuesList.filter((v) => v.status === 'reviewed').length} 已审核
                </span>
              )}
            </div> */}
          </div>

          <div className="flex items-center gap-1">
            {/* 播放全部按钮 */}
            <Button variant="ghost" size="icon">
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
}

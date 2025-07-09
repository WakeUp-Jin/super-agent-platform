'use client';
import React from 'react';
import { ViewTwoTextItemFormat } from '@/lib/interface/viewInterface';
import { TextItem } from './TextItem';

interface StoryTwoTextItemProps {
  textItem: ViewTwoTextItemFormat;
  index: number;
  parentStatus: 'normal' | 'pending' | 'reviewed';
  onApprove?: (textIndex: number) => void;
  onReject?: (textIndex: number) => void;
}

export function StoryTwoTextItem({
  textItem,
  index,
  parentStatus,
  onApprove,
  onReject,
}: StoryTwoTextItemProps) {
  return (
    <TextItem
      textItem={textItem}
      index={index}
      parentStatus={parentStatus}
      onApprove={onApprove}
      onReject={onReject}
    />
  );
}

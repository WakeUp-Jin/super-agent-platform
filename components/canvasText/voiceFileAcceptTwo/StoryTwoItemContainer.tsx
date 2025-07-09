'use client';
import React from 'react';
import { ViewBoardStoryTwoInterface } from '@/lib/interface/viewInterface';
import { StoryTwoContainer } from './StoryTwoContainer';

interface StoryTwoItemContainerProps {
  storyItem: ViewBoardStoryTwoInterface;
  index: number;
}

export function StoryTwoItemContainer({ storyItem, index }: StoryTwoItemContainerProps) {
  return <StoryTwoContainer storyItem={storyItem} index={index} />;
}

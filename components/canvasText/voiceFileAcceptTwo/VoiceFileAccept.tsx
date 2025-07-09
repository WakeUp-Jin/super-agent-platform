'use client';

import React, { useState } from 'react';
import { mockViewBoardStoryTwoData } from '@/lib/mock/viewBoardStoryTwoData';
import { ViewBoardStoryTwoInterface } from '@/lib/interface/viewInterface';
import { StoryTwoContainer } from './StoryTwoContainer';

export function VoiceFileAccept() {
  const [storyData, setStoryData] =
    useState<ViewBoardStoryTwoInterface[]>(mockViewBoardStoryTwoData);

  // 处理故事级别的审核同意
  const handleStoryApprove = (storyIndex: number) => {
    setStoryData((prev) =>
      prev.map((story, idx) =>
        idx === storyIndex ? { ...story, status: 'reviewed' as const } : story
      )
    );
  };

  // 处理故事级别的审核拒绝
  const handleStoryReject = (storyIndex: number) => {
    setStoryData((prev) =>
      prev.map((story, idx) =>
        idx === storyIndex ? { ...story, status: 'reviewed' as const } : story
      )
    );
  };

  // 处理文本项的审核同意
  const handleTextApprove = (storyIndex: number, textIndex: number) => {
    setStoryData((prev) =>
      prev.map((story, storyIdx) =>
        storyIdx === storyIndex
          ? {
              ...story,
              items: story.items.map((item, itemIdx) =>
                itemIdx === textIndex && item.type === 'text'
                  ? {
                      ...item,
                      status: 'reviewed' as const,
                      peopleSelectValue: 'updateValue' as const,
                    }
                  : item
              ),
            }
          : story
      )
    );
  };

  // 处理文本项的审核拒绝
  const handleTextReject = (storyIndex: number, textIndex: number) => {
    setStoryData((prev) =>
      prev.map((story, storyIdx) =>
        storyIdx === storyIndex
          ? {
              ...story,
              items: story.items.map((item, itemIdx) =>
                itemIdx === textIndex && item.type === 'text'
                  ? {
                      ...item,
                      status: 'reviewed' as const,
                      peopleSelectValue: 'originValue' as const,
                    }
                  : item
              ),
            }
          : story
      )
    );
  };

  // 处理音效项的审核同意
  const handleSfxApprove = (storyIndex: number, sfxIndex: number, valueIndex: number) => {
    setStoryData((prev) =>
      prev.map((story, storyIdx) =>
        storyIdx === storyIndex
          ? {
              ...story,
              items: story.items.map((item, itemIdx) =>
                itemIdx === sfxIndex && item.type === 'sfx'
                  ? {
                      ...item,
                      valuesList: item.valuesList.map((value, valueIdx) =>
                        valueIdx === valueIndex
                          ? {
                              ...value,
                              status: 'reviewed' as const,
                              peopleSelectValue: 'updateValue' as const,
                            }
                          : value
                      ),
                    }
                  : item
              ),
            }
          : story
      )
    );
  };

  // 处理音效项的审核拒绝
  const handleSfxReject = (storyIndex: number, sfxIndex: number, valueIndex: number) => {
    setStoryData((prev) =>
      prev.map((story, storyIdx) =>
        storyIdx === storyIndex
          ? {
              ...story,
              items: story.items.map((item, itemIdx) =>
                itemIdx === sfxIndex && item.type === 'sfx'
                  ? {
                      ...item,
                      valuesList: item.valuesList.map((value, valueIdx) =>
                        valueIdx === valueIndex
                          ? {
                              ...value,
                              status: 'reviewed' as const,
                              peopleSelectValue: 'originValue' as const,
                            }
                          : value
                      ),
                    }
                  : item
              ),
            }
          : story
      )
    );
  };

  return (
    <div className="flex w-full flex-col gap-4 p-4">
      <div className="text-lg font-bold text-gray-800">声音文件审核</div>

      <div className="flex flex-col gap-3">
        {storyData.map((story, index) => (
          <StoryTwoContainer
            key={index}
            storyItem={story}
            index={index}
            onStoryApprove={handleStoryApprove}
            onStoryReject={handleStoryReject}
            onTextApprove={handleTextApprove}
            onTextReject={handleTextReject}
            onSfxApprove={handleSfxApprove}
            onSfxReject={handleSfxReject}
          />
        ))}
      </div>
    </div>
  );
}

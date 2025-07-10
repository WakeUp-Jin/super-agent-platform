'use client';

import React, { useEffect, useState } from 'react';
import { produce } from 'immer';
import { mockViewBoardStoryTwoData } from '@/lib/mock/viewBoardStoryTwoData';
import { ViewBoardStoryTwoInterface, ViewTwoSfxItemFormat } from '@/lib/interface/viewInterface';
import { StoryTwoContainer } from './StoryTwoContainer';
import { useViewBoardTwoStore } from '@/lib/store/useViewBoardStore';
import { getView, updateView } from '@/lib/api/view';
import { ScrollArea } from '@/components/ui/scroll-area';

export function VoiceFileAccept() {
  const [storyData, setStoryData] = useState<ViewBoardStoryTwoInterface[]>([]);

  const { boardTwo, setBoardTwo, updateBoardTwo, clearBoardTwo } = useViewBoardTwoStore();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getView({
        userId: '123',
        sessionId: '456',
        viewStep: '2',
      });
      console.log(data);

      setBoardTwo({ storyData: data, title: '' });
    };
    fetchData();
  }, [setBoardTwo]);

  useEffect(() => {
    setStoryData(boardTwo?.storyData ?? []);
  }, [boardTwo]);

  // 通用的 API 调用函数
  const callUpdateViewAPI = async (filePath: string[] | string, approved: boolean) => {
    if (!filePath || filePath.length === 0) return;

    try {
      const result = await updateView({
        sessionId: '456',
        userId: '123',
        path: filePath,
        approved,
      });
      console.log('API 调用成功:', result);
    } catch (error) {
      console.error('API 调用失败:', error);
    }
  };

  // 处理故事级别的审核同意
  const handleStoryApprove = (storyIndex: number) => {
    const findItem = storyData[storyIndex];

    setStoryData(
      produce((draft) => {
        draft[storyIndex].status = 'reviewed';
      })
    );

    callUpdateViewAPI(findItem?.bgmFilePath ?? [], true);
  };

  // 处理故事级别的审核拒绝
  const handleStoryReject = (storyIndex: number) => {
    const findItem = storyData[storyIndex];

    setStoryData(
      produce((draft) => {
        draft[storyIndex].status = 'reviewed';
      })
    );

    callUpdateViewAPI(findItem?.bgmFilePath ?? [], false);
  };

  // 处理文本项的审核同意
  const handleTextApprove = (storyIndex: number, textIndex: number) => {
    const findItem = storyData[storyIndex];
    const textItem = findItem?.items[textIndex];

    setStoryData(
      produce((draft) => {
        const item = draft[storyIndex].items[textIndex];
        if (item.type === 'text') {
          item.status = 'reviewed';
          item.peopleSelectValue = 'updateValue';
        }
      })
    );

    if (textItem && textItem.type === 'text') {
      callUpdateViewAPI(textItem.audioFilePath ?? '', true);
    }
  };

  // 处理文本项的审核拒绝
  const handleTextReject = (storyIndex: number, textIndex: number) => {
    const findItem = storyData[storyIndex];
    const textItem = findItem?.items[textIndex];

    setStoryData(
      produce((draft) => {
        const item = draft[storyIndex].items[textIndex];
        if (item.type === 'text') {
          item.status = 'reviewed';
          item.peopleSelectValue = 'originValue';
        }
      })
    );

    if (textItem && textItem.type === 'text') {
      callUpdateViewAPI(textItem.audioFilePath ?? '', false);
    }
  };

  // 处理音效项的审核同意
  const handleSfxApprove = (storyIndex: number, sfxIndex: number, valueIndex: number) => {
    const findItem = storyData[storyIndex];
    const sfxItem = findItem?.items[sfxIndex] as ViewTwoSfxItemFormat;
    const sfxValueItem = sfxItem?.valuesList[valueIndex];

    setStoryData(
      produce((draft) => {
        const item = draft[storyIndex].items[sfxIndex];
        if (item.type === 'sfx') {
          item.valuesList[valueIndex].status = 'reviewed';
          item.valuesList[valueIndex].peopleSelectValue = 'updateValue';
        }
      })
    );

    if (sfxValueItem) {
      callUpdateViewAPI(sfxValueItem.sfxFilePath ?? [], true);
    }
  };

  // 处理音效项的审核拒绝
  const handleSfxReject = (storyIndex: number, sfxIndex: number, valueIndex: number) => {
    const findItem = storyData[storyIndex];
    const sfxItem = findItem?.items[sfxIndex] as ViewTwoSfxItemFormat;
    const sfxValueItem = sfxItem?.valuesList[valueIndex];

    setStoryData(
      produce((draft) => {
        const item = draft[storyIndex].items[sfxIndex];
        if (item.type === 'sfx') {
          item.valuesList[valueIndex].status = 'reviewed';
          item.valuesList[valueIndex].peopleSelectValue = 'originValue';
        }
      })
    );

    if (sfxValueItem) {
      const filePath = Array.isArray(sfxValueItem.sfxFilePath)
        ? (sfxValueItem.sfxFilePath[0] ?? '')
        : (sfxValueItem.sfxFilePath ?? '');
      callUpdateViewAPI(filePath, false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-4 p-1">
      <ScrollArea className="h-full w-full pr-3">
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
      </ScrollArea>
    </div>
  );
}

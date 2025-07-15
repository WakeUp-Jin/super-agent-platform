'use client';

import React, { useEffect, useState } from 'react';
import { produce } from 'immer';
import { mockViewBoardStoryTwoData } from '@/lib/mock/viewBoardStoryTwoData';
import { ViewBoardStoryTwoInterface, ViewTwoSfxItemFormat } from '@/lib/interface/viewInterface';
import { StoryTwoContainer } from './StoryTwoContainer';
import { useViewBoardTwoStore } from '@/lib/store/useViewBoardStore';
import { useAudioPlayerStore } from '@/lib/store/useAudioPlayerStore';
import { getView, updateView } from '@/lib/api/view';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'motion/react';
import { PlayerAudio } from '@/components/common/PlayerAudio';
import { Button } from '@/components/ui/button';
import { SkeletonLoader } from '@/components/common/SkeletonLoader';
import { allStatusIsNormal, allStatusNotPending } from './utils';
import { createBoardStoryDiff } from '@/lib/api/view';
import { useVoiceFileStore } from '@/lib/store/useVoiceFileStore';

export function VoiceFileAccept() {
  const [storyData, setStoryData] = useState<ViewBoardStoryTwoInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { boardTwo, setBoardTwo, updateBoardTwo, clearBoardTwo } = useViewBoardTwoStore();
  const { isBottomPanelVisible, toggleBottomPanel } = useAudioPlayerStore();
  const { setStoryDataUpdater } = useVoiceFileStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await getView({
          userId: '123',
          sessionId: '456',
          viewStep: '2',
        });
        console.log(data);

        setBoardTwo({ storyData: data, title: '' });
      } catch (error) {
        console.error('获取数据失败:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [setBoardTwo]);

  //监听store的全局状态boardTwo的变化
  useEffect(() => {
    setStoryData(boardTwo?.storyData ?? []);
  }, [boardTwo]);

  // 设置Zustand store的数据更新函数
  useEffect(() => {
    setStoryDataUpdater(setStoryData);
    // 组件卸载时清理
    return () => setStoryDataUpdater(null);
  }, [setStoryDataUpdater]);

  //监听storyData的变化，发起创建画本的请求
  useEffect(() => {
    if (storyData.length > 0) {
      checkAllReviewCompletedTwo(storyData);
    }
  }, [storyData]);

  const checkAllReviewCompletedTwo = (currentBoardData: ViewBoardStoryTwoInterface[]) => {
    const allBgmNotPending = currentBoardData.every((item) => allStatusNotPending(item));
    console.log('🚀 ~ checkAllReviewCompletedTwo ~ allBgmNotPending:', allBgmNotPending);

    const allBgmIsNormal = currentBoardData.every((item) => allStatusIsNormal(item));
    console.log('🚀 ~ checkAllReviewCompletedTwo ~ allBgmIsNormal:', allBgmIsNormal);

    if (allBgmNotPending && !allBgmIsNormal) {
      console.log('所有审核已完成，准备发起修改画本请求');
      createBoardStoryDiff({
        sessionId: '456',
        userId: '123',
        viewStep: '2',
      })
        .then((res) => {
          console.log('更新后端画本数据成功', res);
        })
        .catch((err) => {
          console.log('更新后端画本数据失败', err);
        });
    }
  };

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

  // 处理背景BGM级别的审核同意
  const handleStoryApprove = (storyIndex: number) => {
    const findItem = storyData[storyIndex];

    setStoryData(
      produce((draft) => {
        draft[storyIndex].status = 'reviewed';
      })
    );

    callUpdateViewAPI(findItem?.bgmFilePath ?? [], true);
  };

  // 处理背景BGM级别的审核拒绝
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
    <div className="flex h-full w-full flex-col gap-4 overflow-hidden p-1">
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full w-full pr-3">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800">声音文件审核</h2>
            <Button variant="outline" size="sm" onClick={toggleBottomPanel}>
              {isBottomPanelVisible ? '收起播放栏' : '展开播放栏'}
            </Button>
          </div>

          {isLoading ? (
            <SkeletonLoader />
          ) : (
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
          )}
        </ScrollArea>
      </div>
      <AnimatePresence>
        {isBottomPanelVisible && (
          <motion.div
            className="w-ful"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ opacity: 0 }}
            transition={{
              y: { type: 'spring', stiffness: 400, damping: 30 },
              opacity: { duration: 0.2 },
            }}
          >
            <div className="p-1 text-center text-white">
              <PlayerAudio />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

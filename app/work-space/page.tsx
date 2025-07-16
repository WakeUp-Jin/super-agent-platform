'use client';

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { ChatContainer } from '@/components/assistant-chat/ChatContainer';
import { SfxDescUpdate } from '@/components/canvasText/sfxDescUpdateOne/SfxDescUpdate';
import { VoiceFileAccept } from '@/components/canvasText/voiceFileAcceptTwo/VoiceFileAccept';
import { useState, useEffect } from 'react';
import { getView } from '@/lib/api/view';
import { useViewBoardStore } from '@/lib/store/useViewBoardStore';
import { useViewBoardTwoStore } from '@/lib/store/useViewBoardStore';
import { useButtonStore } from '@/lib/store/useButtonStore';

export default function ResizablePanels() {
  const { board, setBoard } = useViewBoardStore();
  const { boardTwo, setBoardTwo, updateBoardTwo, clearBoardTwo } = useViewBoardTwoStore();

  // 使用全局按钮状态 store
  const {
    isTextOneButtonDisabled,
    isAudioOneButtonDisabled,
    setTextOneButtonDisabled,
    setAudioOneButtonDisabled,
  } = useButtonStore();

  //音频审核画本数据加载状态-骨架加载
  const [isTwoLoading, setIsTwoLoading] = useState(true);

  //切换画本视图步骤的按钮
  let [stepView, setStepView] = useState('textOne');

  //获取文本审核画本数据
  useEffect(() => {
    const fetchData = async () => {
      const data = await getView({
        userId: '123',
        sessionId: '456',
        viewStep: 'oneText',
      });
      console.log(data);
      if (data.title) {
        setTextOneButtonDisabled(false);
      }
      setBoard(data);
    };
    fetchData();
  }, [setBoard]);

  //获取音频审核画本数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsTwoLoading(true);
        const data = await getView({
          userId: '123',
          sessionId: '456',
          viewStep: 'twoAudio',
        });
        console.log(data);
        if (data.length !== 0) {
          setAudioOneButtonDisabled(false);
        }

        setBoardTwo({ storyData: data, title: '' });
      } catch (error) {
        console.error('获取数据失败:', error);
      } finally {
        setIsTwoLoading(false);
      }
    };
    fetchData();
  }, [setBoardTwo]);

  return (
    <ResizablePanelGroup direction="horizontal" className="h-screen">
      <ResizablePanel defaultSize={35}>
        <div className="flex h-full items-center justify-center">
          {/* <span className="font-semibold">Sidebar</span>
           */}
          {/* <ChatContainer messages={messages} onSend={() => {}} /> */}
          <ChatContainer stepView={stepView} setStepView={setStepView}></ChatContainer>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={65}>
        <div className="flex h-full w-full p-5">
          {stepView === 'textOne' && <SfxDescUpdate></SfxDescUpdate>}
          {stepView === 'audioOne' && (
            <VoiceFileAccept isTwoLoading={isTwoLoading}></VoiceFileAccept>
          )}
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

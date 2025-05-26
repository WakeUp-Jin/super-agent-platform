'use client';

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { ChatContainer } from '@/components/assistant-chat/ChatContainer';
import { SfxDescUpdate } from '@/components/canvasText/sfxDescUpdateOne/SfxDescUpdate';
import { VoiceFileAccept } from '@/components/canvasText/voiceFileAcceptTwo/VoiceFileAccept';

export default function ResizablePanels() {
  let aiMessage = `
  ## Overview
 
 * Follows [CommonMark](https://commonmark.org)
 * Optionally follows [GitHub Flavored Markdown](https://github.github.com/gfm/)
 * Renders actual React elements instead of using \`dangerouslySetInnerHTML\`
 * Lets you define your own components (to render \`MyHeading\` instead of \`'h1'\`)
 * Has a lot of plugins
   `;

  let userMessage =
    '很长很长很长很长很长很长的文字，如果文字超出了最大宽度就会自动换行，没有最大高度限制，能一直往下撑开……';

  let messages = [
    {
      id: '1',
      role: 'user' as const,
      content: userMessage,
    },
    {
      id: '2',
      role: 'assistant' as const,
      content: aiMessage,
    },
    {
      id: '3',
      role: 'user' as const,
      content: userMessage,
    },
  ];

  return (
    // <PanelGroup direction="horizontal" className="h-screen">
    //   <Panel defaultSize={40} minSize={20} className="flex flex-col">
    //     <ChatContainer messages={[]} onSend={() => {}} />
    //   </Panel>
    //   <PanelResizeHandle className="w-2 bg-gray-100 hover:bg-gray-200 transition-colors duration-150 relative">
    //     <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-gray-300 shadow-[0_0_4px_rgba(0,0,0,0.1)]" />
    //   </PanelResizeHandle>
    //   <Panel defaultSize={60} minSize={20}>
    //     right 右
    //   </Panel>
    // </PanelGroup>

    <ResizablePanelGroup direction="horizontal" className="h-screen">
      <ResizablePanel defaultSize={35}>
        <div className="flex h-full items-center justify-center">
          {/* <span className="font-semibold">Sidebar</span>
           */}
          <ChatContainer messages={messages} onSend={() => {}} />
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={65}>
        <div className="flex h-full w-full p-5">
          <SfxDescUpdate></SfxDescUpdate>
          {/* <VoiceFileAccept></VoiceFileAccept> */}
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

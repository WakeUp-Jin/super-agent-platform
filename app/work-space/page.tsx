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
    <ResizablePanelGroup direction="horizontal" className="h-screen">
      <ResizablePanel defaultSize={35}>
        <div className="flex h-full items-center justify-center">
          {/* <span className="font-semibold">Sidebar</span>
           */}
          {/* <ChatContainer messages={messages} onSend={() => {}} /> */}
          <ChatContainer></ChatContainer>
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

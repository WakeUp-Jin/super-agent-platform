'use client';

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { ChatContainer } from '@/components/assistant-chat/ChatContainer';

export default function ResizablePanels() {
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
          <ChatContainer messages={[]} onSend={() => {}} />
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={65}>
        <div className="flex h-full items-center justify-center">
          <span className="font-semibold">Content</span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

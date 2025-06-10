'use client';

import { ChatContainer } from '@/components/assistant-chat/ChatContainer';
import { TooltipProvider } from '@/components/ui/tooltip';

export default function ChatPage() {
  return (
    <TooltipProvider>
      <div className="h-screen w-full">
        <ChatContainer />
      </div>
    </TooltipProvider>
  );
}

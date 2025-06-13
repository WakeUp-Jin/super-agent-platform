// ChatContainer.tsx
'use client';
import { useRef, useEffect } from 'react';
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { EllipsisVertical, Columns2, SquarePen } from 'lucide-react';
import { UserMessageItem } from './UserMessageItem';
import { AssistantMessage } from './AssistantMessage';
import { ScrollArea } from '../ui/scroll-area';
import { Toggle } from '@radix-ui/react-toggle';
import { useChatStream, Message } from '@/lib/useChatStream';

/**
 * ChatContainer                // 顶层容器，管理整体聊天流程
├── useChatStream Hook          // 状态管理和API调用
├── ChatMessages                // 消息列表渲染
└── ChatMessageItem             // 单条消息路由
    ├── UserMessageItem         // 用户消息显示
    └── AssistantMessage        // AI消息显示
        ├── AgentStatesDisplay  // Agent状态列表管理
        │   └── AgentStatusItem // 单个Agent状态显示
        └── Markdown内容显示
 * 
 */

interface ChatProps {
  // 使用内置的聊天状态管理，不需要外部传入
}

export function ChatContainer({}: ChatProps) {
  // 使用聊天流Hook
  const { messages, loading, error, sendMessage, clearMessages } = useChatStream();

  // 输入内容状态
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [input, setInput] = React.useState('');

  // 自动滚动到底部
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 发送消息
  function handleSend() {
    if (input.trim() && !loading) {
      sendMessage(input);
      setInput('');
      inputRef.current?.focus();
    }
  }

  // 处理回车发送
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex h-full w-full flex-col overflow-hidden border">
      <div id="tab-header" className="flex w-full basis-1/14 items-center justify-between p-2">
        <div className="flex gap-3">
          <div className="flex gap-3">
            <Toggle
              className="cursor-pointer border-none px-2 hover:bg-gray-200"
              aria-label="Toggle columns"
            >
              <Columns2></Columns2>
            </Toggle>
            <Toggle
              aria-label="Toggle square pen"
              className="cursor-pointer border-none px-2 hover:bg-gray-200"
            >
              <SquarePen></SquarePen>
            </Toggle>
          </div>
          <Button variant="ghost" className="cursor-pointer text-lg">
            WakeUp 3.0
          </Button>
        </div>
        <div className="flex items-center pr-3">
          <Button variant="ghost" className="cursor-pointer rounded-full py-0">
            <EllipsisVertical className="size-5" />
          </Button>
        </div>
      </div>

      {/* 消息区 - 可滚动 */}
      <div className="flex flex-1 basis-5/6 items-center justify-center overflow-y-auto">
        <ScrollArea className="h-full w-full">
          <div className="flex items-center justify-center">
            <div className="h-full max-w-[567px] min-w-[134px] flex-1 space-y-3 overflow-y-auto">
              <ChatMessages messages={messages} loading={loading} />
              <div ref={messagesEndRef} />
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* 输入栏 - 固定底部 */}
      <div id="chat-bootom" className="flex w-full basis-3/14 flex-col">
        <div className="flex w-full basis-4/5 items-center justify-center">
          <div className="flex w-full max-w-[567px] min-w-[134px]">
            <div className="bg-background flex max-w-full flex-1 flex-col justify-end rounded-3xl border">
              <div className="m-2">
                <div className="flex flex-row">
                  <Textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="请输入..."
                    className="custom-scrollbar max-h-[150px] min-h-12 w-full resize-none rounded-lg border-none p-4 focus:ring-0 focus:outline-none focus-visible:ring-0"
                    disabled={loading}
                  />
                </div>
                <div className="flex w-full flex-row items-center justify-between">
                  <div>
                    <Button
                      variant="ghost"
                      className="h-10 w-10 rounded-full p-0"
                      onClick={clearMessages}
                      disabled={loading}
                    >
                      清空
                    </Button>
                  </div>
                  <div>
                    <Button className="h-10 w-10 rounded-full p-0" onClick={handleSend}>
                      {loading ? '...' : '发送'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full basis-1/5 items-center justify-center text-center text-xs">
          <p>模型也可能会犯错，请核查重要信息</p>
        </div>
      </div>
    </div>
  );
}

// 单条消息
function ChatMessages({ messages, loading }: { messages: Message[]; loading: boolean }) {
  return (
    <div>
      {messages.map((msg) => (
        <ChatMessageItem key={msg.id} {...msg} loading={loading} />
      ))}
    </div>
  );
}

// 单条消息渲染
function ChatMessageItem({ role, content, agentStates, loading }: Message & { loading: boolean }) {
  const isUser = role === 'user';
  return (
    <>
      {isUser ? (
        <UserMessageItem content={content} />
      ) : (
        <AssistantMessage loading={loading} content={content} agentStates={agentStates} />
      )}
    </>
  );
}

// ChatContainer.tsx
'use client';
import { useRef, useEffect } from 'react';
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  CopyIcon,
  RefreshCwIcon,
  SendHorizontalIcon,
  UserIcon,
  BotIcon,
  PlusIcon,
  Settings2Icon,
  MicIcon,
  Wand2Icon,
} from 'lucide-react';
import { UserMessageItem } from './userMessageItem';

// 你可以这样定义消息类型
type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

interface ChatProps {
  messages: Message[];
  onSend: (content: string) => void;
  loading?: boolean;
}

export function ChatContainer({ messages, onSend, loading }: ChatProps) {
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
    if (input.trim()) {
      onSend(input);
      setInput('');
      inputRef.current?.focus();
    }
  }

  return (
    <div className="flex h-full w-full flex-col overflow-hidden border">
      <div id="tab-header" className="w-full basis-1/14 bg-red-400"></div>

      {/* 消息区 - 可滚动 */}
      <div className="flex-1 basis-5/6 overflow-y-auto bg-gray-100 p-6">
        {/* <ChatMessages messages={messages} />
        <div ref={messagesEndRef} /> */}
        <UserMessageItem />
      </div>

      {/* 输入栏 - 固定底部 */}
      <div id="chat-bootom" className="flex w-full basis-3/14 flex-col bg-green-400">
        <div className="flex w-full basis-4/5 items-center justify-center">
          <div className="flex w-full max-w-[567px] min-w-[134px]">
            <div className="bg-background flex max-w-full flex-1 flex-col justify-end rounded-3xl border">
              <div className="m-2">
                <div className="flex flex-row">
                  <div
                    contentEditable="true"
                    className="custom-scrollbar max-h-[150px] min-h-12 w-full rounded-lg border border-none p-4 empty:before:text-gray-400 empty:before:content-[attr(data-placeholder)] focus:outline-none"
                    id="editor"
                    data-placeholder="请输入..."
                  ></div>
                </div>
                <div className="flex w-full flex-row items-center justify-between">
                  <div>
                    <Button variant="ghost" className="h-10 w-10 rounded-full p-0">
                      工具
                    </Button>
                  </div>
                  <div>
                    <Button className="h-10 w-10 rounded-full p-0">发送</Button>
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
function ChatMessages({ messages }: { messages: Message[] }) {
  return (
    <div className="flex flex-col gap-4">
      {messages.map((msg) => (
        <ChatMessageItem key={msg.id} {...msg} />
      ))}
    </div>
  );
}

// 单条消息渲染
function ChatMessageItem({ role, content }: Message) {
  const isUser = role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      {/* 用户消息右对齐，助手消息左对齐 */}
      {!isUser && (
        <div className="mr-2 flex items-end">
          <BotIcon className="text-muted-foreground h-7 w-7" />
        </div>
      )}
      <div
        className={`relative max-w-[70%] rounded-2xl px-4 py-2 ${
          isUser
            ? 'bg-primary text-primary-foreground rounded-br-md'
            : 'text-foreground rounded-bl-md border bg-white'
        } shadow`}
      >
        <span className="whitespace-pre-wrap">{content}</span>
        <div className="absolute -bottom-7 left-2 flex gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
                <CopyIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>复制</TooltipContent>
          </Tooltip>
          {!isUser && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
                  <RefreshCwIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>重新生成</TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
      {isUser && (
        <div className="ml-2 flex items-end">
          <UserIcon className="text-muted-foreground h-7 w-7" />
        </div>
      )}
    </div>
  );
}

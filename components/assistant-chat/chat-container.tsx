// ChatContainer.tsx
import { useRef, useEffect } from "react";
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CopyIcon, RefreshCwIcon, SendHorizontalIcon, UserIcon, BotIcon, PlusIcon, Settings2Icon, MicIcon, Wand2Icon } from "lucide-react";

// 你可以这样定义消息类型
type Message = {
  id: string;
  role: "user" | "assistant";
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
  const [input, setInput] = React.useState("");

  // 自动滚动到底部
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 发送消息
  function handleSend() {
    if (input.trim()) {
      onSend(input);
      setInput("");
      inputRef.current?.focus();
    }
  }

  return (
    <div className="flex flex-col w-full h-full border border rounded-2xl overflow-hidden">
      {/* 消息区 - 可滚动 */}
      <div className="h-5/6 overflow-y-auto p-6 bg-gray-500">
        <ChatMessages messages={messages} />
        <div ref={messagesEndRef} />
      </div>

      {/* 输入栏 - 固定底部 */}
      <div className="h-1/6 flex flex-col bg-background border-t">
        <div className="flex flex-row">
          <Textarea className="resize-none"></Textarea>
        </div>
        <div className="flex flex-row items-center justify-between w-full px-4 py-2">
          <div>
            <Button>工具</Button>
          </div>
          <div>
            <Button>发送</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 单条消息
function ChatMessages({ messages }: { messages: Message[] }) {
  return (
    <div className="flex flex-col gap-4">
      {messages.map(msg => (
        <ChatMessageItem key={msg.id} {...msg} />
      ))}
    </div>
  );
}

// 单条消息渲染
function ChatMessageItem({ role, content }: Message) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      {/* 用户消息右对齐，助手消息左对齐 */}
      {!isUser && (
        <div className="flex items-end mr-2">
          <BotIcon className="w-7 h-7 text-muted-foreground" />
        </div>
      )}
      <div
        className={`relative max-w-[70%] px-4 py-2 rounded-2xl ${
          isUser
            ? "bg-primary text-primary-foreground rounded-br-md"
            : "bg-white text-foreground border rounded-bl-md"
        } shadow`}
      >
        <span className="whitespace-pre-wrap">{content}</span>
        <div className="flex gap-2 absolute -bottom-7 left-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
                <CopyIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>复制</TooltipContent>
          </Tooltip>
          { !isUser && (
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
        <div className="flex items-end ml-2">
          <UserIcon className="w-7 h-7 text-muted-foreground" />
        </div>
      )}
    </div>
  );
}

import React from 'react';
import { Message } from '@/lib/useChatStream';
import { MessageCircle, User, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pencil, RefreshCwIcon, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Copy } from 'lucide-react';
import { Toggle } from '../ui/toggle';
import Markdown from 'react-markdown';
import { AgentStatesDisplay } from './AgentStatesDisplay';
import { AgentEventData } from '@/lib/interface/chatInterface';
import LoadingDots from '../common/LoadingDots';

interface AssistantMessageProps {
  loading: boolean;
  content: string;
  agentStates?: Map<string, AgentEventData>;
}

export function AssistantMessage({ loading, content, agentStates }: AssistantMessageProps) {
  return (
    <div className="flex w-full justify-start">
      <div className="flex flex-col">
        {/* 显示 Agent 状态 */}
        {agentStates && <AgentStatesDisplay agentStates={agentStates} />}

        {/* 显示聊天内容 */}
        {content && (
          <div className="prose rounded-lg p-4 break-words shadow">
            <Markdown>{content}</Markdown>
          </div>
        )}
        {loading ? (
          <LoadingDots />
        ) : (
          <div className="max-w-sm">
            <Toggle
              aria-label="Toggle italic"
              className="cursor-pointer border-none hover:bg-gray-200"
            >
              <Copy className="h-4 w-4" />
            </Toggle>
            <Toggle
              aria-label="Toggle italic"
              className="cursor-pointer border-none hover:bg-gray-200"
            >
              <ThumbsUp className="h-4 w-4" />
            </Toggle>
            <Toggle
              aria-label="Toggle italic"
              className="cursor-pointer border-none hover:bg-gray-200"
            >
              <ThumbsDown className="h-4 w-4" />
            </Toggle>
            <Toggle
              aria-label="Toggle italic"
              className="cursor-pointer border-none hover:bg-gray-200"
            >
              <RefreshCwIcon className="h-4 w-4" />
            </Toggle>
          </div>
        )}
        {/* <div className="max-w-sm">
          <Toggle
            aria-label="Toggle italic"
            className="cursor-pointer border-none hover:bg-gray-200"
          >
            <Copy className="h-4 w-4" />
          </Toggle>
          <Toggle
            aria-label="Toggle italic"
            className="cursor-pointer border-none hover:bg-gray-200"
          >
            <ThumbsUp className="h-4 w-4" />
          </Toggle>
          <Toggle
            aria-label="Toggle italic"
            className="cursor-pointer border-none hover:bg-gray-200"
          >
            <ThumbsDown className="h-4 w-4" />
          </Toggle>
          <Toggle
            aria-label="Toggle italic"
            className="cursor-pointer border-none hover:bg-gray-200"
          >
            <RefreshCwIcon className="h-4 w-4" />
          </Toggle>
        </div>
        <LoadingDots /> */}
      </div>
    </div>
  );
}

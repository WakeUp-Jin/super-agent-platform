import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pencil, RefreshCwIcon, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Copy } from 'lucide-react';
import { Toggle } from '../ui/toggle';
import Markdown from 'react-markdown';

export function AssistantMessage({ content }: { content: string }) {
  return (
    <div className="flex w-full justify-start">
      <div className="flex flex-col">
        <div className="prose rounded-lg p-4 break-words shadow">
          {/* 这里是一段很长很长很长很长很长很长的文字，如果文字超出了最大宽度就会自动换行，没有最大高度限制，能一直往下撑开…… */}
          <Markdown>{content}</Markdown>
        </div>
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
      </div>
    </div>
  );
}

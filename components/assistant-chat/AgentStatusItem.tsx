import React, { useState } from 'react';
import {
  CheckCircle,
  Eye,
  HandHelping,
  Loader2,
  Rotate3d,
  Sparkle,
  UserRoundCog,
} from 'lucide-react';
import { AgentEventData } from '@/lib/interface/chatInterface';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronsUpDown } from 'lucide-react';

interface AgentStatusItemProps {
  agentData: AgentEventData;
}

export function AgentStatusItem({ agentData }: AgentStatusItemProps) {
  const { agentId, agentName, agentOperate, status, agentDesc, agentResult } = agentData;
  const [isOpen, setIsOpen] = useState(false);

  const chineseAgentOperate = (agentOperate: string | undefined) => {
    switch (agentOperate) {
      case 'think':
        return '思考';
      case 'read':
        return '阅读';
      case 'edit':
        return '编辑';
      case 'execute':
        return '执行';
      default:
        return '';
    }
  };

  const agentTitle = agentDesc
    ? `${agentOperate}-${agentDesc}`
    : `${chineseAgentOperate(agentOperate)}中...`;

  const isCompleted = status === 'completed';
  const isStarted = status === 'started';

  // 根据agentOperate 返回不同的icon

  return (
    <div>
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="flex w-[350px] flex-col gap-2">
        <div className="flex items-center justify-between gap-4 px-4">
          <h4 className="text-sm font-semibold">@peduarte starred 3 repositories</h4>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <ChevronsUpDown />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <div className="rounded-md border px-4 py-2 font-mono text-sm">@radix-ui/primitives</div>
        <CollapsibleContent className="flex flex-col gap-2">
          <div className="rounded-md border px-4 py-2 font-mono text-sm">@radix-ui/colors</div>
          <div className="rounded-md border px-4 py-2 font-mono text-sm">@stitches/react</div>
        </CollapsibleContent>
      </Collapsible>

      <div className="flex items-center gap-3 rounded-lg border bg-gray-50 px-3 py-2">
        {/* 状态图标 */}
        <div className="flex-shrink-0">
          {agentOperate === 'think' ? (
            <Sparkle className="h-3 w-3 text-blue-500" />
          ) : agentOperate === 'read' ? (
            <Eye className="h-3 w-3 text-blue-500" />
          ) : agentOperate === 'edit' ? (
            <HandHelping className="h-3 w-3 text-blue-500" />
          ) : agentOperate === 'execute' ? (
            <UserRoundCog className="h-3 w-3 text-blue-500" />
          ) : (
            <div className="h-3 w-3 rounded-full border-2 border-gray-300" />
          )}
        </div>

        {/* Agent 信息 */}
        <div className="flex min-w-0 flex-1 gap-2">
          <div className="flex items-center gap-2">
            {agentTitle && (
              <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700">
                {agentTitle}
              </span>
            )}
          </div>

          {/* 状态描述 */}
          <div className="mt-1 text-xs text-gray-600">
            {isStarted && agentDesc && <span>{agentDesc}</span>}
            {isCompleted && agentResult && <span className="text-green-600">{agentResult}</span>}
          </div>
        </div>

        {/* 状态文本 */}
        <div className="flex-shrink-0 text-xs text-gray-500">
          {isCompleted ? (
            <CheckCircle className="h-3 w-3 text-green-500" />
          ) : isStarted ? (
            <Loader2 className="h-3 w-3 animate-spin text-blue-500" />
          ) : (
            <div className="h-3 w-3 rounded-full border-2 border-gray-300" />
          )}
        </div>
      </div>
    </div>
  );
}

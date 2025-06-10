import React from 'react';
import { CheckCircle, Loader2 } from 'lucide-react';
import { AgentEventData } from '@/lib/interface/chatInterface';

interface AgentStatusItemProps {
  agentData: AgentEventData;
}

export function AgentStatusItem({ agentData }: AgentStatusItemProps) {
  const { agentId, agentName, agentOperate, status, agentDesc, agentResult } = agentData;

  const isCompleted = status === 'completed';
  const isStarted = status === 'started';

  return (
    <div className="flex items-center gap-3 rounded-lg border bg-gray-50 px-3 py-2">
      {/* 状态图标 */}
      <div className="flex-shrink-0">
        {isCompleted ? (
          <CheckCircle className="h-5 w-5 text-green-500" />
        ) : isStarted ? (
          <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
        ) : (
          <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
        )}
      </div>

      {/* Agent 信息 */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900">{agentName}</span>
          {agentOperate && (
            <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700">
              {agentOperate}
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
        {isCompleted ? '完成' : isStarted ? '运行中' : '等待'}
      </div>
    </div>
  );
}

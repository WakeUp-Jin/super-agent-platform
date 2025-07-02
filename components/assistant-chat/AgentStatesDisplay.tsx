import React from 'react';
import { AgentStatusItem } from './AgentStatusItem';
import { AgentEventData } from '@/lib/interface/chatInterface';

interface AgentStatesDisplayProps {
  agentStates: Map<string, AgentEventData>;
}

export function AgentStatesDisplay({ agentStates }: AgentStatesDisplayProps) {
  if (!agentStates || agentStates.size === 0) {
    return null;
  }

  // 将 Map 转换为数组并按时间排序
  let agentList = Array.from(agentStates.values()).sort((a, b) => {
    return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
  });

  //过滤
  agentList = agentList.filter((agent) => agent.agentId !== 'chatNode');

  return (
    <div className="mb-1 space-y-2">
      <div className="text-xs font-medium text-gray-500">处理进度</div>
      <div className="space-y-1">
        {agentList.map((agentData) => (
          <AgentStatusItem key={agentData.agentId} agentData={agentData} />
        ))}
      </div>
    </div>
  );
}

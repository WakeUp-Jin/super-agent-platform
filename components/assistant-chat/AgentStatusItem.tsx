import React, { useState, useMemo } from 'react';
import {
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Eye,
  HandHelping,
  Loader2,
  Sparkle,
  UserRoundCog,
  LucideIcon,
} from 'lucide-react';
import { AgentEventData } from '@/lib/interface/chatInterface';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

// 类型定义
type AgentOperation = 'think' | 'read' | 'edit' | 'execute';
type AgentStatus = 'started' | 'completed' | 'pending';

interface AgentStatusItemProps {
  agentData: AgentEventData;
}

// 常量配置
const AGENT_OPERATION_CONFIG: Record<AgentOperation, { icon: LucideIcon; label: string }> = {
  think: { icon: Sparkle, label: '思考' },
  read: { icon: Eye, label: '阅读' },
  edit: { icon: HandHelping, label: '编辑' },
  execute: { icon: UserRoundCog, label: '执行' },
};

const ICON_STYLES = {
  operation: 'h-3 w-3 text-blue-500',
  status: {
    completed: 'h-3 w-3 text-green-500',
    loading: 'h-3 w-3 animate-spin text-blue-500',
    pending: 'h-3 w-3 rounded-full border-2 border-gray-300',
  },
  chevron: {
    down: 'h-3 w-3 text-gray-500',
    right: 'h-3 w-3 text-blue-500',
  },
} as const;

export function AgentStatusItem({ agentData }: AgentStatusItemProps) {
  const { agentOperate, status, agentDesc, agentResult } = agentData;
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // 获取操作配置
  const operationConfig = AGENT_OPERATION_CONFIG[agentOperate as AgentOperation];

  // 渲染操作图标
  const renderOperationIcon = () => {
    if (isOpen) {
      return <ChevronDown className={ICON_STYLES.chevron.down} />;
    }

    if (isHovered) {
      return <ChevronRight className={ICON_STYLES.chevron.right} />;
    }

    if (operationConfig) {
      const IconComponent = operationConfig.icon;
      return <IconComponent className={ICON_STYLES.operation} />;
    }

    return <ChevronDown className={ICON_STYLES.chevron.down} />;
  };

  // 渲染状态图标
  const renderStatusIcon = () => {
    switch (status) {
      case 'completed':
        return <CheckCircle className={ICON_STYLES.status.completed} />;
      case 'started':
        return <Loader2 className={ICON_STYLES.status.loading} />;
      default:
        return <div className={ICON_STYLES.status.pending} />;
    }
  };

  // 生成标题
  const agentTitle = useMemo(() => {
    if (agentDesc) {
      return `${operationConfig.label}-${agentDesc}`;
    }

    const label = operationConfig?.label || '';
    return label ? `${label}中...` : '';
  }, [agentOperate, agentDesc, operationConfig]);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="flex w-full flex-col gap-2">
        <div className="flex w-full">
          <CollapsibleTrigger asChild>
            <div className="flex w-full items-center gap-3 rounded-lg border bg-gray-50 px-1 py-1">
              <div className="flex min-w-0 flex-1 gap-2">
                <div className="flex flex-shrink-0 items-center">{renderOperationIcon()}</div>

                <div className="flex items-center gap-2">
                  {agentTitle && (
                    <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700">
                      {agentTitle}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-shrink-0 items-center">{renderStatusIcon()}</div>
            </div>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent className="flex flex-col gap-2">
          {agentResult && (
            <div className="px-4 py-2 font-mono text-sm text-gray-400">{agentResult}</div>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

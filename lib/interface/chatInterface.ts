export interface SendMessageRequest {
  userInput: string;
  inputParam?: SendMessageInputParam;
}

export interface SendMessageInputParam {
  userId: string;
  sessionId: string;
  messageId: string;
}

export interface StreamEventData {
  event: string;
  name?: string;
  data: any;
  timestamp?: string;
}

export type ViewType = 'oneText' | 'twoAudio';

// 具体的事件数据类型
export interface AgentEventData {
  agentId: string;
  agentName: string;
  agentOperate?: string;
  messageComType?: string;
  status: 'started' | 'completed';
  agentDesc?: string;
  agentResult?: string;
  chatAgentContent?: any;
  shouldQueryRedis?: string;
  viewType?: ViewType;
  timestamp: string;
}

export interface StreamEndData {
  message: string;
}

export interface ErrorData {
  message: string;
}

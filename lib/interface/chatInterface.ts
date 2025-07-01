export interface SendMessageRequest {
  userInput: string;
  inputParam?: any;
}

export interface StreamEventData {
  event: string;
  name?: string;
  data: any;
  timestamp?: string;
}

// 具体的事件数据类型
export interface AgentEventData {
  agentId: string;
  agentName: string;
  agentOperate?: string;
  messageComType?: string;
  status: 'started' | 'completed';
  agentDesc?: string;
  agentResult?: string;
  chatAgentContent?: string;
  shouldQueryRedis?: string;
  timestamp: string;
}

export interface StreamEndData {
  message: string;
}

export interface ErrorData {
  message: string;
}

// API客户端配置
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

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

/**
 * 发送消息并处理HTTP流式响应（非SSE格式）
 */
export async function sendMessageStream(
  request: SendMessageRequest,
  onData: (data: StreamEventData) => void,
  onComplete: () => void,
  onError: (error: Error) => void
) {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 如果需要认证，添加token
        // 'Authorization': `Bearer ${process.env.API_TOKEN}`,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    //打开可读流
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('无法获取响应流');
    }

    //将字节转换为字符串
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      //done-是否结束、value-字节
      const { done, value } = await reader.read();

      if (done) {
        // 处理剩余的buffer内容
        if (buffer.trim()) {
          try {
            const data = JSON.parse(buffer.trim());
            onData(data);
          } catch (e) {
            console.warn('解析最后的流数据失败:', buffer);
          }
        }
        break;
      }

      buffer += decoder.decode(value, { stream: true });

      // 处理HTTP Stream格式的数据（每行一个JSON对象）
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // 保留最后一行不完整的数据

      for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine) {
          try {
            const data = JSON.parse(trimmedLine);

            // 检查是否是结束事件
            if (data.event === 'stream_end') {
              onData(data);
              onComplete();
              return;
            }

            // 检查是否是错误事件
            if (data.event === 'error') {
              onError(new Error(data.data?.message || '服务器返回错误'));
              return;
            }

            // 正常数据事件
            onData(data);
          } catch (e) {
            console.warn('解析流数据失败:', trimmedLine, e);
          }
        }
      }
    }

    onComplete();
  } catch (error) {
    onError(error as Error);
  }
}

// 📡 发送HTTP请求
async function sendHttpRequest(request: SendMessageRequest): Promise<Response> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

  const response = await fetch(`${API_BASE_URL}/chat/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`请求失败: ${response.status}`);
  }
  return response;
}

/**
 * 普通POST请求（非流式）
 */
export async function sendMessage(request: SendMessageRequest) {
  const response = await fetch(`${API_BASE_URL}/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

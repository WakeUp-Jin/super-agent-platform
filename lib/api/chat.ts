import { SendMessageRequest } from '../interface/chatInterface';

// API客户端配置
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3002';

// 📡 发送HTTP请求
export async function sendHttpRequest(request: SendMessageRequest): Promise<Response> {
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

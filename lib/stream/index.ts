import { SendMessageRequest, StreamEventData } from '../interface/chatInterface';
import { sendHttpRequest } from '../api/chat';
import { DataBuffer } from './DataBuffer';
import { EventHandler } from './EventHandler';

// 🎯 主函数 - 清晰的步骤
export async function sendMessageStreamReadable(
  request: SendMessageRequest,
  onData: (data: StreamEventData) => void,
  onComplete: () => void,
  onError: (error: Error) => void
) {
  try {
    // 步骤1: 发送请求
    const response = await sendHttpRequest(request);

    // 步骤2: 获取读取器
    const reader = response.body?.getReader();
    if (!reader) throw new Error('无法获取流读取器');

    // 步骤3: 初始化处理器
    const buffer = new DataBuffer();
    const handler = new EventHandler(onData, onComplete, onError);

    // 步骤4: 读取并处理数据
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        // 处理剩余数据
        const remaining = buffer.getRemainingData();
        if (remaining) handler.handleLine(remaining);
        break;
      }

      // 处理当前数据块
      buffer.addChunk(value);
      const lines = buffer.getCompleteLines();

      for (const line of lines) {
        const shouldStop = handler.handleLine(line);
        if (shouldStop) return;
      }
    }

    onComplete();
  } catch (error) {
    onError(error as Error);
  }
}

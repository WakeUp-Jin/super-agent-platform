import { StreamEventData } from '../interface/chatInterface';

export class EventHandler {
  constructor(
    private onData: (data: StreamEventData) => void,
    private onComplete: () => void,
    private onError: (error: Error) => void
  ) {}

  handleLine(line: string): boolean {
    // 返回boolean指示是否应该停止
    try {
      const data = JSON.parse(line);

      // 🚨 错误事件处理
      if (data.event === 'error') {
        this.onError(new Error(data.data?.message || '服务器错误'));
        return true; // 停止处理
      }

      this.onData(data); // 📡 正常数据事件

      // ✅ 结束事件处理
      if (data.event === 'stream_end') {
        this.onComplete();
        return true; // 停止处理
      }

      return false; // 继续处理
    } catch (error) {
      console.warn('解析JSON失败:', line);
      return false; // 解析失败不停止，继续处理下一行
    }
  }
}

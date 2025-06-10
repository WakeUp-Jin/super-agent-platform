export class DataBuffer {
  private buffer = ''; // 📦 内部缓冲区
  private decoder = new TextDecoder(); // 🔤 字节解码器

  // 添加新数据块
  addChunk(chunk: Uint8Array) {
    this.buffer += this.decoder.decode(chunk, { stream: true });
  }

  // 获取完整行，保留不完整数据
  getCompleteLines(): string[] {
    const lines = this.buffer.split('\n');
    this.buffer = lines.pop() || ''; // 🎯 关键：保留最后一行
    return lines.filter((line) => line.trim()); // 过滤空行
  }

  getRemainingData(): string {
    return this.buffer.trim();
  }
}

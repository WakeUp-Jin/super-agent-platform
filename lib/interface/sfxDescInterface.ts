export interface SfxDescUpdateRequest {
  userId: string;
  sessionId: string;
  storyBoardScriptId: string;
  index: number;
  type: 'add' | 'delete';
  sfxDesc: string;
  sfxDescPath: string;
  sfxDescAddressPath: string;
  reason?: string;
}

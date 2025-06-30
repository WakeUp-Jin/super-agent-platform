// 音效描述数据结构
export interface SfxMeta {
  id: string;
  sfxAddress: string;
  sfxList: string[];
}

// 故事项数据结构
export interface StoryItem {
  id: number;
  role: string;
  type: 'text' | 'sfx';
  status: 'normal' | 'pending' | 'reviewed';
  originValue: string | string[];
  updateValue: string | string[];
  peopleSelectValue: 'originValue' | 'updateValue' | '';
  sfxMetaId?: string; // 关联的音效描述位置ID-只要type为sfx这个就一定要有
}

export interface SfxTagProps {
  sfx: string;
  onRemove: () => void;
}

export interface TextItemProps {
  content: string;
  sfxMeta?: SfxMeta;
  onRemoveSfx?: (sfx: string) => void;
  highlight?: boolean;
  isShowSfxAddress?: boolean;
}

export interface SfxDescItemProps {
  content: string[];
  sfxMeta?: SfxMeta; // 传入音效描述数据对象
  status?: 'normal' | 'pending' | 'reviewed';
  highlight?: boolean;
  onUpdateSfxDescription?: (id: string, newDescriptions: string[]) => void;
  onDeleteSfxDescription?: (id: string) => void;
  onAddSfxDescription?: (description: string) => void;
}

export interface ReviewCardProps {
  item: StoryItem;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  onRemoveSfx?: (id: number, sfx: string) => void;
  sfxMeta?: SfxMeta; // 用于渲染音效描述
  onUpdateSfxDescription?: (id: string, newDescriptions: string[]) => void;
}

export interface StoryItemComponentProps {
  item: StoryItem;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  onRemoveSfx: (id: number, sfx: string) => void;
  sfxMeta?: SfxMeta; // 传递音效描述数据
  onUpdateSfxDescription?: (id: string, newDescriptions: string[]) => void;
  onDeleteSfxDescription?: (id: string) => void;
  onAddSfxDescription?: (description: string) => void;
}

import { SfxMeta, StoryItem } from '@/lib/interface/viewInterface';

export interface SfxTagProps {
  sfx: string;
  onRemove: () => void;
}

export interface TextItemProps {
  content: string;
  sfxMeta?: SfxMeta;
  role?: string;
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
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onRemoveSfx?: (id: string, sfx: string) => void;
  sfxMeta?: SfxMeta; // 用于渲染音效描述
  onUpdateSfxDescription?: (id: string, newDescriptions: string[]) => void;
}

export interface StoryItemComponentProps {
  item: StoryItem;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onRemoveSfx: (id: string, sfx: string) => void;
  sfxMeta?: SfxMeta; // 传递音效描述数据
  onUpdateSfxDescription?: (id: string, newDescriptions: string[]) => void;
  onDeleteSfxDescription?: (id: string) => void;
  onAddSfxDescription?: (description: string) => void;
}

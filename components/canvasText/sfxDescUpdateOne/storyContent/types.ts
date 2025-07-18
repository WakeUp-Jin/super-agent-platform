import { SfxMeta, StoryItem } from '@/lib/interface/viewInterface';

/**
 * 音效标签组件属性
 */
export interface SfxTagProps {
  /** 音效名称 */
  sfx: string;
  /** 删除音效的回调函数 */
  onRemove: () => void;
}

/**
 * 文本项组件属性
 */
export interface TextItemProps {
  /** 文本内容 */
  content: string;
  /** 音效元数据，可选 */
  sfxMeta?: SfxMeta;
  /** 角色名称，可选 */
  role?: string;
  /** 删除音效的回调函数，可选 */
  onRemoveSfx?: (sfx: string) => void;
  /** 是否高亮显示，默认为false */
  highlight?: boolean;
  /** 是否显示音效地址，可选 */
  isShowSfxAddress?: boolean;
  /** 故事板脚本ID，可选 */
  storyBoardScriptId?: string;
}

/**
 * 音效描述项组件属性
 */
export interface SfxDescItemProps {
  /** 音效描述内容数组 */
  content: string[];
  /** 音效元数据，可选 */
  sfxMeta?: SfxMeta;
  /** 项目状态，可选 */
  status?: 'normal' | 'pending' | 'reviewed';
  /** 是否高亮显示，默认为false */
  highlight?: boolean;
  /** 更新音效描述的回调函数，可选 */
  onUpdateSfxDescription?: (id: string, newDescriptions: string[]) => void;
  /** 删除音效描述的回调函数，可选 */
  onDeleteSfxDescription?: (id: string) => void;
  /** 添加音效描述的回调函数，可选 */
  onAddSfxDescription?: (description: string) => void;
  /** 故事板脚本ID，可选 */
  storyBoardScriptId?: string;
  /** 音效描述路径，可选 */
  sfxDescPath?: string;
}

/**
 * 审核卡片组件属性
 */
export interface ReviewCardProps {
  /** 故事项数据 */
  item: StoryItem;
  /** 同意审核的回调函数 */
  onApprove: (id: string) => void;
  /** 拒绝审核的回调函数 */
  onReject: (id: string) => void;
  /** 删除音效的回调函数，可选 */
  onRemoveSfx?: (id: string, sfx: string) => void;
  /** 音效元数据，用于渲染音效描述，可选 */
  sfxMeta?: SfxMeta;
  /** 更新音效描述的回调函数，可选 */
  onUpdateSfxDescription?: (id: string, newDescriptions: string[]) => void;
}

/**
 * 故事项组件属性
 */
export interface StoryItemComponentProps {
  /** 故事项数据 */
  item: StoryItem;
  /** 同意审核的回调函数 */
  onApprove: (id: string) => void;
  /** 拒绝审核的回调函数 */
  onReject: (id: string) => void;
  /** 删除音效的回调函数 */
  onRemoveSfx: (id: string, sfx: string) => void;
  /** 音效元数据，传递音效描述数据，可选 */
  sfxMeta?: SfxMeta;
  /** 更新音效描述的回调函数，可选 */
  onUpdateSfxDescription?: (id: string, newDescriptions: string[]) => void;
  /** 删除音效描述的回调函数，可选 */
  onDeleteSfxDescription?: (id: string) => void;
  /** 添加音效描述的回调函数，可选 */
  onAddSfxDescription?: (description: string) => void;
}

/**
 * 故事内容状态类型
 */
export interface StoryContentState {
  /** 故事项列表 */
  storyData: StoryItem[];
  /** 音效元数据列表 */
  sfxMeta: SfxMeta[];
}

/**
 * 审核完成检测器配置
 */
export interface ReviewCompletionConfig {
  /** 当前故事数据 */
  currentStoryData: StoryItem[];
  /** 上一次待处理数量 */
  previousPendingCount: number;
  /** 是否首次加载 */
  isFirstLoad: boolean;
}

/**
 * API 配置常量类型
 */
export interface ApiConfigType {
  /** 默认会话ID */
  readonly defaultSessionId: string;
  /** 默认用户ID */
  readonly defaultUserId: string;
  /** 视图类型 */
  readonly viewType: string;
}

/**
 * 容器样式常量类型
 */
export interface ContainerStylesType {
  /** 基础样式 */
  readonly base: string;
  [key: string]: string;
}

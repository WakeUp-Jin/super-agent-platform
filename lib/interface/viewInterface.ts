import { ViewType } from './chatInterface';

//视图请求接口参数
export interface ViewRequestInterface {
  sessionId: string;
  userId: string;
  viewType: ViewType; // 视图步骤
}

//更新画本数据请求接口参数
export interface UpdateViewRequestInterface {
  sessionId: string;
  userId: string;
  path: string | string[];
  sfxAddressPath?: string;
  approved: boolean;
}

//审核完成-更新画本数据请求接口参数
export interface CreateBoardStoryDiffRequestInterface {
  sessionId: string;
  userId: string;
  viewType?: ViewType;
}

//视图画本的结构-第一步
export interface ViewBoardStoryOneInterface {
  title: string;
  //配音演员
  voiceActor: VoiceActorFormat[];

  //人物特征
  personFeature: PersonFeatureFmormat[];

  //人物关系
  personRelation: PersonRelationFormat[];

  //音频制作剧本
  audioScript: {
    storyItems: StoryItem[];
    sfxMetas: SfxMeta[];
  };
}

export interface VoiceActorFormat {
  role: string;
  voiceActor: string;
  voiceId: string;
}

export interface PersonFeatureFmormat {
  name: string;
  age: string;
  gender: string;
  identity: string;
  relationship: string;
}

export interface PersonRelationFormat {
  subject: string;
  relation: string;
  object: string;
  type: string;
}

// 音效描述数据结构
export interface SfxMeta {
  id: string;
  sfxAddress: string;
  sfxList: string[];
  sfxAddressPath?: string;
  storyBoardScriptId?: string; //故事版中的音效id
}

// 故事项数据结构
export interface StoryItem {
  id: string;
  role: string;
  type: 'text' | 'sfx';
  status: 'normal' | 'pending' | 'reviewed';
  originValue: string | string[];
  updateValue: string | string[];
  peopleSelectValue: 'originValue' | 'updateValue' | '';
  sfxMetaId?: string; // 关联的音效描述位置ID-只要type为sfx这个就一定要有
  sfxPath?: string;
  storyBoardScriptId?: string; //故事版中的音效id
}

//========== 视图画本的结构-第二步==========

export interface ViewBoardStoryTwoInfo {
  title?: string;
  storyData?: ViewBoardStoryTwoInterface[];
}

export interface ViewBoardStoryTwoInterface {
  id: string;
  status: 'normal' | 'pending' | 'reviewed';
  originValue: ViewTwoValueItemFormat;
  updateValue: ViewTwoValueItemFormat;
  bgmFilePath?: string[];
  storyBoardBgmId?: string; //故事板中的bgmId

  peopleSelectValue: 'originValue' | 'updateValue' | '';
  items: (ViewTwoTextItemFormat | ViewTwoSfxItemFormat)[];
}

export interface ViewTwoValueItemFormat {
  name: string;
  url: string;
}

// 视图画本的结构-第二步-文本项
export interface ViewTwoTextItemFormat {
  type: 'text';
  status: 'normal' | 'pending' | 'reviewed';
  originValue: ViewTwoValueItemFormat;
  updateValue: ViewTwoValueItemFormat;
  audioFilePath?: string;
  storyBoardAudioScriptId?: string; //故事板中的音频脚本id

  peopleSelectValue: 'originValue' | 'updateValue' | '';
}

export interface ViewTwoSfxItemFormat {
  type: 'sfx';
  title: string[];
  storyBoardAudioScriptId?: string; //故事板中的音频脚本id

  valuesList: ViewTwoSfxValueItemFormat[];
}

export interface ViewTwoSfxValueItemFormat {
  originValue: ViewTwoValueItemFormat;
  updateValue: ViewTwoValueItemFormat;
  storyBoardSfxFileUrlId?: string; //故事板中audio的音频脚本id

  peopleSelectValue: 'originValue' | 'updateValue' | '';
  status: 'normal' | 'pending' | 'reviewed';
  sfxFilePath?: string[];
}

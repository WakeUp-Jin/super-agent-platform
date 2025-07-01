//视图请求接口参数
export interface ViewRequestInterface {
  sessionId: string;
  userId: string;
  viewStep: string; // 视图步骤
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
}

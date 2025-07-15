import { ViewBoardStoryTwoInterface } from '../interface/viewInterface';

export const mockViewBoardStoryTwoData: ViewBoardStoryTwoInterface[] = [
  {
    id: 'story-item-1',
    status: 'reviewed',
    originValue: { name: '原始版本 V1', url: '/audio/origin_1.mp3' },
    updateValue: { name: '更新版本 V1', url: '/audio/update_1.mp3' },
    peopleSelectValue: 'updateValue',
    items: [
      {
        type: 'text',
        status: 'reviewed',
        originValue: { name: '旁白-原始', url: '/audio/text_origin_1.mp3' },
        updateValue: { name: '旁白-更新', url: '/audio/text_update_1.mp3' },
        peopleSelectValue: 'originValue',
      },
      {
        type: 'sfx',
        title: ['场景音效：雨夜'],
        valuesList: [
          {
            originValue: { name: '雷声-原始', url: '/audio/thunder_origin.mp3' },
            updateValue: { name: '雷声-更新', url: '/audio/thunder_update.mp3' },
            peopleSelectValue: 'updateValue',
            status: 'reviewed',
          },
          {
            originValue: { name: '雨声-原始', url: '/audio/rain_origin.mp3' },
            updateValue: { name: '雨声-更新', url: '/audio/rain_update.mp3' },
            peopleSelectValue: '',
            status: 'pending',
          },
        ],
      },
    ],
  },
  {
    id: 'story-item-2',
    status: 'pending',
    originValue: { name: '原始版本 V2', url: '/audio/origin_2.mp3' },
    updateValue: { name: '更新版本 V2', url: '/audio/update_2.mp3' },
    peopleSelectValue: '',
    items: [
      {
        type: 'text',
        status: 'pending',
        originValue: { name: '角色A对话-原始', url: '/audio/charA_origin.mp3' },
        updateValue: { name: '角色A对话-更新', url: '/audio/charA_update.mp3' },
        peopleSelectValue: '',
      },
      {
        type: 'text',
        status: 'normal',
        originValue: { name: '角色B对话-原始', url: '/audio/charB_origin.mp3' },
        updateValue: { name: '角色B对话-更新', url: '/audio/charB_update.mp3' },
        peopleSelectValue: 'originValue',
      },
    ],
  },
];

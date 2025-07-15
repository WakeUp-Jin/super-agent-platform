import {
  ViewTwoSfxValueItemFormat,
  ViewTwoValueItemFormat,
  ViewBoardStoryTwoInterface,
} from '@/lib/interface/viewInterface';

/**
 * 根据状态获取对应的值
 * @param status 状态：'normal' | 'pending' | 'reviewed'
 * @param valueItem 包含 originValue、updateValue、peopleSelectValue 的对象
 * @param preferUpdate 在pending状态下是否优先选择更新版本，默认为true
 * @returns 根据状态选择的值
 */
export function getValueByStatus<T>(
  status: 'normal' | 'pending' | 'reviewed',
  valueItem: {
    originValue: T;
    updateValue: T;
    peopleSelectValue?: 'originValue' | 'updateValue' | '';
  },
  preferUpdate: boolean = true
): T | T[] {
  switch (status) {
    case 'normal':
      return valueItem.originValue;
    case 'pending':
      return preferUpdate ? valueItem.updateValue : [valueItem.originValue, valueItem.updateValue];
    case 'reviewed':
      return valueItem.peopleSelectValue === 'originValue'
        ? valueItem.originValue
        : valueItem.updateValue;
    default:
      return valueItem.originValue;
  }
}

/**
 * 获取所有需要播放的值
 * @param valuesList 音效列表
 * @returns 需要播放的值
 */
export function getPlayValueAllByStatus(valuesList: ViewTwoSfxValueItemFormat[]) {
  let voiceResult: ViewTwoValueItemFormat[] = [];

  valuesList.forEach((value: ViewTwoSfxValueItemFormat) => {
    if (value.status === 'pending') {
      voiceResult.push(value.originValue);
      voiceResult.push(value.updateValue);
    } else if (value.status === 'normal') {
      voiceResult.push(value.originValue);
    } else if (value.status === 'reviewed') {
      voiceResult.push(
        value.peopleSelectValue === 'originValue' ? value.originValue : value.updateValue
      );
    }
  });

  return voiceResult;
}

/**
 * 递归的方案解决嵌套层级的值判断
 * @param currentBoardData
 */
export function allStatusNotPending(currentBoardData: any) {
  //背景BGM
  if (currentBoardData.status === 'pending') return false;

  //如果有子数组的话- 干音
  if (Array.isArray(currentBoardData.items)) {
    return currentBoardData.items.every((item: any) => allStatusNotPending(item));
  }

  //如果还有子数组的话- 音效
  if (Array.isArray(currentBoardData.valuesList)) {
    return currentBoardData.valuesList.every((item: any) => allStatusNotPending(item));
  }

  return true;
}

/**
 * 递归的方案解决嵌套层级的值判断
 * @param currentBoardData
 */
export function allStatusIsNormal(currentBoardData: any) {
  //背景BGM
  if (currentBoardData.status !== 'normal') return false;

  //如果有子数组的话- 干音
  if (Array.isArray(currentBoardData.items)) {
    return currentBoardData.items.every((item: any) => allStatusNotPending(item));
  }

  //如果还有子数组的话- 音效
  if (Array.isArray(currentBoardData.valuesList)) {
    return currentBoardData.valuesList.every((item: any) => allStatusNotPending(item));
  }

  return true;
}

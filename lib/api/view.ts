import {
  CreateBoardStoryDiffRequestInterface,
  UpdateViewRequestInterface,
  ViewRequestInterface,
} from '../interface/viewInterface';

//视图有关的接口
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3002';

//发送获取视图的请求
export async function getView(view: ViewRequestInterface) {
  const response = await fetch(`${API_BASE_URL}/view/get-view-board-story`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(view),
  });
  if (!response.ok) {
    throw new Error(`请求失败: ${response.status}`);
  }
  const data = await response.json();
  return data.data;
}

//更新画本数据
export async function updateView(view: UpdateViewRequestInterface) {
  const response = await fetch(`${API_BASE_URL}/view/update-view-board-story`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(view),
  });
  if (!response.ok) {
    throw new Error(`请求失败: ${response.status}`);
  }
  const data = await response.json();
  return data.data;
}

//审核完成-更新画本数据-/create-board-story-diff
export async function createBoardStoryDiff(view: CreateBoardStoryDiffRequestInterface) {
  const response = await fetch(`${API_BASE_URL}/view/create-board-story-diff`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(view),
  });
  if (!response.ok) {
    throw new Error(`请求失败: ${response.status}`);
  }
  const data = await response.json();
  return data.data;
}

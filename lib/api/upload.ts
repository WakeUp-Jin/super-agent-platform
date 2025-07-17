import { API_BASE_URL } from '@/lib/api/common';

// 文件上传相关API
export interface UploadResponse {
  code: number;
  data: any;
  message: string;
  status: string;
  timestamp: number;
}

// 上传参数接口
export interface UploadParams {
  file: File;
  userId?: string;
  sessionId?: string;
  storyBoardIndex?: number | string;
  storyBoardIndexType?: 'bgm' | 'audioPeople' | 'sfx';
  valueIndex?: number;
  itemIndex?: number;
}

export const Token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjMiLCJpYXQiOjE3NTI1NzA3MDUsImV4cCI6MTc1NTE2MjcwNX0.0P-eikL_bWh7h60XnzgESck9EoHYOYHRBDN9BNlw-m4';

/**
 * 上传音频文件到服务器
 * @param params 上传参数对象
 * @returns Promise<UploadResponse>
 */
export async function uploadAudioFile(params: UploadParams): Promise<UploadResponse> {
  const {
    file,
    userId = '123',
    storyBoardIndex,
    sessionId,
    storyBoardIndexType,
    itemIndex,
    valueIndex,
  } = params;

  try {
    // 验证文件类型
    if (!file.type.startsWith('audio/')) {
      return {
        code: 0,
        data: null,
        message: '请选择音频文件',
        status: 'error',
        timestamp: Date.now(),
      };
    }

    // 验证文件大小 (限制为50MB)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      return {
        code: 0,
        data: null,
        message: '文件大小不能超过50MB',
        status: 'error',
        timestamp: Date.now(),
      };
    }

    // 创建FormData
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'audio');
    formData.append('userId', userId);
    if (sessionId) formData.append('sessionId', sessionId);
    if (storyBoardIndexType) formData.append('storyBoardIndexType', storyBoardIndexType);

    // 添加位置信息
    if (storyBoardIndex !== undefined)
      formData.append('storyBoardIndex', storyBoardIndex.toString());

    //添加itemIndex
    if (itemIndex !== undefined) formData.append('itemIndex', itemIndex.toString());

    //添加valudeIndex
    if (valueIndex !== undefined) formData.append('valueIndex', valueIndex.toString());

    // 发送上传请求
    const response = await fetch(`${API_BASE_URL}/upload/file`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${Token}`,
      },
      body: formData,
    });

    const data = await response.json();
    if (response.status !== 200) {
      return {
        code: 0,
        data: null,
        message: data.message || '上传失败',
        status: 'error',
        timestamp: Date.now(),
      };
    }

    return {
      code: data.code,
      data: data.data,
      message: data.message,
      status: 'success',
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error('Upload error:', error);
    return {
      code: 0,
      data: null,
      message: '网络错误，请重试',
      status: 'error',
      timestamp: Date.now(),
    };
  }
}

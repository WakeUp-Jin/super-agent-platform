import React, { useState, useCallback, useRef } from 'react';
import { uploadAudioFile, type UploadResponse, type UploadParams } from '@/lib/api/upload';

interface UseFileUploadOptions {
  onSuccess?: (url: string) => void;
  onError?: (error: string) => void;
  // 添加可选的上传参数
  uploadParams?: Omit<UploadParams, 'file'>; // 排除file，因为file会在选择时提供
}

interface UseFileUploadReturn {
  isUploading: boolean;
  error: string | null;
  openFileDialog: () => void;
  uploadProgress: number;
}

export function useFileUpload(options: UseFileUploadOptions = {}): UseFileUploadReturn {
  const { onSuccess, onError, uploadParams = {} } = options;
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 创建隐藏的文件输入元素
  const createFileInput = useCallback(() => {
    if (!fileInputRef.current) {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'audio/*';
      input.style.display = 'none';
      input.onchange = handleFileChange;
      document.body.appendChild(input);
      fileInputRef.current = input;
    }
    return fileInputRef.current;
  }, []);

  // 处理文件选择
  const handleFileChange = useCallback(
    async (event: Event) => {
      const input = event.target as HTMLInputElement;
      const file = input.files?.[0];

      if (!file) return;

      setIsUploading(true);
      setError(null);
      setUploadProgress(0);

      try {
        // 模拟上传进度
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => Math.min(prev + 10, 90));
        }, 100);

        const result: UploadResponse = await uploadAudioFile({
          file,
          ...uploadParams,
        });
        console.log('🚀 ~ result:', result);

        clearInterval(progressInterval);
        setUploadProgress(100);

        if (result.code === 1 && result.data.url) {
          onSuccess?.(result.data.url);
          setError(null);
        } else {
          const errorMessage = result.message || '上传失败';
          setError(errorMessage);
          onError?.(errorMessage);
        }
      } catch (err) {
        const errorMessage = '上传过程中发生错误';
        setError(errorMessage);
        onError?.(errorMessage);
      } finally {
        setIsUploading(false);
        // 重置文件输入
        input.value = '';
        setTimeout(() => setUploadProgress(0), 1000);
      }
    },
    [onSuccess, onError, uploadParams]
  );

  // 打开文件选择对话框
  const openFileDialog = useCallback(() => {
    const input = createFileInput();
    input.click();
  }, [createFileInput]);

  // 清理函数
  const cleanup = useCallback(() => {
    if (fileInputRef.current) {
      document.body.removeChild(fileInputRef.current);
      fileInputRef.current = null;
    }
  }, []);

  // 组件卸载时清理
  React.useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    isUploading,
    error,
    openFileDialog,
    uploadProgress,
  };
}

import React from 'react';
import { X } from 'lucide-react';
import { SfxTagProps } from './types';

// 音效标签组件
export const SfxTag = ({ sfx, onRemove }: SfxTagProps) => (
  <span className="mx-1 inline-flex items-center gap-1 rounded-md bg-cyan-200 px-2">
    {sfx}
    <button
      type="button"
      className="cursor-pointer rounded-full transition-colors hover:bg-cyan-300"
      onClick={onRemove}
      aria-label={`删除音效: ${sfx}`}
    >
      {/* <X className="h-4 w-4" /> */}
    </button>
  </span>
);

import React from 'react';
import { Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TextItemProps } from './types';
import { SfxTag } from '../SfxTag';
import { useUiStore } from '@/lib/store/useUiStore';

// TextItem 组件 - 展示文本内容
export const TextItem = ({ content, sfxMeta, onRemoveSfx, highlight, role }: TextItemProps) => {
  const { isShowSfxAddress } = useUiStore();

  const renderContent = () => {
    if (!sfxMeta || !isShowSfxAddress) {
      return <p className={highlight ? 'rounded bg-yellow-100 p-2' : ''}>{content}</p>;
    }

    // 解析音效地址，提取文本和音效
    const parts = sfxMeta.sfxAddress.split(/\(音效:([^)]+)\)/);
    const elements: React.ReactElement[] = [];

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (!part) continue;

      // 检查是否是音效
      const isSfx = sfxMeta.sfxList.includes(part);

      if (isSfx) {
        elements.push(<SfxTag key={`sfx-${i}`} sfx={part} onRemove={() => onRemoveSfx?.(part)} />);
      } else {
        elements.push(<span key={`text-${i}`}>{part}</span>);
      }
    }

    return <p className={highlight ? 'rounded bg-yellow-100 p-2' : ''}>{elements}</p>;
  };

  return (
    <div className="flex w-full gap-2">
      <div className="flex w-1/8 self-stretch text-right font-sans text-base/6">
        <p className="flex h-full w-full items-start justify-end font-medium text-gray-700">
          {role}
        </p>
      </div>
      <div className="flex h-full w-7/8 border-l-2 border-gray-300 pl-3">{renderContent()}</div>
    </div>
  );
};

'use client';
import React, { useMemo, useCallback } from 'react';
import { Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TextItemProps } from './types';
import { SfxTag } from '../SfxTag';
import { useUiStore } from '@/lib/store/useUiStore';

// 常量定义
const CONTAINER_STYLES = {
  base: 'flex w-full gap-2',
  labelArea: 'flex w-1/8 self-stretch text-right font-sans text-base/6',
  label: 'flex h-full w-full items-start justify-end font-medium text-gray-700',
  contentArea: 'flex h-full w-7/8 border-l-2 border-gray-300 pl-3',
} as const;

const TEXT_STYLES = {
  base: '',
  highlighted: 'rounded bg-yellow-100 p-2',
} as const;

// 类型定义
interface ParsedContentProps {
  content: string;
  sfxMeta?: TextItemProps['sfxMeta'];
  highlight?: boolean;
  onRemoveSfx?: (sfx: string) => void;
}

interface SimpleTextProps {
  content: string;
  highlight?: boolean;
}

// 简单文本组件
const SimpleText: React.FC<SimpleTextProps> = ({ content, highlight = false }) => (
  <p className={highlight ? TEXT_STYLES.highlighted : TEXT_STYLES.base}>{content}</p>
);

// 解析音效内容组件
const ParsedContent: React.FC<ParsedContentProps> = ({
  content,
  sfxMeta,
  highlight = false,
  onRemoveSfx,
}) => {
  // 解析并渲染音效地址内容 - 使用 useMemo 优化
  const parsedElements = useMemo(() => {
    if (!sfxMeta?.sfxAddress) {
      return [content];
    }

    const parts = sfxMeta.sfxAddress.split(/\(音效:([^)]+)\)/);
    const elements: React.ReactElement[] = [];

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (!part) continue;

      const isSfx = sfxMeta.sfxList?.includes(part);

      if (isSfx) {
        elements.push(<SfxTag key={`sfx-${i}`} sfx={part} onRemove={() => onRemoveSfx?.(part)} />);
      } else {
        elements.push(<span key={`text-${i}`}>{part}</span>);
      }
    }

    return elements;
  }, [content, sfxMeta, onRemoveSfx]);

  return <p className={highlight ? TEXT_STYLES.highlighted : TEXT_STYLES.base}>{parsedElements}</p>;
};

// 内容渲染器组件
const ContentRenderer: React.FC<ParsedContentProps> = ({
  content,
  sfxMeta,
  highlight = false,
  onRemoveSfx,
}) => {
  const { isShowSfxAddress } = useUiStore();

  // 根据是否显示音效地址决定渲染方式 - 使用 useMemo 优化
  const shouldShowParsedContent = useMemo(() => {
    return sfxMeta && isShowSfxAddress;
  }, [sfxMeta, isShowSfxAddress]);

  if (!shouldShowParsedContent) {
    return <SimpleText content={content} highlight={highlight} />;
  }

  return (
    <ParsedContent
      content={content}
      sfxMeta={sfxMeta}
      highlight={highlight}
      onRemoveSfx={onRemoveSfx}
    />
  );
};

// 主组件
export const TextItem: React.FC<TextItemProps> = ({
  content,
  sfxMeta,
  onRemoveSfx,
  highlight = false,
  role,
  storyBoardScriptId,
}) => {
  // 事件处理函数 - 使用 useCallback 优化
  const handleRemoveSfx = useCallback(
    (sfx: string) => {
      onRemoveSfx?.(sfx);
    },
    [onRemoveSfx]
  );

  return (
    <div className={CONTAINER_STYLES.base}>
      <div className={CONTAINER_STYLES.labelArea}>
        <p className={CONTAINER_STYLES.label}>{role}</p>
      </div>

      <div className={CONTAINER_STYLES.contentArea}>
        <ContentRenderer
          content={content}
          sfxMeta={sfxMeta}
          highlight={highlight}
          onRemoveSfx={handleRemoveSfx}
        />
      </div>
    </div>
  );
};

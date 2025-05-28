'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Pencil, Plus, X, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CustomeTabPopover } from './CustomeTabPopover';

// 类型定义
interface StoryItem {
  index: number;
  role: string;
  sourceIndex: number;
  scene: string;
  text: string;
  emotionBGM: string;
  reasonEmotion: string;
  emotionBGMId: number;
  sfxList?: string[];
  sfxAddress?: string;
  emotionRole?: string;
  rationale?: string;
}

interface SfxTagProps {
  sfx: string;
  onRemove: () => void;
}

// 音效标签组件
const SfxTag = ({ sfx, onRemove }: SfxTagProps) => (
  <span className="mx-1 inline-flex items-center gap-1 rounded-md bg-cyan-200 px-2">
    {sfx}
    <button
      type="button"
      className="cursor-pointer rounded-full transition-colors hover:bg-cyan-300"
      onClick={onRemove}
      aria-label={`删除音效: ${sfx}`}
    >
      <X className="h-4 w-4" />
    </button>
  </span>
);

// 故事项组件
interface StoryItemProps {
  item: StoryItem;
  isShowStoryContent: boolean;
  onRemoveSfx: (sfx: string) => void;
}

const StoryItemComponent = ({ item, onRemoveSfx, isShowStoryContent }: StoryItemProps) => {
  const renderContent = () => {
    if (!item.sfxAddress || !isShowStoryContent) {
      return <p>{item.text}</p>;
    }

    // 解析音效地址，提取文本和音效
    const parts = item.sfxAddress.split(/\(音效:([^)]+)\)/);
    const elements: React.ReactElement[] = [];

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (!part) continue;

      // 检查是否是音效
      const isSfx = item.sfxList?.includes(part);

      if (isSfx) {
        elements.push(<SfxTag key={`sfx-${i}`} sfx={part} onRemove={() => onRemoveSfx(part)} />);
      } else {
        elements.push(<span key={`text-${i}`}>{part}</span>);
      }
    }

    return <p>{elements}</p>;
  };

  return (
    <div className="flex w-full gap-2 rounded transition-colors duration-200 hover:bg-yellow-50">
      <div className="flex w-1/8 self-stretch text-right font-sans text-base/6">
        <p className="flex h-full w-full items-start justify-end font-medium text-gray-700">
          {item.role}
        </p>
      </div>
      <div className="flex w-7/8 self-stretch border-l-2 border-gray-300 pl-3 text-base/6">
        {renderContent()}
      </div>
    </div>
  );
};

interface StoryContentProps {
  isShowStoryContent: boolean;
}

export function StoryContent({ isShowStoryContent }: StoryContentProps) {
  // 使用 useState 管理故事数据
  const [storyData, setStoryData] = useState<StoryItem[]>([
    {
      index: 5,
      // role: '旁白',
      role: '111',
      sourceIndex: 4,
      scene: '酒馆会面恩格斯',
      // text: '角落里的桌子上坐着一个人，蓄着金色胡须的脸庞显得神采奕奕。他正是马克思的老友兼同事，弗里德里希·恩格斯。一看到马克思走进来，恩格斯立刻站起身来，挥手示意他过来。',
      text: '哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈',
      emotionBGM: '希望与振奋',
      reasonEmotion: '马克思与恩格斯在酒馆重逢，友谊与革命信念的碰撞，情绪从疲惫转向激昂',
      emotionBGMId: 2,
      sfxList: ['大风', '大雪'],
      // sfxAddress: '角落里的桌子上坐着一个人(音效:大风)，蓄着金色胡须的脸庞显得神采奕奕(音效:大雪)。他正是马克思的老友兼同事，弗里德里希·恩格斯。一看到马克思走进来，恩格斯立刻站起身来，挥手示意他过来。',
      sfxAddress: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    },
    {
      index: 6,
      // role: '恩格斯',
      role: '222',
      sourceIndex: 5,
      scene: '酒馆会面恩格斯',
      // text: '"卡尔，过来这边！"',
      text: '哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈',
      emotionRole: '中性',
      rationale: '正常招呼语，未体现明显情感倾向',
      emotionBGM: '希望与振奋',
      reasonEmotion: '马克思与恩格斯在酒馆重逢，友谊与革命信念的碰撞，情绪从疲惫转向激昂',
      emotionBGMId: 2,
    },
  ]);

  // 管理标签数据
  const [badges, setBadges] = useState<string[]>([
    '标签1',
    '标签2',
    '标签3',
    '标签4',
    '标签5',
    '标签6',
  ]);

  // 管理弹出层状态
  const [openPopover, setOpenPopover] = useState<number | null>(null);

  // 管理输入框状态
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');

  // 输入框引用
  const inputRef = useRef<HTMLInputElement>(null);

  // 当输入框显示时自动聚焦
  useEffect(() => {
    if (isInputVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isInputVisible]);

  // 处理音效删除
  const handleRemoveSfx = (itemIndex: number, sfx: string) => {
    console.log('🚀 ~ handleRemoveSfx ~ itemIndex:', itemIndex);
    console.log('🚀 ~ handleRemoveSfx ~ sfx:', sfx);
    setStoryData((prev) =>
      prev.map((item, index) =>
        index === itemIndex
          ? {
              ...item,
              sfxList: item.sfxList?.filter((el) => el !== sfx),
              sfxAddress: item.sfxAddress?.replace(`(音效:${sfx})`, ''),
            }
          : item
      )
    );
  };

  // 处理标签删除确认
  const handleConfirmDelete = (badgeIndex: number, reason: string) => {
    console.log(`删除标签 "${badges[badgeIndex]}"，理由：${reason || '无'}`);
    setBadges((prev) => prev.filter((_, index) => index !== badgeIndex));
    setOpenPopover(null);
  };

  // 处理添加按钮点击
  const handleAddClick = () => {
    if (isInputVisible) {
      // 如果输入框可见，隐藏它并清空输入
      setIsInputVisible(false);
      setInputValue('');
    } else {
      // 如果输入框不可见，显示它
      setIsInputVisible(true);
    }
  };

  // 处理输入框回车
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const trimmedValue = inputValue.trim();
      if (trimmedValue) {
        // 添加新标签到badges数组
        setBadges((prev) => [...prev, trimmedValue]);
        // 清空输入并隐藏输入框
        setInputValue('');
        setIsInputVisible(false);
      }
    }
  };

  return (
    <div className="mt-3 flex w-full flex-col gap-5">
      {storyData.map((item, index) => (
        <StoryItemComponent
          key={item.index}
          item={item}
          isShowStoryContent={isShowStoryContent}
          onRemoveSfx={(sfx) => handleRemoveSfx(index, sfx)}
        />
      ))}
      <div className="flex h-8 w-full gap-2">
        <div className="h-full w-1/8">
          <p className="flex h-full w-full items-start justify-end font-medium text-gray-700">
            【qq】
          </p>
        </div>
        <div className="flex h-full w-7/8 border-l-2 border-gray-300 pl-3">
          <div className="flex w-full flex-wrap items-center gap-3">
            {badges.map((badge, index) => (
              <Badge key={index} className="group relative h-7 bg-[#3c6e71] text-sm">
                {badge}
                <CustomeTabPopover
                  open={openPopover === index}
                  onOpenChange={(open) => setOpenPopover(open ? index : null)}
                  onConfirm={(reason) => handleConfirmDelete(index, reason)}
                >
                  <button
                    type="button"
                    className="ml-1 cursor-pointer opacity-100 transition-opacity group-hover:opacity-100"
                    aria-label={`删除标签: ${badge}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </CustomeTabPopover>
              </Badge>
            ))}
            <input
              type="text"
              className="h-7 w-20 rounded-md border-2 border-gray-300"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleInputKeyDown}
              style={{ display: isInputVisible ? 'block' : 'none' }}
              ref={inputRef}
            />
          </div>
          <div className="w-20 flex-none">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 cursor-pointer"
              onClick={handleAddClick}
            >
              {isInputVisible ? <Minus className="" /> : <Plus className="" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

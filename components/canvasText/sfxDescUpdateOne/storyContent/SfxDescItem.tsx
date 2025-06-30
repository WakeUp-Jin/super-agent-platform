import React, { useState, useRef, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SfxDescItemProps } from '../types';
import { CustomeTabPopover } from '../CustomeTabPopover';
import { X, Plus, Minus, SquarePen, PenOff } from 'lucide-react';

// SfxDescItem 组件 - 展示和管理音效描述内容
export const SfxDescItem = ({
  content,
  sfxMeta,
  highlight,
  status,
  onUpdateSfxDescription,
}: SfxDescItemProps) => {
  // 管理弹出层状态
  const [openPopover, setOpenPopover] = useState<string | null>(null);

  // 使用 content 作为显示内容（originValue 或 updateValue）
  const displayContent = Array.isArray(content) ? content : [content];

  // 管理输入框状态
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');

  //根据status判断是否可以编辑
  const canEdit = status !== 'pending';

  // 输入框引用
  const inputRef = useRef<HTMLInputElement>(null);

  // 当输入框显示时自动聚焦
  useEffect(() => {
    if (isInputVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isInputVisible]);

  // 处理标签删除确认
  const handleConfirmDelete = (sfx: string, itemIndex: number, reason: string) => {
    if (!sfxMeta) return;

    console.log(`删除音效描述 "${sfx}"，理由：${reason || '无'}`);

    // 创建新的描述数组，移除指定项
    const newDescriptions = displayContent.filter((_, index) => index !== itemIndex);
    onUpdateSfxDescription?.(sfxMeta.id, newDescriptions);
    setOpenPopover(null);
  };

  // 处理添加按钮点击
  const handleAddClick = () => {
    if (isInputVisible) {
      setIsInputVisible(false);
      setInputValue('');
    } else {
      setIsInputVisible(true);
    }
  };

  // 处理输入框回车
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const trimmedValue = inputValue.trim();
      if (trimmedValue) {
        if (sfxMeta) {
          // 更新现有音效描述
          const newDescriptions = [...displayContent, trimmedValue];
          onUpdateSfxDescription?.(sfxMeta.id, newDescriptions);
        }
        // 添加新音效描述
        setInputValue('');
        setIsInputVisible(false);
      }
    }
  };

  return (
    <div className="flex w-full gap-2">
      <div className="h-full w-1/8">
        <p className="flex h-full w-full items-start justify-end font-medium text-gray-700">
          音效描述
        </p>
      </div>
      <div className="flex h-full w-7/8 border-l-2 border-gray-300 pl-3">
        <div className="flex w-full flex-wrap items-center gap-3">
          {displayContent.map((item, globalIndex) => (
            <Badge
              key={`${item}-${globalIndex}`}
              className={`group relative h-7 bg-[#3c6e71] text-sm ${highlight ? 'bg-yellow-200' : ''}`}
            >
              {item}
              <CustomeTabPopover
                open={openPopover === `${item}-${globalIndex}`}
                onOpenChange={(open) => setOpenPopover(open ? `${item}-${globalIndex}` : null)}
                onConfirm={(reason) => handleConfirmDelete(item, globalIndex, reason)}
              >
                <button
                  type="button"
                  className="ml-1 cursor-pointer opacity-100 transition-opacity group-hover:opacity-100"
                  aria-label={`删除音效描述: ${item}`}
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
            placeholder="添加音效"
          />
        </div>
        <div className="flex-none" style={{ display: canEdit ? 'block' : 'none' }}>
          <Button
            size="icon"
            variant="secondary"
            className="h-8 cursor-pointer"
            onClick={handleAddClick}
          >
            {isInputVisible ? <PenOff className="" /> : <SquarePen className="" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

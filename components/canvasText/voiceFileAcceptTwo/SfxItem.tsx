'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { PencilLine, Play, Check, X } from 'lucide-react';
import { ViewTwoSfxValueItemFormat } from '@/lib/interface/viewInterface';

interface SfxItemProps {
  valueItem: ViewTwoSfxValueItemFormat;
  index: number;
  parentStatus: 'normal' | 'pending' | 'reviewed';
  onApprove?: (itemIndex: number) => void;
  onReject?: (itemIndex: number) => void;
}

export function SfxItem({ valueItem, index, parentStatus, onApprove, onReject }: SfxItemProps) {
  // 统一背景颜色为白色
  const getBackgroundColor = () => {
    return 'bg-white hover:bg-gray-50';
  };

  // 根据选择值确定显示的文本
  const getDisplayText = () => {
    if (valueItem.status === 'normal') {
      // normal状态默认显示originValue
      return valueItem.originValue.name;
    } else if (valueItem.status === 'reviewed') {
      // reviewed状态根据peopleSelectValue决定
      if (valueItem.peopleSelectValue === 'originValue') {
        return valueItem.originValue.name;
      } else if (valueItem.peopleSelectValue === 'updateValue') {
        return valueItem.updateValue.name;
      }
    } else if (valueItem.status === 'pending') {
      // pending状态根据peopleSelectValue决定，默认显示originValue
      if (valueItem.peopleSelectValue === 'updateValue') {
        return valueItem.updateValue.name;
      } else {
        return valueItem.originValue.name;
      }
    }
    return valueItem.originValue.name;
  };

  // 根据选择值确定边框样式
  const getBorderStyle = () => {
    if (valueItem.status === 'normal') {
      // normal状态默认蓝色边框（originValue）
      return 'border-l-2 border-purple-400';
    } else if (valueItem.status === 'reviewed') {
      // reviewed状态根据peopleSelectValue决定
      if (valueItem.peopleSelectValue === 'updateValue') {
        return 'border-l-2 border-purple-400';
      } else {
        return 'border-l-2 border-purple-400';
      }
    } else if (valueItem.status === 'pending') {
      // pending状态根据peopleSelectValue决定
      if (valueItem.peopleSelectValue === 'updateValue') {
        return 'border-l-2 border-purple-400';
      } else {
        return 'border-l-2 border-purple-400';
      }
    }
    return 'border-l-2 border-gray-300';
  };

  // 获取版本标签
  const getVersionLabel = () => {
    if (valueItem.status === 'normal') {
      return '原始版本';
    } else if (valueItem.status === 'reviewed') {
      if (valueItem.peopleSelectValue === 'updateValue') {
        return '更新版本';
      } else {
        return '原始版本';
      }
    } else if (valueItem.status === 'pending') {
      if (valueItem.peopleSelectValue === 'updateValue') {
        return '更新版本';
      } else {
        return '原始版本';
      }
    }
    return '';
  };

  // 处理审核同意
  const handleApprove = () => {
    onApprove?.(index);
  };

  // 处理审核拒绝
  const handleReject = () => {
    onReject?.(index);
  };

  // 渲染播放按钮区域
  const renderPlayButtons = () => {
    if (valueItem.status === 'pending') {
      // pending状态：两个播放按钮（红色和绿色，无文字）
      return (
        <div className="flex items-center gap-1">
          {/* 原始版本播放按钮 */}
          <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:bg-blue-100">
            <Play className="h-3 w-3" />
          </Button>

          {/* 更新版本播放按钮 */}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-green-500 hover:bg-purple-100"
          >
            <Play className="h-3 w-3" />
          </Button>
        </div>
      );
    } else {
      // normal/reviewed状态：普通播放按钮
      return (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
          >
            <Play className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
          >
            <PencilLine className="h-3 w-3" />
          </Button>
        </div>
      );
    }
  };

  // 渲染审核按钮（仅pending状态）
  const renderReviewButtons = () => {
    if (valueItem.status === 'pending') {
      return (
        <div className="flex justify-end gap-2 border-t border-red-200 p-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-4 text-green-600 hover:bg-green-100"
            onClick={handleApprove}
          >
            <Check className="mr-1 h-3 w-3" />
            同意
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-4 text-red-600 hover:bg-red-100"
            onClick={handleReject}
          >
            <X className="mr-1 h-3 w-3" />
            拒绝
          </Button>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`group rounded-lg ${getBackgroundColor()} ${getBorderStyle()}`}>
      {/* 主内容区域 */}
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex items-center gap-2">
          {/* 序号 */}
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-600">
            {index + 1}
          </div>

          {/* 音效内容 */}
          <div className="flex flex-col gap-1">
            <div className="text-sm font-medium">{getDisplayText()}</div>
            <div className="text-xs text-gray-500">{getVersionLabel()}</div>
          </div>

          {/* 状态标识 */}
          {/* {valueItem.status === 'reviewed' && (
            <div className="flex items-center gap-1 text-green-600">
              <Check className="h-3 w-3" />
              <span className="text-xs">已审核</span>
            </div>
          )} */}
        </div>

        {/* 右侧操作按钮 */}
        {renderPlayButtons()}
      </div>

      {/* 底部审核按钮（仅pending状态显示） */}
      {renderReviewButtons()}
    </div>
  );
}

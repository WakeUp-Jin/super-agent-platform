import React from 'react';
import { Check, Minus, Plus, XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ReviewCardProps } from './types';
import { TextItem } from './TextItem';
import { SfxDescItem } from './SfxDescItem';
import { Badge } from '@/components/ui/badge';

// ReviewCard 组件 - 审核对比界面
export const ReviewCard = ({
  item,
  onApprove,
  onReject,
  onRemoveSfx,
  sfxMeta = undefined,
  onUpdateSfxDescription,
}: ReviewCardProps) => {
  const renderItem = (content: string | string[], highlight: boolean = false) => {
    if (item.type === 'text') {
      return (
        <TextItem
          content={content as string}
          role={item.role}
          sfxMeta={sfxMeta}
          onRemoveSfx={(sfx) => onRemoveSfx?.(item.id, sfx)}
          // highlight={highlight}
        />
      );
    } else {
      // 对于音效描述类型，显示关联的音效描述数据
      return (
        <SfxDescItem
          content={content as string[]}
          sfxMeta={sfxMeta}
          status={item.status}
          // highlight={highlight}
          onUpdateSfxDescription={onUpdateSfxDescription}
        />
      );
    }
  };

  return (
    <div className="w-full space-y-2 rounded-lg border bg-gray-50 py-2">
      <div className="bg-red-200">
        {/* <h4 className="mb-2 text-sm font-medium text-gray-600">原始版本</h4> */}
        {/* {renderItem(item.originValue)} */}
        <div className="flex h-full w-full gap-2">
          <div className="min-w-0 flex-1">{renderItem(item.originValue)}</div>
          <div className="flex flex-none items-center">
            <Minus className="h-4 w-4" />
          </div>
        </div>
      </div>
      <div className="bg-green-200">
        {/* <h4 className="mb-2 text-sm font-medium text-gray-600">修改建议</h4> */}
        {/* {renderItem(item.updateValue, true)} */}
        <div className="flex h-full w-full gap-2">
          <div className="min-w-0 flex-1"> {renderItem(item.updateValue, true)}</div>
          <div className="flex flex-none items-center">
            <Plus className="h-4 w-4" />
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Badge
          onClick={() => onApprove(item.id)}
          className="cursor-pointer bg-green-600 hover:bg-green-700"
        >
          <Check className="mr-1 w-4" />
          同意
        </Badge>
        {/* <Button size="sm" variant="outline" onClick={() => onReject(item.id)}>
          <XIcon className="mr-1 h-2 w-4" />
          拒绝修改
        </Button> */}
        <Badge
          className="cursor-pointer hover:bg-red-300"
          variant="outline"
          onClick={() => onReject(item.id)}
        >
          <XIcon className="mr-1 h-2 w-4" />
          拒绝
        </Badge>
      </div>
    </div>
  );
};

import { Button } from '@/components/ui/button';
import { PencilLine, Play } from 'lucide-react';

export function SfxListItemText({ pyValue, bgColor }: { pyValue: string; bgColor: string }) {
  return (
    <div
      id="sfx-item-text"
      key={1}
      className={`group flex items-center justify-between rounded-xl ${bgColor} px-4 ${pyValue} hover:bg-gray-50`}
    >
      <div id="text-left" className="flex items-center gap-2">
        <div className="mr-1 flex h-6 w-6 items-center justify-center rounded-full text-sm font-medium text-gray-500">
          {1}
        </div>
        <div>这是子文字</div>
      </div>
      <div
        id="text-right"
        className="flex items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
      >
        <Button variant="ghost" size="icon">
          <Play></Play>
        </Button>
        <Button variant="ghost" size="icon">
          <PencilLine></PencilLine>
        </Button>
      </div>
    </div>
  );
}

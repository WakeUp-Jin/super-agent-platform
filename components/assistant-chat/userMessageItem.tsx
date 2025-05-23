import { Bold, Copy, Edit, Pencil } from 'lucide-react';
import { Toggle } from '../ui/toggle';
import { Button } from '../ui/button';

export function UserMessageItem() {
  return (
    <div className="flex w-full justify-end">
      <div className="flex flex-col">
        <div className="max-w-sm rounded-lg bg-gray-50 p-4 break-words shadow">
          这里是一段很长很长很长很长很长很长的文字，如果文字超出了最大宽度就会自动换行，没有最大高度限制，能一直往下撑开……
        </div>
        <div className="max-w-sm">
          <Toggle
            aria-label="Toggle italic"
            className="cursor-pointer border-none hover:bg-gray-200"
          >
            <Pencil className="h-4 w-4" />
          </Toggle>
          <Toggle
            aria-label="Toggle italic"
            className="cursor-pointer border-none hover:bg-gray-200"
          >
            <Copy className="h-4 w-4" />
          </Toggle>
        </div>
      </div>
    </div>
  );
}

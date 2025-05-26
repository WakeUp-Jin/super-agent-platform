import { ChevronsDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronsUp } from 'lucide-react';
import { useState } from 'react';
import { SfxListItemText } from './SfxListItemText';
import { Separator } from '@/components/ui/separator';

export function SfxListItemEffect() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex items-center justify-between rounded-xl bg-white px-4 py-1">
      <Collapsible className="flex w-full flex-col" open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex w-full items-center justify-between">
          <div id="sfx-left" className="flex items-center gap-2">
            <div className="mr-1 flex h-6 w-6 items-center justify-center rounded-full text-sm font-medium text-gray-500">
              {1}
            </div>
            <div>这是子点击按钮</div>
          </div>
          <div id="sfx-right">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="icon" className="cursor-pointer">
                {isOpen ? <ChevronsUp /> : <ChevronsDown />}
              </Button>
            </CollapsibleTrigger>
          </div>
        </div>
        <CollapsibleContent className="CollapsibleContent">
          <div className="flex w-full flex-col pt-2">
            <SfxListItemText pyValue="py-1" bgColor="bg-white" />
            <Separator className="my-2" />
            <SfxListItemText pyValue="py-1" bgColor="bg-white" />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

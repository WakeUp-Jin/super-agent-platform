import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@radix-ui/react-collapsible';
import { ChevronsDown, ChevronsUp, PencilLine, Play } from 'lucide-react';
import { SfxListItemText } from './SfxListItemText';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { SfxListItemEffect } from './SfxListItemEffect';

export function VoiceFileAccept() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full">
      <ScrollArea className="h-full w-full">
        <div className="flex flex-col gap-3">
          <div id="titile" className="p-3">
            {/* <p className="text-center text-2xl font-bold">画本音频审听</p> */}
            <p className="text-center text-2xl font-bold">第二步</p>
          </div>

          <div id="content-list-voT" className="flex flex-col gap-4 pr-5">
            {Array.from({ length: 1 }, (_, palindex) => (
              <div
                id="bgm-container"
                className="flex w-full flex-col gap-2 rounded-xl bg-gray-200 p-2"
              >
                <div id="bgm-item" className="flex items-center">
                  <div className="text-lg font-bold">第一部分</div>
                  <div className="flex">
                    <Button variant="ghost" size="icon">
                      <Play className="h-4 w-4"></Play>
                    </Button>
                  </div>
                </div>
                <div id="sfx-list" className="flex flex-col gap-2">
                  {/* 子文字按钮 */}
                  {/* <div
                    id="sfx-item-text"
                    key={1}
                    className="group flex items-center justify-between rounded-xl bg-white px-4 py-3 hover:bg-gray-50"
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
                  </div> */}
                  <SfxListItemText pyValue="py-3" bgColor="bg-white" />
                  {/* 子点击按钮 */}
                  {/* <div className="flex items-center justify-between rounded-xl bg-white px-4 py-1">
                    <Collapsible
                      className="flex w-full flex-col"
                      open={isOpen}
                      onOpenChange={setIsOpen}
                    >
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
                  </div> */}
                  <SfxListItemEffect />
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

import { Button } from '../../ui/button';
import { ScrollArea } from '../../ui/scroll-area';
import { Separator } from '../../ui/separator';
import { PersonFeature } from './PersonFeature';
import PersonRelation from './PersonRelation';
import { VoiceActor } from './VoiceActor';
import { StoryContent } from './storyContent/StoryContent';
import TestWidth from './TestWidth';
import PersonGraph from './TestWidth';
import { PersonRelationTable } from './PersonRelationTable';
import { Eye, EyeClosed, PlusIcon } from 'lucide-react';
import { useUiStore } from '@/lib/store/useUiStore';
import { TooltipContent, TooltipTrigger, Tooltip, TooltipProvider } from '@/components/ui/tooltip';
import { useEffect, useState } from 'react';
import { useViewBoardStore } from '@/lib/store/useViewBoardStore';
import { getView } from '@/lib/api/view';

export function SfxDescUpdate() {
  const { isShowSfxAddress, toggleSfxAddress } = useUiStore();
  const { board, setBoard } = useViewBoardStore();

  // // 首次挂载时拉取数据
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const data = await getView({
  //       userId: '123',
  //       sessionId: '456',
  //       viewStep: '1',
  //     });
  //     console.log(data);
  //     setBoard(data);
  //   };
  //   fetchData();
  // }, [setBoard]);

  //标题
  const [title, setTitle] = useState('');

  useEffect(() => {
    setTitle(board?.title ?? '');
  }, [board]);

  return (
    <div className="w-full">
      <ScrollArea className="h-full w-full">
        <div className="flex items-center justify-center">
          <div className="flex w-full flex-col gap-3">
            {/* 画本标题 */}
            <div id="title">
              <p className="text-2xl font-bold">{title}</p>
            </div>
            <Separator className="my-2" />

            {/* 配音演员列表 */}
            <div id="voice-actor">
              <p className="text-lg font-bold">配音演员列表</p>
              <VoiceActor />
            </div>
            <Separator className="my-2" />

            {/* 人物特征 */}
            <div id="person-feature">
              <p className="text-xl font-bold">人物特征</p>
              <div className="h-ful mt-3 flex">
                <div className="w-full">
                  <PersonFeature />
                </div>
              </div>
            </div>
            <Separator className="my-2" />

            {/* 人物关系 */}
            <div id="person-relation">
              <p className="text-xl font-bold">人物关系</p>
              <div className="w-full">
                {/* <PersonRelation />
                <TestWidth />
                <PersonGraph /> */}
                <PersonRelationTable />
              </div>
            </div>
            <Separator className="my-2" />

            {/* 剧本 */}
            <div id="story-content" className="px-2">
              <div className="flex w-full items-center justify-between pr-3">
                <p className="text-xl font-bold">第一步</p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={toggleSfxAddress}
                        variant="ghost"
                        size="icon"
                        className="cursor-pointer"
                      >
                        {isShowSfxAddress ? <Eye /> : <EyeClosed />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>展示音效描述</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <StoryContent />
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

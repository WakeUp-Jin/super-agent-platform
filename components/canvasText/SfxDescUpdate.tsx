import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { PersonFeature } from './PersonFeature';
import PersonRelation from './PersonRelation';
import { VoiceActor } from './VoiceActor';
import { StoryContent } from './StoryContent';
import TestWidth from './TestWidth';
import PersonGraph from './TestWidth';
import { PersonRelationTable } from './PersonRelationTable';
export function SfxDescUpdate() {
  return (
    <div className="w-full">
      <ScrollArea className="h-full w-full">
        <div className="flex items-center justify-center">
          <div className="flex w-full flex-col gap-3">
            {/* 画本标题 */}
            <div id="title">
              <p className="text-2xl font-bold">画本</p>
            </div>
            <Separator className="my-2" />

            {/* 配音演员列表 */}
            <div id="voice-actor">
              <p className="text-lg font-bold">配音演员列表</p>
              {/* <div className="mt-3 flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  className="cursor-pointer rounded-lg px-3 py-2 text-sm font-normal"
                >
                  马克思-小李
                </Button>
                <Button
                  variant="outline"
                  className="cursor-pointer rounded-lg px-3 py-2 text-sm font-normal"
                >
                  恩格斯-小五
                </Button>
              </div> */}
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
                {/* <PersonRelation /> */}
                {/* <TestWidth /> */}
                {/* <PersonGraph /> */}
                <PersonRelationTable />
              </div>
            </div>
            <Separator className="my-2" />

            {/* 剧本 */}
            <div id="story-content">
              <p className="text-xl font-bold">剧本</p>
              {/* <div className="mt-3 flex w-full flex-col gap-5">
                <div className="flex w-full gap-2">
                  <div className="flex w-1/6 self-stretch text-right font-sans text-base/6 text-wrap">
                    <p className="flex h-full w-full items-start justify-end">弗里德里希·恩格斯</p>
                  </div>
                  <div className="flex w-5/6 self-stretch border-l-2 border-gray-300 pl-2 text-base/6 text-wrap">
                    <p>
                      自带 trigger 参数来控制"用什么组合键才能触发滚轮缩放 自带 trigger
                      参数来控制"用什么组合键才能触发滚轮缩放 自带 trigger
                      参数来控制"用什么组合键才能触发滚轮缩放 自带 trigger
                      参数来控制"用什么组合键才能触发滚轮缩放 自带 trigger
                      参数来控制"用什么组合键才能触发滚轮缩放
                    </p>
                  </div>
                </div>
                <div className="flex w-full gap-2">
                  <div className="flex w-1/6 self-stretch text-right font-sans text-base/6 text-wrap">
                    <p className="flex h-full w-full items-start justify-end">弗里德里希·恩格斯</p>
                  </div>
                  <div className="flex w-5/6 self-stretch border-l-2 border-gray-300 pl-2 text-base/6 text-wrap">
                    <p>
                      自带 trigger 参数来控制"用什么组合键才能触发滚轮缩放 自带 trigger
                      参数来控制"用什么组合键才能触发滚轮缩放 自带 trigger
                      参数来控制"用什么组合键才能触发滚轮缩放 自带 trigger
                      参数来控制"用什么组合键才能触发滚轮缩放 自带 trigger
                      参数来控制"用什么组合键才能触发滚轮缩放
                    </p>
                  </div>
                </div>
              </div> */}
              <StoryContent />
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

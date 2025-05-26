import { Button } from '../../ui/button';
import { ScrollArea } from '../../ui/scroll-area';
import { Separator } from '../../ui/separator';
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
              <StoryContent />
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

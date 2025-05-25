import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { PersonFeature } from './PersonFeature';
import PersonGraph from './personRelation';

export function SfxDescUpdate() {
  return (
    <div className="w-full">
      <ScrollArea className="h-full w-full">
        <div className="flex w-full flex-col gap-3">
          <div id="title">
            <p className="text-2xl font-bold">画本</p>
          </div>
          <Separator className="my-2" />
          <div id="voice-actor">
            <p className="text-lg font-bold">配音演员列表</p>
            <div className="mt-3 flex flex-wrap gap-3">
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
            </div>
          </div>
          <Separator className="my-2" />
          <div id="person-feature">
            <p className="text-xl font-bold">人物特征</p>
            <div className="h-ful mt-3 flex">
              <div className="">
                <PersonFeature />
              </div>
            </div>
          </div>
          <Separator className="my-2" />
          <div id="person-relation">
            <p className="text-xl font-bold">人物关系</p>
            <div className="h-[300px] w-full">
              <PersonGraph />
            </div>
          </div>
          <Separator className="my-2" />
          <div id="story-content">
            <p className="text-xl font-bold">故事内容</p>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

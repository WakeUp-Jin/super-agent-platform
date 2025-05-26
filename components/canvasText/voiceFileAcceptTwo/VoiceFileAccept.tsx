import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Play } from 'lucide-react';

export function VoiceFileAccept() {
  return (
    <div className="w-full">
      <ScrollArea className="h-full w-full">
        <div className="flex flex-col gap-3">
          <div id="titile" className="p-3">
            {/* <p className="text-center text-2xl font-bold">画本音频审听</p> */}
            <p className="text-center text-2xl font-bold">第二步</p>
          </div>

          <div id="content-list-voT" className="flex flex-col gap-4 pr-5">
            {Array.from({ length: 3 }, (_, palindex) => (
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
                <div id="sfx-item" className="flex flex-col gap-2">
                  {Array.from({ length: palindex + 2 }, (_, index) => (
                    <div
                      key={index + 1}
                      className="flex items-center rounded-xl bg-white px-4 py-3"
                    >
                      <div className="mr-1 flex h-6 w-6 items-center justify-center rounded-full text-sm font-medium text-gray-500">
                        {index + 1}
                      </div>
                      <div>这是子文字</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

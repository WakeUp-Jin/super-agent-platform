import { VoiceActorFormat } from '@/lib/interface/viewInterface';
import { Button } from '../../ui/button';
import { useViewBoardStore } from '@/lib/store/useViewBoardStore';
import { useEffect, useState } from 'react';

export function VoiceActor() {
  const { board } = useViewBoardStore();

  const [voiceActor, setVoiceActor] = useState<VoiceActorFormat[]>([]);

  useEffect(() => {
    setVoiceActor(board?.voiceActor ?? []);
  }, [board]);

  return (
    <div className="mt-3 flex flex-wrap gap-3">
      {/* <Button variant="outline" className="cursor-pointer rounded-lg px-3 py-2 text-sm font-normal">
        马克思-小李
      </Button>
      <Button variant="outline" className="cursor-pointer rounded-lg px-3 py-2 text-sm font-normal">
        恩格斯-小五
      </Button> */}
      {voiceActor.map((item) => (
        <Button
          key={item.voiceId}
          variant="outline"
          className="cursor-pointer rounded-lg px-3 py-2 text-sm font-normal"
        >
          {item.role}
        </Button>
      ))}
    </div>
  );
}

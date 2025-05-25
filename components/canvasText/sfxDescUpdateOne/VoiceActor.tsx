import { Button } from '../../ui/button';

export function VoiceActor() {
  return (
    <div className="mt-3 flex flex-wrap gap-3">
      <Button variant="outline" className="cursor-pointer rounded-lg px-3 py-2 text-sm font-normal">
        马克思-小李
      </Button>
      <Button variant="outline" className="cursor-pointer rounded-lg px-3 py-2 text-sm font-normal">
        恩格斯-小五
      </Button>
    </div>
  );
}

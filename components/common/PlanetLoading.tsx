import { useEffect, useState } from 'react';

export default function PlanetLoading() {
  const frames = ['.  ', '.. ', '...', '..', '.', ''];
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % frames.length);
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen items-center justify-center bg-black font-mono text-3xl text-white">
      <span>加载中{frames[frameIndex]}</span>
    </div>
  );
}

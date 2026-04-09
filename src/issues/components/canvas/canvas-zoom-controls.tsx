import Image from 'next/image';

interface CanvasZoomControlsProps {
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

export default function CanvasZoomControls({
  scale,
  onZoomIn,
  onZoomOut,
  onReset,
}: CanvasZoomControlsProps) {
  return (
    <div className="fixed right-[30px] top-20 z-sticky flex flex-col gap-2">
      <button
        onClick={onZoomIn}
        title="확대"
        className="flex h-[50px] w-[50px] items-center justify-center rounded-medium border-none bg-white text-[14px] font-bold text-gray-900 shadow-[0_4px_16px_rgba(0,0,0,0.1)] transition duration-200 hover:scale-105 hover:bg-gray-50 active:scale-95"
      >
        <Image
          src="/add.svg"
          alt="확대"
          width={20}
          height={20}
        />
      </button>
      <button
        onClick={onReset}
        title="초기화"
        className="flex h-[50px] w-[50px] items-center justify-center rounded-medium border-none bg-white text-[14px] font-bold text-gray-900 shadow-[0_4px_16px_rgba(0,0,0,0.1)] transition duration-200 hover:scale-105 hover:bg-gray-50 active:scale-95"
      >
        {Math.round(scale * 100)}%
      </button>
      <button
        onClick={onZoomOut}
        title="축소"
        className="flex h-[50px] w-[50px] items-center justify-center rounded-medium border-none bg-white text-[14px] font-bold text-gray-900 shadow-[0_4px_16px_rgba(0,0,0,0.1)] transition duration-200 hover:scale-105 hover:bg-gray-50 active:scale-95"
      >
        <Image
          src="/minus.svg"
          alt="축소"
          width={20}
          height={20}
        />
      </button>
    </div>
  );
}

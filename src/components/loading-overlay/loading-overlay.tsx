interface LoadingOverlayProps {
  message?: string;
}

export default function LoadingOverlay({ message = '로딩 중...' }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 z-overlay flex flex-col items-center justify-center bg-black/50 backdrop-blur-[4px]">
      <div className="h-[60px] w-[60px] animate-spin rounded-full border-4 border-white/30 border-t-white" />
      <p className="mt-5 text-[18px] font-semibold text-white">{message}</p>
    </div>
  );
}

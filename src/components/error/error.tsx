'use client';

import { useRouter } from 'next/navigation';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

interface ErrorPageProps {
  fullScreen?: boolean;
  title?: string;
  message?: string;
}

const AlertCircleIcon = (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle
      cx="12"
      cy="12"
      r="10"
    />
    <line
      x1="12"
      y1="8"
      x2="12"
      y2="12"
    />
    <line
      x1="12"
      y1="16"
      x2="12.01"
      y2="16"
    />
  </svg>
);

export function ErrorPage({ fullScreen = true, title, message }: ErrorPageProps) {
  const router = useRouter();

  const handleRetry = () => {
    router.refresh();
  };

  const handleGoHome = () => {
    router.push('/');
  };

  const containerVariants = cva(
    'flex items-center justify-center bg-green-50 p-4',
    {
      variants: {
        fullScreen: {
          true: 'fixed inset-0 z-modal h-full w-full',
          false:
            'h-full min-h-full w-full [background-image:linear-gradient(90deg,#f9fafb_1px,transparent_1px),linear-gradient(#f9fafb_1px,transparent_1px)] [background-size:40px_40px] [background-position:0_0]',
        },
      },
    },
  );

  return (
    <div className={cn(containerVariants({ fullScreen }))}>
      <div className="relative">
        <div className="relative w-[380px] bg-green-100 p-8 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)] [clip-path:polygon(0_0,100%_0,100%_calc(100%-20px),calc(100%-20px)_100%,0_100%)]">
          <div className="absolute left-1/2 top-[-0.75rem] h-6 w-20 -translate-x-1/2 rotate-1 bg-green-500 opacity-30" />

          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-600">
              {AlertCircleIcon}
            </div>
          </div>

          <div className="mb-8 text-center">
            <h2 className="mb-3 text-xxl font-bold text-green-700">{title || '앗! 문제가 발생했어요'}</h2>
            <p className="text-medium leading-[1.625] text-green-800">
              {message || '알 수 없는 에러가 발생했습니다.'}
              <br />
              잠시 후 다시 시도해주세요.
            </p>
          </div>

          <div className="flex flex-col items-center gap-3">
            <button
              onClick={handleRetry}
              className="w-full rounded-small bg-green-600 px-4 py-3 text-medium font-medium text-white transition-all hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] active:scale-[0.98]"
            >
              다시 시도
            </button>
            <button
              onClick={handleGoHome}
              className="w-full rounded-small bg-green-200 px-4 py-3 text-medium font-medium text-green-700 transition-all hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] active:scale-[0.98]"
            >
              홈으로 가기
            </button>
          </div>

          <div className="absolute bottom-0 right-0 h-5 w-5 bg-green-300 [clip-path:polygon(100%_0,100%_100%,0_100%)]" />
        </div>

        <div className="absolute inset-0 z-hide translate-y-1 rotate-[0.5deg] bg-green-600 opacity-20 blur" />
      </div>
    </div>
  );
}

'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils/cn';

export function MypageHeaderContainer({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'h-[64px] px-4 bg-white flex items-center justify-center relative border-b border-gray-100',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function BackButtonWrapper({ children, className, ...props }: React.ComponentProps<'button'>) {
  return (
    <button
      className={cn(
        'absolute left-6 top-1/2 -translate-y-1/2 flex items-center justify-center gap-1 bg-transparent border-none cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function BackButtonText({ children, className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span className={cn('text-medium font-bold text-gray-400', className)} {...props}>
      {children}
    </span>
  );
}

export function Title({ children, className, ...props }: React.ComponentProps<'h1'>) {
  return (
    <h1 className={cn('text-center text-xl font-bold text-black m-0', className)} {...props}>
      {children}
    </h1>
  );
}

export default function MypageHeader() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <MypageHeaderContainer>
      <BackButtonWrapper onClick={handleBack}>
        <Image
          src="/leftArrow.svg"
          alt="뒤로가기"
          width={18}
          height={18}
        />
        <BackButtonText>돌아가기</BackButtonText>
      </BackButtonWrapper>
      <Title>내 프로필</Title>
    </MypageHeaderContainer>
  );
}

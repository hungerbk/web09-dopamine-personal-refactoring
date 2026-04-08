'use client';

import { ReactNode } from 'react';
import MypageHeader from '@/mypage/components/mypage-header/mypage-header';
import { cn } from '@/lib/utils/cn';

export function LayoutContainer({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('flex flex-col h-screen bg-gray-50', className)} {...props}>
      {children}
    </div>
  );
}

export function BodyContainer({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('flex flex-1 justify-center items-center overflow-y-auto scrollbar-hide', className)} {...props}>
      {children}
    </div>
  );
}

export default function MypageLayoutClient({ children }: { children: ReactNode }) {
  return (
    <LayoutContainer>
      <MypageHeader />
      <BodyContainer>{children}</BodyContainer>
    </LayoutContainer>
  );
}

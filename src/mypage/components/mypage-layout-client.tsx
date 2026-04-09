'use client';

import { ReactNode } from 'react';
import MypageHeader from '@/mypage/components/mypage-header/mypage-header';

export default function MypageLayoutClient({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen flex-col bg-gray-50">
      <MypageHeader />
      <div className="scrollbar-hide flex flex-1 items-center justify-center overflow-y-auto">{children}</div>
    </div>
  );
}

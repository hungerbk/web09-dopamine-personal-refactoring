'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils/cn';
import type { CardStatus } from '@/issues/types';

interface IdeaCardBadgeProps {
  status?: CardStatus;
  isHotIdea?: boolean;
}

export default function IdeaCardBadge({ status, isHotIdea }: IdeaCardBadgeProps) {
  // 채택 뱃지가 우선
  if (status === 'selected') {
    return (
      <div
        className={cn(
          'absolute left-3 top-[-20px] inline-flex items-center gap-[5px] rounded-large bg-yellow-500 px-4 py-2.5 font-extrabold text-white shadow-[0_6px_18px_rgba(18,18,14,0.18)]',
          status === 'selected' ? 'opacity-100' : 'opacity-0',
        )}
      >
        <Image
          src="/crown.svg"
          alt="채택 아이콘"
          width={20}
          height={20}
        />
        <span>채택</span>
      </div>
    );
  }

  // Hot Idea 뱃지
  if (isHotIdea) {
    return (
      <div className="absolute left-3 top-[-15px] inline-flex animate-pulse items-center gap-1.5 rounded-large bg-gradient-to-br from-yellow-600 to-red-500 px-4 py-2.5 text-[14px] font-bold text-white shadow-[0_6px_18px_rgba(220,38,38,0.4)]">
        <span>🔥</span>
        <span>치열한 토론중</span>
      </div>
    );
  }

  return null;
}

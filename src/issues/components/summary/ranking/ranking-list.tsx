'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';
import type { CategoryRanking, RankedIdeaDto } from '@/issues/types';
import CategorizedListClient from './categorized-list';
import NormalList from './normal-list';

interface RankingListProps {
  normalRankings: RankedIdeaDto[];
  categorizedRankings: CategoryRanking[];
};

const tabButtonVariants = cva(
  'min-h-8 w-[77px] rounded-medium text-small font-bold leading-5',
  {
    variants: {
      selected: {
        true: 'bg-white text-black shadow-[0_1px_2px_0px_#0000000D]',
        false: 'bg-transparent text-gray-400',
      },
    },
  },
);

export default function RankingList({ normalRankings, categorizedRankings }: RankingListProps) {
  const [isCategorized, setIsCategorized] = useState(false);

  return (
    <div className="flex w-full flex-col gap-4 overflow-hidden">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Image
            src="/trophy.svg"
            alt="트로피 아이콘"
            width={20}
            height={20}
          />
          <span className="text-[20px] font-semibold text-black">투표 결과 순위</span>
        </div>
        <div className="flex items-center justify-center rounded-medium bg-gray-200">
          <button
            onClick={() => setIsCategorized(false)}
            className={cn(tabButtonVariants({ selected: !isCategorized }))}
          >
            전체 순위
          </button>
          <button
            onClick={() => setIsCategorized(true)}
            className={cn(tabButtonVariants({ selected: isCategorized }))}
          >
            카테고리별
          </button>
        </div>
      </div>
      <div className="flex flex-col rounded-medium border border-gray-200 bg-white shadow-[0_8px_24px_rgba(0,0,0,0.03)]">
        {isCategorized ? (
          <CategorizedListClient categorizedRankings={categorizedRankings} />
        ) : (
          <NormalList normalRankings={normalRankings} />
        )}
      </div>
    </div>
  );
}

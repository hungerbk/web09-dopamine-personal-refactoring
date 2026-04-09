'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils/cn';
import { VOTE_TYPE } from '@/constants/issue';
import type { RankedIdeaDto } from '@/issues/types';

interface NormalListProps {
  normalRankings: RankedIdeaDto[];
};

export default function NormalList({ normalRankings }: NormalListProps) {
  const [showAll, setShowAll] = useState(false);
  const [dialogContent, setDialogContent] = useState<string | null>(null);
  const [visibleItems, setVisibleItems] = useState<RankedIdeaDto[]>(normalRankings.slice(0, 5));
  const hasMore = normalRankings.length > 5; // 최초 5개 표시

  useEffect(() => {
    if (showAll) {
      setVisibleItems(normalRankings);
    } else {
      setVisibleItems(normalRankings.slice(0, 5));
    }
  }, [normalRankings, showAll]);

  const closeDialog = () => {
    setDialogContent(null);
  };

  return (
    <>
      {visibleItems.map((item, index) => (
        <div
          key={item.id}
          className={cn(
            'flex items-center justify-between gap-3 border-b border-gray-100 px-4 py-3.5 last:border-b-0',
            index === 0 && 'rounded-t-medium',
          )}
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'grid h-8 min-w-8 place-items-center rounded-medium text-medium font-semibold',
                item.rank === 1 ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-400',
              )}
            >
              {item.rank}
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <div
                  title={item.content}
                  role="button"
                  tabIndex={0}
                  onClick={() => setDialogContent(item.content)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setDialogContent(item.content);
                    }
                  }}
                  className="cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap text-medium font-medium leading-5 text-black"
                >
                  {item.content}
                </div>
                {item.isSelected && (
                  <span className="rounded-large border border-yellow-500 bg-yellow-100 px-1.5 py-px text-xs font-semibold leading-none text-yellow-500">
                    채택된 아이디어
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-small font-normal leading-4 text-gray-400">
                <span className="flex-wrap">
                  {item.user?.nickname || item.user?.displayName || item.user?.name || '익명'}
                </span>
                <span className="h-1 w-1 rounded-full bg-gray-300" />
                <span>{item.category?.title || '미분류'}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-1">
            <span className="flex items-center justify-center gap-1 rounded-medium bg-green-50 px-2.5 py-1">
              <span className="text-small text-gray-600">찬성</span>
              <span className="text-medium font-semibold text-green-600">{item.agreeCount}</span>
            </span>
            <span className="flex items-center justify-center gap-1 rounded-medium bg-red-50 px-2.5 py-1">
              <span className="text-small text-gray-600">반대</span>
              <span className="text-medium font-semibold text-red-600">{item.disagreeCount}</span>
            </span>
          </div>
        </div>
      ))}
      <div className="flex justify-center border-t border-gray-100 bg-white py-3">
        {hasMore && (
          <button
            type="button"
            onClick={() => setShowAll((prev) => !prev)}
            className="bg-white px-3 py-2 text-small font-semibold text-gray-500 transition-colors hover:bg-gray-50 hover:text-black"
          >
            {showAll ? '접기' : '더보기'}
          </button>
        )}
      </div>
      {dialogContent && (
        <div
          onClick={closeDialog}
          className="fixed inset-0 z-backdrop grid place-items-center bg-[rgba(0,0,0,0.35)] p-4"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="아이디어 상세"
            onClick={(e) => e.stopPropagation()}
            className="flex w-[min(520px,100%)] max-w-[520px] flex-col overflow-hidden rounded-medium bg-white shadow-[0_16px_40px_rgba(0,0,0,0.16)]"
          >
            <header className="flex items-center justify-between border-b border-gray-100 px-4 py-3.5 font-bold text-black">
              <span>아이디어 상세</span>
              <button
                type="button"
                aria-label="이슈 닫기"
                onClick={closeDialog}
                className="p-1 text-[18px] leading-none text-gray-500 hover:text-black"
              >
                <Image
                  src="/close.svg"
                  alt="이슈 닫기 이미지"
                  width={16}
                  height={16}
                />
              </button>
            </header>
            <div className="whitespace-pre-wrap px-4 py-4 text-medium leading-[1.6] text-gray-600">
              {dialogContent}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

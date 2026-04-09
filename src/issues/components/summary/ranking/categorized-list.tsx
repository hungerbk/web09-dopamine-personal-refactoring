'use client';

import type React from 'react';
import { useMemo, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils/cn';
import { VOTE_TYPE } from '@/constants/issue';
import type { CategoryRanking } from '@/issues/types';

interface CategorizedListProps {
  categorizedRankings: CategoryRanking[];
};

export default function CategorizedList({ categorizedRankings }: CategorizedListProps) {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [dialogContent, setDialogContent] = useState<string | null>(null);

  const columns = useMemo(
    () =>
      categorizedRankings.reduce<[CategoryRanking[], CategoryRanking[]]>(
        (acc, card, index) => {
          acc[index % 2].push(card);
          return acc;
        },
        [[], []],
      ),
    [categorizedRankings],
  );

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const handleShowDetail = (text: string) => {
    setDialogContent(text);
  };

  const handleItemInteraction = (e: React.MouseEvent | React.KeyboardEvent) => {
    // 키보드 체크
    if ('key' in e && e.key !== 'Enter' && e.key !== ' ') return;

    // 데이터 추출
    const content = e.currentTarget.getAttribute('data-content');
    if (content) {
      if ('key' in e) e.preventDefault();
      handleShowDetail(content);
    }
  };

  const handleCloseDialog = () => {
    setDialogContent(null);
  };

  const handleContentsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleToggleCategory = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { id } = e.currentTarget.dataset;
    if (id) toggleCategory(id);
  };

  return (
    <div className="relative flex gap-5 p-4">
      {columns.map((colCards, colIndex) => (
        <div
          key={`col-${colIndex}`}
          className="flex flex-1 flex-col gap-5"
        >
          {colCards.map(({ categoryId, categoryTitle, ideas }) => {
            const isExpanded = expandedCategories[categoryId] ?? false;
            const visibleIdeas = isExpanded ? ideas : ideas.slice(0, 3);
            const hasMore = ideas.length > 3;

            return (
              <section
                key={categoryId}
                id={categoryId}
                title={categoryTitle}
                className="flex flex-col gap-[11px] rounded-medium border-2 border-gray-100 bg-gray-50 p-4"
              >
                <header className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-medium font-bold text-green-600 before:mr-1 before:inline-block before:h-2 before:w-2 before:rounded-full before:bg-green-600 before:content-['']">
                      {categoryTitle}
                    </span>
                  </div>
                </header>
                {visibleIdeas.map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      'flex items-center justify-between gap-3 rounded-medium border p-2',
                      item.isSelected
                        ? 'border-yellow-200 bg-yellow-50'
                        : 'border-gray-100 bg-white',
                    )}
                  >
                    <div className="flex flex-1 items-center gap-3">
                      <div
                        className={cn(
                          'grid h-5 min-w-5 place-items-center rounded-small text-small font-semibold',
                          item.isSelected
                            ? 'bg-yellow-400 text-white'
                            : item.rank === 1
                              ? 'bg-yellow-100 text-yellow-600'
                              : 'bg-gray-100 text-gray-400',
                        )}
                      >
                        {item.rank}
                      </div>
                      <div
                        title={item.content}
                        role="button"
                        tabIndex={0}
                        data-content={item.content}
                        onClick={handleItemInteraction}
                        onKeyDown={handleItemInteraction}
                        className="w-[200px] flex-1 cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap text-medium font-regular text-gray-500"
                      >
                        {item.content}
                      </div>
                    </div>
                    <span className="flex items-center gap-1">
                      <span className="flex flex-col items-center text-green-600">
                        <span className="text-small font-normal text-gray-400">찬성</span>
                        <span className="text-small font-normal">{item.agreeCount}</span>
                      </span>
                      <span className="flex flex-col items-center text-red-600">
                        <span className="text-small font-normal text-gray-400">반대</span>
                        <span className="text-small font-normal">{item.disagreeCount}</span>
                      </span>
                    </span>
                  </div>
                ))}
                {hasMore && (
                  <div className="flex justify-center px-0 pb-1 pt-2.5">
                    <button
                      type="button"
                      data-id={categoryId}
                      onClick={handleToggleCategory}
                      className="text-small font-semibold text-gray-500 transition-colors hover:bg-gray-50 hover:text-black"
                    >
                      {isExpanded ? '접기' : '더보기'}
                    </button>
                  </div>
                )}
              </section>
            );
          })}
        </div>
      ))}
      {dialogContent && (
        <div
          onClick={handleCloseDialog}
          className="fixed inset-0 z-backdrop grid place-items-center bg-[rgba(0,0,0,0.35)] p-4"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="아이디어 상세"
            onClick={handleContentsClick}
            className="flex w-[min(520px,100%)] max-w-[520px] flex-col overflow-hidden rounded-medium bg-white shadow-[0_16px_40px_rgba(0,0,0,0.16)]"
          >
            <header className="flex items-center justify-between border-b border-gray-100 px-4 py-3.5 font-bold text-black">
              <span>아이디어 상세</span>
              <button
                type="button"
                aria-label="닫기"
                onClick={handleCloseDialog}
                className="p-1 text-[18px] leading-none text-gray-500 hover:text-black"
              >
                <Image
                  src="/close.svg"
                  alt="닫기 이미지"
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
    </div>
  );
}

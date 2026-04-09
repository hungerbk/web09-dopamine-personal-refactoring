'use client';

import Image from 'next/image';

interface ConclusionSectionProps {
  badgeText?: string;
  title: string;
  votes: number;
  memo?: string;
  candidates: number;
};

export default function ConclusionSection({
  title,
  votes,
  candidates,
  memo,
}: ConclusionSectionProps) {
  return (
    <div className="flex w-full flex-col items-center gap-[14px] rounded-[14px] border-2 border-[#00a94f] bg-white px-5 pb-4 pt-[18px] shadow-[0_10px_30px_rgba(34,197,94,0.12)]">
      <div className="inline-flex items-center justify-center gap-[17px] rounded-full bg-[#fef3c7] px-3 py-1.5 text-[12px] font-semibold uppercase tracking-[0.02em] text-[#92400e]">
        <Image
          src="/summary-crown.svg"
          alt="채택 아이콘"
          width={14}
          height={14}
        />
        <span>Selected Idea</span>
      </div>
      <h2 className="m-0 text-center text-[30px] font-bold leading-[1.5] text-[#111827]">{title}</h2>
      {memo && <div className="whitespace-pre-line text-[15px] leading-[1.6] text-gray-600">{memo}</div>}
      <div className="flex min-h-20 w-full items-center justify-center gap-4 border-t border-[#f3f4f6] text-center">
        <div className="flex flex-col gap-1">
          <span className="text-[30px] font-bold tracking-[0.01em] text-[#00a94f]">{votes}</span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6b7280]">Votes</span>
        </div>
        <div className="h-10 w-px bg-[#e5e7eb]" />
        <div className="flex flex-col gap-1">
          <span className="text-[30px] font-bold tracking-[0.01em] text-[#1f2937]">{candidates}</span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6b7280]">Candidates</span>
        </div>
      </div>
    </div>
  );
}

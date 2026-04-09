'use client';

import Image from 'next/image';
import { useModalStore } from '@/components/modal/use-modal-store';
import CreateIssueModal from '../create-issue-modal/create-issue-modal';
import { IssueNodeSkeleton } from '../issue-node/issue-node';

const skeletonOffsets = [
  { x: -300, y: -200, top: 35, left: 40 },
  { x: 120, y: -200, top: 35, left: 60 },
  { x: -160, y: 100, top: 65, left: 40 },
  { x: 140, y: 100, top: 65, left: 60 },
];

export default function IssueNodeSkeletonGrid() {
  const { openModal } = useModalStore();

  const handleClick = () => {
    openModal({
      title: '새 이슈 만들기',
      content: <CreateIssueModal />,
      hasCloseButton: true,
    });
  };

  return (
    <div className="relative flex flex-1 w-screen items-center justify-center bg-gray-50">
      <div className="absolute inset-0 z-10">
        {skeletonOffsets.map((offset, index) => (
          <div
            key={`skeleton-${index}`}
            className="absolute opacity-60"
            style={{
              top: `${offset.top}%`,
              left: `${offset.left}%`,
              transform: `translate(${offset.x}px, ${offset.y}px)`,
            }}
          >
            <IssueNodeSkeleton />
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
        <div className="pointer-events-auto">
          <div
            className="w-full max-w-[560px] flex flex-col items-center gap-3.5 rounded-large border border-gray-200 bg-white px-8 py-10 text-center shadow-[0_12px_24px_rgba(0,0,0,0.12)]"
            style={{ width: 'min(560px, 90vw)' }}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-green-100 bg-green-50">
              <Image src="/edit.svg" alt="" width={28} height={28} />
            </div>
            <h2 className="m-0 text-[22px] font-bold text-gray-900">첫 번째 이슈를 등록하고 시작하세요</h2>
            <p className="m-0 text-medium font-medium leading-relaxed text-gray-600">
              지금 바로 토픽의 첫 단추를 끼워보세요.
            </p>
            <button
              type="button"
              onClick={handleClick}
              className="mt-2.5 inline-flex h-12 w-full max-w-[360px] cursor-pointer items-center justify-center gap-2 rounded-medium border-none bg-green-600 text-medium font-bold text-white shadow-[0_10px_18px_rgba(22,163,74,0.25)]"
            >
              <Image src="/white-add.svg" alt="" width={16} height={16} />
              이슈 추가
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

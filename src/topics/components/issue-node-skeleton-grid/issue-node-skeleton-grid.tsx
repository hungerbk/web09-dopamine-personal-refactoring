'use client';

import Image from 'next/image';
import { useModalStore } from '@/components/modal/use-modal-store';
import CreateIssueModal from '../create-issue-modal/create-issue-modal';
import { IssueNodeSkeleton } from '../issue-node/issue-node';
import { cn } from '@/lib/utils/cn';

function SkeletonGridContainer({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('w-screen flex-1 flex items-center justify-center bg-gray-50 relative', className)} {...props}>
      {children}
    </div>
  );
}

function SkeletonGrid({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('absolute inset-0 z-10', className)} {...props}>
      {children}
    </div>
  );
}

function SkeletonItem({
  children,
  className,
  x,
  y,
  top,
  left,
  ...props
}: React.ComponentProps<'div'> & { x: number; y: number; top: number; left: number }) {
  return (
    <div
      className={cn('absolute opacity-60', className)}
      style={{
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(${x}px, ${y}px)`,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

function EmptyOverlay({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('absolute inset-0 flex items-center justify-center z-20 pointer-events-none', className)} {...props}>
      {children}
    </div>
  );
}

function EmptyCard({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('w-full max-w-[560px] py-10 px-8 bg-white border border-gray-200 rounded-large shadow-[0_12px_24px_rgba(0,0,0,0.12)] flex flex-col items-center gap-3.5 text-center', className)} {...props} style={{ width: 'min(560px, 90vw)' }}>
      {children}
    </div>
  );
}

function EmptyIcon({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('w-16 h-16 rounded-full bg-green-50 border border-green-100 flex items-center justify-center', className)} {...props}>
      {children}
    </div>
  );
}

function EmptyTitle({ children, className, ...props }: React.ComponentProps<'h2'>) {
  return (
    <h2 className={cn('m-0 text-[22px] font-bold text-gray-900', className)} {...props}>
      {children}
    </h2>
  );
}

function EmptyDescription({ children, className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p className={cn('m-0 text-medium font-medium text-gray-600 leading-relaxed', className)} {...props}>
      {children}
    </p>
  );
}

function EmptyButton({ children, className, ...props }: React.ComponentProps<'button'>) {
  return (
    <button className={cn('mt-2.5 w-full max-w-[360px] h-12 rounded-medium border-none bg-green-600 text-white text-medium font-bold inline-flex items-center justify-center gap-2 cursor-pointer shadow-[0_10px_18px_rgba(22,163,74,0.25)]', className)} {...props}>
      {children}
    </button>
  );
}

function EmptyContent({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('pointer-events-auto', className)} {...props}>
      {children}
    </div>
  );
}

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
    <SkeletonGridContainer>
      <SkeletonGrid>
        {skeletonOffsets.map((offset, index) => (
          <SkeletonItem
            key={`skeleton-${index}`}
            x={offset.x}
            y={offset.y}
            top={offset.top}
            left={offset.left}
          >
            <IssueNodeSkeleton />
          </SkeletonItem>
        ))}
      </SkeletonGrid>
      <EmptyOverlay>
        <EmptyContent>
          <EmptyCard>
            <EmptyIcon>
              <Image src="/edit.svg" alt="" width={28} height={28} />
            </EmptyIcon>
            <EmptyTitle>첫 번째 이슈를 등록하고 시작하세요</EmptyTitle>
            <EmptyDescription>
              지금 바로 토픽의 첫 단추를 끼워보세요.
            </EmptyDescription>
            <EmptyButton type="button" onClick={handleClick}>
              <Image src="/white-add.svg" alt="" width={16} height={16} />
              이슈 추가
            </EmptyButton>
          </EmptyCard>
        </EmptyContent>
      </EmptyOverlay>
    </SkeletonGridContainer>
  );
}

'use client';

import Image from 'next/image';
import { useModalStore } from '@/components/modal/use-modal-store';
import TopicModal from '../topic-modal/topic-modal';
import { cn } from '@/lib/utils/cn';

function EmptyStateContainer({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('flex flex-col items-center gap-4 rounded-large bg-transparent border-none text-center', className)} {...props}>
      {children}
    </div>
  );
}

function AddButton({ children, className, ...props }: React.ComponentProps<'button'>) {
  return (
    <button
      className={cn(
        'w-[72px] h-[72px] rounded-full border border-gray-200 bg-white flex items-center justify-center shadow-[0_8px_20px_rgba(0,0,0,0.08)] cursor-pointer transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-lg',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

function Title({ children, className, ...props }: React.ComponentProps<'h2'>) {
  return (
    <h2 className={cn('m-0 text-large font-bold text-gray-900', className)} {...props}>
      {children}
    </h2>
  );
}

function Description({ children, className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p className={cn('m-0 text-medium font-medium text-gray-600 max-w-[520px] leading-relaxed', className)} {...props}>
      {children}
    </p>
  );
}

export default function EmptyTopicState() {
  const { openModal } = useModalStore();

  const handleClick = () => {
    openModal({
      title: '새 토픽 만들기',
      content: <TopicModal />,
      hasCloseButton: true,
    });
  };

  return (
    <EmptyStateContainer>
      <AddButton type="button" onClick={handleClick} aria-label="첫 토픽 만들기">
        <Image src="/add.svg" alt="" width={28} height={28} />
      </AddButton>
      <Title>첫 번째 토픽을 추가해보세요</Title>
      <Description>
        프로젝트의 핵심 주제를 만들어 팀원들과 논의를 시작하세요.
      </Description>
    </EmptyStateContainer>
  );
}

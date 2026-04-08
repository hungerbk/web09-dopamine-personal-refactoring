'use client';

import Image from 'next/image';
import { useModalStore } from '@/components/modal/use-modal-store';
import TopicModal from '../topic-modal/topic-modal';

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
    <div className="flex flex-col items-center gap-4 border-none bg-transparent text-center">
      <button
        type="button"
        onClick={handleClick}
        aria-label="첫 토픽 만들기"
        className="flex h-[72px] w-[72px] cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white shadow-[0_8px_20px_rgba(0,0,0,0.08)] transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-lg"
      >
        <Image src="/add.svg" alt="" width={28} height={28} />
      </button>
      <h2 className="m-0 text-large font-bold text-gray-900">첫 번째 토픽을 추가해보세요</h2>
      <p className="m-0 max-w-[520px] text-medium font-medium leading-relaxed text-gray-600">
        프로젝트의 핵심 주제를 만들어 팀원들과 논의를 시작하세요.
      </p>
    </div>
  );
}

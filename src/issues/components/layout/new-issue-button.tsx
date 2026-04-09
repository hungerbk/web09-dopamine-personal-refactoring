'use client';

import Image from 'next/image';
import { useModalStore } from '@/components/modal/use-modal-store';
import CreateIssueModal from '@/topics/components/create-issue-modal/create-issue-modal';

export default function NewIssueButton() {
  const { openModal } = useModalStore();

  const handleClick = () => {
    // 토픽 페이지와 이슈 페이지 모두 CreateIssueModal 열기
    openModal({
      title: '새 이슈 만들기',
      content: <CreateIssueModal />,
      hasCloseButton: true,
    });
  };

  return (
    <button
      onClick={handleClick}
      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-none bg-green-600 shadow-[0_4px_4px_-1px_rgba(0,0,0,0.2)]"
    >
      <Image
        src="/white-add.svg"
        alt="플러스 아이콘"
        width={18}
        height={18}
      />
    </button>
  );
}

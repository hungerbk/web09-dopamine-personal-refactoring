'use client';

import Image from 'next/image';
import { useModalStore } from '@/components/modal/use-modal-store';
import EditTopicModal, { EditTopicProps } from '../edit-topic-modal/edit-topic-modal';

export default function EditTopicButton({ topicId, currentTitle }: EditTopicProps) {
  const { openModal } = useModalStore();

  const handleEditClick = () => {
    openModal({
      title: '토픽 수정',
      content: (
        <EditTopicModal
          topicId={topicId}
          currentTitle={currentTitle}
        />
      ),
      closeOnOverlayClick: true,
      hasCloseButton: true,
    });
  };

  return (
    <button
      onClick={handleEditClick}
      aria-label="Edit"
      className="flex flex-col items-center opacity-70 hover:opacity-50"
    >
      <Image
        src="/edit.svg"
        alt="Edit"
        width={14}
        height={14}
      />
    </button>
  );
}

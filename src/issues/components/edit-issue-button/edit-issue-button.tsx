'use client';

import Image from 'next/image';
import { useModalStore } from '@/components/modal/use-modal-store';
import EditIssueModal, { EditIssueProps } from '../edit-issue-modal/edit-issue-modal';

export default function EditIssueButton({ issueId, currentTitle }: EditIssueProps) {
  const { openModal } = useModalStore();

  const handleEditClick = () => {
    openModal({
      title: '이슈 수정',
      content: (
        <EditIssueModal
          issueId={issueId}
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
      role="button"
      tabIndex={0}
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

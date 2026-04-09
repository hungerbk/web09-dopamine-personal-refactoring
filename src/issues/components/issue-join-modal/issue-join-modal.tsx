'use client';

import { useEffect, useRef } from 'react';
import { useModalStore } from '@/components/modal/use-modal-store';
import { useIssueJoinModal } from './use-issue-join-modal';
import { FormInput, FormInputTitle, FormInputWrapper } from '@/components/modal/modal-form';

interface IssueJoinModalProps {
  issueId: string;
}

export default function IssueJoinModal({ issueId }: IssueJoinModalProps) {
  const { nickname, isLoading, setNickname, handleJoin, isOpen } = useIssueJoinModal({ issueId });
  const handleJoinRef = useRef(handleJoin);

  handleJoinRef.current = handleJoin;

  useEffect(() => {
    if (isOpen) {
      useModalStore.setState({
        onSubmit: async () => {
          await handleJoinRef.current();
        },
      });
    }
  }, [isOpen]);

  return (
    <div className="flex flex-col gap-5 min-w-[400px]">
      <div className="flex flex-col gap-4">
        <FormInputWrapper>
          <FormInputTitle>표시될 닉네임</FormInputTitle>
          <FormInput
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="예) 생각하는 단무지"
            disabled={isLoading}
            autoFocus
          />
        </FormInputWrapper>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useRef } from 'react';
import { useModalStore } from '@/components/modal/use-modal-store';
import { useIssueJoinModal } from './use-issue-join-modal';

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
    <div className="flex min-w-[400px] flex-col gap-5">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-medium font-semibold text-gray-900">표시될 닉네임</label>
          <div className="relative w-full">
            <input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="예) 생각하는 단무지"
              disabled={isLoading}
              autoFocus
              className="w-full rounded-medium border border-gray-200 bg-white px-4 py-3 pr-11 text-medium text-gray-900 placeholder:text-gray-400 disabled:cursor-not-allowed disabled:bg-gray-50 focus:border-green-600 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

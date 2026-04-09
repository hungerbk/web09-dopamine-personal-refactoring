'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils/cn';
import { useModalStore } from '@/components/modal/use-modal-store';
import { MAX_ISSUE_TITLE_LENGTH } from '@/constants/issue';
import { useCreateIssueInTopicMutation, useTopicId } from '@/hooks';

export default function CreateIssueModal() {
  const [issueTitle, setIssueTitle] = useState('');
  const issueTitleRef = useRef(issueTitle);
  const setIsPending = useModalStore((state) => state.setIsPending);
  const isOpen = useModalStore((state) => state.isOpen);
  const closeModal = useModalStore((state) => state.closeModal);
  const { mutate, isPending } = useCreateIssueInTopicMutation();

  // issueTitle의 최신 값을 ref에 동기화
  useEffect(() => {
    issueTitleRef.current = issueTitle;
  }, [issueTitle]);

  useEffect(() => {
    setIsPending(isPending);
  }, [isPending, setIsPending]);

  // 토픽 ID 가져오기 (토픽 페이지면 URL에서, 이슈 페이지면 이슈 데이터에서)
  const { topicId } = useTopicId();

  const handleCreate = useCallback(async () => {
    const currentIssueTitle = issueTitleRef.current;

    if (!topicId) {
      toast.error('토픽 정보를 찾을 수 없습니다.');
      return;
    }

    if (!currentIssueTitle.trim()) {
      toast.error('이슈 제목을 입력해주세요.');
      return;
    }

    mutate(
      { topicId, title: currentIssueTitle },
      {
        onSuccess: () => {
          closeModal();
        },
      },
    );
  }, [topicId, mutate, closeModal]);

  useEffect(() => {
    if (isOpen) {
      useModalStore.setState({
        onSubmit: handleCreate,
      });
    }
  }, [isOpen, handleCreate]);

  const onChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIssueTitle(e.target.value);
  };

  return (
    <div className="flex min-w-[400px] flex-col gap-5">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-medium font-semibold text-gray-900">이슈 제목</label>
          <div className="relative w-full">
            <input
              value={issueTitle}
              onChange={onChangeTitle}
              placeholder="제목을 입력하세요"
              autoFocus
              disabled={isPending}
              maxLength={MAX_ISSUE_TITLE_LENGTH}
              className="w-full rounded-medium border border-gray-200 bg-white px-4 py-3 pr-11 text-medium text-gray-900 placeholder:text-gray-400 disabled:cursor-not-allowed disabled:bg-gray-50 focus:border-green-600 focus:outline-none"
            />
            <span
              className={cn(
                'pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-small font-semibold',
                issueTitle.length > MAX_ISSUE_TITLE_LENGTH ? 'text-red-500' : 'text-gray-600',
              )}
            >
              {issueTitle.length}/{MAX_ISSUE_TITLE_LENGTH}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

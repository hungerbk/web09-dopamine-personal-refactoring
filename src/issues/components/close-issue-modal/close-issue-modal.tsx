'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useModalStore } from '@/components/modal/use-modal-store';
import { useCloseIssueModal } from './use-close-issue-modal';

interface CloseIssueModalProps {
  issueId: string;
  isOwner?: boolean;
}

export default function CloseIssueModal({ issueId, isOwner = false }: CloseIssueModalProps) {
  const { memo, setMemo, selectedIdea, isLoading, closeAndGoSummary } = useCloseIssueModal({
    issueId,
    isOwner,
  });
  const { setIsPending } = useModalStore();
  const closeAndGoSummaryRef = useRef<(() => Promise<void>) | undefined>(undefined);

  useEffect(() => {
    setIsPending(isLoading);
  }, [isLoading, setIsPending]);

  useEffect(() => {
    closeAndGoSummaryRef.current = closeAndGoSummary;
  }, [closeAndGoSummary]);

  const handleSubmit = useCallback(async () => {
    await closeAndGoSummaryRef.current?.();
  }, []);

  useEffect(() => {
    useModalStore.setState({
      onSubmit: handleSubmit,
      submitButtonText: '이슈 종료',
    });
  }, [handleSubmit]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 rounded-medium border border-gray-100 bg-gray-50 p-3.5">
        <span className="text-small font-semibold text-gray-500">선택된 아이디어</span>
        {selectedIdea ? (
          <>
            <div className="whitespace-pre-wrap font-semibold text-gray-900">
              {selectedIdea.content || '내용 없음'}
            </div>
            <span className="text-small text-gray-500">작성자: {selectedIdea.author}</span>
          </>
        ) : (
          <div className="text-small text-gray-500">선택된 아이디어가 없습니다.</div>
        )}
      </div>

      <div>
        <label
          htmlFor="close-issue-memo"
          className="text-small font-semibold text-gray-600"
        >
          메모 (선택)
        </label>
        <div className="flex items-center rounded-medium border border-gray-200 py-2">
          <textarea
            id="close-issue-memo"
            value={memo}
            onChange={(event) => setMemo(event.target.value)}
            placeholder="메모를 입력해주세요."
            disabled={!isOwner}
            className="h-full min-h-[120px] w-full resize-none border-none px-3 py-1 text-medium text-gray-900 outline-none"
          />
        </div>
      </div>
    </div>
  );
}

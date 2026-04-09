'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import {
  FormCharCount,
  FormInput,
  FormInputRow,
  FormInputTitle,
  FormInputWrapper,
} from '@/components/modal/modal-form';
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

  useEffect(() => {
    issueTitleRef.current = issueTitle;
  }, [issueTitle]);

  useEffect(() => {
    setIsPending(isPending);
  }, [isPending, setIsPending]);

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

  return (
    <div className="flex flex-col gap-5 min-w-[400px]">
      <div className="flex flex-col gap-4">
        <FormInputWrapper>
          <FormInputTitle>이슈 제목</FormInputTitle>
          <FormInputRow>
            <FormInput
              className="pr-11"
              value={issueTitle}
              onChange={(e) => setIssueTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              autoFocus
              disabled={isPending}
              maxLength={MAX_ISSUE_TITLE_LENGTH}
            />
            <FormCharCount isOverLimit={issueTitle.length > MAX_ISSUE_TITLE_LENGTH}>
              {issueTitle.length}/{MAX_ISSUE_TITLE_LENGTH}
            </FormCharCount>
          </FormInputRow>
        </FormInputWrapper>
      </div>
    </div>
  );
}

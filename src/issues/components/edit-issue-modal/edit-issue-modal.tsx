'use client';

import React, { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useModalStore } from '@/components/modal/use-modal-store';
import { MAX_ISSUE_TITLE_LENGTH } from '@/constants/issue';
import { useDeleteIssueMutation, useUpdateIssueTitleMutation } from '@/hooks';
import { useSseConnectionStore } from '../../store/use-sse-connection-store';
import {
  FormCharCount,
  FormInput,
  FormInputRow,
  FormInputTitle,
  FormInputWrapper,
} from '@/components/modal/modal-form';

export interface EditIssueProps {
  issueId: string;
  currentTitle?: string;
}

export default function EditIssueModal({ issueId, currentTitle }: EditIssueProps) {
  const [title, setTitle] = useState(currentTitle || '');
  const { setIsPending, isOpen, closeModal } = useModalStore();
  const { mutate: updateIssue, isPending: isUpdatePending } = useUpdateIssueTitleMutation(issueId);
  const { mutate: deleteIssue, isPending: isDeletePending } = useDeleteIssueMutation(issueId);
  const connectionId = useSseConnectionStore((state) => state.connectionIds[issueId]);

  const isPending = isUpdatePending || isDeletePending;

  useEffect(() => {
    setIsPending(isPending);

    return () => {
      setIsPending(false);
    };
  }, [isPending, setIsPending]);

  const handleUpdate = useCallback(async () => {
    if (!title.trim()) {
      toast.error('이슈 제목을 입력해주세요.');
      return;
    }
    if (title.length > MAX_ISSUE_TITLE_LENGTH) {
      toast.error(`이슈 제목은 ${MAX_ISSUE_TITLE_LENGTH}자 이내로 입력해주세요.`);
      return;
    }

    updateIssue(
      { title, connectionId },
      {
        onSuccess: () => {
          closeModal();
        },
      },
    );
  }, [title, updateIssue]);

  const handleDelete = useCallback(async () => {
    if (
      !confirm(
        '이슈를 삭제하시겠습니까? 이슈를 삭제하면 이슈에 속한 모든 카테고리, 아이디어, 멤버의 데이터가 삭제됩니다.',
      )
    ) {
      return;
    }
    deleteIssue(
      { connectionId },
      {
        onSuccess: () => {
          closeModal();
        },
      },
    );
  }, [deleteIssue]);

  useEffect(() => {
    if (isOpen) {
      useModalStore.setState({
        onSubmit: handleUpdate,
      });
    }
  }, [isOpen, handleUpdate]);

  const onChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.slice(0, MAX_ISSUE_TITLE_LENGTH);
    setTitle(value);
  };

  return (
    <div className="flex flex-col gap-5 min-w-[400px]">
      <div className="flex flex-col gap-4">
        <FormInputWrapper>
          <FormInputTitle>이슈 제목</FormInputTitle>
          <FormInputRow>
            <FormInput
              className="pr-11"
              value={title}
              onChange={onChangeTitle}
              placeholder={`제목을 입력하세요 (${MAX_ISSUE_TITLE_LENGTH}자 이내)`}
              maxLength={MAX_ISSUE_TITLE_LENGTH}
              autoFocus
              disabled={isPending}
            />
            <FormCharCount isOverLimit={title.length > MAX_ISSUE_TITLE_LENGTH}>
              {title.length}/{MAX_ISSUE_TITLE_LENGTH}
            </FormCharCount>
          </FormInputRow>
        </FormInputWrapper>
        <button
          onClick={handleDelete}
          className="inline-flex w-[60px] flex-col items-center text-red-500 hover:opacity-70"
        >
          삭제하기
        </button>
      </div>
    </div>
  );
}

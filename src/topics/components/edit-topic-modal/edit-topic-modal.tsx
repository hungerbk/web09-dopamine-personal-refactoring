'use client';

import React, { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useModalStore } from '@/components/modal/use-modal-store';
import { MAX_TOPIC_TITLE_LENGTH } from '@/constants/topic';
import { useDeleteTopicMutation, useUpdateTopicTitleMutation } from '@/hooks';
import {
  FormCharCount,
  FormInput,
  FormInputRow,
  FormInputTitle,
  FormInputWrapper,
} from '@/components/modal/modal-form';

export interface EditTopicProps {
  topicId: string;
  currentTitle?: string;
}

export default function EditTopicModal({ topicId, currentTitle }: EditTopicProps) {
  const [title, setTitle] = useState(currentTitle || '');
  const { setIsPending, isOpen, closeModal } = useModalStore();
  const { mutate: updateIssue, isPending: isUpdatePending } = useUpdateTopicTitleMutation(topicId);
  const { mutate: deleteTopic, isPending: isDeletePending } = useDeleteTopicMutation(topicId);

  const isPending = isUpdatePending || isDeletePending;

  useEffect(() => {
    setIsPending(isPending);

    return () => {
      setIsPending(false);
    };
  }, [isPending, setIsPending]);

  const handleUpdate = useCallback(async () => {
    if (!title.trim()) {
      toast.error('토픽 제목을 입력해주세요.');
      return;
    }

    if (title.length > MAX_TOPIC_TITLE_LENGTH) {
      toast.error(`토픽 제목은 ${MAX_TOPIC_TITLE_LENGTH}자 이내로 입력해주세요.`);
      return;
    }

    updateIssue(
      { title },
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
        '토픽을 삭제하시겠습니까? 토픽을 삭제하면 토픽에 속한 모든 이슈, 카테고리, 아이디어, 멤버의 데이터가 삭제됩니다.',
      )
    ) {
      return;
    }
    deleteTopic(undefined, {
      onSuccess: () => {
        closeModal();
      },
    });
  }, [deleteTopic]);

  useEffect(() => {
    if (isOpen) {
      useModalStore.setState({
        onSubmit: handleUpdate,
      });
    }
  }, [isOpen, handleUpdate]);

  const onChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.slice(0, MAX_TOPIC_TITLE_LENGTH);
    setTitle(value);
  };

  return (
    <div className="flex flex-col gap-5 min-w-[400px]">
      <div className="flex flex-col gap-4">
        <FormInputWrapper>
          <FormInputTitle>토픽 제목</FormInputTitle>
          <FormInputRow>
            <FormInput
              className="pr-11"
              value={title}
              onChange={onChangeTitle}
              placeholder={`제목을 입력하세요. (${MAX_TOPIC_TITLE_LENGTH}자 이내)`}
              maxLength={MAX_TOPIC_TITLE_LENGTH}
              autoFocus
              disabled={isPending}
            />
            <FormCharCount isOverLimit={title.length > MAX_TOPIC_TITLE_LENGTH}>
              {title.length}/{MAX_TOPIC_TITLE_LENGTH}
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

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { useModalStore } from '@/components/modal/use-modal-store';
import { MAX_TOPIC_TITLE_LENGTH } from '@/constants/topic';
import { useCreateTopicMutation } from '@/hooks/topics';
import {
  FormCharCount,
  FormInput,
  FormInputRow,
  FormInputTitle,
  FormInputWrapper,
} from '@/components/modal/modal-form';

interface TopicModalProps {
  projectId?: string;
}

export default function TopicModal({ projectId }: TopicModalProps) {
  const params = useParams<{ projectId?: string }>();
  const setIsPending = useModalStore((state) => state.setIsPending);
  const isOpen = useModalStore((state) => state.isOpen);
  const closeModal = useModalStore((state) => state.closeModal);
  const [topicName, setTopicName] = useState('');
  const topicNameRef = useRef(topicName);
  const { mutate, isPending } = useCreateTopicMutation();

  useEffect(() => {
    topicNameRef.current = topicName;
  }, [topicName]);

  const resolvedProjectId = projectId ?? params.projectId;

  useEffect(() => {
    setIsPending(isPending);
  }, [isPending, setIsPending]);

  const handleSubmit = useCallback(async () => {
    const currentTopicName = topicNameRef.current;

    if (!currentTopicName.trim()) {
      toast.error('토픽 제목을 입력해주세요.');
      return;
    }

    if (currentTopicName.length > MAX_TOPIC_TITLE_LENGTH) {
      toast.error(`토픽 제목은 ${MAX_TOPIC_TITLE_LENGTH}자 이내로 입력해주세요.`);
      return;
    }

    if (!resolvedProjectId) {
      toast.error('프로젝트 ID를 찾을 수 없습니다.');
      return;
    }

    mutate(
      { title: currentTopicName, projectId: resolvedProjectId },
      {
        onSuccess: () => {
          toast.success('토픽이 생성되었습니다!');
          closeModal();
        },
      },
    );
  }, [resolvedProjectId, mutate, closeModal]);

  const onChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.slice(0, MAX_TOPIC_TITLE_LENGTH);
    setTopicName(value);
  };

  useEffect(() => {
    if (isOpen) {
      useModalStore.setState({
        onSubmit: handleSubmit,
      });
    }
  }, [isOpen, handleSubmit]);

  return (
    <div className="flex flex-col gap-5 min-w-[400px]">
      <div className="flex flex-col gap-4">
        <FormInputWrapper>
          <FormInputTitle>토픽 제목</FormInputTitle>
          <FormInputRow>
            <FormInput
              className="pr-11"
              value={topicName}
              onChange={onChangeTitle}
              placeholder={`제목을 입력하세요. (${MAX_TOPIC_TITLE_LENGTH}자 이내)`}
              maxLength={MAX_TOPIC_TITLE_LENGTH}
              autoFocus
              disabled={isPending}
            />
            <FormCharCount isOverLimit={topicName.length > MAX_TOPIC_TITLE_LENGTH}>
              {topicName.length}/{MAX_TOPIC_TITLE_LENGTH}
            </FormCharCount>
          </FormInputRow>
        </FormInputWrapper>
      </div>
    </div>
  );
}

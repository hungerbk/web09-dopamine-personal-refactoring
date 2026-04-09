'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { useModalStore } from '@/components/modal/use-modal-store';
import { MAX_TOPIC_TITLE_LENGTH } from '@/constants/topic';
import { useCreateTopicMutation } from '@/hooks/topics';
import { cn } from '@/lib/utils/cn';

function Container({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('flex flex-col gap-5 min-w-[400px]', className)} {...props}>
      {children}
    </div>
  );
}

function InfoContainer({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('flex flex-col gap-4', className)} {...props}>
      {children}
    </div>
  );
}

function InputWrapper({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('flex flex-col gap-2', className)} {...props}>
      {children}
    </div>
  );
}

function InputTitle({ children, className, ...props }: React.ComponentProps<'label'>) {
  return (
    <label className={cn('text-medium font-semibold text-gray-900', className)} {...props}>
      {children}
    </label>
  );
}

function Input({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('relative flex items-center', className)} {...props}>
      {children}
    </div>
  );
}

function InputField({ className, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      className={cn(
        'w-full py-3 px-4 pr-16 border border-gray-200 rounded-medium text-medium text-gray-900 bg-white outline-none transition-colors duration-200 focus:border-green-600 disabled:bg-gray-50 disabled:cursor-not-allowed placeholder:text-gray-400',
        className
      )}
      {...props}
    />
  );
}

function CharCount({ children, className, isOverLimit, ...props }: React.ComponentProps<'span'> & { isOverLimit?: boolean }) {
  return (
    <span
      className={cn(
        'absolute right-4 text-small',
        isOverLimit ? 'text-red-500' : 'text-gray-400',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

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

  // topicName의 최신 값을 ref에 동기화
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
    <Container>
      <InfoContainer>
        <InputWrapper>
          <InputTitle>토픽 제목</InputTitle>
          <Input>
            <InputField
              value={topicName}
              onChange={onChangeTitle}
              placeholder={`제목을 입력하세요. (${MAX_TOPIC_TITLE_LENGTH}자 이내)`}
              maxLength={MAX_TOPIC_TITLE_LENGTH}
              autoFocus
              disabled={isPending}
            />
            <CharCount isOverLimit={topicName.length > MAX_TOPIC_TITLE_LENGTH}>
              {topicName.length}/{MAX_TOPIC_TITLE_LENGTH}
            </CharCount>
          </Input>
        </InputWrapper>
      </InfoContainer>
    </Container>
  );
}

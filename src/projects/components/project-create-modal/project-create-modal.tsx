'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useModalStore } from '@/components/modal/use-modal-store';
import { useCreateProjectMutation } from '@/hooks/projects';
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

function InputContent({ className, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      className={cn(
        'w-full p-3 border border-gray-300 rounded-small text-medium text-gray-900 outline-none transition-colors duration-200 focus:border-gray-500 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed',
        className
      )}
      {...props}
    />
  );
}

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      className={cn(
        'w-full py-3 px-2 border border-gray-300 rounded-small text-medium text-gray-900 resize-none outline-none transition-colors duration-200 focus:outline-none focus:border-gray-500',
        className
      )}
      {...props}
    />
  );
}

export default function ProjectCreateModal() {
  const router = useRouter();
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const { setIsPending, isOpen, closeModal } = useModalStore();
  const { mutate, isPending } = useCreateProjectMutation();

  useEffect(() => {
    setIsPending(isPending);
  }, [isPending, setIsPending]);

  const handleSubmit = useCallback(async () => {
    if (!projectName.trim()) {
      toast.error('프로젝트 이름을 입력해주세요.');
      return;
    }

    mutate(
      { title: projectName, description: description || undefined },
      {
        onSuccess: () => {
          toast.success('프로젝트가 생성되었습니다!');
          closeModal();
          router.refresh();
        },
      },
    );
  }, [projectName, description, mutate, router]);

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
          <InputTitle>프로젝트 이름</InputTitle>
          <InputContent
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="이름을 입력하세요"
            autoFocus
            disabled={isPending}
          />
        </InputWrapper>
        <InputWrapper>
          <InputTitle>설명 (선택)</InputTitle>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="프로젝트에 대한 간단한 설명을 입력하세요"
            disabled={isPending}
            rows={3}
          />
        </InputWrapper>
      </InfoContainer>
    </Container>
  );
}

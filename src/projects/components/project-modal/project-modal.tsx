'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import LoadingOverlay from '@/components/loading-overlay/loading-overlay';
import { useModalStore } from '@/components/modal/use-modal-store';
import { MAX_DESCRIPTION_LENGTH, MAX_TITLE_LENGTH } from '@/constants/project';
import { useUpdateProjectMutation } from '@/hooks/projects';
import { isProjectTitleTooLong } from '@/lib/utils/project-title';
import { cn } from '@/lib/utils/cn';

function Container({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('flex flex-col gap-[30px]', className)} {...props}>
      {children}
    </div>
  );
}

function InfoContainer({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('flex flex-col gap-[10px]', className)} {...props}>
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

function InputRow({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('relative', className)} {...props}>
      {children}
    </div>
  );
}

function Input({ className, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      className={cn(
        'w-full border border-gray-300 rounded-medium text-medium text-gray-900 box-border bg-white',
        'focus:outline-none focus:border-green-600',
        'disabled:bg-gray-50 disabled:cursor-not-allowed',
        'placeholder:text-gray-400',
        'py-3 pr-11 pl-2',
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
        'w-full border border-gray-300 rounded-medium text-medium text-gray-900 box-border',
        'focus:outline-none focus:border-green-600',
        'py-3 pr-11 pl-2',
        className
      )}
      {...props}
    />
  );
}

function InputDescription({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('text-medium text-red-500', className)} {...props}>
      {children}
    </div>
  );
}

function CharCount({ children, className, isOverLimit, ...props }: React.ComponentProps<'span'> & { isOverLimit?: boolean }) {
  return (
    <span
      className={cn(
        'absolute right-2.5 top-1/2 -translate-y-1/2 text-small font-semibold pointer-events-none',
        isOverLimit ? 'text-red-500' : 'text-gray-600',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

interface ProjectModalProps {
  projectId: string;
  currentTitle?: string;
  currentDescription?: string;
}

export default function ProjectModal({
  projectId,
  currentTitle,
  currentDescription,
}: ProjectModalProps) {
  const router = useRouter();
  const { setIsPending, isOpen, closeModal } = useModalStore();
  const [title, setTitle] = useState(currentTitle || '');
  const [description, setDescription] = useState(currentDescription || '');
  const { mutate: updateProject, isPending: isUpdating } = useUpdateProjectMutation();

  useEffect(() => {
    setIsPending(isUpdating);
  }, [isUpdating, setIsPending]);

  const handleSubmit = useCallback(async () => {
    const nextTitle = title.trim() || currentTitle?.trim() || '';
    const nextDescription = description.trim() || currentDescription?.trim();

    if (!nextTitle) {
      toast.error('프로젝트 제목을 입력해주세요.');
      return;
    }

    if (isProjectTitleTooLong(nextTitle)) {
      toast.error(`프로젝트 제목은 ${MAX_TITLE_LENGTH}자 이하로 입력해주세요.`);
      return;
    }

    updateProject(
      {
        id: projectId,
        title: nextTitle,
        description: nextDescription || undefined,
      },
      {
        onSuccess: () => {
          closeModal();
          router.refresh();
        },
      },
    );
  }, [
    title,
    description,
    currentTitle,
    currentDescription,
    projectId,
    updateProject,
    closeModal,
    router,
  ]);

  useEffect(() => {
    if (isOpen) {
      useModalStore.setState({
        onSubmit: handleSubmit,
      });
    }
  }, [isOpen, handleSubmit]);

  const titleLength = title?.length || 0;
  const isTitleOverLimit = titleLength > MAX_TITLE_LENGTH;
  const isTitleLessLimit = titleLength < 1;
  const descriptionLength = description?.length || 0;
  const isDescriptionOverLimit = descriptionLength > MAX_DESCRIPTION_LENGTH;

  return (
    <>
      <Container>
        <InfoContainer>
          <InputWrapper>
            <InputTitle>프로젝트 제목</InputTitle>
            <InputRow>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={currentTitle ?? '프로젝트 제목을 입력해주세요.'}
              />
              <CharCount isOverLimit={isTitleOverLimit}>
                {titleLength}/{MAX_TITLE_LENGTH}
              </CharCount>
            </InputRow>
            {(isTitleOverLimit || isTitleLessLimit) && (
              <InputDescription>
                * 프로젝트 제목은 1~{MAX_TITLE_LENGTH}자 이내로 입력해주세요.
              </InputDescription>
            )}
          </InputWrapper>
          <InputWrapper>
            <InputTitle>프로젝트 설명</InputTitle>
            <InputRow>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={currentDescription ?? '프로젝트 설명을 입력해주세요.'}
              />
              <CharCount isOverLimit={isDescriptionOverLimit}>
                {descriptionLength}/{MAX_DESCRIPTION_LENGTH}
              </CharCount>
            </InputRow>
            {isDescriptionOverLimit && (
              <InputDescription>
                * 프로젝트 설명은 {MAX_DESCRIPTION_LENGTH}자 이내로 입력해주세요.
              </InputDescription>
            )}
          </InputWrapper>
        </InfoContainer>
      </Container>
      {isUpdating && <LoadingOverlay message="변경사항을 저장중입니다." />}
    </>
  );
}

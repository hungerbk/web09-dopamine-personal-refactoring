'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import LoadingOverlay from '@/components/loading-overlay/loading-overlay';
import { useModalStore } from '@/components/modal/use-modal-store';
import { MAX_DESCRIPTION_LENGTH, MAX_TITLE_LENGTH } from '@/constants/project';
import { useUpdateProjectMutation } from '@/hooks/projects';
import { isProjectTitleTooLong } from '@/lib/utils/project-title';
import {
  FormCharCount,
  FormInput,
  FormInputRow,
  FormInputTitle,
  FormInputWrapper,
  FormTextarea,
} from '@/components/modal/modal-form';

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
  }, [title, description, currentTitle, currentDescription, projectId, updateProject, closeModal, router]);

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
      <div className="flex flex-col gap-[30px]">
        <div className="flex flex-col gap-[10px]">
          <FormInputWrapper>
            <FormInputTitle>프로젝트 제목</FormInputTitle>
            <FormInputRow>
              <FormInput
                className="pr-11"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={currentTitle ?? '프로젝트 제목을 입력해주세요.'}
              />
              <FormCharCount isOverLimit={isTitleOverLimit}>
                {titleLength}/{MAX_TITLE_LENGTH}
              </FormCharCount>
            </FormInputRow>
            {(isTitleOverLimit || isTitleLessLimit) && (
              <p className="text-medium text-red-500">
                * 프로젝트 제목은 1~{MAX_TITLE_LENGTH}자 이내로 입력해주세요.
              </p>
            )}
          </FormInputWrapper>
          <FormInputWrapper>
            <FormInputTitle>프로젝트 설명</FormInputTitle>
            <FormInputRow>
              <FormTextarea
                className="pr-11"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={currentDescription ?? '프로젝트 설명을 입력해주세요.'}
              />
              <FormCharCount isOverLimit={isDescriptionOverLimit} className="top-4 translate-y-0">
                {descriptionLength}/{MAX_DESCRIPTION_LENGTH}
              </FormCharCount>
            </FormInputRow>
            {isDescriptionOverLimit && (
              <p className="text-medium text-red-500">
                * 프로젝트 설명은 {MAX_DESCRIPTION_LENGTH}자 이내로 입력해주세요.
              </p>
            )}
          </FormInputWrapper>
        </div>
      </div>
      {isUpdating && <LoadingOverlay message="변경사항을 저장중입니다." />}
    </>
  );
}

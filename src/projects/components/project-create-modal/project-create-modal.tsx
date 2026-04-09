'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useModalStore } from '@/components/modal/use-modal-store';
import { useCreateProjectMutation } from '@/hooks/projects';
import {
  FormInput,
  FormInputTitle,
  FormInputWrapper,
  FormTextarea,
} from '@/components/modal/modal-form';

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
    <div className="flex flex-col gap-5 min-w-[400px]">
      <div className="flex flex-col gap-4">
        <FormInputWrapper>
          <FormInputTitle>프로젝트 이름</FormInputTitle>
          <FormInput
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="이름을 입력하세요"
            autoFocus
            disabled={isPending}
          />
        </FormInputWrapper>
        <FormInputWrapper>
          <FormInputTitle>설명 (선택)</FormInputTitle>
          <FormTextarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="프로젝트에 대한 간단한 설명을 입력하세요"
            disabled={isPending}
            rows={3}
          />
        </FormInputWrapper>
      </div>
    </div>
  );
}

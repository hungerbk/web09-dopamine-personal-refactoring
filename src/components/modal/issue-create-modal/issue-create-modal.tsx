'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { MAX_ISSUE_TITLE_LENGTH } from '@/constants/issue';
import { useQuickStartMutation } from '@/hooks/issues';
import { generateRandomNickname } from '@/lib/utils/nickname';
import { useModalStore } from '../use-modal-store';
import {
  FormCharCount,
  FormInput,
  FormInputRow,
  FormInputTitle,
  FormInputWrapper,
} from '@/components/modal/modal-form';

export default function CreateIssueModal() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [ownerNickname, setOwnerNickname] = useState(generateRandomNickname());
  const { setIsPending, isOpen, closeModal } = useModalStore();

  const { mutate, isPending } = useQuickStartMutation();

  useEffect(() => {
    setIsPending(isPending);
  }, [isPending, setIsPending]);

  const handleQuickStart = useCallback(async () => {
    if (!title.trim() || !ownerNickname.trim()) {
      toast.error('이슈 제목과 닉네임을 입력해주세요.');
      return;
    }
    if (title.length > MAX_ISSUE_TITLE_LENGTH) {
      toast.error(`이슈 제목은 ${MAX_ISSUE_TITLE_LENGTH}자 이내로 입력해주세요.`);
      return;
    }

    mutate(
      { title, nickname: ownerNickname },
      {
        onSuccess: (newIssue) => {
          closeModal();
          router.push(`/issues/${newIssue.issueId}`);
        },
      },
    );
  }, [title, ownerNickname, mutate, closeModal, router]);

  useEffect(() => {
    if (isOpen) {
      useModalStore.setState({
        onSubmit: handleQuickStart,
      });
    }
  }, [isOpen, handleQuickStart]);

  return (
    <div className="flex flex-col gap-[30px]">
      <div className="flex flex-col gap-2.5">
        <FormInputWrapper>
          <FormInputTitle>이슈 제목</FormInputTitle>
          <FormInputRow>
            <FormInput
              className="pr-11"
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, MAX_ISSUE_TITLE_LENGTH))}
              placeholder={`예시) 서비스 홍보 방안 (${MAX_ISSUE_TITLE_LENGTH}자 이내)`}
              maxLength={MAX_ISSUE_TITLE_LENGTH}
            />
            <FormCharCount isOverLimit={title.length > MAX_ISSUE_TITLE_LENGTH}>
              {title.length}/{MAX_ISSUE_TITLE_LENGTH}
            </FormCharCount>
          </FormInputRow>
        </FormInputWrapper>
        <FormInputWrapper>
          <FormInputTitle>표시될 닉네임</FormInputTitle>
          <FormInput
            value={ownerNickname}
            onChange={(e) => setOwnerNickname(e.target.value)}
            placeholder="예시) 생각하는 단무지"
          />
        </FormInputWrapper>
      </div>
    </div>
  );
}

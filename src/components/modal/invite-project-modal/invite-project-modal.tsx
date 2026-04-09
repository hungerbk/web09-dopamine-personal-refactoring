'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { useModalStore } from '@/components/modal/use-modal-store';
import { useInvitationMutations } from '@/hooks/invitation';
import { FormInput, FormInputTitle, FormInputWrapper } from '@/components/modal/modal-form';

interface InviteModalProps {
  id: string;
  title: string;
}

export default function InviteProjectModal({ id, title }: InviteModalProps) {
  const { data: session } = useSession();
  const { createToken } = useInvitationMutations(id);
  const [tags, setTags] = useState<string[]>([]);
  const [code, setCode] = useState('');
  const [inputValue, setInputValue] = useState('');
  const { setIsPending, isOpen } = useModalStore();
  const handleInviteRef = useRef<(() => Promise<void>) | undefined>(undefined);

  useEffect(() => {
    setIsPending(createToken.isPending);
  }, [createToken.isPending, setIsPending]);

  const resetCode = () => {
    if (code) setCode('');
  };

  const addTag = (email: string) => {
    const trimmedEmail = email.trim();
    if (trimmedEmail === '') return;

    if (tags.includes(trimmedEmail)) {
      toast.error('이미 포함된 이메일입니다.');
      return;
    }

    if (tags.length >= 10) {
      toast.error('한번에 10개까지 추가할 수 있습니다.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      toast.error('올바른 이메일 형식이 아닙니다.');
      return;
    }

    if (session?.user.email === trimmedEmail) {
      toast.error('현재 로그인 중인 계정입니다.');
      return;
    }

    setTags([...tags, trimmedEmail]);
    setInputValue('');
    resetCode();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(inputValue);
    }
  };

  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
    resetCode();
  };

  const handleResetTag = () => {
    setTags([]);
    resetCode();
  };

  const handleCopy = useCallback(async (code: string) => {
    const fullUrl = `${window.location.origin}/invite?code=${code}`;
    try {
      await navigator.clipboard.writeText(fullUrl);
      toast.success('초대 링크를 복사했습니다!');
    } catch (err) {
      console.error('복사 실패:', err);
      toast.error('초대 링크를 클립보드에 복사할 수 없습니다.');
    }
  }, []);

  const handleInvite = useCallback(async () => {
    if (inputValue.trim()) {
      toast.error('입력 중인 이메일이 있습니다.');
      return;
    }

    if (tags.length === 0) {
      toast.error('이메일을 입력해주세요!');
      return;
    }

    createToken.mutate(tags, {
      onSuccess: (data) => {
        const { token } = data;
        setCode(token);
        handleCopy(token);
      },
    });
  }, [inputValue, tags, createToken, handleCopy]);

  useEffect(() => {
    handleInviteRef.current = handleInvite;
  }, [handleInvite]);

  useEffect(() => {
    if (isOpen) {
      useModalStore.setState({
        onSubmit: code
          ? undefined
          : async () => {
              await handleInviteRef.current?.();
            },
        submitButtonText: '초대 링크 생성',
      });
    }
  }, [isOpen, code]);

  return (
    <div className="flex flex-col gap-[30px]">
      <div className="flex flex-col gap-2.5">
        <FormInputWrapper>
          <FormInputTitle>프로젝트 이름</FormInputTitle>
          <span className="text-large font-bold text-gray-900">{title}</span>
        </FormInputWrapper>

        <FormInputWrapper>
          <div className="text-medium font-semibold flex flex-row flex-nowrap justify-between">
            <span>초대 이메일 ({tags.length}/10)</span>
            {tags.length > 0 && (
              <button
                type="button"
                onClick={handleResetTag}
                className="border-none bg-transparent cursor-pointer hover:text-red-500 font-semibold"
              >
                초기화
              </button>
            )}
          </div>
          <FormInput
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="초대할 이메일을 입력하고 Enter를 눌러주세요."
            autoComplete="off"
          />
        </FormInputWrapper>

        {tags.length > 0 && (
          <ul className="flex flex-row flex-wrap gap-2 m-0 p-0">
            {tags.map((tag, i) => (
              <li
                key={tag}
                className="flex flex-row flex-nowrap items-center justify-center gap-1 py-1.5 px-3 text-gray-700 rounded-large bg-gray-100 border border-gray-200 leading-none list-none"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(i)}
                  className="w-2.5 h-3 flex justify-center items-center leading-[2] text-large font-[200] text-gray-500 hover:text-red-600 bg-transparent border-none cursor-pointer"
                >
                  &times;
                </button>
              </li>
            ))}
          </ul>
        )}

        {code && (
          <>
            <div className="h-[1px] bg-gray-200 my-[5px]" />
            <div className="flex flex-row items-center justify-between gap-3 py-4 px-5 rounded-medium bg-green-50 border border-green-200 mt-2">
              <div className="flex items-center gap-2 text-medium font-semibold text-green-700 flex-1">
                ✓ 초대 링크가 생성되었습니다
              </div>
              <button
                type="button"
                onClick={() => handleCopy(code)}
                className="py-2.5 px-4 rounded-medium bg-green-600 text-white text-medium font-semibold border-none cursor-pointer transition-colors duration-200 whitespace-nowrap hover:bg-green-700 active:bg-green-800 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                링크 다시 복사하기
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

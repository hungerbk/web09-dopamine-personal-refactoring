'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { useModalStore } from '@/components/modal/use-modal-store';
import { useInvitationMutations } from '@/hooks/invitation';
import { cn } from '@/lib/utils/cn';
import { InputTitle, InputWrapper } from '@/components/modal/issue-create-modal/issue-create-modal';

export function InfoContainer({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('flex flex-col gap-2.5', className)} {...props}>
      {children}
    </div>
  );
}

export function EmailInputTitle({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('text-medium font-semibold flex flex-row flex-nowrap justify-between', className)} {...props}>
      {children}
    </div>
  );
}

export function Title({ children, className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span className={cn('text-large font-bold text-gray-900', className)} {...props}>
      {children}
    </span>
  );
}

export function TagList({ children, className, ...props }: React.ComponentProps<'ul'>) {
  return (
    <ul className={cn('flex flex-row flex-wrap gap-2 m-0 p-0', className)} {...props}>
      {children}
    </ul>
  );
}

export function TagListItem({ children, className, ...props }: React.ComponentProps<'li'>) {
  return (
    <li
      className={cn(
        'flex flex-row flex-nowrap items-center justify-center gap-1 py-1.5 px-3 text-gray-700 rounded-large bg-gray-100 border border-gray-200 leading-none list-none',
        '[&>button]:w-2.5 [&>button]:h-3 [&>button]:flex [&>button]:justify-center [&>button]:items-center [&>button]:leading-[2] [&>button]:text-large [&>button]:font-[200] [&>button]:text-gray-500 hover:[&>button]:text-red-600 [&>button]:bg-transparent [&>button]:border-none [&>button]:cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </li>
  );
}

export function Divider({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('h-[1px] bg-gray-200 my-[5px]', className)} {...props} />;
}

export function SuccessSection({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('flex flex-row items-center justify-between gap-3 py-4 px-5 rounded-medium bg-green-50 border border-green-200 mt-2', className)} {...props}>
      {children}
    </div>
  );
}

export function SuccessMessage({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('flex items-center gap-2 text-medium font-semibold text-green-700 flex-1', className)} {...props}>
      {children}
    </div>
  );
}

export function CopyLinkButton({ children, className, ...props }: React.ComponentProps<'button'>) {
  return (
    <button
      className={cn(
        'py-2.5 px-4 rounded-medium bg-green-600 text-white text-medium font-semibold border-none cursor-pointer transition-colors duration-200 whitespace-nowrap',
        'hover:bg-green-700 active:bg-green-800 disabled:bg-gray-300 disabled:cursor-not-allowed',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function ResetButton({ children, className, ...props }: React.ComponentProps<'button'>) {
  return (
    <button className={cn('border-none bg-transparent cursor-pointer hover:text-red-500 font-semibold', className)} {...props}>
      {children}
    </button>
  );
}

export function Container({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('flex flex-col gap-[30px]', className)} {...props}>
      {children}
    </div>
  );
}

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
    // 1. 현재 도메인 + 프로젝트 경로 + 초대코드 조합
    const fullUrl = `${window.location.origin}/invite?code=${code}`;

    try {
      // 2. 클립보드에 쓰기
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
      // code가 있으면 버튼 비활성화 (onSubmit 제거)
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
    <Container>
      <InfoContainer>
        <InputWrapper>
          <InputTitle>프로젝트 이름</InputTitle>
          <Title>{title}</Title>
        </InputWrapper>
        <InputWrapper>
          <EmailInputTitle>
            초대 이메일 ({tags.length}/10){' '}
            {tags.length > 0 && (
              <ResetButton
                type="button"
                onClick={handleResetTag}
              >
                초기화
              </ResetButton>
            )}
          </EmailInputTitle>
          <input
            className={cn(
              'w-full border border-gray-300 py-3 pr-11 pl-2 rounded-small text-medium text-gray-900 box-border focus:outline-none'
            )}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="초대할 이메일을 입력하고 Enter를 눌러주세요."
            autoComplete="off"
          />
        </InputWrapper>
        <TagList>
          {tags.map((tag, i) => {
            return (
              <TagListItem key={tag}>
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(i)}
                >
                  &times;
                </button>
              </TagListItem>
            );
          })}
        </TagList>
        {code && (
          <>
            <Divider />
            <SuccessSection>
              <SuccessMessage>✓ 초대 링크가 생성되었습니다</SuccessMessage>
              <CopyLinkButton
                type="button"
                onClick={() => handleCopy(code)}
              >
                링크 다시 복사하기
              </CopyLinkButton>
            </SuccessSection>
          </>
        )}
      </InfoContainer>
    </Container>
  );
}

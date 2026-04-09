'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { MAX_ISSUE_TITLE_LENGTH } from '@/constants/issue';
import { useQuickStartMutation } from '@/hooks/issues';
import { generateRandomNickname } from '@/lib/utils/nickname';
import { cn } from '@/lib/utils/cn';
import { useModalStore } from '../use-modal-store';

export function Container({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('flex flex-col gap-[30px]', className)} {...props}>
      {children}
    </div>
  );
}

export function InfoContainer({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('flex flex-col gap-2.5', className)} {...props}>
      {children}
    </div>
  );
}

export function InputTitle({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('text-medium font-semibold', className)} {...props}>
      {children}
    </div>
  );
}

export function InputWrapper({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('flex flex-col gap-1', className)} {...props}>
      {children}
    </div>
  );
}

export function Input({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('relative w-full', className)} {...props}>
      {children}
    </div>
  );
}

export function InputField({ className, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      className={cn(
        'w-full border border-gray-300 py-3 pr-11 pl-2 rounded-small text-medium text-gray-900 box-border focus:outline-none',
        className
      )}
      {...props}
    />
  );
}

export function CharCount({
  $isOverLimit,
  children,
  className,
  ...props
}: React.ComponentProps<'span'> & { $isOverLimit?: boolean }) {
  return (
    <span
      className={cn(
        'absolute right-[10px] top-1/2 -translate-y-1/2 text-small font-semibold pointer-events-none',
        $isOverLimit ? 'text-red-500' : 'text-gray-600',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function Footer({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('flex justify-end gap-3', className)} {...props}>
      {children}
    </div>
  );
}

export function SubmitButton({ children, className, ...props }: React.ComponentProps<'button'>) {
  return (
    <button
      className={cn(
        'h-10 px-[18px] border-none rounded-medium bg-green-600 text-white font-semibold cursor-pointer',
        'hover:not-disabled:bg-green-700',
        'disabled:bg-gray-300 disabled:cursor-not-allowed',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

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
    <>
      <Container>
        <InfoContainer>
          <InputWrapper>
            <InputTitle>이슈 제목</InputTitle>
            <Input>
              <InputField
                value={title}
                onChange={(e) => setTitle(e.target.value.slice(0, MAX_ISSUE_TITLE_LENGTH))}
                placeholder={`예시) 서비스 홍보 방안 (${MAX_ISSUE_TITLE_LENGTH}자 이내)`}
                maxLength={MAX_ISSUE_TITLE_LENGTH}
              />
              <CharCount $isOverLimit={title.length > MAX_ISSUE_TITLE_LENGTH}>
                {title.length}/{MAX_ISSUE_TITLE_LENGTH}
              </CharCount>
            </Input>
          </InputWrapper>
          <InputWrapper>
            <InputTitle>표시될 닉네임</InputTitle>
            <Input>
              <InputField
                value={ownerNickname}
                onChange={(e) => setOwnerNickname(e.target.value)}
                placeholder="예시) 생각하는 단무지"
              />
            </Input>
          </InputWrapper>
        </InfoContainer>
      </Container>
    </>
  );
}

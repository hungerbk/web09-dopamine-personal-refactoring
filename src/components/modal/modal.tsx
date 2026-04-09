'use client';

import { useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils/cn';
import { useModalStore } from './use-modal-store';

function Overlay({ children, className, onClick, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('fixed inset-0 bg-slate-900/35 grid place-items-center z-backdrop p-4', className)}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}

function Dialog({ children, className, onClick, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('bg-white rounded-medium shadow-[0_20px_60px_rgba(0,0,0,0.2)] w-[min(560px,100%)] max-h-[90vh] overflow-hidden flex flex-col', className)}
      role="dialog"
      aria-modal="true"
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}

function Header({ children, className, ...props }: React.ComponentProps<'header'>) {
  return (
    <header
      className={cn('flex items-center justify-between py-4 px-[18px] border-b border-gray-100 font-bold text-black', className)}
      {...props}
    >
      {children}
    </header>
  );
}

function Body({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('p-[18px] text-medium text-gray-700 leading-[1.6] overflow-auto whitespace-pre-wrap', className)}
      {...props}
    >
      {children}
    </div>
  );
}

function Footer({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex justify-end gap-3 p-3', className)}
      {...props}
    >
      {children}
    </div>
  );
}

function CancelButton({ children, className, ...props }: React.ComponentProps<'button'>) {
  return (
    <button
      className={cn('h-10 min-w-[70px] px-[18px] border border-gray-400 rounded-medium text-gray-700 font-bold cursor-pointer hover:bg-gray-100', className)}
      {...props}
    >
      {children}
    </button>
  );
}

function SubmitButton({ children, className, ...props }: React.ComponentProps<'button'>) {
  return (
    <button
      className={cn('h-10 min-w-[70px] px-[18px] border-none rounded-medium bg-green-600 text-white font-semibold cursor-pointer hover:not-disabled:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed', className)}
      {...props}
    >
      {children}
    </button>
  );
}

function CloseButton({ children, className, ...props }: React.ComponentProps<'button'>) {
  return (
    <button
      className={cn('border-none bg-transparent text-[20px] cursor-pointer text-gray-500 leading-none p-1 hover:text-black', className)}
      {...props}
    >
      {children}
    </button>
  );
}

export default function Modal() {
  const {
    isOpen,
    title,
    content,
    closeOnOverlayClick,
    hasCloseButton,
    modalType,
    closeModal,
    isPending,
    onSubmit,
    submitButtonText,
    setIsPending,
  } = useModalStore();

  // 최신 값들을 ref로 저장하여 이벤트 리스너 재등록 방지
  const onSubmitRef = useRef(onSubmit);
  const isPendingRef = useRef(isPending);
  const modalTypeRef = useRef(modalType);
  const closeModalRef = useRef(closeModal);

  useEffect(() => {
    onSubmitRef.current = onSubmit;
  }, [onSubmit]);

  useEffect(() => {
    isPendingRef.current = isPending;
  }, [isPending]);

  useEffect(() => {
    modalTypeRef.current = modalType;
  }, [modalType]);

  useEffect(() => {
    closeModalRef.current = closeModal;
  }, [closeModal]);

  const handleSubmit = useCallback(async () => {
    if (!onSubmitRef.current || isPendingRef.current) return;

    try {
      setIsPending(true);
      await onSubmitRef.current();
    } catch (error) {
      console.error('Modal submit error:', error);
    } finally {
      setIsPending(false);
    }
  }, [setIsPending]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        // 종료 모달의 경우 CloseIssueModal에서 처리
        if (modalTypeRef.current !== 'close-issue') {
          closeModalRef.current();
        }
      } else if (event.key === 'Enter' && !event.shiftKey) {
        if (event.isComposing) return;
        if (!onSubmitRef.current || isPendingRef.current) return;
        if (modalTypeRef.current !== 'invite') {
          event.preventDefault();
          handleSubmit();
        }
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleSubmit]);

  if (!isOpen || !content) return null;

  return createPortal(
    <Overlay onClick={closeOnOverlayClick ? closeModal : undefined}>
      <Dialog
        onClick={(event: React.MouseEvent) => event.stopPropagation()}
      >
        {title ? (
          <Header>
            <span>{title}</span>
            {hasCloseButton ? (
              <CloseButton
                type="button"
                aria-label="닫기"
                onClick={closeModal}
              >
                &times;
              </CloseButton>
            ) : null}
          </Header>
        ) : null}
        <Body>{content}</Body>
        <Footer>
          {hasCloseButton && (
            <CancelButton
              type="button"
              onClick={() => closeModal()}
              disabled={isPending}
            >
              취소
            </CancelButton>
          )}
          {(onSubmit || submitButtonText) && (
            <SubmitButton
              type="button"
              onClick={handleSubmit}
              disabled={!onSubmit || isPending}
            >
              {isPending ? '처리 중...' : submitButtonText || '완료'}
            </SubmitButton>
          )}
        </Footer>
      </Dialog>
    </Overlay>,
    document.body,
  );
}

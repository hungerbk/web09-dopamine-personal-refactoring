'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { cn } from '@/lib/utils/cn';
import { useCommentMutations, useCommentQuery } from '@/hooks/comments';
import CommentList from './comment-list';
import { CommentWindowContext } from './comment-window-context';
import { useCommentList } from './hooks/use-comment-list';
import { getCommentErrorMessage, useCommentWindow } from './hooks/use-comment-window';

interface CommentWindowProps {
  issueId: string;
  ideaId: string;
  userId: string;
  onClose?: () => void;
}

export default function CommentWindow({ issueId, ideaId, userId, onClose }: CommentWindowProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const { commentsQuery } = useCommentQuery(issueId, ideaId);
  const { createMutation, updateMutation, deleteMutation } = useCommentMutations(issueId, ideaId);
  const isLoading = commentsQuery.isLoading;
  const isSubmitting = createMutation.isPending;
  const comments = commentsQuery.data ?? [];
  const errorMessage = getCommentErrorMessage({
    issueId,
    ideaId,
    commentsQuery,
    createMutation,
    updateMutation,
    deleteMutation,
  });

  const { inputValue, setInputValue, handleSubmit, handleInputKeyDown } = useCommentWindow({
    issueId,
    ideaId,
    userId,
    createMutation,
  });

  const {
    isMutating,
    mutatingCommentId,
    editingValue,
    setEditingValue,
    isCommentOwner,
    isEditingComment,
    getSaveButtonContent,
    getDeleteButtonContent,
    shouldShowReadMore,
    expandedCommentIds,
    overflowCommentIds,
    registerCommentBody,
    registerCommentMeasure,
    handleExpand,
    handleEditStart,
    handleEditCancel,
    handleEditSave,
    handleEditKeyDown,
    handleDelete,
  } = useCommentList({
    issueId,
    ideaId,
    userId,
    comments,
    isSubmitting,
    updateMutation,
    deleteMutation,
  });

  const commentContextValue = useMemo(
    () => ({
      comments,
      errorMessage,
      isLoading,
      isMutating,
      mutatingCommentId,
      editingValue,
      setEditingValue,
      isCommentOwner,
      isEditingComment,
      getSaveButtonContent,
      getDeleteButtonContent,
      shouldShowReadMore,
      expandedCommentIds,
      overflowCommentIds,
      registerCommentBody,
      registerCommentMeasure,
      handleExpand,
      handleEditStart,
      handleEditCancel,
      handleEditSave,
      handleEditKeyDown,
      handleDelete,
    }),
    [
      comments,
      editingValue,
      errorMessage,
      getDeleteButtonContent,
      getSaveButtonContent,
      handleDelete,
      handleEditCancel,
      handleEditKeyDown,
      handleEditSave,
      handleEditStart,
      isCommentOwner,
      isEditingComment,
      isLoading,
      isMutating,
      mutatingCommentId,
      setEditingValue,
      shouldShowReadMore,
      expandedCommentIds,
      overflowCommentIds,
      registerCommentBody,
      registerCommentMeasure,
      handleExpand,
    ],
  );

  const resizeTextarea = useCallback((element?: HTMLTextAreaElement | null) => {
    const target = element ?? textareaRef.current;
    if (!target) return;

    target.style.height = 'auto';
    const styles = window.getComputedStyle(target);
    const lineHeight = Number.parseFloat(styles.lineHeight) || 0;
    const paddingTop = Number.parseFloat(styles.paddingTop) || 0;
    const paddingBottom = Number.parseFloat(styles.paddingBottom) || 0;
    const maxHeight = lineHeight * 5 + paddingTop + paddingBottom;
    const nextHeight = Math.min(target.scrollHeight, maxHeight);

    target.style.height = `${nextHeight}px`;
    target.style.overflowY = target.scrollHeight > maxHeight ? 'auto' : 'hidden';
  }, []);

  useEffect(() => {
    resizeTextarea();
  }, [inputValue, resizeTextarea]);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInputValue(event.target.value);
      resizeTextarea(event.target);
    },
    [resizeTextarea, setInputValue],
  );

  const handleSubmitClick = useCallback(() => {
    handleSubmit(textareaRef.current ?? undefined);
  }, [handleSubmit]);

  const handleClose = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      e.preventDefault();
      onClose?.();
    },
    [onClose],
  );

  // 클릭 시 이벤트 전파 방지
  const handleWindowClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  }, []);

  // 포인터 다운 시 이벤트 전파 방지
  const handleWindowPointerDown = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    event.stopPropagation();
  }, []);

  // 휠 이벤트 전파 방지
  const handleWindowWheel = useCallback((event: React.WheelEvent<HTMLDivElement>) => {
    event.stopPropagation();
  }, []);

  // 휠 캡처 이벤트 전파 방지
  const handleWindowWheelCapture = useCallback((event: React.WheelEvent<HTMLDivElement>) => {
    event.stopPropagation();
  }, []);

  return (
    <section
      role="dialog"
      aria-label="댓글"
      onClick={handleWindowClick}
      onPointerDown={handleWindowPointerDown}
      onWheel={handleWindowWheel}
      onWheelCapture={handleWindowWheelCapture}
      data-no-canvas-close="true"
      className="absolute bottom-[-340px] right-[-400px] z-important flex h-[500px] w-[420px] min-w-[260px] max-w-[calc(100vw-32px)] max-h-[min(800px,calc(100vh-32px))] origin-top-left flex-col overflow-hidden rounded-medium border border-gray-200 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.2)]"
    >
      <header className="flex cursor-default items-center justify-between border-b border-gray-200 bg-gray-50 px-[14px] py-3">
        <span className="pl-3 text-large font-semibold text-gray-800">댓글</span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label="Close"
            onClick={handleClose}
            className="px-1.5 py-0.5 text-[20px] leading-none text-gray-500 hover:text-black"
          >
            &times;
          </button>
        </div>
      </header>
      <div className="flex min-h-0 flex-1 cursor-default flex-col gap-4 overflow-hidden p-4 text-medium text-gray-700">
        <CommentWindowContext.Provider value={commentContextValue}>
          <CommentList />
        </CommentWindowContext.Provider>
        <section className="flex flex-col gap-3">
          <div className="grid grid-cols-[1fr_auto] items-center gap-2.5 rounded-small border border-gray-200 px-3 py-2.5">
            <textarea
              placeholder="댓글 입력"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              disabled={isSubmitting}
              rows={1}
              ref={textareaRef}
              className="max-h-[calc(1.5em*5+20px)] min-h-[calc(1.5em+20px)] resize-none overflow-y-hidden border-none px-3 py-2.5 text-medium leading-[1.5] outline-none"
            />
            <button
              type="button"
              onClick={handleSubmitClick}
              disabled={isSubmitting}
              className={cn(
                'rounded-small border border-green-600 px-4 py-2.5 font-semibold text-green-700',
                'hover:bg-green-200 disabled:cursor-not-allowed',
                'bg-green-100',
              )}
            >
              {getSaveButtonContent('create')}
            </button>
          </div>
        </section>
      </div>
    </section>
  );
}

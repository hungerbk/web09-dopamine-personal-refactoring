'use client';

import { useEffect, useMemo, useRef } from 'react';
import { CommentListContext } from './comment-list-context';
import CommentListItem from './comment-list-item';
import { useCommentWindowContext } from './comment-window-context';

export default function CommentList() {
  const commentListRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const prevLengthRef = useRef<number | null>(null);

  const {
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
  } = useCommentWindowContext();

  const getCommentMetaMessage = () => {
    if (isLoading) return '댓글을 불러오는 중...';
    if (errorMessage) return errorMessage;
    if (comments.length === 0) return '등록된 댓글이 없습니다.';
    return null;
  };

  const commentMetaMessage = getCommentMetaMessage();

  useEffect(() => {
    const prev = prevLengthRef.current;
    const current = comments.length;

    if (prev === null) {
      prevLengthRef.current = current;
      return;
    }

    if (current > prev) {
      bottomRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }

    prevLengthRef.current = current;
  }, [comments.length]);

  const contextValue = useMemo(
    () => ({
      isMutating,
      mutatingCommentId,
      editingValue,
      setEditingValue,
      isCommentOwner,
      isEditingComment,
      getSaveButtonContent,
      getDeleteButtonContent,
      shouldShowReadMore,
      handleEditStart,
      handleEditCancel,
      handleEditSave,
      handleEditKeyDown,
      handleDelete,
      expandedCommentIds,
      overflowCommentIds,
      registerCommentBody,
      registerCommentMeasure,
      handleExpand,
    }),
    [
      isMutating,
      mutatingCommentId,
      editingValue,
      setEditingValue,
      isCommentOwner,
      isEditingComment,
      getSaveButtonContent,
      getDeleteButtonContent,
      shouldShowReadMore,
      handleEditStart,
      handleEditCancel,
      handleEditSave,
      handleEditKeyDown,
      handleDelete,
      expandedCommentIds,
      overflowCommentIds,
      registerCommentBody,
      registerCommentMeasure,
      handleExpand,
    ],
  );

  return (
    <CommentListContext.Provider value={contextValue}>
      <section className="flex min-h-0 flex-1 flex-col gap-3">
        <div
          ref={commentListRef}
          className="scrollbar-hide flex flex-col gap-0 overflow-auto"
        >
          {commentMetaMessage && (
            <div className="relative border-b border-gray-100 px-[14px] py-[14px] last:border-b-0">
              <div className="text-small font-medium text-gray-500">{commentMetaMessage}</div>
            </div>
          )}

          {!isLoading &&
            !errorMessage &&
            comments.map((comment) => (
              <CommentListItem
                key={comment.id}
                comment={comment}
              />
            ))}

          <div ref={bottomRef} />
        </div>
      </section>
    </CommentListContext.Provider>
  );
}

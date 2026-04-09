'use client';

import { useCallback } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';
import type { Comment } from '@/lib/api/comment';
import { getCommentMeta } from '@/lib/utils/comment';
import { useCommentListContext } from './comment-list-context';

interface CommentListItemProps {
  comment: Comment;
}

const actionButtonVariants = cva(
  'px-1 py-0.5 text-[12px] font-normal text-gray-400 transition-colors duration-150 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: '',
        danger: 'hover:text-red-600',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export default function CommentListItem({ comment }: CommentListItemProps) {
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
  } = useCommentListContext();

  const isExpanded = expandedCommentIds.includes(comment.id);
  const canExpand = overflowCommentIds.includes(comment.id);
  const isEditing = isEditingComment(comment.id);
  const canShowActions = isCommentOwner(comment.user?.id);

  const handleEditStartClick = useCallback(
    () => handleEditStart(comment),
    [comment, handleEditStart],
  );
  const handleDeleteClick = useCallback(() => {
    if (isMutating) return;
    handleDelete(comment.id);
  }, [comment.id, handleDelete, isMutating]);
  const handleExpandClick = useCallback(() => handleExpand(comment.id), [comment.id, handleExpand]);

  return (
    <div className="relative border-b border-gray-100 px-[14px] py-[14px] last:border-b-0">
      <div
        ref={registerCommentMeasure(comment.id)}
        className="pointer-events-none invisible absolute left-0 top-0 h-auto w-full overflow-visible whitespace-pre-wrap break-words text-[15px] leading-[1.6]"
      >
        {comment.content}
      </div>
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="text-small font-medium text-gray-500">{getCommentMeta(comment)}</div>
        {canShowActions && (
          <div className="inline-flex items-center gap-2">
            {isEditing && (
              <>
                <button
                  type="button"
                  onClick={handleEditSave}
                  disabled={
                    isMutating ||
                    mutatingCommentId === comment.id ||
                    editingValue.trim().length === 0
                  }
                  className={cn(actionButtonVariants({ variant: 'default' }))}
                >
                  {getSaveButtonContent(comment.id)}
                </button>
                <button
                  type="button"
                  onClick={handleEditCancel}
                  disabled={isMutating}
                  className={cn(actionButtonVariants({ variant: 'default' }))}
                >
                  취소
                </button>
              </>
            )}
            {!isEditing && (
              <>
                <button
                  type="button"
                  onClick={handleEditStartClick}
                  disabled={isMutating}
                  className={cn(actionButtonVariants({ variant: 'default' }))}
                >
                  수정
                </button>
                <button
                  type="button"
                  onClick={handleDeleteClick}
                  disabled={isMutating}
                  className={cn(actionButtonVariants({ variant: 'danger' }))}
                >
                  {getDeleteButtonContent(comment.id)}
                </button>
              </>
            )}
          </div>
        )}
      </div>
      {isEditing && (
        <textarea
          value={editingValue}
          onChange={(event) => setEditingValue(event.target.value)}
          onKeyDown={handleEditKeyDown}
          disabled={isMutating || mutatingCommentId === comment.id}
          className="min-h-[84px] w-full resize-y rounded-small border border-gray-200 px-3 py-2.5 text-medium focus:border-blue-400 focus:outline-2 focus:outline-blue-200"
        />
      )}
      {!isEditing && (
        <>
          <div
            ref={registerCommentBody(comment.id)}
            className={cn(
              'max-w-full whitespace-pre-wrap break-words text-[15px] leading-[1.6] text-gray-900',
              !isExpanded && 'line-clamp-2',
            )}
          >
            {comment.content}
          </div>
          {shouldShowReadMore(isExpanded, canExpand) && (
            <button
              type="button"
              onClick={handleExpandClick}
              className="mt-2 p-0 text-small text-blue-600 hover:underline"
            >
              더보기
            </button>
          )}
        </>
      )}
    </div>
  );
}

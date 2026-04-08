'use client';

import type { KeyboardEventHandler, MouseEventHandler, RefObject } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils/cn';
import { ISSUE_STATUS } from '@/constants/issue';
import type { IssueStatus } from '@/issues/types';

interface IdeaCardHeaderProps {
  id: string;
  issueId: string;
  isEditing: boolean;
  editValue: string;
  displayContent: string;
  isVoteButtonVisible?: boolean;
  isCurrentUser: boolean;
  author: string;
  issueStatus?: IssueStatus;
  commentCount?: number;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  isCommentOpen: boolean;
  setEditValue: (value: string) => void;
  handleKeyDownEdit: KeyboardEventHandler<HTMLTextAreaElement>;
  submitEdit: () => void;
  onDelete?: MouseEventHandler<HTMLButtonElement>;
  onCommentClick?: MouseEventHandler<HTMLButtonElement>;
}

export default function IdeaCardHeader({
  id,
  issueId,
  isEditing,
  editValue,
  displayContent,
  isVoteButtonVisible,
  isCurrentUser,
  author,
  issueStatus,
  commentCount: initialCommentCount = 0,
  textareaRef,
  isCommentOpen,
  setEditValue,
  handleKeyDownEdit,
  submitEdit,
  onDelete,
  onCommentClick,
}: IdeaCardHeaderProps) {
  const commentCount = initialCommentCount;
  return (
    <div className="relative flex w-full flex-col gap-3">
      {isEditing ? (
        <textarea
          data-testid="idea-input"
          aria-label="idea-input"
          ref={textareaRef}
          rows={1}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onPointerDown={(e) => e.stopPropagation()}
          onKeyDown={handleKeyDownEdit}
          onMouseDown={(e) => e.stopPropagation()}
          autoFocus
          placeholder="아이디어를 입력해주세요."
          className="min-h-xl w-full resize-none overflow-hidden border-none bg-transparent p-0 text-large font-bold leading-[1.4] tracking-[0] text-gray-900 outline-none placeholder:font-bold placeholder:text-gray-900 placeholder:opacity-40"
        />
      ) : (
        <pre
          data-testid="idea-content"
          aria-label="idea-content"
          className="min-h-xl whitespace-pre-wrap break-words text-large font-bold leading-[1.4] text-gray-900"
        >
          {displayContent}
        </pre>
      )}
      <div className="mt-2.5 flex h-[42px] w-full items-center justify-between">
        <span
          className={cn(
            'rounded-large px-[14px] py-2 text-small font-semibold',
            isCurrentUser ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400',
          )}
        >
          {author}
        </span>
        {isVoteButtonVisible ? (
          <button
            aria-label="comment"
            onClick={onCommentClick}
            data-no-canvas-close="true"
            className={cn(
              'inline-flex h-[42px] min-w-[42px] items-center justify-center gap-1.5 rounded-medium bg-white px-2.5 text-gray-400 hover:bg-gray-100',
              isCommentOpen ? 'border-none outline outline-2 outline-blue-400' : 'border border-gray-200',
            )}
          >
            <Image
              src="/comment.svg"
              alt="댓글"
              width={14}
              height={14}
            />
            <span className="mt-px text-[12px] font-semibold leading-none text-gray-500">
              {commentCount}
            </span>
          </button>
        ) : (
          <>
            {isEditing ? (
              <button
                onClick={submitEdit}
                className="ml-auto h-10 w-[60px] rounded-small border border-green-600 bg-transparent text-medium tracking-[1px] text-green-600 hover:bg-green-100"
              >
                제출
              </button>
            ) : null}
          </>
        )}
      </div>
      {issueStatus === ISSUE_STATUS.BRAINSTORMING && isCurrentUser && (
        <button
          aria-label="delete"
          onClick={onDelete}
          className="absolute right-[-28px] top-[-28px] flex h-[30px] w-[30px] items-center justify-center border-none bg-transparent"
        >
          <Image
            src="/close.svg"
            alt="삭제"
            width={14}
            height={14}
          />
        </button>
      )}
    </div>
  );
}

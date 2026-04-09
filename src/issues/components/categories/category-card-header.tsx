'use client';

import {
  cn
} from '@/lib/utils/cn';
import { IssueStatus } from '@/issues/types';
import { ISSUE_STATUS } from '@/constants/issue';

interface CategoryCardHeaderProps {
  status: IssueStatus;
  curTitle: string;
  draftTitle: string;
  isEditing: boolean;
  isMuted: boolean;
  onStartEdit: () => void;
  onChangeTitle: (value: string) => void;
  onSubmitTitle: (value: string) => void;
  onCancelEdit: () => void;
  onRemove?: () => void;
  onMouseDown?: (event: React.MouseEvent) => void;
  onClick?: (e: React.MouseEvent) => void;
}

export default function CategoryCardHeader({
  status,
  curTitle,
  draftTitle,
  isEditing,
  isMuted,
  onStartEdit,
  onChangeTitle,
  onSubmitTitle,
  onCancelEdit,
  onRemove,
  onMouseDown,
  onClick,
}: CategoryCardHeaderProps) {
  return (
    <header
      onMouseDown={onMouseDown}
      onClick={onClick}
      className={cn(
        'flex w-full items-center justify-between gap-3 text-[14px] font-semibold',
        isMuted ? 'text-[#9a9a9a]' : 'text-[#222222]',
      )}
    >
      <div className="flex items-center gap-2">
        <span
          className={cn(
            'h-2 w-2 rounded-full',
            isMuted ? 'bg-[#c9c9c9]' : 'bg-[#00a94f]',
          )}
        />
        {isEditing ? (
          <input
            value={draftTitle}
            onChange={(e) => onChangeTitle(e.target.value)}
            onBlur={() => onSubmitTitle(draftTitle)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSubmitTitle(draftTitle);
              if (e.key === 'Escape') onCancelEdit();
            }}
            autoFocus
            className="rounded-[8px] border border-[#e5e7eb] px-2 py-1 text-[14px] text-[#111827]"
          />
        ) : (
          <span className={cn(isMuted ? 'text-[#9ca3af]' : 'text-[#00a94f]')}>{curTitle}</span>
        )}
      </div>
      {!isEditing && status === ISSUE_STATUS.CATEGORIZE && (
        <div className="inline-flex gap-1.5">
          <button
            onClick={onStartEdit}
            className={cn(
              'items-center justify-center rounded-[8px] border border-[#e2e8f0] bg-[#f8fafc] px-2 py-1 text-[12px] font-semibold text-[#475569]',
              isMuted ? 'hidden' : 'inline-flex',
            )}
          >
            수정
          </button>
          {onRemove && (
            <button
              onClick={onRemove}
              className={cn(
                'items-center justify-center rounded-[8px] border border-[#fbd6d0] bg-white px-2 py-1 text-[12px] font-semibold text-[#ef5944]',
                isMuted ? 'hidden' : 'inline-flex',
              )}
            >
              삭제
            </button>
          )}
        </div>
      )}
    </header>
  );
}

'use client';

import { useCallback, useEffect, useRef } from 'react';
import type { MouseEventHandler, PointerEventHandler } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';
import { ISSUE_STATUS } from '@/constants/issue';
import { Z_INDEX } from '@/constants/z-index';
import { useSelectedIdeaMutation } from '@/hooks/issues';
import { useIssueData, useIssueIdentity } from '../../hooks';
import { useCommentWindowStore } from '../../store/use-comment-window-store';
import { useIdeaCardStackStore } from '../../store/use-idea-card-stack-store';
import type { CardStatus, IdeaWithPosition, Position } from '@/issues/types';
import IdeaCardBadge from './idea-card-badge';
import IdeaCardFooter from './idea-card-footer';
import IdeaCardHeader from './idea-card-header';
import { useIdeaCard } from './use-idea-card';

interface IdeaCardProps extends Omit<IdeaWithPosition, 'comments' | 'needDiscussion'> {
  issueId: string;
  status?: CardStatus;
  isHotIdea?: boolean;
  onVoteChange?: (agreeCount: number, disagreeCount: number) => void;
  onSave?: (id: string, content: string) => void;
  onDelete?: (id: string) => void;
  onClick?: (id: string) => void;
  onPositionChange?: (id: string, position: Position) => void;
  disableAnimation?: boolean; // 드래그 중일 때는 애니메이션 비활성화
}

const ideaCardVariants = cva(
  'relative min-w-[30em] max-w-[30em] rounded-medium px-[35px] pb-[30px] pt-[35px]',
  {
    variants: {
      status: {
        default: 'border border-gray-200 bg-white shadow-[0_4px_10px_rgba(31,41,55,0.06)]',
        needDiscussion: 'border-2 border-red-600 bg-red-50',
        mostLiked: 'border-2 border-blue-600 bg-blue-50',
        selected: 'border-2 border-yellow-500 bg-yellow-50 shadow-[0_4px_10px_rgba(250,204,21,0.86)]',
      },
      isEditing: {
        true: 'cursor-auto border border-gray-500',
        false: '',
      },
      isHotIdea: {
        true: 'border-2 border-red-500',
        false: '',
      },
    },
    compoundVariants: [
      {
        status: 'default',
        isHotIdea: true,
        className: 'bg-red-50 shadow-[0_8px_24px_rgba(220,38,38,0.3)]',
      },
      {
        status: 'needDiscussion',
        isHotIdea: true,
        className: 'shadow-[0_8px_24px_rgba(220,38,38,0.3)]',
      },
      {
        status: 'mostLiked',
        isHotIdea: true,
        className: 'shadow-[0_8px_24px_rgba(220,38,38,0.3)]',
      },
    ],
    defaultVariants: {
      status: 'default',
      isEditing: false,
      isHotIdea: false,
    },
  },
);

export default function IdeaCard(props: IdeaCardProps) {
  const issueId = props.issueId ?? '';
  const { mutate: selectIdea } = useSelectedIdeaMutation(issueId);
  const { status: issueStatus, isQuickIssue } = useIssueData(props.issueId);
  const bringToFront = useIdeaCardStackStore(props.issueId, (state) => state.bringToFront);
  const zIndex = useIdeaCardStackStore(props.issueId, (state) =>
    props.id ? state.getZIndex(props.id) : 0,
  );

  // 현재 사용자가 이 아이디어의 작성자인지 확인
  const { userId: currentUserId } = useIssueIdentity(props.issueId, { isQuickIssue });
  const isCurrentUser = currentUserId === props.userId;
  const inCategory = !!props.categoryId;
  const listenersRef = useRef<{ onPointerDown?: PointerEventHandler } | null>(null);
  const getListeners = () => listenersRef.current ?? undefined;

  // 비즈니스 로직 (투표, 편집 등)
  const {
    textareaRef,
    status,
    isEditing,
    editValue,
    displayContent,
    setEditValue,
    handleAgree,
    handleDisagree,
    submitEdit,
    handleKeyDownEdit,
    handlePointerDown,
    handleDeleteClick,
    handleCardClick,
  } = useIdeaCard({
    id: props.id,
    issueId: props.issueId,
    userId: currentUserId,
    content: props.content,
    isSelected: props.isSelected,
    status: props.status,
    editable: !!props.editable,
    onSave: props.onSave,
    categoryId: props.categoryId,
    inCategory,
    issueStatus,
    bringToFront,
    getListeners,
    onDelete: props.onDelete,
    onClick: props.onClick,
    selectIdea,
  });

  // 댓글 윈도우 상태 관리
  const activeCommentId = useCommentWindowStore((s) => s.activeCommentId);
  const openComment = useCommentWindowStore((s) => s.openComment);
  const closeComment = useCommentWindowStore((s) => s.closeComment);
  const isCommentOpen = activeCommentId === props.id;

  const handleToggleComment: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();

    // 토글: 같은 카드의 댓글창이면 닫고, 다른 카드면 전환
    if (activeCommentId === props.id) {
      closeComment();
    } else {
      openComment(props.id);
    }
  };

  // 드래그 로직

  // dnd-kit useDraggable
  const canDrag = issueStatus === ISSUE_STATUS.BRAINSTORMING || issueStatus === ISSUE_STATUS.CATEGORIZE;

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: props.id || 'idea-unknown',
    // id가 없거나 거나 카테고리 단계가 아니거나 편집 중이면 드래그 불가
    disabled: !props.id || isEditing || !canDrag,
    data: {
      editValue: editValue,
    },
  });

  const cardRef = useRef<HTMLElement | null>(null);

  // setNodeRef와 cardRef를 함께 사용
  const combinedRef = useCallback(
    (node: HTMLElement | null) => {
      setNodeRef(node);
      cardRef.current = node;
    },
    [setNodeRef],
  );

  useEffect(() => {
    listenersRef.current = listeners || null;
  }, [listeners]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [editValue, textareaRef]);

  useEffect(() => {
    // 입력 중인 카드의 드래그가 끝난 경우, textarea에 포커스
    if (isEditing && !isDragging) {
      // dnd-kit에서 드래그가 끝나면 드래그한 컴포넌트를 자동으로 focus하기 때문에 시간차를 두고 포커스 설정
      const timer = setTimeout(() => {
        textareaRef.current?.focus();
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [isDragging, isEditing, textareaRef]);

  // 스타일 계산
  // 자유 배치 모드(categoryId === null)면 absolute positioning
  const cardStyle =
    !inCategory && props.position
      ? {
        position: 'absolute' as const,
        left: props.position.x,
        top: props.position.y,
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none' as const,
        zIndex: isDragging ? Z_INDEX.selected : zIndex,
        // dnd-kit transform 적용 (Canvas scale과 호환됨!)
        transform: CSS.Transform.toString(transform),
        opacity: isDragging ? 0 : undefined,
        // 브로드캐스팅으로 다른 사용자 이동 시 애니메이션
        transition: props.disableAnimation ? 'none' : 'left 0.4s ease-out, top 0.4s ease-out',
      }
      : {};

  return (
    <article
      ref={combinedRef}
      data-idea-card={props.id}
      onClick={handleCardClick}
      onPointerDown={handlePointerDown}
      {...attributes}
      {...(inCategory
        ? {}
        : Object.fromEntries(
          Object.entries(listeners || {}).filter(([key]) => key !== 'onPointerDown'),
        ))}
      style={cardStyle}
      className={cn(
        ideaCardVariants({
          status: (status ?? 'default') as 'default' | 'needDiscussion' | 'mostLiked' | 'selected',
          isEditing,
          isHotIdea: !!props.isHotIdea,
        }),
        issueStatus && issueStatus !== ISSUE_STATUS.BRAINSTORMING && '!shadow-none',
      )}
    >
      <IdeaCardBadge
        status={status}
        isHotIdea={props.isHotIdea}
      />
      <IdeaCardHeader
        id={props.id}
        issueId={props.issueId}
        isEditing={isEditing}
        editValue={editValue}
        displayContent={displayContent}
        isVoteButtonVisible={props.isVoteButtonVisible}
        isCurrentUser={isCurrentUser}
        author={props.author}
        issueStatus={issueStatus}
        commentCount={props.commentCount ?? 0}
        textareaRef={textareaRef}
        setEditValue={setEditValue}
        handleKeyDownEdit={handleKeyDownEdit}
        submitEdit={submitEdit}
        onDelete={handleDeleteClick}
        onCommentClick={handleToggleComment}
        isCommentOpen={isCommentOpen}
      />
      <IdeaCardFooter
        isVoteButtonVisible={props.isVoteButtonVisible}
        status={status}
        myVote={props.myVote}
        agreeCount={props.agreeCount}
        disagreeCount={props.disagreeCount}
        isVoteDisabled={props.isVoteDisabled}
        onAgree={handleAgree}
        onDisagree={handleDisagree}
      />
    </article>
  );
}

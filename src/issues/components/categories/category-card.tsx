'use client';

import type { IssueStatus, Position } from '@/issues/types';
import { cn } from '@/lib/utils/cn';
import { Z_INDEX } from '@/constants/z-index';
import { useCanvasContext } from '../canvas/canvas-context';
import CategoryCardHeader from './category-card-header';
import { useCategoryCard } from './use-category-card';
import { useCategoryDnd } from './use-category-dnd';

interface CategoryCardProps {
  id: string;
  issueId: string;
  title: string;
  position: Position;
  isMuted?: boolean;
  children?: React.ReactNode;
  hasActiveComment?: boolean;
  status: IssueStatus;
  onRemove?: () => void;
  onPositionChange?: (id: string, position: Position) => void;
  onDrag?: (id: string, position: Position, delta: { dx: number; dy: number }) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onDropIdea?: (ideaId: string) => void;
  checkCollision?: (id: string, position: Position) => boolean;
}

export default function CategoryCard({
  id,
  issueId,
  title,
  position,
  isMuted = false,
  children,
  hasActiveComment = false,
  status,
  onRemove,
  onPositionChange,
  onDrag,
  onDragStart,
  onDragEnd,
  checkCollision,
}: CategoryCardProps) {
  const { scale } = useCanvasContext();

  const { setDroppableRef, dndCardStyle, draggable } = useCategoryDnd({
    id,
    position,
    scale,
    onPositionChange,
    onDrag,
    onDragStart,
    onDragEnd,
    checkCollision,
  });

  const {
    curTitle,
    isEditing,
    setIsEditing,
    draftTitle,
    setDraftTitle,
    submitEditedTitle,
    cancelEditingTitle,
    handlePointerDown,
    handleClick,
  } = useCategoryCard({
    id,
    issueId,
    title,
  });

  const cardStyle = {
    ...dndCardStyle,
    zIndex: hasActiveComment ? Z_INDEX.important : (dndCardStyle.zIndex ?? 0),
  };

  return (
    <section
      ref={setDroppableRef}
      data-category-id={id}
      aria-label={`${curTitle} 카테고리`}
      style={cardStyle}
      className={cn(
        'flex min-h-[200px] min-w-[33em] max-w-[33em] flex-col items-center gap-[25px] rounded-[24px] border-2 border-dashed p-4',
        isMuted
          ? 'border-[#e5e7eb] bg-[#fafafa]'
          : 'border-[#7fc196] bg-[#d4eddc]',
      )}
    >
      <CategoryCardHeader
        status={status}
        curTitle={curTitle}
        draftTitle={draftTitle}
        isEditing={isEditing}
        isMuted={isMuted}
        onStartEdit={() => setIsEditing(true)}
        onChangeTitle={setDraftTitle}
        onSubmitTitle={submitEditedTitle}
        onCancelEdit={cancelEditingTitle}
        onRemove={onRemove}
        onMouseDown={(e) => {
          draggable?.handleMouseDown(e);
          handlePointerDown(e);
        }}
        onClick={handleClick}
      />
      {children && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-[25px]">
          {children}
        </div>
      )}
    </section>
  );
}

'use client';

import { VOTE_TYPE } from '@/constants/issue';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';
import type { CardStatus } from '@/issues/types';

type VoteType = (typeof VOTE_TYPE)[keyof typeof VOTE_TYPE];

interface IdeaCardFooterProps {
  isVoteButtonVisible?: boolean;
  status?: CardStatus;
  myVote?: VoteType | null;
  agreeCount?: number;
  disagreeCount?: number;
  isVoteDisabled?: boolean;
  onAgree: () => void;
  onDisagree: () => void;
}

const voteButtonVariants = cva(
  'flex-1 inline-flex items-center justify-center rounded-medium px-[18px] py-[14px] text-[16px] font-bold transition-all duration-150 disabled:pointer-events-none',
  {
    variants: {
      kind: {
        agree: '',
        disagree: '',
      },
      active: {
        true: '',
        false: '',
      },
      selectedCard: {
        true: 'border border-[rgba(250,204,21,0.3)] bg-yellow-50 text-yellow-700 shadow-[inset_0_-2px_0_rgba(250,204,21,0.15)]',
        false: '',
      },
    },
    compoundVariants: [
      { kind: 'agree', active: true, selectedCard: false, className: 'bg-green-600 text-white' },
      { kind: 'agree', active: false, selectedCard: false, className: 'bg-green-100 text-green-600 hover:bg-green-600 hover:text-white' },
      { kind: 'disagree', active: true, selectedCard: false, className: 'bg-red-600 text-white' },
      { kind: 'disagree', active: false, selectedCard: false, className: 'bg-red-100 text-red-500 hover:bg-red-600 hover:text-white' },
    ],
  },
);

export default function IdeaCardFooter({
  isVoteButtonVisible,
  status,
  myVote,
  agreeCount,
  disagreeCount,
  isVoteDisabled,
  onAgree,
  onDisagree,
}: IdeaCardFooterProps) {
  if (!isVoteButtonVisible) {
    return null;
  }

  return (
    <div className="mt-5 flex gap-3 border-t border-gray-200 pt-5">
      <button
        onClick={onAgree}
        disabled={isVoteDisabled}
        data-no-canvas-close="true"
        className={cn(
          voteButtonVariants({
            kind: 'agree',
            active: myVote === VOTE_TYPE.AGREE,
            selectedCard: status === 'selected',
          }),
        )}
      >
        찬성 {agreeCount}
      </button>
      <button
        onClick={onDisagree}
        disabled={isVoteDisabled}
        data-no-canvas-close="true"
        className={cn(
          voteButtonVariants({
            kind: 'disagree',
            active: myVote === VOTE_TYPE.DISAGREE,
            selectedCard: status === 'selected',
          }),
        )}
      >
        반대 {disagreeCount}
      </button>
    </div>
  );
}

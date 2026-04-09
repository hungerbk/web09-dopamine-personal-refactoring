'use client';

import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useTooltipStore } from '@/components/tooltip/use-tooltip-store';
import { ISSUE_STATUS } from '@/constants/issue';
import EditIssueButton from '../edit-issue-button/edit-issue-button';
import ProgressBar from '../progress-bar/progress-bar';
import HeaderButton from './header-button';
import { useHeader } from './use-header';

const Header = () => {
  const params = useParams<{ issueId: string }>();
  const issueId = params.issueId;

  const {
    issue,
    isVisible,
    isEditButtonVisible,
    topicId,
    handleCloseIssue,
    handleNextStep,
    handleAddCategory,
    handleAIStructureStart,
    handleCopyURL,
    handleGoback,
  } = useHeader({
    issueId,
  });

  const openTooltip = useTooltipStore((state) => state.openTooltip);
  const closeTooltip = useTooltipStore((state) => state.closeTooltip);

  const renderActionButtons = () => {
    switch (issue?.status) {
      case ISSUE_STATUS.CATEGORIZE:
        return (
          <>
            <HeaderButton
              imageSrc="/folder.svg"
              alt="카테고리 추가"
              text="카테고리 추가"
              onClick={handleAddCategory}
              variant="outline"
            />
            <HeaderButton
              imageSrc="/stick.svg"
              alt="AI 구조화"
              text="AI 구조화"
              onClick={handleAIStructureStart}
              variant="outline"
            />
          </>
        );
      case ISSUE_STATUS.SELECT:
        return (
          <HeaderButton
            text="이슈 종료"
            color="black"
            onClick={handleCloseIssue}
          />
        );
    }
  };

  return (
    <div className="grid h-[64px] min-w-[1200px] grid-cols-[1fr_2fr_1.2fr] items-center border-b border-gray-200 bg-white px-4">
      <div className="flex items-center justify-self-start gap-3 text-large font-semibold text-black">
        <button onClick={handleGoback}>
          <div className="flex items-center">
            <Image
              src={topicId ? '/leftArrow.svg' : '/home.svg'}
              alt={topicId ? '뒤로가기' : '홈으로'}
              width={18}
              height={18}
            />
          </div>
        </button>
        {issue?.title}
        {isEditButtonVisible && (
          <EditIssueButton
            issueId={issueId}
            currentTitle={issue?.title}
          />
        )}
      </div>
      <div className="w-[clamp(10rem,100%,40rem)] justify-self-center">
        <ProgressBar />
      </div>
      <div className="flex items-center justify-self-end gap-2">
        {isVisible && (
          <>
            <HeaderButton
              text="다음"
              onClick={handleNextStep}
              onMouseEnter={(e) => {
                e.stopPropagation();
                openTooltip(
                  e.currentTarget,
                  '다음 단계로 이동하면 현재 단계로 돌아올 수 없습니다.',
                );
              }}
              onMouseLeave={closeTooltip}
            />
          </>
        )}

        {renderActionButtons()}
        <HeaderButton
          imageSrc="/share.svg"
          alt="공유하기"
          onClick={handleCopyURL}
        />
      </div>
    </div>
  );
};

export default Header;

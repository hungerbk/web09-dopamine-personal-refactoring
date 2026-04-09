'use client';

import Sidebar from '@/components/sidebar/sidebar';
import SidebarItem from '@/components/sidebar/sidebar-item';
import * as S from '@/components/sidebar/sidebar';
import NewIssueButton from '@/issues/components/layout/new-issue-button';
import { useTopicSidebar } from './use-topic-sidebar';

export default function TopicSidebar() {
  const {
    isMounted,
    topicId,
    filteredIssues,
    searchValue,
    handleSearchChange,
  } = useTopicSidebar();

  return (
    <Sidebar
      inputProps={{
        value: searchValue,
        onChange: handleSearchChange,
      }}
    >
      {isMounted && (
        <>
          <S.SidebarTitle>
            <span>ISSUE LIST</span>
            <NewIssueButton />
          </S.SidebarTitle>
          <S.SidebarList>
            {topicId && filteredIssues.map((issue) => (
              <SidebarItem
                key={issue.id}
                title={issue.title}
                href={`/issues/${issue.id}`}
                // TODO: 스타일 작업 커밋 이후, 별도 커밋에서 `as any` 제거 및 타입 정리
                status={issue.status as any}
              />
            ))}
          </S.SidebarList>
        </>
      )}
    </Sidebar>
  );
}

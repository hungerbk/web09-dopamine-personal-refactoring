'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import MemberSidebarItem from '@/components/sidebar/member-sidebar-item';
import Sidebar from '@/components/sidebar/sidebar';
import SidebarFilter from '@/components/sidebar/sidebar-filter';
import SidebarItem from '@/components/sidebar/sidebar-item';
import * as S from '@/components/sidebar/sidebar';
import { CircleSkeleton, TextSkeleton } from '@/components/skeleton/skeleton';
import { useSmartLoading } from '@/hooks/use-smart-loading';
import { useProjectSidebar } from './use-project-sidebar';

const topicSkeletonItemClassName = 'px-4 py-2.5 pl-6';
const memberSkeletonItemClassName = 'flex items-center gap-3 px-4 py-2.5 pl-6';
const emptyTextClassName = 'px-4 text-sm text-gray-400';

const ProjectSidebar = () => {
  const {
    filteredTopics,
    filteredMembers,
    searchValue,
    handleSearchChange,
    searchTarget,
    setSearchTarget,
    handleRefresh,
    isRefreshing,
    isLoading,
  } = useProjectSidebar();
  const { data: session } = useSession(); // 현재 로그인한 사용자 세션

  const showLoading = useSmartLoading(isLoading);

  return (
    <Sidebar
      inputProps={{
        value: searchValue,
        onChange: handleSearchChange,
        placeholder: '검색어를 입력하세요',
      }}
      suffix={
        <SidebarFilter
          value={searchTarget}
          onChange={setSearchTarget}
          items={['topic', 'member']}
        />
      }
    >
      <div className="flex h-full flex-col gap-4">
        <div className="flex min-h-0 flex-[0.4] flex-col">
          <S.SidebarTitle>TOPIC LIST</S.SidebarTitle>
          <div className="scrollbar-hide flex min-h-0 flex-1 overflow-y-auto">
            <S.SidebarList>
              {showLoading ? (
                <>
                  <div className={topicSkeletonItemClassName}>
                    <TextSkeleton width="80%" />
                  </div>
                  <div className={topicSkeletonItemClassName}>
                    <TextSkeleton width="70%" />
                  </div>
                  <div className={topicSkeletonItemClassName}>
                    <TextSkeleton width="75%" />
                  </div>
                </>
              ) : filteredTopics.length > 0 ? (
                filteredTopics.map((topic) => (
                  <SidebarItem
                    isTopic
                    key={topic.id}
                    title={topic.title}
                    href={`/topics/${topic.id}`}
                  />
                ))
              ) : (
                <div className={emptyTextClassName}>
                  토픽이 없습니다
                </div>
              )}
            </S.SidebarList>
          </div>
        </div>

        <div className="h-px w-full bg-gray-200" />

        <div className="flex min-h-0 flex-[0.6] flex-col">
          <S.SidebarTitle>
            MEMBER LIST
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <Image
                src="/refresh.svg"
                width={12}
                height={12}
                alt="refresh"
              />
            </button>
          </S.SidebarTitle>
          <div className="scrollbar-hide flex min-h-0 flex-1 overflow-y-auto">
            <S.SidebarList>
              {showLoading ? (
                <>
                  <div className={memberSkeletonItemClassName}>
                    <CircleSkeleton size="24px" />
                    <TextSkeleton width="60%" />
                  </div>
                  <div className={memberSkeletonItemClassName}>
                    <CircleSkeleton size="24px" />
                    <TextSkeleton width="55%" />
                  </div>
                </>
              ) : filteredMembers.length > 0 ? (
                filteredMembers.map((member) => (
                  <MemberSidebarItem
                    key={member.id}
                    profile={member.image || '/profile.svg'}
                    id={member.id}
                    name={member.name || '익명'}
                    role={member.role}
                    currentUserId={session?.user.id}
                  />
                ))
              ) : (
                <div className={emptyTextClassName}>
                  멤버가 없습니다
                </div>
              )}
            </S.SidebarList>
          </div>
        </div>
      </div>
    </Sidebar>
  );
};

export default ProjectSidebar;


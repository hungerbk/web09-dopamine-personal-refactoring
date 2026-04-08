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
import { cn } from '@/lib/utils/cn';

function SidebarSection({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('flex flex-col h-full gap-4', className)} {...props}>
      {children}
    </div>
  );
}

function TopicSectionWrapper({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('flex-[0.4] min-h-0 flex flex-col', className)} {...props}>
      {children}
    </div>
  );
}

function MemberSectionWrapper({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('flex-[0.6] min-h-0 flex flex-col', className)} {...props}>
      {children}
    </div>
  );
}

function ScrollableSection({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('flex-1 min-h-0 overflow-y-auto scrollbar-hide', className)} {...props}>
      {children}
    </div>
  );
}

function Divider({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('w-full h-px bg-gray-200', className)} {...props} />;
}

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
      <SidebarSection>
        <TopicSectionWrapper>
          <S.SidebarTitle>TOPIC LIST</S.SidebarTitle>
          <ScrollableSection>
            <S.SidebarList>
              {showLoading ? (
                <>
                  <div style={{ padding: '10px 16px 10px 24px' }}>
                    <TextSkeleton width="80%" />
                  </div>
                  <div style={{ padding: '10px 16px 10px 24px' }}>
                    <TextSkeleton width="70%" />
                  </div>
                  <div style={{ padding: '10px 16px 10px 24px' }}>
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
                <div style={{ padding: '16px', color: '#9ca3af', fontSize: '14px' }}>
                  토픽이 없습니다
                </div>
              )}
            </S.SidebarList>
          </ScrollableSection>
        </TopicSectionWrapper>

        <Divider />

        <MemberSectionWrapper>
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
          <ScrollableSection>
            <S.SidebarList>
              {showLoading ? (
                <>
                  <div
                    style={{
                      padding: '10px 16px 10px 24px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <CircleSkeleton size="24px" />
                    <TextSkeleton width="60%" />
                  </div>
                  <div
                    style={{
                      padding: '10px 16px 10px 24px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
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
                <div style={{ padding: '16px', color: '#9ca3af', fontSize: '14px' }}>
                  멤버가 없습니다
                </div>
              )}
            </S.SidebarList>
          </ScrollableSection>
        </MemberSectionWrapper>
      </SidebarSection>
    </Sidebar>
  );
};

export default ProjectSidebar;

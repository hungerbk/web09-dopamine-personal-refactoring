'use client';

import { ReactNode, useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import IssueHeader from '@/issues/components/header/header';
import IssueSidebar from '@/issues/components/layout/issue-sidebar';
import TopicHeader from '@/topics/components/header/topic-header';
import TopicSidebar from '@/topics/components/layout/topic-sidebar';
import {
  SIDEBAR_TOGGLE_BORDER_RADIUS,
  SIDEBAR_TOGGLE_HEIGHT,
  SIDEBAR_TOGGLE_WIDTH,
  SIDEBAR_WIDTH,
} from '@/constants/sidebar';
import ProjectHeader from '@/projects/components/header/header';
import ProjectSidebar from '@/projects/components/sidebar/project-sidebar';

export default function WithSidebarClient({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const getLayout = () => {
    if (pathname?.startsWith('/issue')) {
      return {
        header: <IssueHeader key={pathname} />,
        sidebar: <IssueSidebar />,
      };
    }

    if (pathname?.startsWith('/topic')) {
      return {
        header: <TopicHeader />,
        sidebar: <TopicSidebar />,
      };
    }

    if (pathname?.startsWith('/project')) {
      return {
        header: <ProjectHeader />,
        sidebar: <ProjectSidebar />,
      };
    }

    return {
      header: null,
      sidebar: null,
    };
  };

  const { header, sidebar } = getLayout();

  return (
    <div className="flex flex-col h-screen">
      {header}
      <div className="relative flex flex-1 min-h-0 overflow-hidden">
        {sidebar ? (
          <>
            <div
              className="shrink-0 h-full overflow-hidden bg-transparent transition-[width] duration-200 ease-out"
              style={{ width: isSidebarOpen ? `${SIDEBAR_WIDTH}px` : '0px' }}
            >
              {sidebar}
            </div>
            <button
              type="button"
              aria-label={isSidebarOpen ? '사이드바 접기' : '사이드바 펼치기'}
              className="absolute top-1/2 -translate-y-1/2 flex items-center justify-center p-0 border-none bg-gray-200 text-gray-500 cursor-pointer z-10 border-l border-gray-300 shadow-[1px_0_2px_rgba(0,0,0,0.06)] transition-[left] duration-200 ease-out hover:bg-gray-200 hover:text-gray-600"
              style={{
                left: isSidebarOpen ? `${SIDEBAR_WIDTH}px` : '0px',
                width: `${SIDEBAR_TOGGLE_WIDTH}px`,
                height: `${SIDEBAR_TOGGLE_HEIGHT}px`,
                borderRadius: `0 ${SIDEBAR_TOGGLE_BORDER_RADIUS}px ${SIDEBAR_TOGGLE_BORDER_RADIUS}px 0`,
              }}
              onClick={() => setIsSidebarOpen((prev) => !prev)}
            >
              <Image
                src={isSidebarOpen ? '/chevron-left.svg' : '/chevron-right.svg'}
                alt=""
                width={6}
                height={10}
                aria-hidden
              />
            </button>
          </>
        ) : null}

        <div className="flex flex-1 min-w-0 overflow-x-hidden overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

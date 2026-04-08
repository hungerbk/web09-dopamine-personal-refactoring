'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import HeaderButton from '@/issues/components/header/header-button';
import { useInviteProjectModal } from '@/components/modal/invite-project-modal/use-invite-project-modal';
import { CircleSkeleton, TextSkeleton, TitleSkeleton } from '@/components/skeleton/skeleton';
import { useProjectQuery } from '@/hooks/projects';
import { useSmartLoading } from '@/hooks/use-smart-loading';

const ProjectHeader = () => {
  const params = useParams<{ id: string }>();
  const projectId = params.id;
  const router = useRouter();

  const { data: session, status: sessionStatus } = useSession();
  const { data: projectData, isLoading } = useProjectQuery(projectId || '');
  const showLoading = useSmartLoading(isLoading);
  const showSessionLoading = useSmartLoading(sessionStatus === 'loading');

  const { openInviteProjectModal } = useInviteProjectModal();

  const userName = session?.user?.displayName;
  const userImage = session?.user?.image;

  const handleProfileClick = () => {
    router.push('/mypage');
  };

  return (
    <div className="h-[64px] px-4 bg-white flex justify-between items-center border-b border-gray-200">
      <div className="gap-3 flex text-large font-semibold text-black items-center justify-self-start">
        <Link href={'/project'}>
          <Image
            src="/leftArrow.svg"
            alt="뒤로 가기"
            width={18}
            height={18}
            style={{ cursor: 'pointer' }}
          />
        </Link>
        <div className="h-4 w-px bg-gray-200 mx-1" />
        {showLoading ? <TitleSkeleton width="200px" /> : projectData?.title}
      </div>
      <div className="gap-2 flex items-center justify-self-end mr-2">
        <HeaderButton
          imageSrc="/people.svg"
          alt="팀원 초대"
          text="팀원 초대"
          onClick={(e) => openInviteProjectModal(projectId, projectData?.title || '', e)}
        />
        <div className="h-4 w-px bg-gray-200 mx-1" />
        <div 
          className="flex gap-3 font-semibold items-center cursor-pointer min-w-[92px]"
          onClick={handleProfileClick}
        >
          {showSessionLoading ? (
            <>
              <TextSkeleton width="42px" />
              <CircleSkeleton size="38px" />
            </>
          ) : (
            <>
              {userName}
              {userImage && (
                <Image
                  src={userImage}
                  alt="프로필"
                  width={38}
                  height={38}
                  style={{ borderRadius: '50%' }}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectHeader;

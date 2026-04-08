'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CircleSkeleton, TextSkeleton } from '@/components/skeleton/skeleton';
import { useSmartLoading } from '@/hooks/use-smart-loading';

const ProjectHeader = () => {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const userImage = session?.user?.image;
  const userName = session?.user?.displayName;
  const showSessionLoading = useSmartLoading(sessionStatus === 'loading');

  const handleProfileClick = () => {
    router.push(`/mypage`);
  };

  return (
    <div className="h-[56px] w-full max-w-[1200px] bg-white flex items-center justify-between self-center">
      <div className="flex gap-3 items-center">
        <Link href={'/'}>
          <div className="flex items-center">
            <Image
              src="/home.svg"
              alt="홈으로 가기"
              width={18}
              height={18}
              style={{ cursor: 'pointer' }}
            />
          </div>
        </Link>
        <h1 className="text-xxl font-bold text-black m-0">내 프로젝트</h1>
      </div>
      <div className="flex gap-3 items-center">
        <div 
          className="flex gap-3 font-semibold items-center cursor-pointer"
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

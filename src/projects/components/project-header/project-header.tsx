'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CircleSkeleton, TextSkeleton } from '@/components/skeleton/skeleton';
import { useSmartLoading } from '@/hooks/use-smart-loading';

export default function ProjectHeader() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const userImage = session?.user?.image;
  const userName = session?.user?.displayName;
  const showSessionLoading = useSmartLoading(sessionStatus === 'loading');

  const handleProfileClick = () => {
    router.push(`/mypage`);
  };

  return (
    <div className="flex h-[56px] w-full max-w-[1200px] items-center justify-between self-center bg-white">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="flex items-center"
        >
          <Image
            src="/home.svg"
            alt="홈으로 가기"
            width={18}
            height={18}
          />
        </Link>
        <h1 className="text-xl font-bold text-black m-0">내 프로젝트</h1>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="flex items-center gap-3 font-semibold"
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
                  className="rounded-full"
                />
              )}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

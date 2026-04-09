'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { CircleSkeleton, TextSkeleton, TitleSkeleton } from '@/components/skeleton/skeleton';
import { useTopicDetailQuery } from '@/hooks/topics';
import { useSmartLoading } from '@/hooks/use-smart-loading';
import CreateIssueButton from '../create-issue-button/create-issue-button';
import EditTopicButton from '../edit-topic-button/edit-topic-button';

export default function TopicHeader() {
  const params = useParams();
  const topicId = params.id as string;
  const router = useRouter();

  const { data: session, status: sessionStatus } = useSession();
  const { data: topic, isLoading } = useTopicDetailQuery(topicId);
  const showLoading = useSmartLoading(isLoading);
  const showSessionLoading = useSmartLoading(sessionStatus === 'loading');

  const userName = session?.user?.displayName;
  const userImage = session?.user?.image;

  const handleProfileClick = () => {
    router.push('/mypage');
  };

  return (
    <div className="h-[64px] border-b border-gray-200 bg-white px-4 flex items-center justify-between">
      <div className="flex items-center gap-3 text-large font-semibold text-black">
        <Link href={`/projects/${topic?.projectId || ''}`}>
          <div className="flex items-center">
            <Image
              src="/leftArrow.svg"
              alt="뒤로가기"
              width={18}
              height={18}
            />
          </div>
        </Link>

        <div className="mx-1 h-4 w-px bg-gray-200" />

        {showLoading ? (
          <TitleSkeleton width="180px" />
        ) : (
          <>
            {topic?.title}
            <EditTopicButton
              topicId={topicId}
              currentTitle={topic?.title}
            />
          </>
        )}
      </div>
      <div className="mr-2 flex items-center gap-2 justify-self-end">
        <CreateIssueButton />
        <div className="mx-1 h-4 w-px bg-gray-200" />
        <button
          type="button"
          onClick={handleProfileClick}
          className="flex min-w-[92px] items-center gap-3 font-semibold"
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

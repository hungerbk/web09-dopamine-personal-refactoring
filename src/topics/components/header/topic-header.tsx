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
import { cn } from '@/lib/utils/cn';

function HeaderContainer({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('h-[64px] px-4 bg-white flex items-center justify-between border-b border-gray-200', className)} {...props}>
      {children}
    </div>
  );
}

function LeftSection({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('gap-3 flex text-large font-semibold text-black items-center', className)} {...props}>
      {children}
    </div>
  );
}

function RightSection({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('gap-2 flex items-center justify-self-end mr-2', className)} {...props}>
      {children}
    </div>
  );
}

function Divider({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('h-4 w-px bg-gray-200 mx-1', className)} {...props} />;
}

function Profile({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('flex gap-3 font-semibold items-center cursor-pointer min-w-[92px]', className)} {...props}>
      {children}
    </div>
  );
}

function ButtonsWrapper({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('flex items-center', className)} {...props}>
      {children}
    </div>
  );
}

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
    <HeaderContainer>
      <LeftSection>
        <Link href={`/projects/${topic?.projectId || ''}`}>
          <ButtonsWrapper>
            <Image
              src="/leftArrow.svg"
              alt="뒤로가기"
              width={18}
              height={18}
            />
          </ButtonsWrapper>
        </Link>

        <Divider />

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
      </LeftSection>
      <RightSection>
        <CreateIssueButton />
        <Divider />
        <Profile onClick={handleProfileClick}>
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
        </Profile>
      </RightSection>
    </HeaderContainer>
  );
}

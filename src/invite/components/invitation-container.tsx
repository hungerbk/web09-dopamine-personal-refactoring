'use client';

import { useSession } from 'next-auth/react';
import SocialLogin from '@/components/social-login/social-login';
import { useInvitationMutations } from '@/hooks';
import { cn } from '@/lib/utils/cn';

export function InviteContainer({ fullScreen, className, children, ...props }: React.ComponentProps<'div'> & { fullScreen?: boolean }) {
  return (
    <div
      className={cn(
        'flex items-center justify-center p-4 bg-gray-50',
        fullScreen
          ? 'fixed inset-0 w-full h-full z-[400]'
          : 'min-h-full h-full w-full',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function PostItWrapper({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('relative', className)} {...props}>
      {children}
    </div>
  );
}

export function InviteMain({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'relative w-[380px] p-8 bg-green-100 rounded-large shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function IconWrapper({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('flex justify-center mb-6', className)} {...props}>
      {children}
    </div>
  );
}

export function MessageSection({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('text-center mb-8', className)} {...props}>
      {children}
    </div>
  );
}

export function Title({ children, className, ...props }: React.ComponentProps<'h2'>) {
  return (
    <h2 className={cn('mb-3 text-xl font-bold text-green-700 m-0', className)} {...props}>
      {children}
    </h2>
  );
}

export function Description({ children, className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p className={cn('leading-[1.625] text-medium text-green-800 m-0', className)} {...props}>
      {children}
    </p>
  );
}

export function StrongText({ children, className, ...props }: React.ComponentProps<'strong'>) {
  return (
    <strong className={cn('font-semibold', className)} {...props}>
      {children}
    </strong>
  );
}

export function ButtonGroup({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('flex flex-col items-center gap-3', className)} {...props}>
      {children}
    </div>
  );
}

export function Button({ children, className, ...props }: React.ComponentProps<'button'>) {
  return (
    <button
      className={cn(
        'w-full py-3 px-4 rounded-small font-medium text-medium border-none cursor-pointer transition-all duration-200',
        'bg-green-600 text-white hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] active:scale-[0.98]',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function Shadow({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'absolute inset-0 z-[-1] blur-[4px] opacity-20 bg-green-600 translate-y-1 rotate-[0.5deg]',
        className
      )}
      {...props}
    />
  );
}

interface InvitationInfoResponse {
  isValid: boolean;
  projectId: string;
  projectTitle: string;
  ownerName: string;
  memberCount: number;
}

interface InvitationContainerProps {
  data: InvitationInfoResponse;
  code: string;
}

export function InvitationContainer({ data, code }: InvitationContainerProps) {
  const currentUrl = `/invite?code=${code}`;

  const { data: session } = useSession();
  const { joinProject } = useInvitationMutations(data.projectId);

  const renderJoinButton = () => {
    return (
      <>
        {session ? (
          <Button onClick={() => joinProject.mutate(code)}>참여하기</Button>
        ) : (
          <MessageSection>
            <Description>로그인 후 프로젝트에 참여하세요.</Description>
            <SocialLogin callbackUrl={currentUrl} />
          </MessageSection>
        )}
      </>
    );
  };

  return (
    <InviteContainer fullScreen={true}>
      <PostItWrapper>
        <InviteMain>
          <IconWrapper>
            {/* 프로젝트 아이콘 ?? 로고 (로고 필요함)
            <IconCircle>
            </IconCircle> */}
          </IconWrapper>
          <MessageSection>
            <Title>프로젝트 초대</Title>
            <Description>
              <StrongText>{data?.ownerName}</StrongText>님의{' '}
              <StrongText>{data?.projectTitle}</StrongText> 프로젝트에 초대합니다.
              <br />
              {data?.memberCount}명의 멤버가 참여중입니다.
            </Description>
          </MessageSection>

          <ButtonGroup>{renderJoinButton()}</ButtonGroup>
        </InviteMain>
        <Shadow />
      </PostItWrapper>
    </InviteContainer>
  );
}

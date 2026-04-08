'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import AccountActions from '../account-actions/account-actions';
import LoginInfo from '../login-info/login-info';
import ProfileInfo from '../profile-info/profile-info';
import { cn } from '@/lib/utils/cn';

export function CardContainer({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'w-[512px] bg-white rounded-large overflow-hidden shadow-[0px_4px_40px_0px_rgba(0,0,0,0.05)] flex flex-col pb-[25px]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function TopSection({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'bg-green-700 h-[130px] relative flex justify-center items-end mb-[60px]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function ProfileImageWrapper({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'absolute -bottom-[50px] w-[100px] h-[100px] rounded-full bg-white p-1 flex justify-center items-center shadow-[0px_4px_10px_rgba(0,0,0,0.05)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function ProfileImage({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'w-full h-full rounded-full bg-gray-100 flex justify-center items-center font-bold text-large text-gray-500 overflow-hidden [&>img]:w-full [&>img]:h-full [&>img]:object-cover',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function InfoSection({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('text-center mb-5', className)} {...props}>
      {children}
    </div>
  );
}

export function Name({ children, className, ...props }: React.ComponentProps<'h2'>) {
  return (
    <h2 className={cn('text-xl font-bold text-black mb-[5px]', className)} {...props}>
      {children}
    </h2>
  );
}

export function Email({ children, className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p className={cn('text-medium font-regular text-gray-400', className)} {...props}>
      {children}
    </p>
  );
}

export function ContentSection({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('px-[33px] flex flex-col gap-5', className)} {...props}>
      {children}
    </div>
  );
}

export function Divider({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('h-[1px] bg-gray-100 my-[10px]', className)} {...props} />;
}

export default function MypageCard() {
  const { data: session } = useSession();
  const user = session?.user;
  const profileImage = user?.image;

  return (
    <CardContainer>
      <TopSection>
        <ProfileImageWrapper>
          <ProfileImage>
            {profileImage ? (
              <Image
                src={profileImage}
                alt="프로필"
                width={88}
                height={88}
              />
            ) : (
              'ME'
            )}
          </ProfileImage>
        </ProfileImageWrapper>
      </TopSection>
      <InfoSection>
        <Name>{user?.name || '사용자'}</Name>
        <Email>@{user?.email?.split('@')[0] || 'username'}</Email>
      </InfoSection>
      <ContentSection>
        <ProfileInfo user={user} />
        <LoginInfo />
        <AccountActions />
      </ContentSection>
    </CardContainer>
  );
}

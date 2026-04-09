'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import AccountActions from '../account-actions/account-actions';
import LoginInfo from '../login-info/login-info';
import ProfileInfo from '../profile-info/profile-info';

export default function MypageCard() {
  const { data: session } = useSession();
  const user = session?.user;
  const profileImage = user?.image;

  return (
    <div className="flex w-[512px] flex-col overflow-hidden rounded-large bg-white pb-[25px] shadow-[0px_4px_40px_0px_rgba(0,0,0,0.05)]">
      <div className="relative mb-[60px] flex h-[130px] items-end justify-center bg-green-700">
        <div className="absolute -bottom-[50px] flex h-[100px] w-[100px] items-center justify-center rounded-full bg-white p-1 shadow-[0px_4px_10px_rgba(0,0,0,0.05)]">
          <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-gray-100 text-large font-bold text-gray-500 [&>img]:h-full [&>img]:w-full [&>img]:object-cover">
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
          </div>
        </div>
      </div>
      <div className="mb-5 text-center">
        <h2 className="mb-[5px] text-xxl font-bold text-black">{user?.name || '사용자'}</h2>
        <p className="text-medium font-regular text-gray-400">@{user?.email?.split('@')[0] || 'username'}</p>
      </div>
      <div className="flex flex-col gap-5 px-[33px]">
        <ProfileInfo user={user} />
        <LoginInfo />
        <AccountActions />
      </div>
    </div>
  );
}

'use client';

import { useSession } from 'next-auth/react';
import SocialLogin from '@/components/social-login/social-login';
import { useInvitationMutations } from '@/hooks';

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

  return (
    <div className="fixed inset-0 z-modal flex h-full w-full items-center justify-center bg-gray-50 p-4">
      <div className="relative">
        <div className="relative w-[380px] rounded-large bg-green-100 p-8 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)]">
          <div className="mb-6 flex justify-center">
            {/* 프로젝트 아이콘 ?? 로고 (로고 필요함)
            <IconCircle>
            </IconCircle> */}
          </div>
          <div className="mb-8 text-center">
            <h2 className="m-0 mb-3 text-xxl font-bold text-green-700">프로젝트 초대</h2>
            <p className="m-0 text-medium leading-[1.625] text-green-800">
              <strong className="font-semibold">{data?.ownerName}</strong>님의{' '}
              <strong className="font-semibold">{data?.projectTitle}</strong> 프로젝트에 초대합니다.
              <br />
              {data?.memberCount}명의 멤버가 참여중입니다.
            </p>
          </div>

          <div className="flex flex-col items-center gap-3">
            {session ? (
              <button
                onClick={() => joinProject.mutate(code)}
                className="w-full rounded-small border-none bg-green-600 px-4 py-3 text-medium font-medium text-white transition-all duration-200 hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] active:scale-[0.98]"
              >
                참여하기
              </button>
            ) : (
              <div className="mb-8 text-center">
                <p className="m-0 text-medium leading-[1.625] text-green-800">로그인 후 프로젝트에 참여하세요.</p>
                <SocialLogin callbackUrl={currentUrl} />
              </div>
            )}
          </div>
        </div>
        <div className="absolute inset-0 z-hide translate-y-1 rotate-[0.5deg] bg-green-600 opacity-20 blur-[4px]" />
      </div>
    </div>
  );
}

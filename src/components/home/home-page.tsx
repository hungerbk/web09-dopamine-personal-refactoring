'use client';

import { Session } from 'next-auth';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Background from '@/components/background/background';
import CreateIssueModal from '@/components/modal/issue-create-modal/issue-create-modal';
import { useModalStore } from '@/components/modal/use-modal-store';
import SocialLogin from '../social-login/social-login';

interface HomePageProps {
  session: Session | null;
}

export default function HomePage({ session }: HomePageProps) {
  const router = useRouter();
  const { openModal } = useModalStore();

  const handleStart = () => {
    openModal({
      title: '이슈 생성',
      content: <CreateIssueModal />,
      closeOnOverlayClick: true,
      hasCloseButton: true,
    });
  };

  const handleGoToProject = () => {
    if (session) {
      router.push('/project');
      return;
    }
  };

  const renderProjectOrSocialLogin = () => {
    return (
      <>
        {session ? (
          <button
            onClick={handleGoToProject}
            className="h-[60px] w-[200px] rounded-[16px] bg-blue-500 text-[24px] font-semibold text-white"
          >
            프로젝트로 이동
          </button>
        ) : (
          <SocialLogin />
        )}
      </>
    );
  };

  return (
    <>
      <Background />
      <div className="flex h-full min-w-[650px] w-full flex-col items-center justify-center gap-6">
        <div className="flex flex-row items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-gradient-to-br from-green-600 to-emerald-600 text-[20px] font-bold text-white shadow-[0_10px_15px_-3px_#bbf7d0,0_4px_6px_-4px_#bbf7d0]">
            M
          </div>
          <p className="text-[24px] font-bold leading-8">Murphy</p>
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <h1 className="whitespace-nowrap text-[90px] font-extrabold leading-[96px]">
            발산은 <span className="text-blue-500">자유롭게</span>,
          </h1>
          <h1 className="whitespace-nowrap text-[90px] font-extrabold leading-[96px]">
            수렴은 <span className="text-green-600">확실하게</span>
            <Image
              src={'/check.svg'}
              alt="check"
              width={35}
              height={35}
              style={{ position: 'relative', top: -50 }}
            />
          </h1>
        </div>
        <div className="flex flex-col items-center justify-center gap-2 text-gray-600">
          <p className="text-[24px] font-bold leading-8">
            아이디어 브레인스토밍부터 의사결정까지,{' '}
            <span className="bg-green-50 text-black">Murphy</span>
            가 가장 스마트한
          </p>
          <p className="text-[24px] font-bold leading-8">길을 안내합니다.</p>
        </div>
        <div className="mt-[10px] flex flex-col items-center justify-center gap-10">
          {renderProjectOrSocialLogin()}
          <button
            onClick={handleStart}
            className="h-[60px] w-[200px] rounded-[16px] bg-green-600 text-[24px] font-semibold text-white"
          >
            빠르게 시작하기
          </button>
        </div>
      </div>
    </>
  );
}

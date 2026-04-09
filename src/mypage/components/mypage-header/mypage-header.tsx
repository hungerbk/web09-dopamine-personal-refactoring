'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function MypageHeader() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="relative flex h-[64px] items-center justify-center border-b border-gray-100 bg-white px-4">
      <button
        onClick={handleBack}
        className="absolute left-6 top-1/2 flex -translate-y-1/2 items-center justify-center gap-1 border-none bg-transparent"
      >
        <Image
          src="/leftArrow.svg"
          alt="뒤로가기"
          width={18}
          height={18}
        />
        <span className="text-medium font-bold text-gray-400">돌아가기</span>
      </button>
      <h1 className="m-0 text-center text-xl font-bold text-black">내 프로필</h1>
    </div>
  );
}

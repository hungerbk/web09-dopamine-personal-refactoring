'use client';

interface VoteResultProps {
  participants: number;
  totalVotes: number;
  maxCommentCount: number;
};

export default function VoteResult({ participants, totalVotes, maxCommentCount }: VoteResultProps) {
  return (
    <div className="flex h-full flex-col gap-4 p-[30px]">
      <span className="text-[20px] font-semibold text-black">투표 결과</span>
      <div className="flex h-full w-full flex-col justify-center gap-2.5 rounded-medium py-5">
        <div className="flex items-center justify-between px-5 py-4">
          <span className="text-medium font-regular text-gray-700">참여자</span>
          <span className="text-medium font-bold text-black">{participants}명</span>
        </div>
        <div className="h-px w-full bg-gray-200" />
        <div className="flex items-center justify-between px-5 py-4">
          <span className="text-medium font-regular text-gray-700">총 투표수</span>
          <span className="text-medium font-bold text-green-600">{totalVotes}표</span>
        </div>
        <div className="h-px w-full bg-gray-200" />
        <div className="flex items-center justify-between px-5 py-4">
          <span className="text-medium font-regular text-gray-700">최다 댓글</span>
          <span className="text-medium font-bold text-black">{maxCommentCount}개</span>
        </div>
      </div>
    </div>
  );
}

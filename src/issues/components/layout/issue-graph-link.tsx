import Image from 'next/image';

interface IssueGraphLinkProps {
  onClick: () => void;
}

export default function IssueGraphLink({ onClick }: IssueGraphLinkProps) {
  return (
    <div
      onClick={onClick}
      className="my-2 flex px-4"
    >
      <a
        href="#"
        className="flex w-full items-center justify-center gap-2 rounded-small bg-green-600 py-2 text-medium font-bold text-white no-underline shadow-[0_4px_4px_-1px_rgba(0,0,0,0.2)]"
      >
        <Image
          src="/map.svg"
          alt="지도 이미지"
          width={16}
          height={16}
        />
        이슈 맵 보기
      </a>
    </div>
  );
}

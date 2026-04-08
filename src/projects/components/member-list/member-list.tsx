import Image from 'next/image';

interface Member {
  id: number;
  name: string;
  profileImage?: string;
  isOwner?: boolean;
}

interface MemberListProps {
  members: Member[];
}

const MemberList = ({ members }: MemberListProps) => {
  return (
    <div className="scrollbar-hide flex flex-col gap-2 overflow-y-auto">
      {members.map((member) => (
        <div
          key={member.id}
          className="flex cursor-pointer items-center gap-3 rounded-medium bg-gray-50 px-3 py-2.5 transition-all duration-200 ease-in-out hover:translate-x-1 hover:bg-gray-100"
        >
          <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full transition-colors duration-200 ease-in-out">
            <Image
              src={member.profileImage || '/profile.svg'}
              alt={`${member.name} 프로필`}
              width={36}
              height={36}
            />
          </div>
          <div className="flex flex-1 items-center gap-2">
            <span className="text-medium font-medium text-gray-800">{member.name}</span>
            {member.isOwner && (
              <div className="flex items-center gap-1 rounded-small bg-yellow-100 px-2 py-[2px]">
                <Image
                  src="/yellow-crown.svg"
                  alt="팀장"
                  width={14}
                  height={14}
                />
                <span className="text-xs font-bold text-yellow-700">팀장</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MemberList;

import Image from 'next/image';
import { cn } from '@/lib/utils/cn';

export function MemberListContainer({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('flex flex-col gap-2 overflow-y-auto scrollbar-hide', className)} {...props}>
      {children}
    </div>
  );
}

export function MemberItem({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 py-2.5 px-3 rounded-medium bg-gray-50 cursor-pointer transition-all duration-200 ease-in-out hover:bg-gray-100 hover:translate-x-1',
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
        'w-9 h-9 rounded-full overflow-hidden shrink-0 transition-colors duration-200 ease-in-out',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function MemberInfo({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('flex items-center gap-2 flex-1', className)} {...props}>
      {children}
    </div>
  );
}

export function MemberName({ children, className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span className={cn('text-medium font-medium text-gray-800', className)} {...props}>
      {children}
    </span>
  );
}

export function OwnerBadge({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('flex items-center gap-1 py-[2px] px-2 bg-yellow-100 rounded-small', className)} {...props}>
      {children}
    </div>
  );
}

export function OwnerText({ children, className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span className={cn('text-xs font-bold text-yellow-700', className)} {...props}>
      {children}
    </span>
  );
}

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
    <MemberListContainer>
      {members.map((member) => (
        <MemberItem key={member.id}>
          <ProfileImageWrapper>
            <Image
              src={member.profileImage || '/profile.svg'}
              alt={`${member.name} 프로필`}
              width={36}
              height={36}
            />
          </ProfileImageWrapper>
          <MemberInfo>
            <MemberName>{member.name}</MemberName>
            {member.isOwner && (
              <OwnerBadge>
                <Image
                  src="/yellow-crown.svg"
                  alt="팀장"
                  width={14}
                  height={14}
                />
                <OwnerText>팀장</OwnerText>
              </OwnerBadge>
            )}
          </MemberInfo>
        </MemberItem>
      ))}
    </MemberListContainer>
  );
};

export default MemberList;

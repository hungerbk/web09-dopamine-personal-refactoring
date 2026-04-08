import Image from 'next/image';
import { StringifyOptions } from 'querystring';
import { MEMBER_ROLE } from '@/constants/issue';
import { cn } from '@/lib/utils/cn';
import * as S from './sidebar';
import { useMemberNicknameEdit } from './use-member-nickname-edit';

export function MemberItemButton({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex flex-row flex-nowrap items-center justify-between w-full py-[10px] pr-4 pl-6 bg-white text-medium text-gray-700 border-none no-underline hover:bg-gray-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function NameContainer({ isConnected, children, className, ...props }: React.ComponentProps<'div'> & { isConnected?: boolean }) {
  return (
    <div
      className={cn('flex gap-2 items-center justify-center', isConnected === false && 'text-gray-400', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CurrentUserLabel({ children, className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      className={cn(
        'flex items-center justify-center py-[2px] px-2 text-xs font-semibold leading-none text-green-600 bg-green-100 border border-green-600 rounded-large',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function StatusLabel({ isConnected, className, ...props }: React.ComponentProps<'div'> & { isConnected?: boolean }) {
  return (
    <div
      className={cn('rounded-full w-2 h-2', isConnected ? 'bg-green-600' : 'bg-gray-400', className)}
      {...props}
    />
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

export function EditInput({ className, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      className={cn(
        'py-1 px-2 text-medium border border-gray-300 rounded-small w-[120px] focus:outline-none focus:border-green-600',
        className
      )}
      {...props}
    />
  );
}

export function IconButton({ children, className, ...props }: React.ComponentProps<'button'>) {
  return (
    <button
      className={cn(
        'flex items-center justify-center p-1 bg-transparent border-none cursor-pointer text-gray-500 rounded-small hover:bg-gray-200 hover:text-gray-900',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function ActionContainer({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('flex items-center gap-1 ml-auto', className)} {...props}>
      {children}
    </div>
  );
}

interface MemberSidebarItemProps {
  profile?: string;
  id: string;
  name: string;
  role: typeof MEMBER_ROLE.OWNER | typeof MEMBER_ROLE.MEMBER;
  isConnected?: boolean;
  currentUserId?: string;
  issueId?: string;
  isQuickIssue?: boolean;
}

export default function MemberSidebarItem({
  id,
  name,
  profile,
  role,
  isConnected,
  currentUserId,
  issueId,
  isQuickIssue,
}: MemberSidebarItemProps) {
  const isCurrentUser = currentUserId === id;

  // 이슈 페이지 여부
  const isIssuePage = !!issueId;

  const showNameLength = isQuickIssue ? 12 : 7;

  const isProjectOwner = role === MEMBER_ROLE.OWNER && profile;
  const isIssueOwner = role === MEMBER_ROLE.OWNER && !profile;

  const {
    isEditing,
    editName,
    setEditName,
    startEditing,
    cancelEditing,
    saveEditing,
    handleKeyDown,
  } = useMemberNicknameEdit({
    issueId,
    userId: id,
    initialName: name,
  });

  return (
    <S.SidebarListItem>
      <MemberItemButton>
        <NameContainer isConnected={isConnected}>
          {isIssueOwner && (
            <Image
              src="/yellow-crown.svg"
              alt="owner"
              width={18}
              height={18}
            />
          )}
          {profile && (
            <Image
              src={profile}
              alt="profile"
              width={24}
              height={24}
              style={{ borderRadius: '50%' }}
            />
          )}

          {isEditing ? (
            <EditInput
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={handleKeyDown}
              onBlur={() => cancelEditing()}
              autoFocus
            />
          ) : (
            <span>
              {name.length > showNameLength ? name.slice(0, showNameLength) + '...' : name}
            </span>
          )}

          {!isIssuePage && isCurrentUser && <CurrentUserLabel>me</CurrentUserLabel>}

          {isCurrentUser && isIssuePage && (
            <ActionContainer>
              {isEditing ? (
                <>
                  <IconButton
                    onClick={saveEditing}
                    onMouseDown={(e) => e.preventDefault()}
                    title="저장"
                  >
                    저장
                  </IconButton>
                </>
              ) : (
                <IconButton
                  onClick={startEditing}
                  title="닉네임 수정"
                >
                  <Image
                    src="/edit-gray.svg"
                    alt="닉네임 수정"
                    width={14}
                    height={14}
                  />
                </IconButton>
              )}
            </ActionContainer>
          )}

          {isProjectOwner && !isEditing && (
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
        </NameContainer>
        {isConnected !== undefined && <StatusLabel isConnected={isConnected} />}
      </MemberItemButton>
    </S.SidebarListItem>
  );
}

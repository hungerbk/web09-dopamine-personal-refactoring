import Image from 'next/image';
import { MEMBER_ROLE } from '@/constants/issue';
import { cn } from '@/lib/utils/cn';
import * as S from './sidebar';
import { useMemberNicknameEdit } from './use-member-nickname-edit';

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
      <div className="flex w-full flex-row flex-nowrap items-center justify-between border-none bg-white py-[10px] pl-6 pr-4 text-medium text-gray-700 no-underline hover:bg-gray-200">
        <div className={cn('flex items-center justify-center gap-2', isConnected === false && 'text-gray-400')}>
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
            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={handleKeyDown}
              onBlur={() => cancelEditing()}
              autoFocus
              className="w-[120px] rounded-small border border-gray-300 px-2 py-1 text-medium focus:border-green-600 focus:outline-none"
            />
          ) : (
            <span>
              {name.length > showNameLength ? name.slice(0, showNameLength) + '...' : name}
            </span>
          )}

          {!isIssuePage && isCurrentUser && (
            <span className="flex items-center justify-center rounded-large border border-green-600 bg-green-100 px-2 py-[2px] text-xs font-semibold leading-none text-green-600">
              me
            </span>
          )}

          {isCurrentUser && isIssuePage && (
            <div className="ml-auto flex items-center gap-1">
              {isEditing ? (
                <>
                  <button
                    onClick={saveEditing}
                    onMouseDown={(e) => e.preventDefault()}
                    title="저장"
                    className="flex items-center justify-center rounded-small border-none bg-transparent p-1 text-gray-500 hover:bg-gray-200 hover:text-gray-900"
                  >
                    저장
                  </button>
                </>
              ) : (
                <button
                  onClick={startEditing}
                  title="닉네임 수정"
                  className="flex items-center justify-center rounded-small border-none bg-transparent p-1 text-gray-500 hover:bg-gray-200 hover:text-gray-900"
                >
                  <Image
                    src="/edit-gray.svg"
                    alt="닉네임 수정"
                    width={14}
                    height={14}
                  />
                </button>
              )}
            </div>
          )}

          {isProjectOwner && !isEditing && (
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
        {isConnected !== undefined && (
          <div className={cn('h-2 w-2 rounded-full', isConnected ? 'bg-green-600' : 'bg-gray-400')} />
        )}
      </div>
    </S.SidebarListItem>
  );
}

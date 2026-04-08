'use client';

import { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useInviteProjectModal } from '@/components/modal/invite-project-modal/use-invite-project-modal';
import { useModalStore } from '@/components/modal/use-modal-store';
import { useDeleteProjectMutation, useLeaveProjectMutation } from '@/hooks/projects';
import { ProjectMember } from '@/projects/types';
import ProjectCreateModal from '../project-create-modal/project-create-modal';
import { cn } from '@/lib/utils/cn';

function BaseCard({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'bg-white rounded-large p-6 cursor-pointer transition-all duration-200 ease-in-out min-h-[240px] hover:shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function Card({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <BaseCard
      className={cn('flex flex-col justify-between gap-5 border border-gray-200 relative', className)}
      {...props}
    >
      {children}
    </BaseCard>
  );
}

function CardHeader({
  hasIcon,
  children,
  className,
  ...props
}: React.ComponentProps<'div'> & { hasIcon?: boolean }) {
  return (
    <div className={cn('flex flex-col gap-5', hasIcon ? 'pt-0' : 'pt-5', className)} {...props}>
      {children}
    </div>
  );
}

function Icon({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'w-12 h-12 flex items-center justify-center bg-blue-50 rounded-medium',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function Title({ children, className, ...props }: React.ComponentProps<'h3'>) {
  return (
    <h3 className={cn('text-large font-bold text-black m-0', className)} {...props}>
      {children}
    </h3>
  );
}

function Info({ children, className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p className={cn('text-medium font-regular text-gray-400 m-0', className)} {...props}>
      {children}
    </p>
  );
}

function CardFooter({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('flex flex-col gap-5', className)} {...props}>
      {children}
    </div>
  );
}

function Divider({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('w-full h-px bg-gray-200', className)} {...props} />;
}

function CardBody({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('flex flex-row items-center justify-between', className)} {...props}>
      {children}
    </div>
  );
}

function MemberAvatars({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('flex flex-row flex-nowrap items-center', className)} {...props}>
      {children}
    </div>
  );
}

function MemberAvatar({ className, ...props }: React.ComponentProps<typeof Image>) {
  return (
    <Image
      className={cn('rounded-full border-2 border-white [&:not(:first-of-type)]:-ml-2', className)}
      {...props}
    />
  );
}

function RestCount({ children, className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span className={cn('text-medium font-regular text-gray-400 ml-1', className)} {...props}>
      {children}
    </span>
  );
}

function AddMember({ children, className, ...props }: React.ComponentProps<'button'>) {
  return (
    <button
      className={cn(
        'text-small font-bold text-green-600 bg-transparent border-none p-1 cursor-pointer text-left hover:text-green-700',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

function CreateCard({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <BaseCard
      className={cn(
        'flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 min-h-[240px] hover:border-gray-400',
        className
      )}
      {...props}
    >
      {children}
    </BaseCard>
  );
}

function CreateIcon({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('text-[40px] text-gray-300', className)} {...props}>
      {children}
    </div>
  );
}

function CreateText({ children, className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p className={cn('text-medium text-gray-300 m-0 font-bold', className)} {...props}>
      {children}
    </p>
  );
}

function MenuWrapper({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('absolute top-6 right-6 z-10', className)} {...props}>
      {children}
    </div>
  );
}

function ActionButton({ children, className, ...props }: React.ComponentProps<'button'>) {
  return (
    <button
      className={cn('cursor-pointer bg-transparent rounded-small p-1 flex hover:bg-gray-100 border-none', className)}
      {...props}
    >
      {children}
    </button>
  );
}

function MenuModal({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'absolute top-6 right-0 min-w-[120px] p-2 bg-white border border-gray-200 rounded-medium shadow-[0px_4px_12px_rgba(0,0,0,0.08)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function MenuItem({ children, className, ...props }: React.ComponentProps<'button'>) {
  return (
    <button
      className={cn(
        'relative w-full py-2 px-2.5 bg-transparent border-none rounded-small text-left cursor-pointer text-red-600 hover:bg-gray-50 group',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

function Tooltip({ children, className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      className={cn(
        'absolute right-0 top-full mt-1.5 py-1.5 px-2 bg-gray-900 text-white rounded-small text-small whitespace-nowrap opacity-0 -translate-y-1 pointer-events-none transition-all duration-150 ease-in-out group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

interface ProjectCardProps {
  id?: string;
  title?: string;
  icon?: string;
  memberCount?: number;
  isCreateCard?: boolean;
  ownerId?: string | null;
  members?: ProjectMember[];
}

export function ProjectCard({
  id,
  title,
  icon,
  memberCount = 0,
  isCreateCard = false,
  ownerId,
  members,
}: ProjectCardProps) {
  const { data: session } = useSession();
  const { openModal } = useModalStore();
  const router = useRouter();
  const { mutate: deleteProject } = useDeleteProjectMutation();
  const { mutate: leaveProject } = useLeaveProjectMutation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const suppressNextClickRef = useRef(false);

  const MAX_VISIBLE_COUNT = 5;
  const restCount = memberCount - MAX_VISIBLE_COUNT;

  const isOwner = session?.user?.id === ownerId;
  const { openInviteProjectModal } = useInviteProjectModal();

  const handleCreateClick = () => {
    openModal({
      title: '새 프로젝트 만들기',
      content: <ProjectCreateModal />,
      hasCloseButton: true,
    });
  };

  const handleGoProject = () => {
    if (suppressNextClickRef.current) {
      suppressNextClickRef.current = false;
      return;
    }
    if (isMenuOpen) {
      setIsMenuOpen(false);
      return;
    }
    router.push(`/projects/${id}`);
  };

  useEffect(() => {
    if (!isMenuOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        suppressNextClickRef.current = true;
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen((prev) => !prev);
  };

  if (isCreateCard) {
    return (
      <CreateCard onClick={handleCreateClick}>
        <CreateIcon>+</CreateIcon>
        <CreateText>새 프로젝트 만들기</CreateText>
      </CreateCard>
    );
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    if (
      confirm(
        '프로젝트를 삭제하면 모든 토픽, 이슈, 멤버 정보도 같이 삭제됩니다.\n정말 삭제하시겠습니까?',
      )
    ) {
      if (id) {
        deleteProject(
          { id },
          {
            onSuccess: () => {
              toast.success('프로젝트가 삭제되었습니다.');
              router.refresh();
            },
            onError: () => {
              toast.error('프로젝트 삭제에 실패했습니다.');
            },
          },
        );
      }
    }
  };

  const handleLeaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    const memberId = session?.user?.id;
    if (!memberId) {
      toast.error('로그인이 필요합니다.');
      return;
    }
    if (confirm('프로젝트에서 나가시겠습니까?')) {
      if (id) {
        leaveProject(
          { projectId: id, memberId },
          {
            onSuccess: () => {
              toast.success('프로젝트에서 나갔습니다.');
            },
            onError: () => {
              toast.error('프로젝트 나가기 실패했습니다.');
            },
          },
        );
      }
    }
  };

  return (
    <Card onClick={handleGoProject}>
      <MenuWrapper ref={menuRef}>
        <ActionButton
          onClick={handleMenuToggle}
          type="button"
        >
          <Image
            src="/hamburger.svg"
            alt="메뉴 열기"
            width={20}
            height={20}
          />
        </ActionButton>
        {isMenuOpen && (
          <MenuModal onClick={(e) => e.stopPropagation()}>
            {isOwner ? (
              <MenuItem
                onClick={handleDeleteClick}
                type="button"
              >
                삭제
                <Tooltip role="tooltip">삭제하면 복구할 수 없습니다</Tooltip>
              </MenuItem>
            ) : (
              <MenuItem
                onClick={handleLeaveClick}
                type="button"
              >
                나가기
              </MenuItem>
            )}
          </MenuModal>
        )}
      </MenuWrapper>
      <CardHeader hasIcon={!!icon}>
        {icon && <Icon>{icon}</Icon>}
        <Title>{title}</Title>
        <Info>멤버 {memberCount}명</Info>
      </CardHeader>
      <CardFooter>
        <Divider />
        <CardBody>
          <MemberAvatars>
            {members?.slice(0, MAX_VISIBLE_COUNT).map((member, index) => {
              if (!member.user) return null;
              return (
                <MemberAvatar
                  key={member.user.id ?? `member-${index}`}
                  src={member.user.image ?? '/profile.svg'}
                  alt={`${member.user.displayName || '사용자'}의 프로필 이미지`}
                  width={32}
                  height={32}
                />
              );
            })}
            {restCount > 0 && <RestCount>+{restCount}</RestCount>}
          </MemberAvatars>
          <AddMember onClick={(e) => openInviteProjectModal(id!, title!, e)}>
            + 초대하기
          </AddMember>
        </CardBody>
      </CardFooter>
    </Card>
  );
}

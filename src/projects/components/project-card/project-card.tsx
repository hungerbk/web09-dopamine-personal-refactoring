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
      <div
        onClick={handleCreateClick}
        className="flex min-h-[240px] cursor-pointer flex-col items-center justify-center gap-2 rounded-large border-2 border-dashed border-gray-200 bg-white p-6 transition-all duration-200 ease-in-out hover:border-gray-400 hover:shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
      >
        <div className="text-[40px] text-gray-300">+</div>
        <p className="m-0 text-medium font-bold text-gray-300">새 프로젝트 만들기</p>
      </div>
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
          },
        );
      }
    }
  };

  return (
    <div
      onClick={handleGoProject}
      className="relative flex min-h-[240px] cursor-pointer flex-col justify-between gap-5 rounded-large border border-gray-200 bg-white p-6 transition-all duration-200 ease-in-out hover:shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
    >
      <div
        ref={menuRef}
        className="absolute right-6 top-6 z-10"
      >
        <button
          onClick={handleMenuToggle}
          type="button"
          className="flex cursor-pointer rounded-small border-none bg-transparent p-1 hover:bg-gray-100"
        >
          <Image
            src="/hamburger.svg"
            alt="메뉴 열기"
            width={20}
            height={20}
          />
        </button>
        {isMenuOpen && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute right-0 top-6 min-w-[120px] rounded-medium border border-gray-200 bg-white p-2 shadow-[0px_4px_12px_rgba(0,0,0,0.08)]"
          >
            {isOwner ? (
              <button
                onClick={handleDeleteClick}
                type="button"
                className="group relative w-full cursor-pointer rounded-small border-none bg-transparent px-2.5 py-2 text-left text-red-600 hover:bg-gray-50"
              >
                삭제
                <span
                  role="tooltip"
                  className="pointer-events-none absolute right-0 top-full mt-1.5 -translate-y-1 whitespace-nowrap rounded-small bg-gray-900 px-2 py-1.5 text-small text-white opacity-0 transition-all duration-150 ease-in-out group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100"
                >
                  삭제하면 복구할 수 없습니다
                </span>
              </button>
            ) : (
              <button
                onClick={handleLeaveClick}
                type="button"
                className="group relative w-full cursor-pointer rounded-small border-none bg-transparent px-2.5 py-2 text-left text-red-600 hover:bg-gray-50"
              >
                나가기
              </button>
            )}
          </div>
        )}
      </div>
      <div className={cn('flex flex-col gap-5', icon ? 'pt-0' : 'pt-5')}>
        {icon && <div className="flex h-12 w-12 items-center justify-center rounded-medium bg-blue-50">{icon}</div>}
        <h3 className="m-0 text-large font-bold text-black">{title}</h3>
        <p className="m-0 text-medium font-regular text-gray-400">멤버 {memberCount}명</p>
      </div>
      <div className="flex flex-col gap-5">
        <div className="h-px w-full bg-gray-200" />
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row flex-nowrap items-center">
            {members?.slice(0, MAX_VISIBLE_COUNT).map((member, index) => {
              if (!member.user) return null;
              return (
                <Image
                  key={member.user.id ?? `member-${index}`}
                  src={member.user.image ?? '/profile.svg'}
                  alt={`${member.user.displayName || '사용자'}의 프로필 이미지`}
                  width={32}
                  height={32}
                  className="rounded-full border-2 border-white [&:not(:first-of-type)]:-ml-2"
                />
              );
            })}
            {restCount > 0 && <span className="ml-1 text-medium font-regular text-gray-400">+{restCount}</span>}
          </div>
          <button
            onClick={(e) => openInviteProjectModal(id!, title!, e)}
            className="cursor-pointer border-none bg-transparent p-1 text-left text-small font-bold text-green-600 hover:text-green-700"
          >
            + 초대하기
          </button>
        </div>
      </div>
    </div>
  );
}

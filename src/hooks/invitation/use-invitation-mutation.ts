import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { CLIENT_ERROR_MESSAGES } from '@/constants/error-messages';
import { acceptInvitation, createInvitation } from '@/lib/api/invitation';

export const useInvitationMutations = (projectId: string) => {
  const router = useRouter();

  const createToken = useMutation({
    meta: { errorLabel: '초대 링크 생성 실패', errorMessage: '초대 링크를 생성할 수 없습니다.' },
    mutationFn: (emails: string[]) => createInvitation(projectId, emails),
  });

  const joinProject = useMutation({
    meta: { errorLabel: '초대 참여 실패' },
    mutationFn: (token: string) => acceptInvitation(projectId, token),

    onSuccess: () => {
      toast.success('프로젝트에 참여합니다!');
      router.push(`/projects/${projectId}`);
    },

    onError: (err) => {
      if (err.message === CLIENT_ERROR_MESSAGES['ALREADY_EXISTED']) {
        router.push(`/projects/${projectId}`);
      }
    },
  });

  return { createToken, joinProject };
};

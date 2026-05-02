import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useSseConnectionStore } from '@/issues/store/use-sse-connection-store';
import { generateNickname, joinIssue, updateIssueMemberNickname } from '@/lib/api/issue';
import { setUserIdForIssue } from '@/lib/storage/issue-user-storage';

export const useIssueMemberMutations = (issueId: string) => {
  const queryClient = useQueryClient();
  const queryKey = ['issues', issueId, 'members'];
  const connectionId = useSseConnectionStore((state) => state.connectionIds[issueId]);

  const create = useMutation({
    meta: { errorLabel: '이슈 참여 실패' },
    mutationFn: async (nickname: string) => await joinIssue(issueId, nickname, connectionId),

    onSuccess: (issueMember) => {
      setUserIdForIssue(issueId, issueMember.userId);
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return { join: create };
};

export const useNicknameMutations = (issueId: string) => {
  const create = useMutation({
    meta: { errorLabel: '닉네임 생성 실패' },
    mutationFn: () => generateNickname(issueId),
  });

  return { generate: create };
};

export const useUpdateNicknameMutation = (issueId: string, userId: string) => {
  const queryClient = useQueryClient();
  const queryKey = ['issues', issueId, 'members'];

  const update = useMutation({
    meta: { errorLabel: '닉네임 수정 실패', disableGlobalToast: true },
    mutationFn: (nickname: string) => updateIssueMemberNickname(issueId, userId, nickname),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success('닉네임이 수정되었습니다.');
    },

    onError: (error) => {
      if (error.message === 'NICKNAME_ALREADY_EXISTS') {
        toast.error('이미 존재하는 닉네임입니다.');
      } else {
        toast.error('닉네임 수정에 실패했습니다.');
      }
    },
  });

  return { update };
};

import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useSseConnectionStore } from '@/issues/store/use-sse-connection-store';
import { ISSUE_STATUS, STEP_FLOW } from '@/constants/issue';
import {
  createIssueInTopic,
  createQuickIssue,
  deleteIssue,
  updateIssueStatus,
  updateIssueTitle,
} from '@/lib/api/issue';
import { setUserIdForIssue } from '@/lib/storage/issue-user-storage';
import { IssueStatus } from '@/issues/types';
import { queryKeys } from '@/lib/query-keys';

interface DbIssue {
  id: string;
  status: IssueStatus;
  topicId?: string;
}

export const useQuickStartMutation = () => {
  return useMutation({
    meta: { errorLabel: '이슈 시작 실패' },
    mutationFn: (data: { title: string; nickname: string }) =>
      createQuickIssue(data.title, data.nickname),

    onSuccess: (newIssue) => {
      // 이슈별로 userId 저장
      setUserIdForIssue(newIssue.issueId, newIssue.userId);
    },
  });
};

export const useIssueStatusMutations = (issueId: string) => {
  const queryClient = useQueryClient();
  const queryKey = queryKeys.issues.detail(issueId);
  const connectionId = useSseConnectionStore((state) => state.connectionIds[issueId]);

  const update = useMutation({
    meta: { errorLabel: '이슈 상태 변경 실패' },
    mutationFn: async (nextStatus: IssueStatus) => {
      await updateIssueStatus(issueId, nextStatus, undefined, undefined, connectionId);
      return nextStatus;
    },

    onMutate: async (nextStatus) => {
      await queryClient.cancelQueries({ queryKey });

      const previousIssue = queryClient.getQueryData<DbIssue>(queryKey);

      if (previousIssue) {
        queryClient.setQueryData<DbIssue>(queryKey, {
          ...previousIssue,
          status: nextStatus,
        });
      }
      return { previousIssue };
    },

    onError: (_err, _variables, context) => {
      if (context?.previousIssue) {
        queryClient.setQueryData(queryKey, context.previousIssue);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const close = useMutation({
    meta: { errorLabel: '이슈 종료 실패' },
    mutationFn: async () => {
      await updateIssueStatus(issueId, ISSUE_STATUS.CLOSE, undefined, undefined, connectionId);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success('이슈가 종료되었습니다.');
    },
  });

  // 다음 단계 계산
  const handleNextStep = () => {
    const issue = queryClient.getQueryData<DbIssue>(queryKey);
    if (!issue) return;

    const currentIndex = STEP_FLOW.indexOf(issue.status);
    const nextStatus = STEP_FLOW[currentIndex + 1];

    // 계산된 값을 넘기면서 뮤테이션 실행
    if (nextStatus) {
      update.mutate(nextStatus);
    }
  };

  return { nextStep: handleNextStep, close };
};

export const useCreateIssueInTopicMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    meta: { errorLabel: '이슈 생성 실패', errorMessage: '이슈 생성에 실패했습니다.' },
    mutationFn: (data: { topicId: string; title: string }) =>
      createIssueInTopic(data.topicId, data.title),

    onSuccess: (newIssue, variables) => {
      // 토픽의 이슈 목록 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: queryKeys.topics.issues(variables.topicId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.topics.nodes(variables.topicId),
      });
      toast.success('이슈가 생성되었습니다!');
    },
  });
};

export const useUpdateIssueTitleMutation = (issueId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    meta: { errorLabel: '이슈 수정 실패', errorMessage: '이슈 수정에 실패했습니다.' },
    mutationFn: (data: { title: string; connectionId?: string }) =>
      updateIssueTitle(issueId, data.title, data.connectionId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.issues.detail(issueId),
      });
      toast.success('이슈를 수정했습니다!');
    },
  });
};

export const useDeleteIssueMutation = (issueId: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    meta: { errorLabel: '이슈 삭제 실패', errorMessage: '이슈 삭제에 실패했습니다.' },
    mutationFn: (data: { connectionId?: string }) => deleteIssue(issueId, data.connectionId),

    onSuccess: async (data) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.issues.detail(issueId) });
      queryClient.removeQueries({ queryKey: queryKeys.issues.detail(issueId) });

      if (data.topicId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.topics.detail(data.topicId),
        });
      }

      toast.success('이슈를 삭제했습니다.');

      router.push(data.topicId ? `/topics/${data.topicId}` : '/');
    },
  });
};

import { useQuery } from '@tanstack/react-query';
import { getIssue } from '@/lib/api/issue';
import { getTopicIssues } from '@/lib/api/issue-map';
import { ApiError } from '@/lib/utils/api-response';
import { queryKeys } from '@/lib/query-keys';

export const useIssueQuery = (issueId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.issues.detail(issueId),
    queryFn: () => getIssue(issueId),
    enabled: enabled && !!issueId,
    retry: (failureCount, error) => {
      if (error instanceof ApiError && error.code === 'ISSUE_NOT_FOUND') return false;
      return failureCount < 3;
    },
  });
};

export const useTopicIssuesQuery = (topicId: string | null | undefined) => {
  return useQuery({
    queryKey: queryKeys.topics.issues(topicId!),
    queryFn: () => getTopicIssues(topicId!),
    enabled: !!topicId,
  });
};

import { useQuery } from '@tanstack/react-query';
import { getIssueMembers } from '@/lib/api/issue';
import { queryKeys } from '@/lib/query-keys';

export const useIssueMemberQuery = (issueId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.issues.members(issueId),
    queryFn: () => getIssueMembers(issueId),
    enabled: enabled && !!issueId,
  });
};

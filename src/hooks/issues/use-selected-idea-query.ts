import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';

export function useSelectedIdeaQuery(issueId: string) {
  return useQuery<string | null>({
    queryKey: queryKeys.issues.selectedIdea(issueId),
    queryFn: async () => null,
    enabled: false,
    initialData: null,
  });
}

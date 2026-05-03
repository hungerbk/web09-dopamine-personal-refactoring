import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchComments } from '@/lib/api/comment';
import { queryKeys } from '@/lib/query-keys';

export const getCommentQueryKey = (issueId: string, ideaId: string) =>
  queryKeys.comments.list(issueId, ideaId);

export const useCommentQuery = (issueId: string, ideaId: string) => {
  const commentQueryKey = useMemo(() => getCommentQueryKey(issueId, ideaId), [ideaId, issueId]);

  const commentsQuery = useQuery({
    queryKey: commentQueryKey,
    queryFn: () => fetchComments(issueId, ideaId),
    enabled: Boolean(issueId && ideaId),
  });

  return { commentQueryKey, commentsQuery };
};

import { useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSseConnectionStore } from '@/issues/store/use-sse-connection-store';
import { type Comment, createComment, deleteComment, updateComment } from '@/lib/api/comment';
import { getCommentQueryKey } from './use-comment-query';
import { queryKeys } from '@/lib/query-keys';

interface CreateCommentParams {
  userId: string;
  content: string;
}

interface UpdateCommentParams {
  commentId: string;
  content: string;
}

interface DeleteCommentParams {
  commentId: string;
}

export const useCommentMutations = (issueId: string, ideaId: string) => {
  const queryClient = useQueryClient();
  const commentQueryKey = useMemo(() => getCommentQueryKey(issueId, ideaId), [ideaId, issueId]);
  const connectionId = useSseConnectionStore((state) => state.connectionIds[issueId]);

  const createMutation = useMutation({
    mutationFn: ({ userId, content }: CreateCommentParams) =>
      createComment(issueId, ideaId, { userId, content }, connectionId),
    onSuccess: (created) => {
      queryClient.setQueryData<Comment[]>(commentQueryKey, (prev) => [...(prev ?? []), created]);
      // 아이디어 쿼리 갱신하여 댓글 개수 업데이트
      queryClient.invalidateQueries({ queryKey: queryKeys.issues.ideaComments(issueId, ideaId) });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ commentId, content }: UpdateCommentParams) =>
      updateComment(issueId, ideaId, commentId, { content }, connectionId),
    onSuccess: (updated, variables) => {
      queryClient.setQueryData<Comment[]>(commentQueryKey, (prev) =>
        (prev ?? []).map((comment) =>
          comment.id === variables.commentId
            ? { ...comment, ...(updated ?? {}), content: updated?.content ?? variables.content }
            : comment,
        ),
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ({ commentId }: DeleteCommentParams) =>
      deleteComment(issueId, ideaId, commentId, connectionId),
    onSuccess: (_, variables) => {
      queryClient.setQueryData<Comment[]>(commentQueryKey, (prev) =>
        (prev ?? []).filter((comment) => comment.id !== variables.commentId),
      );
      // 아이디어 쿼리 갱신하여 댓글 개수 업데이트
      queryClient.invalidateQueries({ queryKey: queryKeys.issues.ideaComments(issueId, ideaId) });
    },
  });

  return { createMutation, updateMutation, deleteMutation };
};

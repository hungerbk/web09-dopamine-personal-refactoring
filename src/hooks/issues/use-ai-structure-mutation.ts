import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { categorizeIdeas } from '@/lib/api/issue';
import { IdeaWithPosition } from '@/issues/types';
import { queryKeys } from '@/lib/query-keys';

export function useAIStructuringMutation(issueId: string) {
  const queryClient = useQueryClient();

  const categorize = useMutation({
    mutationKey: ['ai-structuring', issueId],
    meta: { errorLabel: 'AI 구조화 오류' },
    mutationFn: () => categorizeIdeas(issueId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.issues.categories(issueId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.issues.ideas(issueId) });
    },
  });

  const handleAIStructure = () => {
    const cachedData = queryClient.getQueryData<IdeaWithPosition[]>(queryKeys.issues.ideas(issueId));
    const ideas = cachedData || [];

    const validIdeas = ideas.filter((idea) => idea.content.trim().length > 0);

    if (validIdeas.length === 0) {
      toast.error('분류할 아이디어가 없습니다.');
      return;
    }

    categorize.mutate();
  };

  return {
    handleAIStructure,
  };
}

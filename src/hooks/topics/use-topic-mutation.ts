import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { createTopic, deleteTopic, updateTopicTitle } from '@/lib/api/topic';
import type { ProjectwithTopic } from '@/projects/types';

interface CreateTopicData {
  title: string;
  projectId: string;
}

export const useCreateTopicMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    meta: { errorLabel: '토픽 생성 실패', errorMessage: '토픽 생성에 실패했습니다.' },
    mutationFn: (data: CreateTopicData) => createTopic(data.title, data.projectId),

    onSuccess: (data, variables) => {
      queryClient.setQueryData<ProjectwithTopic>(['project', variables.projectId], (prev) => {
        if (!prev) {
          return prev;
        }

        const exists = prev.topics.some((topic) => topic.id === data.id);
        if (exists) {
          return prev;
        }

        return {
          ...prev,
          topics: [
            {
              id: data.id,
              title: data.title,
              issueCount: 0,
            },
            ...prev.topics,
          ],
        };
      });

      return data;
    },
  });
};

export const useUpdateTopicTitleMutation = (topicId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    meta: { errorLabel: '토픽 수정 실패' },
    mutationFn: (data: { title: string }) => updateTopicTitle(topicId, data.title),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['topics', topicId],
      });

      toast.success('토픽을 수정했습니다!');
    },
  });
};

export const useDeleteTopicMutation = (topicId: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    meta: { errorLabel: '토픽 삭제 실패', errorMessage: '토픽 삭제에 실패했습니다.' },
    mutationFn: () => deleteTopic(topicId),

    onSuccess: async (data) => {
      await queryClient.cancelQueries({ queryKey: ['topics', topicId] });
      queryClient.removeQueries({ queryKey: ['topics', topicId] });
      queryClient.invalidateQueries({
        queryKey: ['project', data.projectId],
      });

      toast.success('토픽이 삭제되었습니다.');

      router.push(`/projects/${data.projectId}`);
    },
  });
};

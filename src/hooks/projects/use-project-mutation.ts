import { useMutation, useQueryClient } from '@tanstack/react-query';
import { leaveProject } from '@/lib/api/leave';
import { createProject, deleteProject, updateProject } from '@/lib/api/project';
import { queryKeys } from '@/lib/query-keys';

export const useCreateProjectMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    meta: { errorLabel: '프로젝트 생성 실패', errorMessage: '프로젝트 생성에 실패했습니다.' },
    mutationFn: (data: { title: string; description?: string }) =>
      createProject(data.title, data.description),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all() });
    },
  });
};

export const useDeleteProjectMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    meta: { errorLabel: '프로젝트 삭제 실패', errorMessage: '프로젝트 삭제에 실패했습니다.' },
    mutationFn: (data: { id: string }) => deleteProject(data.id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all() });
    },
  });
};

export const useUpdateProjectMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    meta: { errorLabel: '프로젝트 수정 실패', errorMessage: '프로젝트 수정에 실패했습니다.' },
    mutationFn: (data: { id: string; title: string; description?: string }) =>
      updateProject(data.id, data.title, data.description),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.detail(variables.id) });
    },
  });
};

export const useLeaveProjectMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    meta: { errorLabel: '프로젝트 나가기 실패', errorMessage: '프로젝트 나가기 실패했습니다.' },
    mutationFn: (data: { projectId: string; memberId: string }) =>
      leaveProject(data.projectId, data.memberId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all() });
    },
  });
};

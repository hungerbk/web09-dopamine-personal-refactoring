import { useQuery } from '@tanstack/react-query';
import { getProject, getProjects } from '@/lib/api/project';
import { queryKeys } from '@/lib/query-keys';

export const useProjectsQuery = (enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.projects.all(),
    queryFn: () => getProjects(),
    enabled,
  });
};

export const useProjectQuery = (projectId: string) => {
  return useQuery({
    queryKey: queryKeys.projects.detail(projectId),
    queryFn: () => getProject(projectId),
    enabled: !!projectId,
    staleTime: 1000 * 30,
    refetchOnWindowFocus: true,
  });
};

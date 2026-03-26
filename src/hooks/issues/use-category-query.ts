import { useQuery } from '@tanstack/react-query';
import { fetchCategories } from '@/lib/api/category';
import type { Category, Position } from '@/app/(with-sidebar)/issues/_types';

interface UICategory {
  id: string;
  title: string;
  position: Position;
  isMuted?: boolean;
}

export const useCategoryQuery = (issueId: string) => {
  return useQuery({
    queryKey: ['issues', issueId, 'categories'],
    queryFn: () => fetchCategories(issueId),
    staleTime: 1000 * 10,
    select: (data: Category[]): UICategory[] =>
      data.map((category) => ({
        id: category.id,
        title: category.title,
        position: {
          x: category.positionX ?? 100,
          y: category.positionY ?? 100,
        },
        isMuted: false,
      })),
  });
};

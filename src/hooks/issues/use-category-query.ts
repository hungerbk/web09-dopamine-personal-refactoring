import { useQuery } from '@tanstack/react-query';
import { fetchCategories } from '@/lib/api/category';
import type { Category, Position } from '@/issues/types';
import { queryKeys } from '@/lib/query-keys';

interface UICategory {
  id: string;
  title: string;
  position: Position;
  isMuted?: boolean;
}

export const useCategoryQuery = (issueId: string) => {
  return useQuery({
    queryKey: queryKeys.issues.categories(issueId),
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

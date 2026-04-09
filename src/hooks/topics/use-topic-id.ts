import { useParams, usePathname } from 'next/navigation';
import { useIssueQuery } from '@/hooks/issues';

// 토픽 ID 가져오기
export const useTopicId = () => {
  const params = useParams<{ topicId?: string; issueId?: string }>();
  const pathname = usePathname();

  const isTopicPage = pathname?.startsWith('/topic');
  const topicIdFromUrl = isTopicPage ? (params.topicId as string) : null;

  // 이슈 페이지에서만 이슈 데이터에서 topicId 가져오기
  const issueId = !isTopicPage ? (params.issueId as string) : '';
  const { data: issue } = useIssueQuery(issueId, !isTopicPage);
  const topicIdFromIssue = issue?.topicId;

  const topicId = isTopicPage ? topicIdFromUrl : topicIdFromIssue;

  return { topicId, isTopicPage };
};

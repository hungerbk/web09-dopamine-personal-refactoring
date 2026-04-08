'use client';

import { useTopicQuery } from '@/hooks/topics';
import { useTopicEvents } from '@/hooks/topics/use-topic-events';
// TODO: 스타일 작업 커밋 이후, 별도 커밋에서 `import type`으로 분리
import { IssueConnection, IssueMapData, IssueNode } from '@/issues/types';
import IssueNodeSkeletonGrid from '@/topics/components/issue-node-skeleton-grid/issue-node-skeleton-grid';
import TopicCanvas from '@/topics/components/topic-canvas/topic-canvas';

interface TopicPageClientProps {
  topicId: string;
  initialIssues: IssueMapData[];
  initialNodes: IssueNode[];
  initialConnections: IssueConnection[];
}

export default function TopicPageClient({
  topicId,
  initialIssues,
  initialNodes,
  initialConnections,
}: TopicPageClientProps) {
  // 토픽 실시간 이벤트 수신 (이슈가 0개여도 항상 활성화)
  useTopicEvents({ topicId });

  const { issues, nodes, connections } = useTopicQuery(
    topicId,
    initialIssues,
    initialNodes,
    initialConnections,
  );

  // 이슈가 없으면 스켈레톤 그리드 표시
  if (issues.length === 0) {
    return <IssueNodeSkeletonGrid />;
  }

  // 이슈가 있으면 토픽 캔버스 표시
  return <TopicCanvas topicId={topicId} issues={issues} nodes={nodes} connections={connections} />;
}

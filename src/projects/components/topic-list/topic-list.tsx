'use client';

import Card, { CardSkeleton } from '@/projects/components/card/card';
import EmptyTopicState from '@/projects/components/empty-topic-state/empty-topic-state';
import { useProjectQuery } from '@/hooks/projects';
import type { ProjectwithTopic } from '@/projects/types';
interface TopicListProps {
  projectId: string;
  initialTopics: ProjectwithTopic['topics'];
}

export default function TopicList({ projectId, initialTopics }: TopicListProps) {
  const { data: projectData } = useProjectQuery(projectId);
  const topics = projectData?.topics ?? initialTopics;

  return (
    <div className="relative flex flex-col gap-4">
      {topics.length === 0 ? (
        <>
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
            <EmptyTopicState />
          </div>
        </>
      ) : (
        topics.map((topic) => (
          <Card
            key={topic.id}
            id={topic.id}
            variant="item"
            leftIcon="/folder.svg"
            title={topic.title}
            subtitle={`이슈 ${topic.issueCount}개`}
            showArrow
          />
        ))
      )}
    </div>
  );
}

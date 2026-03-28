'use client';

import Card, { CardSkeleton } from '@/projects/components/card/card';
import EmptyTopicState from '@/projects/components/empty-topic-state/empty-topic-state';
import { useProjectQuery } from '@/hooks/projects';
import type { ProjectwithTopic } from '@/projects/types';
import * as S from '@/projects/components/project-detail-page.styles';

interface TopicListProps {
  projectId: string;
  initialTopics: ProjectwithTopic['topics'];
}

export default function TopicList({ projectId, initialTopics }: TopicListProps) {
  const { data: projectData } = useProjectQuery(projectId);
  const topics = projectData?.topics ?? initialTopics;

  return (
    <S.TopicCardsContainer>
      {topics.length === 0 ? (
        <>
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <S.EmptyTopicOverlay>
            <EmptyTopicState />
          </S.EmptyTopicOverlay>
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
    </S.TopicCardsContainer>
  );
}

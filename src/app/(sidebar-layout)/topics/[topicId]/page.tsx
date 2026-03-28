import TopicDetailPage from '@/topics/components/topic-detail-page';

export default async function TopicPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: topicId } = await params;

  return <TopicDetailPage topicId={topicId} />;
}


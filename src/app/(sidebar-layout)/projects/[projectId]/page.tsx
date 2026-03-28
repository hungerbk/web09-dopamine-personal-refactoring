import ProjectDetailPage from '@/projects/components/project-detail-page';

interface ProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;

  return <ProjectDetailPage projectId={id} />;
}

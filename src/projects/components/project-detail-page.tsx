import { getServerSession } from 'next-auth';
import Image from 'next/image';
import { notFound, redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { getProjectWithTopicsForUser } from '@/lib/services/project.service';
import CreateTopicButton from './create-topic-button/create-topic-button';
import EditProjectButton from './edit-project-button/edit-project-button';
import TopicList from './topic-list/topic-list';

export default async function ProjectDetailPage({ projectId }: { projectId: string }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect('/');
  }

  let projectData;
  try {
    projectData = await getProjectWithTopicsForUser(projectId, session.user.id);
  } catch (error) {
    redirect('/');
  }

  if (!projectData) {
    notFound();
  }

  const { title, description, topics, created_at } = projectData;

  const createdAt = created_at.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="bg-gray-50 w-full overflow-y-auto flex flex-col items-center justify-start">
      <div className="flex flex-col justify-start gap-9 py-[60px] px-[80px] h-fit max-w-[1200px] w-full">
        <div className="border border-gray-200 rounded-large bg-white relative p-6 flex flex-col gap-4 shadow-sm">
          <div className="flex flex-row justify-between items-center">
            <div className="text-small font-medium text-gray-600 flex items-center">{createdAt}</div>
            <EditProjectButton
              projectId={projectId}
              currentTitle={title}
              currentDescription={description ?? undefined}
            />
          </div>
          <div className="flex items-center gap-4">
            <Image
              src="/check-circle.svg"
              alt="체크 아이콘"
              width={32}
              height={32}
            />
            <div className="flex flex-col gap-2">
              <div className="text-xxl font-bold text-gray-900">{title}</div>
              <div className="text-small font-medium text-gray-600">{description}</div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-6 my-8">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-3">
              <h1 className="text-[24px] font-bold text-gray-900 m-0">토픽 목록</h1>
              <span className="text-medium font-medium text-gray-600">팀이 논의해야 할 큰 주제들입니다.</span>
            </div>
            <CreateTopicButton />
          </div>
          <TopicList
            projectId={projectId}
            initialTopics={topics}
          />
        </div>
      </div>
    </div>
  );
}

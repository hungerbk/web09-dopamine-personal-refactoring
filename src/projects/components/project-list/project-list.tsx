'use client';

import { ProjectCard } from '@/projects/components/project-card/project-card';
import type { ProjectListItem } from '@/projects/types';

interface ProjectListProps {
  projects: ProjectListItem[];
}

export function ProjectList({ projects }: ProjectListProps) {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects?.map((project) => (
          <ProjectCard
            key={project.id}
            id={project.id}
            title={project.title}
            memberCount={project.memberCount}
            ownerId={project.ownerId}
            members={project.members}
          />
        ))}
        <ProjectCard isCreateCard />
      </div>
    </div>
  );
}

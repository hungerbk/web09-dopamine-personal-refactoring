'use client';

import { ProjectCard } from '@/projects/components/project-card/project-card';
import type { ProjectListItem } from '@/projects/types';
import { cn } from '@/lib/utils/cn';

export function Container({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('w-full flex flex-col gap-6', className)} {...props}>
      {children}
    </div>
  );
}

export function CardGrid({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6', className)} {...props}>
      {children}
    </div>
  );
}

interface ProjectListProps {
  projects: ProjectListItem[];
}

export function ProjectList({ projects }: ProjectListProps) {
  return (
    <Container>
      <CardGrid>
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
      </CardGrid>
    </Container>
  );
}

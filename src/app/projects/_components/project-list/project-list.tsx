'use client';

import { ProjectCard } from '@/app/projects/_components/project-card/project-card';
import type { ProjectListItem } from '@/app/projects/_types';
import * as S from './project-list.styles';

interface ProjectListProps {
  projects: ProjectListItem[];
}

export function ProjectList({ projects }: ProjectListProps) {
  return (
    <S.Container>
      <S.CardGrid>
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
      </S.CardGrid>
    </S.Container>
  );
}

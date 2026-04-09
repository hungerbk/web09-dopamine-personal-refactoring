'use client';

import { ReactNode } from 'react';
import ProjectHeader from '@/projects/components/project-header/project-header';

export default function ProjectLayoutClient({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen flex-col gap-10 px-[80px] pt-8">
      <ProjectHeader />
      <div className="flex w-full max-w-[1200px] flex-1 self-center overflow-y-auto">{children}</div>
    </div>
  );
}

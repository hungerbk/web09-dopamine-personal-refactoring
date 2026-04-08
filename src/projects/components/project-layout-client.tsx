'use client';

import { ReactNode } from 'react';
import ProjectHeader from '@/projects/components/project-header/project-header';
import { cn } from '@/lib/utils/cn';

function LayoutContainer({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('flex flex-col gap-10 h-screen pt-8 px-[80px]', className)} {...props}>
      {children}
    </div>
  );
}

function ContentArea({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('flex flex-1 overflow-y-auto max-w-[1200px] self-center w-full', className)} {...props}>
      {children}
    </div>
  );
}

export default function ProjectLayoutClient({ children }: { children: ReactNode }) {
  return (
    <LayoutContainer>
      <ProjectHeader />
      <ContentArea>{children}</ContentArea>
    </LayoutContainer>
  );
}

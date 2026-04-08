'use client';

import { cn } from '@/lib/utils/cn';
import FloatingShapes from './floating-shapes';

function BackgroundContainer({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('fixed top-0 left-0 w-full h-full -z-10 overflow-hidden bg-white', className)}
      {...props}
    >
      {children}
    </div>
  );
}

function Circle({ color, className, ...props }: React.ComponentProps<'div'> & { color: string }) {
  return (
    <div
      className={cn(
        'absolute w-[40vw] h-[40vw] rounded-full opacity-40 mix-blend-multiply blur-[100px]',
        className
      )}
      style={{ background: color }}
      {...props}
    />
  );
}

export default function Background() {
  return (
    <BackgroundContainer>
      <Circle color="#60a5fa" className="-bottom-[10%] -left-[10%]" />
      <Circle color="#00a94f" className="-top-[10%] -right-[10%]" />
      <FloatingShapes />
    </BackgroundContainer>
  );
}

import type { InputHTMLAttributes, ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { IssueStatus } from '@/issues/types';

export function SidebarContainer({ children, className, ...props }: React.ComponentProps<'aside'>) {
  return (
    <aside
      className={cn(
        'flex flex-col gap-4 justify-self-start h-full w-64 py-4 bg-white text-gray-400 border-r border-gray-200 overflow-x-visible overflow-y-hidden shadow-[2px_0_2px_-1px_rgba(0,0,0,0.1)] relative',
        className
      )}
      {...props}
    >
      {children}
    </aside>
  );
}

export function InputWrapper({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('flex items-center mx-4 p-0 gap-2 border-b border-gray-200', className)} {...props}>
      {children}
    </div>
  );
}

export function SearchBox({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('relative flex-1', className)} {...props}>
      {children}
    </div>
  );
}

export function InputIcon({ className, ...props }: React.ComponentProps<typeof Image>) {
  return (
    <Image
      className={cn('absolute top-1/2 right-0 -translate-y-1/2', className)}
      {...props}
    />
  );
}

export function SrOnly({ children, className, ...props }: React.ComponentProps<'label'>) {
  return (
    <label className={cn('sr-only', className)} {...props}>
      {children}
    </label>
  );
}

export function SidebarInput({ className, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      className={cn('w-full py-2 pr-6 pl-2 border-none outline-none focus:outline-none focus:ring-0', className)}
      {...props}
    />
  );
}

export function SidebarTitle({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex items-center justify-between w-full px-4 py-2.5 text-medium font-bold tracking-[1px]',
        '[&>button]:w-5 [&>button]:h-5 [&>button]:flex [&>button]:flex-col [&>button]:items-center [&>button]:justify-center hover:[&>button]:opacity-70',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function SidebarList({ children, className, ...props }: React.ComponentProps<'ul'>) {
  return (
    <ul className={cn('flex flex-col flex-[1_1_0%] overflow-y-auto min-h-0 gap-1', className)} {...props}>
      {children}
    </ul>
  );
}

export function SidebarListItem({ children, className, ...props }: React.ComponentProps<'li'>) {
  return (
    <li className={cn('flex flex-row shrink-0', className)} {...props}>
      {children}
    </li>
  );
}

export function ListItemLink({ children, className, ...props }: React.ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn(
        'flex flex-row items-center w-full py-[10px] pr-4 pl-6 bg-white text-medium text-gray-700 border-none no-underline gap-2',
        'hover:bg-gray-200 focus:bg-gray-200',
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
}

const statusColorMap: Record<IssueStatus, string> = {
  BRAINSTORMING: 'text-yellow-400 border-yellow-400',
  CATEGORIZE: 'text-blue-500 border-blue-500',
  VOTE: 'text-red-400 border-red-400',
  SELECT: 'text-green-500 border-green-500',
  CLOSE: 'text-gray-500 border-gray-500',
};

export function StatusLabel({ status, children, className, ...props }: React.ComponentProps<'span'> & { status: IssueStatus }) {
  return (
    <span
      className={cn(
        'flex items-center justify-center py-1 px-2 text-xs bg-white border rounded-large ml-auto',
        statusColorMap[status],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function Bullet({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('w-2 h-2 bg-gray-300 rounded-full', className)} {...props} />;
}

interface SidebarProps {
  children: ReactNode;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  suffix?: ReactNode;
}

export default function Sidebar({ children, inputProps, suffix }: SidebarProps) {
  const inputId = inputProps?.id ?? 'sidebar';

  return (
    <SidebarContainer>
      <InputWrapper>
        {suffix}
        <SearchBox>
          <SrOnly htmlFor={inputId}>Search</SrOnly>
          <SidebarInput
            id={inputId}
            type="text"
            {...inputProps}
          />
          <InputIcon
            src="/magnifier.svg"
            alt="돋보기 이미지"
            width={16}
            height={16}
          />
        </SearchBox>
      </InputWrapper>
      {children}
    </SidebarContainer>
  );
}

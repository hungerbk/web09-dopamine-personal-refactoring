import type { InputHTMLAttributes, ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { IssueStatus } from '@/issues/types';

interface SidebarProps {
  children: ReactNode;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  suffix?: ReactNode;
}

const statusColorMap: Record<IssueStatus, string> = {
  BRAINSTORMING: 'text-yellow-400 border-yellow-400',
  CATEGORIZE: 'text-blue-500 border-blue-500',
  VOTE: 'text-red-400 border-red-400',
  SELECT: 'text-green-500 border-green-500',
  CLOSE: 'text-gray-500 border-gray-500',
};

export default function Sidebar({ children, inputProps, suffix }: SidebarProps) {
  const inputId = inputProps?.id ?? 'sidebar';

  return (
    <aside className="relative flex h-full w-64 justify-self-start flex-col gap-4 overflow-x-visible overflow-y-hidden border-r border-gray-200 bg-white py-4 text-gray-400 shadow-[2px_0_2px_-1px_rgba(0,0,0,0.1)]">
      <div className="mx-4 flex items-center gap-2 border-b border-gray-200 p-0">
        {suffix}
        <div className="relative flex-1">
          <label
            htmlFor={inputId}
            className="sr-only"
          >
            Search
          </label>
          <input
            id={inputId}
            type="text"
            className="w-full border-none py-2 pl-2 pr-6 outline-none focus:outline-none focus:ring-0"
            {...inputProps}
          />
          <Image
            src="/magnifier.svg"
            alt="돋보기 이미지"
            width={16}
            height={16}
            className="absolute right-0 top-1/2 -translate-y-1/2"
          />
        </div>
      </div>
      {children}
    </aside>
  );
}

export function SidebarTitle({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex items-center justify-between w-full px-4 py-2.5 text-medium font-bold tracking-[1px]',
        '[&>button]:w-5 [&>button]:h-5 [&>button]:flex [&>button]:flex-col [&>button]:items-center [&>button]:justify-center hover:[&>button]:opacity-70',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function SidebarList({ children, className, ...props }: React.ComponentProps<'ul'>) {
  return (
    <ul
      className={cn('flex min-h-0 flex-[1_1_0%] flex-col gap-1 overflow-y-auto', className)}
      {...props}
    >
      {children}
    </ul>
  );
}

export function SidebarListItem({ children, className, ...props }: React.ComponentProps<'li'>) {
  return (
    <li
      className={cn('flex shrink-0 flex-row', className)}
      {...props}
    >
      {children}
    </li>
  );
}

export function ListItemLink({ children, className, ...props }: React.ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn(
        'flex w-full flex-row items-center gap-2 border-none bg-white py-[10px] pl-6 pr-4 text-medium text-gray-700 no-underline hover:bg-gray-200 focus:bg-gray-200',
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );
}

export function StatusLabel({
  status,
  children,
  className,
  ...props
}: React.ComponentProps<'span'> & { status: IssueStatus }) {
  return (
    <span
      className={cn(
        'ml-auto flex items-center justify-center rounded-large border bg-white px-2 py-1 text-xs',
        statusColorMap[status],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function Bullet({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('h-2 w-2 rounded-full bg-gray-300', className)}
      {...props}
    />
  );
}

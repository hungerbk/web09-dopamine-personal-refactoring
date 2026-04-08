import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils/cn';

export type FilterType = 'issue' | 'member' | 'topic';

interface SidebarFilterProps {
  value: FilterType;
  onChange: (value: FilterType) => void;
  items?: FilterType[];
}

const LABEL_MAP: Record<FilterType, string> = {
  issue: '이슈',
  member: '멤버',
  topic: '토픽',
};

export function Container({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('relative', className)} {...props}>
      {children}
    </div>
  );
}

export function Trigger({ children, className, ...props }: React.ComponentProps<'button'>) {
  return (
    <button
      className={cn(
        'flex items-center gap-1 bg-transparent border-none text-small font-bold text-gray-600 cursor-pointer p-1 whitespace-nowrap',
        'hover:text-gray-800',
        'after:content-[""] after:block after:w-0 after:h-0 after:border-l-[4px] after:border-l-transparent after:border-r-[4px] after:border-r-transparent after:border-t-[4px] after:border-t-current after:mt-0.5',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function Menu({ children, className, ...props }: React.ComponentProps<'ul'>) {
  return (
    <ul
      className={cn(
        'absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-[8px] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] list-none p-1 z-10 min-w-[80px]',
        className
      )}
      {...props}
    >
      {children}
    </ul>
  );
}

export function MenuItem({ isActive, children, className, ...props }: React.ComponentProps<'li'> & { isActive?: boolean }) {
  return (
    <li
      className={cn(
        'w-full',
        '[&>button]:w-full [&>button]:text-left [&>button]:py-2 [&>button]:px-3 [&>button]:border-none [&>button]:rounded-[4px] [&>button]:text-small [&>button]:cursor-pointer [&>button]:whitespace-nowrap',
        isActive
          ? '[&>button]:bg-gray-200 [&>button]:text-gray-900 hover:[&>button]:bg-gray-200'
          : '[&>button]:bg-transparent [&>button]:text-gray-600 hover:[&>button]:bg-gray-100 hover:[&>button]:text-gray-900',
        className
      )}
      {...props}
    >
      {children}
    </li>
  );
}

export default function SidebarFilter({ value, onChange, items = ['issue', 'member'] }: SidebarFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (newValue: FilterType) => {
    onChange(newValue);
    setIsOpen(false);
  };

  return (
    <Container ref={filterRef}>
      <Trigger onClick={() => setIsOpen(!isOpen)}>
        {LABEL_MAP[value]}
      </Trigger>
      {isOpen && (
        <Menu>
          {items.map((item) => (
            <MenuItem key={item} isActive={value === item}>
              <button onClick={() => handleSelect(item)}>{LABEL_MAP[item]}</button>
            </MenuItem>
          ))}
        </Menu>
      )}
    </Container>
  );
}

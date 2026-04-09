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
    <div
      ref={filterRef}
      className="relative"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='flex items-center gap-1 whitespace-nowrap bg-transparent p-1 text-small font-bold text-gray-600 hover:text-gray-800 after:mt-0.5 after:block after:h-0 after:w-0 after:border-l-[4px] after:border-l-transparent after:border-r-[4px] after:border-r-transparent after:border-t-[4px] after:border-t-current after:content-[""]'
      >
        {LABEL_MAP[value]}
      </button>
      {isOpen && (
        <ul className="absolute left-0 top-full z-10 mt-2 min-w-[80px] list-none rounded-[8px] border border-gray-200 bg-white p-1 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]">
          {items.map((item) => (
            <li
              key={item}
              className={cn(
                'w-full',
                '[&>button]:w-full [&>button]:whitespace-nowrap [&>button]:rounded-[4px] [&>button]:border-none [&>button]:px-3 [&>button]:py-2 [&>button]:text-left [&>button]:text-small [&>button]:cursor-pointer',
                value === item
                  ? '[&>button]:bg-gray-200 [&>button]:text-gray-900 hover:[&>button]:bg-gray-200'
                  : '[&>button]:bg-transparent [&>button]:text-gray-600 hover:[&>button]:bg-gray-100 hover:[&>button]:text-gray-900',
              )}
            >
              <button onClick={() => handleSelect(item)}>{LABEL_MAP[item]}</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

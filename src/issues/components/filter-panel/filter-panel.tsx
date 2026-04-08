import type { MouseEvent } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

export type FilterKey = 'most-liked' | 'need-discussion' | 'none';

interface FilterPanelProps {
  value: FilterKey;
  onChange: (value: FilterKey) => void;
}

const filterButtonVariants = cva(
  'rounded-large p-2.5 text-small shadow-[0_4px_12px_rgba(0,0,0,0.12)] transition-transform duration-100 hover:-translate-y-[1px]',
  {
    variants: {
      selected: {
        true: 'border-2 border-blue-400 bg-blue-100 text-blue-800',
        false: 'border border-blue-400 bg-white text-blue-600',
      },
    },
  },
);

export default function FilterPanel({ value, onChange }: FilterPanelProps) {
  const toggleFilter = (nextFilter: 'most-liked' | 'need-discussion') => {
    onChange(value === nextFilter ? 'none' : nextFilter);
  };

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const nextFilter = e.currentTarget.dataset.filter as
      | 'most-liked'
      | 'need-discussion'
      | undefined;
    if (!nextFilter) return;
    toggleFilter(nextFilter);
  };

  return (
    <div className="fixed left-[300px] top-[100px] z-sticky flex items-center gap-4">
      <button
        type="button"
        data-filter="most-liked"
        className={cn(filterButtonVariants({ selected: value === 'most-liked' }))}
        onClick={handleClick}
      >
        찬반순
      </button>
      <button
        type="button"
        data-filter="need-discussion"
        className={cn(filterButtonVariants({ selected: value === 'need-discussion' }))}
        onClick={handleClick}
      >
        논의 필요
      </button>
    </div>
  );
}

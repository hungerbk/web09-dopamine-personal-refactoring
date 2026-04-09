import { ReactNode, useState } from 'react';
import { cn } from '@/lib/utils/cn';

interface TextFieldProps {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onEnter?: () => void;
  placeholder?: string;
  maxLength?: number;
  readOnly?: boolean;
  description?: string;
  icon?: ReactNode;
  onIconClick?: () => void;
}

export default function TextField({
  label,
  value,
  onChange,
  onBlur,
  onEnter,
  placeholder,
  maxLength,
  readOnly = false,
  description,
  icon,
  onIconClick,
}: TextFieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      onEnter?.();
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <label className={cn('text-small font-bold text-gray-400', !readOnly && isFocused && 'active')}>
        {label}
      </label>
      <div
        className={cn(
          'flex items-center justify-between rounded-[8px] border p-[11px]',
          readOnly ? 'border-gray-200 bg-gray-100' : 'bg-white',
          !readOnly && (isFocused ? 'border-green-500' : 'border-gray-200'),
        )}
      >
        <input
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          readOnly={readOnly}
          disabled={readOnly}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full rounded-none border-none bg-transparent text-medium font-regular text-gray-900 outline-none disabled:cursor-not-allowed disabled:text-gray-500"
        />
        {icon && (
          <div
            className={cn(
              'flex h-[14px] w-[14px] items-center justify-center text-gray-400',
              !readOnly && isFocused && 'active text-green-500',
            )}
            onClick={onIconClick}
            style={{ cursor: onIconClick ? 'pointer' : 'default' }}
          >
            {icon}
          </div>
        )}
      </div>
      {description && <p className="mt-1 text-small font-regular text-gray-400">{description}</p>}
    </div>
  );
}

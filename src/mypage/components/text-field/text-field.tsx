import { ReactNode, useState } from 'react';
import { cn } from '@/lib/utils/cn';

export function TextFieldContainer({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('flex flex-col gap-1', className)} {...props}>
      {children}
    </div>
  );
}

export function Label({ children, className, ...props }: React.ComponentProps<'label'>) {
  return (
    <label className={cn('text-small font-bold text-gray-400', className)} {...props}>
      {children}
    </label>
  );
}

export function InputWrapper({
  $isReadOnly,
  $isFocused,
  children,
  className,
  ...props
}: React.ComponentProps<'div'> & { $isReadOnly?: boolean; $isFocused?: boolean }) {
  return (
    <div
      className={cn(
        'p-[11px] flex items-center justify-between border rounded-[8px]',
        $isReadOnly ? 'bg-gray-100 border-gray-200' : 'bg-white',
        !$isReadOnly && $isFocused ? 'border-green-500' : !$isReadOnly && 'border-gray-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function Input({ className, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      className={cn(
        'border-none rounded-none outline-none bg-transparent w-full text-medium font-regular text-gray-900',
        'disabled:text-gray-500 disabled:cursor-not-allowed',
        className
      )}
      {...props}
    />
  );
}

export function Description({ children, className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p className={cn('text-small font-regular text-gray-400 mt-1', className)} {...props}>
      {children}
    </p>
  );
}

export function IconWrapper({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('flex items-center justify-center text-gray-400 w-[14px] h-[14px] [&.active]:text-green-500', className)} {...props}>
      {children}
    </div>
  );
}

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
    <TextFieldContainer>
      <Label className={!readOnly && isFocused ? 'active' : ''}>{label}</Label>
      <InputWrapper
        $isReadOnly={readOnly}
        $isFocused={isFocused}
      >
        <Input
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          readOnly={readOnly}
          disabled={readOnly}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        />
        {icon && (
          <IconWrapper 
            className={!readOnly && isFocused ? 'active' : ''}
            onClick={onIconClick}
            style={{ cursor: onIconClick ? 'pointer' : 'default' }}
          >
            {icon}
          </IconWrapper>
        )}
      </InputWrapper>
      {description && <Description>{description}</Description>}
    </TextFieldContainer>
  );
}

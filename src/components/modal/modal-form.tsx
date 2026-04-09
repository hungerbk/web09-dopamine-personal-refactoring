import { cn } from '@/lib/utils/cn';

export function FormContainer({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('flex flex-col', className)} {...props}>
      {children}
    </div>
  );
}

export function FormInfoContainer({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('flex flex-col', className)} {...props}>
      {children}
    </div>
  );
}

export function FormInputWrapper({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('flex flex-col gap-2', className)} {...props}>
      {children}
    </div>
  );
}

export function FormInputTitle({ children, className, ...props }: React.ComponentProps<'label'>) {
  return (
    <label className={cn('text-medium font-semibold text-gray-900', className)} {...props}>
      {children}
    </label>
  );
}

/** input + CharCount를 감싸는 relative 래퍼 */
export function FormInputRow({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('relative w-full', className)} {...props}>
      {children}
    </div>
  );
}

/**
 * 기본 패딩: py-3 px-4
 * CharCount와 함께 쓸 때: className="pr-11" 추가
 */
export function FormInput({ className, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      className={cn(
        'w-full border border-gray-200 rounded-medium text-medium text-gray-900 box-border bg-white',
        'py-3 px-4',
        'focus:outline-none focus:border-green-600',
        'disabled:bg-gray-50 disabled:cursor-not-allowed',
        'placeholder:text-gray-400',
        className,
      )}
      {...props}
    />
  );
}

/**
 * 기본 패딩: py-3 px-4
 * CharCount와 함께 쓸 때: className="pr-11" 추가
 */
export function FormTextarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      className={cn(
        'w-full border border-gray-200 rounded-medium text-medium text-gray-900 box-border bg-white',
        'py-3 px-4',
        'focus:outline-none focus:border-green-600',
        'disabled:bg-gray-50 disabled:cursor-not-allowed',
        'placeholder:text-gray-400',
        className,
      )}
      {...props}
    />
  );
}

/** FormInputRow 내부 우측에 절대 위치로 표시되는 글자 수 카운터 */
export function FormCharCount({
  children,
  className,
  isOverLimit,
  ...props
}: React.ComponentProps<'span'> & { isOverLimit?: boolean }) {
  return (
    <span
      className={cn(
        'absolute right-2.5 top-1/2 -translate-y-1/2 text-small font-semibold pointer-events-none',
        isOverLimit ? 'text-red-500' : 'text-gray-600',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function FormFooter({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('flex justify-end gap-3', className)} {...props}>
      {children}
    </div>
  );
}

export function FormSubmitButton({ children, className, ...props }: React.ComponentProps<'button'>) {
  return (
    <button
      className={cn(
        'border-none rounded-medium bg-green-600 text-white text-medium font-bold cursor-pointer transition-colors duration-200 ease',
        'hover:not-disabled:bg-green-700',
        'disabled:bg-gray-300 disabled:cursor-not-allowed',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

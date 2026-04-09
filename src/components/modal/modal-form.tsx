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

export function FormInputRow({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('relative', className)} {...props}>
      {children}
    </div>
  );
}

export function FormInput({ className, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      className={cn(
        'w-full border border-gray-300 rounded-medium text-medium text-gray-900 box-border bg-white',
        'focus:outline-none focus:border-green-600',
        'disabled:bg-gray-50 disabled:cursor-not-allowed',
        'placeholder:text-gray-400',
        className
      )}
      {...props}
    />
  );
}

export function FormTextarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      className={cn(
        'w-full border border-gray-300 rounded-medium text-medium text-gray-900 box-border',
        'focus:outline-none focus:border-green-600',
        className
      )}
      {...props}
    />
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
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

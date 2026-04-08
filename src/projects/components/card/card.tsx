'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

const cardContainerVariants = cva(
  'flex items-center justify-between transition-all duration-200 ease-in-out',
  {
    variants: {
      variant: {
        header: 'p-0 cursor-default',
        item: 'border border-gray-200 rounded-large bg-white p-5 cursor-pointer hover:bg-yellow-50 hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] hover:-translate-y-0.5',
      },
    },
    defaultVariants: {
      variant: 'header',
    },
  }
);

interface CardProps extends VariantProps<typeof cardContainerVariants> {
  id: string;
  leftIcon: string;
  title: string;
  subtitle?: string;
  rightIcon?: string;
  showArrow?: boolean;
  onClick?: () => void;
}

const Card = ({
  id,
  variant = 'header',
  leftIcon,
  title,
  subtitle,
  rightIcon,
  showArrow = false,
  onClick,
}: CardProps) => {
  const router = useRouter();

  const goTopic = () => {
    router.push(`/topics/${id}`);
  };

  return (
    <div
      className={cn(cardContainerVariants({ variant }))}
      onClick={goTopic}
    >
      <div className="flex items-center gap-4">
        <div 
          className={cn(
            'flex items-center justify-center bg-green-50 rounded-small shrink-0',
            variant === 'header' ? 'w-10 h-10' : 'w-12 h-12'
          )}
        >
          <Image
            src={leftIcon}
            alt="아이콘"
            width={variant === 'header' ? 20 : 24}
            height={variant === 'header' ? 20 : 24}
          />
        </div>
        <div className="flex flex-col gap-2">
          <div 
            className={cn(
              'text-large font-bold m-0',
              variant === 'header' ? 'text-gray-800' : 'text-gray-900'
            )}
          >
            {title}
          </div>
          {subtitle && <span className="text-small font-medium text-gray-600">{subtitle}</span>}
        </div>
      </div>
      {(rightIcon || showArrow) && (
        <div className="ml-auto flex items-center text-gray-600 cursor-pointer hover:opacity-70">
          {showArrow ? (
            <div className="rotate-180 flex items-center justify-center text-gray-400">
              <Image
                src="/leftArrow.svg"
                alt="이동"
                width={20}
                height={20}
              />
            </div>
          ) : (
            rightIcon && (
              <Image
                src={rightIcon}
                alt="편집"
                width={16}
                height={16}
              />
            )
          )}
        </div>
      )}
    </div>
  );
};

export const CardSkeleton = () => {
  return (
    <div 
      role="status" 
      aria-label="토픽 로딩 중"
      className="border border-dashed border-gray-200 bg-white rounded-large flex items-center gap-4 p-5 pointer-events-none"
    >
      <div className="w-12 h-12 rounded-small shrink-0 bg-gray-100 animate-pulse" />
      <div className="flex flex-col gap-2 flex-1">
        <div className="h-3.5 rounded-full bg-gray-100 animate-pulse w-[45%]" />
        <div className="h-3.5 rounded-full bg-gray-100 animate-pulse w-[30%]" />
      </div>
      <div className="w-5 h-5 rounded-full shrink-0 bg-gray-100 animate-pulse" />
    </div>
  );
};

export default Card;

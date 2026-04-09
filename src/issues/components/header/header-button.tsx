'use client';

import { MouseEventHandler } from 'react';
import Image from 'next/image';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

interface HeaderButtonProps {
  text?: string;
  imageSrc?: string;
  imageSize?: number;
  alt?: string;
  color?: 'white' | 'black' | 'green';
  variant?: 'solid' | 'outline';
  onClick?: (e?: React.MouseEvent) => void;
  onMouseEnter?: MouseEventHandler<HTMLButtonElement>;
  onMouseLeave?: MouseEventHandler<HTMLButtonElement>;
}

const buttonVariants = cva(
  'flex items-center gap-2 rounded-medium px-3 py-1.5 text-medium font-bold shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]',
  {
    variants: {
      variant: {
        solid: '',
        outline: 'border border-green-600 bg-transparent text-green-600',
      },
      color: {
        white: 'border border-gray-200 bg-white text-black',
        black: 'border border-black bg-black text-white',
        green: 'border border-green-600 bg-green-600 text-white',
      },
    },
    compoundVariants: [
      {
        variant: 'outline',
        color: 'white',
        className: 'border-green-600 bg-transparent text-green-600',
      },
      {
        variant: 'outline',
        color: 'black',
        className: 'border-green-600 bg-transparent text-green-600',
      },
      {
        variant: 'outline',
        color: 'green',
        className: 'border-green-600 bg-transparent text-green-600',
      },
    ],
    defaultVariants: {
      variant: 'solid',
      color: 'white',
    },
  },
);

const HeaderButton = ({
  text,
  imageSrc,
  imageSize = 14,
  alt = '',
  color = 'white',
  variant = 'solid',
  onClick,
  onMouseEnter,
  onMouseLeave,
}: HeaderButtonProps) => {
  return (
    <button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cn(buttonVariants({ variant, color }))}
    >
      {imageSrc && (
        <Image
          src={imageSrc}
          alt={alt}
          width={imageSize}
          height={imageSize}
        />
      )}
      {text && <span>{text}</span>}
    </button>
  );
};

export default HeaderButton;

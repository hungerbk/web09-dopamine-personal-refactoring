import { theme } from '@/styles/theme';

interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  style?: React.CSSProperties;
}

export const Skeleton = ({ width = '100%', height = '20px', borderRadius = '8px', style }: SkeletonProps) => {
  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        background: `linear-gradient(90deg, ${theme.colors.gray[50]} 0%, ${theme.colors.gray[100]} 50%, ${theme.colors.gray[50]} 100%)`,
        backgroundSize: '400px 100%',
        animation: 'skeleton-shimmer 1.4s ease-in-out infinite',
        ...style,
      }}
      role="status"
      aria-label="로딩 중"
    />
  );
};

export const TextSkeleton = ({ width = '100%' }: { width?: string }) => {
  return <Skeleton width={width} height="16px" />;
};

export const TitleSkeleton = ({ width = '150px' }: { width?: string }) => {
  return <Skeleton width={width} height="24px" />;
};

export const CircleSkeleton = ({ size = '40px' }: { size?: string }) => {
  return <Skeleton width={size} height={size} borderRadius="50%" />;
};

interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  style?: React.CSSProperties;
}

export const Skeleton = ({ width = '100%', height = '20px', borderRadius = '8px', style }: SkeletonProps) => {
  return (
    <div
      className="bg-[length:400px_100%] bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 animate-[skeleton-shimmer_1.4s_ease-in-out_infinite]"
      style={{
        width,
        height,
        borderRadius,
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

import React from 'react';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'rect' | 'circle';
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Standard Skeleton component for consistent loading UI.
 * Uses the global .skeleton class from index.css
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  variant = 'rect',
  className = '',
  style = {}
}) => {
  const combinedStyle: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    ...style
  };

  const variantClass = variant === 'circle' ? 'skeleton-avatar' : '';

  return (
    <div 
      className={`skeleton ${variantClass} ${className}`} 
      style={combinedStyle}
      aria-hidden="true"
    />
  );
};

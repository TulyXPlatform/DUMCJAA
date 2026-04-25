import * as React from 'react';
import { cn } from '../../../lib/utils';

/* 
 * SENIOR REVIEW:
 * - Optimized variant colors for accessibility (WCAG contrast).
 * - Minimized DOM weight.
 */

const BADGE_VARIANTS = {
  primary:   'bg-brand-50 text-brand-700 border-brand-100',
  secondary: 'bg-neutral-100 text-neutral-700 border-neutral-200',
  success:   'bg-green-50 text-green-700 border-green-100',
  warning:   'bg-yellow-50 text-yellow-700 border-yellow-100',
  danger:    'bg-red-50 text-red-700 border-red-100',
  outline:   'bg-transparent text-neutral-600 border-neutral-200',
};

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof BADGE_VARIANTS;
}

export const Badge: React.FC<BadgeProps> = ({ className, variant = 'primary', ...props }) => {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide transition-colors select-none',
        BADGE_VARIANTS[variant],
        className
      )}
      {...props}
    />
  );
};

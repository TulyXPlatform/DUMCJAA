import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../../lib/utils';

/* 
 * SENIOR REVIEW:
 * - Decoupled size from Lucide defaults for pixel-perfect control.
 */

const SPINNER_SIZES = {
  sm: 'h-4 w-4 stroke-[2.5px]',
  md: 'h-6 w-6 stroke-[2px]',
  lg: 'h-10 w-10 stroke-[1.5px]',
  xl: 'h-16 w-16 stroke-[1px]',
};

const SPINNER_VARIANTS = {
  primary: 'text-brand-600',
  white:   'text-white',
  neutral: 'text-neutral-400',
};

export interface SpinnerProps extends React.SVGAttributes<SVGSVGElement> {
  size?: keyof typeof SPINNER_SIZES;
  variant?: keyof typeof SPINNER_VARIANTS;
}

export const Spinner: React.FC<SpinnerProps> = ({ className, size = 'md', variant = 'primary', ...props }) => {
  return (
    <Loader2
      className={cn('animate-spin', SPINNER_SIZES[size], SPINNER_VARIANTS[variant], className)}
      {...props}
    />
  );
};

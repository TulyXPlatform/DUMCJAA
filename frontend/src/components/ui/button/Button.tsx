import * as React from 'react';
import { cn } from '../../../lib/utils';
import { Loader2 } from 'lucide-react';

/* 
 * SENIOR REVIEW: 
 * - Extracted base classes to a constant for cleaner JSX.
 * - Standardized focus-visible rings for better accessibility.
 * - Used flex-shrink-0 on the loader to prevent layout shifts.
 */

const BASE_BUTTON_STYLES = 'inline-flex items-center justify-center gap-2 whitespace-nowrap transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] select-none';

const BUTTON_VARIANTS = {
  primary:   'bg-brand-600 text-white hover:bg-brand-700 shadow-sm',
  secondary: 'bg-brand-100 text-brand-700 hover:bg-brand-200',
  outline:   'bg-transparent border border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300',
  ghost:     'bg-transparent text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900',
  danger:    'bg-danger text-white hover:bg-red-700 shadow-sm',
};

const BUTTON_SIZES = {
  sm: 'px-3 h-8 text-xs font-medium rounded-sm',
  md: 'px-4 h-10 text-sm font-semibold rounded-md',
  lg: 'px-6 h-12 text-base font-bold rounded-lg',
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof BUTTON_VARIANTS;
  size?: keyof typeof BUTTON_SIZES;
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(BASE_BUTTON_STYLES, BUTTON_VARIANTS[variant], BUTTON_SIZES[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden="true" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

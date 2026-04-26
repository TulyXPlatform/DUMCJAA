import * as React from 'react';
import { cn } from '../../../lib/utils';

/* 
 * SENIOR REVIEW:
 * - Decoupled label and input for better semantic structure.
 * - Centralized focus and border logic.
 * - Added aria-invalid for screen readers when an error is present.
 */

const BASE_INPUT_STYLES = 'flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-bold text-neutral-700 tracking-tight">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            BASE_INPUT_STYLES,
            error ? 'border-danger focus-visible:ring-danger' : 'hover:border-neutral-300',
            className
          )}
          {...props}
        />
        {(error || helperText) && (
          <p 
            id={errorId}
            className={cn('text-xs font-medium', error ? 'text-danger animate-in fade-in slide-in-from-top-1' : 'text-neutral-500')}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

import * as React from 'react';
import { cn } from '../../../lib/utils';

/* 
 * SENIOR REVIEW:
 * - Optimized table scrolling container for mobile.
 * - Standardized cell spacing.
 * - Improved semantic markup for accessibility.
 */

export const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="relative w-full overflow-auto rounded-lg border border-neutral-100">
      <table ref={ref} className={cn('w-full caption-bottom text-sm border-collapse', className)} {...props} />
    </div>
  )
);
Table.displayName = 'Table';

export const THead = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <thead ref={ref} className={cn('bg-neutral-50/80 border-b border-neutral-200', className)} {...props} />
  )
);
THead.displayName = 'THead';

export const TBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={cn('[&_tr:last-child]:border-0', className)} {...props} />
  )
);
TBody.displayName = 'TBody';

export const TRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn('border-b border-neutral-100 transition-colors hover:bg-neutral-50/50 data-[state=selected]:bg-neutral-100/50', className)}
      {...props}
    />
  )
);
TRow.displayName = 'TRow';

const CELL_BASE = 'px-4 py-3 align-middle transition-colors';

export const THeadCell = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(CELL_BASE, 'text-left font-bold text-neutral-600 uppercase tracking-wider text-[11px]', className)}
      {...props}
    />
  )
);
THeadCell.displayName = 'THeadCell';

export const TCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td ref={ref} className={cn(CELL_BASE, 'text-neutral-700', className)} {...props} />
  )
);
TCell.displayName = 'TCell';

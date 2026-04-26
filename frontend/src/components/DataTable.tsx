import React from 'react';
import { Skeleton } from './Skeleton';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

// Generic type-safe column definition
export interface Column<T> {
  key: keyof T | string;
  header: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (row: T, index: number) => React.ReactNode;
}

interface DataTableProps<T extends { id: string }> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  emptyMessage?: string;
  skeletonRows?: number;
}

function TableSkeleton({ cols, rows }: { cols: number; rows: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, ri) => (
        <tr key={ri} className="dt-row">
          {Array.from({ length: cols }).map((_, ci) => (
            <td key={ci} className="dt-cell">
              <Skeleton width={ci === 0 ? '80%' : '60%'} height={16} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  isLoading = false,
  page,
  pageSize,
  totalCount,
  totalPages,
  onPageChange,
  emptyMessage = 'No records found.',
  skeletonRows = 8,
}: DataTableProps<T>) {
  const from = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalCount);

  return (
    <div className="dt-wrapper">
      <div className="dt-scroll">
        <table className="dt-table" role="table">
          <thead className="dt-thead">
            <tr>
              {columns.map(col => (
                <th
                  key={String(col.key)}
                  className="dt-th"
                  style={{ width: col.width, textAlign: col.align ?? 'left' }}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="dt-tbody">
            {isLoading ? (
              <TableSkeleton cols={columns.length} rows={skeletonRows} />
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="dt-empty">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr key={row.id} className="dt-row">
                  {columns.map(col => (
                    <td
                      key={String(col.key)}
                      className="dt-cell"
                      style={{ textAlign: col.align ?? 'left' }}
                    >
                      {col.render
                        ? col.render(row, idx)
                        : String(row[col.key as keyof T] ?? '—')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer: count + pagination */}
      <div className="dt-footer">
        <span className="dt-count">
          {totalCount === 0 ? 'No results' : `${from}–${to} of ${totalCount.toLocaleString()} records`}
        </span>
        {totalPages > 1 && (
          <div className="dt-pagination" role="navigation" aria-label="Table pagination">
            <button className="dt-pag-btn" onClick={() => onPageChange(1)} disabled={page === 1} aria-label="First page">
              <ChevronsLeft size={15} />
            </button>
            <button className="dt-pag-btn" onClick={() => onPageChange(page - 1)} disabled={page === 1} aria-label="Previous page">
              <ChevronLeft size={15} />
            </button>
            <span className="dt-pag-info">Page {page} of {totalPages}</span>
            <button className="dt-pag-btn" onClick={() => onPageChange(page + 1)} disabled={page === totalPages} aria-label="Next page">
              <ChevronRight size={15} />
            </button>
            <button className="dt-pag-btn" onClick={() => onPageChange(totalPages)} disabled={page === totalPages} aria-label="Last page">
              <ChevronsRight size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

import type { ReactNode } from 'react';
import { cn } from '../lib/cn';

/** Stacked label-above-input field group with optional error text below. */
export function Field({
  label,
  htmlFor,
  error,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  error?: string | undefined;
  children: ReactNode;
  className?: string;
}) {
  const errorId = error ? `${htmlFor}-error` : undefined;
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label
        htmlFor={htmlFor}
        className="text-sm font-medium text-muted-foreground"
      >
        {label}
      </label>
      {children}
      {error && (
        <p id={errorId} role="alert" className="text-sm text-error">
          {error}
        </p>
      )}
    </div>
  );
}

/** Form-level feedback banner (error or success). */
export function Alert({
  tone,
  children,
}: {
  tone: 'error' | 'success';
  children: ReactNode;
}) {
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={cn(
        'rounded-sm border px-4 py-3 text-sm',
        tone === 'error'
          ? 'border-error/30 bg-error/5 text-error'
          : 'border-primary/20 bg-primary/5 text-foreground',
      )}
    >
      {children}
    </div>
  );
}

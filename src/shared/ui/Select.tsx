import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from '../lib/cn';

/** Native select themed to match Input (hairline, 56px, focus-ink). */
export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, invalid, children, ...props }, ref) => (
    <select
      ref={ref}
      aria-invalid={invalid}
      className={cn(
        'h-14 w-full rounded-sm border bg-background px-3 text-base text-foreground',
        'focus:border-2 focus:border-foreground focus:outline-none',
        'disabled:cursor-not-allowed disabled:bg-surface-soft disabled:text-muted-foreground',
        invalid ? 'border-error' : 'border-border',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  ),
);
Select.displayName = 'Select';

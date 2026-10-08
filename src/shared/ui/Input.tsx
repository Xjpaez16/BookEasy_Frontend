import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../lib/cn';

/*
 * Input — Airbnb text-input: white surface, 1px hairline, 8px radius, 56px
 * height. On focus the border thickens to 2px ink (no glow/ring). Error state
 * flips the border to the semantic error tone.
 */
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, ...props }, ref) => (
    <input
      ref={ref}
      aria-invalid={invalid}
      className={cn(
        'h-14 w-full rounded-sm border bg-background px-3 text-base text-foreground placeholder:text-muted-foreground',
        'focus:border-2 focus:border-foreground focus:outline-none',
        'disabled:cursor-not-allowed disabled:bg-surface-soft disabled:text-muted-foreground',
        invalid ? 'border-error' : 'border-border',
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = 'Input';

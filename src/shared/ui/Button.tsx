import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '../lib/cn';

/*
 * Button — Airbnb design tokens (DESIGN-airbnb.md).
 * primary: Rausch fill, white text, 8px radius, 48px height, weight 500.
 * secondary: white fill, ink text, 1px ink outline.
 * tertiary: plain ink text, underline on hover.
 */
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-primary-foreground hover:bg-primary-active active:bg-primary-active disabled:bg-primary-disabled',
        secondary:
          'border border-foreground bg-background text-foreground hover:bg-surface-soft disabled:border-border-strong disabled:text-muted-foreground',
        tertiary:
          'bg-transparent text-foreground underline-offset-4 hover:underline disabled:text-muted-foreground',
        pill: 'rounded-full bg-primary text-primary-foreground hover:bg-primary-active disabled:bg-primary-disabled',
      },
      size: {
        md: 'h-12 px-6 text-base', // 48px — primary CTA
        sm: 'h-10 px-5 text-sm',
        full: 'h-12 w-full px-6 text-base',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, disabled, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled ?? loading}
      aria-busy={loading}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
      {children}
    </button>
  ),
);
Button.displayName = 'Button';

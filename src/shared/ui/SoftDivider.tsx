import { cn } from '../lib/cn';

/**
 * A horizontal separator that fades to transparent at both ends instead of a
 * hard edge-to-edge hairline — softer section breaks (Direction 2 polish).
 * Uses an inline gradient on currentColor-neutral grey so it reads on light
 * and dark surfaces alike.
 */
export function SoftDivider({ className }: { className?: string }) {
  return (
    <div
      role="separator"
      aria-hidden
      className={cn('h-px w-full', className)}
      style={{
        background:
          'linear-gradient(90deg, transparent 0%, hsl(0 0% 90%) 15%, hsl(0 0% 90%) 85%, transparent 100%)',
      }}
    />
  );
}

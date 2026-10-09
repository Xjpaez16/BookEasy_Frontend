import type { Config } from 'tailwindcss';

/* Tokens from .kiro/skills/DESIGN-airbnb.md — single Rausch voltage, soft radii,
 * one shadow tier. */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        'border-soft': 'hsl(var(--border-soft))',
        'border-strong': 'hsl(var(--border-strong))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: 'hsl(var(--card))',
        'card-foreground': 'hsl(var(--card-foreground))',
        'surface-soft': 'hsl(var(--surface-soft))',
        'surface-strong': 'hsl(var(--surface-strong))',
        body: 'hsl(var(--body))',
        muted: 'hsl(var(--muted))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
        primary: 'hsl(var(--primary))',
        'primary-foreground': 'hsl(var(--primary-foreground))',
        'primary-active': 'hsl(var(--primary-active))',
        'primary-disabled': 'hsl(var(--primary-disabled))',
        error: 'hsl(var(--error))',
        'error-hover': 'hsl(var(--error-hover))',
      },
      borderRadius: {
        sm: '8px',
        md: '14px',
        lg: '20px',
        xl: '32px',
        full: '9999px',
      },
      fontFamily: {
        sans: [
          'Inter',
          'Circular',
          '-apple-system',
          'system-ui',
          'Roboto',
          'Helvetica Neue',
          'sans-serif',
        ],
      },
      boxShadow: {
        // The system's single elevation tier (card hover / dropdowns / search bar).
        float:
          'rgba(0,0,0,0.02) 0 0 0 1px, rgba(0,0,0,0.04) 0 2px 6px 0, rgba(0,0,0,0.1) 0 4px 8px 0',
        // Sticky-header elevation — replaces the hard border-b hairline with a
        // soft 1px edge + a faint drop so sections separate without a visible line.
        nav: '0 1px 0 rgba(0,0,0,0.04), 0 8px 24px -16px rgba(0,0,0,0.18)',
      },
      backgroundImage: {
        // Warm brand wash for public hero sections — a very tender Rausch tint
        // fading to canvas, so the storefront feels alive (Fresha-like) without
        // a hard divider.
        'brand-wash':
          'linear-gradient(180deg, hsl(347 100% 97%) 0%, hsl(0 0% 100%) 100%)',
      },
      maxWidth: {
        content: '1280px',
        // One narrow column for forms/settings so every inner page lines up.
        page: '768px',
      },
    },
  },
  plugins: [],
} satisfies Config;

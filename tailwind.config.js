/* eslint-env node */
import tailwindcssAnimate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error: 'var(--color-error)',
        // Background and surface tokens
        'background-body': '#0a0a0a',
        'background-primary': '#0a0a0a',
        'background-secondary': '#111827',
        'background-card': '#111827',
        'background-glass': 'rgba(17, 24, 39, 0.6)',
        'background-glass-hover': 'rgba(17, 24, 39, 0.7)',
        surface: '#0f172a',
        // Text tokens
        text: '#e5e7eb',
        'text-primary': '#e5e7eb',
        'text-secondary': '#9ca3af',
        'text-muted': '#6b7280',
        'text-soft': '#cbd5e1',
        // Border tokens
        border: '#374151',
        'border-primary': '#374151',
        'border-hover': '#4b5563',
        // Royal Theme
        'accent-primary': 'var(--color-accent-primary)',
        'accent-secondary': 'var(--color-accent-secondary)',
        gold: {
          400: 'var(--color-gold-400)',
          500: 'var(--color-gold-500)',
          600: 'var(--color-gold-600)',
        },
        tier: {
          bronze: 'var(--color-tier-bronze)',
          silver: 'var(--color-tier-silver)',
          gold: 'var(--color-tier-gold)',
          platinum: 'var(--color-tier-platinum)',
          diamond: 'var(--color-tier-diamond)',
          common: 'var(--color-tier-common)',
          rare: 'var(--color-tier-rare)',
          epic: 'var(--color-tier-epic)',
          legendary: 'var(--color-tier-legendary)',
          mythic: 'var(--color-tier-mythic)',
        },
      },
      fontFamily: {
        sans: 'var(--font-family-sans)',
        mono: 'var(--font-family-mono)',
        serif: ['Cinzel', 'serif'],
      },
      spacing: {
        unit: 'var(--spacing-unit)',
      },
      borderRadius: {
        sm: 'var(--border-radius-sm)',
        md: 'var(--border-radius-md)',
        lg: 'var(--border-radius-lg)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      },
      zIndex: {
        dropdown: 'var(--z-index-dropdown)',
        modal: 'var(--z-index-modal)',
        tooltip: 'var(--z-index-tooltip)',
      },
      transitionTimingFunction: {
        'fast': 'ease-out',
        'medium': 'ease-out',
        'slow': 'ease-out',
      },
      transitionDuration: {
        'fast': '0.15s',
        'medium': '0.3s',
        'slow': '0.5s',
      },
    },
  },
  plugins: [
    tailwindcssAnimate,
  ],
}
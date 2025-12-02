# SpendThrone Style Guide - Royal Theme

## Overview

This style guide documents the "Royal Theme" design system for SpendThrone, designed to evoke a sense of premium competition and viral engagement, inspired by highscore.money but with a distinct "King of the Hill" aesthetic.

## Design Principles

### 1. Royal & Competitive
- **Primary Colors**: Gold (#facc15) and Deep Black/Zinc for a premium, high-stakes feel.
- **Accents**: Gold gradients to highlight the "King" and high-value actions.
- **Visual Hierarchy**: Rank 1 is visually distinct with glowing effects and unique iconography.

### 2. Mobile-First & Viral
- **Responsive**: Hidden columns on mobile to focus on the essential "Overtake" action.
- **Action-Oriented**: Floating buttons and clear call-to-actions for payments.
- **Social Proof**: Toast notifications and shared links to drive viral loops.

### 3. Solana Native
- **Wallet Integration**: Seamless connection states.
- **Transaction States**: Clear feedback for signing, confirming, and success.

## Color System

### Royal Palette (CSS Variables)

We use CSS variables mapped to Tailwind utility classes.

```css
:root {
  /* Royal Gold */
  --color-gold-400: #facc15; /* Main Accent */
  --color-gold-500: #eab308; /* Hover States */
  --color-gold-600: #ca8a04; /* Borders/Deep accents */

  /* Backgrounds */
  --color-bg-primary: #000000;
  --color-bg-secondary: #09090b; /* Zinc 950 */
  --color-bg-tertiary: #18181b;  /* Zinc 900 */

  /* Text */
  --color-text-primary: #ffffff;
  --color-text-secondary: #a1a1aa; /* Zinc 400 */
  --color-text-muted: #71717a;   /* Zinc 500 */
}
```

### Tailwind Extension

```js
colors: {
  'accent-primary': 'var(--color-accent-primary)', // Mapped to Gold
  'accent-secondary': 'var(--color-accent-secondary)',
  gold: {
    400: 'var(--color-gold-400)',
    500: 'var(--color-gold-500)',
    600: 'var(--color-gold-600)',
  }
}
```

## Typography

- **Font Family**: Inter (Body), JetBrains Mono (Numbers/Addresses).
- **Headings**: Bold, high contrast.
- **Numbers**: Monospaced for tabular data (Leaderboard).

## Component Usage

### Buttons
- **Primary**: Gold background, Black text. Used for "Pay Tribute", "Overtake".
- **Secondary**: Zinc background, White text. Used for "Connect Wallet", "Cancel".
- **Danger**: Red/Rose. Used for "Disconnect".

### Cards
- **Background**: `bg-zinc-900/50` with `backdrop-blur`.
- **Border**: `border-zinc-800`.
- **Highlight**: `border-gold-500` for active/king states.

### Leaderboard
- **Rank 1 (The King)**:
  - Gold gradient background.
  - Gold border-left.
  - Glowing shadow.
  - "Dethrone" action button.
- **Others**: Standard zinc rows with hover effects.

## Spacing
- Standard 4px grid (Tailwind defaults).
- `p-4`, `m-4` (16px) as standard component padding.

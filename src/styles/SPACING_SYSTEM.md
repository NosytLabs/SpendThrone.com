# SpendThrone Spacing System

## Overview
This document outlines the standardized 8px baseline grid spacing system used throughout SpendThrone.com to ensure visual consistency and maintainable code.

## 8px Baseline Grid
All spacing values follow an 8px baseline grid system:

### Base Spacing Variables
```css
--space-1: 0.5rem;   /* 8px */
--space-2: 1rem;     /* 16px */
--space-3: 1.5rem;   /* 24px */
--space-4: 2rem;     /* 32px */
--space-5: 2.5rem;   /* 40px */
--space-6: 3rem;     /* 48px */
--space-8: 4rem;     /* 64px */
--space-10: 5rem;    /* 80px */
--space-12: 6rem;    /* 96px */
```

### Gap Utilities
```css
.gap-1 { gap: var(--space-1); }   /* 8px */
.gap-2 { gap: var(--space-2); }   /* 16px */
.gap-3 { gap: var(--space-3); }   /* 24px */
.gap-4 { gap: var(--space-4); }   /* 32px */
.gap-5 { gap: var(--space-5); }   /* 40px */
.gap-6 { gap: var(--space-6); }   /* 48px */
.gap-8 { gap: var(--space-8); }   /* 64px */
```

### Container Padding
```css
.container-xs { max-width: 480px; }
.container-sm { max-width: 640px; }
.container-md { max-width: 768px; }
.container-lg { max-width: 1024px; }
.container-xl { max-width: 1280px; }
.container-2xl { max-width: 1536px; }
.container-3xl { max-width: 1920px; }
```

## Responsive Breakpoints
Enhanced intermediate breakpoints for better responsive design:

```css
/* Mobile First Approach */
@media (max-width: 480px) { /* Extra small devices */ }
@media (min-width: 481px) and (max-width: 767px) { /* Small devices */ }
@media (min-width: 768px) and (max-width: 1023px) { /* Medium devices */ }
@media (min-width: 1024px) and (max-width: 1279px) { /* Large devices */ }
@media (min-width: 1280px) and (max-width: 1535px) { /* Extra large devices */ }
@media (min-width: 1536px) { /* Ultra large devices */ }
```

## Component Spacing Guidelines

### Cards
- **Card padding**: `var(--space-4)` (16px) for compact cards
- **Card padding**: `var(--space-6)` (24px) for standard cards
- **Card padding**: `var(--space-8)` (32px) for large cards
- **Gap between card elements**: `var(--space-4)` (16px)
- **Gap between cards**: `var(--space-4)` (16px) on mobile, `var(--space-6)` (24px) on desktop

### Grid Layouts
- **Grid gap**: `var(--space-4)` (16px) for standard grids
- **Grid gap**: `var(--space-6)` (24px) for spacious layouts
- **Minimum touch target**: 44px (follows WCAG guidelines)

### Typography Spacing
- **Heading margin-bottom**: `var(--space-2)` (16px) or `var(--space-3)` (24px)
- **Paragraph margin-bottom**: `var(--space-4)` (16px)
- **Section spacing**: `var(--space-8)` (64px) or `var(--space-12)` (96px)

## Implementation Examples

### Before (Inconsistent)
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <Card className="p-6">
    <div className="flex items-start gap-4">
      <h3 className="text-lg font-semibold mb-3">Title</h3>
    </div>
  </Card>
</div>
```

### After (Consistent)
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <Card className="p-4">
    <div className="flex items-start gap-4">
      <h3 className="text-lg font-semibold mb-2">Title</h3>
    </div>
  </Card>
</div>
```

## Accessibility Considerations
- **Minimum touch target**: 44px × 44px
- **Reduced motion support**: Respect `prefers-reduced-motion`
- **High contrast mode**: Maintain spacing in high contrast themes
- **Screen reader optimization**: Consistent spacing helps screen readers

## Migration Checklist
- [x] Updated layout.css gap utilities to use CSS variables
- [x] Added intermediate breakpoints (480px, 768px, 1024px, 1280px, 1536px, 1920px)
- [x] Standardized card spacing in enhanced-cards.css
- [x] Fixed inconsistent spacing in AboutModern.tsx
- [x] Added reduced motion support for card animations
- [ ] Update remaining components to use consistent spacing
- [ ] Audit all gap- classes in the codebase
- [ ] Test responsive behavior across all breakpoints

## Testing
- Verify spacing consistency across all screen sizes
- Test with screen readers for proper spacing announcements
- Validate touch target sizes meet accessibility requirements
- Check reduced motion behavior
- Test high contrast mode compatibility
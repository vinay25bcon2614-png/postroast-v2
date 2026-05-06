# PostRoast Premium Design System

## Overview

A comprehensive design system for PostRoast Premium — premium $29/month LinkedIn growth SaaS. Inspired by Notion/Linear quality, built with CSS variables for consistency and maintainability.

## Color Palette

### Backgrounds
```css
--bg: #0c0c0e      /* Main background */
--s1: #111114      /* Card/surface level 1 */
--s2: #18181c      /* Surface level 2 (hover) */
--s3: #22222a      /* Surface level 3 (deeper) */
```

### Borders
```css
--b1: #2a2a2f      /* Primary border */
--b2: #34343b      /* Secondary border */
--b3: #3e3e46      /* Tertiary border (hover) */
```

### Status & Intent
```css
--acc: #FF5C00     /* Orange accent (primary action) */
--ok: #22c55e      /* Green (positive/success) */
--warn: #f59e0b    /* Amber (warning/caution) */
--error: #ef4444   /* Red (error/destructive) */
--info: #3b82f6    /* Blue (informational) */
```

### Text
```css
--t1: #ffffff      /* Primary text (highest contrast) */
--t2: #e5e7eb      /* Secondary text */
--t3: #9ca3af      /* Tertiary text (reduced contrast) */
--t4: #6b7280      /* Disabled/placeholder text */
```

### Accent Variants
```css
--acc-dark: #e04d00    /* Darker orange (press state) */
--acc-light: #ff7a1a   /* Lighter orange (hover) */
```

## Typography

### Font Stack
```css
--sans: system-ui, -apple-system, 'Segoe UI', 'Helvetica Neue', sans-serif
--mono: 'Monaco', 'Courier New', monospace
```

### Scale
| Usage | Size | Weight | Example |
|-------|------|--------|---------|
| Hero | 28px | 600 | Page title |
| Large | 22px | 600 | KPI number |
| Headline | 16px | 600 | Section title |
| Body | 13px | 400 | Post content |
| Small | 12px | 500 | Labels, badges |
| Mini | 11px | 600 | Captions, tags |
| Micro | 10px | 600 | Uppercase labels |
| Mono | 11px | 400 | Counts, codes |

## Spacing & Sizing

### Gap Sizes
```css
2px   /* Minimal (sidebar items) */
5px   /* Small (badge padding) */
6px   /* Extra small gaps */
8px   /* Small gaps */
9px   /* Default gap (flex items) */
10px  /* Medium small */
12px  /* Medium */
14px  /* Medium large */
16px  /* Large */
20px  /* Extra large */
24px  /* Page padding */
```

### Border Radius
```css
3px   /* Small elements (badges) */
4px   /* Input elements */
6px   /* Buttons, tags */
8px   /* Cards */
12px  /* Larger cards */
16px  /* Extra large cards */
20px  /* Pill shapes */
50%   /* Circles (avatars) */
```

### Component Sizing
| Component | Dimension |
|-----------|-----------|
| Sidebar | 200px width |
| TopBar | 52px height |
| RightPanel | 280px width |
| Avatar | 32px |
| Icon | 14-16px |
| Streak square | 24px |
| Score bar | 3px height |

## Transitions

### Duration
```css
--transition: 0.15s ease  /* Standard smooth transition */
```

### Application
- Hover states: background, color, transform
- Transforms: `translate-y(-1px)` on press/hover
- All state changes: 0.15s ease
- NOT jarring or delayed

## Scrollbars

Custom thin scrollbars for premium feel:
```css
::-webkit-scrollbar {
  width: 3px;   /* Super thin */
  height: 3px;
}

::-webkit-scrollbar-track {
  background: transparent;  /* Invisible by default */
}

::-webkit-scrollbar-thumb {
  background: var(--b2);    /* Subtle border color */
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--b3);    /* Slightly more visible on hover */
}
```

## Shadows

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1)
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.2)
```

## Component Patterns

### Interactive Elements (Buttons, Links)
```tsx
// Style template
button {
  background: var(--acc);
  color: var(--t1);
  padding: 8px 14px;
  border-radius: 6px;
  transition: all var(--transition);
}

button:hover {
  background: var(--acc-light);
  transform: translateY(-1px);
}

button:active {
  transform: translateY(0);
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

### Cards
```tsx
// Standard card
.card {
  background: var(--s1);
  border: 1px solid var(--b1);
  border-radius: 12px;
  padding: 16px;
}

.card:hover {
  border-color: var(--b2);
  background: var(--s2);
}
```

### Badges / Pills
```tsx
// Status badge
.badge {
  background: rgba(255, 92, 0, 0.2);  /* Accent with opacity */
  color: var(--acc);
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
}
```

### Text with Hierarchy
```tsx
// Primary heading
<h1>Main Title</h1>    // 28px, weight 600

// Secondary
<h2>Section</h2>       // 16px, weight 600

// Body
<p>Content</p>         // 13px, weight 400

// Supporting
<span>Label</span>     // 12px, weight 500, color: var(--t3)

// Captions
<small>Caption</small> // 11px, weight 600, color: var(--t4)
```

## Layout Grid

### Sidebar + Main + RightPanel Layout
```
┌─────────────────────────────────────────┐
│ TopBar (52px, fixed)                    │
├─────┬─────────────────────────┬─────────┤
│     │                         │         │
│ Sid │    Main Content         │ Right   │
│ bar │    (flex, scroll)       │ Panel   │
│     │                         │         │
│ 200 │         1fr             │ 280px   │
│ px  │                         │         │
│     │                         │         │
└─────┴─────────────────────────┴─────────┘
```

### KPI Row Grid
```
[KPI 1] [KPI 2] [KPI 3] [KPI 4]
  gap: 10px
  4 equal columns
```

### Template Grid
```
[Template 1] [Template 2]
[Template 3] [Template 4]
  gap: 7px
  2 equal columns
```

## Accessibility

- ✅ Semantic HTML: `<button>`, `<nav>`, `<main>`, `<aside>`
- ✅ Alt text on images
- ✅ Aria labels on interactive elements
- ✅ Color contrast: 4.5:1+ for text
- ✅ Keyboard navigation support
- ✅ Focus states on all buttons
- ✅ Loading states with aria-busy
- ✅ Form labels for inputs

## CSS Variables Usage

### ❌ Don't
```css
.button {
  background: #FF5C00;  /* Hard-coded hex */
  padding: 8px;
  gap: 12px;
}
```

### ✅ Do
```css
.button {
  background: var(--acc);     /* Use variable */
  padding: 8px;
  gap: 12px;
}

.button:hover {
  background: var(--acc-light); /* Use hover variant */
}
```

## Responsive Design

### Breakpoints (Future: Phase 2)
```css
/* Tablet */
@media (max-width: 1024px) {
  .sidebar { left: -200px; }  /* Hide sidebar */
  .kpi-row { grid-template-columns: repeat(2, 1fr); }
}

/* Mobile */
@media (max-width: 768px) {
  .dashboard-main { margin-right: 0; }  /* Hide right panel */
  body { font-size: 14px; }
}
```

## Quality Checklist

Before shipping any new component:

- [ ] All colors use `var(--*)`
- [ ] Hover state implemented
- [ ] Transition timing: 0.15s ease
- [ ] Icons: 14-16px size
- [ ] Type safety: TypeScript/PropTypes
- [ ] Semantic HTML used
- [ ] Focus state for accessibility
- [ ] Loading state handled
- [ ] Error state shown
- [ ] Responsive hints added
- [ ] No console warnings/errors
- [ ] Matches design spec exactly

## Color Usage Guide

| Scenario | Color | Why |
|----------|-------|-----|
| Primary Action | `--acc` | Orange stands out, calls to action |
| Hover State | `--s2` | Darker surface, subtle feedback |
| Success/Complete | `--ok` | Green universally recognized |
| Warning/Caution | `--warn` | Amber for attention without alarm |
| Error/Destructive | `--error` | Red for critical actions |
| Disabled | Gray with opacity | Reduce visual weight |
| Card Background | `--s1` | Clear separation from main |
| Primary Text | `--t1` | Maximum contrast for readability |
| Secondary Text | `--t3` | Reduced for labels/metadata |

## Implementation Tips

1. **Start with globals.css**: Import it first in your app
2. **Define theme early**: Set all variables in `:root`
3. **Use cascading variables**: `--t1` → `--t2` → `--t3`
4. **Create variants**: `--acc`, `--acc-dark`, `--acc-light`
5. **Avoid hard-coding**: Search codebase for `#` in CSS files
6. **Test in context**: Hover, active, disabled states
7. **Check contrast**: Use accessibility checker
8. **Animate thoughtfully**: 0.15s for responsiveness

---

**Version**: 1.0 | **Last Updated**: 2026-05-06 | **Status**: Production-Ready

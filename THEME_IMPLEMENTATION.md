# Theme System Implementation

## Overview

The Daily Tracker app now includes a complete light/dark theme system with:
- **Persistent Theme Preference** - Theme choice is saved to localStorage
- **System Preference Detection** - Respects OS dark mode preference on first visit
- **Smooth Transitions** - Instant theme switching with CSS variables
- **Easy to Use** - Simple hook-based API for components

## How It Works

### Architecture

```
ThemeProvider (Context)
    ↓
useTheme() hook
    ↓
Component (ThemeToggle, etc.)
    ↓
CSS Variables (--bg, --text, --primary, etc.)
```

### Theme Toggle Button

Located in the navigation bar (top right), the theme toggle button displays:
- **☀️** when light theme is active (click to switch to dark)
- **🌙** when dark theme is active (click to switch to light)

The button features:
- Smooth hover effects with color changes
- Click animation with transform scaling
- Accessible title attribute

## Using the Theme System

### In React Components

Use the `useTheme()` hook to access theme state:

```typescript
import { useTheme } from '@/components/theme-context'

export function MyComponent() {
  const { theme, toggleTheme } = useTheme()
  
  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  )
}
```

### In CSS

The theme system uses CSS variables that automatically update:

```css
/* These variables change based on the theme */
body {
  background: var(--bg);
  color: var(--text);
}

.card {
  background: var(--surface);
  border-color: var(--border);
  box-shadow: var(--shadow);
}
```

**Available CSS Variables:**
- `--bg` - Main background color
- `--surface` - Card/surface background
- `--surface-2` - Secondary surface (slightly darker/lighter)
- `--text` - Text color
- `--muted` - Muted/secondary text
- `--border` - Border color
- `--primary` - Primary brand color
- `--primary-soft` - Soft primary (for backgrounds)
- `--radius` - Border radius
- `--shadow` - Box shadow

## Color Schemes

### Light Theme
- Background: Light beige (#f7f6f2)
- Surface: White (#ffffff)
- Text: Dark brown (#1f1d1a)
- Primary: Teal (#0f766e)

### Dark Theme
- Background: Very dark (#141311)
- Surface: Dark gray (#1d1b19)
- Text: Light cream (#f7f4ef)
- Primary: Light teal (#55b2aa)

## Technical Details

### Files Involved

1. **`components/theme-context.tsx`** - ThemeProvider and useTheme hook
2. **`components/theme-toggle.tsx`** - Toggle button component
3. **`components/nav-tabs.tsx`** - Navigation with embedded toggle
4. **`app/layout.tsx`** - Wrapped with ThemeProvider
5. **`app/globals.css`** - CSS variables and theme definitions

### Theme Persistence

Theme preference is stored in browser localStorage under the key `'theme'`:

```typescript
// Manually check/set theme in browser console
localStorage.getItem('theme')  // Returns 'light' or 'dark'
localStorage.setItem('theme', 'dark')
```

### System Preference Detection

On first visit (no saved preference), the app respects the user's OS dark mode setting:

```typescript
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
```

## Browser Support

✅ All modern browsers support:
- localStorage for persistence
- CSS custom properties (variables)
- `prefers-color-scheme` media query

## Customizing Colors

To modify theme colors, edit the CSS variables in `app/globals.css`:

```css
:root {
  --primary: #0f766e;  /* Change primary color */
  --bg: #f7f6f2;       /* Change background */
  /* ... other variables ... */
}

html[data-theme="dark"] {
  --primary: #55b2aa;  /* Dark theme primary */
  /* ... other variables ... */
}
```

## Preventing Flash of Wrong Theme

The ThemeProvider prevents a flash of the incorrect theme by:
1. Loading theme from localStorage immediately
2. Not rendering children until theme is applied
3. Setting `data-theme` attribute on the html element

## Future Enhancements

Possible improvements:
- Add theme selector (Light/Dark/Auto) with three options
- Add custom theme customization panel
- Animate theme transitions with fade effects
- Add theme scheduling (e.g., dark mode at sunset)
- Sync theme across browser tabs using storage events

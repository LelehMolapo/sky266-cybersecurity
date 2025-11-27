# 🎨 Sky266 Professional CSS Theme Guide

## Overview
This project now features a beautiful, professional CSS theme with **Sky Blue**, **White**, and **Black** as the primary colors. The design system is modern, accessible, and fully responsive.

## 🎯 Color Palette

### Primary Colors
- **Sky Blue 500**: `#0ea5e9` - Main brand color
- **Sky Blue 400**: `#38bdf8` - Lighter accent
- **Sky Blue 600**: `#0284c7` - Darker shade
- **White**: `#ffffff` - Backgrounds
- **Black**: `#0a0a0a` - Text

### Extended Palette
```css
--sky-50: #f0f9ff   /* Very light background */
--sky-100: #e0f2fe  /* Light background */
--sky-200: #bae6fd  /* Borders */
--sky-300: #7dd3fc  /* Subtle accents */
--sky-400: #38bdf8  /* Bright accents */
--sky-500: #0ea5e9  /* Primary brand */
--sky-600: #0284c7  /* Primary hover */
--sky-700: #0369a1  /* Dark accents */
--sky-800: #075985  /* Very dark */
--sky-900: #0c4a6e  /* Almost black */
```

## 📦 Component Classes

### Buttons

#### Primary Button
```html
<button class="btn btn-primary">Click Me</button>
```
- Sky blue gradient background
- White text
- Hover: Darker gradient + lift effect + shadow

#### Secondary Button
```html
<button class="btn btn-secondary">Click Me</button>
```
- White background
- Sky blue border and text
- Hover: Light sky blue background

#### Ghost Button
```html
<button class="btn btn-ghost">Click Me</button>
```
- Transparent background
- Sky blue text
- Hover: Light sky blue background

### Cards

#### Standard Card
```html
<div class="card">
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</div>
```
- White background
- Subtle shadow
- Hover: Lifts up with enhanced shadow

#### Sky Card
```html
<div class="card-sky">
  <h3>Sky Card</h3>
  <p>Special sky-themed card</p>
</div>
```
- Gradient background (white to sky-50)
- Sky blue border
- Hover: Enhanced border and shadow

#### Stat Card
```html
<div class="stat-card">
  <div class="stat-value">95%</div>
  <div class="stat-label">Completion Rate</div>
</div>
```
- Left border accent in sky blue
- Large value display
- Hover: Lifts with enhanced shadow

### Badges

```html
<span class="badge badge-primary">Primary</span>
<span class="badge badge-success">Success</span>
<span class="badge badge-warning">Warning</span>
<span class="badge badge-error">Error</span>
```

### Progress Bars

```html
<div class="progress-container">
  <div class="progress-bar" style="width: 75%"></div>
</div>
```
- Animated shimmer effect
- Sky blue gradient fill
- Smooth width transitions

### Alerts

```html
<div class="alert alert-info">
  <strong>Info:</strong> This is an informational message
</div>

<div class="alert alert-success">
  <strong>Success:</strong> Operation completed successfully
</div>

<div class="alert alert-warning">
  <strong>Warning:</strong> Please review this
</div>

<div class="alert alert-error">
  <strong>Error:</strong> Something went wrong
</div>
```

### Input Fields

```html
<input type="text" class="input" placeholder="Enter text" />
```
- Clean white background
- Sky blue focus ring
- Smooth transitions

### Tables

```html
<table class="table">
  <thead>
    <tr>
      <th>Column 1</th>
      <th>Column 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Data 1</td>
      <td>Data 2</td>
    </tr>
  </tbody>
</table>
```
- Sky blue gradient header
- Hover effects on rows
- Clean borders

## 🎨 Gradient Classes

### Background Gradients
```html
<div class="gradient-sky">Sky gradient</div>
<div class="gradient-sky-light">Light gradient</div>
<div class="gradient-sky-dark">Dark gradient</div>
```

### Text Gradient
```html
<h1 class="gradient-text-sky">Gradient Text</h1>
```

## ✨ Utility Classes

### Colors
- `.text-sky` - Sky blue text
- `.bg-sky` - Sky blue background
- `.border-sky` - Sky blue border

### Effects
- `.shadow-sky` - Sky blue shadow
- `.glow-sky` - Sky blue glow effect
- `.hover-lift` - Lift on hover

### Animations
- `.fade-in` - Fade in animation
- `.slide-in` - Slide in from left
- `.pulse` - Pulsing animation

## 🏗️ Layout Components

### Navbar
```html
<nav class="navbar">
  <div class="navbar-brand">
    <img src="logo.png" alt="Logo" />
    <span>Sky266</span>
  </div>
</nav>
```

### Sidebar
```html
<aside class="sidebar">
  <div class="sidebar-item active">Dashboard</div>
  <div class="sidebar-item">Profile</div>
  <div class="sidebar-item">Settings</div>
</aside>
```

## 📱 Responsive Design

The theme is fully responsive with breakpoints at:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🌙 Dark Mode

Dark mode is automatically applied based on system preferences:
```css
@media (prefers-color-scheme: dark) {
  /* Dark mode styles */
}
```

## 🎯 Usage in React Components

### Using CSS Classes
```tsx
import React from 'react';

export default function MyComponent() {
  return (
    <div className="card">
      <h2 className="gradient-text-sky">Welcome</h2>
      <p>This is a styled component</p>
      <button className="btn btn-primary">Get Started</button>
    </div>
  );
}
```

### Combining with Tailwind
```tsx
<div className="card p-6 max-w-md mx-auto">
  <h3 className="text-2xl font-bold mb-4">Title</h3>
  <button className="btn btn-primary w-full">Submit</button>
</div>
```

## 📝 Best Practices

1. **Use semantic classes**: Prefer `.btn-primary` over inline styles
2. **Combine utilities**: Mix custom classes with Tailwind utilities
3. **Maintain consistency**: Use the defined color palette
4. **Accessibility**: Ensure sufficient color contrast
5. **Performance**: Avoid excessive animations on mobile

## 🔧 Customization

To customize colors, edit `src/styles/custom.css`:

```css
:root {
  --sky-500: #your-color;
  --sky-600: #your-darker-color;
  /* etc. */
}
```

## 📦 Files Structure

```
src/
├── styles/
│   ├── globals.css      # Tailwind base + theme variables
│   └── custom.css       # Custom professional theme
├── components/
│   └── StyleShowcase.tsx # Demo of all styles
└── main.tsx             # Imports both CSS files
```

## 🚀 Quick Start

1. All styles are automatically loaded via `main.tsx`
2. Use the classes in your components
3. Check `StyleShowcase.tsx` for examples
4. Customize colors in `custom.css` if needed

## 💡 Tips

- Use `gradient-text-sky` for eye-catching headings
- Apply `hover-lift` to interactive cards
- Combine `card` with `glow-sky` for emphasis
- Use `stat-card` for dashboard metrics
- Apply `fade-in` to page content for smooth loading

---

**Created for Sky266 Cybersecurity Awareness Platform**


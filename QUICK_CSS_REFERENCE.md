# 🎨 Quick CSS Reference - Sky Blue Theme

## 🎯 Most Used Classes

### Buttons
```html
<button class="btn btn-primary">Primary Action</button>
<button class="btn btn-secondary">Secondary Action</button>
<button class="btn btn-ghost">Subtle Action</button>
```

### Cards
```html
<div class="card">Standard Card</div>
<div class="card-sky">Sky Themed Card</div>
<div class="stat-card">
  <div class="stat-value">95%</div>
  <div class="stat-label">Completion</div>
</div>
```

### Badges
```html
<span class="badge badge-primary">Info</span>
<span class="badge badge-success">Success</span>
<span class="badge badge-warning">Warning</span>
<span class="badge badge-error">Error</span>
```

### Progress Bar
```html
<div class="progress-container">
  <div class="progress-bar" style="width: 75%"></div>
</div>
```

### Alerts
```html
<div class="alert alert-info">Information message</div>
<div class="alert alert-success">Success message</div>
<div class="alert alert-warning">Warning message</div>
<div class="alert alert-error">Error message</div>
```

### Input
```html
<input type="text" class="input" placeholder="Enter text" />
```

### Gradients
```html
<div class="gradient-sky">Sky Gradient Background</div>
<h1 class="gradient-text-sky">Gradient Text</h1>
```

## 🎨 Color Variables

```css
/* Use in your custom styles */
var(--sky-500)  /* Primary sky blue */
var(--sky-600)  /* Darker sky blue */
var(--sky-400)  /* Lighter sky blue */
var(--white)    /* Pure white */
var(--black)    /* Pure black */
```

## ✨ Utility Classes

```html
<!-- Colors -->
<div class="text-sky">Sky blue text</div>
<div class="bg-sky">Sky blue background</div>
<div class="border-sky">Sky blue border</div>

<!-- Effects -->
<div class="shadow-sky">Sky blue shadow</div>
<div class="glow-sky">Sky blue glow</div>
<div class="hover-lift">Lifts on hover</div>

<!-- Animations -->
<div class="fade-in">Fades in</div>
<div class="slide-in">Slides in</div>
<div class="pulse">Pulses</div>
```

## 📐 Layout Components

### Navbar
```html
<nav class="navbar">
  <div class="navbar-brand">
    <img src="logo.png" alt="Logo" />
    <span>Brand Name</span>
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

### Table
```html
<table class="table">
  <thead>
    <tr>
      <th>Header 1</th>
      <th>Header 2</th>
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

## 🔥 Common Patterns

### Card with Button
```html
<div class="card hover-lift">
  <h3 class="gradient-text-sky">Card Title</h3>
  <p>Card description goes here</p>
  <button class="btn btn-primary">Action</button>
</div>
```

### Stat Dashboard
```html
<div class="grid grid-cols-1 md:grid-cols-4 gap-6">
  <div class="stat-card">
    <div class="stat-value">156</div>
    <div class="stat-label">Total Users</div>
  </div>
  <!-- Repeat for more stats -->
</div>
```

### Alert with Icon
```html
<div class="alert alert-info">
  <svg class="w-5 h-5"><!-- icon --></svg>
  <div>
    <strong>Info:</strong> Your message here
  </div>
</div>
```

### Form Field
```html
<div class="space-y-2">
  <label class="block text-sm font-medium">Email</label>
  <input type="email" class="input" placeholder="you@example.com" />
</div>
```

### Progress with Label
```html
<div>
  <div class="flex justify-between mb-2">
    <span class="text-sm font-medium">Progress</span>
    <span class="text-sm text-gray-600">75%</span>
  </div>
  <div class="progress-container">
    <div class="progress-bar" style="width: 75%"></div>
  </div>
</div>
```

## 🎯 React Examples

### Button Component
```tsx
<button className="btn btn-primary">
  <Icon className="w-5 h-5" />
  Click Me
</button>
```

### Card Component
```tsx
<div className="card p-6 max-w-md mx-auto">
  <h3 className="text-2xl font-bold mb-4 gradient-text-sky">
    Welcome
  </h3>
  <p className="mb-4">Description text</p>
  <button className="btn btn-primary w-full">
    Get Started
  </button>
</div>
```

### Dashboard Stat
```tsx
<div className="stat-card">
  <div className="stat-value">{count}</div>
  <div className="stat-label">Active Users</div>
</div>
```

## 💡 Pro Tips

1. **Combine classes**: Mix custom classes with Tailwind utilities
   ```html
   <div class="card p-6 max-w-md mx-auto hover-lift">
   ```

2. **Use gradients for headers**: Makes them stand out
   ```html
   <h1 class="gradient-text-sky">Important Title</h1>
   ```

3. **Add hover effects**: Makes UI feel responsive
   ```html
   <div class="card hover-lift">
   ```

4. **Use stat cards for metrics**: Perfect for dashboards
   ```html
   <div class="stat-card">
   ```

5. **Apply glow for emphasis**: Draws attention
   ```html
   <div class="card glow-sky">
   ```

## 🎨 Color Combinations

### Primary Actions
- Background: `gradient-sky`
- Text: `text-white`
- Border: `border-sky-600`

### Secondary Actions
- Background: `bg-white`
- Text: `text-sky-600`
- Border: `border-sky-500`

### Success States
- Background: `bg-green-50`
- Text: `text-green-700`
- Border: `border-green-500`

### Warning States
- Background: `bg-yellow-50`
- Text: `text-yellow-700`
- Border: `border-yellow-500`

### Error States
- Background: `bg-red-50`
- Text: `text-red-700`
- Border: `border-red-500`

## 📱 Responsive Classes

Combine with Tailwind responsive prefixes:

```html
<!-- Stack on mobile, grid on desktop -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
  <div class="card">Card 1</div>
  <div class="card">Card 2</div>
  <div class="card">Card 3</div>
</div>

<!-- Hide on mobile, show on desktop -->
<div class="hidden md:block">
  Desktop only content
</div>

<!-- Full width on mobile, fixed width on desktop -->
<div class="w-full md:w-96">
  Responsive width
</div>
```

## 🚀 Quick Start Checklist

- [ ] Import CSS in `main.tsx` (already done)
- [ ] Use `.btn btn-primary` for main actions
- [ ] Use `.card` for content containers
- [ ] Use `.gradient-text-sky` for headings
- [ ] Use `.stat-card` for dashboard metrics
- [ ] Use `.alert` for notifications
- [ ] Use `.progress-bar` for progress indicators
- [ ] Add `.hover-lift` for interactive elements

## 📚 Full Documentation

For complete documentation, see:
- `CSS_GUIDE.md` - Comprehensive usage guide
- `CSS_IMPLEMENTATION_SUMMARY.md` - Implementation details
- `src/components/StyleShowcase.tsx` - Live examples

---

**Quick Tip**: Check `StyleShowcase.tsx` to see all styles in action!


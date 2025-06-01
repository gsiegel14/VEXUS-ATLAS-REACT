# 🚀 VEXUS ATLAS - React Application

A modern React application built with Material-UI (MUI) for venous excess ultrasound assessment and education. This application follows a modular architecture with unified design elements shared consistently across all pages.

## 🏗️ Architecture Overview

This application implements a **modular, component-based architecture** following atomic design principles:

### Design System Foundation
- **Design Tokens**: Centralized colors, typography, spacing, and shadows
- **Theme Configuration**: MUI theme with custom component overrides
- **Consistent Styling**: All components use design tokens, no hardcoded values

### Component Hierarchy
```
📁 src/
├── 📁 design-system/          # 🎨 Unified Design System
│   ├── 📁 tokens/             # Design tokens (colors, typography, spacing)
│   └── 📁 theme/              # MUI theme configuration
│
├── 📁 components/             # 🔄 Modular Component Library
│   ├── 📁 organisms/          # Complex UI sections
│   │   ├── 📁 GlobalHeader/   # 🔄 SHARED across ALL pages
│   │   ├── 📁 GlobalFooter/   # 🔄 SHARED across ALL pages
│   │   └── 📁 Navigation/     # 🔄 SHARED navigation system
│   │
│   ├── 📁 templates/          # Page layout templates
│   │   └── 📁 BaseLayout/     # 🔄 UNIVERSAL layout wrapper
│   │
│   ├── 📁 pages/              # Page-specific components
│   │   └── 📁 About/          # About page content
│   │
│   └── 📁 common/             # Shared utilities
│       └── 📁 SEO/            # SEO component
│
└── 📁 pages/                  # Main page components
    └── About.tsx              # About page using BaseLayout
```

## 🔄 Modular Architecture Principles

### 1. **Shared Components Everywhere**
- **GlobalHeader**: Identical across all pages (logo, navigation, CTA button)
- **GlobalFooter**: Identical across all pages (links, branding, contact info)
- **BaseLayout**: Universal wrapper that includes header + footer automatically

### 2. **Design Token System**
- All colors, fonts, spacing values centralized in design tokens
- No hardcoded CSS values anywhere in the application
- Consistent visual design across all components

### 3. **Page Assembly Pattern**
Every page follows this exact pattern:
```tsx
// Standard page composition
import BaseLayout from '@/components/templates/BaseLayout/BaseLayout';
import PageContent from '@/components/pages/PageName/PageContent';

export default function Page() {
  return (
    <BaseLayout pageTitle="Page Name">
      {/* BaseLayout provides header/footer automatically */}
      <PageContent />
    </BaseLayout>
  );
}
```

## 🎨 Design System

### Color Palette
- **Primary Brand**: `#43c3ac` (VEXUS teal)
- **Backgrounds**: `#f9f9f9` (cards), `#ffffff` (sections)
- **Text**: `#333` (headings), `#555` (body text)
- **Borders**: `#e0e0e0`

### Typography
- **Font Family**: "proxima-nova", "Helvetica Neue", Helvetica, Arial, sans-serif
- **Responsive Sizing**: Mobile-first approach with breakpoint-specific sizes
- **Line Height**: 1.7 for optimal readability

### Spacing System
- **Consistent Scale**: 4px base unit (4px, 8px, 12px, 16px, 24px, etc.)
- **Component Spacing**: Standardized padding and margins
- **Responsive Spacing**: Adapts to screen size

## 📱 Responsive Design

### Breakpoints
- **xs**: 0px+ (Mobile portrait)
- **sm**: 600px+ (Mobile landscape)
- **md**: 768px+ (Tablet)
- **lg**: 980px+ (Desktop)
- **xl**: 1200px+ (Large desktop)

### Mobile-First Approach
- All components designed for mobile first
- Progressive enhancement for larger screens
- Touch-friendly interactions on mobile devices

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies**:
```bash
npm install
```

2. **Start development server**:
```bash
npm run dev
```

3. **Open browser**:
Navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run type-check` - Run TypeScript type checking
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage

## 🧪 Testing

### Testing Strategy
- **Unit Tests**: All shared components tested
- **Integration Tests**: Page assembly and routing
- **Accessibility Tests**: WCAG 2.1 AA compliance
- **Visual Regression**: Component consistency

### Running Tests
```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📦 Dependencies

### Core Dependencies
- **React 18**: Modern React with hooks and concurrent features
- **Material-UI v5**: Component library with theming
- **Emotion**: CSS-in-JS styling solution
- **React Router**: Client-side routing
- **React Helmet Async**: SEO meta tag management

### Development Dependencies
- **TypeScript**: Type safety and better developer experience
- **Vite**: Fast build tool and development server
- **ESLint**: Code linting and formatting
- **Jest**: Testing framework
- **Testing Library**: React component testing utilities

## 🔧 Configuration

### Path Aliases
```typescript
// Configured in vite.config.ts and tsconfig.json
'@/*': 'src/*'
'@/components/*': 'src/components/*'
'@/design-system/*': 'src/design-system/*'
'@/pages/*': 'src/pages/*'
```

### TypeScript
- Strict mode enabled
- Path mapping configured
- Type checking for all components

## 🎯 Key Features

### ✅ **Modular Architecture**
- Shared header/footer across all pages
- Reusable component library
- Consistent design system

### ✅ **Responsive Design**
- Mobile-first approach
- Breakpoint-specific styling
- Touch-friendly interactions

### ✅ **Accessibility**
- WCAG 2.1 AA compliance
- Semantic HTML structure
- Keyboard navigation support
- Screen reader compatibility

### ✅ **SEO Optimized**
- Meta tags and OpenGraph
- Structured data
- Performance optimized

### ✅ **Performance**
- Code splitting
- Lazy loading
- Optimized bundle size
- Fast development server

## 📄 Pages

### About Page (`/about`)
- **Content**: Mission, vision, what we do, innovation
- **Layout**: Card-based sections with consistent styling
- **SEO**: Complete meta tags and structured data
- **Responsive**: Mobile-optimized layout

## 🔄 Adding New Pages

To add a new page following the modular architecture:

1. **Create page content component**:
```tsx
// src/components/pages/NewPage/NewPageContent.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';

const NewPageContent: React.FC = () => {
  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h1">New Page</Typography>
      {/* Page-specific content only */}
    </Box>
  );
};

export default NewPageContent;
```

2. **Create main page component**:
```tsx
// src/pages/NewPage.tsx
import React from 'react';
import BaseLayout from '@/components/templates/BaseLayout/BaseLayout';
import NewPageContent from '@/components/pages/NewPage/NewPageContent';
import SEO from '@/components/common/SEO/SEO';

const NewPage: React.FC = () => {
  return (
    <>
      <SEO title="New Page - VEXUS ATLAS" description="..." />
      <BaseLayout pageTitle="New Page">
        <NewPageContent />
      </BaseLayout>
    </>
  );
};

export default NewPage;
```

3. **Add route to App.tsx**:
```tsx
<Route path="/new-page" element={<NewPage />} />
```

**Result**: New page automatically has identical header, footer, and navigation as all other pages!

## 🎨 Design Consistency

### Critical Principle
**Every page MUST use the same shared components:**
- ✅ All pages use `BaseLayout` wrapper
- ✅ All pages get identical `GlobalHeader`
- ✅ All pages get identical `GlobalFooter`
- ✅ All styling uses design tokens
- ❌ No page implements its own header/footer
- ❌ No hardcoded colors, fonts, or spacing

### Quality Assurance
- Visual regression testing ensures header/footer consistency
- Linting rules prevent hardcoded values
- Component library documented in Storybook
- Accessibility testing for all shared components

## 📈 Performance Metrics

- **Bundle Size**: Optimized with tree shaking
- **Core Web Vitals**: LCP < 2.5s, FID < 100ms, CLS < 0.1
- **Lighthouse Score**: 90+ across all categories
- **Accessibility**: WCAG 2.1 AA compliant

## 🤝 Contributing

1. Follow the modular architecture principles
2. Use design tokens for all styling
3. Ensure components are reusable
4. Write tests for new components
5. Maintain accessibility standards

## 📝 License

This project is private and proprietary to VEXUS ATLAS.

---

**Built with ❤️ using React, Material-UI, and modern web technologies** 
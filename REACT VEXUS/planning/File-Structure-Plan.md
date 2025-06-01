# 📁 VEXUS React + MUI: Complete File Organization Plan

## ⚡ **CRITICAL MODAL IMAGE PREDICTION WORKFLOW**

### **🎯 Core Functionality: Image Upload → Crop → Modal Prediction → Display**

```
USER WORKFLOW:
1. 📤 Upload ultrasound image (hepatic/portal/renal)
2. ✂️  Crop image to focus on relevant waveform area
3. 🚀 Send cropped image to Modal.run AI endpoint
4. 🤖 Receive AI prediction with confidence scores
5. 📊 Display prediction results for VEXUS calculation
```

**This workflow is implemented across these key components:**

```
src/components/forms/Calculator/
├── 📄 ImageUploadStep.tsx        # Step 1: File upload UI
├── 📄 ImageCropStep.tsx          # Step 2: Cropping interface  
├── 📄 ModalPredictionStep.tsx    # Step 3: Send to AI endpoint
├── 📄 ResultsDisplayStep.tsx     # Step 4-5: Show predictions
└── 📄 CalculatorStepper.tsx      # Orchestrates entire workflow

src/services/
├── 📄 modalPrediction.ts         # Handles Modal.run API calls
└── 📄 imageProcessing.ts         # Image upload & cropping logic

src/hooks/
├── 📄 useModalPrediction.ts      # Manages prediction state
└── 📄 useImageWorkflow.ts        # Orchestrates full workflow
```

---

## 🏗️ **Project Root Structure**

```
vexus-react-mui/
├── 📁 src/                      # Main source code
├── 📁 public/                   # Static assets (from Astro project)
├── 📁 docs/                     # Project documentation
├── 📁 tests/                    # Test files and utilities
├── 📁 .vscode/                  # VS Code settings
├── 📄 package.json
├── 📄 tsconfig.json
├── 📄 next.config.js
├── 📄 .eslintrc.js
├── 📄 .gitignore
└── 📄 README.md
```

---

## 📂 **Detailed `/src` Directory Structure**

```
src/
├── 📁 app/                      # Next.js 14 App Router
│   ├── 📁 (pages)/              # Route groups for organization
│   │   ├── 📁 about/
│   │   ├── 📁 calculator/
│   │   ├── 📁 contact/
│   │   ├── 📁 education/
│   │   ├── 📁 image-atlas/
│   │   ├── 📁 literature-review/
│   │   ├── 📁 publications/
│   │   ├── 📁 team/
│   │   ├── 📁 waveform/
│   │   └── 📁 acquisition/
│   ├── 📁 api/                  # API routes (if needed)
│   ├── 📄 layout.tsx            # Root layout
│   ├── 📄 page.tsx              # Homepage
│   ├── 📄 loading.tsx           # Global loading UI
│   ├── 📄 error.tsx             # Global error UI
│   ├── 📄 not-found.tsx         # 404 page
│   └── 📄 globals.css           # Global styles
│
├── 📁 components/               # All React components
│   ├── 📁 common/               # Reusable UI components
│   │   ├── 📁 Button/
│   │   │   ├── 📄 Button.tsx
│   │   │   ├── 📄 Button.types.ts
│   │   │   ├── 📄 Button.styles.ts
│   │   │   └── 📄 index.ts
│   │   ├── 📁 Card/
│   │   │   ├── 📄 Card.tsx
│   │   │   ├── 📄 Card.types.ts
│   │   │   └── 📄 index.ts
│   │   ├── 📁 Image/
│   │   │   ├── 📄 ResponsiveImage.tsx
│   │   │   ├── 📄 LazyImage.tsx
│   │   │   └── 📄 index.ts
│   │   ├── 📁 Loading/
│   │   │   ├── 📄 Spinner.tsx
│   │   │   ├── 📄 SkeletonLoader.tsx
│   │   │   └── 📄 index.ts
│   │   ├── 📁 Modal/
│   │   │   ├── 📄 Modal.tsx
│   │   │   ├── 📄 ImageModal.tsx
│   │   │   └── 📄 index.ts
│   │   ├── 📁 Typography/
│   │   │   ├── 📄 Heading.tsx
│   │   │   ├── 📄 Text.tsx
│   │   │   └── 📄 index.ts
│   │   └── 📄 index.ts           # Barrel exports
│   │
│   ├── 📁 layout/               # Layout-specific components
│   │   ├── 📁 Header/
│   │   │   ├── 📄 Header.tsx
│   │   │   ├── 📄 HeaderDesktop.tsx
│   │   │   ├── 📄 HeaderMobile.tsx
│   │   │   ├── 📄 Header.types.ts
│   │   │   └── 📄 index.ts
│   │   ├── 📁 Navigation/
│   │   │   ├── 📄 Navigation.tsx
│   │   │   ├── 📄 NavigationMenu.tsx
│   │   │   ├── 📄 NavigationItem.tsx
│   │   │   ├── 📄 MobileNavigation.tsx
│   │   │   ├── 📄 NavigationDrawer.tsx
│   │   │   └── 📄 index.ts
│   │   ├── 📁 Footer/
│   │   │   ├── 📄 Footer.tsx
│   │   │   ├── 📄 FooterLinks.tsx
│   │   │   ├── 📄 FooterSocial.tsx
│   │   │   └── 📄 index.ts
│   │   ├── 📁 Sidebar/
│   │   │   ├── 📄 Sidebar.tsx
│   │   │   ├── 📄 SidebarMenu.tsx
│   │   │   └── 📄 index.ts
│   │   ├── 📄 MainLayout.tsx
│   │   ├── 📄 PageLayout.tsx
│   │   └── 📄 index.ts
│   │
│   ├── 📁 sections/             # Page section components
│   │   ├── 📁 Hero/
│   │   │   ├── 📄 HeroSection.tsx
│   │   │   ├── 📄 HeroImage.tsx
│   │   │   ├── 📄 HeroContent.tsx
│   │   │   └── 📄 index.ts
│   │   ├── 📁 Gallery/
│   │   │   ├── 📄 ProjectsGallery.tsx
│   │   │   ├── 📄 ImageGallery.tsx
│   │   │   ├── 📄 GalleryCard.tsx
│   │   │   ├── 📄 GalleryGrid.tsx
│   │   │   └── 📄 index.ts
│   │   ├── 📁 Carousel/
│   │   │   ├── 📄 ProductCarousel.tsx
│   │   │   ├── 📄 CarouselSlide.tsx
│   │   │   ├── 📄 CarouselControls.tsx
│   │   │   └── 📄 index.ts
│   │   ├── 📁 Content/
│   │   │   ├── 📄 ContentCard.tsx
│   │   │   ├── 📄 WhatsNewSection.tsx
│   │   │   ├── 📄 MissionSection.tsx
│   │   │   ├── 📄 ShopSection.tsx
│   │   │   └── 📄 index.ts
│   │   ├── 📁 Features/
│   │   │   ├── 📄 FeatureGrid.tsx
│   │   │   ├── 📄 FeatureCard.tsx
│   │   │   └── 📄 index.ts
│   │   └── 📄 index.ts
│   │
│   ├── 📁 forms/                # Form components
│   │   ├── 📁 Calculator/
│   │   │   ├── 📄 CalculatorForm.tsx
│   │   │   ├── 📄 CalculatorStep.tsx
│   │   │   ├── 📄 ImageUploadStep.tsx
│   │   │   ├── 📄 ResultsStep.tsx
│   │   │   ├── 📄 CalculatorStepper.tsx
│   │   │   └── 📄 index.ts
│   │   ├── 📁 Contact/
│   │   │   ├── 📄 ContactForm.tsx
│   │   │   ├── 📄 ContactFields.tsx
│   │   │   └── 📄 index.ts
│   │   ├── 📁 Feedback/
│   │   │   ├── 📄 FeedbackForm.tsx
│   │   │   ├── 📄 RatingField.tsx
│   │   │   └── 📄 index.ts
│   │   ├── 📁 Search/
│   │   │   ├── 📄 SearchForm.tsx
│   │   │   ├── 📄 SearchFilters.tsx
│   │   │   └── 📄 index.ts
│   │   └── 📄 index.ts
│   │
│   ├── 📁 features/             # Feature-specific components
│   │   ├── 📁 Education/
│   │   │   ├── 📄 CourseCard.tsx
│   │   │   ├── 📄 LessonList.tsx
│   │   │   ├── 📄 VideoPlayer.tsx
│   │   │   └── 📄 index.ts
│   │   ├── 📁 Calculator/
│   │   │   ├── 📄 AIRecognition.tsx
│   │   │   ├── 📄 ScoreCalculator.tsx
│   │   │   ├── 📄 ResultsDisplay.tsx
│   │   │   └── 📄 index.ts
│   │   ├── 📁 ImageAtlas/
│   │   │   ├── 📄 AtlasGrid.tsx
│   │   │   ├── 📄 AtlasCard.tsx
│   │   │   ├── 📄 AtlasFilters.tsx
│   │   │   ├── 📄 AtlasPagination.tsx
│   │   │   └── 📄 index.ts
│   │   ├── 📁 Waveform/
│   │   │   ├── 📄 WaveformViewer.tsx
│   │   │   ├── 📄 WaveformControls.tsx
│   │   │   └── 📄 index.ts
│   │   └── 📄 index.ts
│   │
│   ├── 📁 providers/            # Context providers
│   │   ├── 📄 ThemeProvider.tsx
│   │   ├── 📄 AuthProvider.tsx
│   │   ├── 📄 CalculatorProvider.tsx
│   │   └── 📄 index.ts
│   │
│   └── 📄 index.ts              # Root barrel export
│
├── 📁 hooks/                    # Custom React hooks
│   ├── 📁 common/
│   │   ├── 📄 useLocalStorage.ts
│   │   ├── 📄 useDebounce.ts
│   │   ├── 📄 useClickOutside.ts
│   │   └── 📄 index.ts
│   ├── 📁 layout/
│   │   ├── 📄 useResponsive.ts
│   │   ├── 📄 useNavigation.ts
│   │   ├── 📄 useMobileMenu.ts
│   │   └── 📄 index.ts
│   ├── 📁 features/
│   │   ├── 📄 useCarousel.ts
│   │   ├── 📄 useImageUpload.ts
│   │   ├── 📄 useCalculator.ts
│   │   ├── 📄 useGallery.ts
│   │   ├── 📄 useImageModal.ts
│   │   └── 📄 index.ts
│   └── 📄 index.ts
│
├── 📁 lib/                      # External library configurations
│   ├── 📄 axios.ts              # API client setup
│   ├── 📄 validation.ts         # Form validation schemas
│   ├── 📄 analytics.ts          # Analytics setup
│   └── 📄 index.ts
│
├── 📁 services/                 # API services and data fetching
│   ├── 📄 api.ts                # Base API service
│   ├── 📄 calculator.ts         # Calculator API calls
│   ├── 📄 images.ts             # Image handling services
│   ├── 📄 education.ts          # Education content API
│   └── 📄 index.ts
│
├── 📁 store/                    # State management
│   ├── 📁 slices/
│   │   ├── 📄 calculatorSlice.ts
│   │   ├── 📄 navigationSlice.ts
│   │   └── 📄 uiSlice.ts
│   ├── 📄 store.ts              # Store configuration
│   └── 📄 index.ts
│
├── 📁 theme/                    # MUI theme configuration
│   ├── 📄 index.ts              # Main theme export
│   ├── 📄 colors.ts             # Color palette
│   ├── 📄 typography.ts         # Typography settings
│   ├── 📄 components.ts         # Component overrides
│   ├── 📄 breakpoints.ts        # Responsive breakpoints
│   ├── 📄 shadows.ts            # Shadow definitions
│   └── 📄 animations.ts         # Animation variants
│
├── 📁 types/                    # TypeScript type definitions
│   ├── 📄 global.ts             # Global types
│   ├── 📄 components.ts         # Component prop types
│   ├── 📄 navigation.ts         # Navigation types
│   ├── 📄 api.ts                # API response types
│   ├── 📄 calculator.ts         # Calculator-specific types
│   ├── 📄 education.ts          # Education content types
│   ├── 📄 forms.ts              # Form types
│   └── 📄 index.ts
│
├── 📁 utils/                    # Utility functions
│   ├── 📄 routes.ts             # Route definitions
│   ├── 📄 constants.ts          # App constants
│   ├── 📄 helpers.ts            # General helper functions
│   ├── 📄 formatters.ts         # Data formatting utilities
│   ├── 📄 validators.ts         # Validation utilities
│   ├── 📄 analytics.ts          # Analytics helpers
│   ├── 📄 seo.ts                # SEO utilities
│   └── 📄 index.ts
│
├── 📁 styles/                   # Styling files
│   ├── 📄 globals.css           # Global CSS styles
│   ├── 📄 variables.css         # CSS custom properties
│   ├── 📄 animations.css        # CSS animations
│   └── 📄 muiOverrides.ts       # MUI component overrides
│
└── 📁 __tests__/                # Test utilities and setup
    ├── 📁 __mocks__/
    ├── 📄 setup.ts
    ├── 📄 testUtils.tsx
    └── 📄 index.ts
```

---

## 📄 **Page Files Organization (App Router)**

```
src/app/
├── 📄 layout.tsx                # Root layout with providers
├── 📄 page.tsx                  # Homepage (index.astro)
├── 📄 loading.tsx               # Global loading component
├── 📄 error.tsx                 # Error boundary
├── 📄 not-found.tsx             # 404 page
│
├── 📁 about/
│   ├── 📄 page.tsx              # About page (about.astro)
│   └── 📄 loading.tsx
│
├── 📁 calculator/
│   ├── 📄 page.tsx              # Calculator page (calculator.astro)
│   ├── 📄 loading.tsx
│   └── 📁 results/
│       └── 📄 page.tsx          # Calculator results page
│
├── 📁 contact/
│   ├── 📄 page.tsx              # Contact page (contact.astro)
│   └── 📄 loading.tsx
│
├── 📁 education/
│   ├── 📄 page.tsx              # Education page (education.astro)
│   ├── 📄 loading.tsx
│   └── 📁 [courseId]/
│       └── 📄 page.tsx          # Individual course pages
│
├── 📁 image-atlas/
│   ├── 📄 page.tsx              # Image atlas page (image-atlas.astro)
│   ├── 📄 loading.tsx
│   └── 📁 [category]/
│       └── 📄 page.tsx          # Category-specific atlas pages
│
├── 📁 literature-review/
│   ├── 📄 page.tsx              # Literature review (literature-review.astro)
│   └── 📄 loading.tsx
│
├── 📁 publications/
│   ├── 📄 page.tsx              # Publications page (publications.astro)
│   ├── 📄 loading.tsx
│   └── 📁 [publicationId]/
│       └── 📄 page.tsx          # Individual publication pages
│
├── 📁 team/
│   ├── 📄 page.tsx              # Team page (team.astro)
│   └── 📄 loading.tsx
│
├── 📁 waveform/
│   ├── 📄 page.tsx              # Waveform page (waveform.astro)
│   └── 📄 loading.tsx
│
└── 📁 acquisition/
    ├── 📄 page.tsx              # Acquisition page (acquisition.astro)
    └── 📄 loading.tsx
```

---

## 🔧 **Configuration Files**

### **Root Level Files:**

```
📄 package.json                 # Dependencies and scripts
📄 tsconfig.json               # TypeScript configuration
📄 next.config.js              # Next.js configuration
📄 tailwind.config.js          # Tailwind CSS (if used)
📄 .eslintrc.js                # ESLint configuration
📄 .prettierrc                 # Prettier configuration
📄 .gitignore                  # Git ignore rules
📄 README.md                   # Project documentation
📄 CHANGELOG.md                # Version history
```

### **VS Code Settings (`.vscode/`):**

```
📄 settings.json               # Workspace settings
📄 extensions.json             # Recommended extensions
📄 launch.json                 # Debug configuration
```

---

## 📁 **Public Assets Structure**

```
public/
├── 📁 images/                  # Organized by category (see Image-Migration-Plan.md)
│   ├── 📁 logos/              # VEXUS ATLAS and POCUS ATLAS logos
│   │   ├── 📄 vexus-atlas-logo.png
│   │   └── 📄 pocus-atlas-logo.png
│   ├── 📁 icons/              # UI icons for project gallery
│   │   ├── 📄 atlas-icon.png
│   │   ├── 📄 literature-icon.png
│   │   ├── 📄 nerve-icon.png
│   │   ├── 📄 video-review-icon.png
│   │   └── 📄 apps-icon.jpg
│   ├── 📁 team/               # Team member photos (optimized)
│   │   ├── 📄 august-longino.jpg
│   │   ├── 📄 gabriel-siegel.jpg
│   │   ├── 📄 matthew-riscinti.jpg
│   │   ├── 📄 ed-gill.jpg
│   │   ├── 📄 ivor-douglas.jpg
│   │   ├── 📄 nhu-nguyen-le.jpg
│   │   ├── 📄 fred-milgrim.jpg
│   │   ├── 📄 peter-alsharif.jpg
│   │   ├── 📄 luke-mccormack.jpg
│   │   └── 📄 kisha-thayapran.png
│   ├── 📁 products/           # Shop merchandise images
│   │   ├── 📄 pocus-life-dark-tshirt.jpg
│   │   ├── 📄 pocus-life-light-tshirt.jpg
│   │   ├── 📄 pocus-atlas-cream-tshirt.jpg
│   │   ├── 📄 sonophile-tshirt.jpg
│   │   └── 📄 pocus-atlas-mug.jpg
│   ├── 📁 education/          # Educational diagrams
│   │   ├── 📄 organ-perfusion-diagram.png
│   │   ├── 📄 venous-congestion-patterns.png
│   │   └── 📄 vexus-overview-diagram.png
│   ├── 📁 acquisition/        # Image acquisition guide assets
│   │   ├── 📄 ivc-assessment.png
│   │   ├── 📄 ivc-ruq-view.png
│   │   ├── 📄 hepatic-long-axis.png
│   │   ├── 📄 hepatic-short-axis.png
│   │   ├── 📄 hepatic-subxiphoid.png
│   │   ├── 📄 portal-long-axis.png
│   │   ├── 📄 portal-short-axis.png
│   │   ├── 📄 portal-subxiphoid.png
│   │   ├── 📄 renal-long-axis.png
│   │   ├── 📄 renal-long-still.png
│   │   ├── 📄 renal-short-axis.png
│   │   └── 📁 gifs/           # Animated acquisition guides
│   │       ├── 📄 hepatic-long-axis.gif
│   │       ├── 📄 portal-subxiphoid.gif
│   │       ├── 📄 portal-long-axis.gif
│   │       └── 📄 renal-short-axis.gif
│   ├── 📁 waveforms/          # Doppler waveform patterns
│   │   ├── 📄 ekg-hepatic-tracing.png
│   │   ├── 📄 hepatic-normal-asvd.png
│   │   ├── 📄 hepatic-normal-pattern.png
│   │   ├── 📄 hepatic-mild-congestion.png
│   │   ├── 📄 hepatic-severe-reversal.png
│   │   ├── 📄 portal-normal-flow.png
│   │   ├── 📄 portal-mild-pulsatile.png
│   │   ├── 📄 portal-severe-pulsatile.png
│   │   ├── 📄 renal-normal-continuous.png
│   │   ├── 📄 renal-mild-biphasic.png
│   │   ├── 📄 renal-severe-monophasic.png
│   │   └── 📄 vexus-grading-system.png
│   ├── 📁 projects/           # Project showcase images
│   │   └── 📄 pocus-atlas-jr.jpg
│   └── 📁 courses/            # Course and event images
│       └── 📄 san-diego-course.jpg
├── 📁 videos/                  # Video assets
├── 📁 documents/               # PDF and document files
├── 📁 fonts/                   # Custom fonts (if any)
├── 📄 favicon.ico
├── 📄 apple-touch-icon.png
├── 📄 robots.txt
├── 📄 sitemap.xml
└── 📄 manifest.json            # PWA manifest
```

**📋 Note:** See `Image-Migration-Plan.md` for complete image inventory, copy commands, and component requirements per page.

---

## 📚 **Documentation Structure**

```
docs/
├── 📄 README.md                # Project overview
├── 📄 SETUP.md                 # Development setup guide
├── 📄 DEPLOYMENT.md            # Deployment instructions
├── 📄 CONVERSION_LOG.md        # Conversion progress log
├── 📄 COMPONENT_GUIDE.md       # Component usage guide
├── 📄 STYLE_GUIDE.md           # Design system documentation
├── 📄 API.md                   # API documentation
└── 📁 assets/                  # Documentation images
```

---

## 🧪 **Testing Structure**

```
tests/
├── 📁 __mocks__/               # Mock files
│   ├── 📄 fileMock.js
│   └── 📄 styleMock.js
├── 📁 components/              # Component tests
│   ├── 📁 common/
│   ├── 📁 layout/
│   └── 📁 sections/
├── 📁 pages/                   # Page tests
├── 📁 hooks/                   # Hook tests
├── 📁 utils/                   # Utility tests
├── 📄 setup.ts                 # Test setup
├── 📄 testUtils.tsx            # Testing utilities
└── 📄 jest.config.js           # Jest configuration
```

---

## 📋 **File Creation Priority**

### **Phase 1: Foundation (Week 1)**
1. Project setup and configuration files
2. Theme configuration files
3. Basic layout components (MainLayout, Header, Footer)
4. Common UI components (Button, Card, Typography)

### **Phase 2: Core Structure (Week 2)**
1. Navigation components
2. Homepage sections
3. Responsive hooks
4. Route definitions

### **Phase 3: Feature Components (Week 3-5)**
1. Calculator components
2. Image atlas components
3. Education components
4. Form components

### **Phase 4: Polish & Testing (Week 6-7)**
1. Test files
2. Documentation
3. Performance optimization
4. Accessibility improvements

---

## 🎯 **Naming Conventions**

### **Files:**
- Components: `PascalCase.tsx` (e.g., `HeaderNavigation.tsx`)
- Hooks: `camelCase.ts` (e.g., `useResponsive.ts`)
- Utils: `camelCase.ts` (e.g., `formatDate.ts`)
- Types: `camelCase.ts` (e.g., `navigation.ts`)

### **Folders:**
- Component folders: `PascalCase/` (e.g., `Header/`)
- Feature folders: `kebab-case/` (e.g., `image-atlas/`)
- Utility folders: `camelCase/` (e.g., `hooks/`)

### **Exports:**
- Use barrel exports (`index.ts`) in each component folder
- Named exports for components
- Default exports for pages

This structure ensures scalability, maintainability, and clear organization for the VEXUS React conversion! 🚀 
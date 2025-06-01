# 🚀 VEXUS ATLAS: Astro to React + MUI Conversion Plan

## 📋 **Project Overview**

**GOAL:** Convert the entire VEXUS ATLAS Astro project to a modern React application using Material-UI (MUI) while maintaining the exact visual appearance and functionality.

**Current Stack:** Astro + Traditional CSS + jQuery  
**Target Stack:** React 18 + TypeScript + MUI v6 + Next.js + Styled Components

---

## ⚡ **CRITICAL: Modal Image Prediction Workflow**

### **🎯 MUST PRESERVE EXACTLY: Upload → Crop → Modal → Display**

This is the **CORE FUNCTIONALITY** of the VEXUS calculator that must work identically:

```
┌─────────────────────────────────────────────────────────────────┐
│  MODAL IMAGE PREDICTION WORKFLOW (3 VEIN TYPES)                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. 📤 USER UPLOADS IMAGE                                       │
│     └── Accept: .jpg, .png, .webp ultrasound images            │
│                                                                 │
│  2. ✂️  CROP IMAGE                                              │
│     └── Focus on waveform + EKG lead area only                 │
│                                                                 │
│  3. 🚀 SEND TO MODAL.RUN ENDPOINT                              │
│     ├── Hepatic: gsiegel14--vexus-hepatic-endpoint...          │
│     ├── Portal:  gsiegel14--vexus-renal-portal-endpoint...     │
│     └── Renal:   gsiegel14--vexus-renal-portal-endpoint...     │
│                                                                 │
│  4. 🤖 RECEIVE AI PREDICTION                                    │
│     ├── predicted_severity: "HV_Mild" / "PV_Severe" etc.       │
│     ├── confidence: 0.85                                       │
│     └── all_probabilities: { "HV_Normal": 0.15, ... }          │
│                                                                 │
│  5. 📊 DISPLAY RESULTS                                          │
│     ├── Top 3 predictions with confidence %                    │
│     ├── Allow user to select prediction                        │
│     └── Feed into VEXUS score calculation                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### **🔄 React Implementation Strategy:**

```typescript
// EXACT WORKFLOW REPLICATION:
const useModalPredictionWorkflow = () => {
  // Step 1: Upload handling
  const handleImageUpload = (file: File, veinType: 'hepatic' | 'portal' | 'renal') => {...}
  
  // Step 2: Cropping with Cropper.js (identical to current)
  const showCropTool = (file: File) => {...}
  
  // Step 3: Send to Modal.run endpoint (exact same endpoints)
  const sendToModalEndpoint = async (croppedFile: File, veinType) => {
    const formData = new FormData();
    formData.append('file', croppedFile);
    
    const endpoint = modalEndpoints[veinType]; // SAME URLS
    const response = await fetch(endpoint, { method: 'POST', body: formData });
    return response.json();
  }
  
  // Step 4: Process Modal.run response (identical format)
  const processModalResponse = (data: AIResponse) => {...}
  
  // Step 5: Display results (same UI patterns)
  const displayPredictionResults = (predictions: PredictionResult[]) => {...}
}
```

**⚠️ CRITICAL REQUIREMENTS:**
- **EXACT SAME Modal.run endpoint URLs** 
- **IDENTICAL image preprocessing** (crop, resize, format)
- **SAME API request format** (FormData with 'file' field)
- **IDENTICAL response parsing** (predicted_severity, confidence, all_probabilities)
- **EXACT VEXUS scoring logic** (HV Mild=1, HV Severe=2, etc.)

---

## 📊 **Current Project Analysis**

### **Files Inventory:**
- **Pages:** 14 .astro files (27KB - 74KB each)
- **Components:** 15 .astro components
- **Layouts:** 4 layout files
- **Styles:** 20+ CSS files
- **Assets:** Images, fonts, scripts in `/public`

### **Key Features to Preserve:**
- Responsive navigation with mobile hamburger menu
- Image galleries with lazy loading
- Product carousels
- Calculator with AI image recognition
- Complex grid layouts
- Medical form components

---

## 🏗️ **New React + MUI Architecture**

### **1. Project Structure**
```
vexus-react-mui/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── common/          # Basic UI elements
│   │   │   ├── Button/
│   │   │   ├── Card/
│   │   │   ├── Loading/
│   │   │   └── Image/
│   │   ├── layout/          # Layout components
│   │   │   ├── Header/
│   │   │   ├── Footer/
│   │   │   ├── Navigation/
│   │   │   └── Sidebar/
│   │   ├── sections/        # Page sections
│   │   │   ├── Hero/
│   │   │   ├── Gallery/
│   │   │   ├── ProductCarousel/
│   │   │   └── ContentCard/
│   │   └── forms/           # Form components
│   │       ├── CalculatorForm/
│   │       ├── ContactForm/
│   │       └── FeedbackForm/
│   ├── pages/               # Next.js pages
│   │   ├── index.tsx        # Homepage
│   │   ├── calculator.tsx
│   │   ├── image-atlas.tsx
│   │   └── [...other pages]
│   ├── hooks/               # Custom React hooks
│   │   ├── useResponsive.ts
│   │   ├── useCarousel.ts
│   │   └── useImageUpload.ts
│   ├── theme/               # MUI theme configuration
│   │   ├── index.ts
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   └── components.ts
│   ├── utils/               # Utility functions
│   │   ├── routes.ts
│   │   ├── constants.ts
│   │   └── helpers.ts
│   ├── types/               # TypeScript definitions
│   │   ├── components.ts
│   │   ├── navigation.ts
│   │   └── api.ts
│   └── styles/              # Global styles & MUI overrides
│       ├── globals.css
│       └── muiOverrides.ts
├── public/                  # Static assets (keep existing)
├── docs/                    # Conversion documentation
└── package.json
```

### **2. Technology Stack**

```json
{
  "framework": "Next.js 14",
  "ui": "Material-UI v6",
  "language": "TypeScript",
  "styling": "MUI System + Styled Components",
  "state": "React Context + useReducer",
  "forms": "React Hook Form + Yup",
  "animations": "Framer Motion",
  "testing": "Jest + React Testing Library",
  "linting": "ESLint + Prettier"
}
```

---

## 🎨 **MUI Theme Configuration**

### **Custom Theme Matching Current Design:**

```typescript
// src/theme/index.ts
import { createTheme } from '@mui/material/styles';

export const vexusTheme = createTheme({
  palette: {
    primary: {
      main: '#453E3E',      // Current primary color
      light: '#5c5252',
      dark: '#2c2828',
    },
    secondary: {
      main: '#43c3ac',      // Teal accent from current site
      light: '#6ed4be',
      dark: '#2e8578',
    },
    background: {
      default: '#ffffff',
      paper: '#f8f9fa',
    },
    text: {
      primary: '#333333',
      secondary: '#555555',
    },
  },
  typography: {
    fontFamily: '"europa", "proxima-nova", "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.3,
      '@media (max-width:768px)': {
        fontSize: '2rem',
      },
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      '@media (max-width:768px)': {
        fontSize: '1.75rem',
      },
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      '@media (max-width:768px)': {
        fontSize: '1.5rem',
      },
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  spacing: 8, // 8px base unit
  shape: {
    borderRadius: 4,
  },
});
```

---

## 🧩 **Component Conversion Mapping**

### **Layout Components:**

| Astro Component | React + MUI Equivalent |
|----------------|----------------------|
| `VexusLayout.astro` | `MainLayout.tsx` (using MUI Container, AppBar) |
| `UnifiedHeader.astro` | `Header.tsx` (MUI AppBar + Toolbar + Navigation) |
| `Footer.astro` | `Footer.tsx` (MUI Container + Grid + Typography) |
| `MobileNav.astro` | `MobileNavigation.tsx` (MUI Drawer + List) |

### **Page Components:**

| Astro Page | React Page | Key MUI Components |
|-----------|------------|-------------------|
| `index.astro` | `pages/index.tsx` | Container, Grid, Card, Typography |
| `calculator.astro` | `pages/calculator.tsx` | Stepper, TextField, Button, Dialog |
| `image-atlas.astro` | `pages/image-atlas.tsx` | ImageList, Card, Pagination |
| `education.astro` | `pages/education.tsx` | Accordion, Tabs, Card |

### **Feature Components:**

| Current Feature | React + MUI Implementation |
|----------------|---------------------------|
| Product Carousel | `Carousel.tsx` (MUI Card + Navigation) |
| Image Gallery | `Gallery.tsx` (MUI ImageList + Modal) |
| Forms | React Hook Form + MUI TextField/Select |
| Navigation | MUI AppBar + Drawer + Menu |

---

## 📱 **Responsive Design Strategy**

### **Breakpoint System:**
```typescript
const responsive = {
  mobile: 'max-width: 768px',
  tablet: '769px - 1024px', 
  desktop: 'min-width: 1025px',
};

// MUI breakpoints align with current CSS
const muiBreakpoints = {
  xs: 0,      // Mobile portrait
  sm: 600,    // Mobile landscape  
  md: 900,    // Tablet
  lg: 1200,   // Desktop
  xl: 1536,   // Large desktop
};
```

### **Component Responsive Patterns:**
```tsx
// Example: Responsive navigation
const Navigation: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  return isMobile ? <MobileNavigation /> : <DesktopNavigation />;
};
```

---

## 🔄 **Step-by-Step Conversion Process**

### **Phase 1: Project Setup (Week 1)**

1. **Initialize New React Project:**
```bash
npx create-next-app@latest vexus-react-mui --typescript --tailwind=false --eslint --app
cd vexus-react-mui
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
npm install react-hook-form yup framer-motion
```

2. **Setup MUI Theme:**
```typescript
// src/theme/index.ts - Create custom theme matching current design
// src/components/providers/ThemeProvider.tsx - Wrap app with theme
```

3. **Create Base Layout:**
```tsx
// src/components/layout/MainLayout.tsx
// Replicate VexusLayout.astro structure with MUI components
```

### **Phase 2: Core Components (Week 2)**

4. **Convert Header Component:**
```tsx
// src/components/layout/Header.tsx
// Replace UnifiedHeader.astro with MUI AppBar + navigation
const Header: React.FC = () => {
  return (
    <AppBar position="fixed" elevation={1}>
      <Toolbar>
        <Logo />
        <Navigation />
        <UserMenu />
      </Toolbar>
    </AppBar>
  );
};
```

5. **Convert Footer Component:**
```tsx
// src/components/layout/Footer.tsx  
// Replace Footer.astro with MUI Grid layout
```

6. **Convert Navigation:**
```tsx
// src/components/layout/Navigation.tsx
// Desktop navigation with MUI Menu
// src/components/layout/MobileNavigation.tsx  
// Mobile drawer with MUI Drawer + List
```

### **Phase 3: Homepage Conversion (Week 3)**

7. **Convert index.astro:**
```tsx
// pages/index.tsx
import { Container, Grid, Typography, Card } from '@mui/material';

const HomePage: React.FC = () => {
  return (
    <MainLayout title="VEXUS ATLAS - Home">
      <Container maxWidth="lg">
        <HeroSection />
        <ProjectsGallery />
        <WhatsNewSection />
        <ShopSection />
        <MissionSection />
      </Container>
    </MainLayout>
  );
};
```

8. **Create Section Components:**
```tsx
// src/components/sections/HeroSection.tsx
// src/components/sections/ProjectsGallery.tsx
// src/components/sections/ProductCarousel.tsx
```

### **Phase 4: Complex Pages (Week 4-5)**

9. **Convert Calculator Page:**
```tsx
// pages/calculator.tsx
// Use MUI Stepper, TextField, Button for form steps
// Integrate existing AI image recognition logic
```

10. **Convert Image Atlas:**
```tsx
// pages/image-atlas.tsx  
// Use MUI ImageList, Card, Pagination for gallery
```

### **Phase 5: Remaining Pages (Week 6)**

11. **Convert Other Pages:**
- Education, Publications, Literature
- About, Team, Contact
- Acquisition, Waveform

### **Phase 6: Testing & Optimization (Week 7)**

12. **Quality Assurance:**
- Visual comparison testing
- Responsive behavior verification
- Performance optimization
- Accessibility compliance

---

## 🔧 **Code Quality Rules**

### **1. File Organization Rules:**

```typescript
// ✅ Always check for existing components before creating new ones
// File naming convention: PascalCase for components, camelCase for utilities

// Component structure:
interface ComponentProps {
  // Props definition
}

const Component: React.FC<ComponentProps> = ({ props }) => {
  // Component logic
  return <div>Component JSX</div>;
};

export default Component;
```

### **2. Component Reusability Rules:**

```typescript
// ✅ Create base components for common patterns
// Example: Button component with variants

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'medium',
  children,
  onClick 
}) => {
  return (
    <MuiButton
      variant={variant === 'outline' ? 'outlined' : 'contained'}
      color={variant === 'primary' ? 'primary' : 'secondary'}
      size={size}
      onClick={onClick}
      sx={{
        // Custom styling to match current design
      }}
    >
      {children}
    </MuiButton>
  );
};
```

### **3. Styling Rules:**

```typescript
// ✅ Use MUI sx prop for component-specific styles
// ✅ Use theme for consistent values
// ✅ Create styled components for complex reusable styles

// Component-specific styling:
<Box
  sx={{
    backgroundColor: 'primary.main',
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(1),
    },
  }}
>
  Content
</Box>

// Reusable styled component:
const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  },
}));
```

### **4. Import Organization:**

```typescript
// React imports first
import React, { useState, useEffect } from 'react';

// Third-party libraries
import { Box, Container, Typography } from '@mui/material';
import { useRouter } from 'next/router';

// Local components (absolute imports)
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/common/Button';

// Types
import type { NavigationItem } from '@/types/navigation';

// Utils last
import { routes } from '@/utils/routes';
```

---

## 📋 **Conversion Checklist Template**

### **For Each Component Conversion:**

```markdown
## Component: [ComponentName]

### ✅ Pre-Conversion Checklist:
- [ ] Analyze current .astro component structure
- [ ] Identify all CSS classes and styles used
- [ ] List all props and functionality
- [ ] Check for existing similar React components
- [ ] Document any external dependencies

### ✅ Conversion Process:
- [ ] Create TypeScript interface for props
- [ ] Convert HTML structure to JSX
- [ ] Replace CSS classes with MUI components
- [ ] Convert styles to MUI sx prop or styled components
- [ ] Add responsive behavior using MUI breakpoints
- [ ] Implement any JavaScript functionality with React hooks
- [ ] Add proper TypeScript types

### ✅ Post-Conversion Verification:
- [ ] Visual comparison with original (mobile & desktop)
- [ ] Functionality testing
- [ ] Performance check
- [ ] Accessibility compliance
- [ ] Code review for best practices
```

---

## 🚀 **Getting Started**

### **Immediate Next Steps:**

1. **Clone and Setup:**
```bash
# Create new React project
npx create-next-app@latest vexus-react-mui --typescript --tailwind=false

# Install MUI and dependencies
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material @mui/lab
```

2. **Copy Assets:**
```bash
# Copy public folder from Astro project
cp -r vexus-astro-new\ copy/public/* vexus-react-mui/public/
```

3. **Start with Layout:**
```bash
# Create the main layout component first
mkdir -p src/components/layout
touch src/components/layout/MainLayout.tsx
```

Would you like me to start implementing any specific component or would you prefer to see the detailed implementation of the homepage conversion first?

---

## 📚 **Documentation & Resources**

- [MUI Documentation](https://mui.com/material-ui/getting-started/)
- [React Best Practices](../Cursorrules/react.mdc)
- [MUI Best Practices](../Cursorrules/MUI.mdc)
- [Component Design Patterns](./component-patterns.md)

This plan ensures a systematic, high-quality conversion while maintaining the exact visual appearance and improving the codebase with modern React and MUI patterns! 🎯 

---

## 🎯 **CRITICAL COMPONENTS: Airtable & AI Modal Endpoints**

### **⚠️ Priority 1: These are the most complex and important parts of the conversion**

---

## 🗃️ **1. Airtable Integration Architecture**

### **Current Implementation Analysis:**
- **Files:** `utils/airtable-server.js`, `src/utils/airtable.js`, `src/pages/api/airtable-images.js`
- **API Endpoints:** `/api/airtable-images`, `/api/vexus-images.json`
- **Features:** Image fetching, metadata management, feedback submission, gallery filtering

### **React + MUI Conversion Strategy:**

```typescript
// src/services/airtable.ts
export interface AirtableImage {
  id: string;
  imageName: string;
  fullUrl: string;
  thumbnailUrl: string;
  study: string;
  waveform: string;
  subtype: string;
  analysis: string;
  imageQuality: string;
  qa: string;
  vein_type: string;
  createdTime: string;
}

export interface AirtableResponse {
  images: AirtableImage[];
  metadata: {
    count: number;
    source: string;
    timestamp: string;
  };
}

class AirtableService {
  private baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
  
  async fetchImages(): Promise<AirtableResponse> {
    const response = await fetch(`${this.baseUrl}/api/airtable-images`);
    if (!response.ok) {
      throw new Error(`Airtable fetch failed: ${response.statusText}`);
    }
    return response.json();
  }
  
  async submitFeedback(feedback: FeedbackData): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/airtable-feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(feedback),
    });
    if (!response.ok) {
      throw new Error(`Feedback submission failed: ${response.statusText}`);
    }
  }
}

export const airtableService = new AirtableService();
```

### **React Hook for Airtable Data:**

```typescript
// src/hooks/useAirtableImages.ts
import { useState, useEffect } from 'react';
import { airtableService, AirtableImage } from '@/services/airtable';

export const useAirtableImages = () => {
  const [images, setImages] = useState<AirtableImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const response = await airtableService.fetchImages();
        setImages(response.images);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch images');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  return { images, loading, error, refetch: () => fetchImages() };
};
```

### **MUI Gallery Component:**

```typescript
// src/components/features/ImageAtlas/AtlasGrid.tsx
import React from 'react';
import { 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  Chip, 
  Box,
  Skeleton 
} from '@mui/material';
import { useAirtableImages } from '@/hooks/useAirtableImages';

export const AtlasGrid: React.FC = () => {
  const { images, loading, error } = useAirtableImages();

  if (loading) {
    return (
      <Grid container spacing={3}>
        {Array.from({ length: 12 }).map((_, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Card>
              <Skeleton variant="rectangular" height={200} />
              <CardContent>
                <Skeleton variant="text" height={24} />
                <Skeleton variant="text" height={20} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', p: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {images.map((image) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={image.id}>
          <Card 
            sx={{ 
              height: '100%', 
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': { 
                transform: 'translateY(-4px)',
                boxShadow: 2 
              }
            }}
            data-fancybox="gallery"
            data-src={image.fullUrl}
            data-caption={`${image.imageName} - ${image.analysis}`}
          >
            <CardMedia
              component="img"
              height="200"
              image={image.thumbnailUrl}
              alt={image.imageName}
              loading="lazy"
            />
            <CardContent>
              <Typography variant="h6" gutterBottom noWrap>
                {image.imageName}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                <Chip 
                  label={image.vein_type} 
                  size="small" 
                  color="primary" 
                  variant="outlined"
                />
                <Chip 
                  label={image.waveform} 
                  size="small" 
                  color="secondary" 
                  variant="outlined"
                />
                <Chip 
                  label={image.imageQuality} 
                  size="small" 
                  color={image.imageQuality === 'High' ? 'success' : 'default'}
                  variant="outlined"
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                {image.analysis}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
```

### **Next.js API Routes (App Router):**

```typescript
// src/app/api/airtable-images/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { fetchAirtableImages } from '@/lib/airtable-server';

export async function GET(request: NextRequest) {
  try {
    const result = await fetchAirtableImages();
    
    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'max-age=60, stale-while-revalidate=300'
      }
    });
  } catch (error) {
    console.error('Airtable image query failed:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to retrieve images',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
```

---

## 🤖 **2. AI Modal Endpoints Integration**

### **Current Implementation Analysis:**
- **Files:** `calculator-v2.js`, `src/pages/api/predict/[type].ts`
- **Endpoints:** 3 Modal.run AI models (hepatic, portal, renal)
- **Features:** Image upload, cropping, AI analysis, confidence scoring, VEXUS calculation

### **React + MUI Conversion Strategy:**

```typescript
// src/services/aiPrediction.ts
export interface ModalEndpoint {
  hepatic: string;
  portal: string;
  renal: string;
}

export interface AIResponse {
  predicted_severity: string;
  confidence: number;
  all_probabilities: Record<string, number>;
}

export interface PredictionResult {
  label: string;
  confidence: number;
}

class AIPredictionService {
  private endpoints: ModalEndpoint = {
    hepatic: process.env.NEXT_PUBLIC_HEPATIC_AI_URL || '',
    portal: process.env.NEXT_PUBLIC_PORTAL_AI_URL || '',
    renal: process.env.NEXT_PUBLIC_RENAL_AI_URL || '',
  };

  async analyzeImage(
    imageFile: File, 
    type: keyof ModalEndpoint
  ): Promise<PredictionResult[]> {
    const endpoint = this.endpoints[type];
    if (!endpoint) {
      throw new Error(`No endpoint configured for ${type}`);
    }

    const formData = new FormData();
    formData.append('file', imageFile);

    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`AI analysis failed: ${response.statusText}`);
    }

    const data: AIResponse = await response.json();
    
    // Transform to consistent format
    const predictions: PredictionResult[] = Object.entries(
      data.all_probabilities || {}
    ).map(([label, confidence]) => ({
      label,
      confidence
    }));

    return predictions.sort((a, b) => b.confidence - a.confidence);
  }
}

export const aiPredictionService = new AIPredictionService();
```

### **React Hook for AI Predictions:**

```typescript
// src/hooks/useImageAnalysis.ts
import { useState } from 'react';
import { aiPredictionService, PredictionResult } from '@/services/aiPrediction';

export type AnalysisType = 'hepatic' | 'portal' | 'renal';

export interface AnalysisState {
  status: 'idle' | 'processing' | 'complete' | 'error';
  progress: number;
  results: PredictionResult[] | null;
  error: string | null;
}

export const useImageAnalysis = () => {
  const [analyses, setAnalyses] = useState<Record<AnalysisType, AnalysisState>>({
    hepatic: { status: 'idle', progress: 0, results: null, error: null },
    portal: { status: 'idle', progress: 0, results: null, error: null },
    renal: { status: 'idle', progress: 0, results: null, error: null },
  });

  const analyzeImage = async (file: File, type: AnalysisType) => {
    setAnalyses(prev => ({
      ...prev,
      [type]: { status: 'processing', progress: 10, results: null, error: null }
    }));

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setAnalyses(prev => ({
          ...prev,
          [type]: { 
            ...prev[type], 
            progress: Math.min(prev[type].progress + 20, 90) 
          }
        }));
      }, 500);

      const results = await aiPredictionService.analyzeImage(file, type);
      
      clearInterval(progressInterval);
      
      setAnalyses(prev => ({
        ...prev,
        [type]: { 
          status: 'complete', 
          progress: 100, 
          results, 
          error: null 
        }
      }));

      return results;
    } catch (error) {
      clearInterval(progressInterval);
      
      const errorMessage = error instanceof Error ? error.message : 'Analysis failed';
      
      setAnalyses(prev => ({
        ...prev,
        [type]: { 
          status: 'error', 
          progress: 0, 
          results: null, 
          error: errorMessage 
        }
      }));

      throw error;
    }
  };

  const resetAnalysis = (type: AnalysisType) => {
    setAnalyses(prev => ({
      ...prev,
      [type]: { status: 'idle', progress: 0, results: null, error: null }
    }));
  };

  return { analyses, analyzeImage, resetAnalysis };
};
```

### **MUI Calculator Step Component:**

```typescript
// src/components/forms/Calculator/CalculatorStep.tsx
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
  Alert,
  Box,
  Chip,
  Fade,
  Stack
} from '@mui/material';
import { CloudUpload, Crop, Analytics } from '@mui/icons-material';
import { useImageAnalysis, AnalysisType } from '@/hooks/useImageAnalysis';
import { ImageCropper } from '@/components/common/ImageCropper';

interface Props {
  type: AnalysisType;
  title: string;
  instruction: string;
  onResultSelect: (result: string) => void;
}

export const CalculatorStep: React.FC<Props> = ({
  type,
  title,
  instruction,
  onResultSelect
}) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const { analyses, analyzeImage, resetAnalysis } = useImageAnalysis();
  
  const analysis = analyses[type];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setShowCropper(true);
    }
  };

  const handleCropComplete = async (croppedFile: File) => {
    setShowCropper(false);
    try {
      await analyzeImage(croppedFile, type);
    } catch (error) {
      console.error('Analysis failed:', error);
    }
  };

  const getStatusColor = () => {
    switch (analysis.status) {
      case 'complete': return 'success';
      case 'error': return 'error';
      case 'processing': return 'info';
      default: return 'primary';
    }
  };

  const getStatusText = () => {
    switch (analysis.status) {
      case 'idle': return 'AI MODEL READY';
      case 'processing': return 'ANALYZING IMAGE...';
      case 'complete': return 'ANALYSIS COMPLETE';
      case 'error': return 'ANALYSIS FAILED';
    }
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h2" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          <Chip 
            label={getStatusText()}
            color={getStatusColor()}
            variant="outlined"
            size="small"
          />
        </Box>

        <Typography variant="body1" sx={{ mb: 3 }}>
          {instruction}
        </Typography>

        {/* Upload Button */}
        {analysis.status === 'idle' && (
          <Button
            component="label"
            variant="contained"
            startIcon={<CloudUpload />}
            size="large"
            fullWidth
            sx={{ mb: 2 }}
          >
            Upload {title} Image
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleFileUpload}
            />
          </Button>
        )}

        {/* Progress Indicator */}
        {analysis.status === 'processing' && (
          <Box sx={{ mb: 2 }}>
            <LinearProgress 
              variant="determinate" 
              value={analysis.progress}
              sx={{ mb: 1 }}
            />
            <Typography variant="body2" color="text.secondary">
              {analysis.progress < 30 ? 'Preparing image...' :
               analysis.progress < 70 ? 'Sending to AI model...' :
               'Processing results...'}
            </Typography>
          </Box>
        )}

        {/* Error Display */}
        {analysis.status === 'error' && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {analysis.error}
            <Button 
              size="small" 
              onClick={() => resetAnalysis(type)}
              sx={{ ml: 2 }}
            >
              Try Again
            </Button>
          </Alert>
        )}

        {/* Results */}
        {analysis.status === 'complete' && analysis.results && (
          <Fade in>
            <Box>
              <Typography variant="h6" gutterBottom>
                Analysis Results:
              </Typography>
              <Stack spacing={1}>
                {analysis.results.slice(0, 3).map((result, index) => (
                  <Box
                    key={result.label}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      p: 1,
                      border: '1px solid',
                      borderColor: index === 0 ? 'primary.main' : 'grey.300',
                      borderRadius: 1,
                      bgcolor: index === 0 ? 'primary.50' : 'transparent'
                    }}
                  >
                    <Typography variant="body2">
                      {result.label}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {(result.confidence * 100).toFixed(1)}%
                    </Typography>
                  </Box>
                ))}
              </Stack>

              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={() => onResultSelect(analysis.results![0].label)}
              >
                Use Top Result
              </Button>
            </Box>
          </Fade>
        )}

        {/* Image Cropper Modal */}
        {showCropper && uploadedFile && (
          <ImageCropper
            image={uploadedFile}
            onCropComplete={handleCropComplete}
            onCancel={() => setShowCropper(false)}
          />
        )}
      </CardContent>
    </Card>
  );
};
```

### **Environment Variables:**

```typescript
// .env.local
NEXT_PUBLIC_HEPATIC_AI_URL=https://gsiegel14--vexus-hepatic-endpoint-hepaticmodel-predict.modal.run
NEXT_PUBLIC_PORTAL_AI_URL=https://gsiegel14--vexus-renal-portal-endpoint-portalmodel-predict.modal.run
NEXT_PUBLIC_RENAL_AI_URL=https://gsiegel14--vexus-renal-portal-endpoint-renalmodel-predict.modal.run

AIRTABLE_API_KEY=your_airtable_api_key
AIRTABLE_BASE_ID=your_base_id
AIRTABLE_TABLE_ID=your_table_id
```

### **Error Handling & Retry Logic:**

```typescript
// src/utils/apiRetry.ts
export const withRetry = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }
  throw new Error('Max retries exceeded');
};
```

---

## 📋 **Critical Component Conversion Checklist**

### **Airtable Integration:**
- [ ] Environment variables configured
- [ ] API routes migrated to Next.js App Router
- [ ] Error handling and retry logic implemented
- [ ] Image filtering and search functionality
- [ ] Feedback submission system
- [ ] Gallery pagination and lazy loading
- [ ] Fancybox integration for image modals

### **AI Modal Endpoints:**
- [ ] Modal endpoint URLs configured
- [ ] Image upload and cropping workflow
- [ ] Progress indicators and status updates
- [ ] Confidence scoring display
- [ ] Error handling for failed predictions
- [ ] VEXUS score calculation logic
- [ ] Results validation and selection

### **Performance Considerations:**
- [ ] Image lazy loading implemented
- [ ] API response caching
- [ ] Optimistic UI updates
- [ ] Progressive loading states
- [ ] Error boundary components
- [ ] Memory leak prevention (cleanup)

This conversion strategy maintains the exact functionality while modernizing the architecture with React, TypeScript, and MUI! 🚀 

---

## 📁 **COMPREHENSIVE PAGE-BY-PAGE CONVERSION PLAN**

### **📋 Complete Asset Migration**
See `Image-Migration-Plan.md` for detailed image inventory, directory structure, and automated copy commands for all 65+ images across the project.

### **🏗️ Component Architecture by Page**

#### **🏠 HomePage (index.astro → src/app/page.tsx)**
**Components to Build:**
```
src/components/sections/Hero/
├── 📄 HeroSection.tsx           # Main collaborative platform banner
├── 📄 HeroContent.tsx           # Title and subtitle text
└── 📄 index.ts

src/components/sections/Gallery/
├── 📄 ProjectsGallery.tsx       # 4-icon project grid (Atlas, Evidence, Nerve, Review)
├── 📄 ProjectCard.tsx           # Individual project tile with icon
└── 📄 index.ts

src/components/sections/Content/
├── 📄 WhatsNewSection.tsx       # POCUS Atlas Jr, App, Course cards
├── 📄 ContentCard.tsx           # Left/right image layout cards
├── 📄 ShopSection.tsx           # Product carousel container
├── 📄 MissionSection.tsx        # YouTube video embed
└── 📄 index.ts

src/components/sections/Carousel/
├── 📄 ProductCarousel.tsx       # Shop merchandise carousel
├── 📄 CarouselSlide.tsx         # Individual product slides
├── 📄 CarouselControls.tsx      # Navigation arrows
└── 📄 index.ts
```

**Images Required:** 13 images (icons, logos, products, courses)
**MUI Components:** Container, Grid, Card, Button, IconButton
**Priority:** Week 1-2 (Critical - homepage experience)

---

#### **📊 Calculator (calculator.astro → src/app/calculator/page.tsx)**
**Components to Build:**
```
src/components/forms/Calculator/
├── 📄 CalculatorForm.tsx        # Main stepper container
├── 📄 CalculatorStepper.tsx     # MUI Stepper component
├── 📄 IVCSelectionStep.tsx      # Step 1: IVC diameter selection
├── 📄 ImageUploadStep.tsx       # Step 2-4: File upload UI
├── 📄 ImageCropStep.tsx         # Crop to waveform area
├── 📄 ModalPredictionStep.tsx   # AI analysis display
├── 📄 ResultsDisplayStep.tsx    # VEXUS score results
├── 📄 FeedbackForm.tsx          # Report incorrect predictions
└── 📄 index.ts

src/services/
├── 📄 modalPrediction.ts        # Modal.run API integration
├── 📄 imageProcessing.ts        # Upload & crop logic
└── 📄 index.ts
```

**Images Required:** No static images (uses uploaded user images)
**MUI Components:** Stepper, Step, StepLabel, Button, Select, TextField, Dialog
**Priority:** Week 1 (MOST CRITICAL - core AI functionality)

---

#### **📸 Acquisition Guide (acquisition.astro → src/app/acquisition/page.tsx)**
**Components to Build:**
```
src/components/features/Acquisition/
├── 📄 AcquisitionGuide.tsx      # Main guide layout
├── 📄 VeinCategorySection.tsx   # IVC/Hepatic/Portal/Renal sections
├── 📄 TechniqueCard.tsx         # Individual acquisition technique
├── 📄 ImageViewer.tsx           # Fancybox-style modal
├── 📄 ViewSection.tsx           # Long/short axis views
└── 📄 index.ts
```

**Images Required:** 15 images (acquisition techniques + 4 GIFs)
**MUI Components:** Container, Grid, Card, Dialog, Typography
**Priority:** Week 5-6 (Reference content)

---

#### **🌊 Waveform Guide (waveform.astro → src/app/waveform/page.tsx)**
**Components to Build:**
```
src/components/features/Waveform/
├── 📄 WaveformGuide.tsx         # Main interpretation guide
├── 📄 WaveformSection.tsx       # Hepatic/Portal/Renal sections
├── 📄 WaveformPattern.tsx       # Individual pattern examples
├── 📄 GradingSystemCard.tsx     # VEXUS grading explanation
├── 📄 CitationLink.tsx          # Scientific reference links
└── 📄 index.ts
```

**Images Required:** 12 images (waveform patterns + grading system)
**MUI Components:** Container, Card, Typography, Link
**Priority:** Week 5-6 (Reference content)

---

#### **🎓 Education (education.astro → src/app/education/page.tsx)**
**Components to Build:**
```
src/components/features/Education/
├── 📄 EducationLayout.tsx       # Learning page structure
├── 📄 ConceptDiagram.tsx        # Interactive diagrams
├── 📄 LearningSection.tsx       # Step-by-step content
├── 📄 ReferenceGrid.tsx         # Scientific references
├── 📄 VeinButton.tsx            # Acquisition guide links
└── 📄 index.ts
```

**Images Required:** 3 images (education diagrams)
**MUI Components:** Container, Card, Button, Typography
**Priority:** Week 3-4 (Core content)

---

#### **🖼️ Image Atlas (image-atlas.astro → src/app/image-atlas/page.tsx)**
**Components to Build:**
```
src/components/features/ImageAtlas/
├── 📄 ImageAtlas.tsx            # Main gallery interface
├── 📄 GalleryFilters.tsx        # Search and filter system
├── 📄 GalleryGrid.tsx           # Responsive image grid
├── 📄 CategorySection.tsx       # Hepatic/Portal/Renal categories
├── 📄 ImageModal.tsx            # Full-screen viewer
├── 📄 SubmissionForm.tsx        # Gallery image submission
└── 📄 index.ts

src/services/
├── 📄 airtable.ts               # Airtable API integration
└── 📄 index.ts
```

**Images Required:** Logo + dynamic Airtable images
**MUI Components:** Container, Grid, Card, TextField, Select, Dialog
**Priority:** Week 3-4 (Core functionality with Airtable)

---

#### **👥 Team (team.astro → src/app/team/page.tsx)**
**Components to Build:**
```
src/components/features/Team/
├── 📄 TeamLayout.tsx            # Team page structure
├── 📄 TeamGrid.tsx              # Member grid layout
├── 📄 TeamMemberCard.tsx        # Individual member profiles
├── 📄 TeamSection.tsx           # Core team vs contributors
└── 📄 index.ts
```

**Images Required:** 10 images (team member photos)
**MUI Components:** Container, Grid, Card, Avatar, Typography
**Priority:** Week 5-6 (Profile content)

---

#### **📧 Contact (contact.astro → src/app/contact/page.tsx)**
**Components to Build:**
```
src/components/forms/Contact/
├── 📄 ContactLayout.tsx         # Contact page structure
├── 📄 ContactForm.tsx           # Main contact form
├── 📄 ContactMethods.tsx        # Alternative contact options
├── 📄 FileUpload.tsx            # Attachment handling
└── 📄 index.ts
```

**Images Required:** None (form-based)
**MUI Components:** Container, TextField, Button, Card
**Priority:** Week 7 (Supporting)

---

#### **📚 Supporting Pages (Week 7)**
- **about.astro** → `AboutPage.tsx` (content cards)
- **literature.astro** → `LiteratureReview.tsx` (paper cards)  
- **publications.astro** → `PublicationsPage.tsx` (publication cards)

---
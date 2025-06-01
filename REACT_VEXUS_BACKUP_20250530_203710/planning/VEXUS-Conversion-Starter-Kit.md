# 🚀 VEXUS Conversion Starter Kit

## 🔧 **Immediate Setup Commands**

```bash
# 1. Create new Next.js project
npx create-next-app@latest vexus-react-mui --typescript --tailwind=false --eslint --app

# 2. Navigate to project
cd vexus-react-mui

# 3. Install MUI and essential dependencies
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material @mui/lab
npm install @mui/x-date-pickers
npm install react-hook-form @hookform/resolvers yup
npm install framer-motion
npm install next-themes

# 4. Install development dependencies
npm install -D @types/node

# 5. Copy existing assets
cp -r "../vexus-astro-new copy/public"/* ./public/
```

---

## 📁 **Initial File Structure Setup**

```bash
# Create directory structure
mkdir -p src/{components/{common,layout,sections,forms},hooks,theme,types,utils,styles}
mkdir -p src/components/{common/{Button,Card,Image,Loading},layout/{Header,Footer,Navigation},sections/{Hero,Gallery,ProductCarousel},forms/{Calculator,Contact}}

# Create initial files
touch src/theme/{index.ts,colors.ts,typography.ts,components.ts}
touch src/utils/{routes.ts,constants.ts,helpers.ts}
touch src/types/{components.ts,navigation.ts}
touch src/styles/{globals.css,muiOverrides.ts}
```

---

## 🎨 **1. MUI Theme Setup**

### **src/theme/colors.ts**
```typescript
export const colors = {
  primary: {
    main: '#453E3E',
    light: '#5c5252', 
    dark: '#2c2828',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#43c3ac',
    light: '#6ed4be',
    dark: '#2e8578',
    contrastText: '#ffffff',
  },
  background: {
    default: '#ffffff',
    paper: '#f8f9fa',
  },
  text: {
    primary: '#333333',
    secondary: '#555555',
  },
  grey: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
} as const;
```

### **src/theme/typography.ts**
```typescript
import type { TypographyOptions } from '@mui/material/styles/createTypography';

export const typography: TypographyOptions = {
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
    lineHeight: 1.3,
    '@media (max-width:768px)': {
      fontSize: '1.75rem',
    },
  },
  h3: {
    fontSize: '1.75rem',
    fontWeight: 600,
    lineHeight: 1.3,
    '@media (max-width:768px)': {
      fontSize: '1.5rem',
    },
  },
  h4: {
    fontSize: '1.5rem',
    fontWeight: 600,
    lineHeight: 1.3,
  },
  h5: {
    fontSize: '1.25rem',
    fontWeight: 600,
    lineHeight: 1.3,
  },
  h6: {
    fontSize: '1.125rem',
    fontWeight: 600,
    lineHeight: 1.3,
  },
  body1: {
    fontSize: '1rem',
    lineHeight: 1.6,
  },
  body2: {
    fontSize: '0.875rem',
    lineHeight: 1.6,
  },
  button: {
    textTransform: 'none',
    fontWeight: 500,
  },
};
```

### **src/theme/index.ts**
```typescript
import { createTheme } from '@mui/material/styles';
import { colors } from './colors';
import { typography } from './typography';

export const vexusTheme = createTheme({
  palette: colors,
  typography,
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  spacing: 8,
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          boxSizing: 'border-box',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
        '*, *:before, *:after': {
          boxSizing: 'inherit',
        },
        body: {
          margin: 0,
          fontFamily: typography.fontFamily,
          backgroundColor: colors.background.default,
          color: colors.text.primary,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          textTransform: 'none',
          fontWeight: 500,
          padding: '0.8rem 1.5rem',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          maxWidth: '1200px !important',
          paddingLeft: '20px',
          paddingRight: '20px',
          '@media (max-width: 1024px)': {
            paddingLeft: '15px',
            paddingRight: '15px',
          },
        },
      },
    },
  },
});
```

---

## 🔧 **2. Theme Provider Setup**

### **src/components/providers/ThemeProvider.tsx**
```typescript
'use client';

import React from 'react';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { vexusTheme } from '@/theme';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  return (
    <MuiThemeProvider theme={vexusTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};
```

### **src/app/layout.tsx** (Next.js App Router)
```typescript
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'VEXUS ATLAS - Venous Excess Ultrasound Score',
  description: 'A collaborative platform for ultrasound education',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

---

## 🧭 **3. Routes and Navigation Setup**

### **src/utils/routes.ts**
```typescript
export const routes = {
  // Main pages
  home: '/',
  about: '/about',
  team: '/team',
  contact: '/contact',
  
  // VEXUS specific
  education: '/education',
  waveform: '/waveform',
  acquisition: '/acquisition',
  calculator: '/calculator',
  imageAtlas: '/image-atlas',
  literatureReview: '/literature-review',
  publications: '/publications',
  
  // External links
  imageGallery: 'https://www.thepocusatlas.com/image-atlas-home',
  eaHome: 'https://www.thepocusatlas.com/ea-home',
  nerveBlocks: 'https://www.thepocusatlas.com/nerve-blocks',
  imageReview: 'https://www.thepocusatlas.com/image-review',
  atlasJr: 'https://www.thepocusatlas.com/atlas-jr',
} as const;

export type Routes = typeof routes;
```

### **src/types/navigation.ts**
```typescript
export interface NavigationItem {
  id: string;
  text: string;
  href: string;
  subLinks?: SubNavigationItem[];
}

export interface SubNavigationItem {
  text: string;
  href: string;
}

export const navigationTree: NavigationItem[] = [
  {
    id: 'folder-vexus-atlas',
    text: 'VEXUS ATLAS',
    href: '/',
    subLinks: [
      { text: 'VEXUS Fundamentals', href: '/education' },
      { text: 'Waveform Analysis', href: '/waveform' },
      { text: 'Image Acquisition', href: '/acquisition' },
      { text: 'AI Image Recognition', href: '/calculator' },
      { text: 'Image Atlas', href: '/image-atlas' },
      { text: 'VEXUS Literature', href: '/literature-review' },
      { text: 'Publications', href: '/publications' },
      { text: 'Our Team', href: '/team' },
      { text: 'About VEXUS ATLAS', href: '/about' },
      { text: 'Contact Us', href: '/contact' },
    ],
  },
  // ... rest of navigation items
];
```

---

## 🎯 **4. Custom Hooks**

### **src/hooks/useResponsive.ts**
```typescript
import { useTheme, useMediaQuery } from '@mui/material';

export const useResponsive = () => {
  const theme = useTheme();
  
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return {
    isMobile,
    isTablet,
    isDesktop,
    isSmallMobile,
    breakpoint: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop',
  };
};
```

---

## 🏗️ **5. Main Layout Component**

### **src/components/layout/MainLayout.tsx**
```typescript
import React from 'react';
import { Box, Container } from '@mui/material';
import { Header } from './Header';
import { Footer } from './Footer';
import { MobileNavigation } from './MobileNavigation';
import { useResponsive } from '@/hooks/useResponsive';

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  title = 'VEXUS ATLAS',
  description = 'Venous Excess Ultrasound Score',
  maxWidth = 'lg',
}) => {
  const { isMobile } = useResponsive();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header */}
      <Header />
      
      {/* Mobile Navigation */}
      {isMobile && <MobileNavigation />}
      
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: { xs: '80px', md: '120px' }, // Account for fixed header
          pb: 4,
        }}
      >
        <Container maxWidth={maxWidth}>
          {children}
        </Container>
      </Box>
      
      {/* Footer */}
      <Footer />
    </Box>
  );
};
```

---

## 📱 **6. Header Component**

### **src/components/layout/Header.tsx**
```typescript
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useScrollTrigger,
} from '@mui/material';
import { Menu as MenuIcon, Close as CloseIcon } from '@mui/icons-material';
import { Logo } from '../common/Logo';
import { Navigation } from './Navigation';
import { useResponsive } from '@/hooks/useResponsive';
import { navigationTree } from '@/types/navigation';

export const Header: React.FC = () => {
  const { isMobile } = useResponsive();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Hide header on scroll for mobile
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  return (
    <>
      <AppBar
        position="fixed"
        elevation={1}
        sx={{
          backgroundColor: 'background.paper',
          color: 'text.primary',
          height: { xs: '80px', md: '120px' },
          transition: 'all 0.3s ease',
          ...(isMobile && trigger && {
            transform: 'translateY(-100%)',
          }),
        }}
      >
        <Toolbar
          sx={{
            height: '100%',
            justifyContent: 'space-between',
            px: { xs: 2, sm: 3, md: 4 },
          }}
        >
          {/* Logo */}
          <Logo />
          
          {/* Desktop Navigation */}
          {!isMobile && <Navigation items={navigationTree} />}
          
          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              edge="end"
              onClick={() => setMobileMenuOpen(true)}
              sx={{ ml: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
      
      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer
          anchor="right"
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          PaperProps={{
            sx: { width: 280, pt: 2 }
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
            <IconButton onClick={() => setMobileMenuOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          
          <List>
            {navigationTree.map((item) => (
              <ListItem key={item.id} button>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Drawer>
      )}
    </>
  );
};
```

---

## 🏠 **7. Homepage Component**

### **src/app/page.tsx**
```typescript
import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { MainLayout } from '@/components/layout/MainLayout';
import { HeroSection } from '@/components/sections/HeroSection';
import { ProjectsGallery } from '@/components/sections/ProjectsGallery';
import { WhatsNewSection } from '@/components/sections/WhatsNewSection';
import { ShopSection } from '@/components/sections/ShopSection';
import { MissionSection } from '@/components/sections/MissionSection';

export default function HomePage() {
  return (
    <MainLayout 
      title="VEXUS ATLAS - Home"
      description="The official homepage for VEXUS ATLAS, a collaborative platform for ultrasound education."
    >
      {/* Hero Section */}
      <HeroSection />
      
      {/* Projects Gallery */}
      <ProjectsGallery />
      
      {/* What's New */}
      <WhatsNewSection />
      
      {/* Shop */}
      <ShopSection />
      
      {/* Mission */}
      <MissionSection />
    </MainLayout>
  );
}
```

---

## 🎨 **8. Hero Section Example**

### **src/components/sections/HeroSection.tsx**
```typescript
import React from 'react';
import { Box, Typography, Container } from '@mui/material';

export const HeroSection: React.FC = () => {
  return (
    <Box
      component="section"
      sx={{
        textAlign: 'center',
        py: { xs: 4, sm: 6, md: 8 },
      }}
    >
      <Container maxWidth="md">
        <Typography
          variant="h1"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 600,
            mb: 2,
          }}
        >
          A Collaborative Ultrasound Education Platform
        </Typography>
        
        <Typography
          variant="h3"
          component="h2"
          sx={{
            fontWeight: 'normal',
            color: 'text.secondary',
            mb: 4,
          }}
        >
          We create, share, and curate free ultrasound educational content contributed by educators around the world.
        </Typography>
        
        <Typography
          variant="h2"
          component="h3"
          sx={{
            mt: 6,
            mb: 4,
          }}
        >
          Explore Our Projects
        </Typography>
      </Container>
    </Box>
  );
};
```

---

## 🚀 **Quick Start Commands**

```bash
# 1. Run the setup commands above
# 2. Create the files with the provided code
# 3. Start development server
npm run dev

# 4. Open browser to http://localhost:3000
```

---

## ✅ **First Conversion Checklist**

- [ ] Project setup complete
- [ ] MUI theme configured
- [ ] Theme provider working
- [ ] Main layout component created
- [ ] Header component responsive
- [ ] Homepage structure in place
- [ ] Navigation functional
- [ ] Styling matches original

**Next Steps:** Convert the Projects Gallery section with MUI Grid and Cards to match the exact layout from the original index.astro file.

This starter kit provides the foundation for a systematic, high-quality conversion! 🎯

---

## 🎯 **CRITICAL COMPONENTS: Implementation Ready**

### **⚠️ These are the most important parts of your application**

---

## 🔧 **9. Airtable Integration Setup**

### **Environment Variables (.env.local):**
```bash
# Airtable Configuration
AIRTABLE_API_KEY=patH8BZodu3EJN4aM.b55e8f9cd260cc013d92b5dcf7f5bc2feda7d8779cde6fab761c93410dc7f421
AIRTABLE_BASE_ID=appczwD3YpTYS6UeJ
AIRTABLE_TABLE_ID=tblL1RXcNlcLW5nen
AIRTABLE_TABLE_NAME="DH US"

# AI Model Endpoints
NEXT_PUBLIC_HEPATIC_AI_URL=https://gsiegel14--vexus-hepatic-endpoint-hepaticmodel-predict.modal.run
NEXT_PUBLIC_PORTAL_AI_URL=https://gsiegel14--vexus-renal-portal-endpoint-portalmodel-predict.modal.run
NEXT_PUBLIC_RENAL_AI_URL=https://gsiegel14--vexus-renal-portal-endpoint-renalmodel-predict.modal.run

# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

### **src/lib/airtable.ts**
```typescript
interface AirtableCredentials {
  apiKey: string;
  baseId: string;
  tableId: string;
  tableName: string;
}

class AirtableClient {
  private credentials: AirtableCredentials;
  private baseUrl: string;

  constructor() {
    this.credentials = {
      apiKey: process.env.AIRTABLE_API_KEY || '',
      baseId: process.env.AIRTABLE_BASE_ID || '',
      tableId: process.env.AIRTABLE_TABLE_ID || '',
      tableName: process.env.AIRTABLE_TABLE_NAME || '',
    };
    this.baseUrl = `https://api.airtable.com/v0/${this.credentials.baseId}/${this.credentials.tableId}`;
  }

  async fetchImages() {
    const response = await fetch(this.baseUrl, {
      headers: {
        'Authorization': `Bearer ${this.credentials.apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.statusText}`);
    }

    const data = await response.json();
    return this.transformRecords(data.records);
  }

  private transformRecords(records: any[]) {
    return records.map(record => {
      const fields = record.fields;
      const imageAttachment = fields.Image?.[0];
      
      return {
        id: record.id,
        imageName: fields.Name || '',
        fullUrl: imageAttachment?.url || '',
        thumbnailUrl: imageAttachment?.thumbnails?.large?.url || imageAttachment?.url || '',
        study: fields.Study || '',
        waveform: fields.Waveform || '',
        subtype: fields.Subtype || '',
        analysis: fields.Analysis || '',
        imageQuality: fields['Image Quality'] || '',
        qa: fields.QA || '',
        vein_type: fields['Vein type'] || fields['Vein Type'] || '',
        createdTime: record.createdTime,
      };
    }).filter(image => image.fullUrl);
  }

  async submitFeedback(feedback: {
    email: string;
    incorrectPrediction: string;
    correctPrediction: string;
  }) {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.credentials.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        records: [{
          fields: {
            Email: feedback.email,
            'Incorrect Prediction': feedback.incorrectPrediction,
            'Correct Prediction': feedback.correctPrediction,
            'Timestamp': new Date().toISOString(),
            'Status': 'New',
            'Source': 'React Calculator',
          }
        }]
      }),
    });

    if (!response.ok) {
      throw new Error(`Feedback submission failed: ${response.statusText}`);
    }

    return response.json();
  }
}

export const airtableClient = new AirtableClient();
```

### **src/app/api/airtable-images/route.ts**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { airtableClient } from '@/lib/airtable';

export async function GET() {
  try {
    const images = await airtableClient.fetchImages();
    
    return NextResponse.json({
      images,
      metadata: {
        count: images.length,
        source: 'airtable',
        timestamp: new Date().toISOString(),
      }
    }, {
      headers: {
        'Cache-Control': 'max-age=60, stale-while-revalidate=300',
      }
    });
  } catch (error) {
    console.error('Airtable fetch error:', error);
    
    return NextResponse.json({
      error: 'Failed to fetch images',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
```

---

## 🤖 **10. AI Modal Endpoints Setup**

### **src/services/aiPrediction.ts**
```typescript
export interface AIAnalysisResult {
  label: string;
  confidence: number;
}

export type VeinType = 'hepatic' | 'portal' | 'renal';

export interface AIResponse {
  predicted_severity?: string;
  confidence?: number;
  all_probabilities?: Record<string, number>;
  error?: string;
}

class AIPredictionService {
  private endpoints = {
    hepatic: process.env.NEXT_PUBLIC_HEPATIC_AI_URL || '',
    portal: process.env.NEXT_PUBLIC_PORTAL_AI_URL || '',
    renal: process.env.NEXT_PUBLIC_RENAL_AI_URL || '',
  };

  async analyzeImage(file: File, type: VeinType): Promise<AIAnalysisResult[]> {
    const endpoint = this.endpoints[type];
    if (!endpoint) {
      throw new Error(`No endpoint configured for ${type}`);
    }

    // Create FormData for image upload
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: AIResponse = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Transform response to consistent format
      return this.transformResponse(data);
    } catch (error) {
      console.error(`AI analysis failed for ${type}:`, error);
      throw error;
    }
  }

  private transformResponse(data: AIResponse): AIAnalysisResult[] {
    const results: AIAnalysisResult[] = [];

    // Handle all_probabilities format
    if (data.all_probabilities) {
      Object.entries(data.all_probabilities).forEach(([label, confidence]) => {
        results.push({ label, confidence });
      });
    }

    // Handle single prediction format
    if (data.predicted_severity && data.confidence !== undefined) {
      const existing = results.find(r => r.label === data.predicted_severity);
      if (!existing) {
        results.push({
          label: data.predicted_severity,
          confidence: data.confidence
        });
      }
    }

    // Sort by confidence (highest first)
    return results.sort((a, b) => b.confidence - a.confidence);
  }

  // VEXUS Score Calculation
  calculateVexusScore(selections: {
    ivc: string;
    hepatic: string;
    portal: string;
    renal: string;
  }): number {
    let score = 0;

    // IVC scoring
    if (selections.ivc === '>2cm') score += 1;

    // Hepatic vein scoring
    if (selections.hepatic === 'HV Mild') score += 1;
    else if (selections.hepatic === 'HV Severe') score += 2;

    // Portal vein scoring
    if (selections.portal === 'PV Mild') score += 1;
    else if (selections.portal === 'PV Severe') score += 2;

    // Renal vein scoring
    if (selections.renal === 'RV Mild') score += 1;
    else if (selections.renal === 'RV Severe') score += 2;

    return score;
  }
}

export const aiPredictionService = new AIPredictionService();
```

### **src/hooks/useAIAnalysis.ts**
```typescript
import { useState, useCallback } from 'react';
import { aiPredictionService, AIAnalysisResult, VeinType } from '@/services/aiPrediction';

export interface AnalysisState {
  status: 'idle' | 'processing' | 'complete' | 'error';
  progress: number;
  results: AIAnalysisResult[] | null;
  error: string | null;
}

export const useAIAnalysis = () => {
  const [analyses, setAnalyses] = useState<Record<VeinType, AnalysisState>>({
    hepatic: { status: 'idle', progress: 0, results: null, error: null },
    portal: { status: 'idle', progress: 0, results: null, error: null },
    renal: { status: 'idle', progress: 0, results: null, error: null },
  });

  const analyzeImage = useCallback(async (file: File, type: VeinType) => {
    // Reset state for this analysis type
    setAnalyses(prev => ({
      ...prev,
      [type]: { status: 'processing', progress: 0, results: null, error: null }
    }));

    // Progress simulation
    const progressSteps = [10, 30, 50, 70, 90];
    let stepIndex = 0;

    const progressInterval = setInterval(() => {
      if (stepIndex < progressSteps.length) {
        setAnalyses(prev => ({
          ...prev,
          [type]: { ...prev[type], progress: progressSteps[stepIndex] }
        }));
        stepIndex++;
      }
    }, 400);

    try {
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
  }, []);

  const resetAnalysis = useCallback((type: VeinType) => {
    setAnalyses(prev => ({
      ...prev,
      [type]: { status: 'idle', progress: 0, results: null, error: null }
    }));
  }, []);

  const resetAllAnalyses = useCallback(() => {
    setAnalyses({
      hepatic: { status: 'idle', progress: 0, results: null, error: null },
      portal: { status: 'idle', progress: 0, results: null, error: null },
      renal: { status: 'idle', progress: 0, results: null, error: null },
    });
  }, []);

  return {
    analyses,
    analyzeImage,
    resetAnalysis,
    resetAllAnalyses,
  };
};
```

---

## 🖼️ **11. Image Cropper Component**

### **src/components/common/ImageCropper/ImageCropper.tsx**
```typescript
import React, { useRef, useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
} from '@mui/material';
import { Crop, Cancel } from '@mui/icons-material';

interface Props {
  image: File;
  onCropComplete: (croppedFile: File) => void;
  onCancel: () => void;
  open?: boolean;
}

export const ImageCropper: React.FC<Props> = ({
  image,
  onCropComplete,
  onCancel,
  open = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [cropper, setCropper] = useState<any>(null);

  useEffect(() => {
    if (image) {
      const url = URL.createObjectURL(image);
      setImageUrl(url);
      
      return () => URL.revokeObjectURL(url);
    }
  }, [image]);

  useEffect(() => {
    // Dynamically import Cropper.js to avoid SSR issues
    const loadCropper = async () => {
      if (typeof window !== 'undefined' && imageRef.current && imageUrl) {
        const { default: Cropper } = await import('cropperjs');
        
        const cropperInstance = new Cropper(imageRef.current, {
          aspectRatio: 16 / 9, // Adjust based on your needs
          viewMode: 1,
          background: false,
          responsive: true,
          restore: false,
          guides: true,
          center: true,
          highlight: false,
          cropBoxMovable: true,
          cropBoxResizable: true,
          toggleDragModeOnDblclick: false,
        });

        setCropper(cropperInstance);

        return () => {
          cropperInstance.destroy();
        };
      }
    };

    loadCropper();
  }, [imageUrl]);

  const handleCrop = async () => {
    if (!cropper) return;

    try {
      const canvas = cropper.getCroppedCanvas({
        width: 800, // Max width
        height: 600, // Max height
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high',
      });

      canvas.toBlob((blob) => {
        if (blob) {
          const croppedFile = new File([blob], image.name, {
            type: image.type,
            lastModified: Date.now(),
          });
          onCropComplete(croppedFile);
        }
      }, image.type, 0.9);
    } catch (error) {
      console.error('Cropping failed:', error);
    }
  };

  const handleCancel = () => {
    if (cropper) {
      cropper.destroy();
    }
    onCancel();
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: '70vh' }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Crop />
          Crop Image
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Adjust the crop area to include only the relevant part of the ultrasound image.
        </Typography>
        
        <Box sx={{ 
          position: 'relative', 
          width: '100%', 
          minHeight: 400,
          '& img': { maxWidth: '100%', display: 'block' }
        }}>
          {imageUrl && (
            <img
              ref={imageRef}
              src={imageUrl}
              alt="Crop preview"
              style={{ maxWidth: '100%' }}
            />
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={handleCancel}
          startIcon={<Cancel />}
          color="secondary"
        >
          Cancel
        </Button>
        <Button
          onClick={handleCrop}
          startIcon={<Crop />}
          variant="contained"
          color="primary"
        >
          Apply Crop
        </Button>
      </DialogActions>
    </Dialog>
  );
};
```

### **Additional Dependencies:**
```bash
npm install cropperjs
npm install @types/cropperjs  # If using TypeScript
```

---

## 📦 **12. Gallery Integration with Fancybox**

### **src/hooks/useFancybox.ts**
```typescript
import { useEffect } from 'react';

export const useFancybox = (selector: string = '[data-fancybox]') => {
  useEffect(() => {
    const initFancybox = async () => {
      if (typeof window !== 'undefined') {
        const { Fancybox } = await import('@fancyapps/ui');
        
        Fancybox.bind(selector, {
          Toolbar: {
            display: [
              { id: 'prev', position: 'center' },
              { id: 'counter', position: 'center' },
              { id: 'next', position: 'center' },
              'zoom',
              'slideshow',
              'fullscreen',
              'download',
              'close',
            ],
          },
          Images: {
            zoom: true,
          },
          Carousel: {
            infinite: false,
          },
        });

        return () => {
          Fancybox.unbind(selector);
          Fancybox.close();
        };
      }
    };

    initFancybox();
  }, [selector]);
};
```

### **Install Fancybox:**
```bash
npm install @fancyapps/ui
```

---

## ✅ **Critical Components Setup Checklist**

### **Environment & Dependencies:**
- [ ] Environment variables configured in `.env.local`
- [ ] Airtable API credentials added
- [ ] AI model endpoints configured
- [ ] CropperJS and Fancybox installed

### **Core Services:**
- [ ] `src/lib/airtable.ts` implemented
- [ ] `src/services/aiPrediction.ts` implemented
- [ ] API routes created (`/api/airtable-images`)
- [ ] Error handling and retry logic added

### **React Components:**
- [ ] `useAIAnalysis` hook implemented
- [ ] `useAirtableImages` hook implemented
- [ ] `ImageCropper` component created
- [ ] `useFancybox` hook implemented

### **Testing:**
- [ ] Airtable connection tested
- [ ] AI endpoints returning predictions
- [ ] Image upload and cropping working
- [ ] Gallery displaying images correctly

### **Next Steps:**
1. Test Airtable API connection
2. Verify AI model endpoints are responding
3. Implement calculator stepper component
4. Add gallery filtering and search
5. Test image upload and analysis workflow

This setup provides production-ready implementations of your most critical features! 🚀 

---

## ⚡ **CRITICAL: Modal Image Prediction Workflow Implementation**

### **🎯 EXACT WORKFLOW: Upload → Crop → Send to Modal → Receive → Display**

This is the **CORE FUNCTIONALITY** that must work identically to the current calculator.astro:

### **Step-by-Step Implementation:**

## 🔧 **1. Modal Prediction Service (EXACT ENDPOINTS)**

### **src/services/modalPrediction.ts**
```typescript
// EXACT same endpoints from calculator-v2.js
const MODAL_ENDPOINTS = {
  hepatic: 'https://gsiegel14--vexus-hepatic-endpoint-hepaticmodel-predict.modal.run',
  portal:  'https://gsiegel14--vexus-renal-portal-endpoint-portalmodel-predict.modal.run',
  renal:   'https://gsiegel14--vexus-renal-portal-endpoint-renalmodel-predict.modal.run'
};

export interface ModalResponse {
  predicted_severity: string;  // "HV_Mild", "PV_Severe", etc.
  confidence: number;          // 0.85
  all_probabilities: Record<string, number>; // {"HV_Normal": 0.15, "HV_Mild": 0.85}
}

export class ModalPredictionService {
  async sendImageToModal(
    croppedFile: File, 
    veinType: 'hepatic' | 'portal' | 'renal'
  ): Promise<ModalResponse> {
    const endpoint = MODAL_ENDPOINTS[veinType];
    
    // EXACT SAME format as current implementation
    const formData = new FormData();
    formData.append('file', croppedFile);
    
    console.log(`🚀 Sending to Modal.run: ${veinType} -> ${endpoint}`);
    
    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData  // SAME as calculator-v2.js
    });
    
    if (!response.ok) {
      throw new Error(`Modal.run error: ${response.status} - ${response.statusText}`);
    }
    
    const data: ModalResponse = await response.json();
    console.log(`🤖 Modal.run response:`, data);
    
    return data;
  }
}

export const modalPredictionService = new ModalPredictionService();
```

## 🔧 **2. Complete Workflow Hook**

### **src/hooks/useModalWorkflow.ts**
```typescript
import { useState } from 'react';
import { modalPredictionService, ModalResponse } from '@/services/modalPrediction';

export type VeinType = 'hepatic' | 'portal' | 'renal';

export interface WorkflowState {
  step: 'upload' | 'crop' | 'sending' | 'complete' | 'error';
  progress: number;
  uploadedFile: File | null;
  croppedFile: File | null;
  modalResponse: ModalResponse | null;
  error: string | null;
}

export const useModalWorkflow = (veinType: VeinType) => {
  const [state, setState] = useState<WorkflowState>({
    step: 'upload',
    progress: 0,
    uploadedFile: null,
    croppedFile: null,
    modalResponse: null,
    error: null,
  });

  // STEP 1: Handle image upload
  const handleImageUpload = (file: File) => {
    console.log(`📤 Step 1: Image uploaded for ${veinType}`, file.name);
    setState(prev => ({
      ...prev,
      step: 'crop',
      uploadedFile: file,
      progress: 20,
      error: null,
    }));
  };

  // STEP 2: Handle crop completion
  const handleCropComplete = async (croppedFile: File) => {
    console.log(`✂️ Step 2: Image cropped for ${veinType}`);
    setState(prev => ({
      ...prev,
      step: 'sending',
      croppedFile,
      progress: 40,
    }));

    // STEP 3: Send to Modal.run (automatic)
    await sendToModal(croppedFile);
  };

  // STEP 3: Send to Modal.run endpoint
  const sendToModal = async (file: File) => {
    try {
      console.log(`🚀 Step 3: Sending to Modal.run for ${veinType}`);
      setState(prev => ({ ...prev, progress: 60 }));

      // EXACT same call as calculator-v2.js
      const response = await modalPredictionService.sendImageToModal(file, veinType);
      
      console.log(`🤖 Step 4: Received prediction for ${veinType}`, response);
      
      // STEP 4 & 5: Display results
      setState(prev => ({
        ...prev,
        step: 'complete',
        progress: 100,
        modalResponse: response,
      }));

    } catch (error) {
      console.error(`❌ Modal.run error for ${veinType}:`, error);
      setState(prev => ({
        ...prev,
        step: 'error',
        progress: 0,
        error: error instanceof Error ? error.message : 'Prediction failed',
      }));
    }
  };

  // Reset workflow
  const reset = () => {
    setState({
      step: 'upload',
      progress: 0,
      uploadedFile: null,
      croppedFile: null,
      modalResponse: null,
      error: null,
    });
  };

  return {
    state,
    handleImageUpload,
    handleCropComplete,
    reset,
  };
};
```

## 🔧 **3. Complete Calculator Step Component**

### **src/components/forms/Calculator/ModalPredictionStep.tsx**
```typescript
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
  Alert,
  Box,
  Chip,
  Stack,
} from '@mui/material';
import { CloudUpload, CheckCircle, Error as ErrorIcon } from '@mui/icons-material';
import { useModalWorkflow, VeinType } from '@/hooks/useModalWorkflow';
import { ImageCropper } from '@/components/common/ImageCropper';

interface Props {
  veinType: VeinType;
  title: string;
  instruction: string;
  onPredictionComplete: (prediction: string) => void;
}

export const ModalPredictionStep: React.FC<Props> = ({
  veinType,
  title,
  instruction,
  onPredictionComplete,
}) => {
  const { state, handleImageUpload, handleCropComplete, reset } = useModalWorkflow(veinType);

  const getStepDescription = () => {
    switch (state.step) {
      case 'upload': return `📤 Step 1: Upload ${title} Image`;
      case 'crop': return `✂️ Step 2: Crop Image`;
      case 'sending': return `🚀 Step 3: Sending to Modal.run AI`;
      case 'complete': return `🤖 Step 4-5: AI Prediction Complete`;
      case 'error': return `❌ Prediction Failed`;
    }
  };

  const getStatusColor = () => {
    switch (state.step) {
      case 'complete': return 'success';
      case 'error': return 'error';
      case 'sending': return 'info';
      default: return 'primary';
    }
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          <Chip 
            label={getStepDescription()}
            color={getStatusColor()}
            variant="outlined"
            size="small"
          />
        </Box>

        <Typography variant="body1" sx={{ mb: 3 }}>
          {instruction}
        </Typography>

        {/* STEP 1: Upload Button */}
        {state.step === 'upload' && (
          <Button
            component="label"
            variant="contained"
            startIcon={<CloudUpload />}
            size="large"
            fullWidth
          >
            Upload {title} Image
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(file);
              }}
            />
          </Button>
        )}

        {/* STEP 2: Image Cropper */}
        {state.step === 'crop' && state.uploadedFile && (
          <ImageCropper
            image={state.uploadedFile}
            onCropComplete={handleCropComplete}
            onCancel={reset}
          />
        )}

        {/* STEP 3: Progress Indicator */}
        {state.step === 'sending' && (
          <Box sx={{ mb: 2 }}>
            <LinearProgress 
              variant="determinate" 
              value={state.progress}
              sx={{ mb: 1 }}
            />
            <Typography variant="body2" color="text.secondary">
              {state.progress < 60 ? 'Preparing image...' : 'Processing with AI model...'}
            </Typography>
          </Box>
        )}

        {/* STEP 4-5: Results Display */}
        {state.step === 'complete' && state.modalResponse && (
          <Box>
            <Alert severity="success" icon={<CheckCircle />} sx={{ mb: 2 }}>
              AI prediction complete! Select a result below.
            </Alert>
            
            <Typography variant="h6" gutterBottom>
              Prediction Results:
            </Typography>
            
            <Stack spacing={1}>
              {/* Top prediction */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  p: 2,
                  border: '2px solid',
                  borderColor: 'primary.main',
                  borderRadius: 1,
                  bgcolor: 'primary.50',
                  cursor: 'pointer',
                }}
                onClick={() => onPredictionComplete(state.modalResponse!.predicted_severity)}
              >
                <Typography variant="body1" fontWeight="bold">
                  {state.modalResponse.predicted_severity}
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {(state.modalResponse.confidence * 100).toFixed(1)}%
                </Typography>
              </Box>
              
              {/* Additional probabilities */}
              {Object.entries(state.modalResponse.all_probabilities || {})
                .sort(([,a], [,b]) => b - a)
                .slice(1, 3)
                .map(([label, confidence]) => (
                  <Box
                    key={label}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      p: 1,
                      border: '1px solid',
                      borderColor: 'grey.300',
                      borderRadius: 1,
                      cursor: 'pointer',
                    }}
                    onClick={() => onPredictionComplete(label)}
                  >
                    <Typography variant="body2">{label}</Typography>
                    <Typography variant="body2">
                      {(confidence * 100).toFixed(1)}%
                    </Typography>
                  </Box>
                ))}
            </Stack>
          </Box>
        )}

        {/* Error Display */}
        {state.step === 'error' && (
          <Alert 
            severity="error" 
            icon={<ErrorIcon />}
            action={
              <Button size="small" onClick={reset}>
                Try Again
              </Button>
            }
          >
            {state.error}
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
```

## 🔧 **4. Usage in Calculator Page**

### **src/app/calculator/page.tsx**
```typescript
import React, { useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
import { MainLayout } from '@/components/layout/MainLayout';
import { ModalPredictionStep } from '@/components/forms/Calculator/ModalPredictionStep';

export default function CalculatorPage() {
  const [predictions, setPredictions] = useState({
    hepatic: '',
    portal: '',
    renal: '',
    ivc: '', // Manual selection
  });

  const handlePredictionComplete = (veinType: string, prediction: string) => {
    setPredictions(prev => ({
      ...prev,
      [veinType]: prediction,
    }));
  };

  // EXACT same VEXUS scoring logic as calculator-v2.js
  const calculateVexusScore = () => {
    let score = 0;
    
    if (predictions.ivc === '>2cm') score += 1;
    
    if (predictions.hepatic === 'HV Mild') score += 1;
    else if (predictions.hepatic === 'HV Severe') score += 2;
    
    if (predictions.portal === 'PV Mild') score += 1;
    else if (predictions.portal === 'PV Severe') score += 2;
    
    if (predictions.renal === 'RV Mild') score += 1;
    else if (predictions.renal === 'RV Severe') score += 2;
    
    return score;
  };

  return (
    <MainLayout title="VEXUS Score Calculator">
      <Container maxWidth="md">
        <Typography variant="h3" component="h1" gutterBottom>
          VEXUS Score Calculator
        </Typography>
        
        {/* Step 2: Hepatic Vein */}
        <ModalPredictionStep
          veinType="hepatic"
          title="Hepatic Vein"
          instruction="Upload your Hepatic Vein ultrasound image. After uploading, you'll be able to crop the image to include only the PWD waveform and EKG lead."
          onPredictionComplete={(pred) => handlePredictionComplete('hepatic', pred)}
        />
        
        {/* Step 3: Portal Vein */}
        <ModalPredictionStep
          veinType="portal"
          title="Portal Vein"
          instruction="Upload your Portal Vein ultrasound image. After uploading, you'll be able to crop the image to include only the PWD waveform and EKG lead."
          onPredictionComplete={(pred) => handlePredictionComplete('portal', pred)}
        />
        
        {/* Step 4: Renal Vein */}
        <ModalPredictionStep
          veinType="renal"
          title="Renal Vein"
          instruction="Upload your Renal Vein ultrasound image. After uploading, you'll be able to crop the image to include only the PWD waveform and EKG lead."
          onPredictionComplete={(pred) => handlePredictionComplete('renal', pred)}
        />
        
        {/* VEXUS Score Display */}
        {predictions.hepatic && predictions.portal && predictions.renal && (
          <Box sx={{ mt: 4, p: 3, bgcolor: 'primary.50', borderRadius: 2 }}>
            <Typography variant="h4" component="h2">
              VEXUS Score: {calculateVexusScore()}
            </Typography>
          </Box>
        )}
      </Container>
    </MainLayout>
  );
}
```

---

## 📁 **1. Project Structure**

// ... existing code ... 
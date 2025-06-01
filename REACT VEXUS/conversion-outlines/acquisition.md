# Acquisition Page Conversion Outline

## Overview
Convert `acquisition.astro` to a React component featuring comprehensive VEXUS image acquisition techniques with interactive galleries, detailed probe positioning guides, and educational content using Material-UI components.

## Current Structure Analysis
- Complex multi-section layout with detailed acquisition guides
- Four main assessment types: IVC, Hepatic Vein, Portal Vein, and Renal Vein
- Multiple views per assessment (long axis, short axis, subxiphoid)
- Interactive image galleries with Fancybox integration
- Detailed technique descriptions with probe positioning
- Key structures identification and special notes
- Atlas GIF animations for dynamic demonstration
- External CSS imports for specialized styling
- Responsive grid layouts with hover effects
- Advanced JavaScript interactions for section toggling and image viewing

## Comprehensive Conversion Framework

### 1. Component Architecture & MUI Integration
```jsx
// src/pages/Acquisition.jsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardHeader,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
  TabPanel,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemText,
  Button,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  useTheme,
  useMediaQuery,
  Fade,
  Collapse
} from '@mui/material';
import {
  ExpandMore,
  ZoomIn,
  PlayArrow,
  Pause,
  Close,
  NavigateNext,
  NavigateBefore,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import ImageGallery from '../components/ImageGallery';
import TechniqueGuide from '../components/TechniqueGuide';
import AtlasViewer from '../components/AtlasViewer';
import GeneralTips from '../components/GeneralTips';

const Acquisition = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeSection, setActiveSection] = useState('ivc');
  const [activeView, setActiveView] = useState({});
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const assessmentTypes = ['ivc', 'hepatic', 'portal', 'renal'];

  return (
    <Layout>
      <SEO 
        title="VEXUS ATLAS - Image Acquisition Guide"
        description="Comprehensive guide to VEXUS ultrasound image acquisition techniques, standards, and best practices for medical professionals and researchers."
        keywords="VEXUS, image acquisition, ultrasound guide, medical imaging, venous excess, techniques, standards"
        ogTitle="VEXUS Image Acquisition Guide | Ultrasound Techniques"
        ogDescription="Master VEXUS ultrasound imaging with our comprehensive acquisition guide featuring interactive galleries and step-by-step techniques."
        ogImage="https://www.vexusatlas.com/images/acquisition-preview.jpg"
        ogUrl="https://www.vexusatlas.com/acquisition"
      />
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h2" 
            component="h1" 
            sx={{ 
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontWeight: 600,
              color: theme.palette.primary.main,
              mb: 2
            }}
          >
            VEXUS Image Acquisition Guide
          </Typography>
          <Typography 
            variant="h5" 
            component="p" 
            sx={{ 
              color: theme.palette.text.secondary,
              maxWidth: 800,
              mx: 'auto'
            }}
          >
            Comprehensive techniques and standards for optimal VEXUS imaging
          </Typography>
        </Box>

        {/* Assessment Type Navigation */}
        <Box sx={{ mb: 4 }}>
          <Tabs 
            value={activeSection} 
            onChange={(e, value) => setActiveSection(value)}
            variant={isMobile ? "scrollable" : "fullWidth"}
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 500
              }
            }}
          >
            <Tab label="IVC Assessment" value="ivc" />
            <Tab label="Hepatic Vein Assessment" value="hepatic" />
            <Tab label="Portal Vein Assessment" value="portal" />
            <Tab label="Renal Vein Assessment" value="renal" />
          </Tabs>
        </Box>

        {/* Assessment Sections */}
        {assessmentTypes.map((type) => (
          <TabPanel key={type} value={activeSection} index={type}>
            <AssessmentSection
              type={type}
              isMobile={isMobile}
              onImageClick={(image) => {
                setSelectedImage(image);
                setLightboxOpen(true);
              }}
            />
          </TabPanel>
        ))}

        {/* General Tips Section */}
        <GeneralTips />

        {/* Lightbox Dialog */}
        <ImageLightbox
          open={lightboxOpen}
          image={selectedImage}
          onClose={() => setLightboxOpen(false)}
        />
      </Container>
    </Layout>
  );
};

export default Acquisition;
```

### 2. MUI Component Mapping Strategy

#### Original Astro Elements → MUI Components
```jsx
const componentMapping = {
  // Layout components
  'acquisition-container': 'Container + Box',
  'acquisition-header': 'Box with Typography',
  'acquisition-content': 'Box with responsive layout',
  
  // Section components
  'acquisition-section': 'Card or Accordion',
  'section-header': 'CardHeader or AccordionSummary',
  'section-content': 'CardContent or AccordionDetails',
  'expand-toggle': 'IconButton with ExpandMore',
  
  // View components
  'view-section': 'Box with Collapse transition',
  'view-header': 'Box with Typography + Button',
  'view-toggle': 'Button with expand/collapse',
  'content-wrapper': 'Box with responsive padding',
  
  // Image components
  'acquisition-images': 'Grid container',
  'image-container': 'Card with hover effects',
  'image-overlay': 'Box with absolute positioning',
  'zoom-icon': 'IconButton with ZoomIn',
  'image-caption': 'Typography variant="caption"',
  
  // Technique components
  'technique-description': 'Box with sections',
  'technique-section': 'Box with List components',
  
  // Atlas components
  'vexus-atlas-tile': 'Card with specialized styling',
  'atlas-content': 'CardContent with media',
  'atlas-gif': 'Box with video controls',
  'gif-controls': 'Box with play/pause buttons'
};
```

### 3. Advanced Component Architecture

#### AssessmentSection Component with MUI
```jsx
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Chip,
  Grid
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';

const AssessmentSection = ({ type, isMobile, onImageClick }) => {
  const [expandedView, setExpandedView] = useState(null);
  const assessmentData = getAssessmentData(type);

  return (
    <Box sx={{ mb: 4 }}>
      <Card 
        elevation={2}
        sx={{ 
          mb: 3,
          '&:hover': {
            elevation: 4,
            transition: 'all 0.3s ease'
          }
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" component="h2" sx={{ flexGrow: 1 }}>
              {assessmentData.title}
            </Typography>
            <Chip 
              label={`${assessmentData.views.length} Views`}
              color="primary"
              variant="outlined"
            />
          </Box>

          {/* Views for this assessment */}
          <Grid container spacing={2}>
            {assessmentData.views.map((view, index) => (
              <Grid item xs={12} key={view.id}>
                <ViewSection
                  view={view}
                  isExpanded={expandedView === view.id}
                  onToggle={() => setExpandedView(
                    expandedView === view.id ? null : view.id
                  )}
                  onImageClick={onImageClick}
                  isMobile={isMobile}
                />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};
```

#### ViewSection Component with MUI Animations
```jsx
import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Collapse,
  Fade
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';

const ViewSection = ({ view, isExpanded, onToggle, onImageClick, isMobile }) => {
  return (
    <Accordion 
      expanded={isExpanded}
      onChange={onToggle}
      sx={{
        mb: 2,
        '&:before': { display: 'none' },
        boxShadow: isExpanded ? 3 : 1,
        transition: 'all 0.3s ease'
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMore />}
        sx={{
          backgroundColor: isExpanded ? 'primary.light' : 'grey.50',
          '&:hover': {
            backgroundColor: 'primary.light'
          }
        }}
      >
        <Typography variant="h6" component="h3">
          {view.title}
        </Typography>
      </AccordionSummary>
      
      <AccordionDetails>
        <Fade in={isExpanded} timeout={300}>
          <Box sx={{ p: 2 }}>
            <Grid container spacing={3}>
              {/* Images Section */}
              <Grid item xs={12} md={6}>
                <AcquisitionImages 
                  images={view.images}
                  onImageClick={onImageClick}
                />
              </Grid>
              
              {/* Technique Section */}
              <Grid item xs={12} md={6}>
                <TechniqueDescription technique={view.technique} />
              </Grid>
              
              {/* Atlas Content */}
              {view.atlasContent && (
                <Grid item xs={12}>
                  <AtlasContent content={view.atlasContent} />
                </Grid>
              )}
            </Grid>
          </Box>
        </Fade>
      </AccordionDetails>
    </Accordion>
  );
};
```

#### Enhanced Image Gallery with MUI
```jsx
import React, { useState } from 'react';
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Box,
  Typography,
  Chip,
  Zoom
} from '@mui/material';
import { ZoomIn, Fullscreen } from '@mui/icons-material';

const AcquisitionImages = ({ images, onImageClick }) => {
  const [hoveredImage, setHoveredImage] = useState(null);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Image Gallery
      </Typography>
      
      <Grid container spacing={2}>
        {images.map((image, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Card 
              sx={{ 
                position: 'relative',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
              onMouseEnter={() => setHoveredImage(index)}
              onMouseLeave={() => setHoveredImage(null)}
              onClick={() => onImageClick(image)}
            >
              <CardMedia
                component="img"
                image={image.src}
                alt={image.alt}
                sx={{ 
                  height: 200,
                  objectFit: 'cover'
                }}
              />
              
              {/* Overlay */}
              <Zoom in={hoveredImage === index}>
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <IconButton 
                    sx={{ 
                      color: 'white',
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.3)'
                      }
                    }}
                  >
                    <ZoomIn fontSize="large" />
                  </IconButton>
                </Box>
              </Zoom>
              
              {/* Caption */}
              {image.caption && (
                <CardContent sx={{ py: 1 }}>
                  <Typography variant="caption" display="block">
                    {image.caption}
                  </Typography>
                </CardContent>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
```

### 4. Interactive Features with MUI

#### Advanced Lightbox with MUI Dialog
```jsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Box,
  Typography,
  Fab,
  Zoom
} from '@mui/material';
import {
  Close,
  NavigateNext,
  NavigateBefore,
  ZoomIn,
  ZoomOut
} from '@mui/icons-material';

const ImageLightbox = ({ open, image, onClose, images = [], currentIndex = 0 }) => {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.5, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.5, 0.5));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          maxWidth: '90vw',
          maxHeight: '90vh',
          backgroundColor: 'rgba(0,0,0,0.9)'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        color: 'white'
      }}>
        <Typography variant="h6" component="h2">
          {image?.caption || 'Medical Image'}
        </Typography>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <Close />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ 
        display: 'flex', 
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        minHeight: 400
      }}>
        {image && (
          <Box
            component="img"
            src={image.src}
            alt={image.alt}
            sx={{
              maxWidth: '100%',
              maxHeight: '100%',
              transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px)`,
              transition: 'transform 0.3s ease',
              cursor: zoom > 1 ? 'grab' : 'zoom-in'
            }}
            onClick={zoom === 1 ? handleZoomIn : undefined}
          />
        )}
        
        {/* Zoom Controls */}
        <Box sx={{
          position: 'absolute',
          bottom: 16,
          right: 16,
          display: 'flex',
          gap: 1
        }}>
          <Fab 
            size="small" 
            onClick={handleZoomOut}
            disabled={zoom <= 0.5}
            sx={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
          >
            <ZoomOut />
          </Fab>
          <Fab 
            size="small" 
            onClick={handleZoomIn}
            disabled={zoom >= 3}
            sx={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
          >
            <ZoomIn />
          </Fab>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
```

#### Atlas GIF Viewer with Controls
```jsx
import React, { useState, useRef } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Box,
  IconButton,
  Typography,
  LinearProgress,
  Chip
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  Replay,
  Speed
} from '@mui/icons-material';

const AtlasViewer = ({ content }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef(null);

  const togglePlayback = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <Card 
      elevation={3}
      sx={{ 
        mb: 3,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}
    >
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6">{content.title}</Typography>
            <Chip 
              label="ATLAS" 
              size="small" 
              sx={{ 
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white'
              }} 
            />
          </Box>
        }
        sx={{ pb: 1 }}
      />
      
      <CardContent>
        <Box sx={{ position: 'relative', mb: 2 }}>
          {content.type === 'gif' ? (
            <Box
              component="img"
              ref={videoRef}
              src={content.src}
              alt={content.alt}
              sx={{ 
                width: '100%',
                borderRadius: 2,
                boxShadow: 2
              }}
            />
          ) : (
            <Box
              component="video"
              ref={videoRef}
              src={content.src}
              autoPlay
              loop
              muted
              onTimeUpdate={(e) => {
                const progress = (e.target.currentTime / e.target.duration) * 100;
                setProgress(progress);
              }}
              sx={{ 
                width: '100%',
                borderRadius: 2,
                boxShadow: 2
              }}
            />
          )}
          
          {/* Controls Overlay */}
          <Box sx={{
            position: 'absolute',
            bottom: 8,
            left: 8,
            right: 8,
            backgroundColor: 'rgba(0,0,0,0.6)',
            borderRadius: 1,
            p: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <IconButton 
              onClick={togglePlayback}
              size="small"
              sx={{ color: 'white' }}
            >
              {isPlaying ? <Pause /> : <PlayArrow />}
            </IconButton>
            
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{ 
                flexGrow: 1,
                height: 4,
                borderRadius: 2,
                backgroundColor: 'rgba(255,255,255,0.3)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: 'white'
                }
              }}
            />
            
            <IconButton size="small" sx={{ color: 'white' }}>
              <Speed />
            </IconButton>
          </Box>
        </Box>
        
        {content.description && (
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            {content.description}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};
```

### 5. Data Structure and State Management

#### Comprehensive Assessment Data Structure
```jsx
const assessmentData = {
  ivc: {
    id: 'ivc',
    title: "IVC Assessment",
    description: "Comprehensive inferior vena cava evaluation techniques",
    views: [
      {
        id: 'ivc-long',
        title: "Long Axis View",
        difficulty: 'Beginner',
        duration: '2-3 minutes',
        images: [
          {
            id: 'ivc-1',
            src: "/images/IVC.png",
            alt: "IVC Assessment Technique - Subcostal Long Axis View",
            caption: "IVC Assessment Technique - Subcostal Long Axis View",
            annotations: [
              { x: 45, y: 30, label: "IVC", color: '#ff4444' },
              { x: 60, y: 50, label: "Right Atrium", color: '#44ff44' }
            ]
          },
          {
            id: 'ivc-2',
            src: "/images/IVC_RUQ.png",
            alt: "IVC RUQ Intercostal View",
            caption: "IVC Assessment Technique - RUQ Intercostal View",
            annotations: [
              { x: 40, y: 35, label: "IVC", color: '#ff4444' },
              { x: 25, y: 60, label: "Liver", color: '#4444ff' }
            ]
          }
        ],
        technique: {
          probePosition: "Place probe in subxiphoid or subcostal position to obtain a longitudinal view of the IVC.",
          keyStructures: [
            "Inferior Vena Cava (IVC)",
            "Right atrial junction",
            "Hepatic vein confluence",
            "Liver parenchyma"
          ],
          keyPoints: [
            "Place patient in supine position",
            "Use a low frequency (curvilinear) probe",
            "Measure IVC diameter 2-3 cm from right atrial junction",
            "Assess for inspiratory collapse (if applicable)",
            "Record maximum diameter for VEXUS classification"
          ],
          measurements: {
            normalRange: "15-25mm",
            severelyDilated: ">25mm",
            location: "2-3cm from RA junction"
          },
          specialNotes: [
            "Ensure measurement is taken during normal respiration",
            "Document both maximum and minimum diameters if significant respiratory variation",
            "Consider patient's volume status and positioning when interpreting measurements"
          ]
        },
        atlasContent: {
          id: 'ivc-atlas',
          title: "IVC Dynamic Assessment",
          type: 'video',
          src: "/videos/ivc-assessment.mp4",
          thumbnail: "/images/ivc-thumb.jpg",
          alt: "IVC Assessment Animation showing respiratory variation",
          description: "Dynamic assessment of IVC with respiratory variation demonstrating measurement technique and anatomical landmarks."
        },
        tips: [
          "Optimize gain to clearly visualize vessel walls",
          "Use color Doppler to confirm vessel identity",
          "Consider multiple imaging planes for complete assessment"
        ]
      }
    ]
  },
  hepatic: {
    id: 'hepatic',
    title: "Hepatic Vein Assessment",
    description: "Detailed hepatic vein evaluation with Doppler analysis",
    views: [
      // Similar structure for hepatic views
    ]
  },
  portal: {
    id: 'portal',
    title: "Portal Vein Assessment", 
    description: "Portal vein imaging and flow assessment",
    views: [
      // Similar structure for portal views
    ]
  },
  renal: {
    id: 'renal',
    title: "Renal Vein Assessment",
    description: "Renal vein evaluation techniques and measurements",
    views: [
      // Similar structure for renal views
    ]
  }
};
```

#### Advanced State Management with Context
```jsx
import React, { createContext, useContext, useReducer } from 'react';

const AcquisitionContext = createContext();

const acquisitionReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ACTIVE_SECTION':
      return { ...state, activeSection: action.payload };
    case 'SET_ACTIVE_VIEW':
      return { 
        ...state, 
        activeViews: { 
          ...state.activeViews, 
          [action.section]: action.view 
        } 
      };
    case 'TOGGLE_LIGHTBOX':
      return { 
        ...state, 
        lightbox: { 
          open: action.open, 
          image: action.image,
          gallery: action.gallery || null
        } 
      };
    case 'SET_USER_PROGRESS':
      return {
        ...state,
        userProgress: {
          ...state.userProgress,
          [action.section]: action.progress
        }
      };
    default:
      return state;
  }
};

export const AcquisitionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(acquisitionReducer, {
    activeSection: 'ivc',
    activeViews: {},
    lightbox: { open: false, image: null, gallery: null },
    userProgress: {},
    preferences: {
      autoPlay: true,
      showAnnotations: true,
      difficulty: 'all'
    }
  });

  return (
    <AcquisitionContext.Provider value={{ state, dispatch }}>
      {children}
    </AcquisitionContext.Provider>
  );
};

export const useAcquisition = () => {
  const context = useContext(AcquisitionContext);
  if (!context) {
    throw new Error('useAcquisition must be used within AcquisitionProvider');
  }
  return context;
};
```

### 6. Responsive Design Framework

#### Mobile-First MUI Breakpoint Strategy
```jsx
const responsiveStyles = {
  // Main container
  container: {
    px: { xs: 2, sm: 3, md: 4 },
    py: { xs: 3, md: 4 }
  },
  
  // Header section
  header: {
    textAlign: 'center',
    mb: { xs: 4, md: 6 },
    '& h1': {
      fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' }
    },
    '& h5': {
      fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' }
    }
  },
  
  // Navigation tabs
  tabs: {
    '& .MuiTabs-root': {
      minHeight: { xs: 48, md: 64 }
    },
    '& .MuiTab-root': {
      fontSize: { xs: '0.875rem', md: '1rem' },
      minWidth: { xs: 120, md: 160 }
    }
  },
  
  // Assessment cards
  assessmentCard: {
    mb: { xs: 2, md: 3 },
    '& .MuiCardContent-root': {
      p: { xs: 2, md: 3 }
    }
  },
  
  // Image gallery
  imageGallery: {
    '& .MuiGrid-item': {
      // Responsive grid columns
      xs: 12,  // 1 column on mobile
      sm: 6,   // 2 columns on tablet
      md: 4,   // 3 columns on desktop
      lg: 3    // 4 columns on large screens
    }
  },
  
  // Technique description
  techniqueSection: {
    '& .MuiTypography-h6': {
      fontSize: { xs: '1rem', md: '1.125rem' }
    },
    '& .MuiListItem-root': {
      px: { xs: 1, md: 2 }
    }
  }
};
```

#### Touch-Optimized Interactions
```jsx
const TouchOptimizedComponent = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  return (
    <Box
      sx={{
        // Touch-friendly tap targets (minimum 44px)
        '& .MuiButton-root': {
          minHeight: 44,
          minWidth: 44
        },
        '& .MuiIconButton-root': {
          padding: isMobile ? 2 : 1
        },
        
        // Swipe gestures for image galleries
        '& .image-container': {
          touchAction: 'pan-y pinch-zoom'
        },
        
        // Hover effects only on non-touch devices
        '@media (hover: hover)': {
          '& .hover-effect': {
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: 4
            }
          }
        }
      }}
    >
      {/* Component content */}
    </Box>
  );
};
```

### 7. Performance Optimization Framework

#### Lazy Loading and Code Splitting
```jsx
import { lazy, Suspense } from 'react';
import { Skeleton, Box } from '@mui/material';

// Lazy load heavy components
const LazyImageGallery = lazy(() => import('../components/ImageGallery'));
const LazyAtlasViewer = lazy(() => import('../components/AtlasViewer'));
const LazyTechniqueGuide = lazy(() => import('../components/TechniqueGuide'));

// Loading skeletons
const ImageGallerySkeleton = () => (
  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
    {[...Array(4)].map((_, i) => (
      <Skeleton key={i} variant="rectangular" height={200} />
    ))}
  </Box>
);

const AtlasViewerSkeleton = () => (
  <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
);

// Optimized component with lazy loading
const OptimizedAcquisitionPage = () => {
  return (
    <Container>
      <Suspense fallback={<ImageGallerySkeleton />}>
        <LazyImageGallery />
      </Suspense>
      
      <Suspense fallback={<AtlasViewerSkeleton />}>
        <LazyAtlasViewer />
      </Suspense>
    </Container>
  );
};
```

#### Image Optimization Strategy
```jsx
const OptimizedImage = ({ src, alt, sizes, priority = false }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef();

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!imgRef.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );
    
    observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Box ref={imgRef} sx={{ position: 'relative' }}>
      {(isInView || priority) && (
        <>
          <Box
            component="img"
            src={src}
            alt={alt}
            sizes={sizes}
            onLoad={() => setIsLoaded(true)}
            sx={{
              width: '100%',
              height: 'auto',
              opacity: isLoaded ? 1 : 0,
              transition: 'opacity 0.3s ease'
            }}
          />
          {!isLoaded && (
            <Skeleton
              variant="rectangular"
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%'
              }}
            />
          )}
        </>
      )}
    </Box>
  );
};
```

### 8. Testing Framework for Complex Components

#### Component Testing Strategy
```jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AcquisitionPage from '../AcquisitionPage';

const theme = createTheme();

const renderWithTheme = (component) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('Acquisition Page', () => {
  test('renders all assessment sections', () => {
    renderWithTheme(<AcquisitionPage />);
    
    expect(screen.getByText('IVC Assessment')).toBeInTheDocument();
    expect(screen.getByText('Hepatic Vein Assessment')).toBeInTheDocument();
    expect(screen.getByText('Portal Vein Assessment')).toBeInTheDocument();
    expect(screen.getByText('Renal Vein Assessment')).toBeInTheDocument();
  });

  test('tab navigation works correctly', async () => {
    renderWithTheme(<AcquisitionPage />);
    
    const hepaticTab = screen.getByText('Hepatic Vein Assessment');
    fireEvent.click(hepaticTab);
    
    await waitFor(() => {
      expect(screen.getByText('Hepatic vein evaluation')).toBeInTheDocument();
    });
  });

  test('image lightbox opens on image click', async () => {
    renderWithTheme(<AcquisitionPage />);
    
    const imageElement = screen.getByAltText(/IVC Assessment/);
    fireEvent.click(imageElement);
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  test('atlas viewer controls work', async () => {
    renderWithTheme(<AcquisitionPage />);
    
    const playButton = screen.getByLabelText('Play');
    fireEvent.click(playButton);
    
    await waitFor(() => {
      expect(screen.getByLabelText('Pause')).toBeInTheDocument();
    });
  });
});

// Integration tests
describe('Acquisition Page Integration', () => {
  test('state management works across components', () => {
    renderWithTheme(<AcquisitionPage />);
    
    // Test section switching
    const portalTab = screen.getByText('Portal Vein Assessment');
    fireEvent.click(portalTab);
    
    // Verify content updates
    expect(screen.getByText('Portal vein imaging')).toBeInTheDocument();
  });
});

// Accessibility tests
describe('Acquisition Page Accessibility', () => {
  test('has proper keyboard navigation', () => {
    renderWithTheme(<AcquisitionPage />);
    
    const tabs = screen.getAllByRole('tab');
    tabs[0].focus();
    
    fireEvent.keyDown(tabs[0], { key: 'ArrowRight' });
    expect(tabs[1]).toHaveFocus();
  });

  test('has proper ARIA labels', () => {
    renderWithTheme(<AcquisitionPage />);
    
    expect(screen.getByRole('tablist')).toHaveAttribute('aria-label');
    expect(screen.getByRole('main')).toHaveAttribute('aria-label');
  });
});
```

### 9. Advanced Features Implementation

#### Progressive Web App Features
```jsx
// Service worker for offline functionality
const serviceWorkerConfig = {
  cacheFirst: [
    '/images/**',
    '/videos/**',
    '/static/**'
  ],
  networkFirst: [
    '/api/**'
  ],
  staleWhileRevalidate: [
    '/',
    '/acquisition',
    '/about'
  ]
};

// Push notifications for educational content
const usePushNotifications = () => {
  const [permission, setPermission] = useState('default');
  
  const requestPermission = async () => {
    if ('Notification' in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
    }
  };
  
  const sendNotification = (title, options) => {
    if (permission === 'granted') {
      new Notification(title, options);
    }
  };
  
  return { permission, requestPermission, sendNotification };
};
```

#### Analytics and User Tracking
```jsx
const useAnalytics = () => {
  const trackPageView = (page) => {
    // Google Analytics or similar
    gtag('config', 'GA_MEASUREMENT_ID', {
      page_title: page,
      page_location: window.location.href
    });
  };
  
  const trackEvent = (action, category, label, value) => {
    gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value
    });
  };
  
  const trackImageView = (imageId, section) => {
    trackEvent('image_view', 'acquisition', `${section}_${imageId}`);
  };
  
  const trackVideoPlay = (videoId) => {
    trackEvent('video_play', 'atlas', videoId);
  };
  
  return { trackPageView, trackEvent, trackImageView, trackVideoPlay };
};
```

## Dependencies & Tech Stack

```json
{
  "dependencies": {
    "@mui/material": "^5.14.0",
    "@mui/icons-material": "^5.14.0",
    "@mui/lab": "^5.0.0-alpha.140",
    "@emotion/react": "^11.11.0",
    "@emotion/styled": "^11.11.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-intersection-observer": "^9.5.0",
    "react-spring": "^9.7.0",
    "framer-motion": "^10.16.0"
  },
  "devDependencies": {
    "@testing-library/react": "^13.4.0",
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/user-event": "^14.4.3",
    "jest-axe": "^7.0.1"
  }
}
```

### 10. Implementation Roadmap

#### Phase 1: Core Structure (Week 1-2)
- [ ] Basic component architecture with MUI
- [ ] Tab navigation for assessment types
- [ ] Basic accordion sections for views
- [ ] Simple image display with grid layout

#### Phase 2: Interactive Features (Week 3-4)
- [ ] Advanced lightbox with zoom controls
- [ ] Atlas viewer with video controls
- [ ] Technique descriptions with structured data
- [ ] Responsive design optimization

#### Phase 3: Advanced Features (Week 5-6)
- [ ] Image annotations and hotspots
- [ ] Progress tracking and bookmarks
- [ ] Search and filter functionality
- [ ] Offline capability with service workers

#### Phase 4: Polish & Performance (Week 7-8)
- [ ] Performance optimization and lazy loading
- [ ] Accessibility audit and improvements
- [ ] Cross-browser testing
- [ ] Analytics integration

## Key Success Metrics
1. **Performance**: Page load < 3s, LCP < 2.5s
2. **Accessibility**: WCAG 2.1 AA compliance
3. **Usability**: Task completion rate > 90%
4. **Engagement**: Average session duration > 5 minutes
5. **Quality**: Zero critical bugs, 95%+ user satisfaction

This comprehensive framework ensures a complete, accessible, and performant conversion from the Astro acquisition page to a modern React application with Material-UI components. 
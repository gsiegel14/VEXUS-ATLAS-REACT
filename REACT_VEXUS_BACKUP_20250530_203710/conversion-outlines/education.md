# Education Page Conversion Outline

## Overview
Convert `education.astro` to a React component with comprehensive educational content, interactive image galleries, citation system, and progressive disclosure features using Material-UI components.

## Current Structure Analysis
- Multi-section educational content with complex nested structure
- Interactive image galleries with Fancybox lightboxes
- Citation system with clickable references
- Progressive disclosure with collapsible sections
- Acquisition links for different vein types (hepatic, portal, renal)
- Complex content with medical terminology and detailed explanations
- References section with external links
- Step-by-step VEXUS guide with equipment and preparation details
- VEXUS grading system table
- Mobile-responsive design with touch-friendly interactions

## Comprehensive Conversion Framework

### 1. Main Component Architecture & MUI Integration
```jsx
// src/pages/Education.jsx
import React, { useState, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  useTheme,
  useMediaQuery,
  Fab,
  Drawer
} from '@mui/material';
import { ExpandMore, MenuBook, TableView } from '@mui/icons-material';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import TableOfContents from '../components/education/TableOfContents';
import EducationSection from '../components/education/EducationSection';
import ImageGallery from '../components/education/ImageGallery';
import GradingSystemTable from '../components/education/GradingSystemTable';
import ReferencesSection from '../components/education/ReferencesSection';
import CitationProvider from '../contexts/CitationProvider';
import { educationSections } from '../config/educationConfig';

const Education = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeSection, setActiveSection] = useState('introduction');
  const [tocOpen, setTocOpen] = useState(false);

  const handleSectionChange = useCallback((sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <CitationProvider>
      <Layout>
        <SEO 
          title="VEXUS Education - VEXUS ATLAS"
          description="Comprehensive educational resource for VEXUS (Venous Excess UltraSound) methodology, including tutorials, learning materials, and training guides for medical professionals."
          keywords="VEXUS, education, learning, tutorials, ultrasound training, medical education, venous excess"
          ogTitle="VEXUS Educational Resources | Learning & Training"
          ogImage="https://yourdomain.com/images/vexus-education-preview.jpg"
          ogUrl="https://yourdomain.com/education"
        />
        
        <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
          <Box sx={{ display: 'flex', gap: { xs: 0, md: 4 } }}>
            {/* Desktop Table of Contents */}
            {!isMobile && (
              <Box sx={{ 
                width: 280, 
                flexShrink: 0,
                position: 'sticky',
                top: 100,
                height: 'fit-content',
                maxHeight: 'calc(100vh - 120px)',
                overflowY: 'auto'
              }}>
                <TableOfContents 
                  sections={educationSections}
                  activeSection={activeSection}
                  onSectionClick={handleSectionChange}
                />
              </Box>
            )}

            {/* Main Content */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Card elevation={2} sx={{ mb: 4 }}>
                <CardContent sx={{ p: { xs: 2, md: 4 } }}>
                  <Typography 
                    variant="h3" 
                    component="h1" 
                    align="center" 
                    gutterBottom
                    sx={{ 
                      fontWeight: 'bold', 
                      color: 'primary.main',
                      fontSize: { xs: '2rem', md: '3rem' }
                    }}
                  >
                    Your Practical Guide to Understanding VEXUS
                  </Typography>
                  <Typography 
                    variant="h6" 
                    component="p" 
                    align="center"
                    sx={{ color: 'text.secondary', maxWidth: 800, mx: 'auto' }}
                  >
                    Comprehensive educational resources for mastering Venous Excess Ultrasound methodology
                  </Typography>
                </CardContent>
              </Card>

              {/* Education Sections */}
              {educationSections.map((section) => (
                <EducationSection
                  key={section.id}
                  section={section}
                  isActive={activeSection === section.id}
                  onSectionEnter={() => setActiveSection(section.id)}
                />
              ))}

              {/* VEXUS Grading System */}
              <GradingSystemTable />

              {/* References */}
              <ReferencesSection />
            </Box>
          </Box>

          {/* Mobile FAB for TOC */}
          {isMobile && (
            <>
              <Fab
                color="primary"
                aria-label="table of contents"
                sx={{ position: 'fixed', bottom: 16, right: 16 }}
                onClick={() => setTocOpen(true)}
              >
                <MenuBook />
              </Fab>
              <Drawer
                anchor="right"
                open={tocOpen}
                onClose={() => setTocOpen(false)}
                PaperProps={{ sx: { width: 280, p: 2 } }}
              >
                <TableOfContents 
                  sections={educationSections}
                  activeSection={activeSection}
                  onSectionClick={(sectionId) => {
                    handleSectionChange(sectionId);
                    setTocOpen(false);
                  }}
                />
              </Drawer>
            </>
          )}
        </Container>
      </Layout>
    </CitationProvider>
  );
};

export default Education;
```

### 2. MUI Component Mapping & Key Components

#### EducationSection Component (MUI focused)
```jsx
// src/components/education/EducationSection.jsx
import React, { useRef, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Button,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider
} from '@mui/material';
import { ExpandMore, Launch } from '@mui/icons-material';
import { useInView } from 'react-intersection-observer';
import CitationLink from './CitationLink';
import ImageGallery from './ImageGallery';
import AcquisitionButton from './AcquisitionButton';

const EducationSection = ({ section, isActive, onSectionEnter }) => {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: false
  });

  useEffect(() => {
    if (inView) {
      onSectionEnter();
    }
  }, [inView, onSectionEnter]);

  const renderContent = (content) => {
    if (typeof content === 'string') {
      // Process citations in text
      return content.split(/(<a[^>]*class="citation"[^>]*>.*?<\/a>)/g).map((part, index) => {
        if (part.includes('class="citation"')) {
          const refMatch = part.match(/href="#(ref\d+)"/);
          const textMatch = part.match(/>([^<]+)</);
          if (refMatch && textMatch) {
            return <CitationLink key={index} refId={refMatch[1]} text={textMatch[1]} />;
          }
        }
        return part;
      });
    }
    return content;
  };

  return (
    <Card 
      ref={ref}
      id={section.id}
      elevation={isActive ? 4 : 1}
      sx={{ 
        mb: 3,
        transition: 'all 0.3s ease',
        border: isActive ? 2 : 1,
        borderColor: isActive ? 'primary.main' : 'divider'
      }}
    >
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Typography 
          variant="h4" 
          component="h2" 
          gutterBottom
          sx={{ 
            color: 'primary.main',
            fontWeight: 'bold',
            fontSize: { xs: '1.5rem', md: '2rem' }
          }}
        >
          {section.title}
        </Typography>

        {section.subsections ? (
          // Collapsible subsections
          section.subsections.map((subsection, index) => (
            <Accordion key={index} defaultExpanded={index === 0}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                  {subsection.title}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ '& > *': { mb: 2 } }}>
                  {subsection.content.map((item, idx) => (
                    <Box key={idx}>
                      {item.type === 'paragraph' && (
                        <Typography variant="body1" paragraph>
                          {renderContent(item.text)}
                        </Typography>
                      )}
                      {item.type === 'list' && (
                        <List sx={{ bgcolor: 'grey.50', borderRadius: 1, p: 1 }}>
                          {item.items.map((listItem, listIdx) => (
                            <ListItem key={listIdx} sx={{ py: 0.5 }}>
                              <ListItemText 
                                primary={
                                  <Typography variant="body2">
                                    <strong>{listItem.label}:</strong> {listItem.text}
                                  </Typography>
                                }
                              />
                            </ListItem>
                          ))}
                        </List>
                      )}
                      {item.type === 'acquisition_button' && (
                        <AcquisitionButton veinType={item.veinType} />
                      )}
                    </Box>
                  ))}
                </Box>
              </AccordionDetails>
            </Accordion>
          ))
        ) : (
          // Simple content
          <Box sx={{ '& > *': { mb: 2 } }}>
            {section.content?.map((item, index) => (
              <Box key={index}>
                {item.type === 'paragraph' && (
                  <Typography variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
                    {renderContent(item.text)}
                  </Typography>
                )}
                {item.type === 'list' && (
                  <List sx={{ bgcolor: 'grey.50', borderRadius: 1, p: 2 }}>
                    {item.items.map((listItem, listIdx) => (
                      <ListItem key={listIdx} sx={{ py: 0.5 }}>
                        <ListItemText 
                          primary={
                            <Typography variant="body1">
                              <strong>{listItem.label}</strong> {listItem.text}
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
                {item.type === 'image_gallery' && (
                  <ImageGallery 
                    images={item.images}
                    title={item.title}
                    description={item.description}
                  />
                )}
              </Box>
            ))}
          </Box>
        )}

        {section.tags && (
          <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {section.tags.map((tag, index) => (
              <Chip key={index} label={tag} variant="outlined" size="small" />
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default EducationSection;
```

#### ImageGallery Component (MUI with Lightbox)
```jsx
// src/components/education/ImageGallery.jsx
import React, { useState } from 'react';
import {
  Box,
  ImageList,
  ImageListItem,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery,
  Chip
} from '@mui/material';
import { Close, ZoomIn, NavigateBefore, NavigateNext } from '@mui/icons-material';

const ImageGallery = ({ images, title, description }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleImageClick = (image, index) => {
    setSelectedImage(image);
    setCurrentIndex(index);
  };

  const handleClose = () => {
    setSelectedImage(null);
  };

  const handlePrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
    setCurrentIndex(newIndex);
    setSelectedImage(images[newIndex]);
  };

  const handleNext = () => {
    const newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(newIndex);
    setSelectedImage(images[newIndex]);
  };

  return (
    <Box sx={{ my: 3 }}>
      {title && (
        <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'medium' }}>
          {title}
        </Typography>
      )}
      {description && (
        <Typography variant="body2" color="text.secondary" paragraph>
          {description}
        </Typography>
      )}

      <ImageList 
        cols={isMobile ? 1 : 2} 
        gap={16}
        sx={{ 
          width: '100%',
          height: 'auto',
          '& .MuiImageListItem-root': {
            cursor: 'pointer',
            transition: 'transform 0.2s ease',
            '&:hover': {
              transform: 'scale(1.02)',
              '& .zoom-overlay': {
                opacity: 1
              }
            }
          }
        }}
      >
        {images.map((image, index) => (
          <ImageListItem 
            key={image.id || index}
            onClick={() => handleImageClick(image, index)}
            sx={{ position: 'relative', borderRadius: 1, overflow: 'hidden' }}
          >
            <img
              src={image.src}
              alt={image.alt || `Image ${index + 1}`}
              loading="lazy"
              style={{ borderRadius: 8 }}
            />
            <Box
              className="zoom-overlay"
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0,
                transition: 'opacity 0.2s ease'
              }}
            >
              <ZoomIn sx={{ color: 'white', fontSize: 48 }} />
            </Box>
            {image.caption && (
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                  color: 'white',
                  p: 1
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: 'medium' }}>
                  {image.caption}
                </Typography>
              </Box>
            )}
          </ImageListItem>
        ))}
      </ImageList>

      {/* Lightbox Dialog */}
      <Dialog
        open={!!selectedImage}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { 
            bgcolor: 'rgba(0, 0, 0, 0.9)',
            boxShadow: 'none',
            overflow: 'hidden'
          }
        }}
      >
        <DialogContent sx={{ p: 0, position: 'relative', textAlign: 'center' }}>
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              color: 'white',
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1,
              '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' }
            }}
          >
            <Close />
          </IconButton>

          {images.length > 1 && (
            <>
              <IconButton
                onClick={handlePrevious}
                sx={{
                  position: 'absolute',
                  left: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'white',
                  bgcolor: 'rgba(0, 0, 0, 0.5)',
                  zIndex: 1,
                  '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' }
                }}
              >
                <NavigateBefore />
              </IconButton>
              <IconButton
                onClick={handleNext}
                sx={{
                  position: 'absolute',
                  right: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'white',
                  bgcolor: 'rgba(0, 0, 0, 0.5)',
                  zIndex: 1,
                  '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' }
                }}
              >
                <NavigateNext />
              </IconButton>
            </>
          )}

          {selectedImage && (
            <Box sx={{ maxHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '100%', 
                  objectFit: 'contain' 
                }}
              />
            </Box>
          )}

          {selectedImage?.caption && (
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'white', 
                p: 2, 
                bgcolor: 'rgba(0, 0, 0, 0.7)',
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0
              }}
            >
              {selectedImage.caption}
            </Typography>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ImageGallery;
```

#### GradingSystemTable Component
```jsx
// src/components/education/GradingSystemTable.jsx
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Box,
  useTheme,
  useMediaQuery
} from '@mui/material';

const gradingData = [
  {
    grade: 0,
    ivc: '≤ 2 cm',
    hepatic: 'Normal S > D',
    portal: 'Normal Phasic',
    intrarenal: 'Continuous',
    color: '#4caf50'
  },
  {
    grade: 1,
    ivc: '2–2.5 cm',
    hepatic: 'Slight Reduction in S',
    portal: 'Mild Pulsatility',
    intrarenal: 'Slight Interruption',
    color: '#ff9800'
  },
  {
    grade: 2,
    ivc: '>= 2.5 cm',
    hepatic: 'S < D / Reversal',
    portal: 'Marked Pulsatility',
    intrarenal: 'Intermittent or Biphasic',
    color: '#f44336'
  },
  {
    grade: 3,
    ivc: '>= 2.5 cm + Minimal Collapse',
    hepatic: 'Severe Abnormal Flow',
    portal: 'To-and-Fro or Reversal',
    intrarenal: 'Reversal',
    color: '#9c27b0'
  }
];

const GradingSystemTable = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Card elevation={2} sx={{ mb: 4 }} id="vexus-grading-system">
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Typography 
          variant="h4" 
          component="h2" 
          gutterBottom
          sx={{ 
            color: 'primary.main',
            fontWeight: 'bold',
            textAlign: 'center',
            mb: 3
          }}
        >
          VEXUS Grading System
        </Typography>
        
        <TableContainer component={Paper} elevation={1}>
          <Table size={isMobile ? 'small' : 'medium'}>
            <TableHead>
              <TableRow sx={{ bgcolor: 'primary.main' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Grade</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>IVC Diameter</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Hepatic Vein Flow</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Portal Vein Flow</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Intrarenal Vein Flow</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {gradingData.map((row) => (
                <TableRow 
                  key={row.grade}
                  sx={{ 
                    '&:nth-of-type(odd)': { bgcolor: 'action.hover' },
                    '&:hover': { bgcolor: 'action.selected' }
                  }}
                >
                  <TableCell>
                    <Chip 
                      label={row.grade} 
                      sx={{ 
                        bgcolor: row.color, 
                        color: 'white',
                        fontWeight: 'bold',
                        minWidth: 40
                      }} 
                    />
                  </TableCell>
                  <TableCell sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}>
                    {row.ivc}
                  </TableCell>
                  <TableCell sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}>
                    {row.hepatic}
                  </TableCell>
                  <TableCell sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}>
                    {row.portal}
                  </TableCell>
                  <TableCell sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}>
                    {row.intrarenal}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 2, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
          <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
            <strong>Note:</strong> VEXUS grading should be interpreted in clinical context. 
            Higher grades indicate increased venous congestion and may correlate with adverse outcomes.
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default GradingSystemTable;
```

### 3. State Management & Context Strategy

#### CitationProvider Context
```jsx
// src/contexts/CitationProvider.jsx
import React, { createContext, useContext, useState, useCallback } from 'react';

const CitationContext = createContext();

export const useCitation = () => {
  const context = useContext(CitationContext);
  if (!context) {
    throw new Error('useCitation must be used within a CitationProvider');
  }
  return context;
};

export const CitationProvider = ({ children }) => {
  const [highlightedCitation, setHighlightedCitation] = useState(null);
  const [citationHistory, setCitationHistory] = useState([]);

  const highlightCitation = useCallback((refId) => {
    setHighlightedCitation(refId);
    setCitationHistory(prev => [...prev.filter(id => id !== refId), refId].slice(-5)); // Keep last 5
    
    // Auto-clear highlight after 3 seconds
    setTimeout(() => {
      setHighlightedCitation(null);
    }, 3000);
  }, []);

  const scrollToReference = useCallback((refId) => {
    const element = document.getElementById(refId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      highlightCitation(refId);
    }
  }, [highlightCitation]);

  const value = {
    highlightedCitation,
    citationHistory,
    highlightCitation,
    scrollToReference
  };

  return (
    <CitationContext.Provider value={value}>
      {children}
    </CitationContext.Provider>
  );
};

export default CitationProvider;
```

### 4. Configuration & Content Management

#### Education Configuration
```javascript
// src/config/educationConfig.js
export const educationSections = [
  {
    id: 'introduction',
    title: 'Introduction',
    content: [
      {
        type: 'paragraph',
        text: 'Call it what you want—"Fluid Overload", "Venous Hypertension", "Fluid Up", "Venous Congestion" - they all mean the same thing: the venous circulation is too full, and it\'s causing problems.<a href="#ref1" class="citation">1</a> For a long time, the medical field has focused on arterial hypotension...'
      }
    ],
    tags: ['Introduction', 'Venous Congestion', 'Clinical Overview']
  },
  {
    id: 'what-is-vexus',
    title: 'What Is VEXUS?',
    content: [
      {
        type: 'paragraph',
        text: 'VEXUS is a 4-point Doppler ultrasound protocol that measures the direction and speed of venous blood flow...'
      },
      {
        type: 'list',
        items: [
          { label: 'Inferior Vena Cava (IVC) Diameter', text: '' },
          { label: 'Hepatic Vein Doppler', text: '' },
          { label: 'Portal Vein Doppler', text: '' },
          { label: 'Renal Vein Doppler', text: '' }
        ]
      }
    ],
    tags: ['VEXUS Protocol', 'Ultrasound', 'Doppler']
  },
  {
    id: 'vexus-step-by-step',
    title: 'VEXUS Step-by-Step',
    subsections: [
      {
        title: '1. Equipment and Preparation',
        content: [
          {
            type: 'list',
            items: [
              { 
                label: 'Ultrasound Machine', 
                text: 'Must have 2D imaging, color Doppler, and pulsed-wave Doppler capabilities.' 
              },
              { label: 'Supplies', text: 'Ultrasound gel, gloves.' },
              { label: 'Patient Positioning', text: 'Supine or slightly recumbent, table adjusted to operator\'s waist level.' }
            ]
          }
        ]
      },
      {
        title: '2. Inferior Vena Cava (IVC) Assessment',
        content: [
          {
            type: 'paragraph',
            text: 'Measure the IVC using the curvilinear or phased-array probe in the subxiphoid view...'
          },
          {
            type: 'acquisition_button',
            veinType: 'ivc'
          }
        ]
      }
      // Additional subsections...
    ],
    tags: ['Step-by-step', 'Technique', 'Clinical Practice']
  },
  {
    id: 'organ-perfusion-pressure',
    title: 'Understanding Organ Perfusion Pressure',
    content: [
      {
        type: 'image_gallery',
        title: 'Organ Perfusion Diagram',
        images: [
          {
            id: 'organ-perfusion',
            src: '/images/organ perfusion.png',
            alt: 'Organ Perfusion Diagram',
            caption: 'Perfusion Pressure = Arterial Pressure - Venous Pressure'
          }
        ]
      },
      {
        type: 'paragraph',
        text: 'Organ perfusion pressure is a critical concept in understanding venous congestion...'
      }
    ],
    tags: ['Physiology', 'Perfusion', 'Clinical Concepts']
  }
];

export const references = [
  {
    id: 'ref1',
    number: 1,
    title: 'Systemic Venous Congestion Reviewed',
    authors: 'Banjade P, Subedi A, Ghamande S, Surani S, Sharma M',
    journal: 'Cureus. Aug 2023;15(8):e43716',
    doi: '10.7759/cureus.43716',
    url: 'https://doi.org/10.7759/cureus.43716'
  }
  // Additional references...
];
```

### 5. Performance Optimizations & Progressive Loading

- **Lazy Loading**: Use `React.lazy()` for heavy sections and image galleries
- **Virtual Scrolling**: For large reference lists using `@mui/x-data-grid` if needed
- **Memoization**: `React.memo` for section components, `useCallback` for handlers
- **Image Optimization**: WebP format with fallbacks, responsive images
- **Code Splitting**: Separate chunks for different education modules

### 6. Testing Strategy (MUI Context)

```javascript
// src/components/education/__tests__/EducationSection.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import EducationSection from '../EducationSection';
import CitationProvider from '../../../contexts/CitationProvider';

const theme = createTheme();

const mockSection = {
  id: 'test-section',
  title: 'Test Section',
  content: [
    {
      type: 'paragraph',
      text: 'Test content with <a href="#ref1" class="citation">1</a> citation.'
    }
  ]
};

const renderWithProviders = (component) => {
  return render(
    <ThemeProvider theme={theme}>
      <CitationProvider>
        {component}
      </CitationProvider>
    </ThemeProvider>
  );
};

describe('EducationSection', () => {
  test('renders section title and content', () => {
    renderWithProviders(
      <EducationSection 
        section={mockSection}
        isActive={false}
        onSectionEnter={() => {}}
      />
    );
    
    expect(screen.getByText('Test Section')).toBeInTheDocument();
    expect(screen.getByText(/Test content with/)).toBeInTheDocument();
  });

  test('handles citation links', () => {
    const mockScrollToReference = jest.fn();
    
    renderWithProviders(
      <EducationSection 
        section={mockSection}
        isActive={false}
        onSectionEnter={() => {}}
      />
    );
    
    const citationLink = screen.getByText('1');
    fireEvent.click(citationLink);
    // Verify citation interaction
  });
});
```

### 7. Dependencies & Implementation Priority

#### Dependencies
```json
{
  "dependencies": {
    "@mui/material": "^5.x.x",
    "@mui/icons-material": "^5.x.x",
    "@emotion/react": "^11.x.x",
    "@emotion/styled": "^11.x.x",
    "react": "^18.x.x",
    "react-dom": "^18.x.x",
    "react-intersection-observer": "^9.x.x",
    "react-router-dom": "^6.x.x"
  },
  "devDependencies": {
    "@testing-library/react": "^13.x.x",
    "@testing-library/jest-dom": "^5.x.x",
    "@testing-library/user-event": "^14.x.x",
    "jest-axe": "^7.x.x"
  }
}
```

#### Implementation Priority
1. **Core Layout & Navigation** (Container, TOC, Sections)
2. **Content Rendering** (Typography, Lists, Basic sections)
3. **Citation System** (Context, Links, References)
4. **Image Galleries** (ImageList, Lightbox functionality)
5. **Interactive Elements** (Accordions, Acquisition buttons)
6. **VEXUS Grading Table** (Table component with styling)
7. **Performance Optimizations** (Lazy loading, memoization)
8. **Responsive Design** (Mobile TOC, touch interactions)

### 8. Accessibility & SEO Considerations

- **Semantic HTML**: Proper heading hierarchy with MUI Typography
- **Keyboard Navigation**: Focus management for lightbox and TOC
- **ARIA Labels**: For interactive elements and image galleries
- **Screen Reader Support**: Alt texts, descriptions for complex images
- **Progressive Enhancement**: Core content accessible without JavaScript
- **SEO Optimization**: Structured data for educational content, proper meta tags

This comprehensive framework provides a robust foundation for converting the education.astro page to a modern React application with Material-UI, ensuring excellent user experience, accessibility, and performance. 
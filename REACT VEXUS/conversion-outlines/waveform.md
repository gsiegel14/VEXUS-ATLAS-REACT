# Waveform Page Conversion Outline

## Overview
Convert `waveform.astro` to a React component with comprehensive waveform analysis education, interactive image galleries, pattern recognition training, and ultrasound interpretation tools using Material-UI components.

## Current Structure Analysis
- Educational content on ultrasound waveform interpretation
- Interactive image galleries with before/after waveform comparisons
- Pattern recognition modules for hepatic, portal, and renal veins
- Detailed explanations of normal vs abnormal waveform patterns
- Case-based learning with real ultrasound images
- Progressive disclosure of complex waveform analysis concepts
- Integration with Fancybox for detailed image viewing
- Mobile-responsive design for educational accessibility
- Reference materials and clinical correlation guides

## Comprehensive Conversion Framework

### 1. Main Component Architecture & MUI Integration
```jsx
// src/pages/Waveform.jsx
import React, { useState, useMemo } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Tabs,
  Tab,
  Grid,
  useTheme,
  useMediaQuery,
  Fab
} from '@mui/material';
import { Timeline, Quiz, School } from '@mui/icons-material';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import WaveformSection from '../components/waveform/WaveformSection';
import WaveformGallery from '../components/waveform/WaveformGallery';
import WaveformQuiz from '../components/waveform/WaveformQuiz';
import ProgressTracker from '../components/waveform/ProgressTracker';
import { useWaveformData } from '../hooks/useWaveformData';
import { waveformConfig } from '../config/waveformConfig';

const Waveform = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [activeTab, setActiveTab] = useState(0);
  const [quizMode, setQuizMode] = useState(false);
  const { waveformData, userProgress, updateProgress } = useWaveformData();

  const sections = [
    {
      id: 'hepatic-vein',
      title: 'Hepatic Vein Waveforms',
      description: 'Understanding normal and abnormal hepatic vein waveform patterns in the context of venous congestion assessment.',
      icon: '🫀',
      color: 'primary',
      data: waveformData.hepatic
    },
    {
      id: 'portal-vein',
      title: 'Portal Vein Waveforms', 
      description: 'Analyzing portal vein flow patterns and their relationship to venous congestion and hepatic function.',
      icon: '🩸',
      color: 'secondary',
      data: waveformData.portal
    },
    {
      id: 'renal-vein',
      title: 'Renal Vein Waveforms',
      description: 'Interpreting renal venous flow patterns to assess renal congestion and kidney function.',
      icon: '🫘',
      color: 'success',
      data: waveformData.renal
    }
  ];

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Layout>
      <SEO 
        title="Waveform Analysis - VEXUS ATLAS"
        description="Learn ultrasound waveform interpretation for VEXUS assessment. Comprehensive training on hepatic, portal, and renal vein waveform patterns."
        keywords="VEXUS, waveform, ultrasound, interpretation, hepatic vein, portal vein, renal vein, venous congestion"
        ogTitle="Waveform Analysis | VEXUS ATLAS Education"
        ogImage="https://yourdomain.com/images/vexus-waveform-preview.jpg"
        ogUrl="https://yourdomain.com/waveform"
      />
      
      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
        {/* Header */}
        <Card elevation={2} sx={{ mb: 4 }}>
          <CardContent sx={{ textAlign: 'center', p: { xs: 2, md: 4 } }}>
            <Timeline sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Waveform Analysis
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
              Master the art of ultrasound waveform interpretation for VEXUS assessment
            </Typography>
          </CardContent>
        </Card>

        {/* Progress Tracker */}
        <ProgressTracker 
          progress={userProgress}
          sections={sections}
          onSectionSelect={setActiveTab}
        />

        {/* Introduction */}
        <Card elevation={1} sx={{ mb: 4, bgcolor: 'grey.50' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="body1" paragraph sx={{ lineHeight: 1.6 }}>
              Understanding waveform patterns is crucial for accurate VEXUS scoring. This comprehensive guide covers 
              normal and abnormal waveform patterns in hepatic, portal, and renal veins, helping you develop 
              expertise in venous congestion assessment through ultrasound interpretation.
            </Typography>
          </CardContent>
        </Card>

        {/* Main Tabs */}
        <Card elevation={1} sx={{ mb: 4 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant={isMobile ? "scrollable" : "fullWidth"}
            scrollButtons={isMobile ? "auto" : false}
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            {sections.map((section, index) => (
              <Tab
                key={section.id}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span>{section.icon}</span>
                    <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
                      {section.title}
                    </Typography>
                  </Box>
                }
                sx={{ minHeight: 48 }}
              />
            ))}
          </Tabs>
        </Card>

        {/* Waveform Sections */}
        {sections.map((section, index) => (
          <div key={section.id} hidden={activeTab !== index}>
            {activeTab === index && (
              <WaveformSection
                section={section}
                onProgressUpdate={(sectionId, itemId) => 
                  updateProgress(sectionId, itemId)
                }
                userProgress={userProgress[section.id] || {}}
              />
            )}
          </div>
        ))}

        {/* Quiz Mode */}
        {quizMode && (
          <WaveformQuiz
            section={sections[activeTab]}
            onClose={() => setQuizMode(false)}
            onComplete={(results) => {
              updateProgress(sections[activeTab].id, 'quiz', results);
              setQuizMode(false);
            }}
          />
        )}

        {/* Floating Action Button */}
        <Fab
          color="secondary"
          aria-label="start quiz"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={() => setQuizMode(true)}
        >
          <Quiz />
        </Fab>
      </Container>
    </Layout>
  );
};

export default Waveform;
```

### 2. Waveform Section Component
```jsx
// src/components/waveform/WaveformSection.jsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Button,
  useTheme
} from '@mui/material';
import { ExpandMore, CheckCircle, RadioButtonUnchecked } from '@mui/icons-material';
import WaveformGallery from './WaveformGallery';
import WaveformComparison from './WaveformComparison';
import ClinicalCorrelation from './ClinicalCorrelation';

const WaveformSection = ({ section, onProgressUpdate, userProgress }) => {
  const theme = useTheme();
  const [expandedAccordion, setExpandedAccordion] = useState('basics');

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedAccordion(isExpanded ? panel : false);
    if (isExpanded) {
      onProgressUpdate(section.id, panel);
    }
  };

  const sectionContent = [
    {
      id: 'basics',
      title: 'Basic Waveform Anatomy',
      description: 'Understanding the fundamental components of waveform patterns',
      content: section.data?.basics || {},
      difficulty: 'Beginner'
    },
    {
      id: 'normal-patterns',
      title: 'Normal Waveform Patterns',
      description: 'Recognizing healthy venous flow patterns',
      content: section.data?.normal || {},
      difficulty: 'Beginner'
    },
    {
      id: 'abnormal-patterns',
      title: 'Abnormal Waveform Patterns',
      description: 'Identifying pathological venous flow changes',
      content: section.data?.abnormal || {},
      difficulty: 'Intermediate'
    },
    {
      id: 'grading-system',
      title: 'VEXUS Grading System',
      description: 'How waveform patterns correlate with VEXUS scores',
      content: section.data?.grading || {},
      difficulty: 'Advanced'
    },
    {
      id: 'clinical-cases',
      title: 'Clinical Cases',
      description: 'Real-world examples and case studies',
      content: section.data?.cases || {},
      difficulty: 'Advanced'
    }
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'success';
      case 'Intermediate': return 'warning';
      case 'Advanced': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      {/* Section Overview */}
      <Card elevation={1} sx={{ mb: 4, bgcolor: `${section.color}.50` }}>
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
            <span style={{ fontSize: '2rem', marginRight: 16 }}>{section.icon}</span>
            {section.title}
          </Typography>
          <Typography variant="body1" sx={{ maxWidth: 600, mx: 'auto', lineHeight: 1.6 }}>
            {section.description}
          </Typography>
        </CardContent>
      </Card>

      {/* Learning Modules */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              Learning Modules
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Progress through each module to build your waveform interpretation skills
            </Typography>
          </Box>

          {sectionContent.map((module) => (
            <Accordion
              key={module.id}
              expanded={expandedAccordion === module.id}
              onChange={handleAccordionChange(module.id)}
              sx={{ mb: 2 }}
            >
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                      {userProgress[module.id] ? (
                        <CheckCircle color="success" />
                      ) : (
                        <RadioButtonUnchecked color="disabled" />
                      )}
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {module.title}
                      </Typography>
                      <Chip 
                        label={module.difficulty}
                        size="small"
                        color={getDifficultyColor(module.difficulty)}
                        variant="outlined"
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {module.description}
                    </Typography>
                  </Box>
                </Box>
              </AccordionSummary>
              
              <AccordionDetails>
                {module.id === 'basics' && (
                  <WaveformBasics content={module.content} />
                )}
                {module.id === 'normal-patterns' && (
                  <WaveformGallery 
                    images={module.content.images || []}
                    type="normal"
                    title="Normal Patterns"
                  />
                )}
                {module.id === 'abnormal-patterns' && (
                  <WaveformGallery 
                    images={module.content.images || []}
                    type="abnormal"
                    title="Abnormal Patterns"
                  />
                )}
                {module.id === 'grading-system' && (
                  <GradingSystem content={module.content} />
                )}
                {module.id === 'clinical-cases' && (
                  <ClinicalCases cases={module.content.cases || []} />
                )}
              </AccordionDetails>
            </Accordion>
          ))}
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} lg={4}>
          <Card elevation={1} sx={{ position: 'sticky', top: 20 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Quick Reference
              </Typography>
              
              {/* Progress Summary */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Module Progress
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {sectionContent.map((module) => (
                    <Chip
                      key={module.id}
                      label={module.title.split(' ')[0]}
                      size="small"
                      color={userProgress[module.id] ? 'primary' : 'default'}
                      variant={userProgress[module.id] ? 'filled' : 'outlined'}
                    />
                  ))}
                </Box>
              </Box>

              {/* Key Points */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Key Learning Points
                </Typography>
                <Box component="ul" sx={{ pl: 2, m: 0 }}>
                  {section.data?.keyPoints?.map((point, index) => (
                    <Typography key={index} component="li" variant="body2" sx={{ mb: 0.5 }}>
                      {point}
                    </Typography>
                  ))}
                </Box>
              </Box>

              {/* Clinical Tips */}
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Clinical Tips
                </Typography>
                <Box sx={{ p: 2, bgcolor: 'info.50', borderRadius: 1 }}>
                  <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                    {section.data?.clinicalTip || 'Focus on pattern recognition and correlation with clinical context.'}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default WaveformSection;
```

### 3. Waveform Gallery Component
```jsx
// src/components/waveform/WaveformGallery.jsx
import React, { useState } from 'react';
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  Dialog,
  DialogContent,
  IconButton,
  useTheme
} from '@mui/material';
import { Close, ZoomIn, Compare } from '@mui/icons-material';

const WaveformGallery = ({ images, type, title }) => {
  const theme = useTheme();
  const [selectedImage, setSelectedImage] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setLightboxOpen(true);
  };

  const handleCloseLightbox = () => {
    setLightboxOpen(false);
    setSelectedImage(null);
  };

  const getTypeColor = (imageType) => {
    switch (imageType) {
      case 'normal': return 'success';
      case 'mild': return 'warning';
      case 'moderate': return 'error';
      case 'severe': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        {title}
      </Typography>

      <Grid container spacing={3}>
        {images.map((image, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card 
              elevation={2}
              sx={{
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
              onClick={() => handleImageClick(image)}
            >
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  image={image.src}
                  alt={image.alt}
                  sx={{
                    height: 200,
                    objectFit: 'cover'
                  }}
                />
                <Box sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  display: 'flex',
                  gap: 1
                }}>
                  <Chip
                    label={image.grade || type}
                    size="small"
                    color={getTypeColor(image.grade || type)}
                    sx={{ bgcolor: 'rgba(255,255,255,0.9)' }}
                  />
                  <IconButton 
                    size="small" 
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.9)',
                      '&:hover': { bgcolor: 'rgba(255,255,255,1)' }
                    }}
                  >
                    <ZoomIn fontSize="small" />
                  </IconButton>
                </Box>
              </Box>

              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {image.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {image.description}
                </Typography>
                
                {/* Key Features */}
                {image.features && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {image.features.map((feature, idx) => (
                      <Chip
                        key={idx}
                        label={feature}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Lightbox Dialog */}
      <Dialog
        open={lightboxOpen}
        onClose={handleCloseLightbox}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent sx={{ p: 0, position: 'relative' }}>
          <IconButton
            onClick={handleCloseLightbox}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: 'rgba(255,255,255,0.9)',
              zIndex: 1
            }}
          >
            <Close />
          </IconButton>
          
          {selectedImage && (
            <Box>
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '70vh',
                  objectFit: 'contain'
                }}
              />
              
              <Box sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {selectedImage.title}
                </Typography>
                <Typography variant="body1" paragraph>
                  {selectedImage.description}
                </Typography>
                
                {/* Detailed Analysis */}
                {selectedImage.analysis && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Waveform Analysis
                    </Typography>
                    <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                      {selectedImage.analysis}
                    </Typography>
                  </Box>
                )}

                {/* Clinical Correlation */}
                {selectedImage.clinicalCorrelation && (
                  <Box sx={{ mt: 2, p: 2, bgcolor: 'info.50', borderRadius: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Clinical Correlation
                    </Typography>
                    <Typography variant="body2">
                      {selectedImage.clinicalCorrelation}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default WaveformGallery;
```

### 4. Progress Tracker Component
```jsx
// src/components/waveform/ProgressTracker.jsx
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
  Button,
  Grid
} from '@mui/material';
import { CheckCircle, Schedule, Lock } from '@mui/icons-material';

const ProgressTracker = ({ progress, sections, onSectionSelect }) => {
  const calculateOverallProgress = () => {
    const totalSections = sections.length;
    const completedSections = sections.filter(section => 
      progress[section.id] && Object.keys(progress[section.id]).length > 0
    ).length;
    
    return (completedSections / totalSections) * 100;
  };

  const getSectionProgress = (sectionId) => {
    const sectionData = progress[sectionId] || {};
    const totalModules = 5; // basics, normal, abnormal, grading, cases
    const completedModules = Object.keys(sectionData).length;
    return (completedModules / totalModules) * 100;
  };

  const getSectionStatus = (sectionId, index) => {
    const sectionProgress = getSectionProgress(sectionId);
    if (sectionProgress === 100) return 'completed';
    if (sectionProgress > 0) return 'in-progress';
    if (index === 0) return 'available';
    
    // Check if previous section is completed
    const prevSectionId = sections[index - 1]?.id;
    const prevProgress = getSectionProgress(prevSectionId);
    return prevProgress === 100 ? 'available' : 'locked';
  };

  return (
    <Card elevation={1} sx={{ mb: 4 }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
          Learning Progress
        </Typography>

        {/* Overall Progress */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Overall Completion
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              {Math.round(calculateOverallProgress())}%
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={calculateOverallProgress()} 
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>

        {/* Section Progress */}
        <Grid container spacing={2}>
          {sections.map((section, index) => {
            const status = getSectionStatus(section.id, index);
            const sectionProgress = getSectionProgress(section.id);

            return (
              <Grid item xs={12} sm={4} key={section.id}>
                <Card 
                  variant="outlined"
                  sx={{
                    cursor: status !== 'locked' ? 'pointer' : 'not-allowed',
                    opacity: status === 'locked' ? 0.6 : 1,
                    '&:hover': status !== 'locked' ? {
                      bgcolor: 'action.hover'
                    } : {}
                  }}
                  onClick={() => status !== 'locked' && onSectionSelect(index)}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ fontSize: '1.5rem', mr: 1 }}>{section.icon}</Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          {section.title.split(' ')[0]} {section.title.split(' ')[1]}
                        </Typography>
                      </Box>
                      {status === 'completed' && <CheckCircle color="success" />}
                      {status === 'in-progress' && <Schedule color="warning" />}
                      {status === 'locked' && <Lock color="disabled" />}
                    </Box>

                    {status !== 'locked' && (
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            Progress
                          </Typography>
                          <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                            {Math.round(sectionProgress)}%
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={sectionProgress}
                          color={section.color}
                          sx={{ height: 4, borderRadius: 2 }}
                        />
                      </Box>
                    )}

                    {status === 'locked' && (
                      <Typography variant="caption" color="text.secondary">
                        Complete previous section to unlock
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Quick Stats */}
        <Box sx={{ display: 'flex', gap: 2, mt: 3, flexWrap: 'wrap' }}>
          <Chip
            label={`${sections.filter((_, i) => getSectionStatus(sections[i].id, i) === 'completed').length} Completed`}
            color="success"
            variant="outlined"
          />
          <Chip
            label={`${sections.filter((_, i) => getSectionStatus(sections[i].id, i) === 'in-progress').length} In Progress`}
            color="warning"
            variant="outlined"
          />
          <Chip
            label={`${sections.filter((_, i) => getSectionStatus(sections[i].id, i) === 'locked').length} Locked`}
            color="default"
            variant="outlined"
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProgressTracker;
```

### 5. State Management Hook

#### useWaveformData Hook
```jsx
// src/hooks/useWaveformData.js
import { useState, useEffect, useCallback } from 'react';
import { waveformService } from '../services/waveformService';

export const useWaveformData = () => {
  const [waveformData, setWaveformData] = useState({
    hepatic: {},
    portal: {},
    renal: {}
  });
  const [userProgress, setUserProgress] = useState(() => {
    const saved = localStorage.getItem('vexus-waveform-progress');
    return saved ? JSON.parse(saved) : {};
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWaveformData = async () => {
      try {
        setLoading(true);
        const data = await waveformService.fetchWaveformData();
        setWaveformData(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        // Fallback to static data
        setWaveformData(waveformConfig.data);
      } finally {
        setLoading(false);
      }
    };

    fetchWaveformData();
  }, []);

  const updateProgress = useCallback((sectionId, itemId, data = true) => {
    setUserProgress(prev => {
      const updated = {
        ...prev,
        [sectionId]: {
          ...prev[sectionId],
          [itemId]: data
        }
      };
      localStorage.setItem('vexus-waveform-progress', JSON.stringify(updated));
      return updated;
    });
  }, []);

  return {
    waveformData,
    userProgress,
    updateProgress,
    loading,
    error
  };
};
```

### 6. Configuration & Data Management

#### Waveform Configuration
```javascript
// src/config/waveformConfig.js
export const waveformConfig = {
  data: {
    hepatic: {
      basics: {
        title: "Hepatic Vein Anatomy",
        description: "Understanding hepatic venous drainage and normal flow patterns",
        keyPoints: [
          "Three main hepatic veins: right, middle, left",
          "Normal triphasic waveform pattern",
          "Respiratory variation considerations",
          "Optimal imaging windows and techniques"
        ]
      },
      normal: {
        images: [
          {
            src: "/images/waveforms/hepatic-normal-1.jpg",
            title: "Normal Triphasic Pattern",
            description: "Classic hepatic vein waveform showing three distinct phases",
            grade: "normal",
            features: ["Antegrade flow", "Minimal pulsatility", "Respiratory variation"],
            analysis: "This waveform demonstrates normal hepatic venous flow with characteristic triphasic pattern. Note the smooth, continuous flow with minimal pulsatility and appropriate respiratory variation.",
            clinicalCorrelation: "Normal hepatic venous flow indicates adequate venous drainage and absence of significant congestion."
          }
        ]
      },
      abnormal: {
        images: [
          {
            src: "/images/waveforms/hepatic-mild-1.jpg",
            title: "Mild Congestion Pattern",
            description: "Early signs of venous congestion with reduced pulsatility",
            grade: "mild",
            features: ["Reduced pulsatility", "Blunted waveform", "Maintained flow"],
            analysis: "Waveform shows early signs of congestion with reduced pulsatility compared to normal. Flow remains antegrade but pattern is blunted.",
            clinicalCorrelation: "May indicate early fluid overload or beginning venous congestion."
          }
        ]
      },
      grading: {
        criteria: [
          { grade: 0, pattern: "Normal triphasic", description: "Clear three-phase pattern" },
          { grade: 1, pattern: "Mild blunting", description: "Reduced but present pulsatility" },
          { grade: 2, pattern: "Severe blunting", description: "Markedly reduced pulsatility" },
          { grade: 3, pattern: "Reversed flow", description: "Retrograde flow components" }
        ]
      },
      cases: {
        cases: [
          {
            id: "case-hv-1",
            title: "ICU Patient with Fluid Overload",
            presentation: "72-year-old patient in ICU with progressive fluid retention",
            findings: "Hepatic vein shows severely blunted waveform pattern",
            vexusScore: 2,
            outcome: "Guided diuresis based on VEXUS assessment"
          }
        ]
      }
    },
    portal: {
      // Similar structure for portal vein data
    },
    renal: {
      // Similar structure for renal vein data
    }
  }
};
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
    "react-dom": "^18.x.x"
  }
}
```

#### Implementation Priority
1. **Core Layout & Structure** (Container, tabs, basic navigation)
2. **Progress Tracking System** (User progress, section unlocking)
3. **Waveform Gallery** (Image display, lightbox functionality)
4. **Educational Content** (Accordion modules, text content)
5. **Interactive Features** (Quizzes, comparisons, assessments)
6. **Progress Persistence** (Local storage, user tracking)
7. **Performance Optimizations** (Image lazy loading, content caching)
8. **Testing & Accessibility** (Complete coverage, ARIA support)

### 8. Testing Strategy

```javascript
// src/components/waveform/__tests__/WaveformGallery.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import WaveformGallery from '../WaveformGallery';

const theme = createTheme();
const mockImages = [
  {
    src: '/test-image.jpg',
    title: 'Test Waveform',
    description: 'Test description',
    grade: 'normal',
    features: ['Test feature']
  }
];

describe('WaveformGallery', () => {
  test('renders waveform images', () => {
    render(
      <ThemeProvider theme={theme}>
        <WaveformGallery images={mockImages} type="normal" title="Test Gallery" />
      </ThemeProvider>
    );
    
    expect(screen.getByText('Test Gallery')).toBeInTheDocument();
    expect(screen.getByText('Test Waveform')).toBeInTheDocument();
  });

  test('opens lightbox on image click', () => {
    render(
      <ThemeProvider theme={theme}>
        <WaveformGallery images={mockImages} type="normal" title="Test Gallery" />
      </ThemeProvider>
    );
    
    const imageCard = screen.getByText('Test Waveform').closest('.MuiCard-root');
    fireEvent.click(imageCard);
    
    // Check if lightbox dialog is opened
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
```

### 9. Performance & SEO Considerations

- **Educational Schema**: Structured data for learning content
- **Progress Tracking**: Local storage with cloud sync capability
- **Image Optimization**: WebP formats, progressive loading
- **Accessibility**: Screen reader support, keyboard navigation
- **Mobile Learning**: Touch-optimized interactions, offline capability
- **Performance**: Lazy loading, content prefetching, optimized rendering

This comprehensive framework provides a robust foundation for converting the waveform.astro page to a modern React application with Material-UI, ensuring excellent user experience for medical education and waveform interpretation training. 
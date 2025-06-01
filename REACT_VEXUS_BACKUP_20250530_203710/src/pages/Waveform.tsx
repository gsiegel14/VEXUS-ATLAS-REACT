import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
  Fab
} from '@mui/material';
import { Timeline, Quiz } from '@mui/icons-material';
import BaseLayout from '../components/templates/BaseLayout';
import WaveformSection from '../components/waveform/WaveformSection';
import WaveformQuiz from '../components/waveform/WaveformQuiz';
import ProgressTracker from '../components/waveform/ProgressTracker';
import { useWaveformData } from '../hooks/useWaveformData';

const Waveform: React.FC = () => {
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
      color: 'primary' as const,
      data: waveformData.hepatic
    },
    {
      id: 'portal-vein',
      title: 'Portal Vein Waveforms', 
      description: 'Analyzing portal vein flow patterns and their relationship to venous congestion and hepatic function.',
      icon: '🩸',
      color: 'secondary' as const,
      data: waveformData.portal
    },
    {
      id: 'renal-vein',
      title: 'Renal Vein Waveforms',
      description: 'Interpreting renal venous flow patterns to assess renal congestion and kidney function.',
      icon: '🫘',
      color: 'success' as const,
      data: waveformData.renal
    }
  ];

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <>
      <Helmet>
        <title>Waveform Analysis - VEXUS ATLAS</title>
        <meta 
          name="description" 
          content="Learn ultrasound waveform interpretation for VEXUS assessment. Comprehensive training on hepatic, portal, and renal vein waveform patterns." 
        />
        <meta 
          name="keywords" 
          content="VEXUS, waveform, ultrasound, interpretation, hepatic vein, portal vein, renal vein, venous congestion" 
        />
        
        {/* OpenGraph Meta Tags */}
        <meta property="og:title" content="Waveform Analysis | VEXUS ATLAS Education" />
        <meta 
          property="og:description" 
          content="Learn ultrasound waveform interpretation for VEXUS assessment. Comprehensive training on hepatic, portal, and renal vein waveform patterns." 
        />
        <meta property="og:image" content="https://www.vexusatlas.com/images/vexus-waveform-preview.jpg" />
        <meta property="og:url" content="https://www.vexusatlas.com/waveform" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="VEXUS ATLAS" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Waveform Analysis | VEXUS ATLAS Education" />
        <meta 
          name="twitter:description" 
          content="Learn ultrasound waveform interpretation for VEXUS assessment. Comprehensive training on hepatic, portal, and renal vein waveform patterns." 
        />
        <meta name="twitter:image" content="https://www.vexusatlas.com/images/vexus-waveform-preview.jpg" />
      </Helmet>

      <BaseLayout pageTitle="Waveform Analysis">
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
              {sections.map((section) => (
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
                  onProgressUpdate={(sectionId: string, itemId: string) => 
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
              onComplete={(results: any) => {
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
      </BaseLayout>
    </>
  );
};

export default Waveform; 
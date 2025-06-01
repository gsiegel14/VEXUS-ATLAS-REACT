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
  Chip
} from '@mui/material';
import { ExpandMore, CheckCircle, RadioButtonUnchecked } from '@mui/icons-material';
import WaveformGallery from './WaveformGallery';
import WaveformBasics from './WaveformBasics';
import GradingSystem from './GradingSystem';
import ClinicalCases from './ClinicalCases';

interface Section {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: 'primary' | 'secondary' | 'success';
  data: any;
}

interface UserProgress {
  [itemId: string]: any;
}

interface WaveformSectionProps {
  section: Section;
  onProgressUpdate: (sectionId: string, itemId: string) => void;
  userProgress: UserProgress;
}

const WaveformSection: React.FC<WaveformSectionProps> = ({ 
  section, 
  onProgressUpdate, 
  userProgress 
}) => {
  const [expandedAccordion, setExpandedAccordion] = useState('basics');

  const handleAccordionChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedAccordion(isExpanded ? panel : '');
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

  const getDifficultyColor = (difficulty: string): 'success' | 'warning' | 'error' | 'default' => {
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
                  {section.data?.keyPoints?.map((point: string, index: number) => (
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
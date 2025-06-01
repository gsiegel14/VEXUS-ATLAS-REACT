import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
  Grid
} from '@mui/material';
import { CheckCircle, Schedule, Lock } from '@mui/icons-material';

interface Section {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: 'primary' | 'secondary' | 'success';
  data: any;
}

interface UserProgress {
  [sectionId: string]: {
    [itemId: string]: any;
  };
}

interface ProgressTrackerProps {
  progress: UserProgress;
  sections: Section[];
  onSectionSelect: (index: number) => void;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ 
  progress, 
  sections, 
  onSectionSelect 
}) => {
  const calculateOverallProgress = () => {
    const totalSections = sections.length;
    const completedSections = sections.filter(section => 
      progress[section.id] && Object.keys(progress[section.id]).length > 0
    ).length;
    
    return (completedSections / totalSections) * 100;
  };

  const getSectionProgress = (sectionId: string) => {
    const sectionData = progress[sectionId] || {};
    const totalModules = 5; // basics, normal, abnormal, grading, cases
    const completedModules = Object.keys(sectionData).length;
    return (completedModules / totalModules) * 100;
  };

  const getSectionStatus = (sectionId: string, index: number) => {
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
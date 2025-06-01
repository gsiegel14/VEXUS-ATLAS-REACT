import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Paper
} from '@mui/material';

interface GradingCriteria {
  grade: number;
  pattern: string;
  description: string;
}

interface GradingSystemProps {
  content: {
    title?: string;
    description?: string;
    criteria?: GradingCriteria[];
  };
}

const GradingSystem: React.FC<GradingSystemProps> = ({ content }) => {
  const getGradeColor = (grade: number): 'success' | 'warning' | 'error' | 'default' => {
    switch (grade) {
      case 0: return 'success';
      case 1: return 'warning';
      case 2: return 'error';
      case 3: return 'error';
      default: return 'default';
    }
  };

  const defaultCriteria: GradingCriteria[] = [
    { grade: 0, pattern: "Normal pattern", description: "Normal continuous flow without abnormal pulsatility" },
    { grade: 1, pattern: "Mild abnormality", description: "Slight increase in pulsatility or mild flow alterations" },
    { grade: 2, pattern: "Moderate abnormality", description: "Clear abnormal pulsatility or flow pattern changes" },
    { grade: 3, pattern: "Severe abnormality", description: "Marked abnormalities with potential flow reversal" }
  ];

  const criteria = content.criteria || defaultCriteria;

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        {content.title || 'VEXUS Grading System'}
      </Typography>

      <Card elevation={1} sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="body1" paragraph sx={{ lineHeight: 1.6 }}>
            {content.description || 'The VEXUS grading system provides a standardized approach to assess venous congestion severity based on waveform patterns.'}
          </Typography>
          
          <Typography variant="body1" paragraph sx={{ lineHeight: 1.6 }}>
            Each grade reflects the severity of venous congestion and helps guide clinical decision-making 
            regarding fluid management and treatment strategies.
          </Typography>
        </CardContent>
      </Card>

      <TableContainer component={Paper} elevation={1}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Grade</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Pattern</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {criteria.map((criterion) => (
              <TableRow key={criterion.grade} sx={{ '&:hover': { bgcolor: 'grey.50' } }}>
                <TableCell>
                  <Chip
                    label={criterion.grade}
                    color={getGradeColor(criterion.grade)}
                    sx={{ fontWeight: 'bold', minWidth: 40 }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {criterion.pattern}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {criterion.description}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Clinical Note */}
      <Box sx={{ mt: 3, p: 2, bgcolor: 'info.50', borderRadius: 1, border: '1px solid', borderColor: 'info.200' }}>
        <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
          🩺 Clinical Application
        </Typography>
        <Typography variant="body2">
          Higher grades (2-3) typically indicate significant venous congestion and may warrant 
          consideration of diuretic therapy or fluid restriction. Lower grades (0-1) suggest 
          adequate venous drainage and may allow for continued fluid administration if clinically indicated.
        </Typography>
      </Box>
    </Box>
  );
};

export default GradingSystem; 
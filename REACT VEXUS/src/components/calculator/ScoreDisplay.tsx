import React from 'react';
import {
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Alert,
} from '@mui/material';
import { 
  Assessment, 
  CheckCircle, 
  Warning, 
  Error, 
  Info 
} from '@mui/icons-material';
import { getScoreGrade } from '../../config/calculatorConfig';

interface ScoreDisplayProps {
  totalScore: number;
  scores: Record<string, number | null>;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  totalScore,
  scores,
}) => {
  const scoreGrade = getScoreGrade(totalScore);
  
  const getSeverityIcon = () => {
    switch (scoreGrade.grade) {
      case 0:
        return <CheckCircle color="success" />;
      case 1:
        return <Info color="info" />;
      case 2:
        return <Warning color="warning" />;
      case 3:
        return <Error color="error" />;
      default:
        return <Assessment />;
    }
  };

  const getSeverityColor = () => {
    return scoreGrade.color || '#2196f3';
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      {/* Main Score Display */}
      <Paper 
        elevation={4} 
        sx={{ 
          p: 4, 
          mb: 3, 
          textAlign: 'center',
          background: `linear-gradient(135deg, ${getSeverityColor()}20, ${getSeverityColor()}10)`,
          border: `2px solid ${getSeverityColor()}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          {getSeverityIcon()}
          <Typography variant="h4" sx={{ ml: 1, fontWeight: 'bold' }}>
            VEXUS Grade {scoreGrade.grade}
          </Typography>
        </Box>
        
        <Typography 
          variant="h5" 
          color={getSeverityColor()} 
          sx={{ fontWeight: 'bold', mb: 2 }}
        >
          {scoreGrade.description}
        </Typography>

        <Chip 
          label={`Grade ${scoreGrade.grade}`}
          sx={{ 
            fontSize: '1.1rem', 
            py: 2, 
            px: 3,
            backgroundColor: getSeverityColor(),
            color: 'white',
            fontWeight: 'bold',
          }}
        />
      </Paper>

      {/* Clinical Interpretation */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Assessment sx={{ mr: 1 }} />
                Clinical Interpretation
              </Typography>
              
              {scoreGrade.grade === 0 && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    <strong>No Evidence of Venous Congestion:</strong> VEXUS grade suggests normal venous flow patterns. 
                    This indicates no significant venous congestion.
                  </Typography>
                </Alert>
              )}

              {scoreGrade.grade === 1 && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    <strong>Mild Venous Congestion:</strong> VEXUS grade indicates mild venous congestion. 
                    Consider clinical correlation and potential interventions.
                  </Typography>
                </Alert>
              )}

              {scoreGrade.grade === 2 && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    <strong>Moderate Venous Congestion:</strong> VEXUS grade suggests moderate venous congestion. 
                    Clinical intervention may be warranted.
                  </Typography>
                </Alert>
              )}

              {scoreGrade.grade === 3 && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    <strong>Severe Venous Congestion:</strong> VEXUS grade indicates severe venous congestion. 
                    Immediate clinical attention and intervention recommended.
                  </Typography>
                </Alert>
              )}

              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                <strong>Important:</strong> This AI-generated grade should be interpreted by a qualified healthcare professional 
                in the context of the patient's clinical presentation. VEXUS grading is a tool to assist clinical decision-making 
                and should not replace clinical judgment.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                VEXUS Grading Scale
              </Typography>
              <Box sx={{ space: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ width: 12, height: 12, backgroundColor: '#4caf50', borderRadius: '50%', mr: 1 }} />
                  <Typography variant="body2">Grade 0: No Congestion</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ width: 12, height: 12, backgroundColor: '#2196f3', borderRadius: '50%', mr: 1 }} />
                  <Typography variant="body2">Grade 1: Mild</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ width: 12, height: 12, backgroundColor: '#ff9800', borderRadius: '50%', mr: 1 }} />
                  <Typography variant="body2">Grade 2: Moderate</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ width: 12, height: 12, backgroundColor: '#f44336', borderRadius: '50%', mr: 1 }} />
                  <Typography variant="body2">Grade 3: Severe</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Disclaimer */}
      <Alert severity="info" sx={{ mt: 3 }}>
        <Typography variant="body2">
          <strong>Disclaimer:</strong> This calculator is for educational and research purposes only. 
          The VEXUS protocol and grading system should be used by trained healthcare professionals. 
          Always correlate findings with clinical presentation and use appropriate clinical judgment.
        </Typography>
      </Alert>
    </Box>
  );
};

export default ScoreDisplay; 
import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import { FiberManualRecord } from '@mui/icons-material';

interface WaveformBasicsProps {
  content: {
    title?: string;
    description?: string;
    keyPoints?: string[];
  };
}

const WaveformBasics: React.FC<WaveformBasicsProps> = ({ content }) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        {content.title || 'Basic Waveform Anatomy'}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card elevation={1} sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.6 }}>
                {content.description || 'Understanding the fundamental components of waveform patterns is essential for accurate VEXUS interpretation.'}
              </Typography>
              
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.6 }}>
                Venous waveforms represent the flow patterns within veins and reflect the underlying hemodynamic conditions. 
                In the context of VEXUS, these patterns help us assess venous congestion and guide clinical decision-making.
              </Typography>

              <Typography variant="body1" paragraph sx={{ lineHeight: 1.6 }}>
                Key components to evaluate include flow direction, pulsatility patterns, respiratory variation, 
                and overall waveform morphology. Each of these elements provides important clinical information 
                about the patient's volume status and cardiac function.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card elevation={1}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Key Components
              </Typography>
              
              <List dense>
                {(content.keyPoints || [
                  'Flow direction and velocity',
                  'Pulsatility patterns',
                  'Respiratory variation',
                  'Waveform morphology',
                  'Temporal characteristics'
                ]).map((point, index) => (
                  <ListItem key={index} sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 20 }}>
                      <FiberManualRecord sx={{ fontSize: 8, color: 'primary.main' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={point}
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Educational Note */}
      <Box sx={{ mt: 3, p: 2, bgcolor: 'warning.50', borderRadius: 1, border: '1px solid', borderColor: 'warning.200' }}>
        <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
          📚 Learning Tip
        </Typography>
        <Typography variant="body2">
          Start by understanding normal waveform patterns before attempting to identify abnormalities. 
          Practice pattern recognition with known examples to build your interpretation skills.
        </Typography>
      </Box>
    </Box>
  );
};

export default WaveformBasics; 
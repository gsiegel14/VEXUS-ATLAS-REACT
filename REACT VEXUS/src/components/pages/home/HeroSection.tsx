import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid
} from '@mui/material';

const HeroSection: React.FC = () => {
  return (
    <Box sx={{ 
      py: { xs: 6, md: 8 },
      textAlign: 'center',
      backgroundColor: 'background.default'
    }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={2} /> {/* Spacer - exact layout from original */}
          <Grid item xs={12} md={8}>
            <Typography 
              variant="h1" 
              component="h1" 
              gutterBottom 
              sx={{ 
                fontFamily: "'Europa', 'proxima-nova', 'Helvetica Neue', Arial, sans-serif",
                fontWeight: 'normal',
                fontSize: '2.2em',
                marginBottom: '0.5em',
                color: '#333',
                textAlign: 'center',
                whiteSpace: 'pre-wrap'
              }}
            >
              A Collaborative Ultrasound Education Platform
            </Typography>
            <Typography 
              variant="h3" 
              component="h3" 
              sx={{ 
                fontFamily: "'Europa', 'proxima-nova', 'Helvetica Neue', Arial, sans-serif",
                fontWeight: 'normal',
                fontSize: '1.2em',
                lineHeight: '1.6em',
                marginBottom: '1em',
                color: '#333',
                textAlign: 'center',
                whiteSpace: 'pre-wrap'
              }}
            >
              We create, share, and curate free ultrasound educational content contributed by educators around the world.
            </Typography>
            <Typography 
              variant="h2" 
              component="h2"
              sx={{ 
                fontFamily: "'Europa', 'proxima-nova', 'Helvetica Neue', Arial, sans-serif",
                fontWeight: 'normal',
                fontSize: '1.8em',
                marginBottom: '0.75em',
                marginTop: '1em',
                color: '#333',
                textAlign: 'center',
                whiteSpace: 'pre-wrap'
              }}
            >
              Explore Our Projects
            </Typography>
          </Grid>
          <Grid item xs={12} md={2} /> {/* Spacer - exact layout from original */}
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroSection; 
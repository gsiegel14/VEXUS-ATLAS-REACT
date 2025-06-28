import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Divider
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const HeroSection: React.FC = () => {
  const vexusFeatures = [
    {
      title: 'VEXUS Atlas',
      icon: '/images/noun-atlas-1479193-453E3E.png', // Using existing atlas icon
      link: '/image-atlas',
      description: 'Comprehensive VEXUS image collection'
    },
    {
      title: 'AI Image Analysis',
      icon: '/images/noun-artificial-intelligence-3616347-453E3E.svg', // AI/futuristic icon
      link: '/calculator',
      description: 'AI-powered image recognition'
    },
    {
      title: 'VEXUS Fundamentals',
      icon: '/images/noun-book-1479193-453E3E.svg', // Book icon
      link: '/education',
      description: 'VEXUS learning resources'
    },
    {
      title: 'Interpret VEXUS Waveforms',
      icon: '/images/noun-microscope-1479193-453E3E.svg', // Microscope icon
      link: '/waveform',
      description: 'Pulse wave Doppler analysis'
    }
  ];

  return (
    <Box sx={{ 
      py: { xs: 8, md: 12 },
      textAlign: 'center',
      backgroundColor: 'background.default'
    }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={2} /> {/* Spacer - exact layout from original */}
          <Grid item xs={12} md={8}>
            <Box sx={{ mb: { xs: 6, md: 8 } }}>
              <Typography 
                variant="h1" 
                component="h1" 
                gutterBottom 
                sx={{ 
                  fontFamily: "'Europa', 'proxima-nova', 'Helvetica Neue', Arial, sans-serif",
                  fontWeight: 'normal',
                  fontSize: '2.2em',
                  marginBottom: '1.5em',
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
                  marginBottom: '2em',
                  color: '#333',
                  textAlign: 'center',
                  whiteSpace: 'pre-wrap'
                }}
              >
                We create, share, and curate VEXUS ultrasound educational content contributed by experts in Pulse Wave Doppler around the world.
              </Typography>
              
              
            </Box>

            {/* VEXUS Features Section */}
            <Box sx={{ my: { xs: 8, md: 10 } }}>
                             <Typography 
                 variant="h2" 
                 component="h2"
                 sx={{ 
                   fontFamily: "'Europa', 'proxima-nova', 'Helvetica Neue', Arial, sans-serif",
                   fontSize: '1.8em',
                   marginBottom: '1.5em',
                   marginTop: '2em',
                   color: '#333',
                   textAlign: 'center',
                   whiteSpace: 'pre-wrap'
                 }}
               >
                 Explore the VEXUS Atlas
               </Typography>
               
               <Typography 
                 variant="h4" 
                 component="h4" 
                 sx={{ 
                   fontFamily: "'Europa', 'proxima-nova', 'Helvetica Neue', Arial, sans-serif",
                   fontWeight: 'normal',
                   fontSize: '1.1em',
                   lineHeight: '1.6em',
                   marginBottom: '3em',
                   color: '#555',
                   textAlign: 'center',
                   whiteSpace: 'pre-wrap'
                 }}
               >
                 VEXUS Atlas is dedicated to advancing the understanding and application of the Venous Excess Ultrasound Score through collaborative learning and expert-driven resources.
               </Typography>
              
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { 
                    xs: 'repeat(2, 1fr)', 
                    md: 'repeat(4, 1fr)' 
                  },
                  gap: { xs: 3, md: 4 },
                  textAlign: 'center',
                  mb: 6
                }}
              >
                {vexusFeatures.map((feature, index) => (
                  <Box
                    key={index}
                    component={RouterLink}
                    to={feature.link}
                    sx={{
                      textDecoration: 'none !important',
                      color: 'inherit',
                      border: 'none !important',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      p: { xs: 2, md: 3 },
                      borderRadius: 1,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 2
                      }
                    }}
                  >
                    <Box
                      component="img"
                      src={feature.icon}
                      alt={feature.title}
                      loading="lazy"
                      sx={{
                        width: { xs: 70, md: 100 },
                        height: { xs: 70, md: 100 },
                        mb: 2,
                        objectFit: 'contain',
                        border: 'none !important'
                      }}
                    />
                    <Typography 
                      variant="body1" 
                      component="div"
                      sx={{ 
                        fontSize: '1em',
                        fontWeight: 500,
                        fontFamily: "'Europa', 'proxima-nova', 'Helvetica Neue', Arial, sans-serif",
                        textDecoration: 'none !important',
                        border: 'none !important',
                        borderBottom: 'none !important',
                        borderTop: 'none !important',
                        borderLeft: 'none !important',
                        borderRight: 'none !important',
                        color: 'inherit'
                      }}
                    >
                      {feature.title}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Divider sx={{ my: 6 }} />
            </Box>

            <Box sx={{ mt: { xs: 6, md: 8 } }}>
                             <Typography 
                 variant="h2" 
                 component="h2"
                 sx={{ 
                   fontFamily: "'Europa', 'proxima-nova', 'Helvetica Neue', Arial, sans-serif",
                   fontSize: '1.8em',
                   marginBottom: '1.5em',
                   marginTop: '2em',
                   color: '#333',
                   textAlign: 'center',
                   whiteSpace: 'pre-wrap'
                 }}
               >
                 Explore The POCUS Atlas
               </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={2} /> {/* Spacer - exact layout from original */}
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroSection; 
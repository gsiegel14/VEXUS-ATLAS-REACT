import React from 'react';
import {
  Box,
  Grid,
  Typography,
  Container
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { homeConfig } from '../../../config/homeConfig';

const ProjectsGallery: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} md={2} /> {/* Spacer - exact layout from original */}
        <Grid item xs={12} md={8}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              width: '100%'
            }}
          >
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { 
                  xs: 'repeat(2, 1fr)', 
                  md: 'repeat(4, 1fr)' 
                },
                gap: { xs: 3, md: 4 },
                textAlign: 'center',
                justifyItems: 'center',
                width: 'fit-content'
              }}
            >
              {homeConfig.projects.map((project, index) => (
                <Box
                  key={index}
                  component={RouterLink}
                  to={project.link}
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
                    sx={{
                      width: { xs: 100, md: 120 },
                      height: { xs: 100, md: 120 },
                      mb: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: 'none !important',
                      borderRadius: 1,
                      backgroundColor: 'transparent',
                      padding: 1
                    }}
                  >
                    <Box
                      component="img"
                      src={project.icon}
                      alt={project.title}
                      loading="lazy"
                      sx={{
                        width: { xs: 80, md: 100 },
                        height: { xs: 80, md: 100 },
                        minWidth: { xs: 80, md: 100 },
                        minHeight: { xs: 80, md: 100 },
                        maxWidth: { xs: 80, md: 100 },
                        maxHeight: { xs: 80, md: 100 },
                        objectFit: 'contain',
                        objectPosition: 'center',
                        border: 'none !important',
                        display: 'block'
                      }}
                    />
                  </Box>
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
                      color: 'inherit',
                      textAlign: 'center',
                      lineHeight: 1.2
                    }}
                  >
                    {project.title}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={2} /> {/* Spacer - exact layout from original */}
      </Grid>
    </Container>
  );
};

export default ProjectsGallery; 
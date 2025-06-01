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
      <Grid container spacing={0}>
        <Grid item xs={12} md={1} /> {/* Spacer - exact layout from original */}
        <Grid item xs={12} md={10}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { 
                xs: 'repeat(2, 1fr)', 
                md: 'repeat(4, 1fr)' 
              },
              gap: { xs: 2, md: 3 },
              textAlign: 'center'
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
                  p: 2,
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
                  src={project.icon}
                  alt={project.title}
                  loading="lazy"
                  sx={{
                    width: { xs: 60, md: 80 },
                    height: { xs: 60, md: 80 },
                    mb: 1,
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
                  {project.title}
                </Typography>
              </Box>
            ))}
          </Box>
        </Grid>
        <Grid item xs={12} md={1} /> {/* Spacer - exact layout from original */}
      </Grid>
    </Container>
  );
};

export default ProjectsGallery; 
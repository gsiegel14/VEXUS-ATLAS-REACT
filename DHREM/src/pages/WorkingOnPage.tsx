import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Button,
  Stack,
} from '@mui/material';
import LaunchIcon from '@mui/icons-material/Launch';
import { workingProjects } from '../data/workingOnData';

const WorkingOnPage: React.FC = () => {
  return (
    <Box sx={{ backgroundColor: 'grey.50', py: { xs: 6, md: 10 } }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
          <Typography
            variant="overline"
            sx={{ color: 'primary.main', fontWeight: 600, letterSpacing: 2 }}
          >
            Working On
          </Typography>
          <Typography
            variant="h3"
            sx={{ fontWeight: 700, mt: 2, mb: 2, letterSpacing: '-0.01em' }}
          >
            What We&apos;re Building Next
          </Typography>
          <Typography
            variant="h6"
            sx={{ maxWidth: 720, mx: 'auto', color: 'text.secondary', lineHeight: 1.6 }}
          >
            A snapshot of the initiatives our ultrasound and innovation teams are actively
            scaling—from global educational platforms to AI-powered bedside decision support.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {workingProjects.map((project) => (
            <Grid key={project.title} item xs={12} md={6}>
              <Card
                sx={{
                  height: '100%',
                  borderRadius: 3,
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    boxShadow: '0 12px 32px rgba(15, 23, 42, 0.12)',
                    transform: 'translateY(-6px)',
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <CardMedia
                      component="img"
                      src={project.logoSrc}
                      alt={`${project.title} logo`}
                      sx={{
                        width: 120,
                        height: 120,
                        objectFit: 'contain',
                        backgroundColor: project.logoBackground ?? 'background.default',
                        borderRadius: 3,
                        p: 2,
                        border: '1px solid',
                        borderColor: project.logoBorderColor ?? 'grey.200',
                      }}
                    />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        {project.title}
                      </Typography>
                      {project.subtitle && (
                        <Typography variant="subtitle1" sx={{ color: 'text.secondary', mt: 0.5 }}>
                          {project.subtitle}
                        </Typography>
                      )}
                      <Chip
                        label={project.status}
                        color="primary"
                        variant="outlined"
                        sx={{ mt: 2, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}
                      />
                    </Box>
                  </Box>

                  <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                    {project.description}
                  </Typography>

                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {project.focusAreas.map((area) => (
                      <Chip
                        key={area}
                        label={area}
                        size="small"
                        variant="filled"
                        sx={{
                          backgroundColor: 'grey.100',
                          color: 'text.primary',
                          fontWeight: 500,
                          letterSpacing: 0.2,
                        }}
                      />
                    ))}
                  </Stack>
                </CardContent>

                {project.link && project.ctaLabel && (
                  <Box sx={{ px: 3, pb: 3 }}>
                    <Button
                      component="a"
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="contained"
                      endIcon={<LaunchIcon />}
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        px: 3,
                        py: 1.5,
                      }}
                    >
                      {project.ctaLabel}
                    </Button>
                  </Box>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default WorkingOnPage;

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { currentFaculty, currentFellows } from '../data/facultyData';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const stats = [
    { label: 'Faculty Members', value: currentFaculty.length },
    { label: 'Current Fellows', value: currentFellows.length },
    { label: 'Years of Excellence', value: '10+' },
    { label: 'Research Publications', value: '50+' },
  ];

  type Highlight = {
    title: string;
    description: string;
    color: 'primary' | 'secondary';
    link?: string;
    ctaLabel?: string;
  };

  const highlights: Highlight[] = [
    {
      title: 'Emergency Ultrasound Fellowship',
      description: 'Comprehensive training in point-of-care ultrasound for emergency medicine physicians.',
      color: 'primary',
      link: 'https://www.denverultrasound.org/fellowship',
      ctaLabel: 'Explore the Fellowship',
    },
    {
      title: 'Pediatric Emergency Ultrasound',
      description: 'Specialized fellowship program focusing on pediatric emergency ultrasound applications.',
      color: 'secondary',
      link: 'https://www.eusfellowships.com/programs/details?id=104',
      ctaLabel: 'View Pediatric Program',
    },
    {
      title: 'Research & Innovation',
      description: 'Cutting-edge research in ultrasound technology and clinical applications.',
      color: 'primary',
      link: '/research',
      ctaLabel: 'Explore Research',
    },
    {
      title: 'Medical Education',
      description: 'Leading curriculum development and educational initiatives in emergency ultrasound.',
      color: 'secondary',
      link: 'https://www.denverultrasound.org/educational-innovations',
      ctaLabel: 'See Educational Innovations',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #333333 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', maxWidth: '800px', mx: 'auto' }}>
            <Box sx={{ mb: 6, display: 'flex', justifyContent: 'center' }}>
              <img
                src="/images/denver-health-ultrasound-logo.png"
                alt="Denver Health Emergency Medicine Ultrasound"
                style={{
                  height: '160px',
                  width: 'auto',
                  // ensure logo renders as-is; remove inversion filter
                  marginBottom: '24px',
                }}
              />
            </Box>
            <Typography
              variant="h1"
              sx={{
                mb: 3,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                fontWeight: 700,
                lineHeight: 1.1,
              }}
            >
              Denver Health{' '}
              <Box component="span" sx={{ color: '#9ca3af' }}>
                Ultrasound
              </Box>
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mb: 4,
                color: '#d1d5db',
                fontWeight: 400,
                lineHeight: 1.6,
              }}
            >
              Leading innovation in ultrasound education, research, and clinical excellence at Denver Health
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/faculty')}
                sx={{
                  px: 4,
                  py: 1.5,
                  backgroundColor: 'white',
                  color: 'black',
                  '&:hover': {
                    backgroundColor: '#f3f4f6',
                  },
                }}
              >
                Meet Our Team
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/research')}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderColor: 'white',
                  color: 'white',
                  '&:hover': {
                    borderColor: '#d1d5db',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                Explore Research
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ py: 8, backgroundColor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 700,
                      color: 'primary.main',
                      mb: 1,
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'text.secondary',
                      fontWeight: 500,
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Research Feature */}
      <Box
        sx={{
          py: { xs: 4, md: 8 },
          background: 'linear-gradient(135deg, #0f172a 0%, #1f2937 100%)',
          color: 'white',
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
            <Grid item xs={12} md={7}>
              <Box
                component="img"
                src="/images/home/research-in-the-mountains.jpg"
                alt="Ultrasound researchers reviewing findings in the mountains"
                sx={{
                  width: '100%',
                  borderRadius: 3,
                  boxShadow: '0 28px 65px rgba(15, 23, 42, 0.42)',
                  objectFit: 'cover',
                  maxHeight: { xs: 420, md: 680 },
                  minHeight: { xs: 320, md: 520 },
                }}
              />
            </Grid>
            <Grid item xs={12} md={5}>
              <Chip
                label="Research"
                color="primary"
                sx={{ mb: 2, fontWeight: 600, letterSpacing: 0.8 }}
              />
              <Typography
                variant="h3"
                sx={{ fontWeight: 700, mb: 2, letterSpacing: '-0.02em' }}
              >
                Research in the Mountains
              </Typography>
              <Typography
                variant="h6"
                sx={{ color: 'rgba(255,255,255,0.72)', lineHeight: 1.7, mb: 2 }}
              >
                High-altitude medicine meets cutting-edge ultrasound innovation. Our teams
                prototype AI decision support, mobile tools, and bedside training pathways in the
                heart of the Rockies to push emergency care forward.
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.72)', lineHeight: 1.7 }}>
                From field simulations in remote locations to real-world clinical quality
                improvement initiatives, we leverage the unique challenges of Denver and the
                surrounding mountains to validate technology that scales globally.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Program Highlights */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h2"
              sx={{
                mb: 2,
                fontWeight: 700,
                color: 'primary.main',
              }}
            >
              Our Programs
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'text.secondary',
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.6,
              }}
            >
              Comprehensive training and research programs in emergency ultrasound
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {highlights.map((highlight, index) => {
              const isExternal = typeof highlight.link === 'string' && highlight.link.startsWith('http');

              return (
                <Grid item xs={12} md={6} key={index}>
                  <Card
                    sx={{
                      height: '100%',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Chip
                        label={highlight.color === 'primary' ? 'Fellowship' : 'Research'}
                        color={highlight.color as 'primary' | 'secondary'}
                        size="small"
                        sx={{ mb: 2 }}
                      />
                      <Typography
                        variant="h5"
                        sx={{
                          mb: 2,
                          fontWeight: 600,
                          color: 'primary.main',
                        }}
                      >
                        {highlight.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: 'text.secondary',
                          lineHeight: 1.6,
                        }}
                      >
                        {highlight.description}
                      </Typography>
                      {highlight.link && highlight.ctaLabel && (
                        <Box sx={{ mt: 3 }}>
                          <Button
                            component={isExternal ? 'a' : RouterLink}
                            href={isExternal ? highlight.link : undefined}
                            to={!isExternal ? highlight.link : undefined}
                            target={isExternal ? '_blank' : undefined}
                            rel={isExternal ? 'noopener noreferrer' : undefined}
                            variant="outlined"
                            color={highlight.color}
                            sx={{ textTransform: 'none', fontWeight: 600 }}
                          >
                            {highlight.ctaLabel}
                          </Button>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </Box>

      {/* Call to Action */}
      <Box
        sx={{
          py: 8,
          backgroundColor: 'grey.100',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h3"
              sx={{
                mb: 2,
                fontWeight: 700,
                color: 'primary.main',
              }}
            >
              Join Our Team
            </Typography>
            <Typography
              variant="h6"
              sx={{
                mb: 4,
                color: 'text.secondary',
                maxWidth: '600px',
                mx: 'auto',
              }}
            >
              Interested in our fellowship programs or research opportunities?
            </Typography>
            <Button
              variant="contained"
              size="large"
              href="mailto:matthew.riscinti@denverem.org"
              sx={{
                px: 4,
                py: 1.5,
              }}
            >
              Contact Us
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage; 

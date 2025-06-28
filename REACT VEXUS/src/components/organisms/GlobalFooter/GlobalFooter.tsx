import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  List,
  ListItem,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';

const GlobalFooter: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'VEXUS Fundamentals', href: '/education' },
    { label: 'Waveform Analysis', href: '/waveform' },
    { label: 'Image Acquisition', href: '/acquisition' },
    { label: 'AI Image Recognition', href: '/calculator' },
    { label: 'Image Atlas', href: '/image-atlas' },
    { label: 'VEXUS Literature', href: '/literature-review' },
    { label: 'Publications', href: '/publications' },
    { label: 'Our Team', href: '/team' },
    { label: 'About VEXUS ATLAS', href: '/about' },
    { label: 'Contact Us', href: '/contact' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#ffffff',
        borderTop: '1px solid #eee',
        py: { xs: 4, md: 6 },
        mt: 4,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 3, md: 4 }}>
          {/* VEXUS ATLAS Description */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h6"
              component="h3"
              sx={{
                color: '#333',
                fontFamily: 'Europa, sans-serif',
                fontWeight: 600,
                mb: 2,
                fontSize: '1.2rem',
                textAlign: { xs: 'center', md: 'left' },
              }}
            >
              VEXUS ATLAS
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#555',
                fontFamily: 'Europa, sans-serif',
                lineHeight: 1.6,
                fontSize: '0.95rem',
                textAlign: { xs: 'center', md: 'left' },
              }}
            >
              VEXUS ATLAS is dedicated to providing comprehensive resources and education 
              about the Venous Excess Ultrasound Score for clinicians worldwide.
            </Typography>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h6"
              component="h3"
              sx={{
                color: '#333',
                fontFamily: 'Europa, sans-serif',
                fontWeight: 600,
                mb: 2,
                fontSize: '1.2rem',
                textAlign: { xs: 'center', md: 'left' },
              }}
            >
              Quick Links
            </Typography>
            <List sx={{ p: 0 }}>
              {quickLinks.map((link) => (
                <ListItem key={link.href} sx={{ p: 0, mb: 0.5 }}>
                  <Link
                    href={link.href}
                    sx={{
                      color: '#555',
                      fontFamily: 'Europa, sans-serif',
                      textDecoration: 'none',
                      fontSize: '0.95rem',
                      transition: 'color 0.2s ease',
                      display: 'block',
                      width: '100%',
                      textAlign: { xs: 'center', md: 'left' },
                      '&:hover': {
                        color: '#333',
                      },
                    }}
                  >
                    {link.label}
                  </Link>
                </ListItem>
              ))}
            </List>
          </Grid>

          {/* Connect With Us */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h6"
              component="h3"
              sx={{
                color: '#333',
                fontFamily: 'Europa, sans-serif',
                fontWeight: 600,
                mb: 2,
                fontSize: '1.2rem',
                textAlign: { xs: 'center', md: 'left' },
              }}
            >
              Connect With Us
            </Typography>
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'row', md: 'column' },
                gap: { xs: 2, md: 1 },
                justifyContent: { xs: 'center', md: 'flex-start' },
              }}
            >
              {/* Social media links temporarily disabled pending account verification */}
              <Typography
                variant="body2"
                sx={{
                  color: '#777',
                  fontFamily: 'Europa, sans-serif',
                  fontSize: '0.9rem',
                  fontStyle: 'italic',
                }}
              >
                Social media coming soon
              </Typography>
              {/* 
              <Link
                href="https://x.com/thevexusatlas"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: '#555',
                  fontFamily: 'Europa, sans-serif',
                  textDecoration: 'none',
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'color 0.2s ease',
                  '&:hover': {
                    color: '#333',
                  },
                }}
              >
                <TwitterIcon sx={{ mr: 0.5, fontSize: '1.1rem' }} />
                {!isMobile && 'Twitter/X'}
              </Link>
              <Link
                href="https://www.instagram.com/thevexusatlas/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: '#555',
                  fontFamily: 'Europa, sans-serif',
                  textDecoration: 'none',
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'color 0.2s ease',
                  '&:hover': {
                    color: '#333',
                  },
                }}
              >
                <InstagramIcon sx={{ mr: 0.5, fontSize: '1.1rem' }} />
                {!isMobile && 'Instagram'}
              </Link>
              */}
            </Box>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Box
          sx={{
            mt: 4,
            pt: 3,
            borderTop: '1px solid #eee',
            textAlign: 'center',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: '#777',
              fontFamily: 'Europa, sans-serif',
              fontSize: '0.9rem',
            }}
          >
            © {currentYear} VEXUS ATLAS. All rights reserved. |{' '}
            <Link
              href="https://www.thepocusatlas.com"
              sx={{
                color: '#555',
                fontFamily: 'Europa, sans-serif',
                textDecoration: 'none',
                transition: 'color 0.2s ease',
                '&:hover': {
                  color: '#333',
                  textDecoration: 'underline',
                },
              }}
            >
              Part of The POCUS Atlas
            </Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default GlobalFooter; 
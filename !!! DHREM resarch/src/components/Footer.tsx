import React from 'react';
import { Box, Container, Typography, Link, Grid } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'grey.900',
        color: 'white',
        py: 4,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Denver Health Research & Emergency Medicine
            </Typography>
            <Typography variant="body2" sx={{ color: 'grey.400' }}>
              Advancing emergency ultrasound through innovation, education, and research.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Contact
            </Typography>
            <Typography variant="body2" sx={{ color: 'grey.400', mb: 1 }}>
              Denver Health Medical Center
            </Typography>
            <Typography variant="body2" sx={{ color: 'grey.400', mb: 1 }}>
              777 Bannock Street
            </Typography>
            <Typography variant="body2" sx={{ color: 'grey.400' }}>
              Denver, CO 80204
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Research
            </Typography>
            <Link href="/research" sx={{ color: 'grey.400', textDecoration: 'none', display: 'block', mb: 1 }}>
              Publications
            </Link>
            <Link href="/faculty" sx={{ color: 'grey.400', textDecoration: 'none', display: 'block', mb: 1 }}>
              Faculty
            </Link>
          </Grid>
        </Grid>
        <Box sx={{ borderTop: 1, borderColor: 'grey.700', mt: 4, pt: 3 }}>
          <Typography variant="body2" sx={{ color: 'grey.400', textAlign: 'center' }}>
            © 2024 Denver Health Research & Emergency Medicine. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 
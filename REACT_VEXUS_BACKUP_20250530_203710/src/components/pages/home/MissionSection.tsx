import React from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const MissionSection: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <Grid container spacing={0}>
        <Grid item xs={12} md={3} /> {/* Spacer - exact layout from original */}
        <Grid item xs={12} md={6}>
          <Typography 
            variant="h2" 
            component="h2"
            sx={{ 
              fontFamily: "'Europa', 'proxima-nova', 'Helvetica Neue', Arial, sans-serif",
              fontSize: '1.8em',
              marginBottom: '0.75em',
              marginTop: '1em',
              color: '#333',
              textAlign: 'center',
              whiteSpace: 'pre-wrap'
            }}
          >
            Our Mission
          </Typography>
          
          {/* Video Container with exact aspect ratio from original */}
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              paddingBottom: '56.20609%', // Exact aspect ratio from original
              height: 0,
              margin: '20px 0'
            }}
          >
            <Box
              component="iframe"
              src="https://www.youtube.com/embed/GdjEOhIZzuw"
              title="POCUS Atlas Mission"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%'
              }}
            />
          </Box>
          
          <Box sx={{ textAlign: 'center', marginTop: '20px' }}>
            <Button
              variant="contained"
              component={RouterLink}
              to="/contribute"
              sx={{
                display: 'inline-block',
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px',
                fontSize: '0.9em',
                fontFamily: "'Europa', 'proxima-nova', 'Helvetica Neue', Arial, sans-serif",
                '&:hover': {
                  backgroundColor: '#0056b3'
                }
              }}
            >
              Learn more
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12} md={3} /> {/* Spacer - exact layout from original */}
      </Grid>
    </Container>
  );
};

export default MissionSection; 
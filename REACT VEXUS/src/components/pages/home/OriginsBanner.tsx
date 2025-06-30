import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Container
} from '@mui/material';

const OriginsBanner: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} md={2} /> {/* Spacer - exact layout from original */}
        <Grid item xs={12} md={8}>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Box 
              sx={{ 
                display: 'flex',
                marginBottom: '30px',
                backgroundColor: '#fff',
                border: '1px solid #eee',
                alignItems: 'center',
                flexDirection: { xs: 'column', md: 'row' },
                borderRadius: 1,
                width: '100%',
                maxWidth: '100%'
              }}
            >
              {/* Image section */}
              <Box 
                sx={{ 
                  flex: { xs: 'none', md: '0 0 40%' },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '15px',
                  order: { xs: 1, md: 1 }
                }}
              >
                <Box
                  component="img"
                  src="/images/the-pocus-atlas-logo.png"
                  alt="The POCUS Atlas Logo"
                  loading="lazy"
                  sx={{
                    objectFit: 'contain',
                    maxWidth: '180px',
                    maxHeight: '180px',
                    width: 'auto',
                    height: 'auto',
                    borderRadius: '8px'
                  }}
                />
              </Box>
              
              {/* Content section */}
              <Box 
                sx={{ 
                  flex: 1,
                  padding: '20px',
                  textAlign: { xs: 'center', md: 'left' },
                  order: { xs: 2, md: 2 }
                }}
              >
                <Typography 
                  variant="h3" 
                  component="h3" 
                  sx={{ 
                    fontSize: '1.4em',
                    marginBottom: '10px',
                    marginTop: 0,
                    fontFamily: "'Europa', 'proxima-nova', 'Helvetica Neue', Arial, sans-serif",
                    color: '#333'
                  }}
                >
                  Our Origins
                </Typography>
                <Typography 
                  variant="body1"
                  sx={{ 
                    fontSize: '0.9em',
                    lineHeight: 1.5,
                    marginBottom: '15px',
                    fontFamily: "'Europa', 'proxima-nova', 'Helvetica Neue', Arial, sans-serif"
                  }}
                >
                  VEXUS ATLAS is an off-shoot of The POCUS ATLAS focused on the pulse-wave doppler and the advancement of the Venous Excess Ultrasound Protocol.
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={2} /> {/* Spacer - exact layout from original */}
      </Grid>
    </Container>
  );
};

export default OriginsBanner; 
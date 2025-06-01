import React from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Paper,
  useTheme,
  useMediaQuery,
  Stack,
} from '@mui/material';
import {
  PhotoLibrary,
  HealthAndSafety,
} from '@mui/icons-material';
import BaseLayout from '../components/templates/BaseLayout/BaseLayout';

const ImageAtlasDebugPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <>
      <Helmet>
        <title>VEXUS Image Atlas Debug - Testing Layout | VEXUS ATLAS</title>
        <meta 
          name="description" 
          content="Debug page for testing VEXUS Image Atlas layout" 
        />
      </Helmet>

      <BaseLayout pageTitle="VEXUS Image Atlas Debug" containerMaxWidth="xl">
        {/* Hero Section */}
        <Paper elevation={0} sx={{ mb: 4, overflow: 'hidden', borderRadius: 4 }}>
          <Box
            sx={{
              background: 'linear-gradient(135deg, #1976d2 0%, #7b1fa2 50%, #00838f 100%)',
              color: 'white',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.2)',
              }
            }}
          >
            <CardContent sx={{ textAlign: 'center', p: { xs: 3, md: 6 }, position: 'relative', zIndex: 1 }}>
              <PhotoLibrary sx={{ fontSize: { xs: 60, md: 80 }, mb: 2, opacity: 0.9 }} />
              <Typography 
                variant="h2" 
                component="h1" 
                gutterBottom 
                sx={{ 
                  fontFamily: 'Europa, sans-serif',
                  fontWeight: 'bold',
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                }}
              >
                VEXUS Image Atlas Debug
              </Typography>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontFamily: 'Europa, sans-serif',
                  fontWeight: 'light',
                  opacity: 0.9,
                  maxWidth: '800px',
                  mx: 'auto',
                  fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' }
                }}
              >
                Testing the basic layout and styling before connecting to external services.
              </Typography>

              {/* Debug Stats */}
              <Stack 
                direction={{ xs: 'column', sm: 'row' }}
                spacing={3}
                justifyContent="center"
                sx={{ mt: 4, opacity: 0.9 }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', fontFamily: 'Europa, sans-serif' }}>
                    ✅
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'Europa, sans-serif' }}>
                    Layout Working
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', fontFamily: 'Europa, sans-serif' }}>
                    🎨
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'Europa, sans-serif' }}>
                    Styling Active
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', fontFamily: 'Europa, sans-serif' }}>
                    🔧
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'Europa, sans-serif' }}>
                    Components Ready
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Box>
        </Paper>

        {/* Debug Information */}
        <Card sx={{ mb: 4, borderRadius: 4 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ fontFamily: 'Europa, sans-serif', fontWeight: 600 }}>
              Debug Information
            </Typography>
            <Typography variant="body1" sx={{ fontFamily: 'Europa, sans-serif', mb: 2 }}>
              This debug page tests the basic layout components without external dependencies.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'Europa, sans-serif' }}>
              If you can see this page properly, the following components are working:
            </Typography>
            <Box component="ul" sx={{ mt: 2 }}>
              <li>BaseLayout component</li>
              <li>MUI theme and styling</li>
              <li>React Router navigation</li>
              <li>Typography and layout components</li>
            </Box>
          </CardContent>
        </Card>

        {/* Sample Grid Layout */}
        <Typography variant="h6" gutterBottom sx={{ fontFamily: 'Europa, sans-serif', fontWeight: 600 }}>
          Sample Grid Layout Test
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 3, mb: 4 }}>
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <Card key={num} sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontFamily: 'Europa, sans-serif' }}>
                  Test Card {num}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This is a test card to verify grid layout functionality.
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </BaseLayout>
    </>
  );
};

export default ImageAtlasDebugPage; 
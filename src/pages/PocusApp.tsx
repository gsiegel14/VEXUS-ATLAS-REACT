import React, { useState, useEffect } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Container,
  Alert,
  Button,
  Snackbar
} from '@mui/material';
import {
  MonitorHeart,
  Refresh as RefreshIcon,
  Help as HelpIcon
} from '@mui/icons-material';
import CardiologyGallery from '../../TPA test/src/pages/CardiologyGallery';
import { fetchCardiologyImages, checkPocusHealth } from '../services/pocusService';
import { CategorizedImages } from '../types/pocus';

const pocusTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0'
    },
    secondary: {
      main: '#dc004e',
      light: '#ff5983',
      dark: '#9a0036'
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff'
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 600 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 }
  },
  shape: {
    borderRadius: 12
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 600
        }
      }
    }
  }
});

const PocusApp: React.FC = () => {
  const [images, setImages] = useState<CategorizedImages | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check health first
      console.log('🔍 Checking POCUS API health...');
      const health = await checkPocusHealth();
      console.log('✅ POCUS API Health:', health);

      if (!health.pocusAirtableAPI) {
        throw new Error('POCUS Airtable API is not configured properly');
      }

      // Load images
      console.log('🔍 Loading cardiology images...');
      const data = await fetchCardiologyImages();
      setImages(data);
      
      // Calculate total images
      const totalImages = Object.values(data).reduce((sum, categoryImages) => sum + categoryImages.length, 0);
      setSnackbarMessage(`Successfully loaded ${totalImages} cardiac images`);
      setSnackbarOpen(true);
      
      console.log('✅ Successfully loaded POCUS images:', data);
    } catch (error: any) {
      console.error('❌ Failed to load POCUS images:', error);
      setError(error.message || 'Failed to load cardiology images');
      setSnackbarMessage('Failed to load images. Please check your configuration.');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadImages();
  };

  const handleHelp = () => {
    window.open('https://github.com/thepocusatlas/cardiology-gallery', '_blank');
  };

  return (
    <ThemeProvider theme={pocusTheme}>
      <CssBaseline />
      
      {/* App Bar */}
      <AppBar position="static" elevation={1} sx={{ bgcolor: 'white', color: 'text.primary' }}>
        <Toolbar>
          <MonitorHeart sx={{ mr: 2, color: 'primary.main' }} />
          <Typography
            variant="h6"
            component="div"
            sx={{ 
              flexGrow: 1, 
              fontWeight: 700,
              background: 'linear-gradient(45deg, #1976d2 30%, #dc004e 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            The POCUS Atlas - Cardiology Gallery
          </Typography>
          
          <IconButton onClick={handleRefresh} color="primary" title="Refresh">
            <RefreshIcon />
          </IconButton>
          
          <IconButton onClick={handleHelp} color="primary" title="Help">
            <HelpIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Container maxWidth="xl" sx={{ py: 3 }}>
          {/* Header */}
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(45deg, #1976d2 30%, #dc004e 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2
              }}
            >
              Cardiology Gallery
            </Typography>
            
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 600, mx: 'auto', mb: 3 }}
            >
              A curated collection of point-of-care cardiac ultrasound images for education and clinical reference
            </Typography>

            {/* Statistics */}
            {images && !loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap' }}>
                {Object.entries(images).map(([category, categoryImages]) => {
                  if (categoryImages.length === 0) return null;
                  
                  const categoryNames: Record<string, string> = {
                    cardiomyopathy: 'Cardiomyopathy',
                    pericardialDisease: 'Pericardial Disease',
                    congenitalHeartDisease: 'Congenital Heart Disease',
                    valvulopathy: 'Valvular Disease',
                    rvDysfunction: 'RV Dysfunction',
                    other: 'Other Cardiac'
                  };
                  
                  return (
                    <Box key={category} sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="primary.main" fontWeight="bold">
                        {categoryImages.length}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {categoryNames[category] || category}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            )}
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert 
              severity="error" 
              sx={{ mb: 3 }}
              action={
                <Button color="inherit" size="small" onClick={handleRefresh}>
                  Retry
                </Button>
              }
            >
              {error}
            </Alert>
          )}

          {/* Gallery Component */}
          <CardiologyGallery
            categorizedImages={images}
            loading={loading}
          />

          {/* Footer */}
          <Box sx={{ mt: 6, py: 3, textAlign: 'center', borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="body2" color="text.secondary">
              Powered by The POCUS Atlas | Educational Use Only
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
              Images are provided for educational purposes. Clinical decisions should not be based solely on these images.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </ThemeProvider>
  );
};

export default PocusApp; 
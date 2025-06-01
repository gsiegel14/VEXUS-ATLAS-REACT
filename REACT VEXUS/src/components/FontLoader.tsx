import React, { useEffect } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useFontLoader } from '../hooks/useFontLoader';
import { fontFamily } from '../config/fonts';

interface FontLoaderProps {
  children: React.ReactNode;
  showLoadingScreen?: boolean;
}

const FontLoader: React.FC<FontLoaderProps> = ({ 
  children, 
  showLoadingScreen = false 
}) => {
  const { isLoading, isLoaded, hasError, errorMessage } = useFontLoader('europa');

  useEffect(() => {
    // Apply font-loading class to body immediately
    document.body.classList.add('font-loading');
    
    return () => {
      // Cleanup classes on unmount
      document.body.classList.remove('font-loading', 'font-loaded', 'font-fallback');
    };
  }, []);

  useEffect(() => {
    // Update body classes based on font loading state
    if (isLoaded) {
      document.body.classList.remove('font-loading', 'font-fallback');
      document.body.classList.add('font-loaded');
    } else if (hasError) {
      document.body.classList.remove('font-loading', 'font-loaded');
      document.body.classList.add('font-fallback');
    }
  }, [isLoaded, hasError]);

  // Optional loading screen while fonts load
  if (showLoadingScreen && isLoading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '100vh',
          backgroundColor: '#f5f7fa',
          fontFamily: 'Inter, system-ui, sans-serif' // Use fallback during loading
        }}
      >
        <CircularProgress 
          size={40} 
          sx={{ 
            color: '#757575',
            mb: 2
          }} 
        />
        <Typography 
          variant="body1" 
          sx={{ 
            color: '#616161',
            fontFamily: 'Inter, system-ui, sans-serif',
            textAlign: 'center'
          }}
        >
          Loading Europa font...
        </Typography>
      </Box>
    );
  }

  // Show error message if font loading failed (optional)
  if (hasError && import.meta.env.DEV) {
    console.warn('Europa font loading failed:', errorMessage);
  }

  return (
    <Box 
      sx={{ 
        fontFamily: isLoaded ? fontFamily : 'Inter, system-ui, sans-serif',
        minHeight: '100vh'
      }}
    >
      {children}
    </Box>
  );
};

export default FontLoader; 
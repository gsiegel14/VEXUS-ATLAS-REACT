import { useState, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import CardiologyGallery from './pages/CardiologyGallery.tsx';
import { CategorizedImages } from '../src/types/pocus';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [loading, setLoading] = useState(true);
  const [categorizedImages, setCategorizedImages] = useState<CategorizedImages | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/pocus/images');
        if (!response.ok) {
          throw new Error('Failed to fetch images');
        }
        const data = await response.json();
        setCategorizedImages(data);
      } catch (err) {
        console.error('Error fetching images:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <CardiologyGallery
          categorizedImages={categorizedImages}
          loading={loading}
        />
      </Box>
    </ThemeProvider>
  );
}

export default App; 
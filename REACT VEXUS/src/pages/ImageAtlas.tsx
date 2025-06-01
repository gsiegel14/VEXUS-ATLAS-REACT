import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Fab,
  useTheme,
  useMediaQuery,
  Stack,
  Button,
  Paper,
} from '@mui/material';
import {
  PhotoLibrary,
  CloudUpload,
  Refresh,
  HealthAndSafety,
} from '@mui/icons-material';
import BaseLayout from '../components/templates/BaseLayout/BaseLayout';
import FilterSystem from '../components/gallery/FilterSystem';
import ImageGallery from '../components/gallery/ImageGallery';
import ImageUpload from '../components/gallery/ImageUpload';
import { VexusImageData } from '../services/airtableService';

// API base URL - use relative path in production, localhost in development
const getApiBaseUrl = () => {
  if (import.meta.env.PROD) {
    return '/api';  // Use relative path in production
  }
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
};

const API_BASE_URL = getApiBaseUrl();

const ImageAtlasPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [submissionFormOpen, setSubmissionFormOpen] = useState(false);

  // Simplified filter state to match our new interface
  const [filters, setFilters] = useState({
    quality: null as string | null,
    veinType: null as string | null,
    waveform: null as string | null,
    subtype: null as string | null,
    qa: null as string | null,
    analysis: null as string | null,
  });
  
  const [searchTerm, setSearchTerm] = useState('');

  // Real state for API data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<VexusImageData[]>([]);

  // Fetch images from API
  const fetchImages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/images`);
      if (!response.ok) {
        throw new Error(`Failed to fetch images: ${response.statusText}`);
      }
      
      const data = await response.json();
      setImages(data);
      console.log(`✅ Loaded ${data.length} images from Airtable`);
      
      // Debug logging - show sample data structure
      if (data.length > 0) {
        console.log('📊 Sample image data:', data[0]);
        console.log('📊 All image vein types:', data.map((img: any) => img.veinType).filter(Boolean));
        console.log('📊 All image waveforms:', data.map((img: any) => img.waveform).filter(Boolean));
        console.log('📊 All image qualities:', data.map((img: any) => img.quality).filter(Boolean));
      }
    } catch (err) {
      console.error('Failed to fetch images:', err);
      setError(err instanceof Error ? err.message : 'Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  // Load images on component mount
  useEffect(() => {
    fetchImages();
  }, []);

  const totalImages = images.length;

  // Extract unique values for filters from actual data
  const filterOptions = React.useMemo(() => {
    const uniqueValues = {
      quality: new Set<string>(),
      veinType: new Set<string>(),
      waveform: new Set<string>(),
      subtype: new Set<string>(),
    };

    images.forEach(image => {
      if (image.quality) uniqueValues.quality.add(image.quality);
      if (image.veinType) uniqueValues.veinType.add(image.veinType);
      if (image.waveform) uniqueValues.waveform.add(image.waveform);
      if (image.subtype) uniqueValues.subtype.add(image.subtype);
    });

    // Debug logging
    console.log('📊 Available filter values:', {
      quality: Array.from(uniqueValues.quality),
      veinType: Array.from(uniqueValues.veinType),
      waveform: Array.from(uniqueValues.waveform),
      subtype: Array.from(uniqueValues.subtype),
    });

    return {
      quality: Array.from(uniqueValues.quality).sort(),
      veinType: Array.from(uniqueValues.veinType).sort(),
      waveform: Array.from(uniqueValues.waveform).sort(),
      subtype: Array.from(uniqueValues.subtype).sort(),
      qa: ['Present', 'Not Present'],
      analysis: ['Available', 'Not Available'],
    };
  }, [images]);

  // Filter and search logic
  const filteredImages = React.useMemo(() => {
    let result = images;

    // Apply search
    if (searchTerm.trim()) {
      const searchTermLower = searchTerm.toLowerCase();
      result = result.filter(image => {
        const searchableText = [
          image.title,
          image.description,
          image.veinType,
          image.waveform,
          image.subtype,
          image.analysis,
          image.qa,
          image.clinicalContext,
        ].filter(Boolean).join(' ').toLowerCase();
        
        return searchableText.includes(searchTermLower);
      });
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        switch (key) {
          case 'quality':
            result = result.filter(img => 
              img.quality && img.quality.toLowerCase() === value.toLowerCase()
            );
            break;
          case 'veinType':
            result = result.filter(img => 
              img.veinType && img.veinType.toLowerCase().includes(value.toLowerCase())
            );
            break;
          case 'waveform':
            result = result.filter(img => 
              img.waveform && img.waveform.toLowerCase() === value.toLowerCase()
            );
            break;
          case 'subtype':
            result = result.filter(img => 
              img.subtype && img.subtype.toLowerCase().includes(value.toLowerCase())
            );
            break;
          case 'qa':
            if (value === 'Present') {
              result = result.filter(img => img.qa && img.qa.trim().length > 0);
            } else if (value === 'Not Present') {
              result = result.filter(img => !img.qa || img.qa.trim().length === 0);
            }
            break;
          case 'analysis':
            if (value === 'Available') {
              result = result.filter(img => img.analysis && img.analysis.trim().length > 0);
            } else if (value === 'Not Available') {
              result = result.filter(img => !img.analysis || img.analysis.trim().length === 0);
            }
            break;
        }
      }
    });

    console.log(`🔍 Filtering results: ${images.length} total → ${result.length} filtered`);
    return result;
  }, [images, filters, searchTerm]);

  // Categorize filtered images
  const categorizedFilteredImages = React.useMemo(() => {
    const categorized = {
      hepatic: filteredImages.filter(img => 
        img.veinType && img.veinType.toLowerCase().includes('hepatic')
      ),
      portal: filteredImages.filter(img => 
        img.veinType && img.veinType.toLowerCase().includes('portal')
      ),
      renal: filteredImages.filter(img => 
        img.veinType && img.veinType.toLowerCase().includes('renal')
      ),
    };

    console.log(`📊 Categorized images:`, {
      total: filteredImages.length,
      hepatic: categorized.hepatic.length,
      portal: categorized.portal.length,
      renal: categorized.renal.length,
    });

    return categorized;
  }, [filteredImages]);

  const handleFilterChange = (key: string, value: string | null) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearAll = () => {
    setFilters({
      quality: null,
      veinType: null,
      waveform: null,
      subtype: null,
      qa: null,
      analysis: null,
    });
    setSearchTerm('');
  };

  const handleRefresh = () => {
    fetchImages();
  };

  return (
    <>
      <Helmet>
        <title>VEXUS Image Atlas - Comprehensive Visual Guide | VEXUS ATLAS</title>
        <meta 
          name="description" 
          content="Comprehensive atlas of VEXUS ultrasound images categorized by venous patterns, grades, and clinical significance for medical professionals and researchers. High-quality hepatic, portal, and renal vein ultrasound images with detailed analysis." 
        />
        <meta 
          name="keywords" 
          content="VEXUS, image atlas, ultrasound gallery, venous patterns, medical imaging, clinical reference, hepatic vein, portal vein, renal vein, ultrasound images, venous excess, POCUS" 
        />
        
        {/* OpenGraph Meta Tags */}
        <meta property="og:title" content="VEXUS Image Atlas - Comprehensive Visual Guide | VEXUS ATLAS" />
        <meta 
          property="og:description" 
          content="Comprehensive atlas of VEXUS ultrasound images categorized by venous patterns, grades, and clinical significance for medical professionals and researchers." 
        />
        <meta property="og:image" content="https://www.vexusatlas.com/images/vexus-atlas-preview.jpg" />
        <meta property="og:url" content="https://www.vexusatlas.com/image-atlas" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="VEXUS ATLAS" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="VEXUS Image Atlas - Comprehensive Visual Guide" />
        <meta 
          name="twitter:description" 
          content="Comprehensive atlas of VEXUS ultrasound images categorized by venous patterns, grades, and clinical significance for medical professionals and researchers." 
        />
        <meta name="twitter:image" content="https://www.vexusatlas.com/images/vexus-atlas-preview.jpg" />

        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ImageGallery",
            "name": "VEXUS Image Atlas",
            "description": "Comprehensive atlas of VEXUS ultrasound images categorized by venous patterns, grades, and clinical significance",
            "url": "https://www.vexusatlas.com/image-atlas",
            "creator": {
              "@type": "Organization",
              "name": "VEXUS ATLAS",
              "url": "https://www.vexusatlas.com"
            },
            "educationalUse": "medical education",
            "audience": {
              "@type": "EducationalAudience",
              "educationalRole": "medical professional"
            }
          })}
        </script>
      </Helmet>

      <BaseLayout pageTitle="VEXUS Image Atlas" containerMaxWidth="xl">
        {/* Hero Section */}
        <Paper elevation={0} sx={{ mb: 4, overflow: 'hidden', borderRadius: 2 }}>
          <Box
            sx={{
              background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
              color: '#212529',
              position: 'relative',
              border: '1px solid #dee2e6',
            }}
          >
            <CardContent sx={{ textAlign: 'center', p: { xs: 3, md: 4 }, position: 'relative', zIndex: 1 }}>
              <PhotoLibrary sx={{ fontSize: { xs: 48, md: 56 }, mb: 2, color: '#6c757d' }} />
              <Typography 
                variant="h2" 
                component="h1" 
                gutterBottom 
                sx={{ 
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  fontWeight: 500,
                  fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' },
                  color: '#212529',
                  mb: 1
                }}
              >
                VEXUS Image Atlas
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  fontWeight: 400,
                  color: '#6c757d',
                  maxWidth: '600px',
                  mx: 'auto',
                  fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
                  lineHeight: 1.5
                }}
              >
                A clean, comprehensive collection of VEXUS ultrasound images for medical education and research.
              </Typography>

              {/* Stats */}
              {totalImages > 0 && (
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={4}
                  justifyContent="center"
                  sx={{ mt: 4 }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 600, fontFamily: 'system-ui, -apple-system, sans-serif', color: '#495057' }}>
                      {totalImages}
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: '#6c757d' }}>
                      Total Images
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 600, fontFamily: 'system-ui, -apple-system, sans-serif', color: '#495057' }}>
                      {categorizedFilteredImages.hepatic.length + categorizedFilteredImages.portal.length + categorizedFilteredImages.renal.length}
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: '#6c757d' }}>
                      Filtered Results
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 600, fontFamily: 'system-ui, -apple-system, sans-serif', color: '#495057' }}>
                      3
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: '#6c757d' }}>
                      Categories
                    </Typography>
                  </Box>
                </Stack>
              )}

              {/* Upload Button */}
              <Box sx={{ mt: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<CloudUpload />}
                  onClick={() => setSubmissionFormOpen(true)}
                  sx={{
                    bgcolor: '#495057',
                    '&:hover': { bgcolor: '#343a40' },
                    color: 'white',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    fontWeight: 500,
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1rem',
                  }}
                >
                  Contribute Images
                </Button>
                <Typography variant="body2" sx={{ mt: 1, color: '#6c757d', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  Help expand the VEXUS Atlas
                </Typography>
              </Box>
            </CardContent>
          </Box>
        </Paper>

        {/* Filter System */}
        <FilterSystem
          filters={filters}
          searchTerm={searchTerm}
          onFilterChange={handleFilterChange}
          onSearchChange={setSearchTerm}
          onClearAll={handleClearAll}
          totalImages={filteredImages.length}
          filterOptions={filterOptions}
        />

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <Box sx={{ textAlign: 'center' }}>
              <CircularProgress size={60} sx={{ mb: 2 }} />
              <Typography variant="h6" color="text.secondary" sx={{ fontFamily: 'Europa, sans-serif' }}>
                Loading VEXUS images...
              </Typography>
            </Box>
          </Box>
        )}

        {/* Error State */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3, borderRadius: 3 }}
            action={
              <Button color="inherit" size="small" onClick={handleRefresh}>
                Try Again
              </Button>
            }
          >
            <Typography sx={{ fontFamily: 'Europa, sans-serif' }}>
              {error}
            </Typography>
          </Alert>
        )}

        {/* Image Gallery */}
        {!loading && !error && (
          <ImageGallery 
            categorizedImages={categorizedFilteredImages}
            loading={loading}
          />
        )}

        {/* Floating Action Button for Health Check */}
        <Fab
          color="primary"
          aria-label="refresh images"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={handleRefresh}
        >
          <Refresh />
        </Fab>

        {/* Image Upload Modal */}
        <ImageUpload
          open={submissionFormOpen}
          onClose={() => setSubmissionFormOpen(false)}
          onUploadSuccess={(response) => {
            console.log('Upload successful:', response);
            // You could refresh the images here if needed
            // refreshImages();
          }}
        />
      </BaseLayout>
    </>
  );
};

export default ImageAtlasPage; 
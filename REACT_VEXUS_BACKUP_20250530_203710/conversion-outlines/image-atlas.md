# Image Atlas Page Conversion Outline

## Overview
Convert `image-atlas.astro` to a React application with advanced image gallery, filtering system, search functionality, and image submission forms using Material-UI components.

## Current Structure Analysis
- Complex image gallery with categorized display (hepatic, portal, renal veins)
- Advanced filtering system with multiple criteria (quality, vein type, waveform, subtype)
- Real-time search functionality across image metadata
- API integration for fetching images from external sources
- Image submission form with file upload capabilities
- Lazy loading and performance optimizations
- Interactive image lightbox with navigation
- Collapsible category sections with expand/collapse functionality
- Complex state management for filters, search, and gallery display
- Mobile-responsive design with touch-friendly interactions

## Comprehensive Conversion Framework

### 1. Main Component Architecture & MUI Integration
```jsx
// src/pages/ImageAtlas.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  useMediaQuery
} from '@mui/material';
import { PhotoLibrary, CloudUpload } from '@mui/icons-material';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import FilterSystem from '../components/gallery/FilterSystem';
import ImageGallery from '../components/gallery/ImageGallery';
import ImageSubmissionForm from '../components/gallery/ImageSubmissionForm';
import { useImageGallery } from '../hooks/useImageGallery';
import { useImageFilters } from '../hooks/useImageFilters';

const ImageAtlas = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const {
    images,
    loading,
    error,
    categories,
    fetchImages,
    submitImage
  } = useImageGallery();

  const {
    filters,
    filteredImages,
    searchTerm,
    updateFilter,
    clearAllFilters,
    setSearchTerm
  } = useImageFilters(images);

  const [submissionFormOpen, setSubmissionFormOpen] = useState(false);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const categorizedImages = useMemo(() => {
    return {
      hepatic: filteredImages.filter(img => img.vein?.toLowerCase().includes('hepatic')),
      portal: filteredImages.filter(img => img.vein?.toLowerCase().includes('portal')),
      renal: filteredImages.filter(img => img.vein?.toLowerCase().includes('renal'))
    };
  }, [filteredImages]);

  return (
    <Layout>
      <SEO 
        title="VEXUS Image Atlas - Comprehensive Visual Guide"
        description="Comprehensive atlas of VEXUS ultrasound images categorized by venous patterns, grades, and clinical significance for medical professionals and researchers."
        keywords="VEXUS, image atlas, ultrasound gallery, venous patterns, medical imaging, clinical reference"
      />
      
      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
        {/* Header */}
        <Card elevation={2} sx={{ mb: 4 }}>
          <CardContent sx={{ textAlign: 'center', p: { xs: 2, md: 4 } }}>
            <PhotoLibrary sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              VEXUS Image Gallery
            </Typography>
            <Typography variant="h6" color="text.secondary">
              A collection of VEXUS ultrasound images showcasing various grades and findings.
            </Typography>
          </CardContent>
        </Card>

        {/* Filter System */}
        <FilterSystem
          filters={filters}
          searchTerm={searchTerm}
          onFilterChange={updateFilter}
          onSearchChange={setSearchTerm}
          onClearAll={clearAllFilters}
          totalImages={filteredImages.length}
        />

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={60} />
          </Box>
        )}

        {/* Error State */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Image Gallery */}
        {!loading && !error && (
          <ImageGallery 
            categorizedImages={categorizedImages}
            isMobile={isMobile}
          />
        )}

        {/* Image Submission Form */}
        <ImageSubmissionForm
          open={submissionFormOpen}
          onClose={() => setSubmissionFormOpen(false)}
          onSubmit={submitImage}
        />

        {/* Floating Action Button */}
        <Fab
          color="secondary"
          aria-label="submit image"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={() => setSubmissionFormOpen(true)}
        >
          <CloudUpload />
        </Fab>
      </Container>
    </Layout>
  );
};

export default ImageAtlas;
```

### 2. Advanced Filter System Component
```jsx
// src/components/gallery/FilterSystem.jsx
import React from 'react';
import {
  Paper,
  Box,
  TextField,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Collapse,
  Button
} from '@mui/material';
import { Search, Clear, ExpandMore, FilterList } from '@mui/icons-material';

const FilterSystem = ({ 
  filters, 
  searchTerm, 
  onFilterChange, 
  onSearchChange, 
  onClearAll,
  totalImages 
}) => {
  const [expanded, setExpanded] = useState(true);

  const filterOptions = {
    quality: ['High', 'Medium', 'Low'],
    vein: ['Hepatic Vein', 'Portal Vein', 'Renal Vein'],
    waveform: ['Normal', 'Abnormal', 'Reversal', 'Pulsatile'],
    subtype: ['S-Wave', 'D-Wave', 'Continuous', 'Biphasic']
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length + (searchTerm ? 1 : 0);

  return (
    <Paper elevation={1} sx={{ mb: 3, overflow: 'hidden' }}>
      <Box sx={{ p: 2, bgcolor: 'grey.50', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FilterList color="primary" />
          <Typography variant="h6">
            Filters {activeFiltersCount > 0 && `(${activeFiltersCount} active)`}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {totalImages} images found
          </Typography>
        </Box>
        <Button
          onClick={() => setExpanded(!expanded)}
          endIcon={<ExpandMore sx={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />}
        >
          {expanded ? 'Hide' : 'Show'} Filters
        </Button>
      </Box>

      <Collapse in={expanded}>
        <Box sx={{ p: 3 }}>
          {/* Search Bar */}
          <TextField
            fullWidth
            placeholder="Search by description, vein type, waveform..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
              endAdornment: searchTerm && (
                <IconButton size="small" onClick={() => onSearchChange('')}>
                  <Clear />
                </IconButton>
              )
            }}
          />

          {/* Filter Controls */}
          <Grid container spacing={2}>
            {Object.entries(filterOptions).map(([key, options]) => (
              <Grid item xs={12} sm={6} md={3} key={key}>
                <FormControl fullWidth>
                  <InputLabel>{key.charAt(0).toUpperCase() + key.slice(1)}</InputLabel>
                  <Select
                    value={filters[key] || ''}
                    label={key.charAt(0).toUpperCase() + key.slice(1)}
                    onChange={(e) => onFilterChange(key, e.target.value || null)}
                  >
                    <MenuItem value="">All {key}s</MenuItem>
                    {options.map(option => (
                      <MenuItem key={option} value={option}>{option}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            ))}
          </Grid>

          {/* Active Filters Display */}
          {activeFiltersCount > 0 && (
            <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ mr: 1 }}>Active filters:</Typography>
              {searchTerm && (
                <Chip
                  label={`Search: "${searchTerm}"`}
                  onDelete={() => onSearchChange('')}
                  size="small"
                />
              )}
              {Object.entries(filters).map(([key, value]) => (
                value && (
                  <Chip
                    key={key}
                    label={`${key}: ${value}`}
                    onDelete={() => onFilterChange(key, null)}
                    size="small"
                  />
                )
              ))}
              <Button size="small" onClick={onClearAll} sx={{ ml: 1 }}>
                Clear All
              </Button>
            </Box>
          )}
        </Box>
      </Collapse>
    </Paper>
  );
};

export default FilterSystem;
```

### 3. Image Gallery with Categories
```jsx
// src/components/gallery/ImageGallery.jsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Badge,
  ImageList,
  ImageListItem,
  Dialog,
  DialogContent,
  IconButton,
  Chip
} from '@mui/material';
import { ExpandMore, Close, ZoomIn } from '@mui/icons-material';
import ImageLightbox from './ImageLightbox';

const ImageGallery = ({ categorizedImages, isMobile }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const categories = [
    { key: 'hepatic', title: 'Hepatic Vein Images', color: '#1976d2' },
    { key: 'portal', title: 'Portal Vein Images', color: '#7b1fa2' },
    { key: 'renal', title: 'Renal Vein Images', color: '#00838f' }
  ];

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setLightboxOpen(true);
  };

  return (
    <Box>
      {categories.map(category => {
        const images = categorizedImages[category.key] || [];
        
        return (
          <Accordion key={category.key} defaultExpanded sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 'medium' }}>
                  {category.title}
                </Typography>
                <Badge
                  badgeContent={images.length}
                  color="primary"
                  sx={{
                    '& .MuiBadge-badge': {
                      backgroundColor: category.color,
                      color: 'white'
                    }
                  }}
                />
              </Box>
            </AccordionSummary>
            
            <AccordionDetails>
              {images.length === 0 ? (
                <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  No images found matching your criteria
                </Typography>
              ) : (
                <ImageList 
                  cols={isMobile ? 1 : 3} 
                  gap={16}
                  sx={{ width: '100%', height: 'auto' }}
                >
                  {images.map((image) => (
                    <ImageListItem 
                      key={image.id} 
                      sx={{ 
                        cursor: 'pointer',
                        position: 'relative',
                        borderRadius: 2,
                        overflow: 'hidden',
                        '&:hover .zoom-overlay': { opacity: 1 }
                      }}
                      onClick={() => handleImageClick(image)}
                    >
                      <img
                        src={image.thumbnailUrl || image.url}
                        alt={image.title || 'VEXUS Image'}
                        loading="lazy"
                        style={{ borderRadius: 8 }}
                      />
                      
                      {/* Zoom Overlay */}
                      <Box
                        className="zoom-overlay"
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: 0,
                          transition: 'opacity 0.2s'
                        }}
                      >
                        <ZoomIn sx={{ color: 'white', fontSize: 48 }} />
                      </Box>

                      {/* Image Tags */}
                      <Box sx={{ position: 'absolute', top: 8, left: 8, display: 'flex', gap: 0.5 }}>
                        {image.quality && (
                          <Chip
                            label={image.quality}
                            size="small"
                            sx={{ 
                              bgcolor: 'rgba(255, 255, 255, 0.9)',
                              color: 'text.primary',
                              fontSize: '0.7rem'
                            }}
                          />
                        )}
                        {image.waveform && (
                          <Chip
                            label={image.waveform}
                            size="small"
                            sx={{ 
                              bgcolor: 'rgba(255, 255, 255, 0.9)',
                              color: 'text.primary',
                              fontSize: '0.7rem'
                            }}
                          />
                        )}
                      </Box>
                    </ImageListItem>
                  ))}
                </ImageList>
              )}
            </AccordionDetails>
          </Accordion>
        );
      })}

      {/* Lightbox */}
      <ImageLightbox
        open={lightboxOpen}
        image={selectedImage}
        onClose={() => {
          setLightboxOpen(false);
          setSelectedImage(null);
        }}
      />
    </Box>
  );
};

export default ImageGallery;
```

### 4. State Management Hooks

#### useImageGallery Hook
```jsx
// src/hooks/useImageGallery.js
import { useState, useCallback, useReducer } from 'react';
import { galleryService } from '../services/galleryService';

const initialState = {
  images: [],
  loading: false,
  error: null,
  categories: { hepatic: 0, portal: 0, renal: 0 }
};

function galleryReducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { 
        ...state, 
        loading: false, 
        images: action.payload,
        categories: categorizeImages(action.payload)
      };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'ADD_IMAGE':
      const newImages = [...state.images, action.payload];
      return { 
        ...state, 
        images: newImages,
        categories: categorizeImages(newImages)
      };
    default:
      return state;
  }
}

function categorizeImages(images) {
  return images.reduce((acc, img) => {
    const vein = img.vein?.toLowerCase() || '';
    if (vein.includes('hepatic')) acc.hepatic++;
    else if (vein.includes('portal')) acc.portal++;
    else if (vein.includes('renal')) acc.renal++;
    return acc;
  }, { hepatic: 0, portal: 0, renal: 0 });
}

export const useImageGallery = () => {
  const [state, dispatch] = useReducer(galleryReducer, initialState);

  const fetchImages = useCallback(async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const images = await galleryService.fetchImages();
      dispatch({ type: 'FETCH_SUCCESS', payload: images });
    } catch (error) {
      dispatch({ type: 'FETCH_ERROR', payload: error.message });
    }
  }, []);

  const submitImage = useCallback(async (imageData) => {
    try {
      const newImage = await galleryService.submitImage(imageData);
      dispatch({ type: 'ADD_IMAGE', payload: newImage });
      return newImage;
    } catch (error) {
      throw new Error(`Failed to submit image: ${error.message}`);
    }
  }, []);

  return {
    ...state,
    fetchImages,
    submitImage
  };
};
```

#### useImageFilters Hook
```jsx
// src/hooks/useImageFilters.js
import { useState, useMemo, useCallback } from 'react';

export const useImageFilters = (images) => {
  const [filters, setFilters] = useState({
    quality: null,
    vein: null,
    waveform: null,
    subtype: null
  });
  const [searchTerm, setSearchTerm] = useState('');

  const filteredImages = useMemo(() => {
    return images.filter(image => {
      // Search filter
      if (searchTerm) {
        const searchFields = [
          image.title, image.description, image.quality,
          image.vein, image.waveform, image.subtype, image.analysis
        ].filter(Boolean).join(' ').toLowerCase();
        
        if (!searchFields.includes(searchTerm.toLowerCase())) {
          return false;
        }
      }

      // Property filters
      for (const [key, value] of Object.entries(filters)) {
        if (value && image[key] !== value) {
          return false;
        }
      }

      return true;
    });
  }, [images, filters, searchTerm]);

  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters({ quality: null, vein: null, waveform: null, subtype: null });
    setSearchTerm('');
  }, []);

  return {
    filters,
    filteredImages,
    searchTerm,
    updateFilter,
    clearAllFilters,
    setSearchTerm
  };
};
```

### 5. Image Submission Form Component
```jsx
// src/components/gallery/ImageSubmissionForm.jsx
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Paper
} from '@mui/material';
import FileUploadZone from './FileUploadZone';

const ImageSubmissionForm = ({ open, onClose, onSubmit }) => {
  const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const handleFormSubmit = async (data) => {
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      console.error('Submission failed:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Submit VEXUS Image</DialogTitle>
      
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12} md={6}>
              <Controller
                name="email"
                control={control}
                rules={{ required: 'Email is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email"
                    type="email"
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="institution"
                control={control}
                rules={{ required: 'Institution is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Institution"
                    fullWidth
                    error={!!errors.institution}
                    helperText={errors.institution?.message}
                  />
                )}
              />
            </Grid>

            {/* Image Details */}
            <Grid item xs={12}>
              <Controller
                name="title"
                control={control}
                rules={{ required: 'Title is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Image Title"
                    fullWidth
                    error={!!errors.title}
                    helperText={errors.title?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="veinType"
                control={control}
                rules={{ required: 'Vein type is required' }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.veinType}>
                    <InputLabel>Vein Type</InputLabel>
                    <Select {...field} label="Vein Type">
                      <MenuItem value="hepatic">Hepatic Vein</MenuItem>
                      <MenuItem value="portal">Portal Vein</MenuItem>
                      <MenuItem value="renal">Renal Vein</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="quality"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Image Quality</InputLabel>
                    <Select {...field} label="Image Quality">
                      <MenuItem value="high">High</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="low">Low</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="description"
                control={control}
                rules={{ required: 'Description is required', minLength: { value: 10, message: 'Description too short' } }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Description"
                    multiline
                    rows={4}
                    fullWidth
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    placeholder="Provide details about the image, including VEXUS grade, clinical context, and findings..."
                  />
                )}
              />
            </Grid>

            {/* File Upload */}
            <Grid item xs={12}>
              <Controller
                name="imageFile"
                control={control}
                rules={{ required: 'Image file is required' }}
                render={({ field }) => (
                  <FileUploadZone
                    onFileChange={field.onChange}
                    error={!!errors.imageFile}
                    helperText={errors.imageFile?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Image'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ImageSubmissionForm;
```

### 6. Performance & Dependencies

#### Dependencies
```json
{
  "dependencies": {
    "@mui/material": "^5.x.x",
    "@mui/icons-material": "^5.x.x",
    "@emotion/react": "^11.x.x",
    "@emotion/styled": "^11.x.x",
    "react": "^18.x.x",
    "react-dom": "^18.x.x",
    "react-hook-form": "^7.x.x",
    "react-dropzone": "^14.x.x",
    "react-intersection-observer": "^9.x.x"
  }
}
```

#### Implementation Priority
1. **Core Gallery Structure** (Container, FilterSystem, ImageGallery)
2. **State Management** (useImageGallery, useImageFilters hooks)
3. **Filter System** (Search, dropdown filters, active filter display)
4. **Image Display** (Categories, lightbox, lazy loading)
5. **Submission Form** (Dialog, file upload, form validation)
6. **Performance Optimizations** (Memoization, virtualization)
7. **Mobile Responsiveness** (Touch interactions, responsive grids)
8. **Testing & Accessibility** (Complete test coverage, ARIA support)

This framework provides a solid foundation for converting the complex image-atlas.astro page to a modern React application with Material-UI, maintaining all functionality while improving performance and user experience. 
# Index Atlas Page Conversion Outline

## Overview
Convert `index-atlas.astro` to a React component with comprehensive atlas navigation, image organization, advanced search functionality, and medical image management using Material-UI components.

## Current Structure Analysis
- Main atlas landing page with organized image categories
- Advanced search and filtering capabilities across all atlas content
- Category-based navigation (hepatic, portal, renal, IVC, general)
- Image preview tiles with metadata and quality indicators
- Quick access to frequently viewed content
- Integration with submission and contribution systems
- Statistics and progress tracking for atlas content
- Responsive grid layout with adaptive viewing options
- Professional medical image organization and presentation

## Comprehensive Conversion Framework

### 1. Main Component Architecture & MUI Integration
```jsx
// src/pages/IndexAtlas.jsx
import React, { useState, useMemo } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
  Fab,
  Paper
} from '@mui/material';
import { PhotoLibrary, Search, Add, ViewModule } from '@mui/icons-material';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import AtlasOverview from '../components/atlas/AtlasOverview';
import CategoryGrid from '../components/atlas/CategoryGrid';
import SearchInterface from '../components/atlas/SearchInterface';
import ImageGrid from '../components/atlas/ImageGrid';
import AtlasStats from '../components/atlas/AtlasStats';
import ContributeModal from '../components/atlas/ContributeModal';
import { useAtlasData } from '../hooks/useAtlasData';
import { useImageSearch } from '../hooks/useImageSearch';
import { atlasConfig } from '../config/atlasConfig';

const IndexAtlas = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [activeView, setActiveView] = useState('overview');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [contributeModalOpen, setContributeModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // grid, list, masonry
  
  const { atlasData, loading, error, stats } = useAtlasData();
  const { 
    searchTerm, 
    filters, 
    filteredImages, 
    updateSearch, 
    updateFilters,
    clearFilters 
  } = useImageSearch(atlasData.images || []);

  const categories = [
    {
      id: 'hepatic',
      title: 'Hepatic Vein',
      description: 'Hepatic vein imaging and waveform analysis',
      icon: '🫀',
      color: 'primary',
      count: stats.hepatic || 0,
      featured: true
    },
    {
      id: 'portal',
      title: 'Portal Vein',
      description: 'Portal vein flow patterns and assessment',
      icon: '🩸',
      color: 'secondary',
      count: stats.portal || 0,
      featured: true
    },
    {
      id: 'renal',
      title: 'Renal Vein',
      description: 'Renal venous congestion indicators',
      icon: '🫘',
      color: 'success',
      count: stats.renal || 0,
      featured: true
    },
    {
      id: 'ivc',
      title: 'IVC Assessment',
      description: 'Inferior vena cava evaluation techniques',
      icon: '🫁',
      color: 'warning',
      count: stats.ivc || 0,
      featured: false
    },
    {
      id: 'general',
      title: 'General VEXUS',
      description: 'Comprehensive VEXUS assessment cases',
      icon: '🔬',
      color: 'info',
      count: stats.general || 0,
      featured: false
    }
  ];

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setActiveView('images');
  };

  const handleViewChange = (newView) => {
    setActiveView(newView);
    if (newView === 'overview') {
      setSelectedCategory(null);
    }
  };

  return (
    <Layout>
      <SEO 
        title="VEXUS Atlas - Medical Image Repository"
        description="Comprehensive atlas of VEXUS ultrasound images, waveforms, and case studies. Explore hepatic, portal, and renal vein assessment examples."
        keywords="VEXUS, atlas, medical images, ultrasound, hepatic vein, portal vein, renal vein, venous congestion"
        ogTitle="VEXUS Atlas | Medical Image Repository"
        ogImage="https://yourdomain.com/images/vexus-atlas-preview.jpg"
        ogUrl="https://yourdomain.com/atlas"
      />
      
      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
        {/* Header */}
        <Card elevation={2} sx={{ mb: 4 }}>
          <CardContent sx={{ textAlign: 'center', p: { xs: 2, md: 4 } }}>
            <PhotoLibrary sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              VEXUS Atlas
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
              Comprehensive repository of VEXUS ultrasound images and educational content
            </Typography>
          </CardContent>
        </Card>

        {/* Navigation Tabs */}
        <Paper elevation={1} sx={{ mb: 4 }}>
          <Tabs
            value={activeView}
            onChange={(e, newValue) => handleViewChange(newValue)}
            variant={isMobile ? "scrollable" : "fullWidth"}
            scrollButtons={isMobile ? "auto" : false}
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab
              value="overview"
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ViewModule />
                  <Typography variant="body2">Overview</Typography>
                </Box>
              }
            />
            <Tab
              value="search"
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Search />
                  <Typography variant="body2">Search</Typography>
                </Box>
              }
            />
            <Tab
              value="images"
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PhotoLibrary />
                  <Typography variant="body2">Browse Images</Typography>
                </Box>
              }
            />
          </Tabs>
        </Paper>

        {/* Content Views */}
        {activeView === 'overview' && (
          <>
            {/* Atlas Overview */}
            <AtlasOverview stats={stats} />
            
            {/* Category Grid */}
            <CategoryGrid 
              categories={categories}
              onCategorySelect={handleCategorySelect}
            />
            
            {/* Recent Additions */}
            <Card elevation={1} sx={{ mt: 4 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Recently Added
                </Typography>
                <ImageGrid 
                  images={atlasData.recentImages || []}
                  viewMode="grid"
                  maxItems={6}
                  compact
                />
              </CardContent>
            </Card>
          </>
        )}

        {activeView === 'search' && (
          <>
            {/* Search Interface */}
            <SearchInterface
              searchTerm={searchTerm}
              filters={filters}
              onSearchChange={updateSearch}
              onFiltersChange={updateFilters}
              onClearFilters={clearFilters}
              categories={categories}
              resultCount={filteredImages.length}
            />
            
            {/* Search Results */}
            <ImageGrid 
              images={filteredImages}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              showFilters
            />
          </>
        )}

        {activeView === 'images' && (
          <>
            {/* Category Header */}
            {selectedCategory && (
              <Card elevation={1} sx={{ mb: 4, bgcolor: `${selectedCategory.color}.50` }}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                    <span style={{ fontSize: '2rem', marginRight: 16 }}>
                      {selectedCategory.icon}
                    </span>
                    {selectedCategory.title}
                  </Typography>
                  <Typography variant="body1">
                    {selectedCategory.description}
                  </Typography>
                </CardContent>
              </Card>
            )}
            
            {/* Category Images */}
            <ImageGrid 
              images={selectedCategory 
                ? atlasData.images?.filter(img => img.category === selectedCategory.id) || []
                : atlasData.images || []
              }
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              showFilters
            />
          </>
        )}

        {/* Atlas Statistics */}
        <AtlasStats stats={stats} />

        {/* Contribute Modal */}
        <ContributeModal
          open={contributeModalOpen}
          onClose={() => setContributeModalOpen(false)}
          categories={categories}
        />

        {/* Floating Action Button */}
        <Fab
          color="secondary"
          aria-label="contribute image"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={() => setContributeModalOpen(true)}
        >
          <Add />
        </Fab>
      </Container>
    </Layout>
  );
};

export default IndexAtlas;
```

### 2. Category Grid Component
```jsx
// src/components/atlas/CategoryGrid.jsx
import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  useTheme
} from '@mui/material';
import { ArrowForward, Star } from '@mui/icons-material';

const CategoryGrid = ({ categories, onCategorySelect }) => {
  const theme = useTheme();

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Browse by Category
      </Typography>
      
      <Grid container spacing={3}>
        {categories.map((category) => (
          <Grid item xs={12} sm={6} md={4} key={category.id}>
            <Card 
              elevation={2}
              sx={{
                height: '100%',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'visible',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 6
                }
              }}
              onClick={() => onCategorySelect(category)}
            >
              {category.featured && (
                <Chip
                  icon={<Star />}
                  label="Featured"
                  color="primary"
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: -8,
                    right: 16,
                    zIndex: 1
                  }}
                />
              )}
              
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                {/* Category Icon */}
                <Box sx={{ fontSize: '3rem', mb: 2 }}>
                  {category.icon}
                </Box>
                
                {/* Category Title */}
                <Typography 
                  variant="h6" 
                  component="h3"
                  gutterBottom
                  sx={{ 
                    fontWeight: 'bold',
                    color: `${category.color}.main`
                  }}
                >
                  {category.title}
                </Typography>
                
                {/* Description */}
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  paragraph
                  sx={{ minHeight: 40, lineHeight: 1.5 }}
                >
                  {category.description}
                </Typography>
                
                {/* Image Count */}
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Chip 
                    label={`${category.count} images`}
                    size="small"
                    color={category.color}
                    variant="outlined"
                  />
                </Box>
                
                {/* Browse Button */}
                <Button
                  variant="contained"
                  color={category.color}
                  endIcon={<ArrowForward />}
                  fullWidth
                  sx={{ mt: 1 }}
                >
                  Browse Collection
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CategoryGrid;
```

### 3. Atlas Overview Component
```jsx
// src/components/atlas/AtlasOverview.jsx
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  LinearProgress,
  Chip
} from '@mui/material';
import { 
  PhotoLibrary, 
  TrendingUp, 
  Verified, 
  Schedule 
} from '@mui/icons-material';

const AtlasOverview = ({ stats }) => {
  const overviewCards = [
    {
      title: 'Total Images',
      value: stats.totalImages || 0,
      icon: <PhotoLibrary />,
      color: 'primary',
      description: 'High-quality medical images'
    },
    {
      title: 'Categories',
      value: stats.categories || 5,
      icon: <TrendingUp />,
      color: 'secondary',
      description: 'Organized by vessel type'
    },
    {
      title: 'Verified Cases',
      value: stats.verifiedCases || 0,
      icon: <Verified />,
      color: 'success',
      description: 'Expert-reviewed content'
    },
    {
      title: 'Last Updated',
      value: stats.lastUpdated || 'Today',
      icon: <Schedule />,
      color: 'info',
      description: 'Continuously growing'
    }
  ];

  const qualityMetrics = [
    { label: 'High Quality', value: 85, color: 'success' },
    { label: 'Good Quality', value: 12, color: 'warning' },
    { label: 'Fair Quality', value: 3, color: 'error' }
  ];

  return (
    <Box sx={{ mb: 4 }}>
      {/* Main Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {overviewCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card elevation={1} sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Box sx={{ 
                  color: `${card.color}.main`, 
                  mb: 2,
                  '& > svg': { fontSize: 40 }
                }}>
                  {card.icon}
                </Box>
                
                <Typography 
                  variant="h4" 
                  component="div"
                  sx={{ 
                    fontWeight: 'bold',
                    color: `${card.color}.main`,
                    mb: 1
                  }}
                >
                  {card.value}
                </Typography>
                
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium' }}>
                  {card.title}
                </Typography>
                
                <Typography variant="body2" color="text.secondary">
                  {card.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Introduction Card */}
      <Card elevation={1} sx={{ mb: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            Welcome to the VEXUS Atlas
          </Typography>
          
          <Typography variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
            Our comprehensive atlas contains carefully curated ultrasound images and waveforms 
            demonstrating various aspects of venous excess ultrasound (VEXUS) assessment. 
            Each image is categorized by vessel type and includes detailed annotations to help 
            you understand the key features of venous congestion patterns.
          </Typography>
          
          <Typography variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
            Whether you're learning VEXUS methodology or looking for reference cases, 
            this atlas provides high-quality examples with expert commentary and clinical context.
          </Typography>

          {/* Quality Metrics */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Image Quality Distribution
            </Typography>
            
            <Grid container spacing={2}>
              {qualityMetrics.map((metric, index) => (
                <Grid item xs={12} sm={4} key={index}>
                  <Box sx={{ mb: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">{metric.label}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {metric.value}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={metric.value}
                      color={metric.color}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </CardContent>
      </Card>

      {/* Featured Collections */}
      <Card elevation={1}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            Featured Collections
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip label="Teaching Cases" color="primary" variant="outlined" />
            <Chip label="Rare Findings" color="secondary" variant="outlined" />
            <Chip label="Before/After" color="success" variant="outlined" />
            <Chip label="Multi-vessel Assessment" color="warning" variant="outlined" />
            <Chip label="Pathological Patterns" color="error" variant="outlined" />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AtlasOverview;
```

### 4. Search Interface Component
```jsx
// src/components/atlas/SearchInterface.jsx
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  Typography,
  Button,
  Collapse,
  IconButton
} from '@mui/material';
import { 
  Search, 
  Clear, 
  FilterList, 
  ExpandMore,
  ExpandLess 
} from '@mui/icons-material';

const SearchInterface = ({ 
  searchTerm, 
  filters, 
  onSearchChange, 
  onFiltersChange, 
  onClearFilters,
  categories,
  resultCount 
}) => {
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  const filterOptions = {
    category: categories.map(cat => ({ value: cat.id, label: cat.title })),
    quality: [
      { value: 'high', label: 'High Quality' },
      { value: 'good', label: 'Good Quality' },
      { value: 'fair', label: 'Fair Quality' }
    ],
    vexusGrade: [
      { value: '0', label: 'Grade 0 (Normal)' },
      { value: '1', label: 'Grade 1 (Mild)' },
      { value: '2', label: 'Grade 2 (Moderate)' },
      { value: '3', label: 'Grade 3 (Severe)' }
    ],
    imageType: [
      { value: 'ultrasound', label: 'Ultrasound Image' },
      { value: 'waveform', label: 'Doppler Waveform' },
      { value: 'composite', label: 'Composite View' }
    ]
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length + (searchTerm ? 1 : 0);

  return (
    <Card elevation={1} sx={{ mb: 4 }}>
      <CardContent sx={{ p: 3 }}>
        {/* Search Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Search color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Search Atlas
              {activeFiltersCount > 0 && (
                <Chip 
                  label={`${activeFiltersCount} filters`}
                  size="small"
                  color="primary"
                  sx={{ ml: 2 }}
                />
              )}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {resultCount} results
            </Typography>
            <IconButton
              onClick={() => setFiltersExpanded(!filtersExpanded)}
              aria-label="toggle filters"
            >
              {filtersExpanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>
        </Box>

        {/* Main Search Bar */}
        <TextField
          fullWidth
          placeholder="Search by description, keywords, findings..."
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

        {/* Advanced Filters */}
        <Collapse in={filtersExpanded}>
          <Box sx={{ pt: 2, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Advanced Filters
            </Typography>
            
            <Grid container spacing={2}>
              {Object.entries(filterOptions).map(([key, options]) => (
                <Grid item xs={12} sm={6} md={3} key={key}>
                  <FormControl fullWidth>
                    <InputLabel>{key.charAt(0).toUpperCase() + key.slice(1)}</InputLabel>
                    <Select
                      value={filters[key] || ''}
                      label={key.charAt(0).toUpperCase() + key.slice(1)}
                      onChange={(e) => onFiltersChange(key, e.target.value || null)}
                    >
                      <MenuItem value="">All {key}s</MenuItem>
                      {options.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              ))}
            </Grid>

            {/* Active Filters Display */}
            {activeFiltersCount > 0 && (
              <Box sx={{ mt: 3, display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
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
                      label={`${key}: ${filterOptions[key]?.find(opt => opt.value === value)?.label || value}`}
                      onDelete={() => onFiltersChange(key, null)}
                      size="small"
                    />
                  )
                ))}
                <Button size="small" onClick={onClearFilters} sx={{ ml: 1 }}>
                  Clear All
                </Button>
              </Box>
            )}
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default SearchInterface;
```

### 5. Image Grid Component
```jsx
// src/components/atlas/ImageGrid.jsx
import React, { useState } from 'react';
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
  Dialog,
  DialogContent,
  useTheme
} from '@mui/material';
import { 
  GridView, 
  ViewList, 
  ViewComfy,
  ZoomIn,
  Close,
  Verified,
  Star
} from '@mui/icons-material';
import ImageDetailModal from './ImageDetailModal';

const ImageGrid = ({ 
  images, 
  viewMode = 'grid', 
  onViewModeChange,
  showFilters = false,
  maxItems,
  compact = false 
}) => {
  const theme = useTheme();
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const displayImages = maxItems ? images.slice(0, maxItems) : images;

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedImage(null);
  };

  const getQualityColor = (quality) => {
    switch (quality) {
      case 'high': return 'success';
      case 'good': return 'warning';
      case 'fair': return 'error';
      default: return 'default';
    }
  };

  const getVexusGradeColor = (grade) => {
    switch (grade) {
      case '0': return 'success';
      case '1': return 'info';
      case '2': return 'warning';
      case '3': return 'error';
      default: return 'default';
    }
  };

  const getGridColumns = () => {
    if (compact) return { xs: 12, sm: 6, md: 4 };
    
    switch (viewMode) {
      case 'grid': return { xs: 12, sm: 6, md: 4, lg: 3 };
      case 'list': return { xs: 12 };
      case 'masonry': return { xs: 12, sm: 6, md: 4 };
      default: return { xs: 12, sm: 6, md: 4 };
    }
  };

  return (
    <Box>
      {/* View Mode Controls */}
      {showFilters && onViewModeChange && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(e, newMode) => newMode && onViewModeChange(newMode)}
            size="small"
          >
            <ToggleButton value="grid" aria-label="grid view">
              <GridView />
            </ToggleButton>
            <ToggleButton value="list" aria-label="list view">
              <ViewList />
            </ToggleButton>
            <ToggleButton value="masonry" aria-label="masonry view">
              <ViewComfy />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      )}

      {/* Images Grid */}
      {displayImages.length === 0 ? (
        <Card elevation={1}>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No images found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your search criteria or filters
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={compact ? 2 : 3}>
          {displayImages.map((image) => (
            <Grid item {...getGridColumns()} key={image.id}>
              <Card 
                elevation={2}
                sx={{
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
                onClick={() => handleImageClick(image)}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    image={image.src}
                    alt={image.alt}
                    sx={{
                      height: compact ? 150 : viewMode === 'list' ? 120 : 200,
                      objectFit: 'cover'
                    }}
                  />
                  
                  {/* Image Overlays */}
                  <Box sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.5
                  }}>
                    {image.featured && (
                      <Chip
                        icon={<Star />}
                        label="Featured"
                        size="small"
                        color="primary"
                        sx={{ bgcolor: 'rgba(255,255,255,0.95)' }}
                      />
                    )}
                    
                    {image.verified && (
                      <Chip
                        icon={<Verified />}
                        label="Verified"
                        size="small"
                        color="success"
                        sx={{ bgcolor: 'rgba(255,255,255,0.95)' }}
                      />
                    )}
                  </Box>

                  {/* Zoom Icon */}
                  <Box sx={{
                    position: 'absolute',
                    top: 8,
                    left: 8,
                    opacity: 0,
                    transition: 'opacity 0.3s',
                    '.MuiCard-root:hover &': { opacity: 1 }
                  }}>
                    <IconButton 
                      size="small"
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.9)',
                        '&:hover': { bgcolor: 'rgba(255,255,255,1)' }
                      }}
                    >
                      <ZoomIn />
                    </IconButton>
                  </Box>
                </Box>

                <CardContent sx={{ p: compact ? 2 : 3 }}>
                  <Typography 
                    variant={compact ? "subtitle2" : "h6"} 
                    gutterBottom
                    sx={{ 
                      fontWeight: 'bold',
                      lineHeight: 1.3,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {image.title}
                  </Typography>

                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      mb: 2,
                      display: '-webkit-box',
                      WebkitLineClamp: compact ? 2 : 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {image.description}
                  </Typography>

                  {/* Tags and Metadata */}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                    <Chip
                      label={image.category}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    
                    {image.vexusGrade && (
                      <Chip
                        label={`Grade ${image.vexusGrade}`}
                        size="small"
                        color={getVexusGradeColor(image.vexusGrade)}
                      />
                    )}
                    
                    {image.quality && !compact && (
                      <Chip
                        label={image.quality}
                        size="small"
                        color={getQualityColor(image.quality)}
                        variant="outlined"
                      />
                    )}
                  </Box>

                  {/* Additional metadata for non-compact view */}
                  {!compact && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        {image.dateAdded}
                      </Typography>
                      
                      {image.viewCount && (
                        <Typography variant="caption" color="text.secondary">
                          {image.viewCount} views
                        </Typography>
                      )}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Image Detail Modal */}
      <ImageDetailModal
        image={selectedImage}
        open={modalOpen}
        onClose={handleCloseModal}
      />
    </Box>
  );
};

export default ImageGrid;
```

### 6. State Management Hooks

#### useAtlasData Hook
```jsx
// src/hooks/useAtlasData.js
import { useState, useEffect } from 'react';
import { atlasService } from '../services/atlasService';

export const useAtlasData = () => {
  const [atlasData, setAtlasData] = useState({
    images: [],
    recentImages: [],
    featuredImages: []
  });
  const [stats, setStats] = useState({
    totalImages: 0,
    categories: 5,
    verifiedCases: 0,
    lastUpdated: 'Loading...',
    hepatic: 0,
    portal: 0,
    renal: 0,
    ivc: 0,
    general: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAtlasData = async () => {
      try {
        setLoading(true);
        const [images, statistics] = await Promise.all([
          atlasService.fetchImages(),
          atlasService.fetchStats()
        ]);
        
        setAtlasData({
          images,
          recentImages: images.slice(0, 12).sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded)),
          featuredImages: images.filter(img => img.featured)
        });
        
        setStats(statistics);
        setError(null);
      } catch (err) {
        setError(err.message);
        // Fallback to static data
        setAtlasData(atlasConfig.sampleData);
        setStats(atlasConfig.sampleStats);
      } finally {
        setLoading(false);
      }
    };

    fetchAtlasData();
  }, []);

  return {
    atlasData,
    stats,
    loading,
    error
  };
};
```

#### useImageSearch Hook
```jsx
// src/hooks/useImageSearch.js
import { useState, useMemo, useCallback } from 'react';

export const useImageSearch = (images) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: null,
    quality: null,
    vexusGrade: null,
    imageType: null
  });

  const filteredImages = useMemo(() => {
    return images.filter(image => {
      // Search term filter
      if (searchTerm) {
        const searchFields = [
          image.title,
          image.description,
          image.keywords,
          image.findings,
          image.category
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
  }, [images, searchTerm, filters]);

  const updateSearch = useCallback((term) => {
    setSearchTerm(term);
  }, []);

  const updateFilters = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setFilters({
      category: null,
      quality: null,
      vexusGrade: null,
      imageType: null
    });
  }, []);

  return {
    searchTerm,
    filters,
    filteredImages,
    updateSearch,
    updateFilters,
    clearFilters
  };
};
```

### 7. Dependencies & Implementation Priority

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
    "fuse.js": "^6.x.x",
    "react-window": "^1.x.x"
  }
}
```

#### Implementation Priority
1. **Core Layout & Structure** (Container, navigation, basic views)
2. **Category Grid** (Category navigation and organization)
3. **Image Grid System** (Display modes, responsive layouts)
4. **Search Interface** (Search bar, filters, results)
5. **Atlas Overview** (Statistics, featured content)
6. **Image Detail Modal** (Lightbox, metadata display)
7. **Contribution System** (Upload forms, user submissions)
8. **Performance Optimizations** (Virtual scrolling, lazy loading)

### 8. Testing Strategy

```javascript
// src/components/atlas/__tests__/CategoryGrid.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CategoryGrid from '../CategoryGrid';

const theme = createTheme();
const mockCategories = [
  {
    id: 'hepatic',
    title: 'Hepatic Vein',
    description: 'Test description',
    icon: '🫀',
    color: 'primary',
    count: 25,
    featured: true
  }
];

describe('CategoryGrid', () => {
  test('renders categories', () => {
    const mockOnSelect = jest.fn();
    
    render(
      <ThemeProvider theme={theme}>
        <CategoryGrid categories={mockCategories} onCategorySelect={mockOnSelect} />
      </ThemeProvider>
    );
    
    expect(screen.getByText('Hepatic Vein')).toBeInTheDocument();
    expect(screen.getByText('25 images')).toBeInTheDocument();
  });

  test('calls onCategorySelect when category is clicked', () => {
    const mockOnSelect = jest.fn();
    
    render(
      <ThemeProvider theme={theme}>
        <CategoryGrid categories={mockCategories} onCategorySelect={mockOnSelect} />
      </ThemeProvider>
    );
    
    const categoryCard = screen.getByText('Hepatic Vein').closest('.MuiCard-root');
    fireEvent.click(categoryCard);
    
    expect(mockOnSelect).toHaveBeenCalledWith(mockCategories[0]);
  });
});
```

### 9. Performance & SEO Considerations

- **Medical Image Schema**: Structured data for medical content
- **Advanced Search**: Full-text search with fuzzy matching
- **Virtual Scrolling**: Performance optimization for large image sets
- **Progressive Loading**: Lazy loading with skeleton placeholders
- **Accessibility**: Screen reader support, keyboard navigation
- **Mobile Optimization**: Touch-friendly interactions, responsive grids
- **Caching Strategy**: Intelligent image caching and prefetching

This comprehensive framework provides a robust foundation for converting the index-atlas.astro page to a modern React application with Material-UI, ensuring excellent user experience for medical image browsing and atlas navigation. 
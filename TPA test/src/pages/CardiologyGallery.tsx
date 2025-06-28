import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  TextField,
  InputAdornment,
  Alert,
  Paper,
  IconButton,
  Container,
  Skeleton
} from '@mui/material';
import {
  Search,
  MonitorHeart,
  Favorite,
  ChildCare,
  MoreHoriz,
  Clear,
  ViewModule,
  ViewComfy,
  PlayArrow
} from '@mui/icons-material';
import { CategorizedImages, PocusImageData, CategoryConfig } from '../types/pocus';
import ImageLightbox from '../components/gallery/ImageLightbox';

interface CardiologyGalleryProps {
  categorizedImages: CategorizedImages | null;
  loading: boolean;
}

// These functions are now handled by the backend
// and the isVideo property is provided directly in the PocusImageData type

const CardiologyGallery: React.FC<CardiologyGalleryProps> = ({
  categorizedImages,
  loading
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<PocusImageData[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');

  // Test video URL for debugging
  const testVideoUrl = categorizedImages?.cardiomyopathy?.[0]?.imageUrl;
  
  console.log('🧪 Test video URL:', testVideoUrl);

  const categories: CategoryConfig[] = [
    {
      key: 'cardiomyopathy',
      title: 'Cardiomyopathy',
      color: '#d32f2f',
      gradient: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)',
      description: 'Decreased cardiac function and cardiomyopathy cases',
      icon: <MonitorHeart />
    },
    {
      key: 'congenitalHeartDisease', 
      title: 'Congenital',
      color: '#1976d2',
      gradient: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
      description: 'Congenital heart disease and structural abnormalities',
      icon: <Favorite />
    },
    {
      key: 'pericardialDisease',
      title: 'Pericardial', 
      color: '#388e3c',
      gradient: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
      description: 'Pericardial effusion and disease patterns',
      icon: <ChildCare />
    },
    {
      key: 'valvularDisease',
      title: 'Valvular',
      color: '#f57c00',
      gradient: 'linear-gradient(135deg, #fff3e0 0%, #ffcc02 100%)',
      description: 'Valvular disease and dysfunction',
      icon: <MonitorHeart />
    },
    {
      key: 'rvDysfunction',
      title: 'RV Dysfunction',
      color: '#7b1fa2',
      gradient: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
      description: 'Right ventricular dysfunction patterns',
      icon: <MonitorHeart />
    },
    {
      key: 'other',
      title: 'Other',
      color: '#5d4037',
      gradient: 'linear-gradient(135deg, #efebe9 0%, #d7ccc8 100%)',
      description: 'Additional cardiac findings and miscellaneous patterns',
      icon: <MoreHoriz />
    }
  ];

  // Combine all images for search and display
  const allImages = useMemo(() => {
    if (!categorizedImages) return [];
    
    const combined: PocusImageData[] = [];
    Object.entries(categorizedImages).forEach(([, images]) => {
      // Ensure images is an array before spreading
      if (Array.isArray(images)) {
        combined.push(...images);
      }
    });
    return combined;
  }, [categorizedImages]);

  // Filter images based on search and category
  const filteredImages = useMemo(() => {
    let images = allImages;

    // Filter by category
    if (selectedCategory !== 'all' && categorizedImages) {
      const categoryKey = selectedCategory as keyof CategorizedImages;
      const categoryImages = categorizedImages[categoryKey];
      images = Array.isArray(categoryImages) ? categoryImages : [];
    }

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      images = images.filter(image =>
        image.title.toLowerCase().includes(searchLower) ||
        image.description.toLowerCase().includes(searchLower) ||
        image.category.toLowerCase().includes(searchLower) ||
        image.tags.some((tag: string) => tag.toLowerCase().includes(searchLower))
      );
    }

    return images;
  }, [allImages, selectedCategory, searchTerm, categorizedImages]);

  // Calculate category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: allImages.length };
    
    if (categorizedImages) {
      Object.entries(categorizedImages).forEach(([key, images]) => {
        // Ensure images is an array before accessing length
        counts[key] = Array.isArray(images) ? images.length : 0;
      });
    }
    
    return counts;
  }, [allImages, categorizedImages]);

  const handleImageClick = (image: PocusImageData) => {
    const imageIndex = filteredImages.findIndex(img => img.id === image.id);
    setLightboxImages(filteredImages);
    setLightboxIndex(imageIndex);
    setLightboxOpen(true);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  if (loading) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ py: 4 }}>
          {/* Category Filter Skeleton */}
          <Box sx={{ mb: 4 }}>
            <Grid container spacing={2}>
              {[...Array(7)].map((_, index) => (
                <Grid item xs={6} sm={4} md={3} lg={2} key={index}>
                  <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 2 }} />
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Image Grid Skeleton */}
          <Grid container spacing={3}>
            {[...Array(12)].map((_, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Card>
                  <Skeleton variant="rectangular" height={200} />
                  <CardContent>
                    <Skeleton variant="text" />
                    <Skeleton variant="text" width="60%" />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    );
  }

  if (!categorizedImages) {
    return (
      <Container maxWidth="xl">
        <Alert severity="error" sx={{ mt: 4 }}>
          Failed to load cardiology images. Please try refreshing the page.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        {/* POCUS Atlas Header with Logo */}
        <Box 
          sx={{ 
            mb: 4, 
            textAlign: 'center',
            p: 3,
            background: '#ffffff',
            borderBottom: '1px solid #e0e0e0',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          
          {/* Content */}
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <img 
                src="/images/the-pocus-atlas-logo.png" 
                alt="The POCUS Atlas" 
                                  style={{ 
                    height: '80px',
                    maxWidth: '100%',
                    objectFit: 'contain'
                  }}
                  onError={(e) => {
                    console.error('Logo failed to load from /images/the-pocus-atlas-logo.png');
                    // Replace with text fallback
                    const parent = (e.target as HTMLImageElement).parentElement;
                    if (parent) {
                      parent.innerHTML = `
                        <div style="
                          font-size: 2rem; 
                          font-weight: bold; 
                          color: #1976d2; 
                          text-align: center;
                          padding: 10px 20px;
                          border: 2px solid rgba(25, 118, 210, 0.3);
                          border-radius: 8px;
                          background: rgba(25, 118, 210, 0.05);
                        ">
                          THE POCUS ATLAS
                        </div>
                      `;
                    }
                  }}
                onLoad={() => {
                  console.log('✅ POCUS Atlas logo loaded successfully');
                }}
              />
            </Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
              Cardiology Gallery
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9, maxWidth: 600, mx: 'auto' }}>
              Explore our comprehensive collection of cardiac point-of-care ultrasound images and videos 
              from real clinical cases
            </Typography>
          </Box>
        </Box>

        {/* Search and View Controls */}
        <Box sx={{ mb: 4, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            variant="outlined"
            placeholder="Search cardiac images..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flexGrow: 1, minWidth: 300 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="action" />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton onClick={handleClearSearch} size="small">
                    <Clear />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          
          <IconButton
            onClick={() => setViewMode(viewMode === 'grid' ? 'compact' : 'grid')}
            color="primary"
          >
            {viewMode === 'grid' ? <ViewComfy /> : <ViewModule />}
          </IconButton>
        </Box>

        {/* Category Filter */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2}>
            {/* All Categories */}
            <Grid item xs={6} sm={4} md={3} lg={2}>
              <Paper
                onClick={() => setSelectedCategory('all')}
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  textAlign: 'center',
                  backgroundColor: 'background.paper',
                  border: selectedCategory === 'all' ? '2px solid' : '1px solid',
                  borderColor: selectedCategory === 'all' ? 'primary.main' : 'divider',
                  color: selectedCategory === 'all' ? 'primary.main' : 'text.primary',
                  boxShadow: selectedCategory === 'all' ? '0 2px 8px rgba(25, 118, 210, 0.15)' : 'none',
                  '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.2s'
                }}
              >
                <Typography variant="subtitle2" fontWeight="bold">
                  All Images
                </Typography>
                <Typography variant="h6" color="inherit">
                  {categoryCounts.all || 0}
                </Typography>
              </Paper>
            </Grid>

            {/* Individual Categories */}
            {categories.map((category) => (
              <Grid item xs={6} sm={4} md={3} lg={2} key={category.key}>
                <Paper
                  onClick={() => setSelectedCategory(category.key)}
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    textAlign: 'center',
                    backgroundColor: 'background.paper',
                    border: selectedCategory === category.key ? '2px solid' : '1px solid',
                    borderColor: selectedCategory === category.key ? category.color : 'divider',
                    color: selectedCategory === category.key ? category.color : 'text.primary',
                    boxShadow: selectedCategory === category.key ? `0 2px 8px ${category.color}25` : 'none',
                    '&:hover': {
                      borderColor: category.color,
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.2s'
                  }}
                >
                  <Box sx={{ mb: 1, color: selectedCategory === category.key ? 'white' : category.color }}>
                    {category.icon}
                  </Box>
                  <Typography variant="subtitle2" fontWeight="bold" fontSize="0.75rem">
                    {category.title}
                  </Typography>
                  <Typography variant="h6" color="inherit">
                    {categoryCounts[category.key] || 0}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Results Count */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {filteredImages.length} image{filteredImages.length !== 1 ? 's' : ''} found
          {searchTerm && ` for "${searchTerm}"`}
          {selectedCategory !== 'all' && ` in ${categories.find(c => c.key === selectedCategory)?.title}`}
        </Typography>

        {/* Image Grid */}
        {filteredImages.length === 0 ? (
          <Alert severity="info" sx={{ mt: 4 }}>
            No images found for the current search criteria.
          </Alert>
        ) : (
          <Grid container spacing={viewMode === 'grid' ? 3 : 2}>
            {filteredImages.map((image, index) => {
              const isVideo = image.isVideo;
              
              // Debug logging for each image
              console.log(`📊 Processing image ${index + 1}/${filteredImages.length}:`, {
                id: image.id,
                title: image.title,
                imageUrl: image.imageUrl,
                thumbnailUrl: image.thumbnailUrl,
                category: image.category,
                isVideo: isVideo
              });
              
              return (
                <Grid 
                  item 
                  xs={12} 
                  sm={viewMode === 'grid' ? 6 : 4} 
                  md={viewMode === 'grid' ? 4 : 3} 
                  lg={viewMode === 'grid' ? 3 : 2} 
                  key={image.id}
                >
                  <Card
                    onClick={() => handleImageClick(image)}
                    sx={{
                      cursor: 'pointer',
                      position: 'relative',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4
                      },
                      transition: 'all 0.2s'
                    }}
                  >
                    {isVideo ? (
                      <Box sx={{ position: 'relative' }}>
                        {/* Try to show actual video thumbnail or use video as poster */}
                        <video
                          width="100%"
                          height={viewMode === 'grid' ? 200 : 150}
                          style={{ 
                            objectFit: 'cover',
                            backgroundColor: '#f5f5f5',
                            display: 'block'
                          }}
                          muted
                          playsInline
                          preload="metadata"
                          poster={image.thumbnailUrl !== image.imageUrl ? `/api/pocus/image-proxy?url=${encodeURIComponent(image.thumbnailUrl)}` : undefined}
                          onLoadedMetadata={(e) => {
                            // Seek to 1 second to get a frame for preview
                            const video = e.target as HTMLVideoElement;
                            video.currentTime = 1;
                          }}
                          onError={(e) => {
                            console.error(`🎥 Video preview error for ${image.title}:`, e);
                            // Hide the video element and show fallback
                            (e.target as HTMLVideoElement).style.display = 'none';
                          }}
                        >
                          <source src={`/api/pocus/video-proxy?url=${encodeURIComponent(image.imageUrl)}`} type="video/mp4" />
                        </video>
                        
                        {/* Fallback image for when video fails to load */}
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            height: viewMode === 'grid' ? 200 : 150,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: -1
                          }}
                        >
                          <Box sx={{ textAlign: 'center', color: 'white' }}>
                            <MonitorHeart sx={{ fontSize: 32, mb: 1, opacity: 0.8 }} />
                            <Typography variant="caption" sx={{ fontSize: '0.7rem', opacity: 0.8 }}>
                              Video Preview
                            </Typography>
                          </Box>
                        </Box>
                        {/* Video play overlay */}
                        <Box
                          sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            borderRadius: '50%',
                            width: 56,
                            height: 56,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#667eea',
                            pointerEvents: 'none',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                            border: '2px solid rgba(255,255,255,0.8)'
                          }}
                        >
                          <PlayArrow sx={{ fontSize: 28, marginLeft: '2px' }} />
                        </Box>
                      </Box>
                    ) : (
                      <CardMedia
                        component="img"
                        height={viewMode === 'grid' ? 200 : 150}
                        image={`/api/pocus/image-proxy?url=${encodeURIComponent(image.thumbnailUrl || image.imageUrl)}`}
                        alt={image.title}
                        sx={{ objectFit: 'cover' }}
                        onLoad={() => {
                          console.log(`📷 Image loaded successfully: ${image.title}`);
                        }}
                        onError={() => {
                          console.error(`📷 Image error for ${image.title}: ${image.imageUrl}`);
                        }}
                      />
                    )}
                    <CardContent sx={{ p: viewMode === 'grid' ? 2 : 1.5 }}>
                      <Typography 
                        variant={viewMode === 'grid' ? 'subtitle1' : 'subtitle2'} 
                        component="h3" 
                        noWrap
                        sx={{ fontWeight: 600, mb: 1 }}
                      >
                        {image.title}
                      </Typography>
                      
                      {viewMode === 'grid' && image.description && (
                        <Typography 
                          variant="body2" 
                          color="text.secondary" 
                          sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            mb: 1
                          }}
                        >
                          {image.description}
                        </Typography>
                      )}

                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                        <Chip
                          label={image.category}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                        {isVideo && (
                          <Chip
                            label="Video"
                            size="small"
                            color="secondary"
                            variant="filled"
                          />
                        )}
                        {viewMode === 'grid' && image.tags.slice(0, 2).map((tag: string, index: number) => (
                          <Chip
                            key={index}
                            label={tag}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        ))}
                      </Box>

                      {viewMode === 'grid' && image.contributor && (
                        <Typography variant="caption" color="text.secondary" display="block">
                          {image.contributor}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}

        {/* Image Lightbox */}
        <ImageLightbox
          images={lightboxImages}
          initialIndex={lightboxIndex}
          open={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
        />
      </Box>
    </Container>
  );
};

export default CardiologyGallery; 
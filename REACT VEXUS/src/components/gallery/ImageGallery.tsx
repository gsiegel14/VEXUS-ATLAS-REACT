import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Skeleton,
  useTheme,
  useMediaQuery,
  Tooltip,
  Collapse,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Fade,
  Zoom,
} from '@mui/material';
import {
  ExpandMore,
  ZoomIn,
  Info,
  LocalHospital,
  HighQuality,
  AccessTime,
  Close,
  Biotech,
  MonitorHeart,
  Science,
} from '@mui/icons-material';
import { useInView } from 'react-intersection-observer';
import { VexusImageData } from '../../services/airtableService';
import ImageLightbox from './ImageLightbox';

interface ImageGalleryProps {
  categorizedImages: {
    hepatic: VexusImageData[];
    portal: VexusImageData[];
    renal: VexusImageData[];
  };
  loading?: boolean;
}

interface CategoryConfig {
  key: 'hepatic' | 'portal' | 'renal';
  title: string;
  color: string;
  gradient: string;
  description: string;
  icon: React.ReactNode;
}

const categories: CategoryConfig[] = [
  {
    key: 'hepatic',
    title: 'Hepatic Vein Images',
    color: '#495057',
    gradient: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
    description: 'Hepatic vein ultrasound images showing various VEXUS patterns and flow characteristics',
    icon: <LocalHospital />
  },
  {
    key: 'portal',
    title: 'Portal Vein Images',
    color: '#6c757d',
    gradient: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
    description: 'Portal vein ultrasound images demonstrating different flow patterns and pulsatility',
    icon: <MonitorHeart />
  },
  {
    key: 'renal',
    title: 'Renal Vein Images',
    color: '#495057',
    gradient: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
    description: 'Renal vein ultrasound images illustrating venous flow patterns and congestion signs',
    icon: <Science />
  }
];

const ImageCard: React.FC<{
  image: VexusImageData;
  onImageClick: (image: VexusImageData) => void;
  categoryColor: string;
}> = ({ image, onImageClick, categoryColor }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const getQualityColor = (quality: string) => {
    switch (quality?.toLowerCase()) {
      case 'high': return '#4caf50';
      case 'medium': return '#ff9800';
      case 'low': return '#f44336';
      default: return '#757575';
    }
  };

  const getVexusGradeColor = (grade?: string) => {
    switch (grade) {
      case '0': return '#4caf50';
      case '1': return '#8bc34a';
      case '2': return '#ff9800';
      case '3': return '#f44336';
      default: return '#757575';
    }
  };

  const createTooltipContent = (label: string, value: string) => {
    return (
      <Box>
        <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block' }}>
          {label}
        </Typography>
        <Typography variant="body2">{value}</Typography>
      </Box>
    );
  };

  return (
    <Card
      ref={ref}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        borderRadius: 3,
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
        boxShadow: isHovered 
          ? '0 12px 24px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.1)' 
          : '0 4px 8px rgba(0,0,0,0.08)',
        '&:hover .zoom-overlay': { opacity: 1 },
        border: `1px solid ${imageLoaded ? 'transparent' : '#e0e0e0'}`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onImageClick(image)}
    >
      <Box sx={{ position: 'relative', paddingTop: '66.67%', overflow: 'hidden' }}>
        {inView && !imageError ? (
          <>
            {!imageLoaded && (
              <Skeleton
                variant="rectangular"
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  '&::after': {
                    background: 'linear-gradient(110deg, #ececec 8%, #f5f5f5 18%, #ececec 33%)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 1.5s linear infinite',
                  }
                }}
              />
            )}
            <Box
              component="img"
              src={image.thumbnailUrl || image.imageUrl}
              alt={image.title}
              onLoad={handleImageLoad}
              onError={handleImageError}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: imageLoaded ? 1 : 0,
                transition: 'all 0.4s ease',
                transform: isHovered ? 'scale(1.05)' : 'scale(1)',
              }}
            />
          </>
        ) : (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'grey.100',
              color: 'text.secondary'
            }}
          >
            <Info sx={{ fontSize: 48, opacity: 0.5 }} />
          </Box>
        )}

        {/* Zoom Overlay */}
        <Box
          className="zoom-overlay"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0,
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(2px)',
          }}
        >
          <ZoomIn sx={{ color: 'white', fontSize: 56, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} />
        </Box>

        {/* Beautiful Tags Overlay */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 12,
            left: 12,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 0.75,
            maxWidth: 'calc(100% - 24px)',
          }}
        >
          {image.quality && (
            <Tooltip 
              title={createTooltipContent('Image Quality', `${image.quality} - Visual clarity and diagnostic value of the ultrasound image`)}
              placement="top"
              arrow
            >
              <Chip
                label={image.quality}
                size="small"
                sx={{
                  bgcolor: getQualityColor(image.quality),
                  color: 'white',
                  fontFamily: 'Europa, sans-serif',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                  }
                }}
              />
            </Tooltip>
          )}
          
          {image.vexusGrade && (
            <Tooltip 
              title={createTooltipContent('VEXUS Grade', `Grade ${image.vexusGrade} - Clinical severity assessment based on venous flow patterns`)}
              placement="top"
              arrow
            >
              <Chip
                icon={<Biotech sx={{ fontSize: '16px !important' }} />}
                label={`Grade ${image.vexusGrade}`}
                size="small"
                sx={{
                  bgcolor: getVexusGradeColor(image.vexusGrade),
                  color: 'white',
                  fontFamily: 'Europa, sans-serif',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  '& .MuiChip-icon': { color: 'white' },
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                  }
                }}
              />
            </Tooltip>
          )}

          {image.waveform && (
            <Tooltip 
              title={createTooltipContent('Waveform Pattern', `${image.waveform} - Characteristic flow pattern observed in the ultrasound`)}
              placement="top"
              arrow
            >
              <Chip
                label={image.waveform}
                size="small"
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.95)',
                  color: categoryColor,
                  fontFamily: 'Europa, sans-serif',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  backdropFilter: 'blur(8px)',
                  border: `1px solid ${categoryColor}`,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    bgcolor: categoryColor,
                    color: 'white',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                  }
                }}
              />
            </Tooltip>
          )}
        </Box>

        {/* Analysis and QA indicators */}
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            display: 'flex',
            flexDirection: 'column',
            gap: 0.5,
          }}
        >
          {image.analysis && (
            <Tooltip title={createTooltipContent('Analysis Available', image.analysis)} placement="left" arrow>
              <Chip
                label="Analysis"
                size="small"
                sx={{
                  bgcolor: 'rgba(76, 175, 80, 0.9)',
                  color: 'white',
                  fontSize: '0.65rem',
                  height: 20,
                  fontWeight: 600,
                  backdropFilter: 'blur(8px)',
                }}
              />
            </Tooltip>
          )}
          
          {image.qa && (
            <Tooltip title={createTooltipContent('Quality Assurance', image.qa)} placement="left" arrow>
              <Chip
                label="QA"
                size="small"
                sx={{
                  bgcolor: 'rgba(103, 58, 183, 0.9)',
                  color: 'white',
                  fontSize: '0.65rem',
                  height: 20,
                  fontWeight: 600,
                  backdropFilter: 'blur(8px)',
                }}
              />
            </Tooltip>
          )}
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography
          variant="h6"
          component="h3"
          gutterBottom
          sx={{
            fontFamily: 'Europa, sans-serif',
            fontWeight: 600,
            fontSize: '1rem',
            lineHeight: 1.3,
            color: 'text.primary',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            mb: 1,
          }}
        >
          {image.title || `${image.veinType} Study`}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            fontFamily: 'Europa, sans-serif',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            mb: 1.5,
            lineHeight: 1.4,
          }}
        >
          {image.description || ''}
        </Typography>

        {/* Metadata Footer */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto' }}>
          {image.submissionDate && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AccessTime sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'Europa, sans-serif' }}>
                {new Date(image.submissionDate).toLocaleDateString()}
              </Typography>
            </Box>
          )}

          {image.institution && (
            <Typography 
              variant="caption" 
              color="text.secondary" 
              sx={{ 
                fontFamily: 'Europa, sans-serif',
                fontWeight: 500,
                textAlign: 'right',
                fontSize: '0.7rem',
              }}
            >
              {image.institution}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

const CategorySection: React.FC<{
  category: CategoryConfig;
  images: VexusImageData[];
  onImageClick: (image: VexusImageData) => void;
  isMobile: boolean;
}> = ({ category, images, onImageClick, isMobile }) => {
  const [expanded, setExpanded] = useState(false);
  const [showAll, setShowAll] = useState(false);
  
  const INITIAL_DISPLAY_COUNT = 3;
  const displayImages = showAll ? images : images.slice(0, INITIAL_DISPLAY_COUNT);
  const hasMoreImages = images.length > INITIAL_DISPLAY_COUNT;

  if (images.length === 0) {
    return null;
  }

  return (
    <Paper
      elevation={0}
      sx={{
        mb: 4,
        borderRadius: 4,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'grey.200',
        backgroundColor: 'background.paper',
      }}
    >
      {/* Category Header */}
      <Box
        sx={{
          background: category.gradient,
          color: '#212529',
          p: 3,
          position: 'relative',
          border: '1px solid #dee2e6',
          borderBottom: 'none',
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Box sx={{ mr: 2, color: category.color }}>
              {category.icon}
            </Box>
            <Typography
              variant="h5"
              sx={{
                fontFamily: 'system-ui, -apple-system, sans-serif',
                fontWeight: 600,
                fontSize: { xs: '1.2rem', md: '1.4rem' },
                color: '#212529',
              }}
            >
              {category.title}
            </Typography>
            <Chip
              label={images.length}
              sx={{
                ml: 2,
                bgcolor: '#f8f9fa',
                color: '#495057',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                fontWeight: 500,
                border: '1px solid #dee2e6',
                fontSize: '0.8rem',
              }}
            />
          </Box>
          <Typography
            variant="body2"
            sx={{
              color: '#6c757d',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: '0.9rem',
              lineHeight: 1.5,
            }}
          >
            {category.description}
          </Typography>
        </Box>
      </Box>

      {/* Images Grid */}
      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {displayImages.map((image, index) => (
            <Grid item xs={12} sm={6} md={4} key={image.id}>
              <Zoom in={true} timeout={300 + index * 100}>
                <Box>
                  <ImageCard 
                    image={image} 
                    onImageClick={onImageClick}
                    categoryColor={category.color}
                  />
                </Box>
              </Zoom>
            </Grid>
          ))}
        </Grid>

        {/* Expand/Collapse Button */}
        {hasMoreImages && (
          <Fade in={true} timeout={800}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Button
                variant="outlined"
                size="large"
                onClick={() => setShowAll(!showAll)}
                endIcon={
                  <ExpandMore 
                    sx={{ 
                      transform: showAll ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease',
                    }} 
                  />
                }
                sx={{
                  borderColor: category.color,
                  color: category.color,
                  fontFamily: 'Europa, sans-serif',
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  '&:hover': {
                    borderColor: category.color,
                    bgcolor: `${category.color}10`,
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {showAll 
                  ? 'Show Less' 
                  : `Show All ${images.length} Images`
                }
              </Button>
            </Box>
          </Fade>
        )}
      </Box>
    </Paper>
  );
};

const ImageGallery: React.FC<ImageGalleryProps> = ({ categorizedImages, loading = false }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [selectedImage, setSelectedImage] = useState<VexusImageData | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const handleImageClick = useCallback((image: VexusImageData) => {
    setSelectedImage(image);
    setLightboxOpen(true);
  }, []);

  const handleLightboxClose = useCallback(() => {
    setLightboxOpen(false);
    setSelectedImage(null);
  }, []);

  if (loading) {
    return (
      <Box>
        {categories.map(category => (
          <Paper key={category.key} elevation={0} sx={{ mb: 4, borderRadius: 4, overflow: 'hidden' }}>
            <Skeleton variant="rectangular" height={120} />
            <Box sx={{ p: 3 }}>
              <Grid container spacing={3}>
                {[...Array(3)].map((_, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 3 }} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Paper>
        ))}
      </Box>
    );
  }

  // Filter out categories with no images
  const categoriesWithImages = categories.filter(category => 
    categorizedImages[category.key]?.length > 0
  );

  if (categoriesWithImages.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 6,
          textAlign: 'center',
          borderRadius: 4,
          border: '2px dashed',
          borderColor: 'grey.300',
          bgcolor: 'grey.50',
        }}
      >
        <Info sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography
          variant="h5"
          color="text.secondary"
          sx={{ fontFamily: 'Europa, sans-serif', mb: 2 }}
        >
          No Images Found
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ fontFamily: 'Europa, sans-serif' }}
        >
          No images match your current filter criteria. Try adjusting your search terms or filters.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      {categoriesWithImages.map(category => (
        <CategorySection
          key={category.key}
          category={category}
          images={categorizedImages[category.key] || []}
          onImageClick={handleImageClick}
          isMobile={isMobile}
        />
      ))}

      {/* Enhanced Lightbox */}
      <ImageLightbox
        open={lightboxOpen}
        image={selectedImage}
        onClose={handleLightboxClose}
      />

      {/* Global Styles for animations */}
      <style>
        {`
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `}
      </style>
    </Box>
  );
};

export default ImageGallery; 
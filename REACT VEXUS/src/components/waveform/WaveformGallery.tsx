import React, { useState } from 'react';
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  Dialog,
  DialogContent,
  IconButton
} from '@mui/material';
import { Close, ZoomIn } from '@mui/icons-material';

interface WaveformImage {
  src: string;
  title: string;
  description: string;
  grade: string;
  features: string[];
  analysis?: string;
  clinicalCorrelation?: string;
  alt: string;
}

interface WaveformGalleryProps {
  images: WaveformImage[];
  type: string;
  title: string;
}

const WaveformGallery: React.FC<WaveformGalleryProps> = ({ images, type, title }) => {
  const [selectedImage, setSelectedImage] = useState<WaveformImage | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const handleImageClick = (image: WaveformImage) => {
    setSelectedImage(image);
    setLightboxOpen(true);
  };

  const handleCloseLightbox = () => {
    setLightboxOpen(false);
    setSelectedImage(null);
  };

  const getTypeColor = (imageType: string): 'success' | 'warning' | 'error' | 'default' => {
    switch (imageType) {
      case 'normal': return 'success';
      case 'mild': return 'warning';
      case 'moderate': return 'error';
      case 'severe': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        {title}
      </Typography>

      <Grid container spacing={3}>
        {images.map((image, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card 
              elevation={2}
              sx={{
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
                    height: 200,
                    objectFit: 'cover'
                  }}
                />
                <Box sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  display: 'flex',
                  gap: 1
                }}>
                  <Chip
                    label={image.grade || type}
                    size="small"
                    color={getTypeColor(image.grade || type)}
                    sx={{ bgcolor: 'rgba(255,255,255,0.9)' }}
                  />
                  <IconButton 
                    size="small" 
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.9)',
                      '&:hover': { bgcolor: 'rgba(255,255,255,1)' }
                    }}
                  >
                    <ZoomIn fontSize="small" />
                  </IconButton>
                </Box>
              </Box>

              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {image.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {image.description}
                </Typography>
                
                {/* Key Features */}
                {image.features && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {image.features.map((feature, idx) => (
                      <Chip
                        key={idx}
                        label={feature}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Lightbox Dialog */}
      <Dialog
        open={lightboxOpen}
        onClose={handleCloseLightbox}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent sx={{ p: 0, position: 'relative' }}>
          <IconButton
            onClick={handleCloseLightbox}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: 'rgba(255,255,255,0.9)',
              zIndex: 1
            }}
          >
            <Close />
          </IconButton>
          
          {selectedImage && (
            <Box>
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '70vh',
                  objectFit: 'contain'
                }}
              />
              
              <Box sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {selectedImage.title}
                </Typography>
                <Typography variant="body1" paragraph>
                  {selectedImage.description}
                </Typography>
                
                {/* Detailed Analysis */}
                {selectedImage.analysis && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Waveform Analysis
                    </Typography>
                    <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                      {selectedImage.analysis}
                    </Typography>
                  </Box>
                )}

                {/* Clinical Correlation */}
                {selectedImage.clinicalCorrelation && (
                  <Box sx={{ mt: 2, p: 2, bgcolor: 'info.50', borderRadius: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Clinical Correlation
                    </Typography>
                    <Typography variant="body2">
                      {selectedImage.clinicalCorrelation}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default WaveformGallery; 
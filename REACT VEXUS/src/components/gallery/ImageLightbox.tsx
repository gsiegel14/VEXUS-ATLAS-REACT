import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box,
  Chip,
  Stack,
  Card,
  CardContent,
  Grid,
  Divider,
  useTheme,
  useMediaQuery,
  Fade,
} from '@mui/material';
import {
  Close,
  Download,
  Share,
  Info,
  LocalHospital,
  HighQuality,
  AccessTime,
  Person,
  Business,
} from '@mui/icons-material';
import { VexusImageData } from '../../services/airtableService';

interface ImageLightboxProps {
  open: boolean;
  image: VexusImageData | null;
  onClose: () => void;
}

const ImageLightbox: React.FC<ImageLightboxProps> = ({ open, image, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (!image) return null;

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'High': return '#4caf50';
      case 'Medium': return '#ff9800';
      case 'Low': return '#f44336';
      default: return '#757575';
    }
  };

  const getGradeColor = (grade?: string) => {
    switch (grade) {
      case '0': return '#4caf50';
      case '1': return '#8bc34a';
      case '2': return '#ff9800';
      case '3': return '#f44336';
      default: return '#757575';
    }
  };

  const handleDownload = () => {
    // Create a link element and trigger download
    const link = document.createElement('a');
    link.href = image.imageUrl;
    link.download = `vexus-${image.title.replace(/\s+/g, '-').toLowerCase()}.jpg`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `VEXUS Atlas: ${image.title}`,
          text: image.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy URL to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      fullScreen={isMobile}
      sx={{
        '& .MuiDialog-paper': {
          margin: isMobile ? 0 : 2,
          maxHeight: isMobile ? '100vh' : 'calc(100vh - 64px)',
        }
      }}
      TransitionComponent={Fade}
      transitionDuration={300}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'grey.50'
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontFamily: 'Europa, sans-serif',
            fontWeight: 'medium',
            flex: 1,
            mr: 2
          }}
        >
          {image.title}
        </Typography>
        
        <Stack direction="row" spacing={1}>
          <IconButton
            onClick={handleDownload}
            size="small"
            sx={{ color: 'primary.main' }}
          >
            <Download />
          </IconButton>
          <IconButton
            onClick={handleShare}
            size="small"
            sx={{ color: 'primary.main' }}
          >
            <Share />
          </IconButton>
          <IconButton
            onClick={onClose}
            size="small"
            sx={{ color: 'text.secondary' }}
          >
            <Close />
          </IconButton>
        </Stack>
      </Box>

      <DialogContent sx={{ p: 0, display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}>
        {/* Image Section */}
        <Box
          sx={{
            flex: isMobile ? 'none' : 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'black',
            minHeight: isMobile ? '50vh' : '70vh',
            position: 'relative'
          }}
        >
          <img
            src={image.imageUrl}
            alt={image.title}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              borderRadius: 0
            }}
          />
        </Box>

        {/* Metadata Section */}
        <Box
          sx={{
            flex: isMobile ? 'none' : 1,
            p: 3,
            borderLeft: isMobile ? 'none' : '1px solid',
            borderTop: isMobile ? '1px solid' : 'none',
            borderColor: 'divider',
            maxHeight: isMobile ? 'none' : '70vh',
            overflowY: 'auto'
          }}
        >
          {/* Badges */}
          <Stack direction="row" spacing={1} sx={{ mb: 2 }} flexWrap="wrap" useFlexGap>
            <Chip
              icon={<HighQuality />}
              label={`${image.quality} Quality`}
              size="small"
              sx={{
                bgcolor: getQualityColor(image.quality),
                color: 'white',
                fontFamily: 'Europa, sans-serif',
                '& .MuiChip-icon': { color: 'white' }
              }}
            />
            {image.vexusGrade && (
              <Chip
                icon={<LocalHospital />}
                label={`VEXUS Grade ${image.vexusGrade}`}
                size="small"
                sx={{
                  bgcolor: getGradeColor(image.vexusGrade),
                  color: 'white',
                  fontFamily: 'Europa, sans-serif',
                  '& .MuiChip-icon': { color: 'white' }
                }}
              />
            )}
            <Chip
              label={image.veinType}
              size="small"
              variant="outlined"
              sx={{ fontFamily: 'Europa, sans-serif' }}
            />
            <Chip
              label={image.waveform}
              size="small"
              variant="outlined"
              sx={{ fontFamily: 'Europa, sans-serif' }}
            />
          </Stack>

          {/* Description */}
          <Typography
            variant="body1"
            sx={{
              fontFamily: 'Europa, sans-serif',
              mb: 3,
              lineHeight: 1.6
            }}
          >
            {image.description}
          </Typography>

          {/* Clinical Information */}
          {(image.clinicalContext || image.analysis) && (
            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent sx={{ p: 2 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontFamily: 'Europa, sans-serif',
                    fontWeight: 'medium',
                    mb: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <Info fontSize="small" />
                  Clinical Information
                </Typography>
                {image.clinicalContext && (
                  <Typography
                    variant="body2"
                    sx={{ fontFamily: 'Europa, sans-serif', mb: 1 }}
                  >
                    <strong>Context:</strong> {image.clinicalContext}
                  </Typography>
                )}
                {image.analysis && (
                  <Typography
                    variant="body2"
                    sx={{ fontFamily: 'Europa, sans-serif' }}
                  >
                    <strong>Analysis:</strong> {image.analysis}
                  </Typography>
                )}
              </CardContent>
            </Card>
          )}

          <Divider sx={{ my: 2 }} />

          {/* Metadata Grid */}
          <Grid container spacing={2}>
            {image.subtype && (
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ fontFamily: 'Europa, sans-serif' }}>
                  <strong>Subtype:</strong> {image.subtype}
                </Typography>
              </Grid>
            )}
            
            {image.submittedBy && (
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Person fontSize="small" color="action" />
                  <Typography variant="body2" sx={{ fontFamily: 'Europa, sans-serif' }}>
                    <strong>Submitted by:</strong> {image.submittedBy}
                  </Typography>
                </Box>
              </Grid>
            )}

            {image.institution && (
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Business fontSize="small" color="action" />
                  <Typography variant="body2" sx={{ fontFamily: 'Europa, sans-serif' }}>
                    <strong>Institution:</strong> {image.institution}
                  </Typography>
                </Box>
              </Grid>
            )}

            {image.submissionDate && (
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccessTime fontSize="small" color="action" />
                  <Typography variant="body2" sx={{ fontFamily: 'Europa, sans-serif' }}>
                    <strong>Submitted:</strong> {(() => {
                      try {
                        const date = new Date(image.submissionDate);
                        return date.toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        });
                      } catch (error) {
                        return 'Date not available';
                      }
                    })()}
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>

          {/* Tags */}
          {image.tags && image.tags.length > 0 && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography
                variant="subtitle2"
                sx={{
                  fontFamily: 'Europa, sans-serif',
                  fontWeight: 'medium',
                  mb: 1
                }}
              >
                Tags
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {image.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    size="small"
                    variant="outlined"
                    sx={{ fontFamily: 'Europa, sans-serif' }}
                  />
                ))}
              </Stack>
            </>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ImageLightbox; 
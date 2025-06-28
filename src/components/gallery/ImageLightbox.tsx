import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Chip,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Close as CloseIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Download as DownloadIcon,
  Info as InfoIcon,
  PlayArrow,
  Pause,
  VolumeUp,
  VolumeOff
} from '@mui/icons-material';
import { ImageLightboxProps, PocusImageData } from '../../types/pocus';

// Video detection is now handled by the backend
// and provided via the isVideo property in PocusImageData

const ImageLightbox: React.FC<ImageLightboxProps> = ({
  images,
  initialIndex,
  open,
  onClose
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoMuted, setVideoMuted] = useState(true);
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);

  const currentImage: PocusImageData | undefined = images[currentIndex];

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    if (currentImage) {
      setImageLoading(true);
      setImageError(false);
      setVideoPlaying(false);
      if (videoRef) {
        videoRef.pause();
        videoRef.currentTime = 0;
      }
    }
  }, [currentIndex, currentImage, videoRef]);

  const handleNext = useCallback(() => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, images.length]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowLeft':
        handlePrevious();
        break;
      case 'ArrowRight':
        handleNext();
        break;
      case 'Escape':
        onClose();
        break;
      case 'i':
      case 'I':
        setShowInfo(!showInfo);
        break;
      case ' ':
        event.preventDefault();
        if (currentImage && currentImage.isVideo && videoRef) {
          if (videoPlaying) {
            videoRef.pause();
          } else {
            videoRef.play();
          }
        }
        break;
    }
  }, [handleNext, handlePrevious, onClose, showInfo, currentImage, videoRef, videoPlaying]);

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [open, handleKeyDown]);

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  const handleVideoLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleVideoError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  const handleVideoPlay = () => {
    if (videoRef) {
      videoRef.play();
      setVideoPlaying(true);
    }
  };

  const handleVideoPause = () => {
    if (videoRef) {
      videoRef.pause();
      setVideoPlaying(false);
    }
  };

  const handleVideoTogglePlay = () => {
    if (videoPlaying) {
      handleVideoPause();
    } else {
      handleVideoPlay();
    }
  };

  const handleVideoToggleMute = () => {
    if (videoRef) {
      videoRef.muted = !videoRef.muted;
      setVideoMuted(videoRef.muted);
    }
  };

  const handleDownload = () => {
    if (currentImage?.imageUrl) {
      const link = document.createElement('a');
      link.href = currentImage.imageUrl;
      link.download = `${currentImage.title}${currentImage.isVideo ? '.mp4' : '.jpg'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!currentImage) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          boxShadow: 'none',
          margin: 0,
          maxHeight: '100vh',
          height: '100vh',
          width: '100vw',
          borderRadius: 0
        }
      }}
    >
      <DialogContent
        sx={{
          position: 'relative',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          backgroundColor: 'transparent'
        }}
      >
        {/* Close Button */}
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            color: 'white',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
            '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.7)' }
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Info Toggle Button */}
        <IconButton
          onClick={() => setShowInfo(!showInfo)}
          sx={{
            position: 'absolute',
            top: 16,
            right: 72,
            color: 'white',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
            '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.7)' }
          }}
        >
          <InfoIcon />
        </IconButton>

        {/* Download Button */}
        <IconButton
          onClick={handleDownload}
          sx={{
            position: 'absolute',
            top: 16,
            right: 128,
            color: 'white',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
            '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.7)' }
          }}
        >
          <DownloadIcon />
        </IconButton>

        {/* Video Controls */}
        {currentImage.isVideo && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 80,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: 1,
              zIndex: 1000
            }}
          >
            <IconButton
              onClick={handleVideoTogglePlay}
              sx={{
                color: 'white',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.7)' }
              }}
            >
              {videoPlaying ? <Pause /> : <PlayArrow />}
            </IconButton>
            <IconButton
              onClick={handleVideoToggleMute}
              sx={{
                color: 'white',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.7)' }
              }}
            >
              {videoMuted ? <VolumeOff /> : <VolumeUp />}
            </IconButton>
          </Box>
        )}

        {/* Navigation Buttons */}
        {currentIndex > 0 && (
          <IconButton
            onClick={handlePrevious}
            sx={{
              position: 'absolute',
              left: 16,
              color: 'white',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1000,
              '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.7)' }
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        )}

        {currentIndex < images.length - 1 && (
          <IconButton
            onClick={handleNext}
            sx={{
              position: 'absolute',
              right: 16,
              color: 'white',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1000,
              '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.7)' }
            }}
          >
            <ArrowForwardIcon />
          </IconButton>
        )}

        {/* Main Content */}
        <Box
          sx={{
            position: 'relative',
            maxWidth: '90vw',
            maxHeight: '90vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {imageLoading && (
            <CircularProgress
              sx={{
                position: 'absolute',
                color: 'white'
              }}
            />
          )}

          {imageError ? (
            <Alert severity="error" sx={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
              Failed to load {currentImage.isVideo ? 'video' : 'image'}: {currentImage.title}
            </Alert>
          ) : currentImage.isVideo ? (
            <video
              ref={setVideoRef}
              src={`/api/pocus/video-proxy?url=${encodeURIComponent(currentImage.imageUrl)}`}
              onLoadedData={handleVideoLoad}
              onError={handleVideoError}
              onPlay={() => setVideoPlaying(true)}
              onPause={() => setVideoPlaying(false)}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                display: imageLoading ? 'none' : 'block'
              }}
              controls={false}
              muted={videoMuted}
              poster={currentImage.thumbnailUrl}
            />
          ) : (
            <img
              src={currentImage.imageUrl}
              alt={currentImage.title}
              onLoad={handleImageLoad}
              onError={handleImageError}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                display: imageLoading ? 'none' : 'block'
              }}
            />
          )}
        </Box>

        {/* Image Information Panel */}
        {showInfo && (
          <Paper
            sx={{
              position: 'absolute',
              bottom: 16,
              left: 16,
              right: 16,
              maxWidth: 500,
              margin: 'auto',
              padding: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              zIndex: 1000
            }}
          >
            <Typography variant="h6" gutterBottom>
              {currentImage.title}
            </Typography>
            
            {currentImage.description && (
              <Typography variant="body2" paragraph>
                {currentImage.description}
              </Typography>
            )}

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
              <Chip
                label={currentImage.category}
                color="primary"
                size="small"
              />
              {currentImage.isVideo && (
                <Chip
                  label="Video"
                  color="secondary"
                  size="small"
                />
              )}
              {currentImage.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  variant="outlined"
                  size="small"
                />
              ))}
            </Box>

            {currentImage.contributor && (
              <Typography variant="caption" display="block">
                Contributor: {currentImage.contributor}
              </Typography>
            )}
            
            <Typography variant="caption" display="block" color="text.secondary">
              Submitted: {currentImage.submissionDate.toLocaleDateString()}
            </Typography>
            
            <Typography variant="caption" display="block" color="text.secondary">
              {currentImage.isVideo ? 'Video' : 'Image'} {currentIndex + 1} of {images.length}
            </Typography>
          </Paper>
        )}

        {/* Image Counter */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            color: 'white',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            padding: '4px 12px',
            borderRadius: 1,
            zIndex: 1000
          }}
        >
          <Typography variant="caption">
            {currentIndex + 1} / {images.length}
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ImageLightbox; 
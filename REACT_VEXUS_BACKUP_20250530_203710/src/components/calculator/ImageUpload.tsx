import React, { useState, useRef, useCallback } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { 
  Crop, 
  CheckCircleOutline, 
  ErrorOutline, 
  CloudUpload,
  Refresh,
  Delete
} from '@mui/icons-material';
import Cropper from 'react-cropper';
import { useDropzone } from 'react-dropzone';
import { AIAnalysisResult } from '../../services/aiService';

interface ImageUploadProps {
  veinType: string;
  currentImage: Blob | null;
  onImageUpload: (imageBlob: Blob) => void;
  aiStatus: 'idle' | 'processing' | 'success' | 'error';
  aiResult: AIAnalysisResult | null;
  aiError: string | null;
  onAnalyze: (veinType: string, imageBlob: Blob) => void;
  onClear: (veinType: string) => void;
  isMobile?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  veinType,
  currentImage,
  onImageUpload,
  aiStatus,
  aiResult,
  aiError,
  onAnalyze,
  onClear,
  isMobile = false,
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const cropperRef = useRef<any>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      // Validate file size (limit to 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size too large. Please select an image under 10MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
        setCropDialogOpen(true);
        setCroppedImage(null); // Reset cropped image when new one is uploaded
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp']
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  const handleCrop = () => {
    if (cropperRef.current?.cropper) {
      cropperRef.current.cropper.getCroppedCanvas({
        width: 800,
        height: 600,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high',
      }).toBlob((blob: Blob) => {
        if (blob) {
          const croppedUrl = URL.createObjectURL(blob);
          setCroppedImage(croppedUrl);
          onImageUpload(blob);
          setCropDialogOpen(false);
          
          // Automatically start AI analysis after cropping
          onAnalyze(veinType, blob);
        }
      }, 'image/jpeg', 0.9);
    }
  };

  const handleRecrop = () => {
    if (imageSrc) {
      setCropDialogOpen(true);
    }
  };

  const handleClearImage = () => {
    setImageSrc(null);
    setCroppedImage(null);
    setCropDialogOpen(false);
    onClear(veinType);
    
    // Clean up object URLs to prevent memory leaks
    if (croppedImage) {
      URL.revokeObjectURL(croppedImage);
    }
  };

  const getStatusIcon = () => {
    switch (aiStatus) {
      case 'processing':
        return <CircularProgress size={20} />;
      case 'success':
        return <CheckCircleOutline color="success" />;
      case 'error':
        return <ErrorOutline color="error" />;
      default:
        return <CloudUpload />;
    }
  };

  const getStatusText = () => {
    switch (aiStatus) {
      case 'processing':
        return 'Analyzing image...';
      case 'success':
        return 'AI MODEL READY';
      case 'error':
        return 'Analysis failed';
      default:
        return 'AI MODEL READY';
    }
  };

  const getStatusColor = () => {
    switch (aiStatus) {
      case 'processing':
        return '#2196f3';
      case 'success':
        return '#4caf50';
      case 'error':
        return '#f44336';
      default:
        return '#2196f3';
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 600, margin: '0 auto' }}>
      {/* Status Display */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          p: 2,
          mb: 2,
          backgroundColor: '#f0f8ff',
          border: `1px solid ${getStatusColor()}`,
          borderRadius: 1,
          color: getStatusColor(),
          fontWeight: 600,
        }}
      >
        {getStatusIcon()}
        <Typography variant="body2" sx={{ fontWeight: 'inherit' }}>
          {getStatusText()}
        </Typography>
      </Box>

      {/* Upload Area */}
      {!croppedImage && (
        <Box
          {...getRootProps()}
          sx={{
            border: `2px dashed ${isDragActive ? '#2196f3' : '#ddd'}`,
            borderRadius: 2,
            p: 4,
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: isDragActive ? '#f0f8ff' : '#f8f9fa',
            transition: 'all 0.3s ease',
            mb: 2,
            '&:hover': {
              borderColor: '#2196f3',
              backgroundColor: '#f0f8ff',
            }
          }}
        >
          <input {...getInputProps()} />
          <CloudUpload sx={{ fontSize: 48, color: '#666', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            {isDragActive ? 'Drop the image here' : 'Upload Image'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Drag & drop an ultrasound image, or click to select
          </Typography>
          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
            Supported formats: JPG, PNG, GIF, BMP, WebP (max 10MB)
          </Typography>
        </Box>
      )}

      {/* Cropped Image Preview */}
      {croppedImage && (
        <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Uploaded Image:
          </Typography>
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <img 
              src={croppedImage} 
              alt={`${veinType} cropped`} 
              style={{ 
                maxWidth: '100%', 
                maxHeight: isMobile ? 200 : 300, 
                borderRadius: 8,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }} 
            />
          </Box>
          <Grid container spacing={1} justifyContent="center">
            <Grid item>
              <Button 
                variant="outlined" 
                size="small" 
                onClick={handleRecrop}
                startIcon={<Crop />}
              >
                Re-Crop
              </Button>
            </Grid>
            <Grid item>
              <Button 
                variant="outlined" 
                size="small" 
                onClick={handleClearImage}
                startIcon={<Delete />}
                color="error"
              >
                Clear
              </Button>
            </Grid>
            {aiStatus === 'error' && (
              <Grid item>
                <Button 
                  variant="outlined" 
                  size="small" 
                  onClick={() => currentImage && onAnalyze(veinType, currentImage)}
                  startIcon={<Refresh />}
                >
                  Retry Analysis
                </Button>
              </Grid>
            )}
          </Grid>
        </Paper>
      )}
      
      {/* AI Results */}
      {aiResult && aiStatus === 'success' && (
        <Alert 
          severity="success" 
          icon={<CheckCircleOutline />}
          sx={{ mb: 2 }}
        >
          <Typography variant="subtitle2" gutterBottom>
            AI Analysis Complete
          </Typography>
          <Typography variant="body2">
            Classification: <strong>{aiResult.classification}</strong>
          </Typography>
          <Typography variant="body2">
            Score: <strong>{aiResult.score}</strong> points
          </Typography>
          <Typography variant="body2">
            Confidence: <strong>{(aiResult.confidence * 100).toFixed(1)}%</strong>
          </Typography>
        </Alert>
      )}

      {/* Error Display */}
      {aiError && aiStatus === 'error' && (
        <Alert 
          severity="error" 
          icon={<ErrorOutline />}
          sx={{ mb: 2 }}
        >
          <Typography variant="subtitle2" gutterBottom>
            AI Analysis Failed
          </Typography>
          <Typography variant="body2">
            {aiError}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Please try uploading a different image or set the score manually.
          </Typography>
        </Alert>
      )}

      {/* Crop Dialog */}
      <Dialog 
        open={cropDialogOpen} 
        onClose={() => setCropDialogOpen(false)}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          Crop Image - {veinType.charAt(0).toUpperCase() + veinType.slice(1)} Vein
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Crop the image to include only the PWD waveform and EKG lead for best AI analysis results.
          </Typography>
          {imageSrc && (
            <Cropper
              ref={cropperRef}
              src={imageSrc}
              style={{ height: isMobile ? 300 : 400, width: '100%' }}
              aspectRatio={4 / 3}
              guides={true}
              viewMode={1}
              responsive={true}
              autoCropArea={0.8}
              checkOrientation={false}
              cropBoxResizable={true}
              toggleDragModeOnDblclick={false}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setCropDialogOpen(false)}
            color="inherit"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCrop} 
            variant="contained"
            startIcon={<Crop />}
          >
            Crop & Analyze
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ImageUpload; 
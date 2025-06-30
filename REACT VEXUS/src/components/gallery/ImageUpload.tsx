import React, { useState, useCallback, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  Alert,
  IconButton,
  Paper,
  Grid,
  Chip,
  Stack,
  Divider,
} from '@mui/material';
import {
  Close,
  CloudUpload,
  Image as ImageIcon,
  CheckCircle,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { imageUploadService, UploadProgress, UploadResponse } from '../../services/imageUploadService';
import { ImageSubmissionData } from '../../services/airtableService';

interface ImageUploadProps {
  open: boolean;
  onClose: () => void;
  onUploadSuccess?: (response: UploadResponse) => void;
}

interface FormData {
  title: string;
  description: string;
  email: string;
  institution: string;
  veinType: 'hepatic' | 'portal' | 'renal';
  quality: 'high' | 'medium' | 'low';
  clinicalContext: string;
  vexusGrade: '0' | '1' | '2' | '3' | '';
  waveform: 'normal' | 'abnormal' | 'reversal' | 'pulsatile' | '';
}

const ImageUpload: React.FC<ImageUploadProps> = ({ open, onClose, onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    email: '',
    institution: '',
    veinType: 'hepatic',
    quality: 'high',
    clinicalContext: '',
    vexusGrade: '',
    waveform: '',
  });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((file: File) => {
    const validation = imageUploadService.validateImage(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    setSelectedFile(file);
    setError(null);
    
    // Auto-generate title if empty
    if (!formData.title) {
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
      setFormData(prev => ({
        ...prev,
        title: nameWithoutExt.replace(/[_-]/g, ' ')
      }));
    }
  }, [formData.title]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleFormChange = useCallback((field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  }, []);

  const validateForm = (): boolean => {
    if (!selectedFile) {
      setError('Please select an image file');
      return false;
    }

    if (!formData.title.trim()) {
      setError('Please enter a title');
      return false;
    }

    if (!formData.description.trim()) {
      setError('Please enter a description');
      return false;
    }

    if (!formData.email.trim()) {
      setError('Please enter your email');
      return false;
    }

    if (!formData.institution.trim()) {
      setError('Please enter your institution');
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !selectedFile) return;

    setUploading(true);
    setError(null);
    setUploadProgress(null);

    try {
      const submissionData: ImageSubmissionData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        email: formData.email.trim(),
        institution: formData.institution.trim(),
        veinType: formData.veinType,
        quality: formData.quality,
        imageFile: selectedFile,
        clinicalContext: formData.clinicalContext.trim() || undefined,
        vexusGrade: formData.vexusGrade || undefined,
        waveform: formData.waveform || undefined,
      };

      const response = await imageUploadService.uploadImageWithProgress(
        submissionData,
        (progress) => setUploadProgress(progress)
      );

      if (response.success) {
        setSuccess(true);
        onUploadSuccess?.(response);
        
        // Reset form after success
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        setError(response.error || 'Upload failed');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    if (!uploading) {
      setSelectedFile(null);
      setFormData({
        title: '',
        description: '',
        email: '',
        institution: '',
        veinType: 'hepatic',
        quality: 'high',
        clinicalContext: '',
        vexusGrade: '',
        waveform: '',
      });
      setError(null);
      setSuccess(false);
      setUploadProgress(null);
      onClose();
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '90vh',
        }
      }}
    >
      <DialogTitle 
        component="h1"
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          pb: 1,
          borderBottom: '1px solid #dee2e6',
          fontFamily: 'system-ui, -apple-system, sans-serif', 
          fontWeight: 600,
          color: '#212529',
          fontSize: '1.25rem'
        }}
      >
        Upload VEXUS Image
        <IconButton onClick={handleClose} disabled={uploading} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {success ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CheckCircle sx={{ fontSize: 64, color: '#28a745', mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#28a745', mb: 1 }}>
              Upload Successful!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your image has been submitted for review. Thank you for contributing to VEXUS Atlas.
            </Typography>
          </Box>
        ) : (
          <Stack spacing={3}>
            {/* File Upload Area */}
            <Paper
              sx={{
                border: selectedFile ? '2px solid #28a745' : '2px dashed #dee2e6',
                borderRadius: 2,
                p: 3,
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: selectedFile ? '#28a745' : '#6c757d',
                  bgcolor: '#f8f9fa'
                }
              }}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                style={{ display: 'none' }}
              />
              
              {selectedFile ? (
                <Stack spacing={2} alignItems="center">
                  <CheckCircle sx={{ fontSize: 48, color: '#28a745' }} />
                  <Typography variant="h6" color="#28a745">
                    {selectedFile.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatFileSize(selectedFile.size)} • Click to change
                  </Typography>
                </Stack>
              ) : (
                <Stack spacing={2} alignItems="center">
                  <CloudUpload sx={{ fontSize: 48, color: '#6c757d' }} />
                  <Typography variant="h6" color="text.secondary">
                    Drop your image here
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    or click to browse • Max 5MB • JPEG, PNG, WebP
                  </Typography>
                </Stack>
              )}
            </Paper>

            {/* Form Fields */}
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Title"
                  value={formData.title}
                  onChange={(e) => handleFormChange('title', e.target.value)}
                  placeholder="e.g., Normal Hepatic Vein Flow Pattern"
                  required
                  disabled={uploading}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  value={formData.description}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  placeholder="Detailed description of the ultrasound findings..."
                  multiline
                  rows={3}
                  required
                  disabled={uploading}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Your Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleFormChange('email', e.target.value)}
                  required
                  disabled={uploading}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Institution"
                  value={formData.institution}
                  onChange={(e) => handleFormChange('institution', e.target.value)}
                  placeholder="Hospital or Medical Center"
                  required
                  disabled={uploading}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Vein Type</InputLabel>
                  <Select
                    value={formData.veinType}
                    label="Vein Type"
                    onChange={(e) => handleFormChange('veinType', e.target.value)}
                    disabled={uploading}
                  >
                    <MenuItem value="hepatic">Hepatic Vein</MenuItem>
                    <MenuItem value="portal">Portal Vein</MenuItem>
                    <MenuItem value="renal">Renal Vein</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Image Quality</InputLabel>
                  <Select
                    value={formData.quality}
                    label="Image Quality"
                    onChange={(e) => handleFormChange('quality', e.target.value)}
                    disabled={uploading}
                  >
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="low">Low</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>VEXUS Grade (Optional)</InputLabel>
                  <Select
                    value={formData.vexusGrade}
                    label="VEXUS Grade (Optional)"
                    onChange={(e) => handleFormChange('vexusGrade', e.target.value)}
                    disabled={uploading}
                  >
                    <MenuItem value="">Not Specified</MenuItem>
                    <MenuItem value="0">Grade 0</MenuItem>
                    <MenuItem value="1">Grade 1</MenuItem>
                    <MenuItem value="2">Grade 2</MenuItem>
                    <MenuItem value="3">Grade 3</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Waveform (Optional)</InputLabel>
                  <Select
                    value={formData.waveform}
                    label="Waveform (Optional)"
                    onChange={(e) => handleFormChange('waveform', e.target.value)}
                    disabled={uploading}
                  >
                    <MenuItem value="">Not Specified</MenuItem>
                    <MenuItem value="normal">Normal</MenuItem>
                    <MenuItem value="abnormal">Abnormal</MenuItem>
                    <MenuItem value="reversal">Reversal</MenuItem>
                    <MenuItem value="pulsatile">Pulsatile</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Clinical Context (Optional)"
                  value={formData.clinicalContext}
                  onChange={(e) => handleFormChange('clinicalContext', e.target.value)}
                  placeholder="Patient condition, clinical setting, relevant history..."
                  multiline
                  rows={2}
                  disabled={uploading}
                />
              </Grid>
            </Grid>

            {/* Upload Progress */}
            {uploading && uploadProgress && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Uploading...</Typography>
                  <Typography variant="body2">{uploadProgress.percentage}%</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={uploadProgress.percentage} 
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            )}

            {/* Error Message */}
            {error && (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            {/* Info Message */}
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              <Typography variant="body2">
                Images are reviewed before publication. You'll be notified when your submission is approved.
              </Typography>
            </Alert>
          </Stack>
        )}
      </DialogContent>

      {!success && (
        <DialogActions sx={{ p: 3, pt: 0, borderTop: '1px solid #dee2e6' }}>
          <Button 
            onClick={handleClose} 
            disabled={uploading}
            sx={{ color: '#6c757d' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            variant="contained"
            disabled={uploading || !selectedFile}
            sx={{
              bgcolor: '#495057',
              '&:hover': { bgcolor: '#343a40' },
              color: 'white',
              fontWeight: 500
            }}
          >
            {uploading ? 'Uploading...' : 'Upload Image'}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default ImageUpload; 
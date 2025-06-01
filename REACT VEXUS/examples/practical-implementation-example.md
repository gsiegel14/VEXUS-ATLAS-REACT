# Practical Implementation Example: VEXUS Image Upload Component

This example demonstrates how to implement a complete React MUI component following all core development principles.

## Complete Implementation with All Core Tenets

### 1. Main Component with Modular Architecture

```jsx
// src/components/atlas/ImageUpload/ImageUpload.jsx
import React, { useState, useCallback } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
  Box,
  Alert
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';

// Core utilities and services
import { logger } from '../../../utils/logger';
import { useErrorHandler } from '../../../hooks/useErrorHandler';
import { usePerformanceMonitor } from '../../../hooks/usePerformanceMonitor';
import { atlasService } from '../../../services/atlasService';
import { ImageProcessingError, ValidationError } from '../../../utils/errors';
import { componentConfig } from '../../../config/componentConfig';

// Child components
import FileDropzone from './FileDropzone';
import ImagePreview from './ImagePreview';
import MetadataForm from './MetadataForm';
import UploadProgress from './UploadProgress';
import ErrorDisplay from '../../common/ErrorDisplay/ErrorDisplay';

const ImageUpload = ({ 
  onUploadComplete, 
  onUploadError,
  maxFileSize = 10 * 1024 * 1024, // 10MB
  acceptedFormats = ['image/jpeg', 'image/png', 'image/webp'],
  className,
  ...props 
}) => {
  // Performance monitoring
  const { measureFunction } = usePerformanceMonitor('ImageUpload');
  
  // Error handling
  const { errors, addError, removeError, clearErrors, handleAsyncError } = useErrorHandler();
  
  // Component state
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [metadata, setMetadata] = useState({
    category: '',
    vexusGrade: '',
    description: '',
    tags: []
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);

  // File selection handler with comprehensive validation and error handling
  const handleFileSelect = useCallback(measureFunction('handleFileSelect', async (file) => {
    try {
      logger.info('ImageUpload: File selected', { 
        filename: file.name, 
        size: file.size, 
        type: file.type 
      });

      clearErrors();

      // Validate file size
      if (file.size > maxFileSize) {
        throw new ValidationError(
          'fileSize', 
          file.size, 
          `File size must be less than ${maxFileSize / 1024 / 1024}MB`
        );
      }

      // Validate file format
      if (!acceptedFormats.includes(file.type)) {
        throw new ValidationError(
          'fileType', 
          file.type, 
          `File must be one of: ${acceptedFormats.join(', ')}`
        );
      }

      // Generate preview
      const preview = await generateImagePreview(file);
      
      setSelectedFile(file);
      setImagePreview(preview);
      setUploadComplete(false);

      logger.info('ImageUpload: File validation successful', { filename: file.name });

    } catch (error) {
      logger.error('ImageUpload: File selection failed', { 
        error: error.message,
        filename: file?.name,
        stack: error.stack 
      });
      
      addError(error, { component: 'ImageUpload', action: 'fileSelect' });
      
      // Reset state on error
      setSelectedFile(null);
      setImagePreview(null);
    }
  }), [maxFileSize, acceptedFormats, addError, clearErrors, measureFunction]);

  // Image preview generation with error handling
  const generateImagePreview = useCallback(measureFunction('generateImagePreview', (file) => {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        
        reader.onload = (e) => {
          logger.debug('ImageUpload: Preview generated successfully');
          resolve(e.target.result);
        };
        
        reader.onerror = () => {
          const error = new ImageProcessingError('Failed to generate image preview', {
            filename: file.name,
            size: file.size
          });
          logger.error('ImageUpload: Preview generation failed', { error: error.message });
          reject(error);
        };

        reader.readAsDataURL(file);
      } catch (error) {
        reject(new ImageProcessingError('Preview generation error', { 
          filename: file.name,
          error: error.message 
        }));
      }
    });
  }), [measureFunction]);

  // Metadata change handler with validation
  const handleMetadataChange = useCallback(measureFunction('handleMetadataChange', (field, value) => {
    logger.debug('ImageUpload: Metadata updated', { field, value });
    
    setMetadata(prev => ({
      ...prev,
      [field]: value
    }));

    // Real-time validation
    if (field === 'category' && !value) {
      addError(new ValidationError('category', value, 'Category is required'), {
        component: 'ImageUpload',
        action: 'metadataValidation'
      });
    }
  }), [addError, measureFunction]);

  // Upload handler with progress tracking and comprehensive error handling
  const handleUpload = useCallback(measureFunction('handleUpload', async () => {
    if (!selectedFile) {
      const error = new ValidationError('file', null, 'No file selected');
      addError(error);
      return;
    }

    // Validate metadata
    if (!metadata.category) {
      const error = new ValidationError('category', metadata.category, 'Category is required');
      addError(error);
      return;
    }

    if (!metadata.vexusGrade) {
      const error = new ValidationError('vexusGrade', metadata.vexusGrade, 'VEXUS grade is required');
      addError(error);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    clearErrors();

    try {
      logger.info('ImageUpload: Starting upload', { 
        filename: selectedFile.name,
        metadata 
      });

      // Simulate progress updates (in real implementation, this would come from upload service)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = Math.min(prev + 10, 90);
          logger.debug('ImageUpload: Upload progress', { progress: newProgress });
          return newProgress;
        });
      }, 200);

      const result = await handleAsyncError(async () => {
        return await atlasService.uploadImage({
          file: selectedFile,
          filename: selectedFile.name,
          metadata: {
            ...metadata,
            uploadTimestamp: new Date().toISOString(),
            originalSize: selectedFile.size,
            originalType: selectedFile.type
          }
        });
      }, { component: 'ImageUpload', action: 'upload' });

      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadComplete(true);
      setIsUploading(false);

      logger.info('ImageUpload: Upload completed successfully', { 
        imageId: result.id,
        filename: selectedFile.name 
      });

      // Notify parent component
      if (onUploadComplete) {
        onUploadComplete(result);
      }

      // Reset form after successful upload
      setTimeout(() => {
        resetForm();
      }, 2000);

    } catch (error) {
      setIsUploading(false);
      setUploadProgress(0);
      
      logger.error('ImageUpload: Upload failed', { 
        error: error.message,
        filename: selectedFile.name,
        metadata,
        stack: error.stack 
      });

      if (onUploadError) {
        onUploadError(error);
      }
    }
  }), [selectedFile, metadata, addError, clearErrors, handleAsyncError, onUploadComplete, onUploadError, measureFunction]);

  // Form reset with cleanup
  const resetForm = useCallback(measureFunction('resetForm', () => {
    logger.debug('ImageUpload: Resetting form');
    
    setSelectedFile(null);
    setImagePreview(null);
    setMetadata({
      category: '',
      vexusGrade: '',
      description: '',
      tags: []
    });
    setUploadProgress(0);
    setIsUploading(false);
    setUploadComplete(false);
    clearErrors();
  }), [clearErrors, measureFunction]);

  // Render component with comprehensive error handling
  return (
    <Card 
      className={className}
      sx={{ 
        ...componentConfig.layout,
        position: 'relative',
        opacity: isUploading ? 0.8 : 1,
        transition: `opacity ${componentConfig.animations.duration}ms ${componentConfig.animations.easing}`
      }}
      {...props}
    >
      <CardContent>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <CloudUpload sx={{ mr: 2, color: 'primary.main' }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Upload VEXUS Image
          </Typography>
        </Box>

        {/* Error Display */}
        <ErrorDisplay 
          errors={errors}
          onDismiss={removeError}
          variant="inline"
        />

        {/* Upload Progress */}
        {isUploading && (
          <UploadProgress 
            progress={uploadProgress}
            filename={selectedFile?.name}
          />
        )}

        {/* Success Message */}
        {uploadComplete && (
          <Alert severity="success" sx={{ mb: 3 }}>
            <Typography variant="body2">
              Image uploaded successfully! 
              {selectedFile && ` "${selectedFile.name}" has been added to the atlas.`}
            </Typography>
          </Alert>
        )}

        {/* File Selection */}
        {!selectedFile && !isUploading && (
          <FileDropzone
            onFileSelect={handleFileSelect}
            acceptedFormats={acceptedFormats}
            maxFileSize={maxFileSize}
            disabled={isUploading}
          />
        )}

        {/* Image Preview and Metadata Form */}
        {selectedFile && imagePreview && !uploadComplete && (
          <Box>
            <ImagePreview
              file={selectedFile}
              preview={imagePreview}
              onRemove={resetForm}
            />

            <MetadataForm
              metadata={metadata}
              onChange={handleMetadataChange}
              disabled={isUploading}
            />

            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Button
                variant="contained"
                onClick={handleUpload}
                disabled={isUploading || !metadata.category || !metadata.vexusGrade}
                sx={{ flex: 1 }}
              >
                {isUploading ? 'Uploading...' : 'Upload Image'}
              </Button>
              
              <Button
                variant="outlined"
                onClick={resetForm}
                disabled={isUploading}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        )}

        {/* Start Over Button */}
        {uploadComplete && (
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Button
              variant="outlined"
              onClick={resetForm}
            >
              Upload Another Image
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageUpload;
```

### 2. Child Component with Error Handling

```jsx
// src/components/atlas/ImageUpload/FileDropzone.jsx
import React, { useCallback, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button
} from '@mui/material';
import { CloudUpload, Error } from '@mui/icons-material';
import { logger } from '../../../utils/logger';
import { ValidationError } from '../../../utils/errors';
import { componentConfig } from '../../../config/componentConfig';

const FileDropzone = ({ 
  onFileSelect, 
  acceptedFormats, 
  maxFileSize,
  disabled = false 
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragError, setDragError] = useState(null);

  // File validation helper
  const validateFile = useCallback((file) => {
    logger.debug('FileDropzone: Validating file', { 
      name: file.name, 
      size: file.size, 
      type: file.type 
    });

    if (file.size > maxFileSize) {
      throw new ValidationError(
        'fileSize',
        file.size,
        `File size must be less than ${Math.round(maxFileSize / 1024 / 1024)}MB`
      );
    }

    if (!acceptedFormats.includes(file.type)) {
      throw new ValidationError(
        'fileType',
        file.type,
        `File must be one of: ${acceptedFormats.join(', ')}`
      );
    }

    return true;
  }, [maxFileSize, acceptedFormats]);

  // Drag handlers with error handling
  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (disabled) return;
    
    setIsDragOver(true);
    setDragError(null);
    
    logger.debug('FileDropzone: Drag enter');
  }, [disabled]);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (disabled) return;
    
    setIsDragOver(false);
    setDragError(null);
    
    logger.debug('FileDropzone: Drag leave');
  }, [disabled]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (disabled) return;
    
    setIsDragOver(false);
    setDragError(null);

    const files = Array.from(e.dataTransfer.files);
    
    logger.debug('FileDropzone: Files dropped', { count: files.length });

    if (files.length === 0) {
      logger.warn('FileDropzone: No files dropped');
      return;
    }

    if (files.length > 1) {
      const error = new ValidationError('fileCount', files.length, 'Please select only one file');
      setDragError(error.message);
      logger.warn('FileDropzone: Multiple files dropped', { count: files.length });
      return;
    }

    const file = files[0];

    try {
      validateFile(file);
      onFileSelect(file);
      logger.info('FileDropzone: File accepted via drop', { filename: file.name });
    } catch (error) {
      setDragError(error.message);
      logger.error('FileDropzone: File validation failed on drop', { 
        error: error.message,
        filename: file.name 
      });
    }
  }, [disabled, validateFile, onFileSelect]);

  // File input handler
  const handleFileInputChange = useCallback((e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;
    
    const file = files[0];
    
    logger.debug('FileDropzone: File selected via input', { filename: file.name });

    try {
      validateFile(file);
      onFileSelect(file);
      setDragError(null);
      
      logger.info('FileDropzone: File accepted via input', { filename: file.name });
    } catch (error) {
      setDragError(error.message);
      logger.error('FileDropzone: File validation failed on input', { 
        error: error.message,
        filename: file.name 
      });
    }

    // Reset input
    e.target.value = '';
  }, [validateFile, onFileSelect]);

  return (
    <Paper
      elevation={isDragOver ? 4 : 1}
      sx={{
        p: 4,
        border: `2px dashed ${
          dragError 
            ? componentConfig.theme.error
            : isDragOver 
              ? componentConfig.theme.primary 
              : 'transparent'
        }`,
        backgroundColor: dragError 
          ? 'error.50' 
          : isDragOver 
            ? 'primary.50' 
            : 'grey.50',
        textAlign: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: `all ${componentConfig.animations.duration}ms ${componentConfig.animations.easing}`,
        '&:hover': disabled ? {} : {
          backgroundColor: 'primary.50',
          borderColor: componentConfig.theme.primary
        }
      }}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {dragError ? (
        <Box>
          <Error sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />
          <Typography variant="h6" color="error.main" gutterBottom>
            Invalid File
          </Typography>
          <Typography variant="body2" color="error.main">
            {dragError}
          </Typography>
        </Box>
      ) : (
        <Box>
          <CloudUpload 
            sx={{ 
              fontSize: 48, 
              color: isDragOver ? 'primary.main' : 'text.secondary',
              mb: 2 
            }} 
          />
          
          <Typography variant="h6" gutterBottom>
            {isDragOver ? 'Drop file here' : 'Upload VEXUS Image'}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" paragraph>
            Drag and drop your image here, or click to select
          </Typography>
          
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
            Accepted formats: {acceptedFormats.map(format => format.split('/')[1]).join(', ')}
            <br />
            Maximum size: {Math.round(maxFileSize / 1024 / 1024)}MB
          </Typography>

          <input
            type="file"
            accept={acceptedFormats.join(',')}
            onChange={handleFileInputChange}
            style={{ display: 'none' }}
            id="file-upload-input"
            disabled={disabled}
          />
          
          <label htmlFor="file-upload-input">
            <Button
              component="span"
              variant="contained"
              disabled={disabled}
              sx={{ mt: 1 }}
            >
              Select File
            </Button>
          </label>
        </Box>
      )}
    </Paper>
  );
};

export default FileDropzone;
```

### 3. Custom Service with Full Error Handling

```jsx
// src/services/atlasService.js
import BaseService from './BaseService';
import { logger } from '../utils/logger';
import { APIError, ImageProcessingError } from '../utils/errors';

class AtlasService extends BaseService {
  constructor() {
    super(process.env.REACT_APP_API_BASE_URL || '/api');
  }

  async uploadImage(imageData) {
    const operationId = Math.random().toString(36).substr(2, 9);
    
    try {
      logger.info(`AtlasService: Starting image upload [${operationId}]`, { 
        filename: imageData.filename,
        size: imageData.file?.size,
        metadataKeys: Object.keys(imageData.metadata || {})
      });

      // Validate input data
      if (!imageData.file) {
        throw new ValidationError('file', null, 'File is required for upload');
      }

      if (!imageData.metadata?.category) {
        throw new ValidationError('category', imageData.metadata?.category, 'Category is required');
      }

      // Prepare form data
      const formData = new FormData();
      formData.append('image', imageData.file);
      formData.append('metadata', JSON.stringify({
        ...imageData.metadata,
        uploadId: operationId,
        clientTimestamp: new Date().toISOString()
      }));

      // Upload with progress tracking
      const result = await this.request('/atlas/images', {
        method: 'POST',
        body: formData,
        headers: {}, // Let browser set content-type for FormData
        timeout: 30000 // 30 second timeout
      });

      logger.info(`AtlasService: Upload completed successfully [${operationId}]`, { 
        imageId: result.id,
        filename: imageData.filename,
        processingTime: result.processingTime 
      });

      return {
        ...result,
        operationId
      };

    } catch (error) {
      logger.error(`AtlasService: Upload failed [${operationId}]`, {
        error: error.message,
        filename: imageData.filename,
        stack: error.stack,
        metadata: imageData.metadata
      });

      // Transform API errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new APIError(0, 'Network connection failed', '/atlas/images');
      }

      if (error.message.includes('timeout')) {
        throw new APIError(408, 'Upload timeout - please try again', '/atlas/images');
      }

      if (error.message.includes('413')) {
        throw new ImageProcessingError('File too large', { 
          filename: imageData.filename,
          size: imageData.file?.size 
        });
      }

      // Re-throw as appropriate error type
      if (error instanceof APIError || error instanceof ImageProcessingError) {
        throw error;
      }

      throw new APIError(500, `Upload failed: ${error.message}`, '/atlas/images');
    }
  }

  async fetchImages(filters = {}) {
    const operationId = Math.random().toString(36).substr(2, 9);
    
    try {
      logger.info(`AtlasService: Fetching images [${operationId}]`, { filters });
      
      const images = await this.get('/atlas/images', filters);
      
      logger.info(`AtlasService: Successfully fetched images [${operationId}]`, { 
        count: images.length,
        filters 
      });
      
      return images.map(image => ({
        ...image,
        fetchedAt: new Date().toISOString()
      }));

    } catch (error) {
      logger.error(`AtlasService: Failed to fetch images [${operationId}]`, {
        error: error.message,
        filters,
        stack: error.stack
      });
      
      throw new APIError(
        error.status || 500, 
        `Failed to fetch images: ${error.message}`,
        '/atlas/images'
      );
    }
  }
}

export const atlasService = new AtlasService();
```

### 4. Configuration Management

```jsx
// src/config/atlasConfig.js
import { componentConfig } from './componentConfig';

export const atlasConfig = {
  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    acceptedFormats: ['image/jpeg', 'image/png', 'image/webp'],
    timeout: 30000, // 30 seconds
    retryAttempts: 3,
    retryDelay: 1000 // 1 second
  },
  
  validation: {
    requiredFields: ['category', 'vexusGrade'],
    categoryOptions: [
      { value: 'hepatic', label: 'Hepatic Vein' },
      { value: 'portal', label: 'Portal Vein' },
      { value: 'renal', label: 'Renal Vein' },
      { value: 'ivc', label: 'IVC Assessment' }
    ],
    vexusGradeOptions: [
      { value: '0', label: 'Grade 0 (Normal)' },
      { value: '1', label: 'Grade 1 (Mild)' },
      { value: '2', label: 'Grade 2 (Moderate)' },
      { value: '3', label: 'Grade 3 (Severe)' }
    ]
  },
  
  ui: {
    ...componentConfig,
    upload: {
      dropzoneHeight: 200,
      previewMaxHeight: 300,
      progressBarHeight: 8
    }
  },
  
  logging: {
    enablePerformanceMonitoring: true,
    enableUserActionTracking: true,
    logLevel: process.env.NODE_ENV === 'development' ? 'debug' : 'info'
  }
};
```

### 5. Testing Implementation

```jsx
// src/components/atlas/ImageUpload/__tests__/ImageUpload.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ImageUpload from '../ImageUpload';
import { atlasService } from '../../../services/atlasService';
import { logger } from '../../../utils/logger';

// Mock dependencies
jest.mock('../../../services/atlasService');
jest.mock('../../../utils/logger');

const theme = createTheme();

const TestWrapper = ({ children }) => (
  <ThemeProvider theme={theme}>
    {children}
  </ThemeProvider>
);

describe('ImageUpload Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    logger.info.mockImplementation(() => {});
    logger.error.mockImplementation(() => {});
    logger.debug.mockImplementation(() => {});
  });

  test('renders upload interface correctly', () => {
    render(
      <TestWrapper>
        <ImageUpload />
      </TestWrapper>
    );

    expect(screen.getByText('Upload VEXUS Image')).toBeInTheDocument();
    expect(screen.getByText('Drag and drop your image here, or click to select')).toBeInTheDocument();
  });

  test('handles file selection with validation', async () => {
    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    
    render(
      <TestWrapper>
        <ImageUpload />
      </TestWrapper>
    );

    const fileInput = screen.getByLabelText(/select file/i);
    
    // Simulate file selection
    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    await waitFor(() => {
      expect(logger.info).toHaveBeenCalledWith(
        'ImageUpload: File selected',
        expect.objectContaining({
          filename: 'test.jpg',
          type: 'image/jpeg'
        })
      );
    });
  });

  test('handles upload errors gracefully', async () => {
    const mockError = new Error('Upload failed');
    atlasService.uploadImage.mockRejectedValue(mockError);

    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    
    render(
      <TestWrapper>
        <ImageUpload />
      </TestWrapper>
    );

    // Simulate file selection and upload
    const fileInput = screen.getByLabelText(/select file/i);
    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    await waitFor(() => {
      expect(screen.getByText('Upload Image')).toBeInTheDocument();
    });

    // Try to upload
    const uploadButton = screen.getByText('Upload Image');
    fireEvent.click(uploadButton);

    await waitFor(() => {
      expect(logger.error).toHaveBeenCalledWith(
        'ImageUpload: Upload failed',
        expect.objectContaining({
          error: 'Upload failed'
        })
      );
    });
  });

  test('validates required metadata fields', async () => {
    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    
    render(
      <TestWrapper>
        <ImageUpload />
      </TestWrapper>
    );

    // Select file
    const fileInput = screen.getByLabelText(/select file/i);
    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    await waitFor(() => {
      const uploadButton = screen.getByText('Upload Image');
      expect(uploadButton).toBeDisabled(); // Should be disabled without metadata
    });
  });

  test('logs performance metrics', async () => {
    render(
      <TestWrapper>
        <ImageUpload />
      </TestWrapper>
    );

    // Verify performance monitoring is active
    expect(logger.debug).toHaveBeenCalledWith(
      expect.stringContaining('Performance: ImageUpload render'),
      expect.any(Object)
    );
  });
});
```

## Summary of Implementation Principles

This practical example demonstrates:

### ✅ **Modular Architecture**
- Clean component separation and imports
- Feature-based organization
- Reusable child components

### ✅ **Easy Editing & Maintainability**
- Configuration-driven behavior
- Clear prop interfaces
- Centralized styling

### ✅ **Well-Organized Code Structure**
- Service layer abstraction
- Custom hooks for logic
- Clear file organization

### ✅ **Comprehensive Error Logging**
- Operation tracking with IDs
- Contextual log information
- Performance metrics

### ✅ **Robust Error Handling**
- Custom error classes
- Graceful degradation
- User-friendly error messages

### ✅ **Advanced Debugging Capabilities**
- Performance monitoring
- State tracking
- Comprehensive test coverage

### ✅ **Efficient Troubleshooting Support**
- Detailed error context
- Operation traceability
- Clear error recovery paths

This implementation ensures every component is maintainable, debuggable, and resilient to errors while following React and MUI best practices. 
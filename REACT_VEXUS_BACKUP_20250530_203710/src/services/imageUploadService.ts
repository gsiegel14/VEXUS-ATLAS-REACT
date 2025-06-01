// Image Upload Service for VEXUS Atlas
import { ImageSubmissionData, VexusImageData } from './airtableService';

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadResponse {
  success: boolean;
  imageUrl?: string;
  thumbnailUrl?: string;
  recordId?: string;
  error?: string;
}

class ImageUploadService {
  private apiBaseUrl: string;

  constructor() {
    this.apiBaseUrl = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:3001/api';
  }

  /**
   * Validate image file before upload
   */
  validateImage(file: File): { valid: boolean; error?: string } {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Invalid file type. Please upload a JPEG, PNG, or WebP image.'
      };
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'File size too large. Maximum size is 5MB.'
      };
    }

    return { valid: true };
  }

  /**
   * Upload image with progress tracking
   */
  async uploadImage(
    submissionData: ImageSubmissionData,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadResponse> {
    try {
      // Validate image first
      const validation = this.validateImage(submissionData.imageFile);
      if (!validation.valid) {
        return {
          success: false,
          error: validation.error
        };
      }

      // Create form data
      const formData = new FormData();
      formData.append('image', submissionData.imageFile);
      formData.append('title', submissionData.title);
      formData.append('description', submissionData.description);
      formData.append('email', submissionData.email);
      formData.append('institution', submissionData.institution);
      formData.append('veinType', submissionData.veinType);
      
      if (submissionData.quality) {
        formData.append('quality', submissionData.quality);
      }
      if (submissionData.clinicalContext) {
        formData.append('clinicalContext', submissionData.clinicalContext);
      }
      if (submissionData.vexusGrade) {
        formData.append('vexusGrade', submissionData.vexusGrade);
      }
      if (submissionData.waveform) {
        formData.append('waveform', submissionData.waveform);
      }

      // Create upload request with progress tracking
      const response = await fetch(`${this.apiBaseUrl}/images/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Upload failed with status ${response.status}`);
      }

      const result = await response.json();
      
      return {
        success: true,
        imageUrl: result.imageUrl,
        thumbnailUrl: result.thumbnailUrl,
        recordId: result.recordId
      };

    } catch (error) {
      console.error('Image upload failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed'
      };
    }
  }

  /**
   * Upload image with XMLHttpRequest for progress tracking
   */
  uploadImageWithProgress(
    submissionData: ImageSubmissionData,
    onProgress: (progress: UploadProgress) => void
  ): Promise<UploadResponse> {
    return new Promise((resolve) => {
      const validation = this.validateImage(submissionData.imageFile);
      if (!validation.valid) {
        resolve({
          success: false,
          error: validation.error
        });
        return;
      }

      const xhr = new XMLHttpRequest();
      const formData = new FormData();

      // Prepare form data
      formData.append('image', submissionData.imageFile);
      formData.append('title', submissionData.title);
      formData.append('description', submissionData.description);
      formData.append('email', submissionData.email);
      formData.append('institution', submissionData.institution);
      formData.append('veinType', submissionData.veinType);
      
      if (submissionData.quality) formData.append('quality', submissionData.quality);
      if (submissionData.clinicalContext) formData.append('clinicalContext', submissionData.clinicalContext);
      if (submissionData.vexusGrade) formData.append('vexusGrade', submissionData.vexusGrade);
      if (submissionData.waveform) formData.append('waveform', submissionData.waveform);

      // Progress tracking
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress: UploadProgress = {
            loaded: event.loaded,
            total: event.total,
            percentage: Math.round((event.loaded / event.total) * 100)
          };
          onProgress(progress);
        }
      });

      // Handle completion
      xhr.addEventListener('load', () => {
        try {
          if (xhr.status >= 200 && xhr.status < 300) {
            const result = JSON.parse(xhr.responseText);
            resolve({
              success: true,
              imageUrl: result.imageUrl,
              thumbnailUrl: result.thumbnailUrl,
              recordId: result.recordId
            });
          } else {
            const errorData = JSON.parse(xhr.responseText || '{}');
            resolve({
              success: false,
              error: errorData.message || `Upload failed with status ${xhr.status}`
            });
          }
        } catch (error) {
          resolve({
            success: false,
            error: 'Failed to parse server response'
          });
        }
      });

      // Handle errors
      xhr.addEventListener('error', () => {
        resolve({
          success: false,
          error: 'Network error during upload'
        });
      });

      // Handle timeouts
      xhr.addEventListener('timeout', () => {
        resolve({
          success: false,
          error: 'Upload timeout'
        });
      });

      // Configure and send request
      xhr.timeout = 60000; // 60 second timeout
      xhr.open('POST', `${this.apiBaseUrl}/images/upload`);
      xhr.send(formData);
    });
  }

  /**
   * Delete uploaded image
   */
  async deleteImage(recordId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/images/${recordId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Delete failed with status ${response.status}`);
      }

      return { success: true };
    } catch (error) {
      console.error('Image deletion failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Delete failed'
      };
    }
  }

  /**
   * Get upload status
   */
  async getUploadStatus(recordId: string): Promise<{ status: string; error?: string }> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/images/${recordId}/status`);
      
      if (!response.ok) {
        throw new Error(`Status check failed with status ${response.status}`);
      }

      const result = await response.json();
      return { status: result.status };
    } catch (error) {
      console.error('Status check failed:', error);
      return {
        status: 'error',
        error: error instanceof Error ? error.message : 'Status check failed'
      };
    }
  }
}

// Export singleton instance
export const imageUploadService = new ImageUploadService();
export default ImageUploadService; 
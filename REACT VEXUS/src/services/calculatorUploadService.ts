// Calculator Upload Service for VEXUS Atlas
// Handles calculator image uploads to GCS-backed API

export interface CalculatorUploadResponse {
  success: boolean;
  calculationId?: string;
  imageUrl?: string;
  metadata?: {
    url: string;
    fileName: string;
  };
  message?: string;
  error?: string;
}

export interface CalculatorUploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export type VeinType = 'hepatic' | 'portal' | 'renal';

class CalculatorUploadService {
  private apiBaseUrl: string;

  constructor() {
    if ((import.meta as any).env?.PROD) {
      this.apiBaseUrl = '/api';  // Use relative path in production
    } else {
      this.apiBaseUrl = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:3001/api';
    }
  }

  /**
   * Upload calculator image to GCS
   * @param veinType - Type of vein (hepatic, portal, renal)
   * @param imageBlob - Image file as Blob
   * @param aiResult - Optional AI analysis result
   * @returns Promise<CalculatorUploadResponse>
   */
  async uploadCalculatorImage(
    veinType: VeinType,
    imageBlob: Blob,
    aiResult?: any
  ): Promise<CalculatorUploadResponse> {
    try {
      // Validate vein type
      if (!['hepatic', 'portal', 'renal'].includes(veinType)) {
        return {
          success: false,
          error: 'Invalid vein type. Must be hepatic, portal, or renal'
        };
      }

      // Validate image blob
      if (!imageBlob || imageBlob.size === 0) {
        return {
          success: false,
          error: 'No image data provided'
        };
      }

      // Create form data for GCS upload
      const formData = new FormData();
      const fileName = `${veinType}-vein-${Date.now()}.jpg`;
      formData.append('image', imageBlob, fileName);
      
      if (aiResult) {
        formData.append('aiResult', JSON.stringify(aiResult));
      }

      // Upload to GCS-backed API
      const response = await fetch(`${this.apiBaseUrl}/calculator/upload/${veinType}`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return result;
    } catch (error) {
      console.error('Calculator image upload failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to upload calculator image'
      };
    }
  }

  /**
   * Upload calculator image with progress tracking
   * @param veinType - Type of vein (hepatic, portal, renal)
   * @param imageBlob - Image file as Blob
   * @param onProgress - Progress callback function
   * @param aiResult - Optional AI analysis result
   * @returns Promise<CalculatorUploadResponse>
   */
  uploadCalculatorImageWithProgress(
    veinType: VeinType,
    imageBlob: Blob,
    onProgress: (progress: CalculatorUploadProgress) => void,
    aiResult?: any
  ): Promise<CalculatorUploadResponse> {
    return new Promise((resolve) => {
      // Validate vein type
      if (!['hepatic', 'portal', 'renal'].includes(veinType)) {
        resolve({
          success: false,
          error: 'Invalid vein type. Must be hepatic, portal, or renal'
        });
        return;
      }

      // Validate image blob
      if (!imageBlob || imageBlob.size === 0) {
        resolve({
          success: false,
          error: 'No image data provided'
        });
        return;
      }

      // Create form data for GCS upload
      const formData = new FormData();
      const fileName = `${veinType}-vein-${Date.now()}.jpg`;
      formData.append('image', imageBlob, fileName);
      
      if (aiResult) {
        formData.append('aiResult', JSON.stringify(aiResult));
      }

      const xhr = new XMLHttpRequest();

      // Handle upload progress
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress: CalculatorUploadProgress = {
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
            resolve(result);
          } else {
            const errorData = JSON.parse(xhr.responseText || '{}');
            resolve({
              success: false,
              error: errorData.error || `Upload failed with status ${xhr.status}`
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
      xhr.timeout = 30000; // 30 second timeout
      xhr.open('POST', `${this.apiBaseUrl}/calculator/upload/${veinType}`);
      xhr.send(formData);
    });
  }

  /**
   * Validate image blob for calculator upload
   * @param imageBlob - Image blob to validate
   * @returns Validation result
   */
  validateImage(imageBlob: Blob): { valid: boolean; error?: string } {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'];

    if (!imageBlob) {
      return {
        valid: false,
        error: 'No image provided'
      };
    }

    if (imageBlob.size > maxSize) {
      return {
        valid: false,
        error: 'Image is too large. Maximum size is 10MB.'
      };
    }

    if (!allowedTypes.includes(imageBlob.type)) {
      return {
        valid: false,
        error: 'Invalid image format. Supported formats: JPEG, PNG, GIF, BMP, WebP.'
      };
    }

    return { valid: true };
  }
}

// Export singleton instance
export const calculatorUploadService = new CalculatorUploadService(); 
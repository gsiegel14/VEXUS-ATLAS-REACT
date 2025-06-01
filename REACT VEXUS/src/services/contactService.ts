// Contact Service for VEXUS Atlas
// Handles contact form submissions to GCS-backed API

export interface ContactFormData {
  name: string;
  email: string;
  institution: string;
  subject: string;
  message: string;
  attachments: File[];
}

export interface ContactSubmissionResponse {
  success: boolean;
  contactId?: string;
  metadata?: {
    url: string;
    fileName: string;
  };
  attachments?: Array<{
    url: string;
    fileName: string;
    originalName: string;
    contentType: string;
  }>;
  message?: string;
  error?: string;
}

class ContactService {
  private apiBaseUrl: string;

  constructor() {
    if ((import.meta as any).env?.PROD) {
      this.apiBaseUrl = '/api';  // Use relative path in production
    } else {
      this.apiBaseUrl = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:3001/api';
    }
  }

  /**
   * Submit contact form with attachments
   * @param contactData - Contact form data including attachments
   * @returns Promise<ContactSubmissionResponse>
   */
  async submitContactForm(contactData: ContactFormData): Promise<ContactSubmissionResponse> {
    try {
      // Validate required fields
      if (!contactData.name || !contactData.email || !contactData.message) {
        return {
          success: false,
          error: 'Missing required fields: name, email, and message are required'
        };
      }

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('name', contactData.name);
      formData.append('email', contactData.email);
      formData.append('institution', contactData.institution);
      formData.append('subject', contactData.subject);
      formData.append('message', contactData.message);

      // Add attachments
      contactData.attachments.forEach((file) => {
        formData.append('attachments', file);
      });

      // Submit to API
      const response = await fetch(`${this.apiBaseUrl}/contact`, {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header - let browser set it for FormData
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return result;
    } catch (error) {
      console.error('Contact form submission failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to submit contact form'
      };
    }
  }

  /**
   * Validate file for contact form attachment
   * @param file - File to validate
   * @returns Validation result
   */
  validateAttachment(file: File): { valid: boolean; error?: string } {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'image/bmp',
      'image/webp',
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File "${file.name}" is too large. Maximum size is 5MB.`
      };
    }

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `File "${file.name}" has an unsupported format. Allowed formats: images, PDF, text, and Word documents.`
      };
    }

    return { valid: true };
  }

  /**
   * Validate all attachments for a contact form
   * @param files - Array of files to validate
   * @returns Validation result
   */
  validateAttachments(files: File[]): { valid: boolean; errors: string[] } {
    const maxFiles = 5;
    const errors: string[] = [];

    if (files.length > maxFiles) {
      errors.push(`Too many files. Maximum ${maxFiles} attachments allowed.`);
    }

    files.forEach((file) => {
      const validation = this.validateAttachment(file);
      if (!validation.valid && validation.error) {
        errors.push(validation.error);
      }
    });

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

// Export singleton instance
export const contactService = new ContactService(); 
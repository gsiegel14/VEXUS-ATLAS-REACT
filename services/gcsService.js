const { Storage } = require('@google-cloud/storage');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

// Initialize Google Cloud Storage
const storage = new Storage({
  projectId: 'decoded-app-457000-s2',
  keyFilename: './google-credentials-production.json'
});

// Bucket names for different data types
const BUCKETS = {
  CONTACT_FORMS: 'vexus-contact-forms',
  IMAGE_ATLAS: 'vexus-image-atlas', 
  CALCULATOR_IMAGES: 'vexus-calculator-images'
};

class GCSService {
  constructor() {
    this.storage = storage;
    this.buckets = BUCKETS;
  }

  /**
   * Initialize buckets (create if they don't exist)
   */
  async initializeBuckets() {
    for (const [key, bucketName] of Object.entries(this.buckets)) {
      try {
        const bucket = this.storage.bucket(bucketName);
        const [exists] = await bucket.exists();
        
        if (!exists) {
          await bucket.create({
            location: 'US',
            storageClass: 'STANDARD'
          });
          console.log(`✅ Created bucket: ${bucketName}`);
        } else {
          console.log(`📦 Bucket already exists: ${bucketName}`);
        }
      } catch (error) {
        console.error(`❌ Failed to initialize bucket ${bucketName}:`, error);
        throw error;
      }
    }
  }

  /**
   * Upload a file to a specific bucket
   * @param {string} bucketName - The bucket to upload to
   * @param {Buffer} fileBuffer - The file data
   * @param {string} fileName - The file name
   * @param {string} contentType - The content type
   * @param {Object} metadata - Additional metadata
   * @returns {Promise<{url: string, fileName: string}>}
   */
  async uploadFile(bucketName, fileBuffer, fileName, contentType, metadata = {}) {
    try {
      const bucket = this.storage.bucket(bucketName);
      const uniqueFileName = `${Date.now()}-${uuidv4()}-${fileName}`;
      const file = bucket.file(uniqueFileName);

      const stream = file.createWriteStream({
        metadata: {
          contentType,
          metadata: {
            ...metadata,
            uploadedAt: new Date().toISOString(),
            originalName: fileName
          }
        }
      });

      return new Promise((resolve, reject) => {
        stream.on('error', reject);
        stream.on('finish', () => {
          const publicUrl = `https://storage.googleapis.com/${bucketName}/${uniqueFileName}`;
          resolve({
            url: publicUrl,
            fileName: uniqueFileName,
            originalName: fileName,
            contentType,
            bucket: bucketName
          });
        });
        stream.end(fileBuffer);
      });
    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    }
  }

  /**
   * Upload contact form data (including attachments) to GCS
   * @param {Object} contactData - Contact form data
   * @param {Array} attachments - Array of attachment files
   * @returns {Promise<Object>}
   */
  async uploadContactForm(contactData, attachments = []) {
    try {
      const contactId = uuidv4();
      const uploadedAttachments = [];

      // Upload attachments if any
      for (const attachment of attachments) {
        const result = await this.uploadFile(
          this.buckets.CONTACT_FORMS,
          attachment.buffer,
          attachment.originalname,
          attachment.mimetype,
          {
            contactId,
            type: 'attachment',
            submittedBy: contactData.email
          }
        );
        uploadedAttachments.push(result);
      }

      // Create contact form metadata file
      const contactMetadata = {
        id: contactId,
        ...contactData,
        attachments: uploadedAttachments,
        submittedAt: new Date().toISOString(),
        type: 'contact_form'
      };

      // Upload metadata as JSON file
      const metadataBuffer = Buffer.from(JSON.stringify(contactMetadata, null, 2));
      const metadataResult = await this.uploadFile(
        this.buckets.CONTACT_FORMS,
        metadataBuffer,
        `contact-${contactId}.json`,
        'application/json',
        {
          contactId,
          type: 'metadata',
          submittedBy: contactData.email
        }
      );

      return {
        success: true,
        contactId,
        metadata: metadataResult,
        attachments: uploadedAttachments,
        message: 'Contact form data stored successfully'
      };
    } catch (error) {
      console.error('Failed to upload contact form:', error);
      throw error;
    }
  }

  /**
   * Upload Image Atlas submission to GCS
   * @param {Object} imageData - Image submission data
   * @param {Buffer} imageBuffer - Image file buffer
   * @param {string} originalFileName - Original file name
   * @param {string} contentType - Image content type
   * @returns {Promise<Object>}
   */
  async uploadImageAtlas(imageData, imageBuffer, originalFileName, contentType) {
    try {
      const submissionId = uuidv4();

      // Upload the image file
      const imageResult = await this.uploadFile(
        this.buckets.IMAGE_ATLAS,
        imageBuffer,
        originalFileName,
        contentType,
        {
          submissionId,
          type: 'atlas_image',
          veinType: imageData.veinType,
          quality: imageData.quality,
          submittedBy: imageData.email
        }
      );

      // Create submission metadata
      const submissionMetadata = {
        id: submissionId,
        ...imageData,
        imageFile: imageResult,
        submittedAt: new Date().toISOString(),
        type: 'image_atlas_submission',
        approved: false // Requires manual approval
      };

      // Upload metadata as JSON file
      const metadataBuffer = Buffer.from(JSON.stringify(submissionMetadata, null, 2));
      const metadataResult = await this.uploadFile(
        this.buckets.IMAGE_ATLAS,
        metadataBuffer,
        `atlas-submission-${submissionId}.json`,
        'application/json',
        {
          submissionId,
          type: 'metadata',
          veinType: imageData.veinType,
          submittedBy: imageData.email
        }
      );

      return {
        success: true,
        submissionId,
        imageUrl: imageResult.url,
        thumbnailUrl: imageResult.url, // Can be processed later for thumbnails
        metadata: metadataResult,
        recordId: submissionId,
        message: 'Image atlas submission stored successfully'
      };
    } catch (error) {
      console.error('Failed to upload image atlas submission:', error);
      throw error;
    }
  }

  /**
   * Upload Calculator image to GCS
   * @param {string} veinType - Type of vein (hepatic, portal, renal)
   * @param {Buffer} imageBuffer - Image file buffer
   * @param {string} originalFileName - Original file name
   * @param {string} contentType - Image content type
   * @param {Object} aiResult - AI analysis result (optional)
   * @returns {Promise<Object>}
   */
  async uploadCalculatorImage(veinType, imageBuffer, originalFileName, contentType, aiResult = null) {
    try {
      const calculationId = uuidv4();

      // Upload the image file
      const imageResult = await this.uploadFile(
        this.buckets.CALCULATOR_IMAGES,
        imageBuffer,
        originalFileName,
        contentType,
        {
          calculationId,
          type: 'calculator_image',
          veinType,
          uploadedAt: new Date().toISOString()
        }
      );

      // Create calculation metadata
      const calculationMetadata = {
        id: calculationId,
        veinType,
        imageFile: imageResult,
        aiResult,
        submittedAt: new Date().toISOString(),
        type: 'calculator_submission'
      };

      // Upload metadata as JSON file
      const metadataBuffer = Buffer.from(JSON.stringify(calculationMetadata, null, 2));
      const metadataResult = await this.uploadFile(
        this.buckets.CALCULATOR_IMAGES,
        metadataBuffer,
        `calculator-${veinType}-${calculationId}.json`,
        'application/json',
        {
          calculationId,
          type: 'metadata',
          veinType
        }
      );

      return {
        success: true,
        calculationId,
        imageUrl: imageResult.url,
        metadata: metadataResult,
        message: 'Calculator image stored successfully'
      };
    } catch (error) {
      console.error('Failed to upload calculator image:', error);
      throw error;
    }
  }

  /**
   * List files in a bucket with optional prefix
   * @param {string} bucketName - Bucket name
   * @param {string} prefix - File prefix to filter
   * @returns {Promise<Array>}
   */
  async listFiles(bucketName, prefix = '') {
    try {
      const bucket = this.storage.bucket(bucketName);
      const [files] = await bucket.getFiles({ prefix });

      return files.map(file => ({
        name: file.name,
        bucket: file.bucket.name,
        created: file.metadata.timeCreated,
        updated: file.metadata.updated,
        size: file.metadata.size,
        contentType: file.metadata.contentType,
        publicUrl: `https://storage.googleapis.com/${bucketName}/${file.name}`
      }));
    } catch (error) {
      console.error('Failed to list files:', error);
      throw error;
    }
  }

  /**
   * Delete a file from GCS
   * @param {string} bucketName - Bucket name
   * @param {string} fileName - File name
   * @returns {Promise<boolean>}
   */
  async deleteFile(bucketName, fileName) {
    try {
      const bucket = this.storage.bucket(bucketName);
      await bucket.file(fileName).delete();
      console.log(`🗑️ Deleted file: ${fileName} from ${bucketName}`);
      return true;
    } catch (error) {
      console.error('Failed to delete file:', error);
      throw error;
    }
  }

  /**
   * Get signed URL for secure file access
   * @param {string} bucketName - Bucket name  
   * @param {string} fileName - File name
   * @param {number} expirationMinutes - URL expiration in minutes
   * @returns {Promise<string>}
   */
  async getSignedUrl(bucketName, fileName, expirationMinutes = 60) {
    try {
      const bucket = this.storage.bucket(bucketName);
      const file = bucket.file(fileName);

      const [url] = await file.getSignedUrl({
        version: 'v4',
        action: 'read',
        expires: Date.now() + (expirationMinutes * 60 * 1000)
      });

      return url;
    } catch (error) {
      console.error('Failed to generate signed URL:', error);
      throw error;
    }
  }
}

module.exports = new GCSService(); 

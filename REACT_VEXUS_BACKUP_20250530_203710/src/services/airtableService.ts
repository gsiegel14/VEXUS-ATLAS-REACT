import Airtable, { FieldSet, Record as AirtableRecord } from 'airtable';
// import config, { validateConfig } from '../config/environment';

// Temporary inline config until we set up proper environment
const config = {
  airtable: {
    apiKey: (import.meta as any).env?.VITE_AIRTABLE_API_KEY || '',
    baseId: (import.meta as any).env?.VITE_AIRTABLE_BASE_ID || '',
    tableName: (import.meta as any).env?.VITE_AIRTABLE_TABLE_NAME || 'VEXUS_Images',
  }
};

const validateConfig = () => {
  return config.airtable.apiKey && config.airtable.baseId;
};

// Type definitions for VEXUS Image data
export interface VexusImageData {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl?: string;
  quality: 'High' | 'Medium' | 'Low';
  veinType: 'Hepatic Vein' | 'Portal Vein' | 'Renal Vein';
  waveform: 'Normal' | 'Abnormal' | 'Reversal' | 'Pulsatile';
  subtype?: 'S-Wave' | 'D-Wave' | 'Continuous' | 'Biphasic';
  vexusGrade?: '0' | '1' | '2' | '3';
  clinicalContext?: string;
  analysis?: string;
  qa?: string; // Quality Assurance notes
  submittedBy?: string;
  institution?: string;
  submissionDate?: Date;
  approved?: boolean;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface ImageSubmissionData {
  title: string;
  description: string;
  email: string;
  institution: string;
  veinType: 'hepatic' | 'portal' | 'renal';
  quality?: 'high' | 'medium' | 'low';
  imageFile: File;
  clinicalContext?: string;
  vexusGrade?: '0' | '1' | '2' | '3';
  waveform?: 'normal' | 'abnormal' | 'reversal' | 'pulsatile';
}

export interface AirtableConfig {
  apiKey: string;
  baseId: string;
  tableId: string;
  tableName: string;
}

class AirtableService {
  private base: Airtable.Base | null = null;
  private config: AirtableConfig | null = null;
  private initialized = false;

  /**
   * Initialize the Airtable service with environment configuration
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      // Validate configuration
      if (!validateConfig()) {
        throw new Error('Invalid environment configuration');
      }

      // Configure Airtable with environment variables
      Airtable.configure({
        endpointUrl: 'https://api.airtable.com',
        apiKey: config.airtable.apiKey,
      });

      // Initialize base
      this.base = Airtable.base(config.airtable.baseId);
      this.initialized = true;

      console.log('✅ Airtable service initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Airtable service:', error);
      throw new Error(`Failed to initialize Airtable service: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Ensure the service is initialized before making requests
   */
  private async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }

    if (!this.base) {
      throw new Error('Airtable service not properly initialized');
    }
  }

  /**
   * Transform Airtable record to VexusImageData
   */
  private transformRecord(record: AirtableRecord<FieldSet>): VexusImageData {
    const fields = record.fields as any;
    
    return {
      id: record.id,
      title: fields.Title || fields.ImageTitle || '',
      description: fields.Description || fields.ImageDescription || '',
      imageUrl: fields.ImageURL || (fields.Image && fields.Image[0]?.url) || '',
      thumbnailUrl: fields.ThumbnailURL || (fields.Image && fields.Image[0]?.thumbnails?.large?.url),
      quality: fields.Quality || fields.ImageQuality || 'Medium',
      veinType: fields.VeinType || fields.Type || 'Hepatic Vein',
      waveform: fields.Waveform || fields.FlowPattern || 'Normal',
      subtype: fields.Subtype || fields.WaveformSubtype,
      vexusGrade: fields.VEXUSGrade || fields.Grade,
      clinicalContext: fields.ClinicalContext || fields.Context,
      analysis: fields.Analysis || fields.ImageAnalysis,
      qa: fields.QA || fields.QualityAssurance,
      submittedBy: fields.SubmittedBy || fields.Submitter || fields.Author,
      institution: fields.Institution || fields.Hospital,
      submissionDate: fields.SubmissionDate || fields.CreatedDate ? new Date(fields.SubmissionDate || fields.CreatedDate) : undefined,
      approved: fields.Approved === true || fields.Status === 'Approved',
      tags: fields.Tags ? (Array.isArray(fields.Tags) ? fields.Tags : fields.Tags.split(',').map((tag: string) => tag.trim())) : [],
      metadata: {
        recordId: record.id,
        createdTime: (record as any).createdTime,
        lastModified: (record as any).lastModified,
        ...fields.Metadata
      }
    };
  }

  /**
   * Fetch all approved images from Airtable
   * @param filterByApproved - Whether to filter only approved images (default: true)
   * @returns Array of VexusImageData
   */
  async fetchImages(filterByApproved: boolean = true): Promise<VexusImageData[]> {
    await this.ensureInitialized();

    try {
      const records: VexusImageData[] = [];
      
      const formula = filterByApproved ? "AND({Approved} = TRUE(), {ImageURL} != '')" : "{ImageURL} != ''";

      await this.base!(config.airtable.tableName)
        .select({
          filterByFormula: formula,
          sort: [
            { field: 'SubmissionDate', direction: 'desc' },
            { field: 'Title', direction: 'asc' }
          ],
          maxRecords: 100 // Reasonable limit for initial load
        })
        .eachPage(
          (pageRecords, fetchNextPage) => {
            pageRecords.forEach(record => {
              try {
                const imageData = this.transformRecord(record);
                if (imageData.imageUrl) { // Only include records with valid image URLs
                  records.push(imageData);
                }
              } catch (error) {
                console.warn(`⚠️ Failed to transform record ${record.id}:`, error);
              }
            });
            fetchNextPage();
          }
        );

      console.log(`✅ Fetched ${records.length} images from Airtable`);
      return records;
    } catch (error) {
      console.error('❌ Failed to fetch images from Airtable:', error);
      throw new Error(`Failed to fetch images: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Fetch images by category (vein type)
   * @param veinType - The type of vein to filter by
   * @param filterByApproved - Whether to filter only approved images
   * @returns Array of VexusImageData for the specified vein type
   */
  async fetchImagesByCategory(
    veinType: 'Hepatic Vein' | 'Portal Vein' | 'Renal Vein',
    filterByApproved: boolean = true
  ): Promise<VexusImageData[]> {
    await this.ensureInitialized();

    try {
      const records: VexusImageData[] = [];
      
      let formula = `{VeinType} = '${veinType}'`;
      if (filterByApproved) {
        formula += " AND {Approved} = TRUE()";
      }

      await this.base!(this.config!.tableName)
        .select({
          filterByFormula: formula,
          sort: [
            { field: 'Quality', direction: 'desc' },
            { field: 'Title', direction: 'asc' }
          ]
        })
        .eachPage(
          (pageRecords, fetchNextPage) => {
            pageRecords.forEach(record => {
              try {
                const imageData = this.transformRecord(record);
                records.push(imageData);
              } catch (error) {
                console.warn(`Failed to transform record ${record.id}:`, error);
              }
            });
            fetchNextPage();
          }
        );

      return records;
    } catch (error) {
      console.error(`Failed to fetch ${veinType} images:`, error);
      throw new Error(`Failed to fetch ${veinType} images`);
    }
  }

  /**
   * Submit a new image to Airtable
   * @param submissionData - The image submission data
   * @returns The created record ID
   */
  async submitImage(submissionData: ImageSubmissionData): Promise<string> {
    await this.ensureInitialized();

    try {
      // Note: In a real implementation, you'd need to handle file upload
      // This might involve uploading to a storage service first
      const record = await this.base!(this.config!.tableName).create({
        Title: submissionData.title,
        Description: submissionData.description,
        SubmittedBy: submissionData.email,
        Institution: submissionData.institution,
        VeinType: this.mapVeinType(submissionData.veinType),
        Quality: this.mapQuality(submissionData.quality),
        SubmissionDate: new Date().toISOString(),
        Approved: false, // Requires manual approval
      });

      console.log(`Image submitted successfully with ID: ${record.id}`);
      return record.id;
    } catch (error) {
      console.error('Failed to submit image:', error);
      throw new Error('Failed to submit image to Airtable');
    }
  }

  /**
   * Search images by text query
   * @param query - Search query
   * @param filterByApproved - Whether to filter only approved images
   * @returns Array of matching VexusImageData
   */
  async searchImages(query: string, filterByApproved: boolean = true): Promise<VexusImageData[]> {
    const images = await this.fetchImages(filterByApproved);
    
    const lowercaseQuery = query.toLowerCase();
    
    return images.filter(image => 
      image.title.toLowerCase().includes(lowercaseQuery) ||
      image.description.toLowerCase().includes(lowercaseQuery) ||
      image.veinType.toLowerCase().includes(lowercaseQuery) ||
      image.waveform.toLowerCase().includes(lowercaseQuery) ||
      (image.subtype && image.subtype.toLowerCase().includes(lowercaseQuery)) ||
      (image.clinicalContext && image.clinicalContext.toLowerCase().includes(lowercaseQuery)) ||
      (image.analysis && image.analysis.toLowerCase().includes(lowercaseQuery)) ||
      (image.tags && image.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)))
    );
  }

  /**
   * Map frontend vein type to Airtable format
   */
  private mapVeinType(veinType: string): string {
    const mapping: Record<string, string> = {
      'hepatic': 'Hepatic Vein',
      'portal': 'Portal Vein',
      'renal': 'Renal Vein'
    };
    return mapping[veinType] || 'Hepatic Vein';
  }

  /**
   * Map frontend quality to Airtable format
   */
  private mapQuality(quality?: string): string {
    const mapping: Record<string, string> = {
      'high': 'High',
      'medium': 'Medium',
      'low': 'Low'
    };
    return mapping[quality || 'medium'] || 'Medium';
  }

  /**
   * Health check for the Airtable service
   * @returns Promise<boolean> indicating if the service is healthy
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.ensureInitialized();
      
      // Try to fetch a single record to verify connectivity
      await this.base!(this.config!.tableName)
        .select({ maxRecords: 1 })
        .firstPage();
      
      return true;
    } catch (error) {
      console.error('Airtable health check failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const airtableService = new AirtableService();
export default AirtableService; 
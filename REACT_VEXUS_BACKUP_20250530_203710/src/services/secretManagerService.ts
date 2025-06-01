import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

export interface SecretConfig {
  projectId: string;
  secretId: string;
  versionId?: string;
}

class SecretManagerService {
  private client: SecretManagerServiceClient;
  private projectId: string;

  constructor() {
    this.projectId = '314467722862'; // Your GCP Project ID
    
    // Initialize the Secret Manager client
    // In production, this will use the service account credentials
    // from the environment or metadata server
    this.client = new SecretManagerServiceClient({
      projectId: this.projectId,
      // For production deployment on GCP, credentials are handled automatically
      // For local development, set GOOGLE_APPLICATION_CREDENTIALS env var
    });
  }

  /**
   * Retrieve a secret value from Google Secret Manager
   * @param secretId - The ID of the secret to retrieve
   * @param versionId - Optional version ID (defaults to 'latest')
   * @returns The secret value as a string
   */
  async getSecret(secretId: string, versionId: string = 'latest'): Promise<string> {
    try {
      const name = `projects/${this.projectId}/secrets/${secretId}/versions/${versionId}`;
      
      const [version] = await this.client.accessSecretVersion({
        name: name,
      });

      if (!version.payload?.data) {
        throw new Error(`Secret ${secretId} has no data`);
      }

      // Extract the secret value
      const secretValue = version.payload.data.toString();
      
      if (!secretValue) {
        throw new Error(`Secret ${secretId} is empty`);
      }

      return secretValue;
    } catch (error) {
      console.error(`Failed to retrieve secret ${secretId}:`, error);
      throw new Error(`Failed to retrieve secret ${secretId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Retrieve multiple secrets at once
   * @param secretIds - Array of secret IDs to retrieve
   * @returns Object with secret IDs as keys and secret values as values
   */
  async getSecrets(secretIds: string[]): Promise<Record<string, string>> {
    try {
      const secretPromises = secretIds.map(async (secretId) => {
        const value = await this.getSecret(secretId);
        return { [secretId]: value };
      });

      const secrets = await Promise.all(secretPromises);
      return secrets.reduce((acc, secret) => ({ ...acc, ...secret }), {});
    } catch (error) {
      console.error('Failed to retrieve multiple secrets:', error);
      throw error;
    }
  }

  /**
   * Check if the service is properly configured
   * @returns Promise<boolean> indicating if the service is ready
   */
  async healthCheck(): Promise<boolean> {
    try {
      // Try to list secrets to verify connectivity
      await this.client.listSecrets({
        parent: `projects/${this.projectId}`,
        pageSize: 1,
      });
      return true;
    } catch (error) {
      console.error('Secret Manager health check failed:', error);
      return false;
    }
  }

  /**
   * Get all Airtable configuration secrets
   * @returns Object with all Airtable configuration
   */
  async getAirtableConfig(): Promise<{
    apiKey: string;
    baseId: string;
    tableId: string;
    tableName: string;
  }> {
    try {
      const secrets = await this.getSecrets([
        'AIRTABLE_API_KEY',
        'AIRTABLE_BASE_ID',
        'AIRTABLE_TABLE_ID',
        'AIRTABLE_TABLE_NAME'
      ]);

      return {
        apiKey: secrets.AIRTABLE_API_KEY,
        baseId: secrets.AIRTABLE_BASE_ID,
        tableId: secrets.AIRTABLE_TABLE_ID,
        tableName: secrets.AIRTABLE_TABLE_NAME,
      };
    } catch (error) {
      console.error('Failed to retrieve Airtable configuration:', error);
      throw new Error('Failed to retrieve Airtable configuration from Secret Manager');
    }
  }
}

// Export singleton instance
export const secretManagerService = new SecretManagerService();
export default SecretManagerService; 
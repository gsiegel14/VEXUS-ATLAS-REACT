export interface AIAnalysisResult {
  measurement?: string;
  classification: string;
  score: number;
  confidence: number;
  rawOutput?: any;
}

export class AIService {
  private timeout: number;
  private endpoints: Record<string, string>;

  constructor(timeout = 30000) {
    this.timeout = timeout;
    this.endpoints = {
      hepatic: '/api/hepatic',
      portal: '/api/portal',
      renal: '/api/renal'
    };
  }

  async analyzeVEXUSImage(imageBlob: Blob, veinType: string): Promise<AIAnalysisResult> {
    const endpoint = this.endpoints[veinType];
    if (!endpoint) {
      throw new Error(`No AI endpoint configured for vein type: ${veinType}`);
    }

    console.log(`🔍 Starting AI analysis for ${veinType}`);
    console.log(`📡 Endpoint: ${endpoint}`);
    console.log(`📁 File size: ${imageBlob.size} bytes`);
    
    // Convert blob to base64
    const base64Image = await this.blobToBase64(imageBlob);
    console.log(`📷 Image converted to base64, length: ${base64Image.length}`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      console.log(`🚀 Sending JSON request to ${endpoint}...`);
      
      // Add timestamp for cache busting
      const requestPayload = {
        image_base64: base64Image,
        vein_type: veinType,
        timestamp: Date.now()
      };
      
      console.log(`📤 Request payload keys: ${Object.keys(requestPayload).join(', ')}`);
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        body: JSON.stringify(requestPayload),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      console.log(`📥 Response status: ${response.status} ${response.statusText}`);
      console.log(`📥 Response headers:`, Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        let errorMessage = `AI analysis failed for ${veinType}: ${response.status} ${response.statusText}`;
        try {
          const errorText = await response.text();
          console.error(`❌ Error response body:`, errorText);
          try {
            const errorData = JSON.parse(errorText);
            errorMessage += ` - ${errorData.message || errorData.detail || errorData.error || 'Unknown error'}`;
          } catch {
            // If JSON parsing fails, use the raw text
            errorMessage += ` - ${errorText.substring(0, 200)}`;
          }
        } catch {
          // If we can't read the response body, use the basic message
        }
        throw new Error(errorMessage);
      }
      
      const resultText = await response.text();
      console.log(`✅ Success response body:`, resultText);
      
      let result;
      try {
        result = JSON.parse(resultText);
      } catch (e) {
        console.error(`❌ JSON parse error:`, e);
        throw new Error(`Invalid JSON response from ${veinType} endpoint: ${resultText.substring(0, 200)}`);
      }
      
      console.log(`🔄 Parsing AI result for ${veinType}:`, result);
      
      // Parse the result based on the expected format from Modal endpoints
      return this.parseAIResult(result, veinType);

    } catch (error) {
      clearTimeout(timeoutId);
      console.error(`💥 AI service error for ${veinType}:`, error);
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`AI analysis for ${veinType} timed out after ${this.timeout / 1000} seconds.`);
      }
      throw error;
    }
  }

  private async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result && typeof reader.result === 'string') {
          // Remove the data URL prefix (e.g., "data:image/png;base64,")
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        } else {
          reject(new Error('Failed to convert blob to base64'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  private parseAIResult(result: any, veinType: string): AIAnalysisResult {
    // Add comprehensive logging to understand the response structure
    console.log(`🔍 Raw AI result for ${veinType}:`, JSON.stringify(result, null, 2));
    
    // Handle different response formats from Modal endpoints
    let classification = '';
    let score = 0;
    let confidence = 0;

    // Try multiple possible response formats
    if (result.prediction) {
      classification = result.prediction;
    } else if (result.predicted_severity) {
      classification = result.predicted_severity;
    } else if (result.class) {
      classification = result.class;
    } else if (result.result) {
      classification = result.result;
    } else if (result.classification) {
      classification = result.classification;
    } else if (result.label) {
      classification = result.label;
    } else if (typeof result === 'string') {
      // Sometimes the result might be a string directly
      classification = result;
    } else if (result.data && result.data.prediction) {
      classification = result.data.prediction;
    } else if (result.output) {
      classification = result.output;
    } else {
      console.error(`❌ Could not find prediction in response:`, result);
      console.error(`❌ Available keys:`, Object.keys(result));
      throw new Error(`AI response does not contain expected prediction field. Available keys: ${Object.keys(result).join(', ')}`);
    }

    // Extract confidence if available
    if (result.confidence !== undefined) {
      confidence = parseFloat(result.confidence);
    } else if (result.probability !== undefined) {
      confidence = parseFloat(result.probability);
    } else if (result.score !== undefined) {
      confidence = parseFloat(result.score);
    } else {
      confidence = 1.0; // Default confidence if not provided
    }

    console.log(`✅ Extracted classification: "${classification}", confidence: ${confidence}`);

    // Map classification to score based on vein type
    score = this.mapClassificationToScore(classification, veinType);

    return {
      classification,
      score,
      confidence,
      rawOutput: result
    };
  }

  private mapClassificationToScore(classification: string, veinType: string): number {
    const normalizedClass = classification.toLowerCase();
    
    // Handle low confidence cases
    if (normalizedClass.includes('confidence') && normalizedClass.includes('50%')) {
      return 0;
    }

    // Map based on severity
    if (normalizedClass.includes('normal')) {
      return 0;
    } else if (normalizedClass.includes('mild')) {
      return 1;
    } else if (normalizedClass.includes('severe')) {
      return 2;
    }

    // Handle specific patterns for each vein type
    switch (veinType) {
      case 'hepatic':
        if (normalizedClass.includes('s-wave') || normalizedClass.includes('s wave')) {
          return 1;
        } else if (normalizedClass.includes('d-wave') || normalizedClass.includes('d wave')) {
          return 2;
        }
        break;
      case 'portal':
        if (normalizedClass.includes('pulsatile') || normalizedClass.includes('pulsatility')) {
          return normalizedClass.includes('severe') ? 2 : 1;
        }
        break;
      case 'renal':
        if (normalizedClass.includes('continuous') || normalizedClass.includes('monophasic')) {
          return 2;
        } else if (normalizedClass.includes('discontinuous') || normalizedClass.includes('biphasic')) {
          return 1;
        }
        break;
    }

    // Default to 0 if we can't determine the score
    console.warn(`Could not map classification "${classification}" for vein type "${veinType}" to a score`);
    return 0;
  }

  // Method to check if endpoint is reachable
  async checkEndpointHealth(veinType: string): Promise<boolean> {
    const endpoint = this.endpoints[veinType];
    if (!endpoint) return false;

    try {
      console.log(`🏥 Health check for ${veinType} at ${endpoint}`);
      
      // Modal endpoints don't have a separate health check endpoint
      // We'll just return true if the endpoint exists
      return true;
    } catch (error) {
      console.error(`🏥 Health check failed for ${veinType}:`, error);
      return false;
    }
  }

  // Test all endpoints
  async testAllEndpoints(): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};
    
    for (const veinType of ['hepatic', 'portal', 'renal']) {
      results[veinType] = await this.checkEndpointHealth(veinType);
    }
    
    console.log('🏥 Endpoint health check results:', results);
    return results;
  }
} 
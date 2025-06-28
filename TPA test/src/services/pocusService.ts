import axios from 'axios';
import { CategorizedImages, PocusImageData } from '../types/pocus';

// API base URL - use relative path when using Vite proxy
const getApiBaseUrl = () => {
  // Always use relative path since we're using Vite proxy
  return '/api';
};

const API_BASE_URL = getApiBaseUrl();

export const pocusService = {
  // Get all cardiac images categorized
  async getCardiologyImages(): Promise<CategorizedImages> {
    try {
      const response = await axios.get(`${API_BASE_URL}/pocus/images`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch cardiology images:', error);
      throw error;
    }
  },

  // Get images by specific cardiac category
  async getImagesByCategory(categoryName: string): Promise<PocusImageData[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/pocus/images/category/${categoryName}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch ${categoryName} images:`, error);
      throw error;
    }
  },

  // Health check
  async checkHealth(): Promise<any> {
    try {
      const response = await axios.get(`${API_BASE_URL}/health`);
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  },

  // Debug endpoints
  async getDebugFields(): Promise<any> {
    try {
      const response = await axios.get(`${API_BASE_URL}/pocus/debug/fields`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch debug fields:', error);
      throw error;
    }
  },

  async getDebugSecrets(): Promise<any> {
    try {
      const response = await axios.get(`${API_BASE_URL}/pocus/debug/secrets`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch debug secrets:', error);
      throw error;
    }
  }
};

// Legacy function for backward compatibility
export const fetchCardiologyImages = pocusService.getCardiologyImages;

export async function fetchRawPocusData() {
  try {
    const response = await axios.get(`${API_BASE_URL}/raw`);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to fetch raw POCUS data:', error);
    throw error;
  }
} 
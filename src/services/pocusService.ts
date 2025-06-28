import axios from 'axios';
import { CategorizedImages, PocusImageData } from '../types/pocus';

// Helper function to get API base URL
function getApiBaseUrl(): string {
  if (process.env.NODE_ENV === 'production') {
    return '';
  }
  // In development, use relative URL to work with Vite proxy
  return '/api';
}

const API_BASE_URL = getApiBaseUrl();

export const pocusApi = axios.create({
  baseURL: `${API_BASE_URL}/pocus`,
  timeout: 30000,
});

export async function fetchCardiologyImages(): Promise<CategorizedImages> {
  try {
    console.log('🔍 Fetching cardiology images...');
    const response = await pocusApi.get('/images');
    
    // Debug the raw response
    console.log('📊 Raw API response:', response.data);
    console.log('📊 Response keys:', Object.keys(response.data));
    
    // Transform the data to ensure proper Date objects
    const categorizedImages: CategorizedImages = response.data;
    
    // Debug each category
    Object.entries(categorizedImages).forEach(([category, images]) => {
      console.log(`📂 Category "${category}": ${images.length} images`);
      images.forEach((image: PocusImageData, index: number) => {
        const isVideo = image.imageUrl?.toLowerCase().includes('.mp4');
        console.log(`  📄 Image ${index + 1}:`, {
          id: image.id,
          title: image.title,
          imageUrl: image.imageUrl,
          thumbnailUrl: image.thumbnailUrl,
          isVideo: isVideo,
          urlLength: image.imageUrl?.length || 0,
          urlStartsWith: image.imageUrl?.substring(0, 50) + '...'
        });
      });
    });
    
    // Transform dates properly
    Object.values(categorizedImages).flat().forEach(image => {
      if (image.submissionDate && typeof image.submissionDate === 'string') {
        image.submissionDate = new Date(image.submissionDate);
      }
    });
    
    console.log('✅ Images processed and returned');
    return categorizedImages;
  } catch (error) {
    console.error('❌ Failed to load POCUS images:', error);
    throw error;
  }
}

export async function fetchImagesByCategory(categoryName: string): Promise<PocusImageData[]> {
  try {
    console.log(`🔍 Fetching images for category: ${categoryName}`);
    const response = await pocusApi.get(`/images/category/${categoryName}`);
    
    // Transform submission dates from strings to Date objects
    const images: PocusImageData[] = response.data.map((image: any) => ({
      ...image,
      submissionDate: new Date(image.submissionDate)
    }));
    
    console.log(`✅ Loaded ${images.length} images for category ${categoryName}`);
    return images;
  } catch (error) {
    console.error(`❌ Failed to fetch images for category ${categoryName}:`, error);
    throw error;
  }
}

export async function checkPocusHealth() {
  try {
    console.log('🔍 Making health check request to:', `${API_BASE_URL}/health`);
    const response = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ Health check response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ POCUS health check failed:', error);
    throw error;
  }
}

export async function debugPocusFields() {
  try {
    const response = await pocusApi.get('/debug/fields');
    return response.data;
  } catch (error) {
    console.error('❌ Failed to fetch debug fields:', error);
    throw error;
  }
}

export async function debugPocusSecrets() {
  try {
    const response = await pocusApi.get('/debug/secrets');
    return response.data;
  } catch (error) {
    console.error('❌ Failed to fetch debug secrets:', error);
    throw error;
  }
}

export async function fetchRawPocusData() {
  try {
    const response = await pocusApi.get('/raw');
    return response.data;
  } catch (error) {
    console.error('❌ Failed to fetch raw POCUS data:', error);
    throw error;
  }
} 
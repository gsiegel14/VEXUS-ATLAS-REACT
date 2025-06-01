import { useState, useCallback, useReducer, useEffect } from 'react';
import { airtableService } from '../services/airtableService';
import { VexusImageData, ImageSubmissionData } from '../services/airtableService';

interface ImageGalleryState {
  images: VexusImageData[];
  loading: boolean;
  error: string | null;
  categories: {
    hepatic: VexusImageData[];
    portal: VexusImageData[];
    renal: VexusImageData[];
  };
  initialized: boolean;
  lastFetch: Date | null;
}

type ImageGalleryAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: VexusImageData[] }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'ADD_IMAGE'; payload: VexusImageData }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_INITIALIZED'; payload: boolean };

const initialState: ImageGalleryState = {
  images: [],
  loading: false,
  error: null,
  categories: {
    hepatic: [],
    portal: [],
    renal: [],
  },
  initialized: false,
  lastFetch: null,
};

function categorizeImages(images: VexusImageData[]): {
  hepatic: VexusImageData[];
  portal: VexusImageData[];
  renal: VexusImageData[];
} {
  return images.reduce(
    (acc, img) => {
      const vein = img.veinType.toLowerCase();
      if (vein.includes('hepatic')) {
        acc.hepatic.push(img);
      } else if (vein.includes('portal')) {
        acc.portal.push(img);
      } else if (vein.includes('renal')) {
        acc.renal.push(img);
      }
      return acc;
    },
    { hepatic: [], portal: [], renal: [] } as {
      hepatic: VexusImageData[];
      portal: VexusImageData[];
      renal: VexusImageData[];
    }
  );
}

function imageGalleryReducer(
  state: ImageGalleryState,
  action: ImageGalleryAction
): ImageGalleryState {
  switch (action.type) {
    case 'FETCH_START':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        images: action.payload,
        categories: categorizeImages(action.payload),
        lastFetch: new Date(),
      };
    case 'FETCH_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case 'ADD_IMAGE':
      const newImages = [...state.images, action.payload];
      return {
        ...state,
        images: newImages,
        categories: categorizeImages(newImages),
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'SET_INITIALIZED':
      return {
        ...state,
        initialized: action.payload,
      };
    default:
      return state;
  }
}

export const useImageGallery = () => {
  const [state, dispatch] = useReducer(imageGalleryReducer, initialState);

  // Initialize services on mount
  useEffect(() => {
    const initializeServices = async () => {
      try {
        await airtableService.initialize();
        dispatch({ type: 'SET_INITIALIZED', payload: true });
      } catch (error) {
        console.error('Failed to initialize services:', error);
        dispatch({
          type: 'FETCH_ERROR',
          payload: 'Failed to initialize image services. Please try again later.',
        });
      }
    };

    initializeServices();
  }, []);

  const fetchImages = useCallback(
    async (forceRefresh: boolean = false) => {
      // Don't fetch if already loading or if recently fetched (unless forced)
      if (state.loading) return;
      
      if (!forceRefresh && state.lastFetch) {
        const timeSinceLastFetch = Date.now() - state.lastFetch.getTime();
        if (timeSinceLastFetch < 30000) { // 30 seconds cache
          return;
        }
      }

      if (!state.initialized) {
        dispatch({
          type: 'FETCH_ERROR',
          payload: 'Services not initialized. Please refresh the page.',
        });
        return;
      }

      dispatch({ type: 'FETCH_START' });

      try {
        const images = await airtableService.fetchImages(true); // Only approved images
        dispatch({ type: 'FETCH_SUCCESS', payload: images });
      } catch (error) {
        console.error('Failed to fetch images:', error);
        dispatch({
          type: 'FETCH_ERROR',
          payload: error instanceof Error ? error.message : 'Failed to fetch images',
        });
      }
    },
    [state.loading, state.initialized, state.lastFetch]
  );

  const fetchImagesByCategory = useCallback(
    async (veinType: 'Hepatic Vein' | 'Portal Vein' | 'Renal Vein') => {
      if (!state.initialized) {
        throw new Error('Services not initialized');
      }

      try {
        const images = await airtableService.fetchImagesByCategory(veinType, true);
        return images;
      } catch (error) {
        console.error(`Failed to fetch ${veinType} images:`, error);
        throw error;
      }
    },
    [state.initialized]
  );

  const submitImage = useCallback(
    async (imageData: ImageSubmissionData): Promise<string> => {
      if (!state.initialized) {
        throw new Error('Services not initialized');
      }

      try {
        const recordId = await airtableService.submitImage(imageData);
        
        // Note: We don't add the image to the state immediately since it needs approval
        // The image will appear after approval and the next fetch
        
        return recordId;
      } catch (error) {
        console.error('Failed to submit image:', error);
        throw new Error(`Failed to submit image: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
    [state.initialized]
  );

  const searchImages = useCallback(
    async (query: string): Promise<VexusImageData[]> => {
      if (!state.initialized) {
        throw new Error('Services not initialized');
      }

      try {
        const results = await airtableService.searchImages(query, true);
        return results;
      } catch (error) {
        console.error('Failed to search images:', error);
        throw error;
      }
    },
    [state.initialized]
  );

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const refreshImages = useCallback(() => {
    return fetchImages(true);
  }, [fetchImages]);

  // Health check function
  const healthCheck = useCallback(async (): Promise<boolean> => {
    try {
      return await airtableService.healthCheck();
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }, []);

  return {
    // State
    images: state.images,
    loading: state.loading,
    error: state.error,
    categories: state.categories,
    initialized: state.initialized,
    lastFetch: state.lastFetch,

    // Actions
    fetchImages,
    fetchImagesByCategory,
    submitImage,
    searchImages,
    clearError,
    refreshImages,
    healthCheck,

    // Computed values
    totalImages: state.images.length,
    imagesByQuality: {
      high: state.images.filter(img => img.quality === 'High').length,
      medium: state.images.filter(img => img.quality === 'Medium').length,
      low: state.images.filter(img => img.quality === 'Low').length,
    },
    imagesByVexusGrade: {
      grade0: state.images.filter(img => img.vexusGrade === '0').length,
      grade1: state.images.filter(img => img.vexusGrade === '1').length,
      grade2: state.images.filter(img => img.vexusGrade === '2').length,
      grade3: state.images.filter(img => img.vexusGrade === '3').length,
    },
  };
}; 
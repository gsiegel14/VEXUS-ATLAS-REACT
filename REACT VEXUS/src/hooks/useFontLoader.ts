import { useEffect, useState } from 'react';
import { fontLoadingConfig } from '../config/fonts';

interface FontLoadingState {
  isLoading: boolean;
  isLoaded: boolean;
  hasError: boolean;
  errorMessage?: string;
}

export const useFontLoader = (fontFamily: string = 'europa'): FontLoadingState => {
  const [state, setState] = useState<FontLoadingState>({
    isLoading: true,
    isLoaded: false,
    hasError: false,
  });

  useEffect(() => {
    // Check if fonts API is supported
    if (!('fonts' in document)) {
      setState({
        isLoading: false,
        isLoaded: false,
        hasError: true,
        errorMessage: 'Fonts API not supported, using fallback fonts'
      });
      return;
    }

    let timeoutId: NodeJS.Timeout;

    const loadFont = async () => {
      try {
        // Try to load the font
        await document.fonts.load(`400 16px ${fontFamily}`);
        await document.fonts.load(`700 16px ${fontFamily}`);
        
        // Check if font is actually available
        const fontAvailable = document.fonts.check(`16px ${fontFamily}`);
        
        if (fontAvailable) {
          setState({
            isLoading: false,
            isLoaded: true,
            hasError: false,
          });
          
          // Add font-loaded class to body for CSS targeting
          document.body.classList.remove('font-loading');
          document.body.classList.add('font-loaded');
        } else {
          throw new Error(`Font '${fontFamily}' not available`);
        }
      } catch (error) {
        setState({
          isLoading: false,
          isLoaded: false,
          hasError: true,
          errorMessage: error instanceof Error ? error.message : 'Font loading failed'
        });
        
        // Use fallback fonts
        document.body.classList.remove('font-loading');
        document.body.classList.add('font-fallback');
      }
    };

    // Set loading state initially
    document.body.classList.add('font-loading');

    // Set timeout for font loading
    timeoutId = setTimeout(() => {
      if (state.isLoading) {
        setState({
          isLoading: false,
          isLoaded: false,
          hasError: true,
          errorMessage: 'Font loading timeout'
        });
        
        document.body.classList.remove('font-loading');
        document.body.classList.add('font-fallback');
      }
    }, fontLoadingConfig.timeout);

    // Start loading
    loadFont();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [fontFamily]);

  return state;
};

// Utility function to preload fonts
export const preloadFont = (fontFamily: string, weight: number = 400): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!('fonts' in document)) {
      reject(new Error('Fonts API not supported'));
      return;
    }

    document.fonts.load(`${weight} 16px ${fontFamily}`)
      .then(() => {
        const isLoaded = document.fonts.check(`${weight} 16px ${fontFamily}`);
        if (isLoaded) {
          resolve();
        } else {
          reject(new Error(`Font ${fontFamily} weight ${weight} not loaded`));
        }
      })
      .catch(reject);
  });
};

// Utility function to check if a font is loaded
export const isFontLoaded = (fontFamily: string, weight: number = 400): boolean => {
  if (!('fonts' in document)) {
    return false;
  }
  
  return document.fonts.check(`${weight} 16px ${fontFamily}`);
};

// Hook for multiple font weights
export const useMultipleFontWeights = (
  fontFamily: string, 
  weights: number[] = [400, 700]
): FontLoadingState => {
  const [state, setState] = useState<FontLoadingState>({
    isLoading: true,
    isLoaded: false,
    hasError: false,
  });

  useEffect(() => {
    if (!('fonts' in document)) {
      setState({
        isLoading: false,
        isLoaded: false,
        hasError: true,
        errorMessage: 'Fonts API not supported'
      });
      return;
    }

    const loadFonts = async () => {
      try {
        // Load all font weights
        const fontPromises = weights.map(weight => 
          document.fonts.load(`${weight} 16px ${fontFamily}`)
        );
        
        await Promise.all(fontPromises);
        
        // Check if all fonts are available
        const allLoaded = weights.every(weight => 
          document.fonts.check(`${weight} 16px ${fontFamily}`)
        );
        
        if (allLoaded) {
          setState({
            isLoading: false,
            isLoaded: true,
            hasError: false,
          });
          
          document.body.classList.remove('font-loading');
          document.body.classList.add('font-loaded');
        } else {
          throw new Error('Some font weights not available');
        }
      } catch (error) {
        setState({
          isLoading: false,
          isLoaded: false,
          hasError: true,
          errorMessage: error instanceof Error ? error.message : 'Font loading failed'
        });
        
        document.body.classList.remove('font-loading');
        document.body.classList.add('font-fallback');
      }
    };

    document.body.classList.add('font-loading');
    loadFonts();
  }, [fontFamily, weights.join(',')]);

  return state;
}; 
export const colorTokens = {
  // Primary brand colors - used consistently across all pages
  primary: {
    50: '#e8f8f5',
    100: '#c6ede4',
    200: '#9fe0d2',
    300: '#77d3bf',
    400: '#5ac9b1',
    500: '#43c3ac',    // Main brand color
    600: '#3cb39a',
    700: '#329f85',
    800: '#288b71',
    900: '#1a6a4f',
  },
  
  // Semantic colors
  semantic: {
    success: '#4caf50',
    warning: '#ff9800', 
    error: '#f44336',
    info: '#2196f3',
  },
  
  // Neutral grays
  neutral: {
    0: '#ffffff',
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  
  // Medical/healthcare specific colors
  medical: {
    cardiology: '#e74c3c',
    nephrology: '#3498db',
    emergency: '#e67e22',
    icu: '#9b59b6',
  },
  
  // About page specific colors
  about: {
    primary: '#43c3ac',      // Border accent color
    backgroundPrimary: '#f9f9f9',  // Card backgrounds
    backgroundSecondary: '#ffffff', // Mission section background
    textPrimary: '#333',     // Headings
    textSecondary: '#555',   // Body text
    border: '#e0e0e0'        // Card borders
  },
} as const; 
import type { FontConfig } from '../types/fonts';

// Font configuration - Updated with your Europa Adobe Fonts kit
export const fontConfig: FontConfig = {
  primary: 'europa',
  fallback: [
    'Inter',
    '-apple-system',
    'BlinkMacSystemFont', 
    'Segoe UI',
    'Roboto',
    'Oxygen',
    'Ubuntu',
    'Cantarell',
    'Fira Sans',
    'Droid Sans',
    'Helvetica Neue',
    'sans-serif'
  ],
  weights: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  }
};

// Font family string for CSS
export const fontFamily = `'${fontConfig.primary}', ${fontConfig.fallback.map(font => 
  font.includes(' ') ? `'${font}'` : font
).join(', ')}`;

// Adobe Fonts configuration (Active - using your kit)
export const adobeFontsConfig = {
  kitId: 'abj6gjp',
  url: 'https://use.typekit.net/abj6gjp.css',
  families: ['europa:n3,n4,n5,n6,n7,n8'] // n = normal, numbers = weights
};

// Self-hosted fonts configuration (Option 2 - for backup)
export const selfHostedFontsConfig = {
  basePath: '/fonts/europa/',
  formats: ['woff2', 'woff'],
  variants: [
    { weight: 300, style: 'normal', filename: 'europa-light' },
    { weight: 400, style: 'normal', filename: 'europa-regular' },
    { weight: 500, style: 'normal', filename: 'europa-medium' },
    { weight: 600, style: 'normal', filename: 'europa-semibold' },
    { weight: 700, style: 'normal', filename: 'europa-bold' },
    { weight: 800, style: 'normal', filename: 'europa-extrabold' }
  ]
};

// Alternative font options (Option 3 - fallbacks)
export const alternativeFonts = {
  inter: "'Inter', system-ui, -apple-system, sans-serif",
  avenir: "'Avenir Next', -apple-system, BlinkMacSystemFont, sans-serif", 
  proximaNova: "'Proxima Nova', -apple-system, BlinkMacSystemFont, sans-serif",
  helvetica: "'Helvetica Neue', Helvetica, Arial, sans-serif"
};

// Font loading status
export const fontLoadingConfig = {
  timeout: 3000, // 3 seconds
  fallbackDelay: 100, // 100ms before showing fallback
};

// Europa font display names for reference
export const europaVariants = {
  light: 'europa, sans-serif',
  regular: 'europa, sans-serif', 
  medium: 'europa, sans-serif',
  semibold: 'europa, sans-serif',
  bold: 'europa, sans-serif',
  extrabold: 'europa, sans-serif'
}; 
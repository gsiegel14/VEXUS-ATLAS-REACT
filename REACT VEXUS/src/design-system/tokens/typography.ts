export const typographyTokens = {
  fontFamilies: {
    primary: "'Europa', 'proxima-nova', 'Helvetica Neue', Arial, sans-serif",
    secondary: "'proxima-nova', 'Helvetica Neue', Arial, sans-serif",
    monospace: '"Fira Code", "Monaco", "Consolas", monospace',
  },
  
  fontSizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
  },
  
  fontWeights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
    about: 1.7,      // Specific line height for about page
  },
} as const; 
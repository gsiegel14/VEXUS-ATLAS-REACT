import { createTheme } from '@mui/material/styles';
import { colorTokens, typographyTokens, spacingTokens } from '../tokens';

// Europa font @font-face declarations
const europaFontCSS = `
@font-face {
  font-family: 'Europa';
  src: url('/fonts/europa/Europa-Regular.woff2') format('woff2'),
       url('/fonts/europa/Europa-Regular.woff') format('woff');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Europa';
  src: url('/fonts/europa/Europa-Light.woff2') format('woff2'),
       url('/fonts/europa/Europa-Light.woff') format('woff');
  font-weight: 300;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Europa';
  src: url('/fonts/europa/Europa-Bold.woff2') format('woff2'),
       url('/fonts/europa/Europa-Bold.woff') format('woff');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
`;

// Inject font CSS into document head
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = europaFontCSS;
  document.head.appendChild(styleElement);
}

export const theme = createTheme({
  palette: {
    primary: {
      main: colorTokens.primary[500],
      light: colorTokens.primary[300],
      dark: colorTokens.primary[700],
    },
    secondary: {
      main: colorTokens.neutral[600],
      light: colorTokens.neutral[400],
      dark: colorTokens.neutral[800],
    },
    background: {
      default: colorTokens.neutral[0],
      paper: colorTokens.neutral[0],
    },
    text: {
      primary: colorTokens.neutral[900],
      secondary: colorTokens.neutral[700],
    },
  },
  
  typography: {
    fontFamily: typographyTokens.fontFamilies.primary,
    h1: {
      fontFamily: typographyTokens.fontFamilies.primary,
      fontSize: '2.2em',
      fontWeight: typographyTokens.fontWeights.normal,
      lineHeight: typographyTokens.lineHeights.tight,
      color: colorTokens.neutral[900],
    },
    h2: {
      fontFamily: typographyTokens.fontFamilies.primary,
      fontSize: '1.8em',
      fontWeight: typographyTokens.fontWeights.normal,
      lineHeight: typographyTokens.lineHeights.tight,
      color: colorTokens.neutral[800],
    },
    h4: {
      fontFamily: typographyTokens.fontFamilies.primary,
      fontSize: '1.8em',
      fontWeight: typographyTokens.fontWeights.semibold,
      lineHeight: typographyTokens.lineHeights.tight,
      color: colorTokens.about.textPrimary,
    },
    body1: {
      fontFamily: typographyTokens.fontFamilies.primary,
      fontSize: typographyTokens.fontSizes.base,
      lineHeight: typographyTokens.lineHeights.relaxed,
      color: colorTokens.neutral[700],
    },
    button: {
      fontFamily: typographyTokens.fontFamilies.primary,
      textTransform: 'none',
      fontWeight: typographyTokens.fontWeights.normal,
    },
  },
  
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 768,
      lg: 980,
      xl: 1200,
    },
  },
  
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: typographyTokens.fontFamilies.primary,
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
          borderRadius: spacingTokens.space[3],
          border: `1px solid ${colorTokens.about.border}`,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
    
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: spacingTokens.space[5],
          paddingRight: spacingTokens.space[5],
          '@media (min-width: 768px)': {
            paddingLeft: spacingTokens.space[6],
            paddingRight: spacingTokens.space[6],
          },
        },
      },
    },
    
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: colorTokens.neutral[900],
          boxShadow: 'none',
          borderBottom: '1px solid #eee',
        },
      },
    },
    
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: typographyTokens.fontFamilies.primary,
        },
      },
    },
  },
}); 
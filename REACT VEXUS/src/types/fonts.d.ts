// Font declarations for TypeScript
declare module '*.woff' {
  const src: string;
  export default src;
}

declare module '*.woff2' {
  const src: string;
  export default src;
}

declare module '*.otf' {
  const src: string;
  export default src;
}

declare module '*.ttf' {
  const src: string;
  export default src;
}

// Extend the CSS font-family property to include our custom fonts
declare module 'csstype' {
  interface Properties {
    fontFamily?: 
      | 'europa'
      | 'europa-light'
      | 'europa-regular' 
      | 'europa-bold'
      | 'Inter'
      | string;
  }
}

// Global font interface
export interface FontConfig {
  primary: string;
  fallback: string[];
  weights: {
    light: number;
    regular: number;
    medium: number;
    semibold: number;
    bold: number;
    extrabold: number;
  };
} 
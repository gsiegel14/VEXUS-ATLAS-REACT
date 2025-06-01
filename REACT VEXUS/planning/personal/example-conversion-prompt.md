# Example: Complete LLM Conversion Prompt

This is an example of how to format a complete prompt to send to a less intelligent LLM for converting an Astro page to React with MUI.

## Complete Prompt Format:

---

**SYSTEM MESSAGE:**
```
[Insert the entire conversion-recipe-system-prompt.md content here - the full system prompt from lines 1-600+]
```

**USER MESSAGE:**
```
Convert the following Astro page to React with MUI following the conversion recipe:

**Astro File Path**: vexus-astro-new copy/src/pages/about.astro

**Astro File Content**:
```astro
---
import VexusLayout from '../layouts/VexusLayout.astro';
---

<VexusLayout title="About - VEXUS ATLAS" useFancybox={true}>
  <slot name="head">
    <!-- SEO Meta Tags -->
    <meta name="description" content="Learn about the VEXUS ATLAS project, our mission to advance venous excess ultrasound imaging, and our team of experts dedicated to improving medical diagnosis and care." />
    <meta name="keywords" content="VEXUS, venous excess, ultrasound, about, medical research, educational resource" />
    
    <!-- OpenGraph Meta Tags -->
    <meta property="og:title" content="About VEXUS ATLAS | Venous Excess Ultrasound Project" />
    <meta property="og:description" content="Learn about the VEXUS ATLAS project, our mission to advance venous excess ultrasound imaging, and our team of experts dedicated to improving medical diagnosis and care." />
    <meta property="og:image" content="https://www.vexusatlas.com/images/vexus-atlas-preview.jpg" />
    <meta property="og:url" content="https://www.vexusatlas.com/about" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="VEXUS ATLAS" />
    
    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="About VEXUS ATLAS | Venous Excess Ultrasound Project" />
    <meta name="twitter:description" content="Learn about the VEXUS ATLAS project, our mission to advance venous excess ultrasound imaging, and our team of experts dedicated to improving medical diagnosis and care." />
    <meta name="twitter:image" content="https://www.vexusatlas.com/images/vexus-atlas-preview.jpg" />
    <style>
      .main-content-about-page {
        padding: 2rem 0;
        text-align: center;
      }
      .content-wrapper-about {
        max-width: 900px;
        margin: 0 auto;
        padding: 0 20px;
        text-align: left;
      }
      .about-section-styled {
        margin-bottom: 2.5rem;
        padding: 1.5rem;
        background-color: #f9f9f9;
        border-radius: 8px;
        border: 1px solid #e0e0e0;
      }
      .about-section-styled.mission-section-white-bg {
        background-color: #ffffff;
      }
      .about-section-styled h1, .about-section-styled h2 {
        color: #333; 
        font-family: "proxima-nova", "Helvetica Neue", Helvetica, Arial, sans-serif;
        margin-bottom: 1rem;
      }
      .about-section-styled h1 {
        font-size: 2.2em;
        text-align: center;
        margin-bottom: 2rem;
      }
      .about-section-styled h2 {
        font-size: 1.8em;
        border-bottom: 2px solid #43c3ac;
        padding-bottom: 0.5rem;
      }
      .about-section-styled p, .about-section-styled ul li {
        font-size: 1rem;
        line-height: 1.7;
        color: #555;
        margin-bottom: 1rem;
      }
      .about-section-styled ul {
        list-style: disc;
        padding-left: 25px;
      }
      .about-section-styled ul li {
        margin-bottom: 0.5rem;
      }
    </style>
  </slot>
  
  <div class="main-content-about-page">
    <div class="content-wrapper-about">
      <h1>About VEXUS ATLAS</h1>

      <div class="about-section-styled mission-section-white-bg">
          <h2>Our Mission</h2>
          <p>VEXUS ATLAS is dedicated to advancing the understanding and application of Venous Excess Ultrasound (VEXUS) in clinical practice. Our mission is to provide healthcare professionals with cutting-edge tools and resources for assessing venous congestion through ultrasound imaging.</p>
      </div>

      <div class="about-section-styled">
          <h2>What We Do</h2>
          <p>We combine artificial intelligence with clinical expertise to:</p>
          <ul>
              <li>Provide automated analysis of VEXUS images</li>
              <li>Offer comprehensive educational resources</li>
              <li>Support healthcare professionals in implementing VEXUS in their practice</li>
              <li>Advance research in venous congestion assessment</li>
          </ul>
      </div>

      <div class="about-section-styled">
          <h2>Our Vision</h2>
          <p>We envision a future where VEXUS assessment becomes a standard tool in critical care and cardiology, enabling better patient outcomes through early detection and monitoring of venous congestion.</p>
      </div>

      <div class="about-section-styled">
          <h2>Innovation in Healthcare</h2>
          <p>By leveraging artificial intelligence and machine learning, we're making VEXUS assessment more accessible, accurate, and efficient. Our platform represents a significant step forward in the integration of technology and clinical practice.</p>
      </div>
    </div>
  </div>

  <script slot="additionalScripts" is:inline>
    document.addEventListener("DOMContentLoaded", function() {
        if (typeof $ === 'object' && typeof $.fn === 'object' && typeof $.fn.fancybox === 'function') {
          console.log("jQuery and jQuery Fancybox v3 detected on about.astro.");
        }
    });
  </script>
</VexusLayout>
```

**Conversion Outline**:
```markdown
# About Page Conversion Outline

## Overview
Convert `about.astro` to a React component with modern styling and functionality.

## Current Structure
- Uses VexusLayout wrapper
- Simple content sections with styled containers
- SEO meta tags in head slot
- Clean, minimal design with content cards

## Conversion Plan

### 1. Component Structure
```jsx
// src/pages/About.jsx
import React from 'react';
import Layout from '../components/Layout';
import SEO from '../components/SEO';

const About = () => {
  return (
    <Layout>
      <SEO 
        title="About - VEXUS ATLAS"
        description="Learn about the VEXUS ATLAS project..."
        keywords="VEXUS, venous excess, ultrasound, about, medical research"
      />
      {/* Content sections */}
    </Layout>
  );
};
```

### 2. Styling Approach
- Convert inline styles to CSS modules or styled-components
- Maintain responsive design patterns
- Use modern CSS features (Grid, Flexbox)

### 3. Key Features to Preserve
- Responsive layout with centered content
- Section-based organization
- Clean typography hierarchy
- Smooth hover effects

### 4. Content Sections
- Mission section with white background
- What We Do section with feature list
- Vision section
- Innovation section

### 5. Responsive Considerations
- Mobile-first approach
- Breakpoints: 768px, 980px
- Flexible typography scaling
- Touch-friendly interactions

### 6. Dependencies
- React Router for navigation
- CSS modules or styled-components
- SEO component for meta tags

### 7. Performance Optimizations
- Lazy loading for images
- Optimized font loading
- Minimal bundle size

## Implementation Notes
- Keep the clean, professional design
- Ensure accessibility compliance
- Maintain brand consistency
- Test across devices and browsers 
```

Please convert this Astro page to a React component with MUI following all the patterns and requirements specified in the system prompt. Ensure all text content, functionality, and visual design are preserved exactly. Pay special attention to:

1. Converting the VexusLayout wrapper to Layout + SEO components
2. Converting the styled sections to MUI Card components
3. Preserving the exact styling including colors (#43c3ac, #f9f9f9, etc.)
4. Maintaining the responsive design patterns
5. Converting the content structure while preserving all text
6. Implementing proper MUI Typography variants for the heading hierarchy
```

---

## Expected Response Format:

The LLM should respond with a complete React component that:

1. **Imports all necessary MUI components**
2. **Preserves all text content exactly**
3. **Converts styling to MUI sx props**
4. **Uses proper MUI component hierarchy**
5. **Includes proper SEO component usage**
6. **Maintains responsive design with MUI breakpoints**

## Sample Expected Output Structure:

```jsx
// src/pages/About.jsx
import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import Layout from '../components/Layout';
import SEO from '../components/SEO';

const About = () => {
  return (
    <Layout>
      <SEO 
        title="About - VEXUS ATLAS"
        description="Learn about the VEXUS ATLAS project, our mission to advance venous excess ultrasound imaging, and our team of experts dedicated to improving medical diagnosis and care."
        keywords="VEXUS, venous excess, ultrasound, about, medical research, educational resource"
        ogTitle="About VEXUS ATLAS | Venous Excess Ultrasound Project"
        ogImage="https://www.vexusatlas.com/images/vexus-atlas-preview.jpg"
        ogUrl="https://www.vexusatlas.com/about"
        twitterCard="summary_large_image"
      />
      
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        {/* Main heading */}
        <Typography variant="h2" component="h1" sx={{ mb: 4, fontSize: '2.2em' }}>
          About VEXUS ATLAS
        </Typography>

        <Box sx={{ textAlign: 'left', maxWidth: 900, mx: 'auto', px: { xs: 2.5, md: 0 } }}>
          {/* Mission section with white background */}
          <Card sx={{ mb: 2.5, backgroundColor: '#ffffff' }}>
            {/* Content sections */}
          </Card>
          
          {/* Other sections */}
        </Box>
      </Container>
    </Layout>
  );
};

export default About;
```

This format ensures the LLM has all the context needed to perform an accurate conversion while following the established patterns from the system prompt. 
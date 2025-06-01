# Homepage Index Conversion Outline

## Overview
Convert `index.astro` to a React homepage component with multi-section layout, product carousel, project gallery, mission video, and interactive elements using Material-UI components.

## Current Structure Analysis
- Multi-section homepage with complex layout system
- Product carousel with navigation controls
- Project gallery with icon-based navigation
- Mission video section with embedded YouTube player
- Shop section with product display and carousel functionality
- Structured data (JSON-LD) for SEO optimization
- Complex grid system with responsive columns
- Content cards with image and text combinations
- App download links and external integrations
- Course promotion and event announcements

## Comprehensive Conversion Framework

### 1. Main Component Architecture & MUI Integration
```jsx
// src/pages/Home.jsx
import React, { useState, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  IconButton,
  useTheme,
  useMediaQuery,
  Divider
} from '@mui/material';
import { ArrowBack, ArrowForward, PlayArrow } from '@mui/icons-material';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import HeroSection from '../components/home/HeroSection';
import ProjectsGallery from '../components/home/ProjectsGallery';
import ProductCarousel from '../components/home/ProductCarousel';
import MissionSection from '../components/home/MissionSection';
import WhatsNewSection from '../components/home/WhatsNewSection';
import OriginsBanner from '../components/home/OriginsBanner';
import { useProductCarousel } from '../hooks/useProductCarousel';
import { homeConfig } from '../config/homeConfig';

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Layout>
      <SEO 
        title="VEXUS ATLAS - Home"
        description="The official homepage for VEXUS ATLAS, a collaborative platform for ultrasound education."
        structuredData={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          "itemListElement": homeConfig.products.map((product, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
              "@type": "Product",
              "name": product.name,
              "image": product.image,
              "url": product.url,
              "offers": {
                "@type": "Offer",
                "price": product.price,
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock"
              }
            }
          }))
        }}
      />
      
      <Box sx={{ bgcolor: 'background.default' }}>
        {/* Hero Section */}
        <HeroSection />
        
        {/* Projects Gallery */}
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
          <ProjectsGallery />
        </Container>

        <Divider sx={{ my: 4 }} />

        {/* Origins Banner */}
        <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
          <OriginsBanner />
        </Container>

        <Divider sx={{ my: 4 }} />

        {/* What's New Section */}
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
          <WhatsNewSection />
        </Container>

        <Divider sx={{ my: 4 }} />

        {/* Shop Section */}
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
              Shop
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
              Buy our POCUS Atlas Merchandise and support our mission for free POCUS education around the world! 
              All proceeds go towards user interface development and maintenance costs for our website.
            </Typography>
          </Box>
          <ProductCarousel />
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button 
              variant="contained" 
              size="large"
              href="https://www.thepocusatlas.com/merch"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit shop
            </Button>
          </Box>
        </Container>

        <Divider sx={{ my: 4 }} />

        {/* Mission Section */}
        <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
          <MissionSection />
        </Container>
      </Box>
    </Layout>
  );
};

export default Home;
```

### 2. Hero Section Component
```jsx
// src/components/home/HeroSection.jsx
import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  useTheme,
  useMediaQuery
} from '@mui/material';

const HeroSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ 
      bgcolor: 'primary.main', 
      color: 'primary.contrastText',
      py: { xs: 6, md: 10 },
      textAlign: 'center'
    }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={2} /> {/* Spacer */}
          <Grid item xs={12} md={8}>
            <Typography 
              variant="h2" 
              component="h1" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold',
                fontSize: { xs: '2.5rem', md: '3.5rem' }
              }}
            >
              A Collaborative Ultrasound Education Platform
            </Typography>
            <Typography 
              variant="h5" 
              component="p" 
              sx={{ 
                mb: 4,
                fontWeight: 'normal',
                opacity: 0.9
              }}
            >
              We create, share, and curate free ultrasound educational content contributed by educators around the world.
            </Typography>
            <Typography 
              variant="h4" 
              component="h2"
              sx={{ 
                fontWeight: 'bold',
                mt: 6
              }}
            >
              Explore Our Projects
            </Typography>
          </Grid>
          <Grid item xs={12} md={2} /> {/* Spacer */}
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroSection;
```

### 3. Projects Gallery Component
```jsx
// src/components/home/ProjectsGallery.jsx
import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Typography,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const projectsData = [
  {
    title: 'Image Atlas',
    icon: '/images/noun-atlas-1479193-453E3E.png',
    link: '/image-atlas',
    description: 'Comprehensive collection of VEXUS ultrasound images'
  },
  {
    title: 'Evidence Atlas',
    icon: '/images/noun-literature-4460602-453E3E.png',
    link: '/literature',
    description: 'Research papers and scientific evidence'
  },
  {
    title: 'Nerve Block Atlas',
    icon: '/images/noun-nerve-4666605-453E3E.png',
    link: '/nerve-blocks',
    description: 'Comprehensive nerve block guidance'
  },
  {
    title: 'Image Review',
    icon: '/images/noun-video-review-4806914-453E3E.png',
    link: '/image-review',
    description: 'Interactive image review and learning'
  }
];

const ProjectsGallery = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={1} /> {/* Spacer */}
        <Grid item xs={12} md={10}>
          <Grid 
            container 
            spacing={{ xs: 2, md: 3 }}
            sx={{ 
              display: 'grid',
              gridTemplateColumns: { 
                xs: 'repeat(2, 1fr)', 
                md: 'repeat(4, 1fr)' 
              },
              gap: 3
            }}
          >
            {projectsData.map((project, index) => (
              <Card 
                key={index}
                elevation={2}
                sx={{
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6
                  }
                }}
              >
                <CardActionArea 
                  component={RouterLink}
                  to={project.link}
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    p: 3,
                    textAlign: 'center'
                  }}
                >
                  <Box
                    component="img"
                    src={project.icon}
                    alt={project.title}
                    sx={{
                      width: { xs: 60, md: 80 },
                      height: { xs: 60, md: 80 },
                      mb: 2,
                      objectFit: 'contain'
                    }}
                  />
                  <Typography 
                    variant="h6" 
                    component="h3"
                    sx={{ 
                      fontWeight: 'bold',
                      color: 'text.primary',
                      fontSize: { xs: '1rem', md: '1.25rem' }
                    }}
                  >
                    {project.title}
                  </Typography>
                  {!isMobile && (
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      {project.description}
                    </Typography>
                  )}
                </CardActionArea>
              </Card>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={12} md={1} /> {/* Spacer */}
      </Grid>
    </Box>
  );
};

export default ProjectsGallery;
```

### 4. Product Carousel Component
```jsx
// src/components/home/ProductCarousel.jsx
import React, { useRef, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const productsData = [
  {
    id: 1,
    name: 'POCUS IS LIFE! - Dark Logo',
    price: '$25.00',
    image: '/images/unisex-tri-blend-t-shirt-oatmeal-triblend-front-647a91c607f51.jpg',
    url: '/merch/pocus-is-life-dark-logo'
  },
  {
    id: 2,
    name: 'POCUS IS LIFE! - Light Logo',
    price: '$25.00',
    image: '/images/unisex-tri-blend-t-shirt-charcoal-black-triblend-front-647a921f84b40.jpg',
    url: '/merch/pocus-is-life-light-logo'
  },
  {
    id: 3,
    name: 'POCUS Atlas T-Shirt (Cream Logo)',
    price: '$25.00',
    image: '/images/unisex-tri-blend-t-shirt-charcoal-black-triblend-front-614d330957412.jpg',
    url: '/merch/pocus-atlas-t-shirt-cream-logo'
  },
  {
    id: 4,
    name: 'Sonophile T-shirt!',
    price: '$25.00',
    image: '/images/unisex-tri-blend-t-shirt-oatmeal-triblend-front-602eb4adeeb2f.jpg',
    url: '/merch/sonophile-t-shirt'
  },
  {
    id: 5,
    name: 'The POCUS Atlas Mug',
    price: '$20.00',
    image: '/images/ceramic-mug-15oz-white-647a93493685c.jpg',
    url: '/merch/the-pocus-atlas-mug'
  }
];

const ProductCarousel = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const itemWidth = isMobile ? 280 : 320;

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -itemWidth : itemWidth;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      
      // Update button states after scroll
      setTimeout(() => {
        updateScrollButtons();
      }, 300);
    }
  };

  const updateScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  return (
    <Box sx={{ position: 'relative' }}>
      {/* Navigation Buttons */}
      <IconButton
        onClick={() => scroll('left')}
        disabled={!canScrollLeft}
        sx={{
          position: 'absolute',
          left: -20,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 2,
          bgcolor: 'background.paper',
          boxShadow: 2,
          '&:hover': { bgcolor: 'grey.100' },
          '&:disabled': { opacity: 0.3 }
        }}
      >
        <ArrowBack />
      </IconButton>

      <IconButton
        onClick={() => scroll('right')}
        disabled={!canScrollRight}
        sx={{
          position: 'absolute',
          right: -20,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 2,
          bgcolor: 'background.paper',
          boxShadow: 2,
          '&:hover': { bgcolor: 'grey.100' },
          '&:disabled': { opacity: 0.3 }
        }}
      >
        <ArrowForward />
      </IconButton>

      {/* Products Container */}
      <Box
        ref={scrollRef}
        onScroll={updateScrollButtons}
        sx={{
          display: 'flex',
          overflowX: 'auto',
          gap: 2,
          py: 2,
          px: 1,
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' }
        }}
      >
        {productsData.map((product) => (
          <Card
            key={product.id}
            elevation={2}
            sx={{
              minWidth: itemWidth,
              maxWidth: itemWidth,
              transition: 'transform 0.2s ease',
              '&:hover': { transform: 'scale(1.02)' }
            }}
          >
            <CardMedia
              component={RouterLink}
              to={product.url}
              sx={{ textDecoration: 'none', display: 'block' }}
            >
              <Box
                component="img"
                src={product.image}
                alt={product.name}
                sx={{
                  width: '100%',
                  height: 240,
                  objectFit: 'contain',
                  p: 2,
                  bgcolor: 'grey.50'
                }}
              />
            </CardMedia>
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <Typography 
                variant="h6" 
                component="h3"
                sx={{ 
                  fontSize: '1rem',
                  fontWeight: 'medium',
                  mb: 1,
                  minHeight: 48,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {product.name}
              </Typography>
              <Typography 
                variant="body1" 
                color="primary.main"
                sx={{ fontWeight: 'bold' }}
              >
                {product.price}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default ProductCarousel;
```

### 5. What's New Section Component
```jsx
// src/components/home/WhatsNewSection.jsx
import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Link as MuiLink,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Launch } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const newsItems = [
  {
    id: 1,
    title: 'POCUS Atlas Jr Project',
    description: 'We are building the first ever free, open-access pediatric POCUS Atlas! This atlas will be available to use for education around the world. We need your help on this project, find out how you can contribute below.',
    image: '/images/The-POCUS-ATLAS-110.jpg',
    link: '/atlas-jr',
    linkText: 'Learn more',
    imagePosition: 'left'
  },
  {
    id: 2,
    title: 'Get the App!',
    description: 'The POCUS Image Atlas is now available in app form! Download on either iOS or Android!',
    image: '/images/noun-apps-914827-453E3E.jpg',
    imagePosition: 'right',
    customActions: true,
    appLinks: {
      ios: 'https://apps.apple.com/us/app/the-pocus-atlas/id1603683100?platform=iphone',
      android: 'https://play.google.com/store/apps/details?id=com.globalpocuspartners.pocusAtlas'
    }
  },
  {
    id: 3,
    title: 'Live Course in San Diego!',
    description: 'Want to come to an awesome POCUS course in San Diego? Check out our NextGen POCUS: Beyond Essentials for Acute Care Course scheduled for November 6th-8th, 2024!',
    image: '/images/IMG_2864_LR-1.jpg',
    link: 'https://www.soundandsurf.com',
    linkText: 'Learn more',
    external: true,
    imagePosition: 'left'
  }
];

const WhatsNewSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box>
      <Typography 
        variant="h3" 
        component="h2" 
        align="center" 
        gutterBottom
        sx={{ fontWeight: 'bold', mb: 6 }}
      >
        What's New
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={2} /> {/* Spacer */}
        <Grid item xs={12} md={8}>
          {newsItems.map((item) => (
            <Card 
              key={item.id}
              elevation={2}
              sx={{ 
                mb: 4,
                overflow: 'hidden',
                '&:hover': {
                  boxShadow: 4,
                  transform: 'translateY(-2px)',
                  transition: 'all 0.3s ease'
                }
              }}
            >
              <Grid 
                container 
                sx={{ 
                  flexDirection: { 
                    xs: 'column', 
                    md: item.imagePosition === 'right' ? 'row-reverse' : 'row' 
                  }
                }}
              >
                {/* Image */}
                <Grid item xs={12} md={5}>
                  <CardMedia
                    component="img"
                    image={item.image}
                    alt={item.title}
                    sx={{
                      height: { xs: 200, md: 250 },
                      objectFit: 'cover'
                    }}
                  />
                </Grid>

                {/* Content */}
                <Grid item xs={12} md={7}>
                  <CardContent sx={{ 
                    p: { xs: 2, md: 3 },
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}>
                    <Typography 
                      variant="h5" 
                      component="h3" 
                      gutterBottom
                      sx={{ fontWeight: 'bold', color: 'primary.main' }}
                    >
                      {item.title}
                    </Typography>
                    
                    <Typography 
                      variant="body1" 
                      paragraph
                      sx={{ lineHeight: 1.6, mb: 3 }}
                    >
                      {item.description}
                    </Typography>

                    {/* Actions */}
                    <Box sx={{ mt: 'auto' }}>
                      {item.customActions && item.appLinks ? (
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                          <Button
                            variant="contained"
                            startIcon={<Launch />}
                            href={item.appLinks.ios}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            iOS
                          </Button>
                          <Button
                            variant="outlined"
                            startIcon={<Launch />}
                            href={item.appLinks.android}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Android
                          </Button>
                        </Box>
                      ) : (
                        <Button
                          variant="contained"
                          component={item.external ? 'a' : RouterLink}
                          to={item.external ? undefined : item.link}
                          href={item.external ? item.link : undefined}
                          target={item.external ? '_blank' : undefined}
                          rel={item.external ? 'noopener noreferrer' : undefined}
                          startIcon={item.external ? <Launch /> : undefined}
                        >
                          {item.linkText}
                        </Button>
                      )}
                    </Box>
                  </CardContent>
                </Grid>
              </Grid>
            </Card>
          ))}
        </Grid>
        <Grid item xs={12} md={2} /> {/* Spacer */}
      </Grid>
    </Box>
  );
};

export default WhatsNewSection;
```

### 6. Mission Section Component
```jsx
// src/components/home/MissionSection.jsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { PlayArrow, Pause } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const MissionSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography 
        variant="h3" 
        component="h2" 
        gutterBottom
        sx={{ fontWeight: 'bold', mb: 4 }}
      >
        Our Mission
      </Typography>

      {/* Video Container */}
      <Paper 
        elevation={3}
        sx={{ 
          position: 'relative',
          paddingBottom: '56.25%', // 16:9 aspect ratio
          height: 0,
          overflow: 'hidden',
          borderRadius: 2,
          mb: 3
        }}
      >
        <Box
          component="iframe"
          src="https://www.youtube.com/embed/GdjEOhIZzuw"
          title="POCUS Atlas Mission"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 'none'
          }}
        />
      </Paper>

      <Button
        variant="contained"
        size="large"
        component={RouterLink}
        to="/contribute"
        sx={{ mt: 2 }}
      >
        Learn more
      </Button>
    </Box>
  );
};

export default MissionSection;
```

### 7. Origins Banner Component
```jsx
// src/components/home/OriginsBanner.jsx
import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery
} from '@mui/material';

const OriginsBanner = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={2} /> {/* Spacer */}
      <Grid item xs={12} md={8}>
        <Card 
          elevation={2}
          sx={{ 
            bgcolor: 'grey.50',
            border: `1px solid ${theme.palette.divider}`
          }}
        >
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              {/* Logo */}
              <Grid item xs={12} md={4}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center',
                  alignItems: 'center',
                  p: 2
                }}>
                  <Box
                    component="img"
                    src="/images/the-pocus-atlas-logo.png"
                    alt="The POCUS Atlas Logo"
                    sx={{
                      maxWidth: { xs: 150, md: 180 },
                      maxHeight: { xs: 150, md: 180 },
                      width: 'auto',
                      height: 'auto',
                      objectFit: 'contain',
                      borderRadius: 1
                    }}
                  />
                </Box>
              </Grid>

              {/* Content */}
              <Grid item xs={12} md={8}>
                <Typography 
                  variant="h5" 
                  component="h3" 
                  gutterBottom
                  sx={{ 
                    fontWeight: 'bold',
                    color: 'primary.main',
                    fontSize: { xs: '1.25rem', md: '1.5rem' }
                  }}
                >
                  Our Origins
                </Typography>
                <Typography 
                  variant="body1"
                  sx={{ 
                    lineHeight: 1.6,
                    fontSize: { xs: '0.95rem', md: '1rem' }
                  }}
                >
                  VEXUS ATLAS is an off-shoot of The POCUS ATLAS focused on the pulse-wave 
                  doppler and the advancement of the Venous Excess Ultrasound Protocol.
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={2} /> {/* Spacer */}
    </Grid>
  );
};

export default OriginsBanner;
```

### 8. Configuration & Data Management

#### Home Configuration
```javascript
// src/config/homeConfig.js
export const homeConfig = {
  products: [
    {
      id: 1,
      name: 'POCUS IS LIFE! - Dark Logo',
      price: '25.00',
      image: '/images/unisex-tri-blend-t-shirt-oatmeal-triblend-front-647a91c607f51.jpg',
      url: '/merch/pocus-is-life-dark-logo'
    },
    {
      id: 2,
      name: 'POCUS IS LIFE! - Light Logo', 
      price: '25.00',
      image: '/images/unisex-tri-blend-t-shirt-charcoal-black-triblend-front-647a921f84b40.jpg',
      url: '/merch/pocus-is-life-light-logo'
    },
    {
      id: 3,
      name: 'POCUS Atlas T-Shirt (Cream Logo)',
      price: '25.00',
      image: '/images/unisex-tri-blend-t-shirt-charcoal-black-triblend-front-614d330957412.jpg',
      url: '/merch/pocus-atlas-t-shirt-cream-logo'
    },
    {
      id: 4,
      name: 'Sonophile T-shirt!',
      price: '25.00',
      image: '/images/unisex-tri-blend-t-shirt-oatmeal-triblend-front-602eb4adeeb2f.jpg',
      url: '/merch/sonophile-t-shirt'
    },
    {
      id: 5,
      name: 'The POCUS Atlas Mug',
      price: '20.00',
      image: '/images/ceramic-mug-15oz-white-647a93493685c.jpg',
      url: '/merch/the-pocus-atlas-mug'
    }
  ],

  projects: [
    {
      title: 'Image Atlas',
      icon: '/images/noun-atlas-1479193-453E3E.png',
      link: '/image-atlas',
      description: 'Comprehensive collection of VEXUS ultrasound images'
    },
    {
      title: 'Evidence Atlas', 
      icon: '/images/noun-literature-4460602-453E3E.png',
      link: '/literature',
      description: 'Research papers and scientific evidence'
    },
    {
      title: 'Nerve Block Atlas',
      icon: '/images/noun-nerve-4666605-453E3E.png', 
      link: '/nerve-blocks',
      description: 'Comprehensive nerve block guidance'
    },
    {
      title: 'Image Review',
      icon: '/images/noun-video-review-4806914-453E3E.png',
      link: '/image-review', 
      description: 'Interactive image review and learning'
    }
  ]
};
```

### 9. Performance Optimizations & Hooks

#### useProductCarousel Hook
```jsx
// src/hooks/useProductCarousel.js
import { useState, useRef, useCallback, useEffect } from 'react';

export const useProductCarousel = (itemWidth = 320) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollButtons = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  const scroll = useCallback((direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -itemWidth : itemWidth;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      
      setTimeout(() => {
        updateScrollButtons();
      }, 300);
    }
  }, [itemWidth, updateScrollButtons]);

  // Auto-update scroll buttons on resize
  useEffect(() => {
    const handleResize = () => updateScrollButtons();
    window.addEventListener('resize', handleResize);
    
    // Initial check
    setTimeout(updateScrollButtons, 100);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [updateScrollButtons]);

  return {
    scrollRef,
    canScrollLeft,
    canScrollRight,
    scroll,
    updateScrollButtons
  };
};
```

### 10. Dependencies & Implementation Priority

#### Dependencies
```json
{
  "dependencies": {
    "@mui/material": "^5.x.x",
    "@mui/icons-material": "^5.x.x", 
    "@emotion/react": "^11.x.x",
    "@emotion/styled": "^11.x.x",
    "react": "^18.x.x",
    "react-dom": "^18.x.x",
    "react-router-dom": "^6.x.x"
  }
}
```

#### Implementation Priority
1. **Core Layout Structure** (Container, Grid, main sections)
2. **Hero Section** (Typography, responsive design)
3. **Projects Gallery** (Card grid, navigation links)
4. **Product Carousel** (Scrollable container, navigation)
5. **What's New Section** (Content cards with mixed layouts)
6. **Mission Section** (Video embed, responsive container)
7. **Origins Banner** (Logo and content integration)
8. **Performance Optimizations** (Carousel interactions, image loading)

### 11. Testing Strategy

```javascript
// src/components/home/__tests__/ProductCarousel.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ProductCarousel from '../ProductCarousel';

const theme = createTheme();

describe('ProductCarousel', () => {
  test('renders product items', () => {
    render(
      <ThemeProvider theme={theme}>
        <ProductCarousel />
      </ThemeProvider>
    );
    
    expect(screen.getByText('POCUS IS LIFE! - Dark Logo')).toBeInTheDocument();
    expect(screen.getByText('$25.00')).toBeInTheDocument();
  });

  test('navigation buttons work correctly', () => {
    render(
      <ThemeProvider theme={theme}>
        <ProductCarousel />
      </ThemeProvider>
    );
    
    const rightButton = screen.getByRole('button', { name: /arrow forward/i });
    fireEvent.click(rightButton);
    
    // Verify scroll behavior
  });
});
```

### 12. SEO & Performance Considerations

- **Structured Data**: Product schema for shop items
- **Image Optimization**: WebP formats with fallbacks, lazy loading
- **Performance**: Virtualized carousel for large product lists
- **Accessibility**: Proper ARIA labels, keyboard navigation
- **Mobile Optimization**: Touch-friendly carousels and responsive grids

This comprehensive framework provides a robust foundation for converting the complex index.astro homepage to a modern React application with Material-UI, maintaining all functionality while improving performance and user experience. 
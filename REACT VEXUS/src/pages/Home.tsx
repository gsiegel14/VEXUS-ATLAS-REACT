import React, { useEffect } from 'react';
import { Box, Divider } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import BaseLayout from '../components/templates/BaseLayout/BaseLayout';
import HeroSection from '../components/pages/home/HeroSection';
import ProjectsGallery from '../components/pages/home/ProjectsGallery';
import OriginsBanner from '../components/pages/home/OriginsBanner';
import WhatsNewSection from '../components/pages/home/WhatsNewSection';
import ProductCarousel from '../components/pages/home/ProductCarousel';
import MissionSection from '../components/pages/home/MissionSection';
import { homeConfig } from '../config/homeConfig';

const Home: React.FC = () => {
  // Initialize content display functionality from original
  useEffect(() => {
    // Force content display after a short delay in case body.is-loaded doesn't get applied
    const timer = setTimeout(() => {
      const mainContent = document.querySelector('.main-content');
      if (mainContent) {
        (mainContent as HTMLElement).style.opacity = '1';
        (mainContent as HTMLElement).style.visibility = 'visible';
      }
      document.body.classList.add('is-loaded');
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <BaseLayout pageTitle="VEXUS ATLAS - Home">
      <Helmet>
        <title>VEXUS ATLAS - Home</title>
        <meta name="description" content="The official homepage for VEXUS ATLAS, a collaborative platform for ultrasound education." />
        
        {/* Structured Data - exact from original */}
        <script type="application/ld+json">
          {JSON.stringify(homeConfig.structuredData)}
        </script>

        {/* Google Analytics - Keep as it might be page-specific */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=UA-110093936-1"></script>
        <script>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'UA-110093936-1');
          `}
        </script>
      </Helmet>

      <Box 
        className="main-content" 
        sx={{ 
          textAlign: 'center',
          opacity: 0,
          visibility: 'hidden',
          transition: 'opacity 0.3s ease, visibility 0.3s ease'
        }}
      >
        {/* Hero Section */}
        <HeroSection />
        
        {/* Projects Gallery */}
        <ProjectsGallery />
        
        <Divider sx={{ my: 4 }} />

        {/* Origins Banner */}
        <OriginsBanner />
        
        <Divider sx={{ my: 4 }} />

        {/* What's New Section */}
        <WhatsNewSection />

        <Divider sx={{ my: 4 }} />

        {/* Shop Section */}
        <ProductCarousel />

        <Divider sx={{ my: 4 }} />

        {/* Mission Section */}
        <MissionSection />
      </Box>
    </BaseLayout>
  );
};

export default Home; 
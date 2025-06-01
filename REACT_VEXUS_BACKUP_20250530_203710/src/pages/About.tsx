import React from 'react';
import { Helmet } from 'react-helmet-async';
import BaseLayout from '../components/templates/BaseLayout';
import AboutPageContent from '../components/pages/About/AboutPageContent';

const AboutPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>About - VEXUS ATLAS</title>
        <meta 
          name="description" 
          content="Learn about the VEXUS ATLAS project, our mission to advance venous excess ultrasound imaging, and our team of experts dedicated to improving medical diagnosis and care." 
        />
        <meta 
          name="keywords" 
          content="VEXUS, venous excess, ultrasound, about, medical research, educational resource" 
        />
        
        {/* OpenGraph Meta Tags */}
        <meta property="og:title" content="About VEXUS ATLAS | Venous Excess Ultrasound Project" />
        <meta 
          property="og:description" 
          content="Learn about the VEXUS ATLAS project, our mission to advance venous excess ultrasound imaging, and our team of experts dedicated to improving medical diagnosis and care." 
        />
        <meta property="og:image" content="https://www.vexusatlas.com/images/vexus-atlas-preview.jpg" />
        <meta property="og:url" content="https://www.vexusatlas.com/about" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="VEXUS ATLAS" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About VEXUS ATLAS | Venous Excess Ultrasound Project" />
        <meta 
          name="twitter:description" 
          content="Learn about the VEXUS ATLAS project, our mission to advance venous excess ultrasound imaging, and our team of experts dedicated to improving medical diagnosis and care." 
        />
        <meta name="twitter:image" content="https://www.vexusatlas.com/images/vexus-atlas-preview.jpg" />
      </Helmet>

      <BaseLayout 
        pageTitle="About VEXUS ATLAS"
      >
        <AboutPageContent />
      </BaseLayout>
    </>
  );
};

export default AboutPage;

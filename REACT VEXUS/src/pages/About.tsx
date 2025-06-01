import React from 'react';
import BaseLayout from '../components/templates/BaseLayout';
import AboutPageContent from '../components/pages/About/AboutPageContent';
import SEO from '../components/common/SEO/SEO';

const AboutPage: React.FC = () => {
  const aboutPageSEO = {
    title: "About - VEXUS ATLAS",
    description: "Learn about the VEXUS ATLAS project, our mission to advance venous excess ultrasound imaging, and our team of experts dedicated to improving medical diagnosis and care.",
    keywords: "VEXUS, venous excess, ultrasound, about, medical research, educational resource",
    ogTitle: "About VEXUS ATLAS | Venous Excess Ultrasound Project",
    ogDescription: "Learn about the VEXUS ATLAS project, our mission to advance venous excess ultrasound imaging, and our team of experts dedicated to improving medical diagnosis and care.",
    ogImage: "https://www.vexusatlas.com/images/vexus-atlas-preview.jpg",
    ogUrl: "https://www.vexusatlas.com/about",
    ogType: "website",
    ogSiteName: "VEXUS ATLAS",
    twitterCard: "summary_large_image",
    twitterTitle: "About VEXUS ATLAS | Venous Excess Ultrasound Project",
    twitterDescription: "Learn about the VEXUS ATLAS project, our mission to advance venous excess ultrasound imaging, and our team of experts dedicated to improving medical diagnosis and care.",
    twitterImage: "https://www.vexusatlas.com/images/vexus-atlas-preview.jpg",
    canonicalUrl: "https://www.vexusatlas.com/about",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "name": "About VEXUS ATLAS",
      "description": "Learn about the VEXUS ATLAS project and our mission to advance venous excess ultrasound imaging.",
      "mainEntity": {
        "@type": "Organization",
        "name": "VEXUS ATLAS",
        "description": "Platform for venous excess ultrasound assessment and education"
      }
    }
  };

  return (
    <>
      <SEO {...aboutPageSEO} />
      <BaseLayout pageTitle="About VEXUS ATLAS">
        <AboutPageContent />
      </BaseLayout>
    </>
  );
};

export default AboutPage;

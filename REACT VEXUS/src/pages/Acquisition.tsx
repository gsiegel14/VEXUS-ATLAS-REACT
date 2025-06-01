import React from 'react';
import BaseLayout from '../components/templates/BaseLayout';
import AcquisitionPageContent from '../components/pages/Acquisition/AcquisitionPageContent';
import SEO from '../components/common/SEO/SEO';

const Acquisition: React.FC = () => {
  const acquisitionPageSEO = {
    title: "Acquisition - VEXUS ATLAS",
    description: "Learn the complete VEXUS (Venous Excess UltraSound) image acquisition protocol. Step-by-step guidance for obtaining high-quality ultrasound images for venous congestion assessment.",
    keywords: "VEXUS, image acquisition, ultrasound protocol, venous excess, image collection, clinical technique",
    ogTitle: "VEXUS Image Acquisition Protocol | VEXUS ATLAS",
    ogDescription: "Learn the complete VEXUS (Venous Excess UltraSound) image acquisition protocol. Step-by-step guidance for obtaining high-quality ultrasound images for venous congestion assessment.",
    ogImage: "https://www.vexusatlas.com/images/vexus-acquisition-preview.jpg",
    ogUrl: "https://www.vexusatlas.com/acquisition",
    ogType: "website",
    ogSiteName: "VEXUS ATLAS",
    twitterCard: "summary_large_image",
    twitterTitle: "VEXUS Image Acquisition Protocol | VEXUS ATLAS",
    twitterDescription: "Learn the complete VEXUS (Venous Excess UltraSound) image acquisition protocol. Step-by-step guidance for obtaining high-quality ultrasound images for venous congestion assessment.",
    twitterImage: "https://www.vexusatlas.com/images/vexus-acquisition-preview.jpg",
    canonicalUrl: "https://www.vexusatlas.com/acquisition",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      "name": "VEXUS Image Acquisition Protocol",
      "description": "Complete protocol for acquiring VEXUS ultrasound images for venous congestion assessment.",
      "mainEntity": {
        "@type": "HowTo",
        "name": "VEXUS Image Acquisition",
        "description": "Step-by-step protocol for ultrasound image acquisition in VEXUS assessment"
      }
    }
  };

  return (
    <>
      <SEO {...acquisitionPageSEO} />
      <BaseLayout pageTitle="Acquisition" containerMaxWidth="xl">
        <AcquisitionPageContent />
      </BaseLayout>
    </>
  );
};

export default Acquisition; 
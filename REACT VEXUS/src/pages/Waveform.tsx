import React from 'react';
import BaseLayout from '../components/templates/BaseLayout';
import WaveformPageContent from '../components/pages/Waveform/WaveformPageContent';
import SEO from '../components/common/SEO/SEO';

const Waveform: React.FC = () => {
  const waveformPageSEO = {
    title: "Waveforms - VEXUS ATLAS",
    description: "Explore VEXUS ultrasound waveform patterns and learn how to interpret different venous flow signatures for improved diagnosis and patient care.",
    keywords: "VEXUS, waveforms, ultrasound patterns, venous flow, interpretation, medical imaging, diagnosis",
    ogTitle: "VEXUS Waveforms | Patterns & Interpretation Guide",
    ogDescription: "Explore VEXUS ultrasound waveform patterns and learn how to interpret different venous flow signatures for improved diagnosis and patient care.",
    ogImage: "https://www.vexusatlas.com/images/vexus-waveform-preview.jpg",
    ogUrl: "https://www.vexusatlas.com/waveform",
    ogType: "website",
    ogSiteName: "VEXUS ATLAS",
    twitterCard: "summary_large_image",
    twitterTitle: "VEXUS Waveforms | Patterns & Interpretation Guide",
    twitterDescription: "Explore VEXUS ultrasound waveform patterns and learn how to interpret different venous flow signatures for improved diagnosis and patient care.",
    twitterImage: "https://www.vexusatlas.com/images/vexus-waveform-preview.jpg",
    canonicalUrl: "https://www.vexusatlas.com/waveform",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      "name": "VEXUS Waveform Patterns",
      "description": "Comprehensive guide to interpreting VEXUS ultrasound waveform patterns for venous congestion assessment.",
      "mainEntity": {
        "@type": "Guide",
        "name": "VEXUS Waveform Interpretation",
        "description": "Educational guide for interpreting venous ultrasound waveform patterns in VEXUS assessment"
      }
    }
  };

  return (
    <>
      <SEO {...waveformPageSEO} />
      <BaseLayout pageTitle="Waveforms" containerMaxWidth="xl">
        <WaveformPageContent />
      </BaseLayout>
    </>
  );
};

export default Waveform; 
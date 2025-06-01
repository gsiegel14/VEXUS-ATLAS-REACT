import React from 'react';
import BaseLayout from '../components/templates/BaseLayout';
import LiteraturePageContent from '../components/pages/Literature/LiteraturePageContent';
import SEO from '../components/common/SEO/SEO';

const Literature: React.FC = () => {
  const literaturePageSEO = {
    title: "Literature Review - VEXUS ATLAS",
    description: "Comprehensive literature review on VEXUS (Venous Excess UltraSound) methodology, research findings, and clinical applications. Stay updated with the latest scientific developments.",
    keywords: "VEXUS, literature review, research, scientific papers, venous excess, ultrasound, medical literature",
    ogTitle: "VEXUS Literature Review | Latest Research & Findings",
    ogDescription: "Comprehensive literature review on VEXUS (Venous Excess UltraSound) methodology, research findings, and clinical applications. Stay updated with the latest scientific developments.",
    ogImage: "https://www.vexusatlas.com/images/vexus-literature-preview.jpg",
    ogUrl: "https://www.vexusatlas.com/literature",
    ogType: "website",
    ogSiteName: "VEXUS ATLAS",
    twitterCard: "summary_large_image",
    twitterTitle: "VEXUS Literature Review | Latest Research & Findings",
    twitterDescription: "Comprehensive literature review on VEXUS (Venous Excess UltraSound) methodology, research findings, and clinical applications. Stay updated with the latest scientific developments.",
    twitterImage: "https://www.vexusatlas.com/images/vexus-literature-preview.jpg",
    canonicalUrl: "https://www.vexusatlas.com/literature",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "ScholarlyArticle",
      "name": "VEXUS Literature Review",
      "description": "Comprehensive literature review on VEXUS methodology and research findings.",
      "mainEntity": {
        "@type": "Review",
        "name": "VEXUS Literature Analysis",
        "description": "Analysis of peer-reviewed research on Venous Excess Ultrasound methodology",
        "author": {
          "@type": "Organization",
          "name": "VEXUS ATLAS"
        }
      }
    }
  };

  return (
    <>
      <SEO {...literaturePageSEO} />
      <BaseLayout pageTitle="Literature" containerMaxWidth="xl">
        <LiteraturePageContent />
      </BaseLayout>
    </>
  );
};

export default Literature; 
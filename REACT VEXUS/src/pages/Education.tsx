import React from 'react';
import BaseLayout from '../components/templates/BaseLayout';
import EducationPageContent from '../components/pages/Education/EducationPageContent';
import SEO from '../components/common/SEO/SEO';

const Education: React.FC = () => {
  const educationPageSEO = {
    title: "Education - VEXUS ATLAS",
    description: "Comprehensive educational resources for learning VEXUS (Venous Excess UltraSound) methodology. Interactive modules, case studies, and clinical guidance for healthcare professionals.",
    keywords: "VEXUS, education, learning modules, training, venous excess, ultrasound education, clinical skills",
    ogTitle: "VEXUS Education & Training | VEXUS ATLAS",
    ogDescription: "Comprehensive educational resources for learning VEXUS (Venous Excess UltraSound) methodology. Interactive modules, case studies, and clinical guidance for healthcare professionals.",
    ogImage: "https://www.vexusatlas.com/images/vexus-education-preview.jpg",
    ogUrl: "https://www.vexusatlas.com/education",
    ogType: "website",
    ogSiteName: "VEXUS ATLAS",
    twitterCard: "summary_large_image",
    twitterTitle: "VEXUS Education & Training | VEXUS ATLAS",
    twitterDescription: "Comprehensive educational resources for learning VEXUS (Venous Excess UltraSound) methodology. Interactive modules, case studies, and clinical guidance for healthcare professionals.",
    twitterImage: "https://www.vexusatlas.com/images/vexus-education-preview.jpg",
    canonicalUrl: "https://www.vexusatlas.com/education",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "name": "VEXUS Education Program",
      "description": "Educational platform for learning Venous Excess Ultrasound assessment.",
      "mainEntity": {
        "@type": "Course",
        "name": "VEXUS Training Program",
        "description": "Comprehensive training program for VEXUS ultrasound methodology"
      }
    }
  };

  return (
    <>
      <SEO {...educationPageSEO} />
      <BaseLayout pageTitle="Education" containerMaxWidth="xl">
        <EducationPageContent />
      </BaseLayout>
    </>
  );
};

export default Education; 
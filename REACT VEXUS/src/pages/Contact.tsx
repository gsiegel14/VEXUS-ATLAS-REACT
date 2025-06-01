import React from 'react';
import BaseLayout from '../components/templates/BaseLayout';
import ContactPageContent from '../components/pages/Contact/ContactPageContent';
import SEO from '../components/common/SEO/SEO';

const Contact: React.FC = () => {
  const contactPageSEO = {
    title: "Contact - VEXUS ATLAS",
    description: "Contact the VEXUS ATLAS team with questions, research inquiries, or collaboration opportunities. We're happy to discuss VEXUS methodology and applications.",
    keywords: "VEXUS, contact, support, venous excess, ultrasound, research team, collaboration",
    ogTitle: "Contact Us | VEXUS ATLAS",
    ogDescription: "Contact the VEXUS ATLAS team with questions, research inquiries, or collaboration opportunities. We're happy to discuss VEXUS methodology and applications.",
    ogImage: "https://www.vexusatlas.com/images/vexus-contact-preview.jpg",
    ogUrl: "https://www.vexusatlas.com/contact",
    ogType: "website",
    ogSiteName: "VEXUS ATLAS",
    twitterCard: "summary_large_image",
    twitterTitle: "Contact Us | VEXUS ATLAS",
    twitterDescription: "Contact the VEXUS ATLAS team with questions, research inquiries, or collaboration opportunities. We're happy to discuss VEXUS methodology and applications.",
    twitterImage: "https://www.vexusatlas.com/images/vexus-contact-preview.jpg",
    canonicalUrl: "https://www.vexusatlas.com/contact",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "name": "Contact VEXUS ATLAS",
      "description": "Contact information and form for VEXUS ATLAS research team.",
      "mainEntity": {
        "@type": "Organization",
        "name": "VEXUS ATLAS",
        "description": "Venous Excess Ultrasound research and education platform",
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "contact form",
          "contactType": "customer service",
          "areaServed": "Global",
          "availableLanguage": "English"
        }
      }
    }
  };

  return (
    <>
      <SEO {...contactPageSEO} />
      <BaseLayout pageTitle="Contact" containerMaxWidth="lg">
        <ContactPageContent />
      </BaseLayout>
    </>
  );
};

export default Contact; 
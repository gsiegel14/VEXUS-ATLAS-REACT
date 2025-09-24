export interface WorkingProject {
  title: string;
  subtitle?: string;
  description: string;
  link?: string;
  ctaLabel?: string;
  logoSrc: string;
  status: string;
  focusAreas: string[];
  logoBackground?: string;
  logoBorderColor?: string;
}

export const workingProjects: WorkingProject[] = [
  {
    title: 'The POCUS Atlas',
    subtitle: 'Global Point-of-Care Ultrasound Resource',
    description:
      'A clinician-led library of point-of-care ultrasound cases, protocols, and teaching assets designed to accelerate bedside learning for emergency and critical care teams.',
    link: 'https://www.thepocusatlas.com/',
    ctaLabel: 'Explore the Atlas',
    logoSrc: '/images/working-on/pocus-atlas.webp',
    status: 'Live Initiative',
    focusAreas: ['Education', 'Case Library', 'POCUS'],
  },
  {
    title: 'The VEXUS Atlas',
    subtitle: 'Venous Excess Ultrasound Scoring',
    description:
      'Interactive guides, scoring tools, and evidence summaries that advance venous congestion assessment at the bedside, supporting precision-guided resuscitation.',
    link: 'https://thevexusatlas.com/',
    ctaLabel: 'Visit VEXUS Atlas',
    logoSrc: '/images/working-on/vexus-atlas.png',
    status: 'Live Initiative',
    focusAreas: ['VEXUS', 'Critical Care', 'Clinical Pathways'],
  },
  {
    title: 'VEXUS AI Model',
    subtitle: 'AI Model Building – VEXUS Decision Support',
    description:
      'Developing machine learning models that interpret venous congestion waveforms and automate VEXUS scoring, delivering real-time decision support inside the VEXUS Calculator workflow.',
    link: 'https://thevexusatlas.com/calculator',
    ctaLabel: 'Preview the Calculator',
    logoSrc: '/images/working-on/vexus-atlas.png',
    status: 'In Development',
    focusAreas: ['AI', 'Decision Support', 'Waveform Analysis'],
  },
  {
    title: 'POCUS Wall Motion Abnormality',
    subtitle: 'AI Detection for Regional Wall Motion',
    description:
      'Training neural networks to detect regional wall motion abnormalities in point-of-care echocardiography, expanding rapid triage and cardiology decision support at the bedside.',
    logoSrc: '/images/working-on/pocus-wall-motion.svg',
    status: 'Coming Soon',
    focusAreas: ['Cardiac AI', 'Wall Motion', 'POCUS'],
  },
  {
    title: 'Butterfly Collaboration',
    subtitle: 'Scaling POCUS Access with Butterfly Network',
    description:
      'Partnering with Butterfly Network to accelerate access to portable ultrasound, align training pathways, and embed VEXUS and POCUS best practices into point-of-care workflows.',
    link: 'https://www.butterflynetwork.com/',
    ctaLabel: 'Learn About Butterfly',
    logoSrc: '/images/working-on/butterfly.png',
    status: 'Collaboration',
    focusAreas: ['Partnership', 'Technology Enablement'],
  },
  {
    title: 'Nerve Block App',
    subtitle: 'Bedside Regional Anesthesia Decision Support',
    description:
      'Our team helped build the high-impact iOS and Android “Nerve Block App” so providers can quickly answer “What Block?” at the bedside. We applied design-thinking principles around provider workflows to streamline ultrasound-guided regional anesthesia.',
    link: 'https://nerveblock.app/',
    ctaLabel: 'Discover the App',
    logoSrc: '/images/working-on/nerve-block-app-new.png',
    status: 'Live Clinical Tool',
    focusAreas: ['Mobile Apps', 'Regional Anesthesia', 'Design Thinking'],
    logoBackground: '#ffffff',
    logoBorderColor: '#e5e7eb',
  },
  {
    title: 'BlockHeads',
    subtitle: 'Community for Ultrasound-Guided Regional Analgesia',
    description:
      'Building a community of emergency medicine experts who share techniques, protocols, and implementation playbooks that accelerate adoption of ultrasound-guided regional anesthesia.',
    link: 'https://www.blockheads-em.com',
    ctaLabel: 'Visit BlockHeads',
    logoSrc: '/images/working-on/blockheads.webp',
    status: 'Community Initiative',
    focusAreas: ['Community', 'Regional Analgesia', 'Education'],
    logoBackground: '#111111',
    logoBorderColor: '#111111',
  },
];

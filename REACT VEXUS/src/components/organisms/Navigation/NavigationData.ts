export interface NavigationItem {
  label: string;
  href?: string;
  description?: string;
  highlight?: boolean;
  hasDropdown?: boolean;
  subLinks?: SubNavigationItem[];
}

export interface SubNavigationItem {
  text: string;
  href: string;
}

// Navigation data matching the original VEXUS ATLAS site with elegant dropdowns
export const navigationData: NavigationItem[] = [
  {
    label: 'VEXUS ATLAS',
    href: '/',
    hasDropdown: true,
    subLinks: [
      { text: 'VEXUS Fundamentals', href: '/education' },
      { text: 'Waveform Analysis', href: '/waveform' },
      { text: 'Image Acquisition', href: '/acquisition' },
      { text: 'AI Image Recognition', href: '/calculator' },
      { text: 'Image Atlas', href: '/image-atlas' },
      { text: 'VEXUS Literature', href: '/literature' },
      { text: 'Publications', href: '/publications' },
      { text: 'Our Team', href: '/team' },
      { text: 'About VEXUS ATLAS', href: '/about' },
      { text: 'Contact Us', href: '/contact' },
    ]
  },
  {
    label: 'Image Atlas',
    href: 'https://www.thepocusatlas.com/image-atlas-home',
    hasDropdown: true,
    subLinks: [
      { text: 'Image Atlas Home', href: 'https://www.thepocusatlas.com/image-atlas-home' },
      { text: 'Aorta (AAA)', href: 'https://www.thepocusatlas.com/abdominal-aortic-aneurysm' },
      { text: 'Biliary (Gallbladder)', href: 'https://www.thepocusatlas.com/gallbladder' },
      { text: 'Cardiac', href: 'https://www.thepocusatlas.com/cardiac' },
      { text: 'Gastrointestinal (SBO)', href: 'https://www.thepocusatlas.com/small-bowel-obstruction' },
      { text: 'Musculoskeletal', href: 'https://www.thepocusatlas.com/musculoskeletal' },
      { text: 'Obstetrics (OB/Gyn)', href: 'https://www.thepocusatlas.com/obstetrics' },
      { text: 'Ocular', href: 'https://www.thepocusatlas.com/ocular' },
      { text: 'Pulmonary (Lung)', href: 'https://www.thepocusatlas.com/lung' },
      { text: 'Renal/GU', href: 'https://www.thepocusatlas.com/renal' },
      { text: 'Soft Tissue', href: 'https://www.thepocusatlas.com/soft-tissue' },
      { text: 'Trauma (Free Fluid)', href: 'https://www.thepocusatlas.com/free-fluid' },
      { text: 'Vascular (DVT)', href: 'https://www.thepocusatlas.com/dvt' },
      { text: 'Pathology Atlas', href: 'https://www.thepocusatlas.com/image-atlas-pathology' },
    ]
  },
  { 
    label: 'Nerve Blocks', 
    href: 'https://www.thepocusatlas.com/nerve-blocks',
    hasDropdown: false,
  },
  { 
    label: 'POCUS Atlas Jr.', 
    href: 'https://www.thepocusatlas.com/atlas-jr',
    hasDropdown: true,
    subLinks: [
      { text: 'Jr. Atlas Home', href: 'https://www.thepocusatlas.com/atlas-jr' },
      { text: 'Biliary Jr', href: 'https://www.thepocusatlas.com/atlas-jr' },
      { text: 'GI Jr', href: 'https://www.thepocusatlas.com/atlas-jr' },
      { text: 'MSK Jr', href: 'https://www.thepocusatlas.com/atlas-jr' },
      { text: 'Pulmonary Jr', href: 'https://www.thepocusatlas.com/atlas-jr' },
    ]
  },
  {
    label: 'Learn',
    hasDropdown: true,
    subLinks: [
      { text: 'Evidence Atlas', href: 'https://www.thepocusatlas.com/ea-home' },
      { text: 'COVID-19 Resources', href: '/covid-19' },
      { text: 'OB Dating Atlas', href: '/ob-dating-atlas' },
      { text: 'Shock Protocols (RUSH)', href: '/shock' },
      { text: 'POCUS for Appendicitis', href: 'https://www.thepocusatlas.com/pocus-for-appendicitis' },
      { text: 'POCUS for SOB', href: 'https://www.thepocusatlas.com/pocus-for-shortness-of-breath' },
    ]
  },
  {
    label: 'More',
    hasDropdown: true,
    subLinks: [
      { text: 'Contribute Images', href: 'https://www.thepocusatlas.com/contribute' },
      { text: 'Live Courses (Sound & Surf)', href: 'https://www.soundandsurf.com/' },
      { text: 'Blog', href: 'https://www.thepocusatlas.com/blog' },
      { text: 'Tutorials', href: 'https://www.thepocusatlas.com/tutorials' },
      { text: 'Legal', href: 'https://www.thepocusatlas.com/legal' },
    ]
  },
];

export default navigationData; 
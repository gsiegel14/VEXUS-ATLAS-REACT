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
    label: 'VEXUS Atlas',
    href: '/',
    hasDropdown: true,
    subLinks: [
      { text: 'VEXUS Atlas Home', href: '/' },
      { text: 'VEXUS Fundamentals', href: '/education' },
      { text: 'Waveform Analysis', href: '/waveform' },
      { text: 'Image Acquisition', href: '/acquisition' },
      { text: 'AI Image Recognition', href: '/calculator' },
      { text: 'Image Atlas', href: '/image-atlas' },
      { text: 'VEXUS Literature', href: '/literature' },
      { text: 'Publications', href: '/publications' },
      { text: 'Our Team', href: '/team' },
      { text: 'About VEXUS Atlas', href: '/about' },
      { text: 'Contact Us', href: '/contact' },
    ]
  },
  {
    label: 'Image Atlas',
    href: 'https://www.thepocusatlas.com/home',
    hasDropdown: true,
    subLinks: [
      { text: 'Image Atlas Home', href: 'https://www.thepocusatlas.com/home' },
      { text: 'VEXUS Atlas Gallery', href: '/image-atlas' },
      { text: 'Aorta (AAA)', href: 'https://www.thepocusatlas.com/aorta1' },
      { text: 'Biliary (Gallbladder)', href: 'https://www.thepocusatlas.com/hepatobiliary-1' },
      { text: 'Cardiac', href: 'https://www.thepocusatlas.com/echocardiography-2' },
      { text: 'Gastrointestinal (SBO)', href: 'https://www.thepocusatlas.com/gastrointestinal' },
      { text: 'Musculoskeletal', href: 'https://www.thepocusatlas.com/musculoskeletal' },
      { text: 'Obstetrics (OB/Gyn)', href: 'https://www.thepocusatlas.com/ob-gyn-atlas' },
      { text: 'Ocular', href: 'https://www.thepocusatlas.com/ocular-atlas' },
      { text: 'Pediatrics', href: 'https://www.thepocusatlas.com/pediatrics' },
      { text: 'Pulmonary (Lung)', href: 'https://www.thepocusatlas.com/pulmonary' },
      { text: 'Renal/GU', href: 'https://www.thepocusatlas.com/renal-gu' },
      { text: 'Soft Tissue', href: 'https://www.thepocusatlas.com/softtissue-2' },
      { text: 'Trauma (Free Fluid)', href: 'https://www.thepocusatlas.com/trauma-atlas' },
      { text: 'Vascular (DVT)', href: 'https://www.thepocusatlas.com/vascular' },
      { text: 'Image Review', href: 'https://www.thepocusatlas.com/image-review' },
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
      { text: 'Biliary Jr', href: 'https://www.thepocusatlas.com/biliary-jr' },
      { text: 'GI Jr', href: 'https://www.thepocusatlas.com/gi-jr' },
      { text: 'MSK Jr', href: 'https://www.thepocusatlas.com/msk-jr' },
      { text: 'Pulmonary Jr', href: 'https://www.thepocusatlas.com/pulmonary-jr' },
    ]
  },
  {
    label: 'Learn',
    hasDropdown: true,
    subLinks: [
      { text: 'Evidence Atlas', href: 'https://www.thepocusatlas.com/ea-home' },
      { text: 'COVID-19 Resources', href: 'https://www.thepocusatlas.com/covid19' },
      { text: 'OB Dating Atlas', href: 'https://www.thepocusatlas.com/ob-dating-atlas-1' },
      { text: 'Shock Protocols (RUSH)', href: 'https://www.thepocusatlas.com/shock' },
      { text: 'POCUS for Appendicitis', href: 'https://www.thepocusatlas.com/new-blog/appendicitis' },
      { text: 'POCUS for SOB', href: 'https://www.thepocusatlas.com/new-blog/2018/3/14/ddxof-pocus-for-undifferentiated-shortness-of-breath' },
      { text: 'Ectopic Pregnancy', href: 'https://www.thepocusatlas.com/new-blog/2018/4/11/ddxof-ultrasound-in-ectopic-pregnancy' },
      { text: 'Hydrocephalus (Pediatrics)', href: 'https://www.thepocusatlas.com/new-blog/pedshydrocephalus' },
      { text: 'Optic Nerve Sheath for ICP', href: 'https://www.thepocusatlas.com/new-blog/onsd-for-increased-icp' },
    ]
  },
  {
    label: 'More',
    hasDropdown: true,
    subLinks: [
      { text: 'Contribute Images', href: 'https://www.thepocusatlas.com/contribute' },
      { text: 'Live Courses (Sound & Surf)', href: 'https://www.soundandsurf.com' },
      { text: 'Blog', href: 'https://www.thepocusatlas.com/new-blog' },
      { text: 'Tutorials', href: 'https://www.thepocusatlas.com/tutorials' },
      { text: 'About', href: 'https://www.thepocusatlas.com/about' },
      { text: 'Legal', href: 'https://www.thepocusatlas.com/legal' },
      { text: 'Shop', href: 'https://www.thepocusatlas.com/merch' },
    ]
  },
];

export default navigationData; 
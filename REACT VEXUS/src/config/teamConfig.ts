export interface TeamMember {
  id: string;
  name: string;
  role: string;
  type: 'core' | 'contributor';
  image: string;
  email?: string;
  linkedin?: string;
  specialties: string[];
  shortBio: string;
  fullBio?: string;
  education?: {
    degree: string;
    institution: string;
    year: string;
  }[];
  experience?: {
    position: string;
    organization: string;
  }[];
  achievements?: string[];
  featured?: boolean;
}

export const teamConfig = {
  members: [
    {
      id: 'august-longino',
      name: 'August Longino, MD',
      role: 'Clinical Investigator & Project Lead',
      type: 'core' as const,
      image: '/images/team/august-longino.jpg',
      email: 'alongino@denverhealth.org',
      linkedin: 'https://linkedin.com/in/august-longino',
      specialties: ['Critical Care Medicine', 'Point-of-Care Ultrasound', 'Venous Congestion'],
      shortBio: 'Expert in critical care medicine and point-of-care ultrasound, focusing on venous congestion assessment and its clinical applications in critical care settings.',
      fullBio: 'Dr. Longino is a leading expert in critical care medicine with extensive experience in point-of-care ultrasound. His research focuses on venous congestion assessment and the development of novel diagnostic techniques for critical care patients.',
      education: [
        {
          degree: 'MD',
          institution: 'University of Colorado School of Medicine',
          year: '2015'
        },
        {
          degree: 'Residency in Internal Medicine',
          institution: 'Denver Health Medical Center',
          year: '2018'
        },
        {
          degree: 'Fellowship in Critical Care Medicine',
          institution: 'Denver Health Medical Center',
          year: '2020'
        }
      ],
      experience: [
        {
          position: 'Attending Physician',
          organization: 'Denver Health Medical Center'
        }
      ],
      achievements: [
        'Board Certified in Internal Medicine and Critical Care Medicine',
        'Published researcher in venous congestion assessment',
        'Lead investigator for multiple VEXUS validation studies'
      ],
      featured: true
    },
    {
      id: 'gabriel-siegel',
      name: 'Gabriel Siegel, MD',
      role: 'VEXUS ATLAS Creator & Ultrasound Fellow',
      type: 'core' as const,
      image: '/images/team/gabriel-siegel.jpg',
      specialties: ['Machine Learning', 'AI in Healthcare', 'Medical Imaging'],
      shortBio: 'Created the VEXUS ATLAS tool and specializes in machine learning and AI applications in healthcare, focusing on developing innovative solutions for medical imaging analysis and clinical decision support systems.',
      fullBio: 'Dr. Siegel is the creator of the VEXUS ATLAS platform and a specialist in applying machine learning and artificial intelligence to healthcare challenges. His work focuses on developing innovative solutions for medical imaging analysis and clinical decision support systems.',
      education: [
        {
          degree: 'MD',
          institution: 'University of Colorado School of Medicine',
          year: '2020'
        },
        {
          degree: 'Fellowship in Ultrasound Medicine',
          institution: 'Denver Health Medical Center',
          year: '2024'
        }
      ],
      achievements: [
        'Creator of VEXUS ATLAS platform',
        'Expert in AI applications for medical imaging',
        'Published researcher in machine learning for healthcare'
      ],
      featured: true
    },
    {
      id: 'matthew-riscinti',
      name: 'Matthew Riscinti, MD',
      role: 'Director of Emergency Ultrasound & Ultrasound Fellowship Director',
      type: 'core' as const,
      image: '/images/team/matthew-riscinti.jpg',
      specialties: [
        'Emergency Ultrasound',
        'Medical Education',
        'Deep Learning',
        'Tele-guidance',
        'Design Thinking'
      ],
      shortBio: 'Director of Emergency Ultrasound and Ultrasound Fellowship Director at Denver Health. Assistant Professor at the University of Colorado and co-founder of The POCUS Atlas and related ultrasound education initiatives.',
      fullBio: 'Dr. Riscinti leads the Emergency Ultrasound program at Denver Health and directs the institution\'s Ultrasound Fellowship. His academic interests span deep learning and tele-guidance augmentation of ultrasound education, as well as design-thinking approaches to curriculum development. A former Chief Resident of Education at Kings County Hospital/SUNY Downstate (Brooklyn, NY), he is the co-founder and lead editor of The POCUS Atlas, The Evidence Atlas, The Denver Health Nerve Block Atlas, and The Nerve Block App, and serves as lead instructor for Bread and Butter Ultrasound. Based in Denver by way of Brooklyn, he strives to advance ultrasound in medicine by merging innovative technologies with medical education.',
      education: [
        {
          degree: 'MD',
          institution: 'University of Colorado School of Medicine',
          year: '2016'
        },
        {
          degree: 'Emergency Ultrasound Fellowship',
          institution: 'Denver Health Medical Center',
          year: '2020'
        }
      ]
    },
    {
      id: 'ed-gill',
      name: 'Ed Gill, MD',
      role: 'Cardiology Professor & Clinical Expert',
      type: 'core' as const,
      image: '/images/team/ed-gill.jpg',
      specialties: ['Echocardiography', 'Prosthetic Valve Evaluation', 'Cardiology'],
      shortBio: 'Distinguished cardiologist with extensive expertise in echocardiography and prosthetic valve evaluation. Graduate of University of Washington School of Medicine (1985) with fellowship training in Cardiology at University of Utah Medical Center (1993).',
      education: [
        {
          degree: 'MD',
          institution: 'University of Washington School of Medicine',
          year: '1985'
        },
        {
          degree: 'Fellowship in Cardiology',
          institution: 'University of Utah Medical Center',
          year: '1993'
        }
      ],
      achievements: [
        'Board Certified in Cardiology',
        'Expert in echocardiography and prosthetic valve evaluation',
        'Extensive clinical and research experience'
      ]
    },
    {
      id: 'ivor-douglas',
      name: 'Ivor Douglas, MD',
      role: 'Critical Care Director & Chief of Pulmonary Sciences',
      type: 'core' as const,
      image: '/images/team/ivor-douglas.jpg',
      specialties: ['Pulmonary Sciences', 'Critical Care', 'ICU Management'],
      shortBio: 'Medical Director of the Intensive Care unit at Denver Health Medical Center and Chief of Pulmonary Sciences & Critical Care. Recognized as a Top Doctor in Denver by 5280 Magazine (2008-2019) and named in Best Doctors in America® (2008-2020).',
      achievements: [
        'Medical Director of ICU at Denver Health Medical Center',
        'Chief of Pulmonary Sciences & Critical Care',
        'Top Doctor in Denver by 5280 Magazine (2008-2019)',
        'Best Doctors in America® (2008-2020)'
      ]
    },
    // Contributors
    {
      id: 'nhu-nguyen-le',
      name: 'Nhu-Nguyen Le, MD',
      role: 'Assistant Fellowship Director',
      type: 'contributor' as const,
      image: '/images/team/nhu-nguyen-le.jpg',
      specialties: ['Emergency Medicine', 'Point-of-Care Ultrasound', 'Medical Education'],
      shortBio: 'Emergency Medicine physician at Denver Health Medical Center with fellowship in Ultrasound Medicine. Specializes in point-of-care ultrasound education and clinical applications in emergency settings.'
    },
    {
      id: 'fred-milgrim',
      name: 'Fred N. Milgrim, MD',
      role: 'Director of Residency Ultrasound Education',
      type: 'contributor' as const,
      image: '/images/team/fred-milgrim.jpg',
      specialties: ['Emergency Medicine', 'Ultrasound Education', 'Curriculum Development'],
      shortBio: 'Emergency Medicine physician at Denver Health Medical Center with expertise in ultrasound education. Focuses on developing curriculum for residents and integration of POCUS in emergency care.'
    },
    {
      id: 'peter-alsharif',
      name: 'Peter Alsharif, MD',
      role: 'Ultrasound Fellow',
      type: 'contributor' as const,
      image: '/images/team/peter-alsharif.jpg',
      specialties: ['Emergency Ultrasound', 'Point-of-Care Ultrasound', 'Critical Care'],
      shortBio: 'Emergency ultrasound fellow from Rutgers specializing in point-of-care ultrasound applications and advancing diagnostic capabilities in critical care settings.'
    },
    {
      id: 'luke-mccormack',
      name: 'Luke McCormack, MD',
      role: 'Research Contributor',
      type: 'contributor' as const,
      image: '/images/team/luke-mccormack.jpg',
      specialties: ['Internal Medicine', 'Critical Care', 'Research'],
      shortBio: 'Internal Medicine resident at the University of Colorado with a strong interest in critical care medicine. His work focuses on advancing the understanding and application of critical care diagnostics and interventions.'
    },
    {
      id: 'kisha-thayapran',
      name: 'Kisha Thayapran, MD, MPH',
      role: 'Medical Research Contributor',
      type: 'contributor' as const,
      image: '/images/team/kisha-thayapran.png',
      specialties: ['Medical Imaging', 'Public Health', 'Population Health'],
      shortBio: 'Dr. Thayapran received her MD from the University of Colorado School of Medicine and her MPH from the Colorado School of Public Health. With a background in Biology from the California Institute of Technology, she brings a unique perspective to the intersection of diagnostic imaging and public health.',
      education: [
        {
          degree: 'MD',
          institution: 'University of Colorado School of Medicine',
          year: '2023'
        },
        {
          degree: 'MPH',
          institution: 'Colorado School of Public Health',
          year: '2023'
        },
        {
          degree: 'BS in Biology',
          institution: 'California Institute of Technology',
          year: '2018'
        }
      ]
    }
  ]
}; 
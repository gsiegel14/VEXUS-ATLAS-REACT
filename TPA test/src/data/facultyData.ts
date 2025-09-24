export interface FacultyMember {
  id: string;
  name: string;
  title: string;
  roles: string[];
  email?: string;
  institution: string;
  fellowship?: string;
  residency?: string;
  medSchool?: string;
  undergrad?: string;
  hometown?: string;
  hobbies?: string[];
  imageUrl?: string;
  isCurrentFellow?: boolean;
  expertise?: string[];
  description?: string;
  googleScholarId?: string;
  orcidId?: string;
}

export const facultyData: FacultyMember[] = [
  {
    id: 'matthew-riscinti',
    name: 'Matthew Riscinti, MD',
    title: 'Fellowship Director',
    roles: [
      'Fellowship Director',
      'Director of Emergency Ultrasound',
      'Assistant Professor, University of Colorado School of Medicine',
      'Co-Founder of The POCUS Atlas'
    ],
    email: 'matthew.riscinti@denverem.org',
    institution: 'Denver Health Medical Center',
    fellowship: 'Denver Health 2019-2020',
    residency: '2015-2019 Kings County/SUNY Downstate, Brooklyn, NYC',
    isCurrentFellow: false,
    expertise: ['Emergency Ultrasound', 'Point-of-Care Ultrasound', 'Medical Education'],
    description: 'Fellowship Director and Director of Emergency Ultrasound at Denver Health Medical Center. Co-founder of The POCUS Atlas, a comprehensive ultrasound education platform.',
    imageUrl: '/images/matthew-riscinti.jpg'
  },
  {
    id: 'nhu-nguyen-le',
    name: 'Nhu-Nguyen Le, MD',
    title: 'Assistant Fellowship Director',
    roles: [
      'Assistant Fellowship Director, Denver Health Medical Center',
      'Assistant Professor, University of Colorado School of Medicine'
    ],
    email: 'nhunguyen.le@denverem.org',
    institution: 'Denver Health Medical Center',
    fellowship: 'Denver Health 2021-2022',
    residency: 'LAC+USC 2018-2022',
    isCurrentFellow: false,
    expertise: ['Emergency Ultrasound', 'Medical Education', 'Clinical Research'],
    description: 'Assistant Fellowship Director with focus on emergency ultrasound and medical education.',
    imageUrl: '/images/nhu-nguyen-le.jpg'
  },
  {
    id: 'fred-milgrim',
    name: 'Fred N. Milgrim, MD',
    title: 'Director of Residency Ultrasound Education',
    roles: [
      'Director of Residency Ultrasound Education, Denver Health Medical Center',
      'Assistant Professor, University of Colorado School of Medicine'
    ],
    email: 'fred.milgrim@denverem.org',
    institution: 'Denver Health Medical Center',
    fellowship: 'Denver Health 2023-2024',
    residency: 'Mount Sinai Hospital 2019-2023',
    isCurrentFellow: false,
    expertise: ['Emergency Ultrasound', 'Residency Education', 'Curriculum Development'],
    description: 'Director of Residency Ultrasound Education focusing on curriculum development and resident training.',
    imageUrl: '/images/fred-milgrim.jpg'
  },
  {
    id: 'gabriel-siegel',
    name: 'Gabriel Siegel, MD',
    title: 'Current Fellow',
    roles: ['Emergency Ultrasound Fellow', 'VEXUS ATLAS Creator'],
    institution: 'Denver Health Medical Center',
    residency: 'Denver Health Emergency Medicine',
    hometown: 'Chicago, IL',
    medSchool: 'Rush Medical College (the Harvard of the west Chicago)',
    undergrad: 'Claremont McKenna College',
    isCurrentFellow: true,
    expertise: ['Emergency Medicine', 'Ultrasound', 'Machine Learning', 'AI in Healthcare'],
    description: 'Current Emergency Ultrasound Fellow and creator of the VEXUS ATLAS tool. Specializes in machine learning and AI applications in healthcare, focusing on developing innovative solutions for medical imaging analysis and clinical decision support systems. If I weren\'t an ER/PEM doc, I\'d be a Chef in a 1 star Michelin restaurant.',
    imageUrl: '/images/gabriel-siegel.jpg',
    googleScholarId: 'XKnXMIkAAAAJ'
  },
  {
    id: 'peter-alsharif',
    name: 'Peter Alsharif, MD',
    title: 'Current Fellow',
    roles: ['Emergency Ultrasound Fellow'],
    institution: 'Denver Health Medical Center',
    residency: 'Rutgers New Jersey Medical School',
    medSchool: 'Rutgers New Jersey Medical School',
    undergrad: 'Amherst College',
    hobbies: ['Day Hikes and Brewery Trips', 'Occasionally the Jersey Shore'],
    isCurrentFellow: true,
    expertise: ['Emergency Medicine', 'Ultrasound', 'Point-of-Care Ultrasound'],
    description: 'Emergency ultrasound fellow from Rutgers specializing in point-of-care ultrasound applications and advancing diagnostic capabilities in critical care settings.',
    imageUrl: '/images/peter-alsharif.jpg'
  },
  {
    id: 'nithin-ravi',
    name: 'Nithin Ravi, MD, MPH',
    title: 'Current Fellow',
    roles: ['Emergency Ultrasound Fellow'],
    institution: 'Denver Health Medical Center',
    residency: 'University of Colorado',
    medSchool: 'University of Colorado School of Medicine',
    undergrad: 'University of Colorado Boulder',
    hobbies: ['Research', 'Medical Education', 'Point-of-Care Ultrasound'],
    isCurrentFellow: true,
    expertise: ['Emergency Medicine', 'Ultrasound', 'Public Health', 'Research'],
    description: 'Emergency ultrasound fellow with MD/MPH focusing on research applications of point-of-care ultrasound and public health initiatives in emergency medicine.',
    imageUrl: '/images/nithin-ravi.jpg'
  }
];

export const currentFellows = facultyData.filter(member => member.isCurrentFellow);
export const faculty = facultyData.filter(member => !member.isCurrentFellow); 

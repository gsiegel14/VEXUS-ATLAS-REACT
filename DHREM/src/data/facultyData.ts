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
  graduateSchool?: string;
  undergrad?: string;
  hometown?: string;
  hobbies?: string[];
  imageUrl?: string;
  isCurrentFellow?: boolean;
  expertise?: string[];
  description?: string;
  googleScholarId?: string;
  orcidId?: string;
  fellowshipYears?: string;
  languages?: string[];
  department?: string;
}

export const facultyData: FacultyMember[] = [
  {
    id: 'matthew-riscinti',
    name: 'Matthew Riscinti, MD',
    title: 'Director of Emergency Ultrasound',
    roles: [
      'Director of Emergency Ultrasound - Denver Health',
      'Ultrasound Fellowship Director - Denver Health',
      'Assistant Professor - University of Colorado',
      'Former Chief Resident of Education - Emergency Medicine - Kings County Hospital/SUNY Downstate Medical Center, Brooklyn, NY'
    ],
    email: 'matthew.riscinti@denverem.org',
    institution: 'Denver Health Medical Center',
    fellowship: 'Denver Health 2019-2020',
    residency: '2015-2019 Kings County/SUNY Downstate, Brooklyn, NYC',
    medSchool: 'University of Colorado School of Medicine (2016)',
    hometown: 'Denver, Colorado by way of Brooklyn, NY',
    isCurrentFellow: false,
    expertise: [
      'Emergency Ultrasound', 
      'Point-of-Care Ultrasound', 
      'Medical Education',
      'Deep Learning and Tele-guidance augmentation of Ultrasound Education',
      'Design-Thinking in Medical Education'
    ],
    description: 'Director of Emergency Ultrasound and Ultrasound Fellowship Director at Denver Health. Co-founder and Lead Editor of The POCUS Atlas, The Evidence Atlas, The Denver Health Nerve Block Atlas, The Nerve Block App, and Lead Instructor for Bread and Butter Ultrasound. The POCUS Atlas is a collaborative and open-source atlas of Point of Care Ultrasound (POCUS) images. My goal is to advance the role of ultrasound in medicine by merging innovative technologies with medical education.',
    imageUrl: 'https://images.squarespace-cdn.com/content/v1/5eb9e4a39a65480400b2980b/83a2debe-b2d4-40cf-a1bb-0062c3144dce/IMG_0316.jpeg'
  },
  {
    id: 'amanda-toney',
    name: 'Amanda Toney, MD',
    title: 'Pediatric Emergency Ultrasound Fellowship Director',
    roles: [
      'Pediatric Emergency Ultrasound Fellowship Director',
      'Director of Pediatric Emergency Ultrasound',
      'Staff Physician, Denver Health Medical Center',
      'Associate Professor, University of Colorado School of Medicine'
    ],
    email: 'Amanda.Toney@dhha.org',
    institution: 'Denver Health Medical Center',
    fellowship: 'Denver Health 2012-2013',
    residency: 'PEM Fellowship: Children\'s Hospital Colorado 2009-2012',
    isCurrentFellow: false,
    expertise: ['Pediatric Emergency Medicine', 'Pediatric Ultrasound', 'Medical Education'],
    description: 'Director of Pediatric Emergency Ultrasound with extensive experience in pediatric emergency medicine and ultrasound education.',
    imageUrl: 'https://images.squarespace-cdn.com/content/v1/5eb9e4a39a65480400b2980b/1626313389995-4VAINQ6Q7G7YIHYIOCLU/Toney.png'
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
    imageUrl: 'https://images.squarespace-cdn.com/content/v1/5eb9e4a39a65480400b2980b/568f2d72-eea0-46d0-9482-cf9bafcd7a2b/Headshot.jpg'
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
    fellowship: 'Denver Health 2024-2025',
    residency: 'Mount Sinai Hospital 2019-2023',
    isCurrentFellow: false,
    expertise: ['Emergency Ultrasound', 'Residency Education', 'Curriculum Development'],
    description: 'Director of Residency Ultrasound Education focusing on curriculum development and resident training.',
    imageUrl: 'https://images.squarespace-cdn.com/content/v1/5eb9e4a39a65480400b2980b/4b0ca74c-8c7a-4f47-9c1c-89fb1697ece0/IMG_5340.jpeg'
  },
  {
    id: 'molly-thiessen',
    name: 'Molly Thiessen, MD',
    title: 'Ultrasound Fellowship Director, Emeritus',
    roles: [
      'Ultrasound Fellowship Director, Emeritus',
      'Staff Physician, Denver Health Medical Center',
      'Associate Professor, University of Colorado School of Medicine'
    ],
    email: 'molly.thiessen@dhha.org',
    institution: 'Denver Health Medical Center',
    fellowship: 'Denver Health 2011-2012',
    residency: 'Denver Health',
    isCurrentFellow: false,
    expertise: ['Emergency Ultrasound', 'Medical Education', 'Fellowship Training'],
    description: 'Emeritus Fellowship Director with extensive experience in emergency ultrasound and fellowship training.',
    imageUrl: 'https://images.squarespace-cdn.com/content/v1/5eb9e4a39a65480400b2980b/1626313452638-H32J8J30Y17FIRFCGLLJ/ad1c8c_6a50d7415ff542299164a4c9b7b5d3e1%7Emv2_d_2430_2817_s_4_2.jpg'
  },
  {
    id: 'juliana-wilson',
    name: 'Juliana Wilson, DO',
    title: 'Director Longitudinal Ultrasound Curriculum',
    roles: [
      'Director Longitudinal Ultrasound Curriculum - University of Colorado School of Medicine',
      'ED POCUS Group lead Co-Chair Anschutz POCUS Committee',
      'Associate Professor, University of Colorado School of Medicine'
    ],
    institution: 'University of Colorado School of Medicine',
    isCurrentFellow: false,
    expertise: ['Emergency Ultrasound', 'Curriculum Development', 'POCUS Education'],
    description: 'Director of Longitudinal Ultrasound Curriculum and ED POCUS Group lead.',
    imageUrl: 'https://images.squarespace-cdn.com/content/v1/5eb9e4a39a65480400b2980b/cbd4a802-7a0d-41ba-bafc-01f2db27983c/headshot.jpg'
  },
  {
    id: 'joe-brown',
    name: 'Joseph Brown, MD',
    title: 'Assistant Professor',
    roles: [
      'Assistant Professor, University of Colorado School of Medicine'
    ],
    email: 'Joseph.R.Brown@cuanschutz.edu',
    institution: 'University of Colorado School of Medicine',
    fellowship: 'University of California, San Francisco 2018-2019',
    residency: 'University of California, San Diego',
    isCurrentFellow: false,
    expertise: ['Emergency Medicine', 'Ultrasound'],
    description: 'Assistant Professor with expertise in emergency medicine and ultrasound.',
    imageUrl: 'https://images.squarespace-cdn.com/content/v1/5eb9e4a39a65480400b2980b/1661432389542-9OBNYNHS40TU2NMAFE9I/unnamed.jpg'
  },
  {
    id: 'michael-heffler',
    name: 'Michael Heffler, MD',
    title: 'Emergency Ultrasound Faculty',
    roles: [
      'Emergency Ultrasound Faculty, Denver Health Medical Center',
      'Clinical Educator, University of Colorado School of Medicine'
    ],
    institution: 'Denver Health Medical Center',
    expertise: ['Emergency Ultrasound', 'Medical Education', 'Clinical Research'],
    description: 'Emergency ultrasound faculty member supporting clinical innovation and education across Denver Health.',
    googleScholarId: 'nqM3RiUAAAAJ',
    imageUrl: '/images/michael-heffler.jpg'
  },
  {
    id: 'julia-brant',
    name: 'Julia Brant, MD',
    title: 'Pediatric Emergency Ultrasound Faculty',
    roles: [
      'Pediatric Emergency Ultrasound Faculty, Denver Health Medical Center',
      'Pediatric Emergency Medicine Specialist'
    ],
    institution: 'Denver Health Medical Center',
    fellowship: 'University of Colorado (Children\'s Hospital Colorado) Program, Pediatric Emergency Medicine (2023); Denver Health Medical Center Program, Emergency Ultrasound (2019)',
    residency: 'University of Colorado (Children\'s Hospital Colorado) Program, Pediatrics (2016)',
    medSchool: 'MD, University of North Carolina at Chapel Hill School of Medicine (2013)',
    undergrad: 'BA, Dartmouth College (NH) (2004)',
    expertise: ['Pediatric Emergency Medicine', 'Emergency Ultrasound', 'Medical Education'],
    description: 'Pediatric emergency ultrasound specialist with fellowship training in pediatric emergency medicine and emergency ultrasound.',
    imageUrl: '/images/julia-brant.jpg'
  },
  {
    id: 'samuel-lam',
    name: 'Samuel H. F. Lam, MD, MPH',
    title: 'Co-Director of Ultrasound, Children\'s Hospital Colorado',
    roles: [
      'Co-Director of Ultrasound, Children\'s Hospital Colorado Section of Emergency Medicine',
      'Staff Physician, Denver Health Medical Center',
      'Professor, University of Colorado School of Medicine'
    ],
    email: 'Hiu.Lam@childrenscolorado.org',
    institution: 'Children\'s Hospital Colorado / Denver Health Medical Center',
    fellowship: 'Inova Fairfax Hospital/Inova Fairfax Hospital for Children Program, Pediatric Emergency Medicine (2005); Advocate Christ Medical Center Program, Ultrasound (2010); University of California (San Diego) Program, Research (2017)',
    residency: 'University of Massachusetts Program, Emergency Medicine (2001)',
    medSchool: 'MD, Boston University School of Medicine (1998)',
    graduateSchool: 'MPH, San Diego State University (2017)',
    undergrad: 'BA, Boston University (MA) (1998)',
    languages: ['English', 'Cantonese', 'Mandarin'],
    department: 'Pediatrics-Emergency Medicine',
    isCurrentFellow: false,
    expertise: ['Pediatric Emergency Medicine', 'Ultrasound', 'Research'],
    description: 'Co-Director of Ultrasound at Children\'s Hospital Colorado with extensive pediatric emergency medicine experience.',
    imageUrl: '/images/samuel-lam.jpg'
  },
  {
    id: 'philippe-ayres',
    name: 'Philippe Ayres, MD',
    title: 'Current Fellow',
    roles: [
      'Emergency Ultrasound Fellow',
      'Staff Emergency Medicine Physician'
    ],
    email: 'philippe.ayres@dhha.org',
    institution: 'Denver Health Medical Center',
    fellowship: 'Denver Health 2025-2026',
    isCurrentFellow: true,
    expertise: ['Emergency Medicine', 'Point-of-Care Ultrasound', 'Medical Education'],
    description: 'Current Emergency Ultrasound Fellow with expertise in emergency medicine and point-of-care ultrasound.',
    googleScholarId: 'IJP4K9QAAAAJ',
    imageUrl: '/images/philippe-ayres.png'
  },
  {
    id: 'gabriel-siegel',
    name: 'Gabriel Siegel, MD',
    title: 'Past Fellow',
    roles: ['Emergency Ultrasound Fellow (2024-2025)'],
    institution: 'Denver Health Medical Center',
    residency: 'Denver Health Emergency Medicine',
    hometown: 'Chicago, IL',
    medSchool: 'Rush Medical College (the Harvard of the west Chicago)',
    undergrad: 'Claremont McKenna College',
    fellowship: 'Denver Health 2024-2025',
    isCurrentFellow: false,
    expertise: ['Emergency Medicine', 'Ultrasound'],
    description: 'Past Emergency Ultrasound Fellow. If I weren\'t an ER/PEM doc, I\'d be a Chef in a 1 star Michelin restaurant.',
    fellowshipYears: '2024-2025',
    imageUrl: '/images/gabriel-siegel.jpg',
    googleScholarId: 'XKnXMIkAAAAJ'
  },
  {
    id: 'peter-alsharif',
    name: 'Peter Alsharif, MD',
    title: 'Past Fellow',
    roles: ['Emergency Ultrasound Fellow (2024-2025)'],
    institution: 'Denver Health Medical Center',
    residency: 'Rutgers New Jersey Medical School',
    medSchool: 'Rutgers New Jersey Medical School',
    undergrad: 'Amherst College',
    fellowship: 'Denver Health 2024-2025',
    hobbies: ['Day Hikes and Brewery Trips', 'Occasionally the Jersey Shore'],
    isCurrentFellow: false,
    expertise: ['Emergency Medicine', 'Ultrasound'],
    description: 'Past Emergency Ultrasound Fellow with interests in hiking and brewery exploration.',
    fellowshipYears: '2024-2025',
    imageUrl: '/images/peter-alsharif.jpg'
  },
  {
    id: 'nithin-ravi',
    name: 'Nithin Ravi, MD',
    title: 'Past Fellow',
    roles: ['Emergency Ultrasound Fellow (2024-2025)'],
    institution: 'Denver Health Medical Center',
    isCurrentFellow: false,
    expertise: ['Emergency Medicine', 'Ultrasound'],
    description: 'Past Emergency Ultrasound Fellow.',
    fellowshipYears: '2024-2025',
    imageUrl: '/images/nithin-ravi.jpg'
  },
  
  {
    id: 'jamie-popishell',
    name: 'Jamie Popishell, MD',
    title: 'Current Fellow',
    roles: ['Emergency Ultrasound Fellow'],
    institution: 'Denver Health Medical Center',
    isCurrentFellow: true,
    expertise: ['Emergency Medicine', 'Ultrasound'],
    description: 'Current Emergency Ultrasound Fellow.',
    imageUrl: '/images/jamie-popishell.jpg'
  },
  {
    id: 'priya-prasher',
    name: 'Priya Prasher, MD',
    title: 'Pediatric Emergency Ultrasound Fellow',
    roles: ['Pediatric Emergency Ultrasound Fellow'],
    institution: 'Denver Health Medical Center',
    isCurrentFellow: true,
    expertise: ['Emergency Medicine', 'Ultrasound'],
    description: 'Current Pediatric Emergency Ultrasound Fellow focusing on advanced clinical ultrasound research.',
    googleScholarId: 'pXMunFoAAAAJ',
    imageUrl: '/images/priya-prasher.jpg'
  }
];

export const currentFellows = facultyData.filter(member => member.isCurrentFellow);
export const faculty = facultyData.filter(member => !member.isCurrentFellow);

// Derived convenience lists - Core faculty members
export const currentFaculty = facultyData.filter(
  member => !member.isCurrentFellow && 
  !/past.*fellow/i.test(member.title) && 
  !/current.*fellow/i.test(member.title)
);

export const pastFellows = facultyData.filter(
  member => !member.isCurrentFellow && /past.*fellow/i.test(member.title)
);

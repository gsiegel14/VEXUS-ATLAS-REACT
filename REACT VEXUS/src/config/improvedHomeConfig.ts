import { 
  Globe, 
  BookOpen, 
  Activity, 
  Video,
  Microscope,
  Brain,
  FileText,
  Smartphone
} from 'lucide-react';

// Improved home config with better icons
export const improvedHomeConfig = {
  // Your existing products config stays the same
  products: [
    {
      id: 1,
      name: 'POCUS IS LIFE! - Dark Logo',
      price: '$25.00',
      image: '/images/unisex-tri-blend-t-shirt-oatmeal-triblend-front-647a91c607f51.jpg',
      url: '/merch/pocus-is-life-dark-logo'
    },
    // ... other products
  ],

  // Improved projects with better icons
  projects: [
    {
      title: 'Image Atlas',
      // Replace with: <Globe size={48} className="text-blue-600" />
      iconComponent: Globe,
      iconColor: 'text-blue-600',
      link: 'https://www.thepocusatlas.com/home',
      description: 'Comprehensive collection of VEXUS ultrasound images'
    },
    {
      title: 'Evidence Atlas',
      // Replace with: <FileText size={48} className="text-green-600" />
      iconComponent: FileText,
      iconColor: 'text-green-600',
      link: 'https://www.thepocusatlas.com/ea-home',
      description: 'Research papers and scientific evidence'
    },
    {
      title: 'Nerve Block Atlas',
      // Replace with: <Activity size={48} className="text-purple-600" />
      iconComponent: Activity,
      iconColor: 'text-purple-600',
      link: 'https://www.thepocusatlas.com/nerve-blocks',
      description: 'Comprehensive nerve block guidance'
    },
    {
      title: 'Image Review',
      // Replace with: <Video size={48} className="text-orange-600" />
      iconComponent: Video,
      iconColor: 'text-orange-600',
      link: 'https://www.thepocusatlas.com/image-review',
      description: 'Interactive image review and learning'
    }
  ],

  // Main navigation icons for your app
  navigationIcons: {
    atlas: Globe,
    aiAnalysis: Brain,
    fundamentals: BookOpen,
    waveforms: Activity,
    microscope: Microscope,
    mobile: Smartphone
  },

  // Your existing news items stay the same
  newsItems: [
    {
      id: 1,
      title: 'POCUS Atlas Jr Project',
      description: 'We are building the first ever free, open-access pediatric POCUS Atlas! This atlas will be available to use for education around the world. We need your help on this project, find out how you can contribute below.',
      image: '/images/The-POCUS-ATLAS-110.jpg',
      link: '/atlas-jr',
      linkText: 'Learn more',
      imagePosition: 'left' as const
    },
    // ... other news items
  ]
};

// Component example for using the new icons
export const ProjectCard = ({ project }: { project: typeof improvedHomeConfig.projects[0] }) => {
  const IconComponent = project.iconComponent;
  
  return (
    <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
          <IconComponent size={24} className={project.iconColor} />
        </div>
        <h3 className="text-lg font-semibold">{project.title}</h3>
      </div>
      <p className="text-gray-600 mb-4">{project.description}</p>
      <a 
        href={project.link}
        className="text-blue-600 hover:text-blue-800 font-medium"
      >
        Learn more →
      </a>
    </div>
  );
};

export type ImprovedHomeConfigType = typeof improvedHomeConfig;


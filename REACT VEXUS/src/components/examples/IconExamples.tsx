import React from 'react';
import { 
  // Lucide icons - clean, modern, medical-friendly
  Microscope, 
  BookOpen, 
  Brain, 
  Activity, 
  Stethoscope,
  Heart,
  Eye,
  Search,
  Download,
  Upload,
  Settings,
  User,
  Users,
  Calendar,
  Clock,
  FileText,
  Image,
  Video,
  Play,
  Pause,
  Volume2,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  X,
  Check,
  AlertCircle,
  Info,
  HelpCircle,
  Star,
  Share,
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  Globe
} from 'lucide-react';

import { 
  // React Icons - includes Font Awesome, Material Design, etc.
  FaUserMd,
  FaHospital,
  FaMicroscope,
  FaHeartbeat,
  FaLungs,
  FaBrain,
  FaEye,
  FaStethoscope
} from 'react-icons/fa';

import {
  // Material Design icons from react-icons
  MdScience,
  MdLocalHospital,
  MdMonitorHeart,
  MdBiotech,
  MdHealthAndSafety
} from 'react-icons/md';

import {
  // Heroicons from react-icons
  HiAcademicCap,
  HiBeaker,
  HiChartBar,
  HiCog,
  HiDocumentText
} from 'react-icons/hi';

const IconExamples: React.FC = () => {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Better Icons for VEXUS Atlas</h1>
      
      {/* Lucide Icons Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-blue-600">Lucide Icons (Recommended)</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          <div className="flex flex-col items-center p-4 border rounded-lg hover:shadow-md transition-shadow">
            <Microscope size={32} className="text-gray-700 mb-2" />
            <span className="text-sm">Microscope</span>
          </div>
          <div className="flex flex-col items-center p-4 border rounded-lg hover:shadow-md transition-shadow">
            <Brain size={32} className="text-gray-700 mb-2" />
            <span className="text-sm">Brain</span>
          </div>
          <div className="flex flex-col items-center p-4 border rounded-lg hover:shadow-md transition-shadow">
            <Activity size={32} className="text-gray-700 mb-2" />
            <span className="text-sm">Activity</span>
          </div>
          <div className="flex flex-col items-center p-4 border rounded-lg hover:shadow-md transition-shadow">
            <Heart size={32} className="text-gray-700 mb-2" />
            <span className="text-sm">Heart</span>
          </div>
          <div className="flex flex-col items-center p-4 border rounded-lg hover:shadow-md transition-shadow">
            <Stethoscope size={32} className="text-gray-700 mb-2" />
            <span className="text-sm">Stethoscope</span>
          </div>
          <div className="flex flex-col items-center p-4 border rounded-lg hover:shadow-md transition-shadow">
            <BookOpen size={32} className="text-gray-700 mb-2" />
            <span className="text-sm">Book Open</span>
          </div>
        </div>
      </section>

      {/* Font Awesome Icons Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-green-600">Font Awesome Icons</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          <div className="flex flex-col items-center p-4 border rounded-lg hover:shadow-md transition-shadow">
            <FaUserMd size={32} className="text-gray-700 mb-2" />
            <span className="text-sm">User MD</span>
          </div>
          <div className="flex flex-col items-center p-4 border rounded-lg hover:shadow-md transition-shadow">
            <FaHospital size={32} className="text-gray-700 mb-2" />
            <span className="text-sm">Hospital</span>
          </div>
          <div className="flex flex-col items-center p-4 border rounded-lg hover:shadow-md transition-shadow">
            <FaHeartbeat size={32} className="text-gray-700 mb-2" />
            <span className="text-sm">Heartbeat</span>
          </div>
          <div className="flex flex-col items-center p-4 border rounded-lg hover:shadow-md transition-shadow">
            <FaLungs size={32} className="text-gray-700 mb-2" />
            <span className="text-sm">Lungs</span>
          </div>
          <div className="flex flex-col items-center p-4 border rounded-lg hover:shadow-md transition-shadow">
            <FaBrain size={32} className="text-gray-700 mb-2" />
            <span className="text-sm">Brain</span>
          </div>
          <div className="flex flex-col items-center p-4 border rounded-lg hover:shadow-md transition-shadow">
            <FaStethoscope size={32} className="text-gray-700 mb-2" />
            <span className="text-sm">Stethoscope</span>
          </div>
        </div>
      </section>

      {/* Material Design Icons Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-purple-600">Material Design Icons</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          <div className="flex flex-col items-center p-4 border rounded-lg hover:shadow-md transition-shadow">
            <MdScience size={32} className="text-gray-700 mb-2" />
            <span className="text-sm">Science</span>
          </div>
          <div className="flex flex-col items-center p-4 border rounded-lg hover:shadow-md transition-shadow">
            <MdLocalHospital size={32} className="text-gray-700 mb-2" />
            <span className="text-sm">Hospital</span>
          </div>
          <div className="flex flex-col items-center p-4 border rounded-lg hover:shadow-md transition-shadow">
            <MdMonitorHeart size={32} className="text-gray-700 mb-2" />
            <span className="text-sm">Monitor Heart</span>
          </div>
          <div className="flex flex-col items-center p-4 border rounded-lg hover:shadow-md transition-shadow">
            <MdBiotech size={32} className="text-gray-700 mb-2" />
            <span className="text-sm">Biotech</span>
          </div>
          <div className="flex flex-col items-center p-4 border rounded-lg hover:shadow-md transition-shadow">
            <MdHealthAndSafety size={32} className="text-gray-700 mb-2" />
            <span className="text-sm">Health & Safety</span>
          </div>
        </div>
      </section>

      {/* Usage Examples */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-red-600">Usage Examples for VEXUS</h2>
        
        {/* Navigation Icons */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Navigation Icons</h3>
          <div className="flex flex-wrap gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              <Microscope size={20} />
              Image Atlas
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
              <Brain size={20} />
              AI Analysis
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
              <BookOpen size={20} />
              Fundamentals
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
              <Activity size={20} />
              Waveforms
            </button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Feature Cards</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-6 border rounded-lg text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe size={32} className="text-blue-600" />
              </div>
              <h4 className="font-semibold mb-2">VEXUS Atlas</h4>
              <p className="text-sm text-gray-600">Comprehensive ultrasound database</p>
            </div>
            
            <div className="p-6 border rounded-lg text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaBrain size={32} className="text-green-600" />
              </div>
              <h4 className="font-semibold mb-2">AI Analysis</h4>
              <p className="text-sm text-gray-600">Intelligent image processing</p>
            </div>
            
            <div className="p-6 border rounded-lg text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText size={32} className="text-purple-600" />
              </div>
              <h4 className="font-semibold mb-2">Fundamentals</h4>
              <p className="text-sm text-gray-600">Educational resources</p>
            </div>
            
            <div className="p-6 border rounded-lg text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MdMonitorHeart size={32} className="text-orange-600" />
              </div>
              <h4 className="font-semibold mb-2">Waveforms</h4>
              <p className="text-sm text-gray-600">Interactive waveform analysis</p>
            </div>
          </div>
        </div>
      </section>

      {/* Code Examples */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Code Examples</h2>
        <div className="bg-gray-100 p-6 rounded-lg">
          <pre className="text-sm overflow-x-auto">
{`// Import icons
import { Microscope, Brain, BookOpen, Activity } from 'lucide-react';
import { FaUserMd, FaHospital } from 'react-icons/fa';

// Use in components
<Microscope size={24} className="text-blue-600" />
<Brain size={32} color="#10B981" />
<FaUserMd className="w-6 h-6 text-gray-700" />`}
          </pre>
        </div>
      </section>
    </div>
  );
};

export default IconExamples;


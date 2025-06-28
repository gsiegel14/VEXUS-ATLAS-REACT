export interface PocusImageData {
  id: string;
  title: string;                    // From "Name" field
  description: string;              // From "Caption" field
  imageUrl: string;                 // From "De-identified Image/Video"
  thumbnailUrl: string;             // Generated from image attachment
  category: string;                 // From "Category" field
  section: string;                  // From "Section" field (should be "Cardiac")
  submissionDate: Date;             // From "Created" field
  contributor: string;              // From "Contributor" field
  tags: string[];                   // From "Tags (seperated by ",")" field
  status: string;                   // From "Submissions Status"
  isVideo: boolean;                 // Whether this is a video file
  metadata: {
    subcategory?: string[];         // From "Subcategory" field
    section?: string;               // From "Section" field
    submissionStatus?: string;      // From "Submissions Status"
    rawFields: any;
  };
}

export interface CategorizedImages {
  cardiomyopathy: PocusImageData[];
  congenitalHeartDisease: PocusImageData[];
  pericardialDisease: PocusImageData[];
  valvularDisease: PocusImageData[];
  rvDysfunction: PocusImageData[];
  other: PocusImageData[];
}

export interface CategoryConfig {
  key: keyof CategorizedImages;
  title: string;
  color: string;
  gradient: string;
  description: string;
  icon: React.ReactNode;
}

export interface CardiologyGalleryProps {
  categorizedImages: CategorizedImages | null;
  loading: boolean;
}

export interface ImageLightboxProps {
  images: PocusImageData[];
  initialIndex: number;
  open: boolean;
  onClose: () => void;
} 
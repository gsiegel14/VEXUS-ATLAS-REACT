# The POCUS ATLAS Cardiology Gallery - Implementation Plan

## Project Overview
Create a React-based image gallery for cardiology POCUS images, mirroring the VEXUS Atlas gallery structure but focused specifically on cardiac ultrasound content from The POCUS Atlas Uploads Airtable database.

## Airtable Configuration
- **Base ID**: `appqeNK596oLLcJdd`
- **Primary Table**: `Airtable Uploads` (ID: `tbl0LLbQwo8u7Ig1j`)
- **Filter Criteria**: `Section = "Cardiac"`
- **Key Fields**:
  - `Name` (fldqKDZNZ0pUIqEBw) - Image title
  - `Section` (fldNjetFW3gsQ3ybP) - Filter for "Cardiac"
  - `Category` (fldNOncMVqHzuSsxj) - Subcategory for grouping
  - `De-identified Image/Video` (fld121TeOObfvH79I) - Media files
  - `Caption` (fld3P9ne8czEyo76G) - Description
  - `Submissions Status` (fldEWEMV1jB3MZbmW) - Filter for "Published"
  - `Tags` (fldKIAzJFQP1qUlE1) - Additional metadata

## Project Structure
```
POCUS-CARDIOLOGY-GALLERY/
├── src/
│   ├── components/
│   │   └── gallery/
│   │       ├── CardiologyGallery.tsx
│   │       └── ImageLightbox.tsx
│   ├── services/
│   │   └── airtableService.ts
│   ├── types/
│   │   └── index.ts
│   └── App.tsx
├── server.js
├── package.json
├── vite.config.ts
├── tsconfig.json
└── google-credentials-production.json
```

## Phase 1: Server Setup (Based on server.js)

### 1.1 Dependencies
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "airtable": "^0.12.2",
    "@google-cloud/secret-manager": "^5.0.1",
    "axios": "^1.4.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@vitejs/plugin-react": "^4.0.3",
    "typescript": "^5.0.2",
    "vite": "^4.4.5"
  }
}
```

### 1.2 Google Secret Manager Secrets Required
- `POCUS_AIRTABLE_API_KEY` - Personal access token for Airtable
- `POCUS_AIRTABLE_BASE_ID` - `appqeNK596oLLcJdd`
- `POCUS_AIRTABLE_TABLE_NAME` - `Airtable Uploads`

### 1.3 Server Endpoints
```javascript
// Health check
GET /api/health

// Get all cardiac images
GET /api/images
// Returns: Filtered for Section="Cardiac" and Status="Published"

// Get images by cardiac category
GET /api/images/category/:categoryName
// Examples: /api/images/category/cardiomyopathy
//          /api/images/category/pericardial-disease

// Debug endpoints
GET /api/debug/fields
GET /api/debug/secrets
GET /api/raw
```

## Phase 2: Data Model Adaptation

### 2.1 TypeScript Interfaces
```typescript
export interface PocusImageData {
  id: string;
  title: string;                    // From "Name" field
  description: string;              // From "Caption" field
  imageUrl: string;                 // From "De-identified Image/Video"
  thumbnailUrl: string;             // Generated from image attachment
  category: string;                 // From "Category" field
  section: string;                  // Always "Cardiac"
  submissionDate: Date;             // From "Created" field
  contributor: string;              // From "Contributor" field
  tags: string[];                   // From "Tags" field
  status: string;                   // From "Submissions Status"
  metadata: {
    subcategory?: string[];
    webHierarchy?: string;
    type?: string;                  // Normal/Pathology
    rawFields: any;
  };
}

export interface CategorizedImages {
  cardiomyopathy: PocusImageData[];
  congenitalHeartDisease: PocusImageData[];
  pericardialDisease: PocusImageData[];
  valvulopathy: PocusImageData[];
  rvDysfunction: PocusImageData[];
  other: PocusImageData[];
}
```

### 2.2 Category Mapping
Based on Airtable Category field values:
```javascript
const CARDIAC_CATEGORIES = {
  'Cardiomyopathy': 'cardiomyopathy',
  'Congenital Heart Disease': 'congenitalHeartDisease', 
  'Pericardial Disease': 'pericardialDisease',
  'Valvulopathy': 'valvulopathy',
  'RV Dysfunction': 'rvDysfunction',
  'Other': 'other',
  'Cardiac Other': 'other',
  'Decreased Function': 'cardiomyopathy',
  'IVC': 'other'
};
```

## Phase 3: Frontend Components

### 3.1 CardiologyGallery.tsx Structure
```typescript
// Adapt ImageGallery.tsx with cardiac-specific categories
const categories: CategoryConfig[] = [
  {
    key: 'cardiomyopathy',
    title: 'Cardiomyopathy',
    color: '#d32f2f',
    gradient: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)',
    description: 'Echocardiographic assessment of various cardiomyopathies',
    icon: <MonitorHeart />
  },
  {
    key: 'pericardialDisease', 
    title: 'Pericardial Disease',
    color: '#1976d2',
    gradient: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
    description: 'Pericardial effusions, tamponade, and pericarditis',
    icon: <Favorite />
  },
  {
    key: 'congenitalHeartDisease',
    title: 'Congenital Heart Disease', 
    color: '#388e3c',
    gradient: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
    description: 'Pediatric and adult congenital cardiac abnormalities',
    icon: <ChildCare />
  },
  {
    key: 'valvulopathy',
    title: 'Valvular Disease',
    color: '#f57c00',
    gradient: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
    description: 'Valve stenosis, regurgitation, and valve morphology',
    icon: <Settings />
  },
  {
    key: 'rvDysfunction',
    title: 'RV Dysfunction',
    color: '#7b1fa2', 
    gradient: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
    description: 'Right ventricular strain and dysfunction patterns',
    icon: <TrendingDown />
  },
  {
    key: 'other',
    title: 'Other Cardiac',
    color: '#5d4037',
    gradient: 'linear-gradient(135deg, #efebe9 0%, #d7ccc8 100%)',
    description: 'IVC assessment, normal variants, and miscellaneous findings',
    icon: <MoreHoriz />
  }
];
```

### 3.2 Data Transformation Function
```javascript
function transformPocusRecord(record) {
  const fields = record.fields;
  
  return {
    id: record.id,
    title: fields['Name'] || 'Untitled Cardiac Study',
    description: fields['Caption'] || '',
    imageUrl: fields['De-identified Image/Video']?.[0]?.url || '',
    thumbnailUrl: fields['De-identified Image/Video']?.[0]?.thumbnails?.large?.url || 
                  fields['De-identified Image/Video']?.[0]?.url || '',
    
    // Cardiac-specific fields
    category: fields['Category'] || 'Other',
    section: fields['Section'] || 'Cardiac',
    submissionDate: record.createdTime ? new Date(record.createdTime) : new Date(),
    contributor: fields['Contributor (Name, credentials, twitter handle)'] || '',
    tags: fields['Tags'] ? (Array.isArray(fields['Tags']) ? fields['Tags'] : []) : [],
    status: fields['Submissions Status'] || '',
    
    metadata: {
      subcategory: fields['Subcategory'] || [],
      webHierarchy: fields['Web-hierarchy'],
      type: fields['Type'],
      rawFields: fields
    }
  };
}
```

## Phase 4: Server Implementation Details

### 4.1 Airtable Query Configuration
```javascript
// Essential fields for cardiac image gallery
const CARDIAC_FIELDS = [
  'Name',                                    // Title
  'Section',                                 // Filter field
  'Category',                                // Categorization
  'Caption',                                 // Description
  'De-identified Image/Video',               // Media files
  'Submissions Status',                      // Status filter
  'Contributor (Name, credentials, twitter handle)', // Attribution
  'Tags',                                    // Metadata
  'Subcategory',                             // Additional categorization
  'Type',                                    // Normal/Pathology
  'Web-hierarchy'                            // Hierarchical grouping
];

// Filter formula for cardiac images
const CARDIAC_FILTER = `AND({Section} = 'Cardiac', {Submissions Status} = 'Published')`;
```

### 4.2 API Endpoint Implementation
```javascript
// Get all cardiac images
app.get('/api/images', async (req, res) => {
  try {
    const base = await initializeAirtable();
    const records = [];
    
    await base('Airtable Uploads')
      .select({
        fields: CARDIAC_FIELDS,
        filterByFormula: CARDIAC_FILTER
      })
      .eachPage((pageRecords, fetchNextPage) => {
        pageRecords.forEach(record => {
          const transformedRecord = transformPocusRecord(record);
          records.push(transformedRecord);
        });
        fetchNextPage();
      });
    
    // Categorize the records
    const categorized = categorizePocusImages(records);
    res.json(categorized);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## Phase 5: Frontend App Structure

### 5.1 App.tsx (Minimal - No Header)
```typescript
import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Box, Typography } from '@mui/material';
import CardiologyGallery from './components/gallery/CardiologyGallery';
import { fetchCardiologyImages } from './services/airtableService';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' }
  },
  typography: {
    fontFamily: 'system-ui, -apple-system, sans-serif'
  }
});

function App() {
  const [images, setImages] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      const data = await fetchCardiologyImages();
      setImages(data);
    } catch (error) {
      console.error('Failed to load images:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
        <Box sx={{ maxWidth: 1400, mx: 'auto', px: 3 }}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom 
            sx={{ 
              textAlign: 'center', 
              fontWeight: 600,
              mb: 4,
              color: 'primary.main'
            }}
          >
            The POCUS Atlas - Cardiology Gallery
          </Typography>
          
          <CardiologyGallery 
            categorizedImages={images} 
            loading={loading} 
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
```

## Phase 6: Deployment Checklist

### 6.1 Environment Setup
1. Create Google Cloud Project
2. Enable Secret Manager API
3. Store Airtable credentials in Secret Manager:
   - `POCUS_AIRTABLE_API_KEY`
   - `POCUS_AIRTABLE_BASE_ID`
   - `POCUS_AIRTABLE_TABLE_NAME`

### 6.2 Build Configuration
```javascript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5437,
    proxy: {
      '/api': 'http://localhost:8080'
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
```

### 6.3 Docker Configuration (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 8080
CMD ["node", "server.js"]
```

## Phase 7: Testing Strategy

### 7.1 API Testing
- Test `/api/health` endpoint
- Verify Airtable connection
- Test image filtering by cardiac categories
- Validate thumbnail generation

### 7.2 Frontend Testing
- Test image loading and categorization
- Verify lightbox functionality
- Test responsive design
- Validate accessibility features

## Phase 8: Key Differences from VEXUS Atlas

### 8.1 Data Source Changes
- Different Airtable base and table structure
- Cardiac-focused categorization instead of vein types
- Different field mappings and metadata

### 8.2 UI Adaptations
- Cardiac category colors and icons
- Medical terminology specific to cardiology
- Different filtering and search criteria

### 8.3 Content Focus
- Point-of-care cardiac ultrasound
- Educational cardiology content
- Clinical correlation emphasis

## Success Metrics
- [ ] Server successfully connects to POCUS Atlas Airtable
- [ ] Images load and display correctly in categories
- [ ] Lightbox functionality works for image viewing
- [ ] Responsive design works on mobile/tablet
- [ ] Performance is acceptable (< 3s load time)
- [ ] All cardiac categories populate with appropriate images
- [ ] Search and filtering work correctly

## Timeline Estimate
- **Phase 1-2 (Server & Data)**: 1-2 days
- **Phase 3-4 (Frontend Components)**: 2-3 days  
- **Phase 5-6 (Integration & Deploy)**: 1 day
- **Phase 7 (Testing & Polish)**: 1 day
- **Total**: 5-7 days

This plan provides a complete roadmap for adapting your VEXUS Atlas codebase into The POCUS ATLAS Cardiology Gallery with the specific Airtable integration you've outlined. 
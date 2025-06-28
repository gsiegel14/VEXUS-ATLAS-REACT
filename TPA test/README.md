# The POCUS Atlas (TPA) - VEXUS Image Gallery

A React-based image gallery for VEXUS ultrasound images, adapted from the original VEXUS Atlas codebase to work with existing Airtable data.

## Project Overview

This application displays VEXUS ultrasound images categorized by vein types (Hepatic, Portal, Renal) using data from your existing VEXUS Airtable database. It provides a clean, professional interface for browsing and viewing medical ultrasound images.

## Features

- **Image Gallery**: Browse images by vein type (Hepatic, Portal, Renal)
- **Search & Filter**: Search images by title, description, and metadata
- **Lightbox Viewer**: Full-screen image viewing with keyboard navigation
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Professional UI**: Clean, medical-grade interface design

## Technical Stack

- **Frontend**: React 18 + TypeScript + Material-UI
- **Backend**: Node.js + Express
- **Database**: Airtable (using existing VEXUS credentials)
- **Cloud**: Google Secret Manager for credentials
- **Build**: Vite for fast development and building

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- Access to Google Cloud Project `decoded-app-457000-s2`
- Existing VEXUS Airtable credentials in Google Secret Manager

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Build Frontend**
   ```bash
   npm run build
   ```

3. **Start Server**
   ```bash
   npm run backend
   ```

The application will be available at `http://localhost:5555`

### Development Mode

For development with hot reload:

```bash
# Terminal 1: Start backend
npm run backend

# Terminal 2: Start frontend dev server
npm run dev
```

- Backend: `http://localhost:5555`
- Frontend Dev: `http://localhost:8081`

## API Endpoints

### Health & Debug
- `GET /api/health` - Server health check
- `GET /api/debug/secrets` - Secret loading status
- `GET /api/debug/fields` - Available Airtable fields

### POCUS Images
- `GET /api/pocus/images` - Get all VEXUS images
- `GET /api/pocus/images/category/:name` - Get images by vein type
- `GET /api/pocus/debug/fields` - Debug Airtable field structure

### Legacy VEXUS Endpoints
- `GET /api/images` - Original VEXUS images endpoint
- `GET /api/images/category/:veinType` - Images by vein type

## Configuration

The application uses Google Secret Manager with these secrets:
- `AIRTABLE_API_KEY` - Airtable personal access token
- `AIRTABLE_BASE_ID` - Your VEXUS Airtable base ID
- `AIRTABLE_TABLE_NAME` - Table name in Airtable

## File Structure

```
TPA test/
├── server.js                 # Express server with API endpoints
├── package.json             # Dependencies and scripts
├── vite.config.ts          # Vite build configuration
├── tsconfig.json           # TypeScript configuration
├── index.html              # HTML template
├── dist/                   # Built frontend files
├── src/                    # React source code
│   ├── components/         # React components
│   │   └── gallery/       # Gallery-specific components
│   ├── services/          # API service layer
│   ├── types/             # TypeScript interfaces
│   └── pages/             # Page components
└── google-credentials-production.json  # Google Cloud credentials
```

## Key Components

### Backend (`server.js`)
- Express server running on port 5555
- Airtable integration using existing VEXUS credentials
- Google Secret Manager integration
- CORS configuration for development and production

### Frontend Components
- `CardiologyGallery.tsx` - Main gallery component (adapted for VEXUS data)
- `ImageLightbox.tsx` - Full-screen image viewer
- `PocusApp.tsx` - Main POCUS application wrapper

### Data Types
- `PocusImageData` - Image data interface
- `CategorizedImages` - Categorized image collections
- `CategoryConfig` - Category configuration interface

## Deployment Notes

- Server serves both API endpoints and built React frontend
- Uses existing VEXUS Airtable database and credentials
- Configured for Google Cloud deployment with Secret Manager
- CORS configured for multiple development ports

## Development History

This project was adapted from the original VEXUS Atlas codebase to create a standalone POCUS Atlas application. Key changes:

1. **Port Change**: Moved from 4001 to 5555
2. **Credential Reuse**: Uses existing VEXUS Airtable credentials
3. **Data Adaptation**: Adapted to work with VEXUS database structure
4. **UI Updates**: Maintained professional medical interface styling

## Usage

1. Start the server: `npm run backend`
2. Open browser to `http://localhost:5555`
3. Browse images by vein type categories
4. Use search to find specific images
5. Click images for full-screen viewing
6. Use keyboard navigation in lightbox (arrows, escape, 'i' for info)

## Support

For issues or questions about this POCUS Atlas implementation, refer to the original implementation plan document or check the server logs for debugging information. 
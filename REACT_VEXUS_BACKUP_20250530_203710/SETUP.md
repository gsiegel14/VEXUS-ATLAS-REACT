# VEXUS Atlas Setup Guide

## 🚀 **Quick Start**

This guide will help you set up the real Airtable and Google Secret Manager integrations for the VEXUS Atlas Image Gallery.

## 📋 **Prerequisites**

- Node.js 18+ installed
- Airtable account with API access
- Google Cloud project (optional, for production)
- Your VEXUS image database ready

## 🔧 **Environment Configuration**

### 1. Create Environment File

Create a `.env.local` file in the `REACT VEXUS` directory:

```bash
# Airtable Configuration
VITE_AIRTABLE_API_KEY=patXXXXXXXXXXXXXX
VITE_AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
VITE_AIRTABLE_TABLE_NAME=VEXUS_Images

# API Configuration
VITE_API_BASE_URL=http://localhost:3001/api

# Feature Flags
VITE_ENABLE_IMAGE_UPLOAD=true
VITE_ENABLE_REALTIME_SYNC=false
VITE_ENABLE_ANALYTICS=false

# Image Configuration
VITE_MAX_IMAGE_SIZE=5242880
```

### 2. Airtable Setup

#### Create Your Airtable Base:

1. Go to [Airtable](https://airtable.com) and create a new base
2. Create a table called "VEXUS_Images" with these fields:

| Field Name | Field Type | Options |
|------------|------------|---------|
| Title | Single line text | Primary field |
| Description | Long text | |
| ImageURL | URL | |
| ThumbnailURL | URL | Optional |
| Quality | Single select | High, Medium, Low |
| VeinType | Single select | Hepatic Vein, Portal Vein, Renal Vein |
| Waveform | Single select | Normal, Abnormal, Reversal, Pulsatile |
| Subtype | Single select | S-Wave, D-Wave, Continuous, Biphasic |
| VEXUSGrade | Single select | 0, 1, 2, 3 |
| ClinicalContext | Long text | |
| Analysis | Long text | |
| QA | Long text | Quality Assurance notes |
| SubmittedBy | Email | |
| Institution | Single line text | |
| SubmissionDate | Date | |
| Approved | Checkbox | |
| Tags | Multiple select | |

#### Get Your API Credentials:

1. Go to [Airtable API page](https://airtable.com/developers/web/api/introduction)
2. Click "Create token"
3. Give it a name like "VEXUS Atlas"
4. Select your base and table
5. Grant these permissions: `data.records:read`, `data.records:write`
6. Copy the token (starts with `pat`)

#### Get Your Base ID:

1. Go to [Airtable API docs](https://airtable.com/developers/web/api/introduction)
2. Select your base
3. Copy the Base ID from the URL (starts with `app`)

### 3. Backend Server Setup

The backend server handles image uploads and Airtable integration.

#### Install Dependencies:

```bash
cd "REACT VEXUS"
npm install express cors dotenv airtable multer sharp
```

#### Update server.js:

The server.js file needs to be updated to handle real Airtable operations. Here's the structure:

```javascript
// server.js - Updated for real Airtable integration
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const Airtable = require('airtable');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Configure Airtable
Airtable.configure({
  apiKey: process.env.VITE_AIRTABLE_API_KEY
});

const base = Airtable.base(process.env.VITE_AIRTABLE_BASE_ID);

// ... rest of server implementation
```

## 🗃️ **Database Migration**

If you have existing VEXUS images, you can migrate them to Airtable:

### 1. Prepare Your Data

Format your existing data to match the Airtable schema:

```javascript
const imageData = {
  "Title": "Normal Hepatic Vein Flow",
  "Description": "Typical hepatic vein flow pattern",
  "ImageURL": "https://your-storage.com/image.jpg",
  "Quality": "High",
  "VeinType": "Hepatic Vein",
  "Waveform": "Normal",
  "VEXUSGrade": "0",
  "Approved": true
};
```

### 2. Batch Upload Script

Create a migration script to upload your existing images:

```javascript
// migrate-images.js
const Airtable = require('airtable');

const base = Airtable.base('your_base_id');

async function migrateImages(imageArray) {
  const batchSize = 10; // Airtable limit
  
  for (let i = 0; i < imageArray.length; i += batchSize) {
    const batch = imageArray.slice(i, i + batchSize);
    
    try {
      const records = await base('VEXUS_Images').create(
        batch.map(img => ({ fields: img }))
      );
      console.log(`Uploaded batch ${Math.floor(i/batchSize) + 1}`);
    } catch (error) {
      console.error('Batch upload failed:', error);
    }
  }
}

// Usage: node migrate-images.js
```

## 🚀 **Running the Application**

### 1. Start the Backend Server:

```bash
# In the REACT VEXUS directory
node server.js
```

### 2. Start the React Development Server:

```bash
# In another terminal, same directory
npm run dev
```

### 3. Access the Application:

- Frontend: http://localhost:5436
- Backend API: http://localhost:3001

## 🧪 **Testing the Integration**

### 1. Test Image Gallery:

Visit http://localhost:5436/image-atlas and verify:
- Images load from Airtable
- Filtering works correctly
- Categories display properly

### 2. Test Image Upload:

1. Click "Contribute Images" button
2. Upload a test image
3. Fill out the form
4. Submit and verify it appears in Airtable

### 3. Verify Backend API:

Test the API endpoints:

```bash
# Get all images
curl http://localhost:3001/api/images

# Get images by category
curl http://localhost:3001/api/images/hepatic
```

## 🔒 **Security & Production**

### Environment Variables:

Never commit your `.env.local` file. For production:

1. Use environment variables in your hosting platform
2. Consider using Google Secret Manager for sensitive data
3. Implement proper API rate limiting

### Image Storage:

For production, consider:
- Cloud storage (AWS S3, Google Cloud Storage)
- CDN for fast image delivery
- Image optimization and compression

## 🐛 **Troubleshooting**

### Common Issues:

1. **"Cannot find module" errors**: Run `npm install`
2. **Airtable API errors**: Check your API key and base ID
3. **CORS errors**: Ensure your backend allows frontend domain
4. **Image upload fails**: Check file size limits and formats

### Debug Mode:

Enable debug logging by setting:

```bash
VITE_DEBUG=true
```

## 📞 **Support**

If you encounter issues:

1. Check the browser console for errors
2. Verify your Airtable base structure matches the schema
3. Test API endpoints directly
4. Check server logs for backend issues

## 🎯 **Next Steps**

Once the basic integration is working:

1. Set up image optimization
2. Implement user authentication
3. Add admin approval workflow
4. Set up monitoring and analytics
5. Deploy to production

---

**Status**: ✅ Layout and styling complete, ready for real integrations! 
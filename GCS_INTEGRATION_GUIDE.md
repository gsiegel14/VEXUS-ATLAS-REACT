# Google Cloud Storage Integration Guide

## Overview

This guide documents the Google Cloud Storage (GCS) integration for the VEXUS Atlas application. The integration provides secure, scalable storage for:

1. **Contact Forms** - User contact submissions with attachments
2. **Image Atlas Uploads** - Medical image submissions for the atlas
3. **Calculator Images** - AI analysis images from the VEXUS calculator

## Architecture

### GCS Buckets

Three dedicated buckets store different types of data:

- `vexus-contact-forms` - Contact form data and attachments
- `vexus-image-atlas` - Image atlas submissions and metadata  
- `vexus-calculator-images` - Calculator images and analysis results

### Data Structure

Each bucket stores:
- **Original files** (images, documents)
- **Metadata JSON files** with structured data
- **Organized by submission ID** for easy retrieval

## API Endpoints

### 1. Contact Form Submission

**Endpoint:** `POST /api/contact`  
**Content-Type:** `multipart/form-data`

**Fields:**
- `name` (required) - Contact name
- `email` (required) - Contact email
- `institution` (optional) - Institution/organization
- `subject` (required) - Message subject
- `message` (required) - Message content
- `attachments` (optional) - Multiple files up to 5MB each

**Response:**
```json
{
  "success": true,
  "contactId": "uuid-string",
  "metadata": {
    "url": "https://storage.googleapis.com/vexus-contact-forms/contact-uuid.json",
    "fileName": "contact-uuid.json"
  },
  "attachments": [
    {
      "url": "https://storage.googleapis.com/vexus-contact-forms/file.pdf",
      "fileName": "timestamp-uuid-file.pdf",
      "originalName": "file.pdf",
      "contentType": "application/pdf"
    }
  ],
  "message": "Contact form data stored successfully"
}
```

### 2. Image Atlas Upload

**Endpoint:** `POST /api/images/upload`  
**Content-Type:** `multipart/form-data`

**Fields:**
- `image` (required) - Image file
- `title` (required) - Image title
- `description` (required) - Description
- `email` (required) - Submitter email
- `institution` (optional) - Institution
- `veinType` (required) - hepatic/portal/renal
- `quality` (optional) - high/medium/low
- `clinicalContext` (optional) - Clinical context
- `vexusGrade` (optional) - 0/1/2/3
- `waveform` (optional) - normal/abnormal/reversal/pulsatile

**Response:**
```json
{
  "success": true,
  "submissionId": "uuid-string",
  "imageUrl": "https://storage.googleapis.com/vexus-image-atlas/image.jpg",
  "thumbnailUrl": "https://storage.googleapis.com/vexus-image-atlas/image.jpg",
  "metadata": {
    "url": "https://storage.googleapis.com/vexus-image-atlas/atlas-submission-uuid.json",
    "fileName": "atlas-submission-uuid.json"
  },
  "recordId": "uuid-string",
  "message": "Image atlas submission stored successfully"
}
```

### 3. Calculator Image Upload

**Endpoint:** `POST /api/calculator/upload/:veinType`  
**Content-Type:** `multipart/form-data`

**Parameters:**
- `veinType` (URL param) - hepatic/portal/renal

**Fields:**
- `image` (required) - Image file
- `aiResult` (optional) - JSON string of AI analysis result

**Response:**
```json
{
  "success": true,
  "calculationId": "uuid-string",
  "imageUrl": "https://storage.googleapis.com/vexus-calculator-images/image.jpg",
  "metadata": {
    "url": "https://storage.googleapis.com/vexus-calculator-images/calculator-hepatic-uuid.json",
    "fileName": "calculator-hepatic-uuid.json"
  },
  "message": "Calculator image stored successfully"
}
```

### 4. List Files (Admin/Debug)

**Endpoint:** `GET /api/gcs/files/:type`

**Parameters:**
- `type` - contact/atlas/calculator

**Response:**
```json
{
  "success": true,
  "bucket": "vexus-contact-forms",
  "files": [
    {
      "name": "contact-uuid.json",
      "bucket": "vexus-contact-forms",
      "created": "2025-05-31T20:00:00.000Z",
      "updated": "2025-05-31T20:00:00.000Z",
      "size": "1024",
      "contentType": "application/json",
      "publicUrl": "https://storage.googleapis.com/vexus-contact-forms/contact-uuid.json"
    }
  ],
  "count": 1
}
```

## Frontend Services

### Contact Service

```typescript
import { contactService } from '../services/contactService';

const result = await contactService.submitContactForm({
  name: 'John Doe',
  email: 'john@example.com',
  institution: 'Hospital',
  subject: 'general',
  message: 'Hello',
  attachments: [file1, file2]
});
```

### Image Upload Service

```typescript
import { imageUploadService } from '../services/imageUploadService';

const result = await imageUploadService.uploadImageWithProgress(
  submissionData,
  (progress) => console.log(`${progress.percentage}% complete`)
);
```

### Calculator Upload Service

```typescript
import { calculatorUploadService } from '../services/calculatorUploadService';

const result = await calculatorUploadService.uploadCalculatorImage(
  'hepatic',
  imageBlob,
  aiResult
);
```

## Data Persistence

### Metadata Structure

Each submission creates a metadata JSON file containing:

```json
{
  "id": "submission-uuid",
  "type": "contact_form|image_atlas_submission|calculator_submission",
  "submittedAt": "2025-05-31T20:00:00.000Z",
  "veinType": "hepatic", // for image/calculator uploads
  "submittedBy": "email@example.com",
  "originalData": { /* original form data */ },
  "files": [ /* file references */ ]
}
```

### File Naming Convention

- **Contact forms:** `contact-{uuid}.json`
- **Image atlas:** `atlas-submission-{uuid}.json`  
- **Calculator:** `calculator-{veinType}-{uuid}.json`
- **Uploaded files:** `{timestamp}-{uuid}-{originalName}`

## Security

### Permissions

- **Public read access** for approved atlas images
- **Private access** for contact forms and calculator data
- **Signed URLs** available for secure temporary access

### Validation

- **File type validation** on upload
- **Size limits** (5MB for attachments, 10MB for images)
- **Required field validation**
- **Email format validation**

## Administration

### Bucket Management

Buckets are automatically created on server startup with:
- Location: `US`
- Storage class: `STANDARD`
- Public access: Disabled by default

### Monitoring Files

Use the admin endpoint to monitor uploads:

```bash
# List contact form submissions
curl http://localhost:3001/api/gcs/files/contact

# List image atlas submissions  
curl http://localhost:3001/api/gcs/files/atlas

# List calculator uploads
curl http://localhost:3001/api/gcs/files/calculator
```

## Error Handling

### Common Errors

1. **File too large** - Reduce file size
2. **Invalid file type** - Use supported formats
3. **Missing required fields** - Check form data
4. **Upload timeout** - Check network connection
5. **GCS permissions** - Verify service account setup

### Error Response Format

```json
{
  "success": false,
  "error": "Detailed error message"
}
```

## Development

### Local Setup

1. Ensure `google-credentials-production.json` is present
2. Start the server: `node server.js`
3. Buckets will be created automatically
4. Test endpoints using the health check: `/api/health`

### Environment Variables

The service uses Google Secret Manager for configuration:
- `AIRTABLE_API_KEY`
- `AIRTABLE_BASE_ID` 
- `AIRTABLE_TABLE_ID`
- `AIRTABLE_TABLE_NAME`
- `googlescholarapi`

## Testing

### Manual Testing

```bash
# Test contact form
curl -X POST http://localhost:3001/api/contact \
  -F "name=Test User" \
  -F "email=test@example.com" \
  -F "subject=general" \
  -F "message=Test message" \
  -F "attachments=@test.pdf"

# Test image upload
curl -X POST http://localhost:3001/api/images/upload \
  -F "image=@test.jpg" \
  -F "title=Test Image" \
  -F "description=Test description" \
  -F "email=test@example.com" \
  -F "veinType=hepatic"

# Test calculator upload
curl -X POST http://localhost:3001/api/calculator/upload/hepatic \
  -F "image=@test.jpg"
```

## Troubleshooting

### Common Issues

1. **Bucket creation fails** - Check GCP permissions
2. **Upload fails** - Verify service account key
3. **Files not appearing** - Check bucket permissions
4. **Timeout errors** - Increase timeout settings

### Debug Information

Enable detailed logging by checking server console output for:
- ✅ GCS bucket initialization
- 📬 Form submissions
- 🖼️ Image uploads  
- 🧮 Calculator uploads

## Next Steps

### Planned Enhancements

1. **Image thumbnails** - Automatic generation
2. **File compression** - Reduce storage costs
3. **Batch operations** - Multiple file handling
4. **Webhook notifications** - Real-time updates
5. **Data analytics** - Usage metrics 
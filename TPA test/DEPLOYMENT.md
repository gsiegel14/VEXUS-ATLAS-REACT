# TPA POCUS Atlas - Deployment Guide

This guide explains how to deploy the TPA POCUS Atlas application to Google Cloud Run.

## Prerequisites

1. **Google Cloud CLI**: Install and authenticate with gcloud
   ```bash
   # Install gcloud CLI (if not already installed)
   curl https://sdk.cloud.google.com | bash
   exec -l $SHELL
   
   # Authenticate
   gcloud auth login
   gcloud auth application-default login
   ```

2. **Project Access**: Ensure you have access to the `decoded-app-457000-s2` project
   ```bash
   gcloud config set project decoded-app-457000-s2
   ```

3. **Required Permissions**: You need the following IAM roles:
   - Cloud Build Editor
   - Cloud Run Admin
   - Storage Admin
   - Secret Manager Secret Accessor

## Deployment Methods

### Method 1: Automated Deployment (Recommended)

Use the provided deployment script:

```bash
# Make the script executable (if not already)
chmod +x deploy.sh

# Run the deployment
./deploy.sh
```

### Method 2: Manual Deployment

1. **Build and Deploy with Cloud Build**:
   ```bash
   gcloud builds submit --config cloudbuild.yaml .
   ```

2. **Or build locally and deploy**:
   ```bash
   # Build the Docker image
   docker build -t gcr.io/decoded-app-457000-s2/tpa-pocus-atlas .
   
   # Push to Container Registry
   docker push gcr.io/decoded-app-457000-s2/tpa-pocus-atlas
   
   # Deploy to Cloud Run
   gcloud run deploy tpa-pocus-atlas \
     --image gcr.io/decoded-app-457000-s2/tpa-pocus-atlas \
     --region us-central1 \
     --platform managed \
     --allow-unauthenticated \
     --port 8080 \
     --memory 2Gi \
     --cpu 2 \
     --max-instances 10
   ```

## Configuration

### Environment Variables

The application uses Google Secret Manager for configuration. Required secrets:

- `POCUS_AIRTABLE_API_KEY`: Airtable API key for POCUS Atlas
- `POCUS_AIRTABLE_BASE_ID`: Airtable base ID
- `POCUS_AIRTABLE_TABLE_NAME`: Table name (usually "Uploads")
- `googlescholarapi`: SerpAPI key for Google Scholar integration

### Secrets Setup

Secrets are automatically fetched from Google Secret Manager in the `decoded-app-457000-s2` project.

## Application Structure

```
TPA test/
├── src/                    # React frontend source
├── public/                 # Static assets
├── dist/                   # Built frontend (generated)
├── tpaserver.js           # Node.js backend server
├── Dockerfile             # Container configuration
├── cloudbuild.yaml        # Cloud Build configuration
├── deploy.sh              # Deployment script
└── package.json           # Dependencies and scripts
```

## Key Features

- **React Frontend**: Modern UI built with Material-UI
- **Node.js Backend**: Express server with Airtable integration
- **POCUS Atlas Integration**: Fetches cardiac ultrasound images from Airtable
- **Google Scholar API**: Research paper integration
- **Responsive Design**: Works on desktop and mobile devices

## Monitoring and Logs

### View Logs
```bash
gcloud run services logs read tpa-pocus-atlas --region=us-central1
```

### Health Check
Once deployed, check the health endpoint:
```
https://your-service-url/api/health
```

### API Endpoints
- `/api/health` - Health check
- `/api/pocus/images` - Cardiac images from POCUS Atlas
- `/api/scholar/search` - Google Scholar search
- `/api/faculty/:id/research` - Faculty-specific research

## Troubleshooting

### Common Issues

1. **Build Failures**: Check that all dependencies are properly listed in package.json
2. **Secret Access**: Ensure the service account has Secret Manager access
3. **Airtable Connection**: Verify API keys and base IDs are correct
4. **CORS Issues**: Check CORS configuration in tpaserver.js

### Debug Commands

```bash
# Check service status
gcloud run services describe tpa-pocus-atlas --region=us-central1

# View recent logs
gcloud run services logs tail tpa-pocus-atlas --region=us-central1

# Test locally
npm run dev:all
```

## Updates

To update the deployed application:

1. Make your changes
2. Run the deployment script: `./deploy.sh`
3. The new version will be automatically deployed

## Security

- All sensitive configuration is stored in Google Secret Manager
- CORS is configured for production domains
- The application runs with minimal privileges
- Static files are served securely

## Support

For issues or questions:
1. Check the application logs
2. Verify secret manager configuration
3. Test API endpoints individually
4. Contact the development team 
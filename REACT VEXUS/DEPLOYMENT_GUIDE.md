# 🚀 VEXUS Atlas Deployment Guide

Complete guide for deploying the VEXUS Atlas React application to Google Cloud Run with custom domain setup.

## 📋 Prerequisites

- Google Cloud account with billing enabled
- Domain registered (e.g., thevexusatlas.com)
- Node.js 18+ installed
- Google Cloud CLI installed and configured

## 🔧 Initial Setup

### 1. Google Cloud Project Setup
```bash
# Set your project ID
PROJECT_ID="decoded-app-457000-s2"
gcloud config set project $PROJECT_ID

# Enable required APIs
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

### 2. Authentication
```bash
# Login with your deployment account
gcloud auth login thevexusatlas@gmail.com

# Verify authentication
gcloud auth list
```

## 🏗️ Build and Deploy

### Quick Deploy (Recommended)
```bash
# Navigate to project directory
cd "REACT VEXUS"

# Make deploy script executable and run
chmod +x deploy.sh
./deploy.sh
```

### Manual Deploy Steps

#### Step 1: Build React Application
```bash
npm run build
```

#### Step 2: Build Docker Image
```bash
gcloud builds submit --tag gcr.io/$PROJECT_ID/vexus-atlas
```

#### Step 3: Deploy to Cloud Run
```bash
gcloud run deploy vexus-atlas \
  --image gcr.io/$PROJECT_ID/vexus-atlas \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --service-account=vexus-atlas-app@$PROJECT_ID.iam.gserviceaccount.com \
  --set-env-vars="NODE_ENV=production,GOOGLE_CLOUD_PROJECT_ID=$PROJECT_ID" \
  --memory=1Gi \
  --cpu=1 \
  --min-instances=0 \
  --max-instances=10 \
  --concurrency=100 \
  --timeout=300 \
  --port=8080
```

## 🌐 Custom Domain Setup

### 1. DNS Configuration

Add these DNS records to your domain provider (Google Domains, Squarespace, etc.):

#### A Records (IPv4)
```
Name: @    Type: A    Data: 216.239.32.21
Name: @    Type: A    Data: 216.239.34.21
Name: @    Type: A    Data: 216.239.36.21
Name: @    Type: A    Data: 216.239.38.21
```

#### AAAA Records (IPv6)
```
Name: @    Type: AAAA    Data: 2001:4860:4802:32::15
Name: @    Type: AAAA    Data: 2001:4860:4802:34::15
Name: @    Type: AAAA    Data: 2001:4860:4802:36::15
Name: @    Type: AAAA    Data: 2001:4860:4802:38::15
```

#### CNAME Record (for www subdomain)
```
Name: www    Type: CNAME    Data: thevexusatlas.com
```

### 2. Domain Mapping in Google Cloud Run

```bash
# Create domain mapping
gcloud beta run domain-mappings create \
  --service=vexus-atlas \
  --domain=thevexusatlas.com \
  --region=us-central1

# Create www subdomain mapping
gcloud beta run domain-mappings create \
  --service=vexus-atlas \
  --domain=www.thevexusatlas.com \
  --region=us-central1
```

### 3. Verify Domain Mappings
```bash
# List all domain mappings
gcloud beta run domain-mappings list --region=us-central1

# Check DNS resolution
dig thevexusatlas.com A +short
dig thevexusatlas.com AAAA +short
```

## 🔍 Verification and Testing

### Health Checks
```bash
# Test Cloud Run service directly
curl https://vexus-atlas-rufmnmj7bq-uc.a.run.app/api/health

# Test custom domain (after SSL provisioning)
curl https://thevexusatlas.com/api/health
```

### API Endpoints
- **Health Check**: `/api/health`
- **Images API**: `/api/images`
- **Debug/Secrets**: `/api/debug/secrets`

## 📊 Service Configuration

| Setting | Value |
|---------|-------|
| **Memory** | 1GB |
| **CPU** | 1 vCPU |
| **Min Instances** | 0 (scales to zero) |
| **Max Instances** | 10 |
| **Concurrency** | 100 requests/instance |
| **Timeout** | 300 seconds |
| **Port** | 8080 |
| **Authentication** | Public (unauthenticated) |

## 🔐 Environment Variables

The following environment variables are automatically set:

- `NODE_ENV=production`
- `GOOGLE_CLOUD_PROJECT_ID=decoded-app-457000-s2`
- `PORT=8080` (automatically set by Cloud Run)

## 📁 Project Structure

```
REACT VEXUS/
├── src/                          # React source code
├── public/                       # Static assets
├── dist/                         # Built React app
├── server.js                     # Express server
├── Dockerfile                    # Docker configuration
├── cloudbuild.yaml              # Cloud Build configuration
├── deploy.sh                    # Deployment script
├── package.json                 # Dependencies
├── google-credentials-production.json  # Service account key
└── DEPLOYMENT_GUIDE.md          # This file
```

## 🐛 Troubleshooting

### Common Issues

#### 1. SSL Certificate Not Ready
- **Issue**: HTTPS not working immediately after domain setup
- **Solution**: Wait 10 minutes to 24 hours for Google to provision SSL certificate
- **Check**: Try HTTP first, then HTTPS later

#### 2. DNS Not Resolving
```bash
# Check DNS propagation
nslookup thevexusatlas.com
dig thevexusatlas.com A

# Use online tools
# - https://dnschecker.org/
# - https://whatsmydns.net/
```

#### 3. Build Failures
```bash
# Check build logs
gcloud builds list --limit=5

# View specific build
gcloud builds log [BUILD_ID]
```

#### 4. Service Not Starting
```bash
# Check service logs
gcloud run services logs read vexus-atlas --region=us-central1

# Check service status
gcloud run services describe vexus-atlas --region=us-central1
```

### Port Configuration Issues
- **Never set PORT in environment variables** - Cloud Run sets this automatically
- **Always use port 8080** in Dockerfile and server configuration

## 🔄 Redeployment

To redeploy after making changes:

```bash
# Quick redeploy
./deploy.sh

# Or manual steps
npm run build
gcloud builds submit --tag gcr.io/$PROJECT_ID/vexus-atlas
# Service will auto-update with new image
```

## 📱 Live URLs

- **Production**: https://thevexusatlas.com
- **WWW**: https://www.thevexusatlas.com  
- **Cloud Run Direct**: https://vexus-atlas-rufmnmj7bq-uc.a.run.app

## 🎯 Performance Optimization

### Recommended Improvements
1. **Code Splitting**: Implement dynamic imports to reduce bundle size
2. **CDN**: Consider using Google Cloud CDN for static assets
3. **Caching**: Implement proper HTTP caching headers
4. **Monitoring**: Set up Google Cloud Monitoring and Alerting

### Current Bundle Analysis
- **Main Bundle**: ~912KB (260KB gzipped)
- **Recommendation**: Split into smaller chunks for better loading performance

## 🔒 Security

- Service account: `vexus-atlas-app@decoded-app-457000-s2.iam.gserviceaccount.com`
- HTTPS enforced via automatic redirect
- No authentication required (public service)
- Secrets managed via Google Secret Manager

## 📞 Support

For deployment issues:
1. Check the troubleshooting section above
2. Review Cloud Run logs: `gcloud run services logs read vexus-atlas --region=us-central1`
3. Verify DNS settings with online tools
4. Ensure all prerequisites are met

---

**Last Updated**: July 1, 2025  
**Version**: 1.0.0  
**Service**: vexus-atlas  
**Region**: us-central1

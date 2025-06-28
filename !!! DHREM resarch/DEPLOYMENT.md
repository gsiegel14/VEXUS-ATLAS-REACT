# DHREM Research Portal - Google Cloud Run Deployment Guide

## Overview

This guide covers deploying the Denver Health Ultrasound Research Portal to Google Cloud Run. The application includes a React frontend and Node.js backend with Google Secret Manager integration for secure API key management.

## Prerequisites

### Required Tools
- [Google Cloud CLI](https://cloud.google.com/sdk/docs/install)
- [Docker](https://docs.docker.com/get-docker/)
- Access to Google Cloud Project: `decoded-app-457000-s2`

### Google Cloud Setup
1. Install and authenticate Google Cloud CLI:
   ```bash
   gcloud auth login
   gcloud auth application-default login
   ```

2. Set your project:
   ```bash
   gcloud config set project decoded-app-457000-s2
   ```

## Deployment Methods

### Method 1: Automated Deployment (Recommended)

Use the provided deployment script for a fully automated deployment:

```bash
./deploy.sh
```

This script will:
- ✅ Check dependencies
- ✅ Configure Google Cloud APIs
- ✅ Create/configure service account
- ✅ Build and push Docker image
- ✅ Deploy to Cloud Run
- ✅ Test the deployment

### Method 2: Manual Deployment

#### Step 1: Build the Application
```bash
npm run build:production
```

#### Step 2: Build Docker Image
```bash
docker build -t gcr.io/decoded-app-457000-s2/dhrem-research:latest .
```

#### Step 3: Push to Google Container Registry
```bash
docker push gcr.io/decoded-app-457000-s2/dhrem-research:latest
```

#### Step 4: Deploy to Cloud Run
```bash
gcloud run deploy dhrem-research \
  --image=gcr.io/decoded-app-457000-s2/dhrem-research:latest \
  --platform=managed \
  --region=us-central1 \
  --allow-unauthenticated \
  --memory=1Gi \
  --cpu=1 \
  --port=4001 \
  --set-env-vars="NODE_ENV=production,GOOGLE_CLOUD_PROJECT=decoded-app-457000-s2"
```

### Method 3: Using npm Scripts

```bash
# Build and push image
npm run gcp:build

# Deploy to Cloud Run
npm run gcp:deploy
```

## Configuration

### Environment Variables
The following environment variables are automatically set in production:
- `NODE_ENV=production`
- `GOOGLE_CLOUD_PROJECT=decoded-app-457000-s2`
- `GOOGLE_CLOUD_PROJECT_ID=decoded-app-457000-s2`

### Service Account
The deployment creates a service account with the following permissions:
- `roles/secretmanager.secretAccessor` - Access to Google Scholar API secrets

### Resource Configuration
- **Memory**: 1GB
- **CPU**: 1 vCPU
- **Concurrency**: 1000 requests
- **Timeout**: 300 seconds
- **Min Instances**: 0 (scales to zero)
- **Max Instances**: 10

## Security Features

### Production Security
- ✅ Helmet.js security headers
- ✅ CORS configuration for production domains
- ✅ Rate limiting (10 req/min for Google Scholar API)
- ✅ Request validation and sanitization
- ✅ Non-root container user
- ✅ Google Secret Manager integration

### Network Security
- ✅ HTTPS-only communication
- ✅ Health checks with proper endpoints
- ✅ Graceful shutdown handling

## Monitoring & Observability

### Health Checks
- **Endpoint**: `/api/health`
- **Metrics**: `/api/metrics`
- **Liveness Probe**: 30s interval
- **Readiness Probe**: 10s interval

### Structured Logging
All logs are output in JSON format for easy parsing:
```json
{
  "level": "info",
  "timestamp": "2025-06-06T05:52:26.711Z",
  "message": "DHREM Research Server started",
  "port": 4001,
  "environment": "production"
}
```

## Post-Deployment

### 1. Verify Deployment
After deployment, test the following endpoints:

```bash
# Health check
curl https://dhrem-research-XXXXXX-uc.a.run.app/api/health

# Metrics
curl https://dhrem-research-XXXXXX-uc.a.run.app/api/metrics

# Application
open https://dhrem-research-XXXXXX-uc.a.run.app
```

### 2. Custom Domain (Optional)
To set up a custom domain:

```bash
# Map custom domain
gcloud run domain-mappings create \
  --service=dhrem-research \
  --domain=research.denverhealth.org \
  --region=us-central1
```

### 3. Monitoring Setup
Set up monitoring in Google Cloud Console:
- Create uptime checks for `/api/health`
- Set up alerting for errors and high latency
- Configure log-based metrics

## Troubleshooting

### Common Issues

#### 1. Secret Manager Access Denied
```bash
# Grant service account access to secrets
gcloud projects add-iam-policy-binding decoded-app-457000-s2 \
  --member="serviceAccount:dhrem-research@decoded-app-457000-s2.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

#### 2. Build Failures
```bash
# Clear Docker cache and rebuild
docker system prune -a
docker build --no-cache -t gcr.io/decoded-app-457000-s2/dhrem-research:latest .
```

#### 3. Service Won't Start
Check Cloud Run logs:
```bash
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=dhrem-research" \
  --limit=50 \
  --format="table(timestamp,textPayload)"
```

### Log Analysis
```bash
# View recent logs
gcloud logs read "resource.type=cloud_run_revision" \
  --filter="resource.labels.service_name=dhrem-research" \
  --limit=100

# Follow logs in real-time
gcloud logs tail "resource.type=cloud_run_revision" \
  --filter="resource.labels.service_name=dhrem-research"
```

## Performance Optimization

### Cold Start Optimization
- **Min instances**: Set to 1 for critical applications
- **CPU allocation**: Always allocated (cpu-throttling disabled)
- **Startup time**: ~3-5 seconds with current configuration

### Scaling Configuration
```bash
# Update scaling settings
gcloud run services update dhrem-research \
  --min-instances=1 \
  --max-instances=20 \
  --region=us-central1
```

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Deploy to Cloud Run
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - uses: google-github-actions/setup-gcloud@v0
      with:
        service_account_key: ${{ secrets.GCP_SA_KEY }}
        project_id: decoded-app-457000-s2
    - run: ./deploy.sh
```

## Cost Optimization

### Pricing Factors
- **CPU time**: Only charged when processing requests
- **Memory usage**: 1GB allocated
- **Network egress**: Minimal for API responses
- **Container Registry**: Storage costs for Docker images

### Cost Reduction Tips
1. Set appropriate min-instances (0 for dev, 1 for prod)
2. Use efficient Docker images (multi-stage builds)
3. Implement proper caching strategies
4. Monitor and optimize cold start times

## Support

For deployment issues or questions:
1. Check Cloud Run logs in Google Cloud Console
2. Review this documentation
3. Test locally using Docker
4. Contact the development team

## Security Checklist

- [ ] Google Secret Manager secrets are properly configured
- [ ] Service account has minimal required permissions
- [ ] CORS is configured for production domains only
- [ ] Rate limiting is enabled and properly configured
- [ ] Health checks are responding correctly
- [ ] Logs don't contain sensitive information
- [ ] Container runs as non-root user
- [ ] HTTPS is enforced (automatic with Cloud Run) 
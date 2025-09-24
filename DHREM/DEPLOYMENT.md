# DHREM Research Portal - Deployment Guide

## 🏥 Denver Health Research & Emergency Medicine Portal

This guide covers deploying the DHREM Research Portal to Google Cloud Run with cost-optimized settings.

## 📋 Prerequisites

1. **Google Cloud CLI** installed and configured
2. **Authentication** with `thevexusatlas@gmail.com`
3. **Project Access** to `decoded-app-457000-s2`
4. **Node.js 18+** for local building

## 🚀 Quick Deployment

### Option 1: Automated Deploy Script
```bash
# Make script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

### Option 2: Manual Deployment
```bash
# 1. Authenticate
gcloud auth login thevexusatlas@gmail.com
gcloud config set project decoded-app-457000-s2

# 2. Build React app
npm run build

# 3. Build and push Docker image
gcloud builds submit --tag gcr.io/decoded-app-457000-s2/dhrem-research

# 4. Deploy to Cloud Run
gcloud run deploy dhrem-research \
  --image gcr.io/decoded-app-457000-s2/dhrem-research \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --service-account=vexus-atlas-app@decoded-app-457000-s2.iam.gserviceaccount.com \
  --set-env-vars="NODE_ENV=production,GOOGLE_CLOUD_PROJECT_ID=decoded-app-457000-s2" \
  --memory=512Mi \
  --cpu=0.5 \
  --min-instances=0 \
  --max-instances=5 \
  --concurrency=80 \
  --timeout=300 \
  --port=4001
```

## 💰 Cost Optimization Settings

The deployment uses the **cheapest possible settings** for Google Cloud Run:

| Setting | Value | Cost Impact |
|---------|-------|-------------|
| Memory | 512Mi | 50% less than standard 1Gi |
| CPU | 0.5 | 50% less than standard 1.0 |
| Min Instances | 0 | No idle costs |
| Max Instances | 5 | Limited scaling |
| Concurrency | 80 | Efficient request handling |

**Estimated monthly cost**: $0-5 for typical research portal traffic

## 🔧 Configuration

### Environment Variables
- `NODE_ENV=production`
- `GOOGLE_CLOUD_PROJECT_ID=decoded-app-457000-s2`
- `PORT=4001` (set by Cloud Run)

### Service Account
Uses the existing `vexus-atlas-app@decoded-app-457000-s2.iam.gserviceaccount.com` service account for:
- Google Secret Manager access
- Google Scholar API credentials

## 📊 Monitoring & Health Checks

### Health Check Endpoints
- **Health**: `/api/health`
- **Metrics**: `/api/metrics`
- **Cache Stats**: `/api/cache/stats`

### API Endpoints
- **Scholar Search**: `/api/scholar/search?q=Denver+Health`
- **Faculty Research**: `/api/faculty/matthew-riscinti-md/research`
- **Combined Research**: `/api/research/all`

## 🗂️ Cache System

The portal includes a **monthly caching system** for Google Scholar API:
- **Cache Duration**: 30 days
- **Storage**: Local file system (`/cache` directory)
- **Benefits**: 95% reduction in API calls, faster responses

### Cache Management
- **View Stats**: `GET /api/cache/stats`
- **Cleanup**: `POST /api/cache/cleanup`
- **Clear All**: `DELETE /api/cache/clear`

## 🔄 Updates & Maintenance

### Faculty Data Updates
Faculty information is stored in `src/data/facultyData.ts`. To update:

1. Edit the faculty data file
2. Rebuild and redeploy: `./deploy.sh`

### Current Fellows (as of deployment)
- Phillipe Ayers, MD
- Jamie Popishell, MD

### Past Fellows
- Gabriel Siegel, MD (2023-2024)
- Peter Alsharif, MD (2023-2024)

## 🛠️ Troubleshooting

### Common Issues

1. **Authentication Error**
   ```bash
   gcloud auth login thevexusatlas@gmail.com
   ```

2. **Build Failures**
   - Check Node.js version (18+)
   - Clear cache: `npm cache clean --force`
   - Reinstall: `rm -rf node_modules && npm install`

3. **Deployment Timeout**
   - Increase timeout: `--timeout=600`
   - Check logs: `gcloud logs read --service=dhrem-research`

### Log Monitoring
```bash
# View recent logs
gcloud logs read --service=dhrem-research --limit=50

# Follow logs in real-time
gcloud logs tail --service=dhrem-research
```

## 📈 Performance

### Expected Performance
- **Cold Start**: ~2-3 seconds
- **Warm Response**: <100ms (cached)
- **API Response**: <500ms (fresh)
- **Cache Hit Rate**: >90% after initial requests

### Scaling
- **Auto-scaling**: 0-5 instances based on traffic
- **Concurrency**: 80 requests per instance
- **Memory**: 512Mi per instance

## 🔐 Security

- **HTTPS**: Enforced by Cloud Run
- **CORS**: Configured for production domains
- **Rate Limiting**: 100 requests/15min per IP
- **Helmet**: Security headers enabled
- **Non-root**: Container runs as non-root user

## 📞 Support

For deployment issues or questions:
- Check logs: `gcloud logs read --service=dhrem-research`
- Health check: Visit `/api/health` endpoint
- Contact: System administrator
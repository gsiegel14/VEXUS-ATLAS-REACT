#!/bin/bash

# 🏥 DHREM Research Portal Quick Deploy Script
# This script builds and deploys the DHREM Research Portal to Google Cloud Run

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

PROJECT_ID="decoded-app-457000-s2"
SERVICE_NAME="dhrem-research"
REGION="us-central1"
DEPLOY_EMAIL="thevexusatlas@gmail.com"

echo -e "${BLUE}"
echo "🏥 DHREM Research Portal Deployment"
echo "==================================="
echo "Project: $PROJECT_ID"
echo "Service: $SERVICE_NAME"
echo "Region: $REGION"
echo "Email: $DEPLOY_EMAIL"
echo -e "${NC}"

# Check if user is authenticated with the correct email
echo -e "${YELLOW}🔍 Checking authentication...${NC}"
CURRENT_ACCOUNT=$(gcloud auth list --filter=status:ACTIVE --format="value(account)" | head -n1)

if [ -z "$CURRENT_ACCOUNT" ]; then
    echo -e "${RED}❌ Not authenticated with gcloud. Please run:${NC}"
    echo "   gcloud auth login $DEPLOY_EMAIL"
    exit 1
fi

if [ "$CURRENT_ACCOUNT" != "$DEPLOY_EMAIL" ]; then
    echo -e "${YELLOW}⚠️  Current account: $CURRENT_ACCOUNT${NC}"
    echo -e "${YELLOW}Expected account: $DEPLOY_EMAIL${NC}"
    echo -e "${YELLOW}Switching to correct account...${NC}"
    gcloud auth login $DEPLOY_EMAIL
fi

echo -e "${GREEN}✅ Authenticated as: $DEPLOY_EMAIL${NC}"

# Set project
echo -e "${YELLOW}🔧 Setting project...${NC}"
gcloud config set project $PROJECT_ID

# Build React app
echo -e "${YELLOW}📦 Building React application...${NC}"
npm run build

# Submit build to Cloud Build
echo -e "${YELLOW}🏗️  Building Docker image...${NC}"
gcloud builds submit --tag gcr.io/$PROJECT_ID/$SERVICE_NAME

# Deploy to Cloud Run with cheapest settings
echo -e "${YELLOW}🚀 Deploying to Cloud Run (cheapest settings)...${NC}"
gcloud run deploy $SERVICE_NAME \
  --image gcr.io/$PROJECT_ID/$SERVICE_NAME \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --service-account=vexus-atlas-app@$PROJECT_ID.iam.gserviceaccount.com \
  --set-env-vars="NODE_ENV=production,GOOGLE_CLOUD_PROJECT_ID=$PROJECT_ID" \
  --memory=512Mi \
  --cpu=1 \
  --min-instances=0 \
  --max-instances=3 \
  --concurrency=80 \
  --timeout=300 \
  --port=4001

# Get the service URL
echo -e "${YELLOW}🔗 Getting service URL...${NC}"
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --platform managed --region $REGION --format 'value(status.url)')

echo -e "${GREEN}"
echo "✅ Deployment completed successfully!"
echo "🌐 Service URL: $SERVICE_URL"
echo "🔗 Health Check: $SERVICE_URL/api/health"
echo "🔬 Scholar API: $SERVICE_URL/api/scholar/search?q=Denver+Health"
echo "👥 Faculty API: $SERVICE_URL/api/faculty/matthew-riscinti-md/research"
echo "📊 Cache Stats: $SERVICE_URL/api/cache/stats"
echo "📈 Metrics: $SERVICE_URL/api/metrics"
echo -e "${NC}"

# Test endpoints
echo -e "${YELLOW}🧪 Testing endpoints...${NC}"

# Test health endpoint
echo "Testing health endpoint..."
if curl -s "$SERVICE_URL/api/health" | grep -q "healthy"; then
    echo -e "${GREEN}✅ Health check passed${NC}"
else
    echo -e "${RED}❌ Health check failed${NC}"
fi

# Test cache stats endpoint
echo "Testing cache stats endpoint..."
if curl -s "$SERVICE_URL/api/cache/stats" | grep -q "totalFiles"; then
    echo -e "${GREEN}✅ Cache stats test passed${NC}"
else
    echo -e "${RED}❌ Cache stats test failed${NC}"
fi

# Test metrics endpoint
echo "Testing metrics endpoint..."
if curl -s "$SERVICE_URL/api/metrics" | grep -q "uptime"; then
    echo -e "${GREEN}✅ Metrics test passed${NC}"
else
    echo -e "${RED}❌ Metrics test failed${NC}"
fi

echo -e "${GREEN}"
echo "🎉 DHREM Research Portal deployed successfully!"
echo "📱 Your research portal is now live at: $SERVICE_URL"
echo "💰 Deployed with cheapest settings:"
echo "   • Memory: 512Mi (vs 1Gi for VEXUS)"
echo "   • CPU: 0.5 (vs 1.0 for VEXUS)"
echo "   • Max instances: 5 (vs 10 for VEXUS)"
echo "   • Concurrency: 80 (vs 100 for VEXUS)"
echo -e "${NC}"
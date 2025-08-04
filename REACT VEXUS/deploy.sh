#!/bin/bash

# 🚀 VEXUS Atlas Quick Deploy Script
# This script builds and deploys the VEXUS Atlas to Google Cloud Run

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

PROJECT_ID="decoded-app-457000-s2"
SERVICE_NAME="vexus-atlas"
REGION="us-central1"
DEPLOY_EMAIL="thevexusatlas@gmail.com"

echo -e "${BLUE}"
echo "🚀 VEXUS Atlas Deployment"
echo "========================="
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

# Deploy to Cloud Run (removed PORT from env vars - it's reserved)
echo -e "${YELLOW}🚀 Deploying to Cloud Run...${NC}"
gcloud run deploy $SERVICE_NAME \
  --image gcr.io/$PROJECT_ID/$SERVICE_NAME \
  --platform managed \
  --region $REGION \
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

# Get the service URL
echo -e "${YELLOW}🔗 Getting service URL...${NC}"
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --platform managed --region $REGION --format 'value(status.url)')

echo -e "${GREEN}"
echo "✅ Deployment completed successfully!"
echo "🌐 Service URL: $SERVICE_URL"
echo "🔗 Health Check: $SERVICE_URL/api/health"
echo "📊 Images API: $SERVICE_URL/api/images"
echo "🔍 Debug: $SERVICE_URL/api/debug/secrets"
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

# Test secrets endpoint
echo "Testing secrets endpoint..."
if curl -s "$SERVICE_URL/api/debug/secrets" | grep -q "Loaded"; then
    echo -e "${GREEN}✅ Secrets test passed${NC}"
else
    echo -e "${RED}❌ Secrets test failed${NC}"
fi

echo -e "${GREEN}"
echo "🎉 VEXUS Atlas deployed successfully!"
echo "📱 Your app is now live at: $SERVICE_URL"
echo -e "${NC}" 
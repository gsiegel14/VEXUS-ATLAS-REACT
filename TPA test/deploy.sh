#!/bin/bash

# TPA POCUS Atlas Deployment Script
# This script deploys the TPA POCUS Atlas to Google Cloud Run

set -e

# Configuration
PROJECT_ID="decoded-app-457000-s2"
SERVICE_NAME="tpa-pocus-atlas"
REGION="us-central1"
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"

echo "🚀 Starting TPA POCUS Atlas deployment..."
echo "📋 Project ID: $PROJECT_ID"
echo "🏷️  Service Name: $SERVICE_NAME"
echo "🌍 Region: $REGION"

# Check if gcloud is installed and authenticated
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI is not installed. Please install it first."
    exit 1
fi

# Set the project
echo "🔧 Setting project to $PROJECT_ID..."
gcloud config set project $PROJECT_ID

# Enable required APIs
echo "🔌 Enabling required APIs..."
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

# Build and deploy using Cloud Build
echo "🏗️  Building and deploying with Cloud Build..."
gcloud builds submit --config cloudbuild.yaml .

echo "✅ Deployment completed!"
echo "🌐 Your TPA POCUS Atlas should be available at:"
echo "   https://$SERVICE_NAME-$(gcloud config get-value project | tr ':' '-' | tr '.' '-')-$REGION.run.app"

# Get the service URL
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region=$REGION --format="value(status.url)" 2>/dev/null || echo "")

if [ ! -z "$SERVICE_URL" ]; then
    echo "🔗 Direct URL: $SERVICE_URL"
    echo "🏥 Health Check: $SERVICE_URL/api/health"
    echo "🫀 POCUS API: $SERVICE_URL/api/pocus/images"
else
    echo "⚠️  Could not retrieve service URL. Check the Cloud Console for the deployed service."
fi

echo "📊 To view logs: gcloud run services logs read $SERVICE_NAME --region=$REGION"
echo "🔧 To update: Re-run this script" 
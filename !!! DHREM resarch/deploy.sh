#!/bin/bash

# DHREM Research Portal - Google Cloud Run Deployment Script
# Usage: ./deploy.sh [environment]
# Environment: dev, staging, production (default: production)

set -euo pipefail

# Configuration
PROJECT_ID="decoded-app-457000-s2"
SERVICE_NAME="dhrem-research"
REGION="us-central1"
ENVIRONMENT="${1:-production}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_dependencies() {
    log_info "Checking dependencies..."
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed or not in PATH"
        exit 1
    fi
    
    if ! command -v gcloud &> /dev/null; then
        log_error "Google Cloud CLI is not installed or not in PATH"
        exit 1
    fi
    
    log_success "All dependencies are available"
}

# Set up Google Cloud authentication and project
setup_gcloud() {
    log_info "Setting up Google Cloud configuration..."
    
    # Set project
    gcloud config set project $PROJECT_ID
    
    # Configure Docker for GCR
    gcloud auth configure-docker gcr.io --quiet
    
    # Enable required APIs
    log_info "Enabling required Google Cloud APIs..."
    gcloud services enable run.googleapis.com \
        containerregistry.googleapis.com \
        cloudbuild.googleapis.com \
        secretmanager.googleapis.com \
        --quiet
    
    log_success "Google Cloud setup complete"
}

# Create service account if it doesn't exist
setup_service_account() {
    log_info "Setting up service account..."
    
    SA_EMAIL="${SERVICE_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"
    
    # Check if service account exists
    if ! gcloud iam service-accounts describe $SA_EMAIL &> /dev/null; then
        log_info "Creating service account: $SA_EMAIL"
        gcloud iam service-accounts create $SERVICE_NAME \
            --display-name="DHREM Research Portal Service Account" \
            --description="Service account for DHREM Research Portal Cloud Run service"
    else
        log_info "Service account already exists: $SA_EMAIL"
    fi
    
    # Grant necessary permissions
    log_info "Granting permissions to service account..."
    gcloud projects add-iam-policy-binding $PROJECT_ID \
        --member="serviceAccount:$SA_EMAIL" \
        --role="roles/secretmanager.secretAccessor" \
        --quiet
    
    log_success "Service account setup complete"
}

# Build and push Docker image
build_and_push() {
    log_info "Building Docker image..."
    
    IMAGE_TAG="gcr.io/$PROJECT_ID/$SERVICE_NAME:latest"
    BUILD_TAG="gcr.io/$PROJECT_ID/$SERVICE_NAME:$(date +%Y%m%d-%H%M%S)"
    
    # Build image
    docker build -t $IMAGE_TAG -t $BUILD_TAG .
    
    log_info "Pushing image to Google Container Registry..."
    docker push $IMAGE_TAG
    docker push $BUILD_TAG
    
    log_success "Image built and pushed successfully"
    log_info "Image tags: $IMAGE_TAG, $BUILD_TAG"
}

# Deploy to Cloud Run
deploy_service() {
    log_info "Deploying to Cloud Run..."
    
    SA_EMAIL="${SERVICE_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"
    
    gcloud run deploy $SERVICE_NAME \
        --image="gcr.io/$PROJECT_ID/$SERVICE_NAME:latest" \
        --platform=managed \
        --region=$REGION \
        --allow-unauthenticated \
        --service-account=$SA_EMAIL \
        --memory=1Gi \
        --cpu=1 \
        --concurrency=1000 \
        --timeout=300s \
        --max-instances=10 \
        --min-instances=0 \
        --port=4001 \
        --set-env-vars="NODE_ENV=production,GOOGLE_CLOUD_PROJECT=$PROJECT_ID,GOOGLE_CLOUD_PROJECT_ID=$PROJECT_ID" \
        --execution-environment=gen2 \
        --cpu-throttling \
        --quiet
    
    log_success "Deployment complete!"
}

# Get service URL
get_service_url() {
    SERVICE_URL=$(gcloud run services describe $SERVICE_NAME \
        --region=$REGION \
        --format="value(status.url)")
    
    log_success "Service deployed successfully!"
    log_info "Service URL: $SERVICE_URL"
    log_info "Health check: $SERVICE_URL/api/health"
    log_info "Metrics: $SERVICE_URL/api/metrics"
}

# Test deployment
test_deployment() {
    log_info "Testing deployment..."
    
    SERVICE_URL=$(gcloud run services describe $SERVICE_NAME \
        --region=$REGION \
        --format="value(status.url)")
    
    # Wait a moment for service to be ready
    sleep 10
    
    # Test health endpoint
    if curl -f "$SERVICE_URL/api/health" > /dev/null 2>&1; then
        log_success "Health check passed!"
    else
        log_warning "Health check failed - service may still be starting up"
    fi
    
    # Test metrics endpoint
    if curl -f "$SERVICE_URL/api/metrics" > /dev/null 2>&1; then
        log_success "Metrics endpoint accessible!"
    else
        log_warning "Metrics endpoint not accessible"
    fi
}

# Main deployment function
main() {
    log_info "Starting DHREM Research Portal deployment to Google Cloud Run"
    log_info "Environment: $ENVIRONMENT"
    log_info "Project: $PROJECT_ID"
    log_info "Region: $REGION"
    
    check_dependencies
    setup_gcloud
    setup_service_account
    build_and_push
    deploy_service
    get_service_url
    test_deployment
    
    log_success "🚀 DHREM Research Portal deployed successfully to Google Cloud Run!"
    echo ""
    echo "Next steps:"
    echo "1. Configure your DNS to point to the Cloud Run URL if using a custom domain"
    echo "2. Set up monitoring and alerting in Google Cloud Console"
    echo "3. Configure backups for your Secret Manager secrets"
    echo "4. Set up CI/CD pipeline for automated deployments"
}

# Run main function
main "$@" 
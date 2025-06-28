#!/bin/bash

# 🌐 VEXUS Atlas Custom Domain Setup Script
# This script helps set up thevexusatlas.com for your VEXUS Atlas application

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
DOMAIN="thevexusatlas.com"
WWW_DOMAIN="www.thevexusatlas.com"

echo -e "${BLUE}"
echo "🌐 VEXUS Atlas Custom Domain Setup"
echo "=================================="
echo "Domain: $DOMAIN"
echo "WWW Domain: $WWW_DOMAIN"
echo "Service: $SERVICE_NAME"
echo "Region: $REGION"
echo -e "${NC}"

echo -e "${YELLOW}📋 STEP 1: Domain Verification Required${NC}"
echo "Before we can map your domain, you need to verify ownership."
echo ""
echo -e "${BLUE}Manual Steps Required:${NC}"
echo "1. Go to: https://console.cloud.google.com/run/domains"
echo "2. Click 'Add Mapping'"
echo "3. Enter domain: $DOMAIN"
echo "4. Follow the verification steps (add TXT record to your DNS)"
echo ""
echo -e "${YELLOW}Press Enter when domain verification is complete...${NC}"
read -p ""

echo -e "${YELLOW}🔧 STEP 2: Creating Domain Mappings${NC}"

# Try to create domain mapping for root domain
echo "Creating mapping for $DOMAIN..."
if gcloud beta run domain-mappings create \
  --service=$SERVICE_NAME \
  --domain=$DOMAIN \
  --region=$REGION; then
  echo -e "${GREEN}✅ Root domain mapping created successfully${NC}"
else
  echo -e "${RED}❌ Failed to create root domain mapping${NC}"
  echo "Please complete domain verification first"
fi

# Try to create domain mapping for www subdomain
echo "Creating mapping for $WWW_DOMAIN..."
if gcloud beta run domain-mappings create \
  --service=$SERVICE_NAME \
  --domain=$WWW_DOMAIN \
  --region=$REGION; then
  echo -e "${GREEN}✅ WWW domain mapping created successfully${NC}"
else
  echo -e "${RED}❌ Failed to create WWW domain mapping${NC}"
  echo "Please complete domain verification first"
fi

echo -e "${YELLOW}📋 STEP 3: DNS Configuration Required${NC}"
echo "You need to update your DNS records with your domain registrar:"
echo ""
echo -e "${BLUE}For Root Domain ($DOMAIN):${NC}"
echo "Type: A Record"
echo "Name: @ (or leave blank)"
echo "Values (add all 4):"
echo "  216.239.32.21"
echo "  216.239.34.21"
echo "  216.239.36.21"
echo "  216.239.38.21"
echo ""
echo -e "${BLUE}For WWW Subdomain ($WWW_DOMAIN):${NC}"
echo "Type: CNAME"
echo "Name: www"
echo "Value: ghs.googlehosted.com"
echo ""

echo -e "${YELLOW}🔍 STEP 4: Checking Current Mappings${NC}"
echo "Current domain mappings:"
gcloud beta run domain-mappings list --region=$REGION

echo -e "${YELLOW}⏱️  STEP 5: SSL Certificate${NC}"
echo "Google Cloud Run will automatically provision SSL certificates"
echo "for your verified domains. This may take a few minutes after"
echo "DNS propagation is complete."
echo ""

echo -e "${YELLOW}🧪 STEP 6: Testing (after DNS propagation)${NC}"
echo "Once DNS records are updated and propagated (can take up to 48 hours):"
echo "🌐 Test: https://$DOMAIN"
echo "🌐 Test: https://$WWW_DOMAIN"
echo "🔗 Health: https://$DOMAIN/api/health"
echo ""

echo -e "${GREEN}"
echo "🎉 Domain setup script completed!"
echo ""
echo "Next steps:"
echo "1. Complete domain verification in Google Cloud Console"
echo "2. Update DNS records with your registrar"
echo "3. Wait for DNS propagation (up to 48 hours)"
echo "4. Test your custom domain"
echo -e "${NC}"

# Optional: Create a Cloud DNS zone if user wants to manage DNS in Google Cloud
echo -e "${YELLOW}💡 Optional: Manage DNS in Google Cloud${NC}"
echo "Would you like to create a Cloud DNS zone to manage DNS in Google Cloud? (y/N)"
read -p "" create_dns_zone

if [[ $create_dns_zone =~ ^[Yy]$ ]]; then
  echo "Creating Cloud DNS zone..."
  
  if gcloud dns managed-zones create vexus-atlas-zone \
    --description="DNS zone for VEXUS Atlas" \
    --dns-name=$DOMAIN \
    --visibility=public; then
    
    echo -e "${GREEN}✅ DNS zone created${NC}"
    echo "Name servers for your domain registrar:"
    gcloud dns managed-zones describe vexus-atlas-zone --format="value(nameServers[])"
    
    echo ""
    echo "Update your domain registrar to use these name servers,"
    echo "then we can manage all DNS records in Google Cloud."
  else
    echo -e "${RED}❌ Failed to create DNS zone${NC}"
  fi
fi 
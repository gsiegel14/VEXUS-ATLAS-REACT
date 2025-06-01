#!/bin/bash

# 🚀 VEXUS Atlas Production Setup Script
# This script automates the setup of Google Secret Manager and Airtable integration
# Project: VEXUS Image Atlas
# Project ID: 314467722862

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "🚀 VEXUS Atlas Production Setup"
echo "============================="
echo "Project ID: 314467722862"
echo "Service Account: vexus-atlas-app@314467722862.iam.gserviceaccount.com"
echo -e "${NC}"

# Check prerequisites
echo -e "${YELLOW}📋 Checking prerequisites...${NC}"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ gcloud CLI is not installed. Please install it first:${NC}"
    echo "   https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if user is authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo -e "${RED}❌ Not authenticated with gcloud. Please run:${NC}"
    echo "   gcloud auth login"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites check passed${NC}"

# Set project
echo -e "${YELLOW}🔧 Setting up Google Cloud project...${NC}"
gcloud config set project 314467722862
echo -e "${GREEN}✅ Project set to 314467722862${NC}"

# Enable required APIs
echo -e "${YELLOW}📡 Enabling required Google Cloud APIs...${NC}"
apis=(
    "secretmanager.googleapis.com"
    "run.googleapis.com"
    "cloudbuild.googleapis.com"
    "logging.googleapis.com"
)

for api in "${apis[@]}"; do
    echo "  Enabling $api..."
    gcloud services enable $api --quiet
done

echo -e "${GREEN}✅ APIs enabled successfully${NC}"

# Function to create secret safely
create_secret() {
    local secret_name=$1
    local secret_value=$2
    
    if gcloud secrets describe $secret_name &>/dev/null; then
        echo -e "${YELLOW}⚠️  Secret $secret_name already exists. Skipping...${NC}"
    else
        echo -n "$secret_value" | gcloud secrets create $secret_name --data-file=-
        echo -e "${GREEN}✅ Created secret: $secret_name${NC}"
    fi
}

# Get Airtable configuration from user
echo -e "${YELLOW}🔐 Setting up secrets in Google Secret Manager...${NC}"

# Prompt for Airtable API Key
echo -e "${BLUE}Please provide your Airtable configuration:${NC}"
echo -e "${PURPLE}📝 You can get your API key from: https://airtable.com/create/tokens${NC}"
read -p "Enter your Airtable API Key (pat...): " AIRTABLE_API_KEY

if [[ -z "$AIRTABLE_API_KEY" ]]; then
    echo -e "${RED}❌ Airtable API Key is required${NC}"
    exit 1
fi

# Validate API key format
if [[ ! "$AIRTABLE_API_KEY" =~ ^pat ]]; then
    echo -e "${YELLOW}⚠️  Warning: API key should start with 'pat'. Please verify this is correct.${NC}"
    read -p "Continue anyway? (y/N): " confirm
    if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Create secrets
echo -e "${YELLOW}Creating secrets...${NC}"

create_secret "AIRTABLE_API_KEY" "$AIRTABLE_API_KEY"
create_secret "AIRTABLE_BASE_ID" "appczwD3YpTYS6UeJ"
create_secret "AIRTABLE_TABLE_ID" "tblL1RXcNlcLW5nen"
create_secret "AIRTABLE_TABLE_NAME" "Table 1"

# Verify secrets
echo -e "${YELLOW}🔍 Verifying secrets...${NC}"
secret_count=$(gcloud secrets list --filter="name:AIRTABLE" --format="value(name)" | wc -l)
if [ "$secret_count" -eq 4 ]; then
    echo -e "${GREEN}✅ All 4 Airtable secrets created successfully${NC}"
else
    echo -e "${RED}❌ Expected 4 secrets, found $secret_count${NC}"
    exit 1
fi

# Create service account
echo -e "${YELLOW}👤 Creating service account...${NC}"

if gcloud iam service-accounts describe vexus-atlas-app@314467722862.iam.gserviceaccount.com &>/dev/null; then
    echo -e "${YELLOW}⚠️  Service account already exists. Skipping creation...${NC}"
else
    gcloud iam service-accounts create vexus-atlas-app \
        --description="VEXUS Atlas Application Service Account" \
        --display-name="VEXUS Atlas App"
    echo -e "${GREEN}✅ Service account created${NC}"
fi

# Grant necessary permissions
echo -e "${YELLOW}🔑 Granting permissions...${NC}"

roles=(
    "roles/secretmanager.secretAccessor"
    "roles/secretmanager.viewer"
)

for role in "${roles[@]}"; do
    echo "  Granting $role..."
    gcloud projects add-iam-policy-binding 314467722862 \
        --member="serviceAccount:vexus-atlas-app@314467722862.iam.gserviceaccount.com" \
        --role="$role" \
        --quiet
done

echo -e "${GREEN}✅ Permissions granted${NC}"

# Create service account key for local development
echo -e "${YELLOW}🗝️  Creating service account key for local development...${NC}"

key_file="./google-credentials-production.json"
if [ -f "$key_file" ]; then
    echo -e "${YELLOW}⚠️  Service account key already exists. Skipping...${NC}"
else
    gcloud iam service-accounts keys create $key_file \
        --iam-account=vexus-atlas-app@314467722862.iam.gserviceaccount.com
    echo -e "${GREEN}✅ Service account key saved to $key_file${NC}"
fi

# Test Airtable connection
echo -e "${YELLOW}🧪 Testing Airtable connection...${NC}"

test_result=$(curl -s -w "%{http_code}" -o /dev/null \
    -H "Authorization: Bearer $AIRTABLE_API_KEY" \
    "https://api.airtable.com/v0/appczwD3YpTYS6UeJ/Table%201?maxRecords=1")

if [ "$test_result" = "200" ]; then
    echo -e "${GREEN}✅ Airtable connection test passed${NC}"
else
    echo -e "${RED}❌ Airtable connection test failed (HTTP $test_result)${NC}"
    echo -e "${YELLOW}Please verify your API key and base configuration${NC}"
fi

# Create environment file for local development
echo -e "${YELLOW}📄 Creating local environment configuration...${NC}"

cat > .env.local << EOF
# Google Cloud Configuration
GOOGLE_CLOUD_PROJECT_ID=314467722862
GOOGLE_APPLICATION_CREDENTIALS=./google-credentials-production.json

# Application Configuration
NODE_ENV=development
VITE_API_BASE_URL=http://localhost:5437

# Airtable Configuration (for reference - actual values come from Secret Manager)
# AIRTABLE_BASE_ID=appczwD3YpTYS6UeJ
# AIRTABLE_TABLE_ID=tblL1RXcNlcLW5nen
# AIRTABLE_TABLE_NAME=Table 1
EOF

echo -e "${GREEN}✅ Environment file created (.env.local)${NC}"

# Update .gitignore
echo -e "${YELLOW}🔒 Updating .gitignore for security...${NC}"

gitignore_entries="
# Google Cloud credentials
google-credentials-*.json
.gcp/
.env.local
.env.production

# Airtable
airtable-config.json
"

if ! grep -q "google-credentials-" .gitignore 2>/dev/null; then
    echo "$gitignore_entries" >> .gitignore
    echo -e "${GREEN}✅ .gitignore updated${NC}"
else
    echo -e "${YELLOW}⚠️  .gitignore already contains security entries${NC}"
fi

# Final verification
echo -e "${YELLOW}🔍 Final verification...${NC}"

# Check secrets accessibility
if gcloud secrets versions access latest --secret="AIRTABLE_API_KEY" &>/dev/null; then
    echo -e "${GREEN}✅ Secret Manager access verified${NC}"
else
    echo -e "${RED}❌ Unable to access secrets${NC}"
    exit 1
fi

# Check service account
if gcloud iam service-accounts describe vexus-atlas-app@314467722862.iam.gserviceaccount.com &>/dev/null; then
    echo -e "${GREEN}✅ Service account verified${NC}"
else
    echo -e "${RED}❌ Service account not found${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 Production setup completed successfully!${NC}"
echo ""
echo -e "${BLUE}📋 Next steps:${NC}"
echo "1. Install dependencies: npm install"
echo "2. Build the application: npm run build"
echo "3. Test locally: npm run dev"
echo "4. Deploy to production using the deployment guide"
echo ""
echo -e "${YELLOW}⚠️  Important Security Notes:${NC}"
echo "• Keep google-credentials-production.json secure and never commit it"
echo "• The .env.local file contains sensitive configuration"
echo "• Regularly rotate your API keys and service account keys"
echo ""
echo -e "${PURPLE}📚 Documentation:${NC}"
echo "• Full setup guide: PRODUCTION_SETUP.md"
echo "• Troubleshooting: See documentation for common issues"
echo ""
echo -e "${GREEN}✅ Setup completed successfully!${NC}" 
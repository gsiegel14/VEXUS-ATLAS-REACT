# 🚀 VEXUS Image Atlas - Production Setup Guide

## Overview
This guide provides complete instructions for setting up the VEXUS Image Atlas with production-ready Google Secret Manager authentication and Airtable integration.

## 🔧 Prerequisites

### Required Accounts & Tools
- **Google Cloud Platform Account** with billing enabled
- **Airtable Account** with API access
- **Node.js 18+** and **npm/yarn**
- **gcloud CLI** installed and configured

### Your Project Details
```bash
# GCP Configuration
PROJECT_ID: 314467722862
PROJECT_NAME: vexus-project
SERVICE_ACCOUNT: vexus-api@314467722862.iam.gserviceaccount.com

# Airtable Configuration  
BASE_ID: appczwD3YpTYS6UeJ
TABLE_ID: tblL1RXcNlcLW5nen
TABLE_NAME: "Table 1"
```

## 📋 Step 1: Google Cloud Platform Setup

### 1.1 Install and Configure gcloud CLI
```bash
# Install gcloud CLI (if not already installed)
# Visit: https://cloud.google.com/sdk/docs/install

# Authenticate with your Google account
gcloud auth login

# Set your project
gcloud config set project 314467722862

# Verify configuration
gcloud config list
```

### 1.2 Enable Required APIs
```bash
# Enable Secret Manager API
gcloud services enable secretmanager.googleapis.com

# Enable Cloud Run API (for deployment)
gcloud services enable run.googleapis.com

# Enable Cloud Build API (for CI/CD)
gcloud services enable cloudbuild.googleapis.com

# Verify enabled services
gcloud services list --enabled
```

## 🔐 Step 2: Create Secrets in Google Secret Manager

### 2.1 Create Airtable API Key Secret
```bash
# Replace 'your-actual-airtable-api-key' with your real API key from:
# https://airtable.com/create/tokens
echo -n "your-actual-airtable-api-key" | gcloud secrets create AIRTABLE_API_KEY --data-file=-

# Verify creation
gcloud secrets describe AIRTABLE_API_KEY
```

### 2.2 Create Airtable Configuration Secrets
```bash
# Airtable Base ID
echo -n "appczwD3YpTYS6UeJ" | gcloud secrets create AIRTABLE_BASE_ID --data-file=-

# Airtable Table ID
echo -n "tblL1RXcNlcLW5nen" | gcloud secrets create AIRTABLE_TABLE_ID --data-file=-

# Airtable Table Name
echo -n "Table 1" | gcloud secrets create AIRTABLE_TABLE_NAME --data-file=-

# Verify all secrets
gcloud secrets list
```

## 👤 Step 3: Service Account Configuration

### 3.1 Create Application Service Account
```bash
# Create service account for the application
gcloud iam service-accounts create vexus-atlas-app \
    --description="VEXUS Atlas Application Service Account" \
    --display-name="VEXUS Atlas App"

# Verify creation
gcloud iam service-accounts list
```

### 3.2 Grant Required Permissions
```bash
# Grant Secret Manager access
gcloud projects add-iam-policy-binding 314467722862 \
    --member="serviceAccount:vexus-atlas-app@314467722862.iam.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor"

gcloud projects add-iam-policy-binding 314467722862 \
    --member="serviceAccount:vexus-atlas-app@314467722862.iam.gserviceaccount.com" \
    --role="roles/secretmanager.viewer"

# Verify permissions
gcloud projects get-iam-policy 314467722862 \
    --flatten="bindings[].members" \
    --format="table(bindings.role)" \
    --filter="bindings.members:vexus-atlas-app@314467722862.iam.gserviceaccount.com"
```

### 3.3 Create Service Account Key (for local development)
```bash
# Create and download service account key
gcloud iam service-accounts keys create ./google-credentials-production.json \
    --iam-account=vexus-atlas-app@314467722862.iam.gserviceaccount.com

# Set environment variable for local development
export GOOGLE_APPLICATION_CREDENTIALS="$(pwd)/google-credentials-production.json"

# Add to your shell profile (.bashrc, .zshrc, etc.)
echo 'export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/google-credentials-production.json"' >> ~/.zshrc
```

## 🔍 Step 4: Verify Setup

### 4.1 Test Secret Manager Access
```bash
# Test reading a secret
gcloud secrets versions access latest --secret="AIRTABLE_API_KEY"

# List all secrets (should show 4 secrets)
gcloud secrets list
```

### 4.2 Test Service Account
```bash
# Impersonate service account and test access
gcloud auth activate-service-account vexus-atlas-app@314467722862.iam.gserviceaccount.com \
    --key-file=./google-credentials-production.json

# Test secret access with service account
gcloud secrets versions access latest --secret="AIRTABLE_BASE_ID"

# Switch back to your user account
gcloud auth login
```

## 📦 Step 5: Application Dependencies

### 5.1 Install Required Packages
```bash
# Navigate to project directory
cd "REACT VEXUS"

# Install production dependencies
npm install @google-cloud/secret-manager@^5.0.2
npm install airtable@^0.12.2
npm install axios@^1.6.0
npm install date-fns@^2.30.0
npm install react-intersection-observer@^9.5.3
npm install react-virtualized-auto-sizer@^1.0.24
npm install react-window@^1.8.8

# Install development dependencies
npm install @types/react-window@^1.8.8 --save-dev

# Verify installation
npm list --depth=0
```

### 5.2 Environment Configuration

#### For Local Development (.env.local)
```bash
# Create .env.local file (for local development only)
cat > .env.local << EOF
# Google Cloud Configuration
GOOGLE_CLOUD_PROJECT_ID=314467722862
GOOGLE_APPLICATION_CREDENTIALS=./google-credentials-production.json

# Application Configuration
NODE_ENV=development
VITE_API_BASE_URL=http://localhost:5437
EOF
```

#### For Production (Environment Variables)
```bash
# Production environment variables (set in your deployment platform)
GOOGLE_CLOUD_PROJECT_ID=314467722862
NODE_ENV=production
VITE_API_BASE_URL=https://your-production-domain.com
```

## 🚀 Step 6: Build and Deploy

### 6.1 Build Application
```bash
# Build for production
npm run build

# Test build locally
npm run preview
```

### 6.2 Deploy to Google Cloud Run
```bash
# Create Dockerfile
cat > Dockerfile << EOF
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 8080
CMD ["npx", "serve", "-s", "dist", "-l", "8080"]
EOF

# Build and deploy
gcloud run deploy vexus-atlas \
    --source . \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated \
    --service-account=vexus-atlas-app@314467722862.iam.gserviceaccount.com \
    --set-env-vars="GOOGLE_CLOUD_PROJECT_ID=314467722862"
```

## 🧪 Step 7: Testing & Validation

### 7.1 Airtable Configuration Test
```javascript
// Test file: test-airtable-connection.js
const { airtableService } = require('./src/services/airtableService');

async function testConnection() {
  try {
    console.log('Testing Airtable connection...');
    
    // Initialize service
    await airtableService.initialize();
    console.log('✅ Service initialized');
    
    // Health check
    const isHealthy = await airtableService.healthCheck();
    console.log('✅ Health check:', isHealthy ? 'PASSED' : 'FAILED');
    
    // Fetch images
    const images = await airtableService.fetchImages();
    console.log('✅ Fetched', images.length, 'images');
    
    console.log('🎉 All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testConnection();
```

### 7.2 Secret Manager Test
```bash
# Test secret retrieval
node -e "
const { secretManagerService } = require('./src/services/secretManagerService');
secretManagerService.getAirtableConfig().then(config => {
  console.log('✅ Secrets retrieved successfully');
  console.log('Base ID:', config.baseId);
  console.log('Table Name:', config.tableName);
}).catch(err => {
  console.error('❌ Failed to retrieve secrets:', err.message);
});
"
```

## 🔒 Security Best Practices

### 7.1 Secret Management
- ✅ **Never commit** `google-credentials-production.json` to version control
- ✅ **Use environment variables** for sensitive configuration
- ✅ **Rotate API keys** regularly
- ✅ **Use least privilege** principle for IAM roles

### 7.2 Access Control
```bash
# Add .gitignore entries
cat >> .gitignore << EOF

# Google Cloud credentials
google-credentials-*.json
.gcp/
.env.local
.env.production

# Airtable
airtable-config.json
EOF
```

## 🔧 Troubleshooting

### Common Issues & Solutions

#### 1. "Permission denied" when accessing secrets
```bash
# Check service account permissions
gcloud projects get-iam-policy 314467722862 \
    --flatten="bindings[].members" \
    --filter="bindings.members:vexus-atlas-app@314467722862.iam.gserviceaccount.com"

# Re-grant permissions if needed
gcloud projects add-iam-policy-binding 314467722862 \
    --member="serviceAccount:vexus-atlas-app@314467722862.iam.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor"
```

#### 2. "Secret not found" error
```bash
# List all secrets
gcloud secrets list

# Check secret content
gcloud secrets versions access latest --secret="AIRTABLE_API_KEY"
```

#### 3. Airtable API authentication failure
```bash
# Verify API key format (should start with 'pat')
echo "API Key format: $(gcloud secrets versions access latest --secret='AIRTABLE_API_KEY' | cut -c1-10)..."

# Test API key manually
curl -H "Authorization: Bearer $(gcloud secrets versions access latest --secret='AIRTABLE_API_KEY')" \
     "https://api.airtable.com/v0/$(gcloud secrets versions access latest --secret='AIRTABLE_BASE_ID')/$(gcloud secrets versions access latest --secret='AIRTABLE_TABLE_NAME')" \
     | jq '.records | length'
```

#### 4. Local development connection issues
```bash
# Check environment variables
echo "Project ID: $GOOGLE_CLOUD_PROJECT_ID"
echo "Credentials: $GOOGLE_APPLICATION_CREDENTIALS"

# Test gcloud authentication
gcloud auth application-default print-access-token
```

## 📊 Monitoring & Logging

### 7.1 Enable Cloud Logging
```bash
# Enable logging API
gcloud services enable logging.googleapis.com

# View application logs
gcloud logging read "resource.type=cloud_run_revision" --limit=50
```

### 7.2 Set up Health Checks
```javascript
// Add to your application
app.get('/health', async (req, res) => {
  try {
    const secretManagerHealthy = await secretManagerService.healthCheck();
    const airtableHealthy = await airtableService.healthCheck();
    
    if (secretManagerHealthy && airtableHealthy) {
      res.status(200).json({ status: 'healthy', services: { secretManager: true, airtable: true } });
    } else {
      res.status(503).json({ status: 'unhealthy', services: { secretManager: secretManagerHealthy, airtable: airtableHealthy } });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});
```

## 🎯 Production Checklist

Before deploying to production, ensure:

- [ ] ✅ All secrets created in Google Secret Manager
- [ ] ✅ Service account configured with proper permissions
- [ ] ✅ Airtable API key is valid and has correct permissions
- [ ] ✅ Application builds successfully
- [ ] ✅ Health checks pass for all services
- [ ] ✅ Environment variables set correctly
- [ ] ✅ Security credentials not committed to repo
- [ ] ✅ Error handling implemented for all API calls
- [ ] ✅ Logging configured for production monitoring
- [ ] ✅ Performance testing completed
- [ ] ✅ Backup and recovery procedures documented

## 📞 Support & Resources

### Documentation Links
- [Google Secret Manager Documentation](https://cloud.google.com/secret-manager/docs)
- [Airtable API Documentation](https://airtable.com/developers/web/api/introduction)
- [Google Cloud IAM Best Practices](https://cloud.google.com/iam/docs/using-iam-securely)

### Emergency Contacts
- **GCP Support**: Available through Google Cloud Console
- **Airtable Support**: support@airtable.com
- **Development Team**: [Your team contact information]

---

## 🔄 Updates & Maintenance

### Regular Maintenance Tasks
1. **Monthly**: Rotate API keys and service account keys
2. **Quarterly**: Review and audit IAM permissions
3. **Annually**: Update dependencies and security patches

### Backup Procedures
1. **Export Airtable data** regularly
2. **Backup Secret Manager configurations**
3. **Document all custom configurations**

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Environment**: Production Ready 
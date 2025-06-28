# 🌐 VEXUS Atlas Custom Domain Setup Guide

## Overview
This guide will help you deploy your VEXUS Atlas application to your custom domain `thevexusatlas.com`.

## Quick Start
```bash
./setup-custom-domain.sh
```

## Manual Setup Steps

### Step 1: Domain Verification
1. Go to [Google Cloud Console - Cloud Run Domains](https://console.cloud.google.com/run/domains)
2. Click **"Add Mapping"**
3. Enter your domain: `thevexusatlas.com`
4. Follow the verification steps (you'll need to add a TXT record to your DNS)

### Step 2: DNS Configuration
Update your DNS records with your domain registrar:

#### For Root Domain (`thevexusatlas.com`)
- **Type**: A Record
- **Name**: `@` (or leave blank)
- **Values** (add all 4):
  - `216.239.32.21`
  - `216.239.34.21`
  - `216.239.36.21`
  - `216.239.38.21`

#### For WWW Subdomain (`www.thevexusatlas.com`)
- **Type**: CNAME
- **Name**: `www`
- **Value**: `ghs.googlehosted.com`

### Step 3: Create Domain Mappings
After verification, create the mappings:

```bash
# Root domain
gcloud beta run domain-mappings create \
  --service=vexus-atlas \
  --domain=thevexusatlas.com \
  --region=us-central1

# WWW subdomain
gcloud beta run domain-mappings create \
  --service=vexus-atlas \
  --domain=www.thevexusatlas.com \
  --region=us-central1
```

### Step 4: SSL Certificate
Google Cloud Run will automatically provision SSL certificates for your verified domains. This process:
- Starts after domain mapping is created
- Takes a few minutes after DNS propagation
- Provides automatic renewal

### Step 5: Testing
Once DNS propagation is complete (can take up to 48 hours):

- **Main Site**: https://thevexusatlas.com
- **WWW Site**: https://www.thevexusatlas.com
- **Health Check**: https://thevexusatlas.com/api/health
- **Images API**: https://thevexusatlas.com/api/images

## Alternative: Google Cloud DNS Management

If you want to manage DNS entirely in Google Cloud:

1. **Create DNS Zone**:
```bash
gcloud dns managed-zones create vexus-atlas-zone \
  --description="DNS zone for VEXUS Atlas" \
  --dns-name=thevexusatlas.com \
  --visibility=public
```

2. **Get Name Servers**:
```bash
gcloud dns managed-zones describe vexus-atlas-zone \
  --format="value(nameServers[])"
```

3. **Update Domain Registrar**: Use the provided name servers in your domain registrar settings

4. **Add DNS Records**:
```bash
# A records for root domain
gcloud dns record-sets transaction start --zone=vexus-atlas-zone

gcloud dns record-sets transaction add \
  216.239.32.21 216.239.34.21 216.239.36.21 216.239.38.21 \
  --name=thevexusatlas.com. \
  --ttl=300 \
  --type=A \
  --zone=vexus-atlas-zone

# CNAME for www
gcloud dns record-sets transaction add \
  ghs.googlehosted.com. \
  --name=www.thevexusatlas.com. \
  --ttl=300 \
  --type=CNAME \
  --zone=vexus-atlas-zone

gcloud dns record-sets transaction execute --zone=vexus-atlas-zone
```

## Troubleshooting

### Domain Verification Issues
- Ensure TXT record is added correctly to your DNS
- Wait for DNS propagation (up to 24 hours)
- Check verification status in Google Cloud Console

### DNS Propagation
- Use tools like `dig` or online DNS checkers
- Propagation can take 24-48 hours globally
- Test from different locations/networks

### SSL Certificate Issues
- Certificates are provisioned automatically after domain mapping
- May take 15-60 minutes after DNS propagation
- Check certificate status in Cloud Run console

## Current Deployment Status

Your VEXUS Atlas is currently deployed at:
- **Cloud Run URL**: https://vexus-atlas-rufmnmj7bq-uc.a.run.app
- **Project**: decoded-app-457000-s2
- **Service**: vexus-atlas
- **Region**: us-central1

## Support Commands

```bash
# Check domain mappings
gcloud beta run domain-mappings list --region=us-central1

# Check service status
gcloud run services describe vexus-atlas --region=us-central1

# View logs
gcloud logs read --service=vexus-atlas --region=us-central1

# Test endpoints
curl https://thevexusatlas.com/api/health
```

## Timeline Expectations

1. **Domain Verification**: 5-30 minutes (manual step)
2. **Domain Mapping Creation**: 1-2 minutes
3. **DNS Propagation**: 1-48 hours
4. **SSL Certificate**: 15-60 minutes after DNS propagation
5. **Total Time**: 2-48 hours depending on DNS propagation

Your VEXUS Atlas application will be fully accessible at `thevexusatlas.com` once all steps are complete! 
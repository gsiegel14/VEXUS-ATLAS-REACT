#!/bin/bash

# DHREM Research Server Launch Script
# This script properly starts the DHREM research server with all necessary configurations

echo "🔬 Starting DHREM Research Server..."

# Kill any existing processes on port 4001
echo "🔄 Cleaning up existing processes..."
lsof -ti :4001 | xargs kill -9 2>/dev/null || true
sleep 2

# Set up environment variables
export NODE_ENV=development
export GOOGLE_CLOUD_PROJECT=decoded-app-457000-s2

# Get the Google Scholar API key from Secret Manager
echo "🔑 Fetching Google Scholar API key from Secret Manager..."
export SERPAPI_KEY=$(gcloud secrets versions access latest --secret="googlescholarapi" --project="decoded-app-457000-s2" 2>/dev/null || echo "")

if [ -z "$SERPAPI_KEY" ]; then
    echo "⚠️  Warning: Could not fetch Google Scholar API key from Secret Manager"
    echo "   The server will start but research endpoints may return 503 errors"
else
    echo "✅ Google Scholar API key loaded successfully"
fi

# Start the server
echo "🚀 Launching DHREM Research Server on http://localhost:4001"
echo "📊 Health check: http://localhost:4001/api/health"
echo "🔍 Research API: http://localhost:4001/api/research/all"
echo ""
echo "Press Ctrl+C to stop the server"
echo "----------------------------------------"

node researchserver.js

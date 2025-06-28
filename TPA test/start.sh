#!/bin/bash

# POCUS Atlas Startup Script
echo "🚀 Starting The POCUS Atlas (TPA)..."
echo "======================================="

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if dist directory exists
if [ ! -d "dist" ]; then
    echo "🔨 Building frontend..."
    npm run build
fi

echo "🌐 Starting POCUS Atlas server on port 5555..."
echo "📱 Access the application at: http://localhost:5555"
echo "🔍 Health check: http://localhost:5555/api/health"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the server
npm run backend 
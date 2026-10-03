#!/bin/bash

# DHREM Development Environment Launcher
# This script starts both the research backend server and the frontend dev server

echo "🚀 Starting DHREM Development Environment"
echo "========================================"

# Kill any existing processes
echo "🔄 Cleaning up existing processes..."
pkill -f "researchserver.js" 2>/dev/null || true
pkill -f "vite.*5173" 2>/dev/null || true
sleep 2

# Set up environment variables
export NODE_ENV=development
export GOOGLE_CLOUD_PROJECT=decoded-app-457000-s2

# Get the Google Scholar API key from Secret Manager
echo "🔑 Fetching Google Scholar API key..."
export SERPAPI_KEY=$(gcloud secrets versions access latest --secret="googlescholarapi" --project="decoded-app-457000-s2" 2>/dev/null || echo "")

if [ -z "$SERPAPI_KEY" ]; then
    echo "⚠️  Warning: Could not fetch Google Scholar API key"
else
    echo "✅ Google Scholar API key loaded"
fi

# Start the backend server in the background
echo "🔬 Starting DHREM Research Server (port 4001)..."
node researchserver.js &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Check if backend is running
if curl -s http://localhost:4001/api/health > /dev/null 2>&1; then
    echo "✅ Backend server started successfully"
else
    echo "❌ Backend server failed to start"
    kill $BACKEND_PID 2>/dev/null || true
    exit 1
fi

# Start the frontend dev server
echo "🎨 Starting Frontend Dev Server (port 5173)..."
npm run dev &
FRONTEND_PID=$!

# Wait a moment for frontend to start
sleep 3

echo ""
echo "🎉 Development environment started!"
echo "📊 Backend API: http://localhost:4001/api/health"
echo "🌐 Frontend: http://localhost:5173"
echo "🔍 Research API: http://localhost:4001/api/research/all"
echo ""
echo "Press Ctrl+C to stop both servers"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down servers..."
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    pkill -f "researchserver.js" 2>/dev/null || true
    pkill -f "vite.*5173" 2>/dev/null || true
    echo "✅ Cleanup complete"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Wait for user to stop
wait

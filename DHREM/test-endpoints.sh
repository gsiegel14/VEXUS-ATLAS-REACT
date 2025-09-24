#!/bin/bash

# DHREM Research Server Endpoint Testing Script
# This script tests all the research server endpoints to verify functionality

echo "🧪 Testing DHREM Research Server Endpoints"
echo "=========================================="

BASE_URL="http://localhost:4001"

# Function to test an endpoint
test_endpoint() {
    local url="$1"
    local description="$2"
    local expected_status="${3:-200}"
    
    echo ""
    echo "🔍 Testing: $description"
    echo "   URL: $url"
    
    response=$(curl -s -w "\n%{http_code}" "$url" 2>/dev/null)
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" = "$expected_status" ]; then
        echo "   ✅ Status: $http_code (Expected: $expected_status)"
        if [ ${#body} -gt 200 ]; then
            echo "   📄 Response: ${body:0:200}..."
        else
            echo "   📄 Response: $body"
        fi
    else
        echo "   ❌ Status: $http_code (Expected: $expected_status)"
        echo "   📄 Response: $body"
    fi
}

# Wait for server to be ready
echo "⏳ Waiting for server to be ready..."
for i in {1..10}; do
    if curl -s "$BASE_URL/api/health" > /dev/null 2>&1; then
        echo "✅ Server is ready!"
        break
    fi
    echo "   Attempt $i/10..."
    sleep 2
done

# Test endpoints
test_endpoint "$BASE_URL/api/health" "Health Check"
test_endpoint "$BASE_URL/api/debug/secrets" "Secrets Debug"
test_endpoint "$BASE_URL/api/research/all?q=ultrasound&start=0&num=5" "Research Search (Basic)"
test_endpoint "$BASE_URL/api/research/all?q=emergency%20ultrasound&start=0&num=3" "Research Search (Emergency Ultrasound)"
test_endpoint "$BASE_URL/api/research/metrics?q=emergency%20ultrasound&maxPages=2&num=10" "Research Metrics"
test_endpoint "$BASE_URL/api/research/authors" "Authors List"

echo ""
echo "🏁 Testing Complete!"
echo ""
echo "💡 Useful URLs for manual testing:"
echo "   Health: $BASE_URL/api/health"
echo "   Debug:  $BASE_URL/api/debug/secrets"
echo "   Search: $BASE_URL/api/research/all?q=ultrasound&start=0&num=5"
echo "   Frontend: http://localhost:5173 (when running npm run dev)"
echo ""

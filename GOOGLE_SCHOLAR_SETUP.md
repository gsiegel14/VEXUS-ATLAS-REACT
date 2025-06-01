# Google Scholar API Setup Guide

This guide will help you set up secure authentication for the Google Scholar API using your existing Google Cloud Secret Manager infrastructure.

## Step 1: Get a SerpAPI Key

1. Visit [SerpAPI](https://serpapi.com/)
2. Sign up for a free account (100 free searches per month)
3. Go to your dashboard and copy your API key
4. Keep this key secure - you'll add it to Google Secret Manager

## Step 2: Add the SerpAPI Key to Google Secret Manager

Using the Google Cloud Console:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **Security > Secret Manager**
3. Make sure you're in the correct project: `decoded-app-457000-s2`
4. Click **"CREATE SECRET"**
5. Fill in the details:
   - **Name**: `SERPAPI_KEY`
   - **Secret value**: Paste your SerpAPI key here
   - **Regions**: Leave default or select your preferred region
6. Click **"CREATE SECRET"**

Alternatively, using the gcloud CLI:
```bash
# Replace YOUR_SERPAPI_KEY_HERE with your actual key
echo "YOUR_SERPAPI_KEY_HERE" | gcloud secrets create SERPAPI_KEY --data-file=-
```

## Step 3: Verify the Setup

1. Start your backend server:
   ```bash
   npm run backend
   ```

2. Test the Google Scholar endpoint:
   ```bash
   curl "http://localhost:3001/api/scholar/search?q=VEXUS"
   ```

3. Check the server logs for successful secret retrieval:
   ```
   ✅ Secrets loaded successfully
   🔍 Fetching Google Scholar results for: VEXUS
   📊 Found X results for "VEXUS"
   ```

## Step 4: Start Both Services

1. **Backend server** (Terminal 1):
   ```bash
   npm run backend
   ```

2. **React frontend** (Terminal 2):
   ```bash
   cd "REACT VEXUS"
   npm run dev
   ```

3. Open your browser to the React app URL (usually `http://localhost:5439`)
4. Navigate to the Literature page
5. Scroll down to see the "Live Google Scholar Results" section

## API Endpoints

Your server now provides these Google Scholar endpoints:

- **Search**: `GET /api/scholar/search?q=SEARCH_TERM&start=0&num=10`
  - `q`: Search query (required)
  - `start`: Result offset for pagination (optional, default: 0)
  - `num`: Number of results per page (optional, default: 10, max: 20)

## Security Features

✅ **API Key Protection**: Your SerpAPI key is stored securely in Google Secret Manager  
✅ **No Browser Exposure**: The API key never reaches the client-side code  
✅ **CORS Protection**: Only your React frontend can access the API  
✅ **Rate Limiting**: Controlled through your backend server  
✅ **Error Handling**: Graceful error responses with detailed logging  

## Troubleshooting

### "Failed to fetch secrets" Error
- Verify your Google Cloud credentials are properly configured
- Check that the service account has access to Secret Manager
- Ensure the `SERPAPI_KEY` secret exists in the correct project

### "SerpAPI request failed" Error
- Verify your SerpAPI key is valid and has remaining quota
- Check the SerpAPI dashboard for usage and billing status
- Ensure your IP isn't blocked by SerpAPI

### CORS Errors
- Make sure your React app is running on localhost
- Check that the backend server is allowing the correct origin
- Verify the `API_BASE_URL` in the React component matches your backend URL

### No Results Found
- Try different search terms
- Check that the Google Scholar API is responding
- Verify the query parameters are being passed correctly

## Example API Response

```json
{
  "organic_results": [
    {
      "position": 0,
      "title": "Quantifying systemic congestion with POCUS: development of the VExUS grading system",
      "link": "https://doi.org/10.1186/s13089‑020‑00163‑w",
      "snippet": "Background: Point-of-care ultrasound (POCUS) assessment...",
      "publication_info": {
        "summary": "W Beaubien‑Souligny - 2020 - Ultrasound Journal"
      },
      "inline_links": {
        "cited_by": {
          "total": 245,
          "link": "https://scholar.google.com/scholar?cites=..."
        }
      }
    }
  ],
  "search_information": {
    "total_results": 1234,
    "query_displayed": "VEXUS venous excess ultrasound"
  }
}
```

## Rate Limits

- **Free Tier**: 100 searches per month
- **Paid Plans**: Higher limits available at [SerpAPI Pricing](https://serpapi.com/pricing)

The React component includes pagination (limited to 10 pages) to help manage API usage efficiently. 
# Denver Health Research & Emergency Medicine Faculty Page

A modern React application showcasing faculty research with live Google Scholar integration using SERP AI and Google Secret Manager.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm
- Google Cloud credentials (for production)

### Installation & Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Servers**
   ```bash
   # Run both backend and frontend simultaneously
   npm run dev:all
   
   # Or run them separately:
   npm run backend    # Backend server (port 4001)
   npm run dev        # Frontend dev server (port 5173)
   ```

3. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:4001
   - Health Check: http://localhost:4001/api/health

## 🏗️ Architecture

### Backend (`server.js`)
- **Express.js** server with CORS enabled
- **Google Secret Manager** integration for secure API key storage
- **SerpAPI** integration for Google Scholar searches
- **REST API** endpoints for faculty research data

### Frontend (React + TypeScript)
- **React 18** with TypeScript
- **Material-UI v5** with custom grey/black theme
- **React Router** for navigation
- **Responsive design** for mobile and desktop

## 📚 API Endpoints

### Research Endpoints
- `GET /api/health` - Health check and service status
- `GET /api/scholar/search?q={query}` - Global Google Scholar search
- `GET /api/faculty/{facultyId}/research` - Individual faculty research
- `GET /api/research/all` - Combined Denver Health research

### Example Usage
```bash
# Health check
curl http://localhost:4001/api/health

# Search for faculty research
curl "http://localhost:4001/api/faculty/matthew-riscinti/research?limit=5"

# Global research search
curl "http://localhost:4001/api/research/all?q=emergency+ultrasound"
```

## 🎯 Key Features

### Individual Faculty Research Cards
- **Compact Mode**: Displays under faculty photos on cards
- **Detailed Mode**: Full research profiles in modals
- Live publication data with citations and direct links
- Expandable lists with loading states

### Master Research Dashboard
- **Live Google Scholar Search** with real-time results
- **Advanced Filtering**: Search by topic, author, year
- **Research Metrics**: Publications, citations, averages
- **Responsive Design**: Desktop table view, mobile cards
- **Pagination**: Efficient handling of large result sets

### Faculty Profiles
- Individual research showcases for all faculty and fellows
- Personalized search queries for each researcher
- Professional layout with avatars and metrics

## 🔐 Security Features

- **API Key Protection**: SerpAPI key stored securely in Google Secret Manager
- **No Browser Exposure**: API keys never reach client-side code
- **CORS Protection**: Only authorized origins can access the API
- **Rate Limiting**: Controlled through backend server
- **Error Handling**: Graceful error responses with detailed logging

## 🎨 Design System

### Theme
- **Colors**: Professional grey/black minimalist palette
- **Typography**: Clean, readable font hierarchy
- **Components**: Consistent Material-UI components
- **Responsive**: Mobile-first design approach

### Faculty Data Structure
```typescript
interface FacultyMember {
  id: string;
  name: string;
  title: string;
  institution: string;
  roles: string[];
  expertise?: string[];
  email?: string;
  imageUrl?: string;
  // ... additional fields
}
```

## 🚀 Production Deployment

### Environment Variables
```bash
NODE_ENV=production
GOOGLE_CLOUD_PROJECT_ID=decoded-app-457000-s2
PORT=4001
```

### Google Cloud Setup
1. Ensure Google Secret Manager API is enabled
2. Create `googlescholarapi` secret with your SerpAPI key
3. Deploy with proper service account credentials

### Build Commands
```bash
npm run build    # Build frontend for production
npm run preview  # Preview production build
```

## 🧪 Development

### Project Structure
```
src/
├── components/
│   ├── FacultyResearchCard.tsx  # Research display component
│   ├── Navbar.tsx               # Navigation component
│   └── Footer.tsx               # Footer component
├── pages/
│   ├── HomePage.tsx             # Landing page
│   ├── FacultyPage.tsx          # Faculty directory
│   └── ResearchPage.tsx         # Master research dashboard
├── data/
│   └── facultyData.ts           # Faculty information
└── theme/
    └── theme.ts                 # MUI theme configuration
```

### Adding New Faculty
1. Update `src/data/facultyData.ts`
2. Add to `facultySearchQueries` in `server.js` (optional)
3. Faculty research cards will automatically appear

### Customizing Search Queries
Edit the `facultySearchQueries` mapping in `server.js`:
```javascript
const facultySearchQueries = {
  'matthew-riscinti': 'Matthew Riscinti emergency ultrasound',
  'your-faculty-name': 'Your Faculty Name emergency medicine',
  // ...
};
```

## 🐛 Troubleshooting

### Common Issues

**Rollup/Vite Errors**
```bash
# Fix missing rollup dependencies
rm -rf node_modules package-lock.json
npm install
```

**Backend Connection Issues**
- Check if backend is running on port 4001
- Verify Google Cloud credentials are configured
- Check CORS settings for your frontend URL

**No Research Results**
- Verify SerpAPI key is configured in Google Secret Manager
- Check API quota and billing status
- Ensure faculty names match search query format

## 📞 Support

For questions or issues:
- Check the health endpoint: http://localhost:4001/api/health
- Review server logs for detailed error messages
- Verify Google Cloud Secret Manager access

---

Built with ❤️ for Denver Health Emergency Medicine 
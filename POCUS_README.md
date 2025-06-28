# POCUS Atlas Cardiology Gallery

A React-based image gallery for cardiology POCUS images, integrated with The POCUS Atlas Uploads Airtable database.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Google Cloud Project with Secret Manager API enabled
- POCUS Atlas Airtable credentials

### Installation

1. **Install Dependencies** (already installed in this project):
```bash
npm install
```

2. **Configure Google Cloud Secrets**:
   - `POCUS_AIRTABLE_API_KEY` - Personal access token for Airtable
   - `POCUS_AIRTABLE_BASE_ID` - `appqeNK596oLLcJdd`
   - `POCUS_AIRTABLE_TABLE_NAME` - `Airtable Uploads`

3. **Run the Application**:
```bash
# Start the backend server
npm run backend

# In another terminal, start the frontend
npm run dev

# Or run both together
npm run dev:all
```

4. **Access the Gallery**:
   - Frontend: http://localhost:8080/pocus
   - Backend API: http://localhost:4001/api/pocus

## 📁 Project Structure

```
src/
├── components/gallery/
│   ├── CardiologyGallery.tsx    # Main gallery component
│   └── ImageLightbox.tsx        # Image viewer modal
├── services/
│   └── pocusService.ts          # API service layer
├── types/
│   └── pocus.ts                 # TypeScript interfaces
├── pages/
│   └── PocusApp.tsx             # Main app page
├── App.tsx                      # Router and theme provider
└── main.tsx                     # App entry point
```

## 🔧 API Endpoints

### Health Check
```
GET /api/health
```

### Images
```
GET /api/pocus/images                    # Get all cardiac images (categorized)
GET /api/pocus/images/category/:name     # Get images by category
```

### Debug Endpoints
```
GET /api/pocus/debug/fields              # View available Airtable fields
GET /api/pocus/debug/secrets             # Check secret configuration
GET /api/pocus/raw                       # View raw Airtable data
```

## 🏥 Cardiac Categories

The gallery organizes images into 6 main categories:

1. **Cardiomyopathy** - Heart muscle disease
2. **Pericardial Disease** - Pericardial effusions, tamponade
3. **Congenital Heart Disease** - Pediatric and adult congenital abnormalities
4. **Valvular Disease** - Valve stenosis, regurgitation
5. **RV Dysfunction** - Right ventricular strain patterns
6. **Other Cardiac** - IVC assessment, normal variants

## 🎨 Features

### Gallery Features
- **Category Filtering** - Browse by cardiac pathology type
- **Search Functionality** - Search titles, descriptions, tags
- **Responsive Design** - Works on desktop, tablet, mobile
- **View Modes** - Grid view or compact view
- **Image Lightbox** - Full-screen image viewing with navigation

### Lightbox Features
- **Keyboard Navigation** - Arrow keys, Escape, 'i' for info
- **Image Information** - Metadata, contributor, tags
- **Download Support** - Save images locally
- **Touch/Swipe Support** - Mobile-friendly navigation

## 🔑 Environment Variables

For local development, you can use environment variables instead of Google Secret Manager:

```bash
# .env file
POCUS_AIRTABLE_API_KEY=your_airtable_api_key
POCUS_AIRTABLE_BASE_ID=appqeNK596oLLcJdd
POCUS_AIRTABLE_TABLE_NAME=Airtable Uploads
```

## 🛠️ Development

### Available Scripts

```bash
npm run dev            # Start frontend development server (port 8080)
npm run backend        # Start backend server (port 4001)
npm run dev:all        # Start both frontend and backend
npm run build          # Build for production
npm run type-check     # Run TypeScript type checking
npm run lint           # Run ESLint
```

### Adding New Categories

To add a new cardiac category:

1. **Update the server category mapping** in `server.js`:
```javascript
const CARDIAC_CATEGORIES = {
  'New Category': 'newCategory',
  // ... existing categories
};
```

2. **Add to TypeScript interfaces** in `src/types/pocus.ts`:
```typescript
export interface CategorizedImages {
  newCategory: PocusImageData[];
  // ... existing categories
}
```

3. **Add category configuration** in `CardiologyGallery.tsx`:
```typescript
{
  key: 'newCategory',
  title: 'New Category',
  color: '#your-color',
  gradient: 'your-gradient',
  description: 'Description',
  icon: <YourIcon />
}
```

## 📊 Data Structure

### Airtable Configuration
- **Base ID**: `appqeNK596oLLcJdd`
- **Table**: `Airtable Uploads`
- **Filter**: `Section = "Cardiac" AND Status = "Published"`

### Key Fields Used
- `Name` - Image title
- `Caption` - Description
- `De-identified Image/Video` - Media files
- `Category` - Cardiac subcategory
- `Contributor` - Attribution
- `Tags` - Additional metadata

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 4001
CMD ["node", "server.js"]
```

### Environment Setup
1. Configure Google Cloud Secret Manager secrets
2. Deploy to your hosting platform
3. Update CORS origins in `server.js`

## 🔍 Troubleshooting

### Common Issues

1. **Images not loading**:
   - Check Airtable API credentials
   - Verify base ID and table name
   - Check network connectivity

2. **Empty categories**:
   - Ensure images have `Section = "Cardiac"`
   - Check `Submissions Status = "Published"`
   - Verify category mapping

3. **API errors**:
   - Check Google Secret Manager configuration
   - Verify Airtable permissions
   - Check server logs

### Debug Tools

Use the debug endpoints to troubleshoot:
```bash
curl http://localhost:4001/api/health
curl http://localhost:4001/api/pocus/debug/secrets
curl http://localhost:4001/api/pocus/debug/fields
```

## 📝 License

This project is part of The POCUS Atlas educational initiative. Images are provided for educational purposes only.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues related to:
- **Code/Implementation**: Create a GitHub issue
- **Airtable Data**: Contact The POCUS Atlas team
- **Medical Content**: Consult appropriate medical professionals

---

**⚠️ Medical Disclaimer**: This gallery is for educational purposes only. Clinical decisions should not be based solely on these images. Always consult with qualified medical professionals for patient care decisions. 
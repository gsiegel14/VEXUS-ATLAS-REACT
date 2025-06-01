# Publications Page Conversion Outline

## Overview
Convert `publications.astro` to a React component with comprehensive team publications display, paper cards, contribution system, and interactive research showcase using Material-UI components.

## Current Structure Analysis
- Team-focused publications display with paper cards
- Interactive paper cards with hover effects and metadata
- Publication categorization and organization
- External links to research papers with DOI/PMID integration
- Contribution form for suggesting additional publications
- Mobile-responsive design with card-based layout
- Paper metadata display (authors, journals, abstracts, key points)
- Year-based organization and filtering
- Citation formatting and export capabilities

## Comprehensive Conversion Framework

### 1. Main Component Architecture & MUI Integration
```jsx
// src/pages/Publications.jsx
import React, { useState, useMemo } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Fab,
  Grid,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Article, Add, Search } from '@mui/icons-material';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import PublicationCard from '../components/publications/PublicationCard';
import PublicationFilters from '../components/publications/PublicationFilters';
import ContributionForm from '../components/publications/ContributionForm';
import { usePublicationsData } from '../hooks/usePublicationsData';
import { usePublicationFilters } from '../hooks/usePublicationFilters';
import { publicationsConfig } from '../config/publicationsConfig';

const Publications = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [contributionFormOpen, setContributionFormOpen] = useState(false);
  const { publications, loading, error, submitContribution } = usePublicationsData();
  const { 
    filters, 
    filteredPublications, 
    searchTerm, 
    updateFilter, 
    setSearchTerm,
    clearFilters 
  } = usePublicationFilters(publications);

  const publicationsByYear = useMemo(() => {
    const grouped = filteredPublications.reduce((acc, pub) => {
      const year = pub.year;
      if (!acc[year]) acc[year] = [];
      acc[year].push(pub);
      return acc;
    }, {});
    
    // Sort years in descending order
    return Object.keys(grouped)
      .sort((a, b) => b - a)
      .reduce((acc, year) => {
        acc[year] = grouped[year].sort((a, b) => a.title.localeCompare(b.title));
        return acc;
      }, {});
  }, [filteredPublications]);

  return (
    <Layout>
      <SEO 
        title="VEXUS Publications | Research & Scientific Papers"
        description="Browse our collection of research publications and scientific papers on VEXUS (Venous Excess UltraSound) methodology, applications, and clinical significance."
        keywords="VEXUS, publications, research, scientific papers, venous excess, ultrasound, medical literature"
        ogTitle="VEXUS Publications | Research & Scientific Papers"
        ogImage="https://yourdomain.com/images/vexus-publications-preview.jpg"
        ogUrl="https://yourdomain.com/publications"
      />
      
      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
        {/* Header */}
        <Card elevation={2} sx={{ mb: 4 }}>
          <CardContent sx={{ textAlign: 'center', p: { xs: 2, md: 4 } }}>
            <Article sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              VEXUS Publications
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Our team's curated list of academic publications and research papers on VEXUS.
            </Typography>
          </CardContent>
        </Card>

        {/* Introduction */}
        <Card elevation={1} sx={{ mb: 4, bgcolor: 'grey.50' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="body1" paragraph sx={{ lineHeight: 1.6 }}>
              Explore key research papers from our team. We publish articles relevant to the Venous Excess Ultrasound (VEXUS) scoring system. 
              These publications delve into the development, validation, and clinical application of VEXUS in diverse medical settings.
            </Typography>
          </CardContent>
        </Card>

        {/* Filters */}
        <PublicationFilters
          filters={filters}
          searchTerm={searchTerm}
          onFilterChange={updateFilter}
          onSearchChange={setSearchTerm}
          onClearFilters={clearFilters}
          totalPublications={filteredPublications.length}
        />

        {/* Publications by Year */}
        {Object.keys(publicationsByYear).length === 0 ? (
          <Card elevation={1}>
            <CardContent sx={{ textAlign: 'center', py: 6 }}>
              <Typography variant="h6" color="text.secondary">
                No publications found matching your criteria
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Try adjusting your filters or search terms
              </Typography>
            </CardContent>
          </Card>
        ) : (
          Object.entries(publicationsByYear).map(([year, pubs]) => (
            <Box key={year} sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', mr: 2 }}>
                  {year}
                </Typography>
                <Chip 
                  label={`${pubs.length} publication${pubs.length !== 1 ? 's' : ''}`}
                  color="primary"
                />
              </Box>
              
              <Grid container spacing={3}>
                {pubs.map((publication) => (
                  <Grid item xs={12} key={publication.id}>
                    <PublicationCard publication={publication} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))
        )}

        {/* Contribution Form */}
        <ContributionForm
          open={contributionFormOpen}
          onClose={() => setContributionFormOpen(false)}
          onSubmit={submitContribution}
        />

        {/* Floating Action Button */}
        <Fab
          color="secondary"
          aria-label="contribute publication"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={() => setContributionFormOpen(true)}
        >
          <Add />
        </Fab>
      </Container>
    </Layout>
  );
};

export default Publications;
```

### 2. Publication Card Component
```jsx
// src/components/publications/PublicationCard.jsx
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Link as MuiLink,
  Collapse,
  Button,
  Divider,
  Tooltip,
  useTheme
} from '@mui/material';
import {
  Launch,
  ExpandMore,
  FileCopy,
  Share,
  BookmarkBorder,
  Bookmark
} from '@mui/icons-material';
import { useClipboard } from '../hooks/useClipboard';
import { useBookmarks } from '../hooks/useBookmarks';

const PublicationCard = ({ publication }) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
  const { copyToClipboard } = useClipboard();
  const { isBookmarked, toggleBookmark } = useBookmarks();

  const handleCopyDOI = () => {
    copyToClipboard(publication.doi || publication.url);
  };

  const handleCopyCitation = () => {
    const citation = `${publication.authors} (${publication.year}). ${publication.title}. ${publication.journal}.`;
    copyToClipboard(citation);
  };

  const getJournalColor = (journal) => {
    const colors = {
      'Critical Care': 'error',
      'Ultrasound Journal': 'primary',
      'Chest': 'success',
      'Research Square': 'warning'
    };
    return colors[journal] || 'default';
  };

  return (
    <Card 
      elevation={2}
      sx={{
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flex: 1, mr: 2 }}>
            <Typography 
              variant="h6" 
              component="h3"
              sx={{ 
                fontWeight: 'bold',
                mb: 1,
                lineHeight: 1.3,
                color: 'primary.main'
              }}
            >
              {publication.title}
            </Typography>
            
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ mb: 1, fontStyle: 'italic' }}
            >
              {publication.authors}
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              <Chip 
                label={publication.journal}
                size="small"
                color={getJournalColor(publication.journal)}
                variant="outlined"
              />
              <Chip 
                label={publication.year}
                size="small"
                color="primary"
              />
              {publication.studyType && (
                <Chip 
                  label={publication.studyType}
                  size="small"
                  variant="outlined"
                />
              )}
            </Box>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Tooltip title="Bookmark">
              <IconButton 
                size="small"
                onClick={() => toggleBookmark(publication.id)}
                color={isBookmarked(publication.id) ? 'primary' : 'default'}
              >
                {isBookmarked(publication.id) ? <Bookmark /> : <BookmarkBorder />}
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Copy Citation">
              <IconButton size="small" onClick={handleCopyCitation}>
                <FileCopy />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Share">
              <IconButton size="small">
                <Share />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Abstract/Description */}
        <Typography variant="body1" paragraph sx={{ lineHeight: 1.6 }}>
          {publication.abstract || publication.description}
        </Typography>

        {/* Links */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
          <MuiLink
            href={publication.url}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 0.5,
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            <Launch fontSize="small" />
            <Typography variant="body2">View Publication</Typography>
          </MuiLink>
          
          {publication.doi && (
            <Button
              size="small"
              variant="outlined"
              onClick={handleCopyDOI}
              startIcon={<FileCopy />}
            >
              Copy DOI
            </Button>
          )}
        </Box>

        {/* Expandable Details */}
        {(publication.keyFindings || publication.methodology || publication.clinicalRelevance) && (
          <>
            <Divider sx={{ my: 2 }} />
            
            <Button
              onClick={() => setExpanded(!expanded)}
              endIcon={
                <ExpandMore 
                  sx={{ 
                    transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s'
                  }} 
                />
              }
              size="small"
            >
              {expanded ? 'Show Less' : 'Show More Details'}
            </Button>

            <Collapse in={expanded}>
              <Box sx={{ mt: 2 }}>
                {publication.keyFindings && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Key Findings
                    </Typography>
                    <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                      {publication.keyFindings}
                    </Typography>
                  </Box>
                )}

                {publication.methodology && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Methodology
                    </Typography>
                    <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                      {publication.methodology}
                    </Typography>
                  </Box>
                )}

                {publication.clinicalRelevance && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Clinical Relevance
                    </Typography>
                    <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                      {publication.clinicalRelevance}
                    </Typography>
                  </Box>
                )}

                {/* Metrics */}
                {(publication.citations || publication.impactFactor) && (
                  <Box sx={{ display: 'flex', gap: 2, mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    {publication.citations && (
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" color="primary.main">
                          {publication.citations}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Citations
                        </Typography>
                      </Box>
                    )}
                    {publication.impactFactor && (
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" color="primary.main">
                          {publication.impactFactor}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Impact Factor
                        </Typography>
                      </Box>
                    )}
                  </Box>
                )}
              </Box>
            </Collapse>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PublicationCard;
```

### 3. Publication Filters Component
```jsx
// src/components/publications/PublicationFilters.jsx
import React from 'react';
import {
  Paper,
  Box,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  IconButton,
  Chip,
  Collapse,
  Button
} from '@mui/material';
import { Search, Clear, FilterList, ExpandMore } from '@mui/icons-material';

const PublicationFilters = ({ 
  filters, 
  searchTerm, 
  onFilterChange, 
  onSearchChange, 
  onClearFilters,
  totalPublications 
}) => {
  const [expanded, setExpanded] = React.useState(true);

  const filterOptions = {
    year: ['2025', '2024', '2023', '2022', '2021', '2020'],
    journal: ['Critical Care', 'Ultrasound Journal', 'Chest', 'Research Square', 'Other'],
    studyType: ['Prospective', 'Retrospective', 'Review', 'Meta-analysis', 'Case-series']
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length + (searchTerm ? 1 : 0);

  return (
    <Paper elevation={1} sx={{ mb: 4, overflow: 'hidden' }}>
      <Box sx={{ 
        p: 2, 
        bgcolor: 'grey.50', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between' 
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FilterList color="primary" />
          <Typography variant="h6">
            Publication Filters {activeFiltersCount > 0 && `(${activeFiltersCount} active)`}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {totalPublications} publications found
          </Typography>
        </Box>
        <Button
          onClick={() => setExpanded(!expanded)}
          endIcon={
            <ExpandMore 
              sx={{ 
                transform: expanded ? 'rotate(180deg)' : 'none', 
                transition: '0.3s' 
              }} 
            />
          }
        >
          {expanded ? 'Hide' : 'Show'} Filters
        </Button>
      </Box>

      <Collapse in={expanded}>
        <Box sx={{ p: 3 }}>
          {/* Search Bar */}
          <TextField
            fullWidth
            placeholder="Search by title, author, journal, or keywords..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
              endAdornment: searchTerm && (
                <IconButton size="small" onClick={() => onSearchChange('')}>
                  <Clear />
                </IconButton>
              )
            }}
          />

          {/* Filter Controls */}
          <Grid container spacing={2}>
            {Object.entries(filterOptions).map(([key, options]) => (
              <Grid item xs={12} sm={6} md={4} key={key}>
                <FormControl fullWidth>
                  <InputLabel>{key.charAt(0).toUpperCase() + key.slice(1)}</InputLabel>
                  <Select
                    value={filters[key] || ''}
                    label={key.charAt(0).toUpperCase() + key.slice(1)}
                    onChange={(e) => onFilterChange(key, e.target.value || null)}
                  >
                    <MenuItem value="">All {key}s</MenuItem>
                    {options.map(option => (
                      <MenuItem key={option} value={option}>{option}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            ))}
          </Grid>

          {/* Active Filters Display */}
          {activeFiltersCount > 0 && (
            <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ mr: 1 }}>Active filters:</Typography>
              {searchTerm && (
                <Chip
                  label={`Search: "${searchTerm}"`}
                  onDelete={() => onSearchChange('')}
                  size="small"
                />
              )}
              {Object.entries(filters).map(([key, value]) => (
                value && (
                  <Chip
                    key={key}
                    label={`${key}: ${value}`}
                    onDelete={() => onFilterChange(key, null)}
                    size="small"
                  />
                )
              ))}
              <Button size="small" onClick={onClearFilters} sx={{ ml: 1 }}>
                Clear All
              </Button>
            </Box>
          )}
        </Box>
      </Collapse>
    </Paper>
  );
};

export default PublicationFilters;
```

### 4. State Management Hooks

#### usePublicationsData Hook
```jsx
// src/hooks/usePublicationsData.js
import { useState, useCallback, useEffect } from 'react';
import { publicationsService } from '../services/publicationsService';

export const usePublicationsData = () => {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPublications = useCallback(async () => {
    try {
      setLoading(true);
      const data = await publicationsService.fetchPublications();
      setPublications(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const submitContribution = useCallback(async (contribution) => {
    try {
      const result = await publicationsService.submitContribution(contribution);
      return result;
    } catch (err) {
      throw new Error(`Failed to submit contribution: ${err.message}`);
    }
  }, []);

  useEffect(() => {
    fetchPublications();
  }, [fetchPublications]);

  return {
    publications,
    loading,
    error,
    fetchPublications,
    submitContribution
  };
};
```

#### usePublicationFilters Hook
```jsx
// src/hooks/usePublicationFilters.js
import { useState, useMemo, useCallback } from 'react';

export const usePublicationFilters = (publications) => {
  const [filters, setFilters] = useState({
    year: null,
    journal: null,
    studyType: null
  });
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPublications = useMemo(() => {
    return publications.filter(publication => {
      // Search filter
      if (searchTerm) {
        const searchFields = [
          publication.title, 
          publication.authors, 
          publication.journal,
          publication.abstract,
          publication.description,
          publication.keyFindings
        ].filter(Boolean).join(' ').toLowerCase();
        
        if (!searchFields.includes(searchTerm.toLowerCase())) {
          return false;
        }
      }

      // Property filters
      for (const [key, value] of Object.entries(filters)) {
        if (value && publication[key] !== value) {
          return false;
        }
      }

      return true;
    });
  }, [publications, filters, searchTerm]);

  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({ year: null, journal: null, studyType: null });
    setSearchTerm('');
  }, []);

  return {
    filters,
    filteredPublications,
    searchTerm,
    updateFilter,
    setSearchTerm,
    clearFilters
  };
};
```

### 5. Utility Hooks

#### useClipboard Hook
```jsx
// src/hooks/useClipboard.js
import { useState, useCallback } from 'react';

export const useClipboard = () => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return true;
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      return false;
    }
  }, []);

  return { copyToClipboard, copied };
};
```

#### useBookmarks Hook
```jsx
// src/hooks/useBookmarks.js
import { useState, useCallback, useEffect } from 'react';

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem('vexus-publication-bookmarks');
    return saved ? JSON.parse(saved) : [];
  });

  const isBookmarked = useCallback((publicationId) => {
    return bookmarks.includes(publicationId);
  }, [bookmarks]);

  const toggleBookmark = useCallback((publicationId) => {
    setBookmarks(prev => {
      const newBookmarks = prev.includes(publicationId)
        ? prev.filter(id => id !== publicationId)
        : [...prev, publicationId];
      
      localStorage.setItem('vexus-publication-bookmarks', JSON.stringify(newBookmarks));
      return newBookmarks;
    });
  }, []);

  return { bookmarks, isBookmarked, toggleBookmark };
};
```

### 6. Configuration & Data Management

#### Publications Configuration
```javascript
// src/config/publicationsConfig.js
export const publicationsData = [
  {
    id: 'longino-2023-correlation',
    title: 'Correlation between the VEXUS score and right atrial pressure: a pilot prospective observational study',
    authors: 'Longino, A., Martin, K., Leyba, K., Siegel, G., Gill, E., & Burke, J.',
    year: 2023,
    journal: 'Critical Care',
    volume: '27(1)',
    pages: '205',
    doi: '10.1186/s13054-023-04471-0',
    url: 'https://ccforum.biomedcentral.com/articles/10.1186/s13054-023-04471-0',
    abstract: 'A pilot prospective observational study showing correlation between VEXUS and right atrial pressure.',
    studyType: 'Prospective',
    keyFindings: 'Strong correlation between VEXUS scores and invasively measured right atrial pressure, validating the non-invasive assessment approach.',
    methodology: 'Pilot prospective observational study comparing VEXUS scores with invasive right atrial pressure measurements.',
    clinicalRelevance: 'Provides validation for using VEXUS as a non-invasive surrogate for right atrial pressure assessment.',
    citations: 42,
    impactFactor: 8.8
  },
  {
    id: 'longino-2024-reliability',
    title: 'Reliability and reproducibility of the venous excess ultrasound (VEXUS) score, a multi-site prospective study: validating a novel ultrasound technique for assessing venous congestion',
    authors: 'Longino, A. A., Martin, K. C., Leyba, K. R., McCormack, L., Siegel, G., & Gill, E. A.',
    year: 2024,
    journal: 'Critical Care',
    volume: '28(1)',
    pages: '961',
    doi: '10.1186/s13054-024-04961-9',
    url: 'https://ccforum.biomedcentral.com/articles/10.1186/s13054-024-04961-9',
    abstract: 'A multi-site prospective study validating a novel ultrasound technique for assessing venous congestion.',
    studyType: 'Prospective',
    keyFindings: 'Excellent inter-rater reliability and reproducibility of VEXUS scoring across multiple sites and operators.',
    methodology: 'Multi-site prospective validation study with multiple trained operators performing VEXUS assessments.',
    clinicalRelevance: 'Demonstrates that VEXUS can be reliably performed across different institutions and by different operators.',
    citations: 28,
    impactFactor: 8.8
  },
  {
    id: 'longino-2024-chest',
    title: 'Prospective evaluation of venous excess ultrasound for estimation of venous congestion',
    authors: 'Longino, A., Martin, K., Leyba, K., Siegel, G., Thai, T. N., & Gill, E.',
    year: 2024,
    journal: 'Chest',
    volume: '165(4)',
    pages: '1024-1032',
    doi: '10.1016/j.chest.2023.12.024',
    url: 'https://journal.chestnet.org/article/S0012-3692(23)05557-5/abstract',
    abstract: 'A prospective evaluation study of the VEXUS technique for estimating venous congestion.',
    studyType: 'Prospective',
    keyFindings: 'VEXUS demonstrates excellent correlation with clinical measures of venous congestion and fluid overload.',
    methodology: 'Prospective cohort study evaluating VEXUS performance against clinical gold standards.',
    clinicalRelevance: 'Supports the use of VEXUS in clinical practice for non-invasive assessment of venous congestion.',
    citations: 31,
    impactFactor: 9.6
  }
];
```

### 7. Dependencies & Implementation Priority

#### Dependencies
```json
{
  "dependencies": {
    "@mui/material": "^5.x.x",
    "@mui/icons-material": "^5.x.x",
    "@emotion/react": "^11.x.x",
    "@emotion/styled": "^11.x.x",
    "react": "^18.x.x",
    "react-dom": "^18.x.x"
  }
}
```

#### Implementation Priority
1. **Core Layout & Structure** (Container, headers, basic navigation)
2. **Publication Cards** (Card component with hover effects and metadata)
3. **Filter System** (Search and dropdown filters)
4. **Year-based Organization** (Grouping and sorting by publication year)
5. **Interactive Features** (Bookmarks, clipboard, expandable details)
6. **Contribution System** (Form for suggesting new publications)
7. **Performance Optimizations** (Memoization, lazy loading)
8. **Testing & Accessibility** (Complete coverage, ARIA support)

### 8. Testing Strategy

```javascript
// src/components/publications/__tests__/PublicationCard.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import PublicationCard from '../PublicationCard';

const theme = createTheme();
const mockPublication = {
  id: '1',
  title: 'Test Publication',
  authors: 'Smith J., Doe A.',
  year: 2024,
  journal: 'Critical Care',
  abstract: 'Test abstract content',
  url: 'https://example.com',
  keyFindings: 'Test findings'
};

describe('PublicationCard', () => {
  test('renders publication information', () => {
    render(
      <ThemeProvider theme={theme}>
        <PublicationCard publication={mockPublication} />
      </ThemeProvider>
    );
    
    expect(screen.getByText('Test Publication')).toBeInTheDocument();
    expect(screen.getByText('Smith J., Doe A.')).toBeInTheDocument();
    expect(screen.getByText('Critical Care')).toBeInTheDocument();
  });

  test('expands to show additional details', () => {
    render(
      <ThemeProvider theme={theme}>
        <PublicationCard publication={mockPublication} />
      </ThemeProvider>
    );
    
    const expandButton = screen.getByText('Show More Details');
    fireEvent.click(expandButton);
    
    expect(screen.getByText('Test findings')).toBeInTheDocument();
  });
});
```

### 9. Performance & SEO Considerations

- **Publication Schema**: Structured data for academic papers
- **Citation Export**: BibTeX and other academic formats
- **Search Optimization**: Full-text search across all publication metadata
- **Bookmarking**: Local storage for user favorites
- **Responsive Design**: Mobile-optimized cards and interactions
- **Accessibility**: Screen reader support, keyboard navigation

This comprehensive framework provides a robust foundation for converting the publications.astro page to a modern React application with Material-UI, ensuring excellent user experience for academic publication browsing and research discovery. 
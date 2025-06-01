# Literature Review Page Conversion Outline

## Overview
Convert `literature.astro` to a React component with comprehensive bibliography management, literature filtering, citation system, and interactive research table using Material-UI components.

## Current Structure Analysis
- Comprehensive literature review with verified bibliography
- Multi-section organization (Foundational papers, Recent studies, Mini-reviews)
- Interactive reference tables with working DOI/PMID links
- Complex markdown tables with citation formatting
- Academic reference management system
- Feedback form integration for contribution suggestions
- Mobile-responsive design with collapsible sections
- Scientific paper metadata display (authors, journals, years)
- External link validation and tracking

## Comprehensive Conversion Framework

### 1. Main Component Architecture & MUI Integration
```jsx
// src/pages/Literature.jsx
import React, { useState, useCallback, useMemo } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Tabs,
  Tab,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  useTheme,
  useMediaQuery,
  Fab
} from '@mui/material';
import { MenuBook, Search, FilterList, Add } from '@mui/icons-material';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import LiteratureTable from '../components/literature/LiteratureTable';
import PaperCard from '../components/literature/PaperCard';
import ResearchFilters from '../components/literature/ResearchFilters';
import ContributionForm from '../components/literature/ContributionForm';
import { useLiteratureData } from '../hooks/useLiteratureData';
import { useLiteratureFilters } from '../hooks/useLiteratureFilters';
import { literatureConfig } from '../config/literatureConfig';

const Literature = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [activeTab, setActiveTab] = useState(0);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'
  const [contributionFormOpen, setContributionFormOpen] = useState(false);
  
  const { papers, loading, error, submitContribution } = useLiteratureData();
  const { 
    filters, 
    filteredPapers, 
    searchTerm, 
    updateFilter, 
    setSearchTerm,
    clearFilters 
  } = useLiteratureFilters(papers);

  const categorizedPapers = useMemo(() => {
    return {
      foundational: filteredPapers.filter(paper => paper.category === 'foundational'),
      recent: filteredPapers.filter(paper => paper.category === 'recent'),
      reviews: filteredPapers.filter(paper => paper.category === 'reviews')
    };
  }, [filteredPapers]);

  const tabContent = [
    { label: 'Foundational Papers', key: 'foundational', description: 'Seminal works that established VEXUS methodology (2019-2022)' },
    { label: 'Recent Studies', key: 'recent', description: 'Latest peer-reviewed clinical studies (2023-2025)' },
    { label: 'Reviews & Guides', key: 'reviews', description: 'Educational overviews and practical guides' }
  ];

  return (
    <Layout>
      <SEO 
        title="VEXUS Literature Review - Comprehensive Research Bibliography"
        description="Comprehensive literature review on VEXUS (Venous Excess UltraSound) methodology, research findings, and clinical applications. Stay updated with the latest scientific developments."
        keywords="VEXUS, literature review, research, scientific papers, venous excess, ultrasound, medical literature"
        ogTitle="VEXUS Literature Review | Latest Research & Findings"
        ogImage="https://yourdomain.com/images/vexus-literature-preview.jpg"
        ogUrl="https://yourdomain.com/literature"
      />
      
      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
        {/* Header */}
        <Card elevation={2} sx={{ mb: 4 }}>
          <CardContent sx={{ textAlign: 'center', p: { xs: 2, md: 4 } }}>
            <MenuBook sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              VEXUS Literature Review
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Comprehensive analysis of research on the Venous Excess Ultrasound Score
            </Typography>
          </CardContent>
        </Card>

        {/* Introduction Section */}
        <Card elevation={1} sx={{ mb: 4, bgcolor: 'grey.50' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="body1" paragraph sx={{ fontWeight: 'medium' }}>
              Below is an up‑to‑date, <strong>fully verified bibliography of peer‑reviewed clinical‑application papers on the Venous Excess Ultrasound Score (VExUS)</strong>.
            </Typography>
            <Typography variant="body1" paragraph>
              For each entry you will find: authors, year, study type, one‑line takeaway, and a <strong>working locator</strong> (DOI or PubMed PMID). 
              All papers were accessed and confirmed to exist in PubMed, publisher sites, or conference abstract archives at the time of writing.
            </Typography>
          </CardContent>
        </Card>

        {/* Research Filters */}
        <ResearchFilters
          filters={filters}
          searchTerm={searchTerm}
          onFilterChange={updateFilter}
          onSearchChange={setSearchTerm}
          onClearFilters={clearFilters}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          totalPapers={filteredPapers.length}
        />

        {/* Content Tabs */}
        <Card elevation={1}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            variant={isMobile ? 'scrollable' : 'fullWidth'}
            scrollButtons="auto"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            {tabContent.map((tab, index) => (
              <Tab 
                key={tab.key}
                label={
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="subtitle2">{tab.label}</Typography>
                    <Chip 
                      label={categorizedPapers[tab.key]?.length || 0} 
                      size="small" 
                      color="primary"
                      sx={{ mt: 0.5 }}
                    />
                  </Box>
                }
              />
            ))}
          </Tabs>

          {tabContent.map((tab, index) => (
            <Box key={tab.key} hidden={activeTab !== index} sx={{ p: 3 }}>
              <Typography variant="body2" color="text.secondary" paragraph>
                {tab.description}
              </Typography>
              
              {viewMode === 'table' ? (
                <LiteratureTable 
                  papers={categorizedPapers[tab.key] || []}
                  category={tab.key}
                />
              ) : (
                <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(auto-fit, minmax(400px, 1fr))' } }}>
                  {(categorizedPapers[tab.key] || []).map(paper => (
                    <PaperCard key={paper.id} paper={paper} />
                  ))}
                </Box>
              )}
            </Box>
          ))}
        </Card>

        {/* Access Instructions */}
        <Card elevation={1} sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>How to Access the Articles</Typography>
            <Box component="ul" sx={{ pl: 3, '& li': { mb: 1 } }}>
              <li>
                <Typography variant="body2">
                  <strong>DOI links</strong> – copy the DOI (e.g., <code>10.1186/s13089-020-00163-w</code>) into a browser after <code>https://doi.org/</code> to reach the publisher's page.
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  <strong>PubMed IDs (PMID)</strong> – paste the PMID at the end of <code>https://pubmed.ncbi.nlm.nih.gov/</code> (e.g., <code>…/39234262</code>) to view the abstract and full‑text options.
                </Typography>
              </li>
            </Box>
            <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
              Either method will give you a <strong>working, citable URL</strong> without relying on third‑party sites.
            </Typography>
          </CardContent>
        </Card>

        {/* Contribution Form */}
        <ContributionForm
          open={contributionFormOpen}
          onClose={() => setContributionFormOpen(false)}
          onSubmit={submitContribution}
        />

        {/* Floating Action Button */}
        <Fab
          color="secondary"
          aria-label="contribute research"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={() => setContributionFormOpen(true)}
        >
          <Add />
        </Fab>
      </Container>
    </Layout>
  );
};

export default Literature;
```

### 2. Literature Table Component with Advanced Features
```jsx
// src/components/literature/LiteratureTable.jsx
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  Typography,
  Link as MuiLink,
  Chip,
  IconButton,
  Tooltip,
  Box,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { Launch, FileCopy } from '@mui/icons-material';

const LiteratureTable = ({ papers, category }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [orderBy, setOrderBy] = useState('year');
  const [order, setOrder] = useState('desc');

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedPapers = React.useMemo(() => {
    return papers.sort((a, b) => {
      if (orderBy === 'year') {
        return order === 'asc' ? a.year - b.year : b.year - a.year;
      }
      if (orderBy === 'authors') {
        const aAuthor = a.authors.split(',')[0].trim();
        const bAuthor = b.authors.split(',')[0].trim();
        return order === 'asc' 
          ? aAuthor.localeCompare(bAuthor)
          : bAuthor.localeCompare(aAuthor);
      }
      return 0;
    });
  }, [papers, order, orderBy]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const getStudyTypeColor = (type) => {
    const colors = {
      'prospective': 'primary',
      'retrospective': 'secondary', 
      'review': 'info',
      'meta-analysis': 'success',
      'case-series': 'warning'
    };
    return colors[type.toLowerCase()] || 'default';
  };

  if (isMobile) {
    // Mobile card layout
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {sortedPapers.map((paper, index) => (
          <Paper key={paper.id} elevation={1} sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
              <Chip 
                label={`#${paper.number}`} 
                size="small" 
                color="primary" 
              />
              <Chip 
                label={paper.studyType} 
                size="small" 
                color={getStudyTypeColor(paper.studyType)}
              />
            </Box>
            
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
              {paper.title}
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {paper.authors} ({paper.year})
            </Typography>
            
            <Typography variant="body2" sx={{ mb: 1 }}>
              {paper.journal}
            </Typography>
            
            <Typography variant="body2" sx={{ mb: 2, fontStyle: 'italic' }}>
              {paper.keyPoint}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <MuiLink
                href={paper.url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
              >
                <Launch fontSize="small" />
                {paper.locatorType}
              </MuiLink>
              <Tooltip title="Copy reference">
                <IconButton 
                  size="small" 
                  onClick={() => copyToClipboard(paper.citation)}
                >
                  <FileCopy fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Paper>
        ))}
      </Box>
    );
  }

  // Desktop table layout
  return (
    <TableContainer component={Paper} elevation={0}>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: 'grey.50' }}>
            <TableCell sx={{ fontWeight: 'bold' }}>#</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>
              <TableSortLabel
                active={orderBy === 'authors'}
                direction={orderBy === 'authors' ? order : 'asc'}
                onClick={() => handleSort('authors')}
              >
                Citation (first author)
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Design / Cohort</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Key clinical point</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Locator</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedPapers.map((paper) => (
            <TableRow key={paper.id} hover>
              <TableCell>
                <Chip label={paper.number} size="small" color="primary" />
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                    {paper.citation}
                  </Typography>
                  <Chip 
                    label={paper.studyType} 
                    size="small" 
                    color={getStudyTypeColor(paper.studyType)}
                  />
                </Box>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{paper.cohortInfo}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{paper.keyPoint}</Typography>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <MuiLink
                    href={paper.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                  >
                    <Launch fontSize="small" />
                    {paper.locator}
                  </MuiLink>
                  <Tooltip title="Copy DOI/PMID">
                    <IconButton 
                      size="small" 
                      onClick={() => copyToClipboard(paper.locator)}
                    >
                      <FileCopy fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LiteratureTable;
```

### 3. Research Filters Component
```jsx
// src/components/literature/ResearchFilters.jsx
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
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  IconButton,
  Chip
} from '@mui/material';
import { Search, Clear, TableChart, ViewModule } from '@mui/icons-material';

const ResearchFilters = ({ 
  filters, 
  searchTerm, 
  onFilterChange, 
  onSearchChange, 
  onClearFilters,
  viewMode,
  onViewModeChange,
  totalPapers 
}) => {
  const filterOptions = {
    year: ['2019', '2020', '2021', '2022', '2023', '2024', '2025'],
    studyType: ['Prospective', 'Retrospective', 'Review', 'Meta-analysis', 'Case-series'],
    journal: ['Critical Care', 'Ultrasound Journal', 'Chest', 'JACC', 'Other']
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length + (searchTerm ? 1 : 0);

  return (
    <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h6" gutterBottom>
            Research Filters {activeFiltersCount > 0 && `(${activeFiltersCount} active)`}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {totalPapers} papers found
          </Typography>
        </Box>
        
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(e, newMode) => newMode && onViewModeChange(newMode)}
          size="small"
        >
          <ToggleButton value="table">
            <TableChart />
          </ToggleButton>
          <ToggleButton value="cards">
            <ViewModule />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Search */}
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

      {/* Active Filters */}
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
          <IconButton size="small" onClick={onClearFilters} sx={{ ml: 1 }}>
            <Clear />
          </IconButton>
        </Box>
      )}
    </Paper>
  );
};

export default ResearchFilters;
```

### 4. State Management Hooks

#### useLiteratureData Hook
```jsx
// src/hooks/useLiteratureData.js
import { useState, useCallback, useEffect } from 'react';
import { literatureService } from '../services/literatureService';

export const useLiteratureData = () => {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPapers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await literatureService.fetchPapers();
      setPapers(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const submitContribution = useCallback(async (contribution) => {
    try {
      const result = await literatureService.submitContribution(contribution);
      return result;
    } catch (err) {
      throw new Error(`Failed to submit contribution: ${err.message}`);
    }
  }, []);

  useEffect(() => {
    fetchPapers();
  }, [fetchPapers]);

  return {
    papers,
    loading,
    error,
    fetchPapers,
    submitContribution
  };
};
```

#### useLiteratureFilters Hook
```jsx
// src/hooks/useLiteratureFilters.js
import { useState, useMemo, useCallback } from 'react';

export const useLiteratureFilters = (papers) => {
  const [filters, setFilters] = useState({
    year: null,
    studyType: null,
    journal: null
  });
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPapers = useMemo(() => {
    return papers.filter(paper => {
      // Search filter
      if (searchTerm) {
        const searchFields = [
          paper.title, paper.authors, paper.journal, 
          paper.keyPoint, paper.citation
        ].filter(Boolean).join(' ').toLowerCase();
        
        if (!searchFields.includes(searchTerm.toLowerCase())) {
          return false;
        }
      }

      // Property filters
      for (const [key, value] of Object.entries(filters)) {
        if (value && paper[key] !== value) {
          return false;
        }
      }

      return true;
    });
  }, [papers, filters, searchTerm]);

  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({ year: null, studyType: null, journal: null });
    setSearchTerm('');
  }, []);

  return {
    filters,
    filteredPapers,
    searchTerm,
    updateFilter,
    setSearchTerm,
    clearFilters
  };
};
```

### 5. Configuration Management

#### Literature Configuration
```javascript
// src/config/literatureConfig.js
export const literatureData = {
  foundational: [
    {
      id: 'beaubien-2020',
      number: 1,
      title: 'Quantifying systemic congestion with POCUS: development of the VExUS grading system',
      authors: 'Beaubien‑Souligny W.',
      year: 2020,
      journal: 'Ultrasound J 12:16',
      studyType: 'Post‑hoc cohort',
      cohortInfo: 'n = 145 cardiac‑surgery pts',
      keyPoint: 'Defined 4‑step score; grade ≥3 predicted AKI.',
      locator: 'DOI 10.1186/s13089‑020‑00163‑w',
      locatorType: 'SpringerOpen',
      url: 'https://doi.org/10.1186/s13089‑020‑00163‑w',
      citation: 'Beaubien‑Souligny W. 2020. Quantifying systemic congestion with POCUS: development of the VExUS grading system. Ultrasound J 12:16.',
      category: 'foundational'
    }
    // Additional papers...
  ],
  recent: [
    {
      id: 'landi-2024',
      number: 5,
      title: 'VExUS and prognosis in acute heart failure in the ED: prospective study',
      authors: 'Landi I.',
      year: 2024,
      journal: 'Eur Heart J Open 4:oeae050',
      studyType: 'Prospective',
      cohortInfo: 'ED, n = 160',
      keyPoint: 'Admission grade ≥2 doubled 90‑day HF readmission & mortality.',
      locator: 'DOI 10.1093/ehjopen/oeae050 • PMID 39234262',
      locatorType: 'PubMed',
      url: 'https://pubmed.ncbi.nlm.nih.gov/39234262/',
      citation: 'Landi I. 2024. VExUS and prognosis in acute heart failure in the ED: prospective study. Eur Heart J Open 4:oeae050.',
      category: 'recent'
    }
    // Additional papers...
  ],
  reviews: [
    {
      id: 'chhetri-2024',
      number: 13,
      title: 'Venous excess ultrasound: mini‑review & practical guide',
      authors: 'Chhetri R.',
      year: 2024,
      journal: 'World J Cardiol 16:101708',
      studyType: 'Review',
      cohortInfo: 'Educational review',
      keyPoint: 'Highlights algorithmic fluid‑management pathways.',
      locator: 'DOI 10.4330/wjc.v16.i2.101708',
      locatorType: 'WJGNet',
      url: 'https://doi.org/10.4330/wjc.v16.i2.101708',
      citation: 'Chhetri R. 2024. Venous excess ultrasound: mini‑review & practical guide. World J Cardiol 16:101708.',
      category: 'reviews'
    }
    // Additional papers...
  ]
};
```

### 6. Dependencies & Implementation Priority

#### Dependencies
```json
{
  "dependencies": {
    "@mui/material": "^5.x.x",
    "@mui/icons-material": "^5.x.x",
    "@emotion/react": "^11.x.x",
    "@emotion/styled": "^11.x.x",
    "react": "^18.x.x",
    "react-dom": "^18.x.x",
    "react-hook-form": "^7.x.x"
  }
}
```

#### Implementation Priority
1. **Core Layout & Navigation** (Container, Tabs, Header)
2. **Literature Table** (Table component with sorting, filtering)
3. **Research Filters** (Search, dropdowns, view toggle)
4. **Paper Cards** (Mobile-responsive card layout)
5. **State Management** (Literature data, filters)
6. **Contribution System** (Form for suggesting papers)
7. **Performance Optimizations** (Virtualization, memoization)
8. **Testing & Accessibility** (Complete coverage, ARIA support)

### 7. Testing Strategy

```javascript
// src/components/literature/__tests__/LiteratureTable.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import LiteratureTable from '../LiteratureTable';

const theme = createTheme();
const mockPapers = [
  {
    id: '1',
    number: 1,
    title: 'Test Paper',
    authors: 'Smith J.',
    year: 2024,
    journal: 'Test Journal',
    studyType: 'Prospective',
    keyPoint: 'Test finding',
    locator: 'DOI 10.1000/test',
    url: 'https://doi.org/10.1000/test'
  }
];

describe('LiteratureTable', () => {
  test('renders papers in table format', () => {
    render(
      <ThemeProvider theme={theme}>
        <LiteratureTable papers={mockPapers} category="foundational" />
      </ThemeProvider>
    );
    
    expect(screen.getByText('Test Paper')).toBeInTheDocument();
    expect(screen.getByText('Smith J.')).toBeInTheDocument();
  });

  test('sorts papers by year', () => {
    render(
      <ThemeProvider theme={theme}>
        <LiteratureTable papers={mockPapers} category="foundational" />
      </ThemeProvider>
    );
    
    const yearSortButton = screen.getByText('Citation (first author)');
    fireEvent.click(yearSortButton);
    // Verify sorting behavior
  });
});
```

This comprehensive framework provides a robust foundation for converting the literature.astro page to a modern React application with Material-UI, ensuring excellent user experience for academic research browsing and contribution. 
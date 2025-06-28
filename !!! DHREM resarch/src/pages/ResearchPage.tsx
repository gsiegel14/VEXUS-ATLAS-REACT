import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  TextField,
  InputAdornment,
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Link,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  useTheme,
  useMediaQuery,
  Avatar,
} from '@mui/material';
import {
  Search,
  School,
  Refresh,
  Launch,
  Analytics,
  Group,
  Article,
  TrendingUp,
  Clear,
} from '@mui/icons-material';
import { faculty, currentFellows } from '../data/facultyData';
import FacultyResearchCard from '../components/FacultyResearchCard';

interface GoogleScholarResult {
  position: number;
  title: string;
  link?: string;
  snippet?: string;
  publication_info?: {
    summary: string;
  };
  inline_links?: {
    cited_by?: {
      total: number;
      link: string;
    };
    versions?: {
      total: number;
      link: string;
    };
  };
  resources?: Array<{
    title: string;
    file_format: string;
    link: string;
  }>;
}

interface GoogleScholarResponse {
  organic_results: GoogleScholarResult[];
  search_information?: {
    total_results: number;
    query_displayed: string;
  };
  pagination?: {
    current: number;
    next?: string;
  };
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`research-tabpanel-${index}`}
      aria-labelledby={`research-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const ResearchPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // State for tabs
  const [tabValue, setTabValue] = useState(0);
  
  // State for global research search
  const [results, setResults] = useState<GoogleScholarResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchInfo, setSearchInfo] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  
  // State for filters
  const [searchQuery, setSearchQuery] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [authorFilter, setAuthorFilter] = useState('');
  
  const getApiBaseUrl = () => {
    if (import.meta.env.PROD) {
      return '';
    }
    return import.meta.env.VITE_API_URL || 'http://localhost:4001';
  };
  
  const API_BASE_URL = getApiBaseUrl();
  const resultsPerPage = 20;

  const fetchResearchResults = async (page: number = 1, query?: string) => {
    setLoading(true);
    setError(null);

    try {
      const start = (page - 1) * resultsPerPage;
      const searchTerm = query || searchQuery || 'Denver Health emergency ultrasound OR "Denver emergency ultrasound" OR "Denver Health ultrasound"';
      
      const response = await fetch(
        `${API_BASE_URL}/api/research/all?q=${encodeURIComponent(searchTerm)}&start=${start}&num=${resultsPerPage}`
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `API request failed: ${response.status}`);
      }

      const data: GoogleScholarResponse = await response.json();
      
      if (data.organic_results) {
        setResults(data.organic_results);
        setSearchInfo(data.search_information);
        setTotalResults(data.search_information?.total_results || 0);
      } else {
        setResults([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch research');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tabValue === 0) {
      fetchResearchResults(currentPage);
    }
  }, [currentPage, tabValue]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    if (newValue === 0) {
      fetchResearchResults(1);
    }
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const handleSearchSubmit = () => {
    setCurrentPage(1);
    fetchResearchResults(1, searchQuery);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setYearFilter('');
    setAuthorFilter('');
    setCurrentPage(1);
    fetchResearchResults(1, '');
  };

  const extractYear = (summary: string): string => {
    const yearMatch = summary.match(/\b(19|20)\d{2}\b/);
    return yearMatch ? yearMatch[0] : '';
  };

  const extractAuthors = (summary: string): string => {
    const parts = summary.split(' - ');
    return parts[0] || 'Unknown';
  };

  // Filter results based on year and author filters
  const filteredResults = useMemo(() => {
    let filtered = results;

    if (yearFilter) {
      filtered = filtered.filter(result => 
        result.publication_info && extractYear(result.publication_info.summary) === yearFilter
      );
    }

    if (authorFilter) {
      filtered = filtered.filter(result =>
        result.publication_info && 
        extractAuthors(result.publication_info.summary).toLowerCase().includes(authorFilter.toLowerCase())
      );
    }

    return filtered;
  }, [results, yearFilter, authorFilter]);

  // Calculate research metrics
  const researchMetrics = useMemo(() => {
    const totalCitations = results.reduce((sum, result) => 
      sum + (result.inline_links?.cited_by?.total || 0), 0
    );
    
    const years = results
      .map(result => result.publication_info ? extractYear(result.publication_info.summary) : '')
      .filter(year => year !== '');
    
    const uniqueYears = [...new Set(years)];
    
    return {
      totalPublications: results.length,
      totalCitations,
      yearRange: uniqueYears.length > 0 ? `${Math.min(...uniqueYears.map(Number))} - ${Math.max(...uniqueYears.map(Number))}` : 'N/A',
      averageCitations: Math.round(totalCitations / Math.max(results.length, 1))
    };
  }, [results]);

  const allFacultyAndFellows = [...faculty, ...currentFellows];

  const maxPages = Math.ceil(totalResults / resultsPerPage);

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          backgroundColor: 'grey.900',
          color: 'white',
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            sx={{
              textAlign: 'center',
              fontWeight: 700,
              mb: 2,
            }}
          >
            Research & Publications
          </Typography>
          <Typography
            variant="h6"
            sx={{
              textAlign: 'center',
              color: 'grey.300',
              maxWidth: '800px',
              mx: 'auto',
            }}
          >
            Explore our comprehensive research portfolio and latest publications in emergency ultrasound
          </Typography>
        </Container>
      </Box>

      {/* Research Metrics Overview */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={1}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Article sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  {researchMetrics.totalPublications}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Publications Found
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={1}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <TrendingUp sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  {researchMetrics.totalCitations}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Citations
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={1}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Analytics sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  {researchMetrics.averageCitations}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Avg Citations
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={1}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Group sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  {allFacultyAndFellows.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Researchers
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Research Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="research tabs"
            variant={isMobile ? 'scrollable' : 'fullWidth'}
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 500,
              },
            }}
          >
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <School />
                  Global Research
                </Box>
              } 
            />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Group />
                  Faculty Profiles
                </Box>
              } 
            />
          </Tabs>
        </Box>

        {/* Global Research Tab */}
        <TabPanel value={tabValue} index={0}>
          {/* Search and Filters */}
          <Card elevation={1} sx={{ mb: 3 }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    placeholder="Search publications by topic, author, or keywords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSearchSubmit();
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <FormControl fullWidth>
                    <InputLabel>Year</InputLabel>
                    <Select
                      value={yearFilter}
                      label="Year"
                      onChange={(e) => setYearFilter(e.target.value)}
                    >
                      <MenuItem value="">All Years</MenuItem>
                      {['2024', '2023', '2022', '2021', '2020', '2019'].map(year => (
                        <MenuItem key={year} value={year}>{year}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <TextField
                    fullWidth
                    label="Author"
                    value={authorFilter}
                    onChange={(e) => setAuthorFilter(e.target.value)}
                    placeholder="Filter by author"
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      onClick={handleSearchSubmit}
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={16} /> : <Search />}
                    >
                      Search
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={handleClearFilters}
                      startIcon={<Clear />}
                    >
                      Clear
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Research Results */}
          {loading && results.length === 0 ? (
            <Card elevation={1}>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <CircularProgress sx={{ mb: 2 }} />
                <Typography variant="h6">Fetching latest research from Google Scholar...</Typography>
              </CardContent>
            </Card>
          ) : error ? (
            <Card elevation={1}>
              <CardContent>
                <Alert 
                  severity="error" 
                  sx={{ mb: 2 }}
                  action={
                    <Button 
                      color="inherit" 
                      size="small" 
                      onClick={() => fetchResearchResults(currentPage)}
                      startIcon={<Refresh />}
                    >
                      Retry
                    </Button>
                  }
                >
                  <Typography variant="body2">
                    <strong>Unable to fetch research results:</strong> {error}
                  </Typography>
                </Alert>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Results Summary */}
              {searchInfo && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body1" color="text.secondary">
                    Showing {filteredResults.length} results for "{searchInfo.query_displayed}" 
                    ({searchInfo.total_results?.toLocaleString()} total found)
                  </Typography>
                </Box>
              )}

              {/* Results Table/List */}
              {isMobile ? (
                // Mobile view
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {filteredResults.map((result) => (
                    <Card key={result.position} elevation={1}>
                      <CardContent>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                          {result.title}
                        </Typography>
                        
                        {result.publication_info && (
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {result.publication_info.summary}
                          </Typography>
                        )}
                        
                        {result.snippet && (
                          <Typography variant="body2" sx={{ mb: 2, fontStyle: 'italic', color: 'text.secondary' }}>
                            {result.snippet.substring(0, 200)}...
                          </Typography>
                        )}
                        
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap', mb: 2 }}>
                          {result.inline_links?.cited_by && (
                            <Chip 
                              label={`${result.inline_links.cited_by.total} citations`} 
                              size="small" 
                              color="primary"
                              variant="outlined"
                            />
                          )}
                          {result.publication_info && (
                            <Chip 
                              label={extractYear(result.publication_info.summary)} 
                              size="small" 
                              variant="outlined" 
                            />
                          )}
                        </Box>
                        
                        {result.link && (
                          <Link
                            href={result.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                          >
                            <Launch fontSize="small" />
                            View Publication
                          </Link>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              ) : (
                // Desktop table view
                <TableContainer component={Paper} elevation={1}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: 'grey.50' }}>
                        <TableCell sx={{ fontWeight: 'bold', width: '5%' }}>#</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', width: '40%' }}>Title & Authors</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', width: '35%' }}>Abstract/Summary</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', width: '10%' }}>Year</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', width: '10%' }}>Citations</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredResults.map((result) => (
                        <TableRow key={result.position} hover>
                          <TableCell>
                            <Chip 
                              label={result.position + (currentPage - 1) * resultsPerPage} 
                              size="small" 
                              color="primary" 
                            />
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                                {result.link ? (
                                  <Link
                                    href={result.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{ textDecoration: 'none', color: 'primary.main' }}
                                  >
                                    {result.title}
                                  </Link>
                                ) : (
                                  result.title
                                )}
                              </Typography>
                              {result.publication_info && (
                                <Typography variant="caption" color="text.secondary">
                                  {result.publication_info.summary}
                                </Typography>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>
                            {result.snippet && (
                              <Typography variant="body2" color="text.secondary">
                                {result.snippet.length > 150 
                                  ? `${result.snippet.substring(0, 150)}...` 
                                  : result.snippet
                                }
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            {result.publication_info && (
                              <Chip 
                                label={extractYear(result.publication_info.summary) || 'N/A'} 
                                size="small" 
                                variant="outlined" 
                              />
                            )}
                          </TableCell>
                          <TableCell>
                            {result.inline_links?.cited_by && (
                              <Chip 
                                label={result.inline_links.cited_by.total} 
                                size="small" 
                                color="primary"
                                variant="outlined"
                              />
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {/* Pagination */}
              {maxPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                    count={Math.min(maxPages, 10)}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    disabled={loading}
                  />
                </Box>
              )}
            </>
          )}
        </TabPanel>

        {/* Faculty Profiles Tab */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            Individual Faculty Research Profiles
          </Typography>
          
          <Grid container spacing={4}>
            {allFacultyAndFellows.map((member) => {
              const facultyId = member.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
              
              return (
                <Grid item xs={12} md={6} key={member.id}>
                  <Card elevation={2}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar
                          src={member.imageUrl}
                          sx={{
                            width: 60,
                            height: 60,
                            mr: 2,
                            backgroundColor: 'grey.300',
                          }}
                        >
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {member.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {member.title}
                          </Typography>
                          {member.isCurrentFellow && (
                            <Chip
                              label="Current Fellow"
                              size="small"
                              color="primary"
                              sx={{ mt: 0.5 }}
                            />
                          )}
                        </Box>
                      </Box>
                      
                      <FacultyResearchCard 
                        facultyId={facultyId}
                        facultyName={member.name}
                        maxResults={5}
                        compact={false}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </TabPanel>
      </Container>
    </Box>
  );
};

export default ResearchPage; 
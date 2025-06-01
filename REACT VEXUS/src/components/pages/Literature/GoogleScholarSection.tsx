import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Link,
  CircularProgress,
  Alert,
  Button,
  useTheme,
  useMediaQuery,
  Pagination,
} from '@mui/material';
import {
  Launch,
  Refresh,
  School,
  FileCopy,
} from '@mui/icons-material';
import { colorTokens } from '../../../design-system/tokens';

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

const GoogleScholarSection: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [results, setResults] = useState<GoogleScholarResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchInfo, setSearchInfo] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  // Use backend API endpoint instead of direct SerpAPI call
  const getApiBaseUrl = () => {
    if (import.meta.env.PROD) {
      return '';  // Use relative path in production (empty string for same domain)
    }
    return import.meta.env.VITE_API_URL || 'http://localhost:3001';
  };
  
  const API_BASE_URL = getApiBaseUrl();

  const resultsPerPage = 10;

  const fetchVEXUSArticles = async (page: number = 1) => {
    setLoading(true);
    setError(null);

    try {
      const start = (page - 1) * resultsPerPage;
      const query = 'VEXUS "venous excess ultrasound" OR "venous excess ultrasonography"';
      
      const response = await fetch(
        `${API_BASE_URL}/api/scholar/search?q=${encodeURIComponent(query)}&start=${start}&num=${resultsPerPage}`
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
        throw new Error('No results found in API response');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch articles');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVEXUSArticles(currentPage);
  }, [currentPage]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const extractYear = (summary: string): string => {
    const yearMatch = summary.match(/\b(19|20)\d{2}\b/);
    return yearMatch ? yearMatch[0] : 'N/A';
  };

  const extractAuthors = (summary: string): string => {
    const parts = summary.split(' - ');
    return parts[0] || 'Unknown';
  };

  if (loading && results.length === 0) {
    return (
      <Card elevation={1}>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <CircularProgress sx={{ mb: 2 }} />
          <Typography variant="h6">Fetching latest VEXUS research from Google Scholar...</Typography>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card elevation={1}>
        <CardContent>
          <Alert 
            severity="error" 
            sx={{ mb: 2 }}
            action={
              <Button 
                color="inherit" 
                size="small" 
                onClick={() => fetchVEXUSArticles(currentPage)}
                startIcon={<Refresh />}
              >
                Retry
              </Button>
            }
          >
            <Typography variant="body2">
              <strong>Unable to fetch Google Scholar results:</strong> {error}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Please ensure the backend server is running and configured properly.
            </Typography>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const renderMobileResults = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {results.map((result) => (
        <Card key={result.position} elevation={1}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Chip label={`#${result.position + (currentPage - 1) * resultsPerPage}`} size="small" color="secondary" />
              {result.publication_info && (
                <Chip 
                  label={extractYear(result.publication_info.summary)} 
                  size="small" 
                  variant="outlined" 
                />
              )}
            </Box>
            
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
              {result.title}
            </Typography>
            
            {result.publication_info && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {extractAuthors(result.publication_info.summary)}
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
              {result.inline_links?.versions && (
                <Chip 
                  label={`${result.inline_links.versions.total} versions`} 
                  size="small" 
                  variant="outlined"
                />
              )}
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
              {result.link && (
                <Link
                  href={result.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                >
                  <Launch fontSize="small" />
                  View Article
                </Link>
              )}
              {result.resources && result.resources.length > 0 && (
                <Link
                  href={result.resources[0].link}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                >
                  <FileCopy fontSize="small" />
                  {result.resources[0].file_format}
                </Link>
              )}
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );

  const renderDesktopResults = () => (
    <TableContainer component={Paper} elevation={0}>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: 'grey.50' }}>
            <TableCell sx={{ fontWeight: 'bold', width: '5%' }}>#</TableCell>
            <TableCell sx={{ fontWeight: 'bold', width: '35%' }}>Title & Authors</TableCell>
            <TableCell sx={{ fontWeight: 'bold', width: '35%' }}>Abstract/Summary</TableCell>
            <TableCell sx={{ fontWeight: 'bold', width: '15%' }}>Citations & Metrics</TableCell>
            <TableCell sx={{ fontWeight: 'bold', width: '10%' }}>Access</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {results.map((result) => (
            <TableRow key={result.position} hover>
              <TableCell>
                <Chip 
                  label={result.position + (currentPage - 1) * resultsPerPage} 
                  size="small" 
                  color="secondary" 
                />
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                    {result.title}
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
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  {result.inline_links?.cited_by && (
                    <Chip 
                      label={`${result.inline_links.cited_by.total} citations`} 
                      size="small" 
                      color="primary"
                      variant="outlined"
                    />
                  )}
                  {result.inline_links?.versions && (
                    <Chip 
                      label={`${result.inline_links.versions.total} versions`} 
                      size="small" 
                      variant="outlined"
                    />
                  )}
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {result.link && (
                    <Link
                      href={result.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                    >
                      <Launch fontSize="small" />
                      View
                    </Link>
                  )}
                  {result.resources && result.resources.length > 0 && (
                    <Link
                      href={result.resources[0].link}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                    >
                      <FileCopy fontSize="small" />
                      {result.resources[0].file_format}
                    </Link>
                  )}
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const maxPages = Math.ceil(totalResults / resultsPerPage);

  return (
    <Card elevation={1} sx={{ mt: 4 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <School sx={{ fontSize: 40, color: 'secondary.main', mr: 2 }} />
          <Box>
            <Typography variant="h5" sx={{ color: colorTokens.primary[500], fontWeight: 'bold' }}>
              Live Google Scholar Results
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Real-time search results for VEXUS research from Google Scholar
            </Typography>
            {searchInfo && (
              <Typography variant="caption" color="text.secondary">
                Showing results for: "{searchInfo.query_displayed}" 
                ({searchInfo.total_results?.toLocaleString()} total results)
              </Typography>
            )}
          </Box>
          <Box sx={{ ml: 'auto' }}>
            <Button
              startIcon={loading ? <CircularProgress size={16} /> : <Refresh />}
              onClick={() => fetchVEXUSArticles(currentPage)}
              disabled={loading}
              variant="outlined"
              size="small"
            >
              Refresh
            </Button>
          </Box>
        </Box>

        {results.length > 0 ? (
          <>
            {isMobile ? renderMobileResults() : renderDesktopResults()}
            
            {maxPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Pagination
                  count={Math.min(maxPages, 10)} // Limit to 10 pages for performance
                  page={currentPage}
                  onChange={handlePageChange}
                  color="secondary"
                  disabled={loading}
                />
              </Box>
            )}
          </>
        ) : (
          <Alert severity="info">
            No VEXUS articles found in current search. Try refreshing or check back later.
          </Alert>
        )}

        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="body2">
            <strong>Note:</strong> These results are fetched live from Google Scholar and may include 
            preprints, conference abstracts, and non-peer-reviewed content. Please verify the 
            publication status before citing in academic work.
          </Typography>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default GoogleScholarSection; 
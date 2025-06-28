import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Link,
  CircularProgress,
  Alert,
  Collapse,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar,
} from '@mui/material';
import {
  School,
  ExpandMore,
  Launch,
  Person,
} from '@mui/icons-material';

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
  };
}

interface GoogleScholarResponse {
  organic_results: GoogleScholarResult[];
  search_information?: {
    total_results: number;
    query_displayed: string;
  };
}

interface FacultyResearchCardProps {
  facultyId: string;
  facultyName: string;
  maxResults?: number;
  compact?: boolean;
}

const FacultyResearchCard: React.FC<FacultyResearchCardProps> = ({
  facultyId,
  facultyName,
  maxResults = 3,
  compact = true
}) => {
  const [results, setResults] = useState<GoogleScholarResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [totalResults, setTotalResults] = useState(0);

  const getApiBaseUrl = () => {
    if (import.meta.env.PROD) {
      return '';
    }
    return import.meta.env.VITE_API_URL || 'http://localhost:4001';
  };
  
  const API_BASE_URL = getApiBaseUrl();

  const fetchFacultyResearch = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/faculty/${facultyId}/research?limit=${maxResults}`
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `API request failed: ${response.status}`);
      }

      const data: GoogleScholarResponse = await response.json();
      
      if (data.organic_results) {
        setResults(data.organic_results);
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
    fetchFacultyResearch();
  }, [facultyId]);

  const extractYear = (summary: string): string => {
    const yearMatch = summary.match(/\b(19|20)\d{2}\b/);
    return yearMatch ? yearMatch[0] : '';
  };

  if (loading) {
    return (
      <Card elevation={1} sx={{ mt: 2 }}>
        <CardContent sx={{ textAlign: 'center', py: 2 }}>
          <CircularProgress size={20} sx={{ mb: 1 }} />
          <Typography variant="caption" color="text.secondary">
            Loading research...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (error && !compact) {
    return (
      <Card elevation={1} sx={{ mt: 2 }}>
        <CardContent>
          <Alert severity="warning" sx={{ py: 1 }}>
            <Typography variant="caption">
              Research data temporarily unavailable
            </Typography>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (results.length === 0 && !error) {
    return null; // Don't show anything if no results and no error
  }

  if (compact && results.length > 0) {
    return (
      <Card 
        elevation={1} 
        sx={{ 
          mt: 2, 
          bgcolor: 'grey.50',
          border: '1px solid',
          borderColor: 'grey.200'
        }}
      >
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
            <School sx={{ fontSize: 16, color: 'primary.main', mr: 1 }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Recent Publications
            </Typography>
            <Chip 
              label={totalResults || results.length} 
              size="small" 
              color="primary"
              sx={{ ml: 'auto', height: 20, fontSize: '0.7rem' }}
            />
          </Box>

          <List dense sx={{ p: 0 }}>
            {results.slice(0, 2).map((result) => (
              <React.Fragment key={result.position}>
                <ListItem sx={{ px: 0, py: 0.5 }}>
                  <ListItemText
                    primary={
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          fontWeight: 500,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          lineHeight: 1.2,
                          mb: 0.5
                        }}
                      >
                        {result.title}
                      </Typography>
                    }
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {result.publication_info && (
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                            {extractYear(result.publication_info.summary)}
                          </Typography>
                        )}
                        {result.inline_links?.cited_by && (
                          <Chip 
                            label={`${result.inline_links.cited_by.total} citations`}
                            size="small"
                            variant="outlined"
                            sx={{ height: 16, fontSize: '0.6rem' }}
                          />
                        )}
                        {result.link && (
                          <Link
                            href={result.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ 
                              display: 'flex', 
                              alignItems: 'center',
                              fontSize: '0.7rem',
                              textDecoration: 'none'
                            }}
                          >
                            <Launch sx={{ fontSize: 12 }} />
                          </Link>
                        )}
                      </Box>
                    }
                  />
                </ListItem>
                <Divider sx={{ my: 0.5 }} />
              </React.Fragment>
            ))}
          </List>

          {results.length > 2 && (
            <Button
              size="small"
              onClick={() => setExpanded(!expanded)}
              endIcon={
                <ExpandMore 
                  sx={{ 
                    transform: expanded ? 'rotate(180deg)' : 'none',
                    transition: '0.3s'
                  }} 
                />
              }
              sx={{ mt: 1, fontSize: '0.7rem' }}
            >
              {expanded ? 'Show Less' : `Show ${results.length - 2} More`}
            </Button>
          )}

          <Collapse in={expanded}>
            <List dense sx={{ p: 0, mt: 1 }}>
              {results.slice(2).map((result) => (
                <React.Fragment key={result.position}>
                  <Divider sx={{ my: 0.5 }} />
                  <ListItem sx={{ px: 0, py: 0.5 }}>
                    <ListItemText
                      primary={
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            fontWeight: 500,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            lineHeight: 1.2,
                            mb: 0.5
                          }}
                        >
                          {result.title}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {result.publication_info && (
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                              {extractYear(result.publication_info.summary)}
                            </Typography>
                          )}
                          {result.inline_links?.cited_by && (
                            <Chip 
                              label={`${result.inline_links.cited_by.total} citations`}
                              size="small"
                              variant="outlined"
                              sx={{ height: 16, fontSize: '0.6rem' }}
                            />
                          )}
                          {result.link && (
                            <Link
                              href={result.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                fontSize: '0.7rem',
                                textDecoration: 'none'
                              }}
                            >
                              <Launch sx={{ fontSize: 12 }} />
                            </Link>
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          </Collapse>
        </CardContent>
      </Card>
    );
  }

  // Full detailed view for research page
  return (
    <Card elevation={2} sx={{ mt: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 40, height: 40 }}>
            <Person />
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {facultyName} - Research Publications
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {totalResults || results.length} publications found
            </Typography>
          </Box>
          <School sx={{ fontSize: 32, color: 'primary.main', ml: 'auto' }} />
        </Box>

        <List>
          {results.map((result) => (
            <React.Fragment key={result.position}>
              <ListItem sx={{ px: 0, alignItems: 'flex-start' }}>
                <Box sx={{ width: '100%' }}>
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
                      {result.snippet.length > 200 
                        ? `${result.snippet.substring(0, 200)}...` 
                        : result.snippet
                      }
                    </Typography>
                  )}
                  
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                    {result.inline_links?.cited_by && (
                      <Chip 
                        label={`${result.inline_links.cited_by.total} citations`} 
                        size="small" 
                        color="primary"
                        variant="outlined"
                      />
                    )}
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
                  </Box>
                </Box>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default FacultyResearchCard; 
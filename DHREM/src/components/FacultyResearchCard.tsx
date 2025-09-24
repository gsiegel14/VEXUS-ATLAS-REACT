import React, { useState, useEffect, useMemo } from 'react';
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
import type { SxProps, Theme } from '@mui/material/styles';
import {
  School,
  ExpandMore,
  Launch,
} from '@mui/icons-material';
import { researchQueue } from '../services/researchQueue';
import { facultyPublications } from '../data/facultyPublications';
import { GoogleScholarResult, GoogleScholarResponse } from '../types/googleScholar';

interface FacultyResearchCardProps {
  facultyId: string;
  facultyName: string;
  facultyTitle?: string;
  imageUrl?: string;
  compact?: boolean;
  hideHeader?: boolean;
  cardSx?: SxProps<Theme>;
  showAllByDefault?: boolean;
}

const FacultyResearchCard: React.FC<FacultyResearchCardProps> = ({
  facultyId,
  facultyName,
  facultyTitle,
  imageUrl,
  compact = true,
  hideHeader = false,
  cardSx,
  showAllByDefault = false
}) => {
  const [results, setResults] = useState<GoogleScholarResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<boolean>(!compact && showAllByDefault);
  const [totalResults, setTotalResults] = useState(0);

  const staticPublications = useMemo(() => {
    const entries = facultyPublications[facultyId];
    if (!entries || entries.length === 0) {
      return null;
    }
    return entries.map((entry, index) => ({
      ...entry,
      position: entry.position || index + 1,
    }));
  }, [facultyId]);

  const getApiBaseUrl = () => {
    if (import.meta.env.PROD) {
      return '';
    }
    return import.meta.env.VITE_API_URL || 'http://localhost:4001';
  };
  
  const API_BASE_URL = getApiBaseUrl();

  const fetchFacultyResearch = async () => {
    if (staticPublications) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Use the queue to manage rate limiting
      const data: GoogleScholarResponse = await researchQueue.addToQueue(async () => {
        const response = await fetch(
          `${API_BASE_URL}/api/faculty/${facultyId}/research?limit=200&profilesOnly=true`
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          throw new Error(errorData.error || `API request failed: ${response.status}`);
        }

        return response.json();
      });
      
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
    if (staticPublications) {
      setResults(staticPublications);
      setTotalResults(staticPublications.length);
      setError(null);
      setLoading(false);
      return;
    }

    if (!compact) {
      fetchFacultyResearch();
    } else {
      setResults([]);
      setTotalResults(0);
    }
  }, [facultyId, compact, staticPublications]);

  useEffect(() => {
    if (!compact) {
      setExpanded(showAllByDefault);
    }
  }, [showAllByDefault, compact]);

  const extractYear = (summary: string): string => {
    const yearMatch = summary.match(/\b(19|20)\d{2}\b/);
    return yearMatch ? yearMatch[0] : '';
  };

  const getInitials = (name: string): string => {
    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length === 0) {
      return '';
    }
    const initials = parts.slice(0, 2).map((part) => part.charAt(0).toUpperCase()).join('');
    return initials;
  };

  if (loading) {
    return (
      <Card elevation={1} sx={{ mt: 2, height: '100%', display: 'flex', flexDirection: 'column', ...(cardSx || {}) }}>
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
      <Card elevation={1} sx={{ mt: 2, height: '100%', display: 'flex', flexDirection: 'column', ...(cardSx || {}) }}>
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
    if (compact) {
      return null;
    }

    return (
      <Card
        elevation={2}
        sx={{ mt: 3, height: '100%', display: 'flex', flexDirection: 'column', ...(cardSx || {}) }}
      >
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          {hideHeader ? (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Research profile coming soon
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
              <Avatar
                src={imageUrl}
                alt={facultyName}
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: imageUrl ? 'grey.100' : 'primary.main',
                  color: imageUrl ? 'inherit' : 'common.white',
                  fontWeight: 600,
                  fontSize: '2rem',
                  mb: 1.5,
                }}
              >
                {imageUrl ? null : getInitials(facultyName)}
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {facultyName}
              </Typography>
              {facultyTitle && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  {facultyTitle}
                </Typography>
              )}
            </Box>
          )}

          <Typography variant="body1" color="text.secondary">
            Research profile is being set up. Please check back soon.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (compact && results.length > 0) {
    return (
      <Card 
        elevation={1} 
        sx={{ 
          mt: 2, 
          bgcolor: 'grey.50',
          border: '1px solid',
          borderColor: 'grey.200',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          ...(cardSx || {})
        }}
      >
        <CardContent sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
            <Avatar
              src={imageUrl}
              alt={facultyName}
              sx={{
                width: 42,
                height: 42,
                bgcolor: imageUrl ? 'grey.100' : 'primary.main',
                color: imageUrl ? 'inherit' : 'common.white',
                fontWeight: 600,
                mr: 1.5
              }}
            >
              {imageUrl ? null : getInitials(facultyName)}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                {facultyName}
              </Typography>
              {facultyTitle && (
                <Typography variant="caption" color="text.secondary">
                  {facultyTitle}
                </Typography>
              )}
            </Box>
          </Box>

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
                    secondaryTypographyProps={{ component: 'span' }}
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
                      secondaryTypographyProps={{ component: 'span' }}
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
  const visibleResults = expanded ? results : results.slice(0, 5);
  return (
    <Card elevation={2} sx={{ mt: 3, height: '100%', display: 'flex', flexDirection: 'column', ...(cardSx || {}) }}>
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {hideHeader ? (
          <Box sx={{ mb: 1.5 }}>
            <Typography variant="body2" color="text.secondary">
              {totalResults || results.length} publications found
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar
              src={imageUrl}
              alt={facultyName}
              sx={{
                width: 120,
                height: 120,
                bgcolor: imageUrl ? 'grey.100' : 'primary.main',
                color: imageUrl ? 'inherit' : 'common.white',
                fontWeight: 600,
                fontSize: '2rem',
                mr: 3
              }}
            >
              {imageUrl ? null : getInitials(facultyName)}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {facultyName}
              </Typography>
              {facultyTitle && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  {facultyTitle}
                </Typography>
              )}
              <Typography variant="body2" color="text.secondary">
                {totalResults || results.length} publications found
              </Typography>
            </Box>
            <School sx={{ fontSize: 32, color: 'primary.main', ml: 'auto' }} />
          </Box>
        )}

        <List sx={{ flexGrow: 1 }}>
          {visibleResults.map((result) => (
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

        {results.length > 5 && (
          <Button
            size="small"
            color="primary"
            onClick={() => setExpanded((prev) => !prev)}
            endIcon={
              <ExpandMore 
                sx={{ 
                  transform: expanded ? 'rotate(180deg)' : 'none',
                  transition: '0.3s'
                }} 
              />
            }
            sx={{ mt: 2, alignSelf: 'flex-start', fontWeight: 600 }}
          >
            {expanded ? 'Show Fewer Publications' : `View All ${results.length} Publications`}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default FacultyResearchCard; 

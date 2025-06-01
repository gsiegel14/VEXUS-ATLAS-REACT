import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Collapse,
  Button,
  Divider,
  Link as MuiLink
} from '@mui/material';
import {
  Launch,
  ExpandMore,
  FileCopy,
  Share
} from '@mui/icons-material';
import { Publication } from '../../config/publicationsConfig';

interface PublicationCardProps {
  publication: Publication;
}

const PublicationCard: React.FC<PublicationCardProps> = ({ publication }) => {
  const [expanded, setExpanded] = useState(false);

  const handleCopyDOI = () => {
    if (publication.doi) {
      navigator.clipboard.writeText(publication.doi);
    } else if (publication.url) {
      navigator.clipboard.writeText(publication.url);
    }
  };

  const handleCopyCitation = () => {
    const citation = `${publication.authors} (${publication.year}). ${publication.title}. ${publication.journal}.`;
    navigator.clipboard.writeText(citation);
  };

  const getJournalColor = (journal: string) => {
    const colors: { [key: string]: 'error' | 'primary' | 'success' | 'warning' | 'default' } = {
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
            <IconButton 
              size="small"
              onClick={handleCopyCitation}
              title="Copy Citation"
            >
              <FileCopy />
            </IconButton>
            
            <IconButton 
              size="small"
              title="Share"
            >
              <Share />
            </IconButton>
          </Box>
        </Box>

        {/* Abstract/Description */}
        <Typography variant="body1" paragraph sx={{ lineHeight: 1.6 }}>
          {publication.abstract}
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
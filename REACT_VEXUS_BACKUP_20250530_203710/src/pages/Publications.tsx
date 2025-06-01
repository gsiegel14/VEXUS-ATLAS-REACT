import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip
} from '@mui/material';
import { Article } from '@mui/icons-material';
import BaseLayout from '../components/templates/BaseLayout';
import PublicationCard from '../components/publications/PublicationCard';
import PublicationFilters from '../components/publications/PublicationFilters';
import { usePublicationsData } from '../hooks/usePublicationsData';
import { usePublicationFilters } from '../hooks/usePublicationFilters';

const Publications: React.FC = () => {
  const { publications, loading, error } = usePublicationsData();
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
    }, {} as { [key: number]: typeof filteredPublications });
    
    // Sort years in descending order
    return Object.keys(grouped)
      .sort((a, b) => parseInt(b) - parseInt(a))
      .reduce((acc, year) => {
        acc[parseInt(year)] = grouped[parseInt(year)].sort((a, b) => a.title.localeCompare(b.title));
        return acc;
      }, {} as { [key: number]: typeof filteredPublications });
  }, [filteredPublications]);

  if (loading) {
    return (
      <BaseLayout pageTitle="VEXUS Publications">
        <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
          <Typography variant="h4" sx={{ textAlign: 'center' }}>
            Loading publications...
          </Typography>
        </Container>
      </BaseLayout>
    );
  }

  if (error) {
    return (
      <BaseLayout pageTitle="VEXUS Publications">
        <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
          <Typography variant="h4" color="error" sx={{ textAlign: 'center' }}>
            Error loading publications: {error}
          </Typography>
        </Container>
      </BaseLayout>
    );
  }

  return (
    <>
      <Helmet>
        <title>VEXUS Publications | Research & Scientific Papers</title>
        <meta 
          name="description" 
          content="Browse our collection of research publications and scientific papers on VEXUS (Venous Excess UltraSound) methodology, applications, and clinical significance." 
        />
        <meta 
          name="keywords" 
          content="VEXUS, publications, research, scientific papers, venous excess, ultrasound, medical literature" 
        />
        
        {/* OpenGraph Meta Tags */}
        <meta property="og:title" content="VEXUS Publications | Research & Scientific Papers" />
        <meta 
          property="og:description" 
          content="Browse our collection of research publications and scientific papers on VEXUS (Venous Excess UltraSound) methodology, applications, and clinical significance." 
        />
        <meta property="og:image" content="https://yourdomain.com/images/vexus-publications-preview.jpg" />
        <meta property="og:url" content="https://yourdomain.com/publications" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="VEXUS ATLAS" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="VEXUS Publications | Research & Scientific Papers" />
        <meta 
          name="twitter:description" 
          content="Browse our collection of research publications and scientific papers on VEXUS (Venous Excess UltraSound) methodology, applications, and clinical significance." 
        />
        <meta name="twitter:image" content="https://yourdomain.com/images/vexus-publications-preview.jpg" />
      </Helmet>

      <BaseLayout 
        pageTitle="VEXUS Publications"
        containerMaxWidth="xl"
      >
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
        </Container>
      </BaseLayout>
    </>
  );
};

export default Publications; 
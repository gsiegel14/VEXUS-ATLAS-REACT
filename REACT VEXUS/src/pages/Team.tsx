import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box
} from '@mui/material';
import { Groups } from '@mui/icons-material';
import BaseLayout from '../components/templates/BaseLayout';
import TeamSection from '../components/team/TeamSection';
import { useTeamData } from '../hooks/useTeamData';

const Team: React.FC = () => {
  const { teamMembers, loading, error } = useTeamData();

  const sections = useMemo(() => [
    {
      id: 'faculty-members',
      title: 'Faculty Members',
      description: 'Our distinguished faculty members who lead clinical research and provide expertise in venous congestion assessment and ultrasound medicine.',
      members: teamMembers.filter(member => member.type === 'core')
    },
    {
      id: 'current-contributors',
      title: 'Current Contributors',
      description: 'Our current contributors who are advancing their expertise in ultrasound medicine and contributing to VEXUS research and education.',
      members: teamMembers.filter(member => member.type === 'contributor')
    }
  ], [teamMembers]);

  if (loading) {
    return (
      <BaseLayout pageTitle="Our Team">
        <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
          <Typography variant="h4" sx={{ textAlign: 'center' }}>
            Loading team information...
          </Typography>
        </Container>
      </BaseLayout>
    );
  }

  if (error) {
    return (
      <BaseLayout pageTitle="Our Team">
        <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
          <Typography variant="h4" color="error" sx={{ textAlign: 'center' }}>
            Error loading team information: {error}
          </Typography>
        </Container>
      </BaseLayout>
    );
  }

  return (
    <>
      <Helmet>
        <title>Our Team - VEXUS ATLAS</title>
        <meta 
          name="description" 
          content="Meet the VEXUS ATLAS team of experts, researchers, and medical professionals dedicated to advancing venous excess ultrasound techniques and education." 
        />
        <meta 
          name="keywords" 
          content="VEXUS, team, experts, researchers, medical professionals, venous excess, ultrasound" 
        />
        
        {/* OpenGraph Meta Tags */}
        <meta property="og:title" content="Our Team | VEXUS ATLAS Experts & Researchers" />
        <meta 
          property="og:description" 
          content="Meet the VEXUS ATLAS team of experts, researchers, and medical professionals dedicated to advancing venous excess ultrasound techniques and education." 
        />
        <meta property="og:image" content="https://yourdomain.com/images/vexus-team-preview.jpg" />
        <meta property="og:url" content="https://yourdomain.com/team" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="VEXUS ATLAS" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Our Team | VEXUS ATLAS Experts & Researchers" />
        <meta 
          name="twitter:description" 
          content="Meet the VEXUS ATLAS team of experts, researchers, and medical professionals dedicated to advancing venous excess ultrasound techniques and education." 
        />
        <meta name="twitter:image" content="https://yourdomain.com/images/vexus-team-preview.jpg" />
      </Helmet>

      <BaseLayout 
        pageTitle="Our Team"
        containerMaxWidth="xl"
      >
        <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
          {/* Denver Health Ultrasound Logo */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            mb: 4,
            p: 3,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 1
          }}>
            <img 
              src="/images/logos/denver-health-ultrasound.png" 
              alt="Denver Health Ultrasound" 
              style={{ 
                maxHeight: '120px',
                maxWidth: '100%',
                height: 'auto',
                width: 'auto'
              }} 
            />
          </Box>

          {/* Header */}
          <Card elevation={2} sx={{ mb: 4 }}>
            <CardContent sx={{ textAlign: 'center', p: { xs: 2, md: 4 } }}>
              <Groups sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Our Team
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
                Meet the dedicated professionals behind VEXUS ATLAS
              </Typography>
            </CardContent>
          </Card>

          {/* Team Sections */}
          {sections.map((section, index) => (
            <TeamSection
              key={section.id}
              section={section}
              index={index}
            />
          ))}
        </Container>
      </BaseLayout>
    </>
  );
};

export default Team; 
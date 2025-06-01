import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import TeamMemberCard from './TeamMemberCard';
import { TeamMember } from '../../config/teamConfig';

interface TeamSectionProps {
  section: {
    id: string;
    title: string;
    description: string;
    members: TeamMember[];
  };
  index: number;
}

const TeamSection: React.FC<TeamSectionProps> = ({ section, index }) => {
  return (
    <Box sx={{ mb: 6 }}>
      {/* Section Header */}
      <Card elevation={1} sx={{ mb: 4, bgcolor: index % 2 === 0 ? 'primary.main' : 'grey.50' }}>
        <CardContent sx={{ 
          textAlign: 'center', 
          p: { xs: 3, md: 4 },
          color: index % 2 === 0 ? 'primary.contrastText' : 'text.primary'
        }}>
          <Typography 
            variant="h4" 
            component="h2" 
            gutterBottom
            sx={{ 
              fontWeight: 'bold',
              fontSize: { xs: '1.75rem', md: '2.125rem' }
            }}
          >
            {section.title}
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              maxWidth: 800, 
              mx: 'auto',
              lineHeight: 1.6,
              opacity: index % 2 === 0 ? 0.9 : 0.8
            }}
          >
            {section.description}
          </Typography>
        </CardContent>
      </Card>

      {/* Team Members Grid */}
      <Grid container spacing={{ xs: 2, md: 3 }}>
        {section.members.map((member) => (
          <Grid 
            item 
            xs={12} 
            sm={6} 
            md={section.id === 'contributors' ? 4 : 6}
            lg={section.id === 'contributors' ? 3 : 4}
            key={member.id}
          >
            <TeamMemberCard 
              member={member} 
              variant={section.id === 'contributors' ? 'compact' : 'standard'}
            />
          </Grid>
        ))}
      </Grid>

      {/* Empty State */}
      {section.members.length === 0 && (
        <Card elevation={1} sx={{ textAlign: 'center', py: 6 }}>
          <CardContent>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No {section.title.toLowerCase()} members to display
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Check back soon for updates to our team!
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default TeamSection; 
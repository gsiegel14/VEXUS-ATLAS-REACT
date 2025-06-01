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
  const isEven = index % 2 === 0;
  
  return (
    <Box sx={{ mb: 6 }}>
      {/* Section Header */}
      <Card 
        elevation={2} 
        sx={{ 
          mb: 4, 
          bgcolor: isEven ? '#f8f9fa' : '#ffffff',
          border: isEven ? '1px solid #e9ecef' : '1px solid #dee2e6'
        }}
      >
        <CardContent sx={{ 
          textAlign: 'center', 
          p: { xs: 3, md: 4 },
          bgcolor: isEven ? '#f8f9fa' : '#ffffff'
        }}>
          <Typography 
            variant="h4" 
            component="h2" 
            gutterBottom
            sx={{ 
              fontWeight: 'bold',
              fontSize: { xs: '1.75rem', md: '2.125rem' },
              color: '#2c3e50'
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
              color: '#6c757d'
            }}
          >
            {section.description}
          </Typography>
        </CardContent>
      </Card>

      {/* Team Members Grid */}
      <Box sx={{ 
        bgcolor: isEven ? '#ffffff' : '#f8f9fa',
        borderRadius: 2,
        p: { xs: 2, md: 3 },
        border: isEven ? '1px solid #dee2e6' : '1px solid #e9ecef'
      }}>
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
      </Box>

      {/* Empty State */}
      {section.members.length === 0 && (
        <Card elevation={1} sx={{ 
          textAlign: 'center', 
          py: 6,
          bgcolor: '#f8f9fa',
          border: '1px solid #e9ecef'
        }}>
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
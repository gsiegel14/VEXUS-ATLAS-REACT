import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  IconButton,
  Collapse,
  Button,
  Divider,
  Avatar
} from '@mui/material';
import {
  ExpandMore,
  LinkedIn,
  Email,
  School,
  Work,
  EmojiEvents
} from '@mui/icons-material';
import { TeamMember } from '../../config/teamConfig';

interface TeamMemberCardProps {
  member: TeamMember;
  variant?: 'standard' | 'compact';
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member, variant = 'standard' }) => {
  const [expanded, setExpanded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const isCompact = variant === 'compact';

  // Generate initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Card 
      elevation={2}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4
        }
      }}
    >
      {/* Member Image */}
      <Box sx={{ position: 'relative', bgcolor: 'grey.100' }}>
        {!imageError ? (
          <CardMedia
            component="img"
            image={member.image}
            alt={member.name}
            onError={handleImageError}
            sx={{
              height: isCompact ? 200 : 300,
              objectFit: 'cover',
              objectPosition: 'center top'
            }}
          />
        ) : (
          <Box
            sx={{
              height: isCompact ? 200 : 300,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'primary.main'
            }}
          >
            <Avatar
              sx={{
                width: isCompact ? 80 : 120,
                height: isCompact ? 80 : 120,
                fontSize: isCompact ? '1.5rem' : '2rem',
                bgcolor: 'primary.dark',
                color: 'white'
              }}
            >
              {getInitials(member.name)}
            </Avatar>
          </Box>
        )}
        {member.featured && (
          <Chip
            label="Featured"
            color="primary"
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: 'primary.main',
              color: 'white'
            }}
          />
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        {/* Basic Info */}
        <Typography 
          variant="h6" 
          component="h3"
          gutterBottom
          sx={{ 
            fontWeight: 'bold',
            color: 'primary.main',
            fontSize: isCompact ? '1.1rem' : '1.25rem'
          }}
        >
          {member.name}
        </Typography>

        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ 
            fontWeight: 'medium',
            mb: 2,
            fontSize: isCompact ? '0.875rem' : '1rem'
          }}
        >
          {member.role}
        </Typography>

        {/* Specialties/Expertise */}
        {member.specialties && member.specialties.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {member.specialties.slice(0, isCompact ? 2 : 3).map((specialty, index) => (
                <Chip 
                  key={index}
                  label={specialty}
                  size="small"
                  variant="outlined"
                  color="primary"
                />
              ))}
              {member.specialties.length > (isCompact ? 2 : 3) && (
                <Chip 
                  label={`+${member.specialties.length - (isCompact ? 2 : 3)}`}
                  size="small"
                  variant="outlined"
                />
              )}
            </Box>
          </Box>
        )}

        {/* Short Bio */}
        <Typography 
          variant="body2" 
          sx={{ 
            lineHeight: 1.6,
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: isCompact ? 3 : 4,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {member.shortBio || member.fullBio}
        </Typography>

        {/* Contact/Links */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          {member.email && (
            <IconButton 
              size="small" 
              href={`mailto:${member.email}`}
              aria-label={`Email ${member.name}`}
            >
              <Email />
            </IconButton>
          )}
          {member.linkedin && (
            <IconButton 
              size="small"
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${member.name} on LinkedIn`}
            >
              <LinkedIn />
            </IconButton>
          )}
        </Box>

        {/* Expandable Details */}
        {(member.education || member.achievements || member.fullBio) && (
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
              fullWidth
            >
              {expanded ? 'Show Less' : 'Learn More'}
            </Button>

            <Collapse in={expanded}>
              <Box sx={{ mt: 2 }}>
                {/* Education */}
                {member.education && (
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <School fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        Education
                      </Typography>
                    </Box>
                    {member.education.map((edu, index) => (
                      <Typography key={index} variant="body2" sx={{ mb: 0.5, ml: 3 }}>
                        <strong>{edu.degree}</strong> - {edu.institution} ({edu.year})
                      </Typography>
                    ))}
                  </Box>
                )}

                {/* Professional Experience */}
                {member.experience && (
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Work fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        Experience
                      </Typography>
                    </Box>
                    {member.experience.map((exp, index) => (
                      <Typography key={index} variant="body2" sx={{ mb: 0.5, ml: 3 }}>
                        <strong>{exp.position}</strong> at {exp.organization}
                      </Typography>
                    ))}
                  </Box>
                )}

                {/* Achievements/Recognition */}
                {member.achievements && (
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <EmojiEvents fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        Recognition
                      </Typography>
                    </Box>
                    {member.achievements.map((achievement, index) => (
                      <Typography key={index} variant="body2" sx={{ mb: 0.5, ml: 3 }}>
                        • {achievement}
                      </Typography>
                    ))}
                  </Box>
                )}

                {/* Full Bio */}
                {member.fullBio && member.fullBio !== member.shortBio && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                      {member.fullBio}
                    </Typography>
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

export default TeamMemberCard; 
# Team Page Conversion Outline

## Overview
Convert `team.astro` to a React component with comprehensive team member profiles, contributor sections, image galleries, and interactive member cards using Material-UI components.

## Current Structure Analysis
- Team member profile cards with professional images
- Core team and contributors sections with distinct layouts
- Detailed member information including roles, education, and expertise
- Professional achievement highlights and credentials
- Image gallery integration with Fancybox lightboxes
- Mobile-responsive design with adaptive card layouts
- Professional networking links and contact information
- Biography sections with expandable content
- Recognition and award displays

## Comprehensive Conversion Framework

### 1. Main Component Architecture & MUI Integration
```jsx
// src/pages/Team.jsx
import React, { useState, useMemo } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
  Fab
} from '@mui/material';
import { Groups, PersonAdd } from '@mui/icons-material';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import TeamMemberCard from '../components/team/TeamMemberCard';
import TeamSection from '../components/team/TeamSection';
import JoinTeamForm from '../components/team/JoinTeamForm';
import { useTeamData } from '../hooks/useTeamData';
import { teamConfig } from '../config/teamConfig';

const Team = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [activeTab, setActiveTab] = useState(0);
  const [joinFormOpen, setJoinFormOpen] = useState(false);
  const { teamMembers, loading, error } = useTeamData();

  const sections = [
    {
      id: 'core-team',
      title: 'Our Team',
      description: 'VEXUS ATLAS is developed by a multidisciplinary team of medical professionals dedicated to improving patient care through innovative technology and clinical expertise in venous congestion assessment.',
      members: teamMembers.filter(member => member.type === 'core')
    },
    {
      id: 'contributors',
      title: 'Contributors',
      description: 'Our project benefits from the valuable contributions of these talented professionals who provide expertise and support in various capacities.',
      members: teamMembers.filter(member => member.type === 'contributor')
    }
  ];

  return (
    <Layout>
      <SEO 
        title="Our Team - VEXUS ATLAS"
        description="Meet the VEXUS ATLAS team of experts, researchers, and medical professionals dedicated to advancing venous excess ultrasound techniques and education."
        keywords="VEXUS, team, experts, researchers, medical professionals, venous excess, ultrasound"
        ogTitle="Our Team | VEXUS ATLAS Experts & Researchers"
        ogImage="https://yourdomain.com/images/vexus-team-preview.jpg"
        ogUrl="https://yourdomain.com/team"
      />
      
      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
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

        {/* Join Team Form */}
        <JoinTeamForm
          open={joinFormOpen}
          onClose={() => setJoinFormOpen(false)}
        />

        {/* Floating Action Button */}
        <Fab
          color="secondary"
          aria-label="join team"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={() => setJoinFormOpen(true)}
        >
          <PersonAdd />
        </Fab>
      </Container>
    </Layout>
  );
};

export default Team;
```

### 2. Team Member Card Component
```jsx
// src/components/team/TeamMemberCard.jsx
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  IconButton,
  Avatar,
  Collapse,
  Button,
  Link as MuiLink,
  Divider,
  useTheme
} from '@mui/material';
import {
  ExpandMore,
  LinkedIn,
  Email,
  School,
  Work,
  EmojiEvents
} from '@mui/icons-material';

const TeamMemberCard = ({ member, variant = 'standard' }) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  const isCompact = variant === 'compact';

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
        <CardMedia
          component="img"
          image={member.image}
          alt={member.name}
          sx={{
            height: isCompact ? 200 : 300,
            objectFit: 'cover',
            objectPosition: 'center top'
          }}
        />
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
          {member.shortBio || member.bio}
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
```

### 3. Team Section Component
```jsx
// src/components/team/TeamSection.jsx
import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery
} from '@mui/material';
import TeamMemberCard from './TeamMemberCard';

const TeamSection = ({ section, index }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
```

### 4. Join Team Form Component
```jsx
// src/components/team/JoinTeamForm.jsx
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box
} from '@mui/material';

const JoinTeamForm = ({ open, onClose }) => {
  const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const handleFormSubmit = async (data) => {
    try {
      // Handle form submission
      console.log('Form submitted:', data);
      reset();
      onClose();
    } catch (error) {
      console.error('Form submission failed:', error);
    }
  };

  const expertiseAreas = [
    'Critical Care Medicine',
    'Cardiology',
    'Emergency Medicine',
    'Ultrasound/Imaging',
    'Research & Development',
    'Software Development',
    'Medical Education',
    'Data Science',
    'Clinical Research',
    'Other'
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
          Join Our Team
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Interested in contributing to VEXUS ATLAS? We'd love to hear from you!
        </Typography>
      </DialogTitle>
      
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Grid container spacing={3}>
            {/* Personal Information */}
            <Grid item xs={12} md={6}>
              <Controller
                name="firstName"
                control={control}
                rules={{ required: 'First name is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="First Name"
                    fullWidth
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="lastName"
                control={control}
                rules={{ required: 'Last name is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Last Name"
                    fullWidth
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="email"
                control={control}
                rules={{ 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email"
                    type="email"
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="institution"
                control={control}
                rules={{ required: 'Institution is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Institution/Organization"
                    fullWidth
                    error={!!errors.institution}
                    helperText={errors.institution?.message}
                  />
                )}
              />
            </Grid>

            {/* Professional Information */}
            <Grid item xs={12} md={6}>
              <Controller
                name="title"
                control={control}
                rules={{ required: 'Professional title is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Professional Title"
                    fullWidth
                    error={!!errors.title}
                    helperText={errors.title?.message}
                    placeholder="e.g., MD, PhD, RN, etc."
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="expertise"
                control={control}
                rules={{ required: 'Area of expertise is required' }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.expertise}>
                    <InputLabel>Area of Expertise</InputLabel>
                    <Select {...field} label="Area of Expertise">
                      {expertiseAreas.map((area) => (
                        <MenuItem key={area} value={area}>
                          {area}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            {/* Interest and Experience */}
            <Grid item xs={12}>
              <Controller
                name="experience"
                control={control}
                rules={{ required: 'Experience description is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Relevant Experience"
                    multiline
                    rows={3}
                    fullWidth
                    error={!!errors.experience}
                    helperText={errors.experience?.message}
                    placeholder="Describe your relevant experience with VEXUS, ultrasound, or related fields..."
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="contribution"
                control={control}
                rules={{ required: 'Contribution description is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="How You'd Like to Contribute"
                    multiline
                    rows={3}
                    fullWidth
                    error={!!errors.contribution}
                    helperText={errors.contribution?.message}
                    placeholder="Tell us how you'd like to contribute to VEXUS ATLAS..."
                  />
                )}
              />
            </Grid>

            {/* Additional Information */}
            <Grid item xs={12}>
              <Controller
                name="additionalInfo"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Additional Information (Optional)"
                    multiline
                    rows={2}
                    fullWidth
                    placeholder="Any additional information you'd like to share..."
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={isSubmitting}
            size="large"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default JoinTeamForm;
```

### 5. State Management Hook

#### useTeamData Hook
```jsx
// src/hooks/useTeamData.js
import { useState, useEffect } from 'react';
import { teamService } from '../services/teamService';

export const useTeamData = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        setLoading(true);
        const data = await teamService.fetchTeamMembers();
        setTeamMembers(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        // Fallback to static data if service fails
        setTeamMembers(teamConfig.members);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, []);

  return {
    teamMembers,
    loading,
    error
  };
};
```

### 6. Configuration & Data Management

#### Team Configuration
```javascript
// src/config/teamConfig.js
export const teamConfig = {
  members: [
    {
      id: 'august-longino',
      name: 'August Longino, MD',
      role: 'Clinical Investigator & Project Lead',
      type: 'core',
      image: '/images/August Longino.jpg',
      email: 'alongino@example.com',
      linkedin: 'https://linkedin.com/in/august-longino',
      specialties: ['Critical Care Medicine', 'Point-of-Care Ultrasound', 'Venous Congestion'],
      shortBio: 'Expert in critical care medicine and point-of-care ultrasound, focusing on venous congestion assessment and its clinical applications in critical care settings.',
      fullBio: 'Dr. Longino is a leading expert in critical care medicine with extensive experience in point-of-care ultrasound. His research focuses on venous congestion assessment and the development of novel diagnostic techniques for critical care patients.',
      education: [
        {
          degree: 'MD',
          institution: 'University of Colorado School of Medicine',
          year: '2015'
        },
        {
          degree: 'Residency in Internal Medicine',
          institution: 'Denver Health Medical Center',
          year: '2018'
        },
        {
          degree: 'Fellowship in Critical Care Medicine',
          institution: 'Denver Health Medical Center',
          year: '2020'
        }
      ],
      experience: [
        {
          position: 'Attending Physician',
          organization: 'Denver Health Medical Center'
        }
      ],
      achievements: [
        'Board Certified in Internal Medicine and Critical Care Medicine',
        'Published researcher in venous congestion assessment',
        'Lead investigator for multiple VEXUS validation studies'
      ],
      featured: true
    },
    {
      id: 'gabriel-siegel',
      name: 'Gabriel Siegel, MD',
      role: 'VEXUS ATLAS Creator & Ultrasound Fellow',
      type: 'core',
      image: '/images/gabe siegel.jpg',
      specialties: ['Machine Learning', 'AI in Healthcare', 'Medical Imaging'],
      shortBio: 'Created the VEXUS ATLAS tool and specializes in machine learning and AI applications in healthcare, focusing on developing innovative solutions for medical imaging analysis and clinical decision support systems.',
      fullBio: 'Dr. Siegel is the creator of the VEXUS ATLAS platform and a specialist in applying machine learning and artificial intelligence to healthcare challenges. His work focuses on developing innovative solutions for medical imaging analysis and clinical decision support systems.',
      education: [
        {
          degree: 'MD',
          institution: 'University of Colorado School of Medicine',
          year: '2020'
        },
        {
          degree: 'Fellowship in Ultrasound Medicine',
          institution: 'Denver Health Medical Center',
          year: '2024'
        }
      ],
      achievements: [
        'Creator of VEXUS ATLAS platform',
        'Expert in AI applications for medical imaging',
        'Published researcher in machine learning for healthcare'
      ],
      featured: true
    },
    {
      id: 'matthew-riscinti',
      name: 'Matthew Riscinti, MD',
      role: 'Faculty Clinical Investigator',
      type: 'core',
      image: '/images/Riscinti Matthew D.jpg',
      specialties: ['Cardiovascular Medicine', 'Venous Thromboembolism', 'Critical Care Cardiology'],
      shortBio: 'Cardiovascular medicine specialist with expertise in venous thromboembolism and critical care cardiology, focusing on cardiovascular care and outcomes in critical illness.',
      education: [
        {
          degree: 'MD',
          institution: 'University of Colorado School of Medicine',
          year: '2016'
        },
        {
          degree: 'Fellowship in Cardiovascular Medicine',
          institution: 'University of Colorado Hospital',
          year: '2022'
        }
      ]
    },
    {
      id: 'ed-gill',
      name: 'Ed Gill, MD',
      role: 'Cardiology Professor & Clinical Expert',
      type: 'core',
      image: '/images/ED Gill.jpg',
      specialties: ['Echocardiography', 'Prosthetic Valve Evaluation', 'Cardiology'],
      shortBio: 'Distinguished cardiologist with extensive expertise in echocardiography and prosthetic valve evaluation. Graduate of University of Washington School of Medicine (1985) with fellowship training in Cardiology at University of Utah Medical Center (1993).',
      education: [
        {
          degree: 'MD',
          institution: 'University of Washington School of Medicine',
          year: '1985'
        },
        {
          degree: 'Fellowship in Cardiology',
          institution: 'University of Utah Medical Center',
          year: '1993'
        }
      ],
      achievements: [
        'Board Certified in Cardiology',
        'Expert in echocardiography and prosthetic valve evaluation',
        'Extensive clinical and research experience'
      ]
    },
    {
      id: 'ivor-douglas',
      name: 'Ivor Douglas, MD',
      role: 'Critical Care Director & Chief of Pulmonary Sciences',
      type: 'core',
      image: '/images/IVOR.jpg',
      specialties: ['Pulmonary Sciences', 'Critical Care', 'ICU Management'],
      shortBio: 'Medical Director of the Intensive Care unit at Denver Health Medical Center and Chief of Pulmonary Sciences & Critical Care. Recognized as a Top Doctor in Denver by 5280 Magazine (2008-2019) and named in Best Doctors in America® (2008-2020).',
      achievements: [
        'Medical Director of ICU at Denver Health Medical Center',
        'Chief of Pulmonary Sciences & Critical Care',
        'Top Doctor in Denver by 5280 Magazine (2008-2019)',
        'Best Doctors in America® (2008-2020)'
      ]
    },
    // Contributors
    {
      id: 'nhu-nguyen-le',
      name: 'Nhu-Nguyen Le, MD',
      role: 'Assistant Fellowship Director',
      type: 'contributor',
      image: '/images/NN headshot.jpg',
      specialties: ['Emergency Medicine', 'Point-of-Care Ultrasound', 'Medical Education'],
      shortBio: 'Emergency Medicine physician at Denver Health Medical Center with fellowship in Ultrasound Medicine. Specializes in point-of-care ultrasound education and clinical applications in emergency settings.'
    },
    {
      id: 'fred-milgrim',
      name: 'Fred N. Milgrim, MD',
      role: 'Director of Residency Ultrasound Education',
      type: 'contributor',
      image: '/images/Milgrim headshot.jpg',
      specialties: ['Emergency Medicine', 'Ultrasound Education', 'Curriculum Development'],
      shortBio: 'Emergency Medicine physician at Denver Health Medical Center with expertise in ultrasound education. Focuses on developing curriculum for residents and integration of POCUS in emergency care.'
    },
    {
      id: 'peter-alsharif',
      name: 'Peter Alsharif, MD',
      role: 'Ultrasound Fellow',
      type: 'contributor',
      image: '/images/Alsharif headshot.jpg',
      specialties: ['Emergency Ultrasound', 'Point-of-Care Ultrasound', 'Critical Care'],
      shortBio: 'Emergency ultrasound fellow from Rutgers specializing in point-of-care ultrasound applications and advancing diagnostic capabilities in critical care settings.'
    },
    {
      id: 'luke-mccormack',
      name: 'Luke McCormack, MD',
      role: 'Research Contributor',
      type: 'contributor',
      image: '/images/luke-mccormack-headshot.jpg',
      specialties: ['Internal Medicine', 'Critical Care', 'Research'],
      shortBio: 'Internal Medicine resident at the University of Colorado with a strong interest in critical care medicine. His work focuses on advancing the understanding and application of critical care diagnostics and interventions.'
    },
    {
      id: 'kisha-thayapran',
      name: 'Kisha Thayapran, MD, MPH',
      role: 'Medical Research Contributor',
      type: 'contributor',
      image: '/images/kthayapran-headshot.png',
      specialties: ['Medical Imaging', 'Public Health', 'Population Health'],
      shortBio: 'Dr. Thayapran received her MD from the University of Colorado School of Medicine and her MPH from the Colorado School of Public Health. With a background in Biology from the California Institute of Technology, she brings a unique perspective to the intersection of diagnostic imaging and public health.',
      education: [
        {
          degree: 'MD',
          institution: 'University of Colorado School of Medicine',
          year: '2023'
        },
        {
          degree: 'MPH',
          institution: 'Colorado School of Public Health',
          year: '2023'
        },
        {
          degree: 'BS in Biology',
          institution: 'California Institute of Technology',
          year: '2018'
        }
      ]
    }
  ]
};
```

### 7. Dependencies & Implementation Priority

#### Dependencies
```json
{
  "dependencies": {
    "@mui/material": "^5.x.x",
    "@mui/icons-material": "^5.x.x",
    "@emotion/react": "^11.x.x",
    "@emotion/styled": "^11.x.x",
    "react": "^18.x.x",
    "react-dom": "^18.x.x",
    "react-hook-form": "^7.x.x"
  }
}
```

#### Implementation Priority
1. **Core Layout & Structure** (Container, sections, basic navigation)
2. **Team Member Cards** (Card component with images and basic info)
3. **Expandable Details** (Biography, education, achievements)
4. **Team Sections** (Core team vs contributors organization)
5. **Interactive Features** (Contact links, social profiles)
6. **Join Team Form** (Application form with validation)
7. **Performance Optimizations** (Image loading, memoization)
8. **Testing & Accessibility** (Complete coverage, ARIA support)

### 8. Testing Strategy

```javascript
// src/components/team/__tests__/TeamMemberCard.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import TeamMemberCard from '../TeamMemberCard';

const theme = createTheme();
const mockMember = {
  id: '1',
  name: 'Dr. John Smith',
  role: 'Lead Researcher',
  image: '/images/john-smith.jpg',
  shortBio: 'Expert in medical research',
  specialties: ['Research', 'Medicine'],
  education: [
    { degree: 'MD', institution: 'Medical School', year: '2010' }
  ]
};

describe('TeamMemberCard', () => {
  test('renders member information', () => {
    render(
      <ThemeProvider theme={theme}>
        <TeamMemberCard member={mockMember} />
      </ThemeProvider>
    );
    
    expect(screen.getByText('Dr. John Smith')).toBeInTheDocument();
    expect(screen.getByText('Lead Researcher')).toBeInTheDocument();
    expect(screen.getByText('Expert in medical research')).toBeInTheDocument();
  });

  test('expands to show additional details', () => {
    render(
      <ThemeProvider theme={theme}>
        <TeamMemberCard member={mockMember} />
      </ThemeProvider>
    );
    
    const expandButton = screen.getByText('Learn More');
    fireEvent.click(expandButton);
    
    expect(screen.getByText('Education')).toBeInTheDocument();
    expect(screen.getByText('MD - Medical School (2010)')).toBeInTheDocument();
  });
});
```

### 9. Performance & SEO Considerations

- **Image Optimization**: WebP formats with fallbacks, responsive images
- **Person Schema**: Structured data for team member profiles
- **Professional Networking**: LinkedIn and contact integration
- **Accessibility**: Screen reader support, keyboard navigation
- **Mobile Optimization**: Touch-friendly interactions, responsive grids
- **Loading Performance**: Lazy image loading, optimized card rendering

This comprehensive framework provides a robust foundation for converting the team.astro page to a modern React application with Material-UI, ensuring excellent user experience for team member discovery and professional networking. 
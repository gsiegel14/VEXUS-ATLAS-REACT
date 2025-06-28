import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Link,
  Tabs,
  Tab,
} from '@mui/material';
import { Email, Work } from '@mui/icons-material';
import { faculty, currentFellows, FacultyMember } from '../data/facultyData';
import FacultyResearchCard from '../components/FacultyResearchCard';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`faculty-tabpanel-${index}`}
      aria-labelledby={`faculty-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

// Helper function to generate faculty ID from name
const generateFacultyId = (name: string): string => {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
};

const FacultyCard: React.FC<{ member: FacultyMember }> = ({ member }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const facultyId = generateFacultyId(member.name);

  return (
    <>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.3s ease-in-out',
          cursor: 'pointer',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          },
        }}
        onClick={handleOpen}
      >
        <CardContent sx={{ p: 4, flexGrow: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar
              src={member.imageUrl}
              sx={{
                width: 300,
                height: 300,
                mr: 5,
                backgroundColor: 'grey.300',
              }}
            >
              {member.name.split(' ').map(n => n[0]).join('')}
            </Avatar>
            <Box sx={{ flexGrow: 1, ml: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                {member.name}
              </Typography>
              <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                {member.title}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 1 }}>
              {member.institution}
            </Typography>
            {member.isCurrentFellow && (
              <Chip
                label="Current Fellow"
                size="medium"
                color="primary"
                sx={{ mb: 1 }}
              />
            )}
          </Box>

          {member.expertise && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
              {member.expertise.slice(0, 3).map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.75rem' }}
                />
              ))}
            </Box>
          )}

          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {member.description || member.roles[0]}
          </Typography>

          {/* Add Google Scholar Research Card */}
          <FacultyResearchCard 
            facultyId={facultyId}
            facultyName={member.name}
            maxResults={3}
            compact={true}
          />
        </CardContent>
      </Card>

      {/* Faculty Detail Modal */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              src={member.imageUrl}
              sx={{
                width: 400,
                height: 400,
                mr: 5,
                backgroundColor: 'grey.300',
              }}
            >
              {member.name.split(' ').map(n => n[0]).join('')}
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {member.name}
              </Typography>
              <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 400 }}>
                {member.title}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Roles & Responsibilities
              </Typography>
              {member.roles.map((role, index) => (
                <Typography key={index} variant="body2" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                  <Work sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                  {role}
                </Typography>
              ))}

              {member.description && (
                <>
                  <Typography variant="h6" sx={{ mt: 3, mb: 2, fontWeight: 600 }}>
                    About
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {member.description}
                  </Typography>
                </>
              )}

              {(member.hobbies && member.hobbies.length > 0) && (
                <>
                  <Typography variant="h6" sx={{ mt: 3, mb: 2, fontWeight: 600 }}>
                    Interests & Hobbies
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {member.hobbies.map((hobby, index) => (
                      <Chip key={index} label={hobby} size="small" variant="outlined" />
                    ))}
                  </Box>
                </>
              )}

              {/* Full Research Card in Modal */}
              <FacultyResearchCard 
                facultyId={facultyId}
                facultyName={member.name}
                maxResults={10}
                compact={false}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Information
              </Typography>
              
              {member.email && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                    Email
                  </Typography>
                  <Link
                    href={`mailto:${member.email}`}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      color: 'primary.main',
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    <Email sx={{ mr: 1, fontSize: 16 }} />
                    {member.email}
                  </Link>
                </Box>
              )}

              {member.institution && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                    Institution
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {member.institution}
                  </Typography>
                </Box>
              )}

              {member.fellowship && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                    Fellowship
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {member.fellowship}
                  </Typography>
                </Box>
              )}

              {member.residency && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                    Residency
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {member.residency}
                  </Typography>
                </Box>
              )}

              {member.medSchool && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                    Medical School
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {member.medSchool}
                  </Typography>
                </Box>
              )}

              {member.undergrad && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                    Undergraduate
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {member.undergrad}
                  </Typography>
                </Box>
              )}

              {member.hometown && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                    Hometown
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {member.hometown}
                  </Typography>
                </Box>
              )}

              {member.expertise && member.expertise.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                    Expertise
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {member.expertise.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const FacultyPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          backgroundColor: 'grey.900',
          color: 'white',
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            sx={{
              textAlign: 'center',
              fontWeight: 700,
              mb: 2,
            }}
          >
            Our Team
          </Typography>
          <Typography
            variant="h6"
            sx={{
              textAlign: 'center',
              color: 'grey.300',
              maxWidth: '600px',
              mx: 'auto',
            }}
          >
            Meet our distinguished faculty and current fellows dedicated to advancing emergency ultrasound
          </Typography>
        </Container>
      </Box>

      {/* Content */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="faculty tabs"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 500,
              },
            }}
          >
            <Tab label={`Faculty Members (${faculty.length})`} />
            <Tab label={`Current Fellows (${currentFellows.length})`} />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={4}>
            {faculty.map((member) => (
              <Grid item xs={12} sm={12} md={12} lg={6} key={member.id}>
                <FacultyCard member={member} />
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={4}>
            {currentFellows.map((member) => (
              <Grid item xs={12} sm={12} md={12} lg={6} key={member.id}>
                <FacultyCard member={member} />
              </Grid>
            ))}
          </Grid>
        </TabPanel>
      </Container>
    </Box>
  );
};

export default FacultyPage; 
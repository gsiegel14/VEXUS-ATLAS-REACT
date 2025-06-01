import React from 'react';
import { Box, Typography, List, ListItem } from '@mui/material';

const AboutPageContent: React.FC = () => {
  return (
    <Box
      sx={{
        py: 4,
        textAlign: 'center',
      }}
    >
      <Box
        sx={{
          maxWidth: '900px',
          margin: '0 auto',
          px: { xs: 2, sm: 3 },
          textAlign: 'left',
        }}
      >
        {/* Main Title */}
        <Typography
          variant="h1"
          component="h1"
          sx={{
            fontSize: '2.2em',
            textAlign: 'center',
            color: '#333',
            fontFamily: 'Europa, sans-serif',
            mb: 4,
            fontWeight: 'normal',
          }}
        >
          About VEXUS ATLAS
        </Typography>

        {/* Our Mission Section - White Background */}
        <Box
          sx={{
            mb: 5,
            p: 3,
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            border: '1px solid #e0e0e0',
          }}
        >
          <Typography
            variant="h2"
            component="h2"
            sx={{
              fontSize: '1.8em',
              color: '#333',
              fontFamily: 'Europa, sans-serif',
              mb: 2,
              borderBottom: '2px solid #43c3ac',
              paddingBottom: '0.5rem',
              fontWeight: 'normal',
            }}
          >
            Our Mission
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: '1rem',
              lineHeight: 1.7,
              color: '#555',
              fontFamily: 'Europa, sans-serif',
              mb: 2,
            }}
          >
            VEXUS ATLAS is dedicated to advancing the understanding and application of Venous Excess Ultrasound (VEXUS) in clinical practice. Our mission is to provide healthcare professionals with cutting-edge tools and resources for assessing venous congestion through ultrasound imaging.
          </Typography>
        </Box>

        {/* What We Do Section */}
        <Box
          sx={{
            mb: 5,
            p: 3,
            backgroundColor: '#f9f9f9',
            borderRadius: '8px',
            border: '1px solid #e0e0e0',
          }}
        >
          <Typography
            variant="h2"
            component="h2"
            sx={{
              fontSize: '1.8em',
              color: '#333',
              fontFamily: 'Europa, sans-serif',
              mb: 2,
              borderBottom: '2px solid #43c3ac',
              paddingBottom: '0.5rem',
              fontWeight: 'normal',
            }}
          >
            What We Do
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: '1rem',
              lineHeight: 1.7,
              color: '#555',
              fontFamily: 'Europa, sans-serif',
              mb: 2,
            }}
          >
            We combine artificial intelligence with clinical expertise to:
          </Typography>
          <List
            sx={{
              listStyle: 'disc',
              pl: 4,
              '& .MuiListItem-root': {
                display: 'list-item',
                p: 0,
                mb: 1,
              },
            }}
          >
            <ListItem>
              <Typography
                variant="body1"
                sx={{
                  fontSize: '1rem',
                  lineHeight: 1.7,
                  color: '#555',
                  fontFamily: 'Europa, sans-serif',
                }}
              >
                Provide automated analysis of VEXUS images
              </Typography>
            </ListItem>
            <ListItem>
              <Typography
                variant="body1"
                sx={{
                  fontSize: '1rem',
                  lineHeight: 1.7,
                  color: '#555',
                  fontFamily: 'Europa, sans-serif',
                }}
              >
                Offer comprehensive educational resources
              </Typography>
            </ListItem>
            <ListItem>
              <Typography
                variant="body1"
                sx={{
                  fontSize: '1rem',
                  lineHeight: 1.7,
                  color: '#555',
                  fontFamily: 'Europa, sans-serif',
                }}
              >
                Support healthcare professionals in implementing VEXUS in their practice
              </Typography>
            </ListItem>
            <ListItem>
              <Typography
                variant="body1"
                sx={{
                  fontSize: '1rem',
                  lineHeight: 1.7,
                  color: '#555',
                  fontFamily: 'Europa, sans-serif',
                }}
              >
                Advance research in venous congestion assessment
              </Typography>
            </ListItem>
          </List>
        </Box>

        {/* Our Vision Section */}
        <Box
          sx={{
            mb: 5,
            p: 3,
            backgroundColor: '#f9f9f9',
            borderRadius: '8px',
            border: '1px solid #e0e0e0',
          }}
        >
          <Typography
            variant="h2"
            component="h2"
            sx={{
              fontSize: '1.8em',
              color: '#333',
              fontFamily: 'Europa, sans-serif',
              mb: 2,
              borderBottom: '2px solid #43c3ac',
              paddingBottom: '0.5rem',
              fontWeight: 'normal',
            }}
          >
            Our Vision
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: '1rem',
              lineHeight: 1.7,
              color: '#555',
              fontFamily: 'Europa, sans-serif',
              mb: 2,
            }}
          >
            We envision a future where VEXUS assessment becomes a standard tool in critical care and cardiology, enabling better patient outcomes through early detection and monitoring of venous congestion.
          </Typography>
        </Box>

        {/* Innovation in Healthcare Section */}
        <Box
          sx={{
            mb: 5,
            p: 3,
            backgroundColor: '#f9f9f9',
            borderRadius: '8px',
            border: '1px solid #e0e0e0',
          }}
        >
          <Typography
            variant="h2"
            component="h2"
            sx={{
              fontSize: '1.8em',
              color: '#333',
              fontFamily: 'Europa, sans-serif',
              mb: 2,
              borderBottom: '2px solid #43c3ac',
              paddingBottom: '0.5rem',
              fontWeight: 'normal',
            }}
          >
            Innovation in Healthcare
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: '1rem',
              lineHeight: 1.7,
              color: '#555',
              fontFamily: 'Europa, sans-serif',
              mb: 2,
            }}
          >
            By leveraging artificial intelligence and machine learning, we're making VEXUS assessment more accessible, accurate, and efficient. Our platform represents a significant step forward in the integration of technology and clinical practice.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default AboutPageContent; 
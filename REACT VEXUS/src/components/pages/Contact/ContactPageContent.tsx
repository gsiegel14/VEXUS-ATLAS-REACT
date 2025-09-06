import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Link,
} from '@mui/material';
import {
  Email,
  LocationOn,
  Phone,
  Launch,
} from '@mui/icons-material';
import { colorTokens } from '../../../design-system/tokens';

const ContactPageContent: React.FC = () => {

  return (
    <Box sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography 
          variant="h1" 
          component="h1" 
          sx={{ 
            color: colorTokens.primary[500],
            mb: 2,
            fontWeight: 'bold'
          }}
        >
          Contact Us
        </Typography>
        <Typography 
          variant="h5" 
          component="p" 
          sx={{ 
            color: 'text.secondary',
            maxWidth: 600,
            mx: 'auto'
          }}
        >
          Get in touch with the VEXUS ATLAS team
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        {/* Contact Methods */}
        <Grid item xs={12} md={8}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Typography variant="h4" component="h2" sx={{ color: colorTokens.primary[500] }}>
              Contact Methods
            </Typography>

            {/* Email */}
            <Card elevation={1}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Email sx={{ color: colorTokens.primary[500], mr: 2, fontSize: 32 }} />
                  <Typography variant="h6">Email</Typography>
                </Box>
                <Typography variant="body2" paragraph>
                  For all inquiries:{' '}
                  <Link href="mailto:vexusatlas@thevexusatlas.com" target="_blank" rel="noopener noreferrer">
                    vexusatlas@thevexusatlas.com
                  </Link>
                </Typography>
              </CardContent>
            </Card>

            {/* Address */}
            <Card elevation={1}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocationOn sx={{ color: colorTokens.primary[500], mr: 2, fontSize: 32 }} />
                  <Typography variant="h6">Address</Typography>
                </Box>
                <Typography variant="body2" paragraph>
                  VEXUS ATLAS Research Group<br />
                  Denver Health<br />
                  777 Bannock St<br />
                  Denver, CO 80204
                </Typography>
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card elevation={1}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Phone sx={{ color: colorTokens.primary[500], mr: 2, fontSize: 32 }} />
                  <Typography variant="h6">Social Media</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Link
                    href="https://x.com/thevexusatlas"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
                  >
                    <Launch sx={{ mr: 1, fontSize: 16 }} />
                    Twitter/X: @thevexusatlas
                  </Link>
                  <Link
                    href="https://www.instagram.com/thevexusatlas/"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
                  >
                    <Launch sx={{ mr: 1, fontSize: 16 }} />
                    Instagram: @thevexusatlas
                  </Link>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ContactPageContent; 
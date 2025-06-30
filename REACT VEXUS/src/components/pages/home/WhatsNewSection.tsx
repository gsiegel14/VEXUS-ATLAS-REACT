import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  Container
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { homeConfig } from '../../../config/homeConfig';

const WhatsNewSection: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} md={2} /> {/* Spacer - exact layout from original */}
        <Grid item xs={12} md={8}>
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography 
              variant="h2" 
              component="h2"
              sx={{ 
                fontFamily: "'Europa', 'proxima-nova', 'Helvetica Neue', Arial, sans-serif",
                fontSize: '1.8em',
                marginBottom: '0.75em',
                marginTop: '1em',
                color: '#333',
                textAlign: 'center',
                whiteSpace: 'pre-wrap',
                width: '100%'
              }}
            >
              What's New
            </Typography>
            
            <Box sx={{ width: '100%', maxWidth: '100%' }}>
              {homeConfig.newsItems.map((item) => (
                <Box 
                  key={item.id}
                  sx={{ 
                    display: 'flex',
                    marginBottom: '30px',
                    backgroundColor: '#fff',
                    border: '1px solid #eee',
                    alignItems: 'center',
                    flexDirection: { 
                      xs: 'column', 
                      md: item.imagePosition === 'right' ? 'row-reverse' : 'row' 
                    }
                  }}
                >
                  {/* Image section */}
                  <Box 
                    sx={{ 
                      flex: { xs: 'none', md: '0 0 40%' },
                      width: { xs: '100%', md: 'auto' },
                      maxHeight: { xs: '200px', md: '250px' },
                      order: { xs: 1, md: item.imagePosition === 'right' ? 2 : 1 }
                    }}
                  >
                    <Box
                      component="img"
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      sx={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                        maxHeight: '250px',
                        objectFit: 'cover'
                      }}
                    />
                  </Box>
                  
                  {/* Content section */}
                  <Box 
                    sx={{ 
                      flex: 1,
                      padding: '20px',
                      textAlign: { xs: 'center', md: 'left' },
                      order: { xs: 2, md: item.imagePosition === 'right' ? 1 : 2 }
                    }}
                  >
                    <Typography 
                      variant="h3" 
                      component="h3" 
                      sx={{ 
                        fontSize: '1.4em',
                        marginBottom: '10px',
                        fontFamily: "'Europa', 'proxima-nova', 'Helvetica Neue', Arial, sans-serif",
                        color: '#333'
                      }}
                    >
                      {item.title}
                    </Typography>
                    
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        fontSize: '0.9em',
                        lineHeight: 1.5,
                        marginBottom: '15px',
                        fontFamily: "'Europa', 'proxima-nova', 'Helvetica Neue', Arial, sans-serif"
                      }}
                    >
                      {item.description}
                    </Typography>

                    {/* Actions */}
                    <Box>
                      {item.customActions && item.appLinks ? (
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                          <Button
                            variant="contained"
                            component="a"
                            href={item.appLinks.ios}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                              display: 'inline-block',
                              padding: '10px 20px',
                              backgroundColor: '#4CAF50',
                              color: 'white',
                              textDecoration: 'none',
                              borderRadius: '4px',
                              fontSize: '0.9em',
                              marginRight: '10px',
                              fontFamily: "'Europa', 'proxima-nova', 'Helvetica Neue', Arial, sans-serif",
                              '&:hover': {
                                backgroundColor: '#45a049'
                              }
                            }}
                          >
                            iOS
                          </Button>
                          <Button
                            variant="contained"
                            component="a"
                            href={item.appLinks.android}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                              display: 'inline-block',
                              padding: '10px 20px',
                              backgroundColor: '#4CAF50',
                              color: 'white',
                              textDecoration: 'none',
                              borderRadius: '4px',
                              fontSize: '0.9em',
                              fontFamily: "'Europa', 'proxima-nova', 'Helvetica Neue', Arial, sans-serif",
                              '&:hover': {
                                backgroundColor: '#45a049'
                              }
                            }}
                          >
                            Android
                          </Button>
                        </Box>
                      ) : (
                        <Button
                          variant="contained"
                          component={item.external ? 'a' : RouterLink}
                          to={item.external ? undefined : item.link}
                          href={item.external ? item.link : undefined}
                          target={item.external ? '_blank' : undefined}
                          rel={item.external ? 'noopener noreferrer' : undefined}
                          sx={{
                            display: 'inline-block',
                            padding: '10px 20px',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '4px',
                            fontSize: '0.9em',
                            fontFamily: "'Europa', 'proxima-nova', 'Helvetica Neue', Arial, sans-serif",
                            '&:hover': {
                              backgroundColor: '#45a049'
                            }
                          }}
                        >
                          {item.linkText}
                        </Button>
                      )}
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={2} /> {/* Spacer - exact layout from original */}
      </Grid>
    </Container>
  );
};

export default WhatsNewSection; 
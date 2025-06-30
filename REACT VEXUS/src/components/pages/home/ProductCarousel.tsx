import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Container,
  Grid,
  Button,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { useProductCarousel } from '../../../hooks/useProductCarousel';
import { homeConfig } from '../../../config/homeConfig';

const ProductCarousel: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const itemWidth = isMobile ? 280 : 320;
  
  const { scrollRef, canScrollLeft, canScrollRight, scroll, updateScrollButtons } = useProductCarousel(itemWidth);

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
              Shop
            </Typography>
            <Typography 
              variant="h3" 
              component="h3" 
              sx={{ 
                fontFamily: "'Europa', 'proxima-nova', 'Helvetica Neue', Arial, sans-serif",
                fontWeight: 'normal',
                fontSize: '1.2em',
                lineHeight: '1.6em',
                marginBottom: '1em',
                color: '#333',
                textAlign: 'center',
                whiteSpace: 'pre-wrap',
                width: '100%'
              }}
            >
              Buy our POCUS Atlas Merchandise and support our mission for free POCUS education around the world! All proceeds go towards user interface development and maintenance costs for our website.
            </Typography>
            
            {/* Product Carousel Container */}
            <Box sx={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '20px 0',
              position: 'relative',
              width: '100%',
              maxWidth: '100%'
            }}>
              {/* Left Navigation */}
              <IconButton
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                sx={{
                  position: 'absolute',
                  left: -20,
                  zIndex: 2,
                  backgroundColor: 'background.paper',
                  boxShadow: 2,
                  padding: '10px',
                  fontSize: '2em',
                  color: '#555',
                  '&:hover': { 
                    backgroundColor: 'grey.100',
                    color: '#000'
                  },
                  '&:disabled': { opacity: 0.3 }
                }}
              >
                <ArrowBack />
              </IconButton>

              {/* Products Container */}
              <Box
                ref={scrollRef}
                onScroll={updateScrollButtons}
                sx={{
                  display: 'flex',
                  overflowX: 'auto',
                  scrollBehavior: 'smooth',
                  width: 'calc(100% - 80px)',
                  scrollbarWidth: 'none',
                  '&::-webkit-scrollbar': { display: 'none' },
                  gap: 2
                }}
              >
                {homeConfig.products.map((product) => (
                  <Box
                    key={product.id}
                    sx={{
                      flex: '0 0 auto',
                      width: `${itemWidth}px`,
                      textAlign: 'center'
                    }}
                  >
                    <RouterLink 
                      to={product.url}
                      style={{ 
                        textDecoration: 'none',
                        color: '#333'
                      }}
                    >
                      <Box sx={{
                        transition: 'transform 0.2s ease',
                        '&:hover': { transform: 'scale(1.02)' }
                      }}>
                        <Box
                          component="img"
                          src={product.image}
                          alt={product.name}
                          loading="lazy"
                          sx={{
                            width: '100%',
                            height: 'auto',
                            maxHeight: '180px',
                            objectFit: 'contain',
                            marginBottom: '10px',
                            border: '1px solid #eee',
                            padding: 1,
                            backgroundColor: 'grey.50'
                          }}
                        />
                        <Typography 
                          variant="h6" 
                          component="h3"
                          sx={{ 
                            fontSize: '1em',
                            marginBottom: '5px',
                            fontFamily: "'Europa', 'proxima-nova', 'Helvetica Neue', Arial, sans-serif",
                            minHeight: '2.4em',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center'
                          }}
                        >
                          {product.name}
                        </Typography>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            fontSize: '0.9em',
                            color: '#555',
                            fontFamily: "'Europa', 'proxima-nova', 'Helvetica Neue', Arial, sans-serif"
                          }}
                        >
                          {product.price}
                        </Typography>
                      </Box>
                    </RouterLink>
                  </Box>
                ))}
              </Box>

              {/* Right Navigation */}
              <IconButton
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                sx={{
                  position: 'absolute',
                  right: -20,
                  zIndex: 2,
                  backgroundColor: 'background.paper',
                  boxShadow: 2,
                  padding: '10px',
                  fontSize: '2em',
                  color: '#555',
                  '&:hover': { 
                    backgroundColor: 'grey.100',
                    color: '#000'
                  },
                  '&:disabled': { opacity: 0.3 }
                }}
              >
                <ArrowForward />
              </IconButton>
            </Box>

            {/* Visit Shop Button */}
            <Box sx={{ textAlign: 'center', marginTop: '20px' }}>
              <Button
                variant="contained"
                component="a"
                href="https://www.thepocusatlas.com/merch"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: 'inline-block',
                  padding: '10px 20px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  fontSize: '0.9em',
                  fontFamily: "'Europa', 'proxima-nova', 'Helvetica Neue', Arial, sans-serif",
                  '&:hover': {
                    backgroundColor: '#0056b3'
                  }
                }}
              >
                Visit shop
              </Button>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={2} /> {/* Spacer - exact layout from original */}
      </Grid>
    </Container>
  );
};

export default ProductCarousel; 
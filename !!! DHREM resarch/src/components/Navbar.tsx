import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Faculty', path: '/faculty' },
    { label: 'Research', path: '/research' },
  ];

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{ 
        backgroundColor: 'white',
        borderBottom: '1px solid',
        borderColor: 'grey.200'
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              component={Link}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                gap: 2
              }}
            >
              <img
                src="/images/denver-health-ultrasound-logo.png"
                alt="Denver Health Emergency Medicine Ultrasound"
                style={{
                  height: '50px',
                  width: 'auto',
                }}
              />
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: 'primary.main',
                    fontSize: '1.3rem',
                    letterSpacing: '-0.01em',
                    lineHeight: 1.2
                  }}
                >
                  Denver Health Ultrasound
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    color: 'text.secondary',
                    fontSize: '0.9rem',
                    lineHeight: 1
                  }}
                >
                  DH US Research Portal
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                component={Link}
                to={item.path}
                sx={{
                  color: location.pathname === item.path ? 'primary.main' : 'text.secondary',
                  fontWeight: location.pathname === item.path ? 600 : 400,
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1rem',
                  '&:hover': {
                    backgroundColor: 'grey.100',
                    color: 'primary.main',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 
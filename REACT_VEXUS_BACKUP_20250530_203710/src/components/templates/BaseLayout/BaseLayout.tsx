import React from 'react';
import { Box, CssBaseline, Container } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import GlobalHeader from '../../organisms/GlobalHeader/GlobalHeader';
import GlobalFooter from '../../organisms/GlobalFooter/GlobalFooter';
import { theme } from '../../../design-system/theme';
import { navigationData } from '../../organisms/Navigation/NavigationData';

export interface BaseLayoutProps {
  children: React.ReactNode;
  pageTitle: string;
  containerMaxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  backgroundColor?: string;
}

const BaseLayout: React.FC<BaseLayoutProps> = ({
  children,
  pageTitle,
  containerMaxWidth = 'lg',
  backgroundColor = '#ffffff',
}) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor,
        }}
      >
        {/* Global Header - Identical across all pages */}
        <GlobalHeader
          navigationData={navigationData}
          currentPage={pageTitle}
        />

        {/* Main Content Area */}
        <Box
          component="main"
          sx={{
            flex: 1,
            paddingTop: { xs: '80px', md: '120px' }, // Account for fixed header
            paddingBottom: 2,
          }}
        >
          {containerMaxWidth ? (
            <Container maxWidth={containerMaxWidth}>
              {children}
            </Container>
          ) : (
            children
          )}
        </Box>

        {/* Global Footer - Identical across all pages */}
        <GlobalFooter />
      </Box>
    </ThemeProvider>
  );
};

export default BaseLayout; 
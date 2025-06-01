import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Container,
  Button,
  Paper,
  MenuList,
  MenuItem,
  ClickAwayListener,
  Popper,
  Grow,
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  useMediaQuery,
  useTheme,
  Collapse,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { NavigationItem } from '../Navigation/NavigationData';

export interface GlobalHeaderProps {
  navigationData: NavigationItem[];
  currentPage?: string;
}

interface DropdownMenuItemProps {
  item: NavigationItem;
  isOpen: boolean;
  onOpen: (event: React.MouseEvent<HTMLElement>) => void;
  onClose: () => void;
  currentPage?: string;
}

const GlobalHeader: React.FC<GlobalHeaderProps> = ({
  navigationData,
  currentPage,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState<{ [key: string]: boolean }>({});
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const handleDropdownOpen = (
    event: React.MouseEvent<HTMLElement>,
    menuId: string
  ) => {
    // Clear any pending close timeout
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    
    setAnchorEl(event.currentTarget);
    setOpenDropdown(menuId);
  };

  const handleDropdownClose = useCallback(() => {
    // Add a small delay to allow mouse movement between button and dropdown
    closeTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
      setAnchorEl(null);
    }, 150);
  }, []);

  const handleDropdownCloseImmediate = useCallback(() => {
    // Immediate close for click away
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setOpenDropdown(null);
    setAnchorEl(null);
  }, []);

  const handleDropdownMouseEnter = useCallback(() => {
    // Clear close timeout when mouse enters dropdown
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, []);

  const handleDropdownMouseLeave = useCallback(() => {
    // Close dropdown when mouse leaves dropdown area
    handleDropdownClose();
  }, [handleDropdownClose]);

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleMobileDropdownToggle = (menuId: string) => {
    setMobileDropdownOpen(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  // Split navigation for centered logo layout
  const midPoint = Math.ceil(navigationData.length / 2);
  const leftNavItems = navigationData.slice(0, midPoint);
  const rightNavItems = navigationData.slice(midPoint);

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #eee',
          height: isMobile ? '80px' : '120px',
          transition: 'all 0.3s ease',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar
            disableGutters
            sx={{
              height: isMobile ? '80px' : '120px',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {/* Mobile Menu Toggle */}
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleMobileMenuToggle}
                sx={{
                  color: '#333',
                }}
              >
                <MenuIcon />
              </IconButton>
            )}

            {/* Desktop Layout with Centered Logo */}
            {!isMobile && (
              <>
                {/* Left Navigation */}
                <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  {leftNavItems.map((item) => (
                    <DropdownMenuItem
                      key={item.label}
                      item={item}
                      isOpen={openDropdown === item.label}
                      onOpen={(e) => handleDropdownOpen(e, item.label)}
                      onClose={handleDropdownClose}
                      currentPage={currentPage}
                    />
                  ))}
                </Box>

                {/* Centered VEXUS ATLAS Logo */}
                <Box sx={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                  <a href="/" style={{ display: 'flex', alignItems: 'center' }}>
                    <img 
                      src="/images/VEXUS.ATLAS.png" 
                      alt="VEXUS ATLAS" 
                      style={{ 
                        height: '70px', 
                        width: 'auto',
                        transition: 'transform 0.3s ease',
                      }}
                      onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                      onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    />
                  </a>
                </Box>

                {/* Right Navigation */}
                <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'flex-end' }}>
                  {rightNavItems.map((item) => (
                    <DropdownMenuItem
                      key={item.label}
                      item={item}
                      isOpen={openDropdown === item.label}
                      onOpen={(e) => handleDropdownOpen(e, item.label)}
                      onClose={handleDropdownClose}
                      currentPage={currentPage}
                    />
                  ))}
                </Box>
              </>
            )}

            {/* Mobile Logo - Centered */}
            {isMobile && (
              <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
                <a href="/" style={{ display: 'flex', alignItems: 'center' }}>
                  <img 
                    src="/images/VEXUS.ATLAS.png" 
                    alt="VEXUS ATLAS" 
                    style={{ 
                      height: '55px', 
                      width: 'auto',
                    }}
                  />
                </a>
              </Box>
            )}

            {/* Spacer for mobile layout balance */}
            {isMobile && <Box sx={{ width: 48 }} />}
          </Toolbar>
        </Container>

        {/* Desktop Dropdown Menu */}
        <Popper
          open={Boolean(openDropdown)}
          anchorEl={anchorEl}
          role={undefined}
          placement="bottom"
          transition
          disablePortal
          style={{ zIndex: 1300 }}
          onMouseEnter={handleDropdownMouseEnter}
          onMouseLeave={handleDropdownMouseLeave}
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
              }}
            >
              <Paper
                elevation={8}
                onMouseEnter={handleDropdownMouseEnter}
                onMouseLeave={handleDropdownMouseLeave}
                sx={{
                  mt: 1,
                  minWidth: 220,
                  maxWidth: 280,
                  borderRadius: 2,
                  border: '1px solid #e0e0e0',
                  backgroundColor: '#ffffff',
                }}
              >
                <ClickAwayListener onClickAway={handleDropdownCloseImmediate}>
                  <MenuList sx={{ py: 1 }}>
                    {openDropdown &&
                      navigationData
                        .find((item) => item.label === openDropdown)
                        ?.subLinks?.map((subItem) => (
                          <MenuItem
                            key={subItem.href}
                            component="a"
                            href={subItem.href}
                            onClick={handleDropdownCloseImmediate}
                            sx={{
                              fontFamily: 'Europa, sans-serif',
                              fontSize: '1rem',
                              color: '#555',
                              py: 1.5,
                              px: 2.5,
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                backgroundColor: '#f5f5f5',
                                color: '#333',
                              },
                            }}
                          >
                            {subItem.text}
                          </MenuItem>
                        ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={handleMobileMenuToggle}
        sx={{
          '& .MuiDrawer-paper': {
            width: 300,
            backgroundColor: '#ffffff',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <img 
              src="/images/VEXUS.ATLAS.png" 
              alt="VEXUS ATLAS" 
              style={{ height: '50px', width: 'auto' }}
            />
            <IconButton onClick={handleMobileMenuToggle}>
              <CloseIcon />
            </IconButton>
          </Box>
          
          <List>
            {navigationData.map((item) => (
              <Box key={item.label}>
                <ListItem 
                  component={item.hasDropdown ? "div" : "a"}
                  href={!item.hasDropdown ? item.href : undefined}
                  onClick={item.hasDropdown ? () => handleMobileDropdownToggle(item.label) : undefined}
                  sx={{ 
                    px: 0, 
                    py: 1,
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                    }
                  }}
                >
                  <ListItemText 
                    primary={item.label}
                    sx={{
                      '& .MuiListItemText-primary': {
                        fontFamily: 'Europa, sans-serif',
                        fontWeight: currentPage === item.label ? 'bold' : 'normal',
                        color: '#555',
                        fontSize: '1.05rem',
                      },
                    }}
                  />
                  {item.hasDropdown && (
                    mobileDropdownOpen[item.label] ? 
                      <ExpandLessIcon sx={{ color: '#555' }} /> : 
                      <ExpandMoreIcon sx={{ color: '#555' }} />
                  )}
                </ListItem>
                
                {item.hasDropdown && (
                  <Collapse in={mobileDropdownOpen[item.label]} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {item.subLinks?.map((subItem) => (
                        <ListItem 
                          key={subItem.href}
                          component="a"
                          href={subItem.href}
                          sx={{ 
                            pl: 4, 
                            py: 0.5,
                            '&:hover': {
                              backgroundColor: '#f5f5f5',
                            }
                          }}
                        >
                          <ListItemText 
                            primary={subItem.text}
                            sx={{
                              '& .MuiListItemText-primary': {
                                fontFamily: 'Europa, sans-serif',
                                color: '#666',
                                fontSize: '0.95rem',
                              },
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                )}
              </Box>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

// Individual dropdown menu item component for desktop
const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({
  item,
  isOpen,
  onOpen,
  onClose,
  currentPage,
}) => {
  return (
    <Button
      href={item.hasDropdown ? undefined : item.href}
      onClick={item.hasDropdown ? onOpen : undefined}
      onMouseEnter={item.hasDropdown ? onOpen : undefined}
      onMouseLeave={item.hasDropdown ? onClose : undefined}
      sx={{
        color: '#555',
        fontFamily: 'Europa, sans-serif',
        fontWeight: currentPage === item.label ? 'bold' : 'normal',
        textTransform: 'none',
        fontSize: '1.1rem',
        mx: 1,
        display: 'flex',
        alignItems: 'center',
        transition: 'color 0.2s ease',
        '&:hover': {
          color: '#333',
          backgroundColor: 'transparent',
        },
      }}
    >
      {item.label}
      {item.hasDropdown && (
        <KeyboardArrowDownIcon
          sx={{
            ml: 0.5,
            fontSize: '1rem',
            transition: 'transform 0.2s ease',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      )}
    </Button>
  );
};

export default GlobalHeader; 
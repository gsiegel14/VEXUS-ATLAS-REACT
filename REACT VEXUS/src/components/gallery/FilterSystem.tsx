import React, { useState, useCallback } from 'react';
import {
  Paper,
  Box,
  TextField,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Collapse,
  Button,
  Stack,
  Divider,
  InputAdornment,
  Card,
  CardContent,
  Fade,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Search,
  Clear,
  ExpandMore,
  FilterList,
  Tune,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';

interface FilterSystemProps {
  filters: {
    quality: string | null;
    veinType: string | null;
    waveform: string | null;
    subtype: string | null;
    qa: string | null;
    analysis: string | null;
  };
  searchTerm: string;
  onFilterChange: (key: string, value: string | null) => void;
  onSearchChange: (value: string) => void;
  onClearAll: () => void;
  totalImages: number;
  filterOptions?: {
    quality: string[];
    veinType: string[];
    waveform: string[];
    subtype: string[];
    qa: string[];
    analysis: string[];
  };
}

const FilterSystem: React.FC<FilterSystemProps> = ({
  filters,
  searchTerm,
  onFilterChange,
  onSearchChange,
  onClearAll,
  totalImages,
  filterOptions: propFilterOptions,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [expanded, setExpanded] = useState(true);

  // Use provided filter options or fallback to defaults
  const filterOptions = propFilterOptions || {
    quality: ['High', 'Medium', 'Low'],
    veinType: ['Hepatic Vein', 'Portal Vein', 'Renal Vein'],
    waveform: ['Normal', 'Abnormal', 'Reversal', 'Pulsatile'],
    subtype: ['S-Wave', 'D-Wave', 'Continuous', 'Biphasic'],
    qa: ['Present', 'Not Present'],
    analysis: ['Available', 'Not Available'],
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length + (searchTerm ? 1 : 0);

  const clearFilter = useCallback((key: string) => {
    onFilterChange(key, null);
  }, [onFilterChange]);

  const clearSearch = useCallback(() => {
    onSearchChange('');
  }, [onSearchChange]);

  const getFilterDisplayName = (key: string, value: string) => {
    const keyDisplayNames: Record<string, string> = {
      quality: 'Quality',
      veinType: 'Vein Type',
      waveform: 'Waveform',
      subtype: 'Subtype',
      qa: 'QA',
      analysis: 'Analysis',
    };
    return `${keyDisplayNames[key]}: ${value}`;
  };

  return (
    <Card
      elevation={0}
      sx={{
        mb: 4,
        borderRadius: 4,
        border: '1px solid',
        borderColor: 'grey.200',
        backgroundColor: 'grey.50',
        overflow: 'hidden',
      }}
    >
      {/* Filter Header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
          p: 3,
          borderBottom: '1px solid #dee2e6',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FilterList sx={{ color: '#6c757d', fontSize: 24 }} />
            <Typography
              variant="h6"
              sx={{
                fontFamily: 'system-ui, -apple-system, sans-serif',
                fontWeight: 600,
                color: '#212529',
              }}
            >
              Filters
            </Typography>
            {activeFiltersCount > 0 && (
              <Chip
                label={`${activeFiltersCount} active`}
                size="small"
                sx={{
                  bgcolor: '#e9ecef',
                  color: '#495057',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  fontWeight: 500,
                  fontSize: '0.75rem',
                }}
              />
            )}
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontFamily: 'system-ui, -apple-system, sans-serif', display: { xs: 'none', sm: 'block' } }}
            >
              {totalImages} images found
            </Typography>
            <Button
              onClick={() => setExpanded(!expanded)}
              endIcon={
                <ExpandMore
                  sx={{
                    transform: expanded ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.3s ease',
                  }}
                />
              }
              sx={{
                fontFamily: 'system-ui, -apple-system, sans-serif',
                fontWeight: 500,
                color: '#6c757d',
                fontSize: '0.875rem',
              }}
            >
              {expanded ? 'Hide' : 'Show'} Filters
            </Button>
          </Box>
        </Box>

        {/* Search Bar - Always Visible */}
        <TextField
          fullWidth
          placeholder="Search by description, vein type, waveform, analysis..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={clearSearch} edge="end">
                  <Clear />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: 'white',
              borderRadius: 3,
              fontFamily: 'Europa, sans-serif',
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'primary.main',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: 'primary.main',
                borderWidth: 2,
              },
            },
            '& .MuiInputBase-input': {
              fontFamily: 'Europa, sans-serif',
            },
          }}
        />
      </Box>

      {/* Expandable Filter Content */}
      <Collapse in={expanded}>
        <CardContent sx={{ p: 3, pt: 2 }}>
          {/* Filter Grid */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            {Object.entries(filterOptions).map(([key, options]) => (
              <Grid item xs={12} sm={6} md={4} key={key}>
                <FormControl fullWidth size="small">
                  <InputLabel
                    sx={{
                      fontFamily: 'Europa, sans-serif',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                    }}
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                  </InputLabel>
                  <Select
                    value={filters[key as keyof typeof filters] || ''}
                    label={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                    onChange={(e) => onFilterChange(key, e.target.value || null)}
                    sx={{
                      fontFamily: 'Europa, sans-serif',
                      bgcolor: 'white',
                      borderRadius: 2,
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                      },
                    }}
                  >
                    <MenuItem value="">
                      <Typography sx={{ fontFamily: 'Europa, sans-serif', color: 'text.secondary' }}>
                        All {key.replace(/([A-Z])/g, ' $1').toLowerCase()}s
                      </Typography>
                    </MenuItem>
                    {options.map((option) => (
                      <MenuItem key={option} value={option}>
                        <Typography sx={{ fontFamily: 'Europa, sans-serif' }}>
                          {option}
                        </Typography>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            ))}
          </Grid>

          {/* Active Filters Display */}
          {activeFiltersCount > 0 && (
            <Fade in={true}>
              <Box>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontFamily: 'Europa, sans-serif',
                      fontWeight: 600,
                      color: 'text.primary',
                    }}
                  >
                    Active Filters:
                  </Typography>
                  <Button
                    size="small"
                    onClick={onClearAll}
                    startIcon={<Cancel />}
                    sx={{
                      fontFamily: 'Europa, sans-serif',
                      fontWeight: 600,
                      color: 'error.main',
                      '&:hover': {
                        bgcolor: 'error.50',
                      },
                    }}
                  >
                    Clear All
                  </Button>
                </Box>

                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {searchTerm && (
                    <Chip
                      label={`Search: "${searchTerm}"`}
                      onDelete={clearSearch}
                      deleteIcon={<Clear />}
                      sx={{
                        fontFamily: 'Europa, sans-serif',
                        fontWeight: 500,
                        bgcolor: 'primary.100',
                        color: 'primary.800',
                        '& .MuiChip-deleteIcon': {
                          color: 'primary.600',
                          '&:hover': {
                            color: 'primary.800',
                          },
                        },
                      }}
                    />
                  )}
                  
                  {Object.entries(filters).map(([key, value]) =>
                    value ? (
                      <Chip
                        key={key}
                        label={getFilterDisplayName(key, value)}
                        onDelete={() => clearFilter(key)}
                        deleteIcon={<Clear />}
                        sx={{
                          fontFamily: 'Europa, sans-serif',
                          fontWeight: 500,
                          bgcolor: 'secondary.100',
                          color: 'secondary.800',
                          '& .MuiChip-deleteIcon': {
                            color: 'secondary.600',
                            '&:hover': {
                              color: 'secondary.800',
                            },
                          },
                        }}
                      />
                    ) : null
                  )}
                </Stack>
              </Box>
            </Fade>
          )}
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default FilterSystem; 
import React from 'react';
import {
  Paper,
  Box,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  IconButton,
  Chip,
  Collapse,
  Button
} from '@mui/material';
import { Search, Clear, FilterList, ExpandMore } from '@mui/icons-material';

interface PublicationFiltersProps {
  filters: {
    year: string | null;
    journal: string | null;
    studyType: string | null;
  };
  searchTerm: string;
  onFilterChange: (key: string, value: string | null) => void;
  onSearchChange: (value: string) => void;
  onClearFilters: () => void;
  totalPublications: number;
}

const PublicationFilters: React.FC<PublicationFiltersProps> = ({ 
  filters, 
  searchTerm, 
  onFilterChange, 
  onSearchChange, 
  onClearFilters,
  totalPublications 
}) => {
  const [expanded, setExpanded] = React.useState(true);

  const filterOptions = {
    year: ['2025', '2024', '2023', '2022', '2021', '2020'],
    journal: ['Critical Care', 'Ultrasound Journal', 'Chest', 'Research Square', 'Other'],
    studyType: ['Prospective', 'Retrospective', 'Review', 'Meta-analysis', 'Case-series']
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length + (searchTerm ? 1 : 0);

  return (
    <Paper elevation={1} sx={{ mb: 4, overflow: 'hidden' }}>
      <Box sx={{ 
        p: 2, 
        bgcolor: 'grey.50', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between' 
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FilterList color="primary" />
          <Typography variant="h6">
            Publication Filters {activeFiltersCount > 0 && `(${activeFiltersCount} active)`}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {totalPublications} publications found
          </Typography>
        </Box>
        <Button
          onClick={() => setExpanded(!expanded)}
          endIcon={
            <ExpandMore 
              sx={{ 
                transform: expanded ? 'rotate(180deg)' : 'none', 
                transition: '0.3s' 
              }} 
            />
          }
        >
          {expanded ? 'Hide' : 'Show'} Filters
        </Button>
      </Box>

      <Collapse in={expanded}>
        <Box sx={{ p: 3 }}>
          {/* Search Bar */}
          <TextField
            fullWidth
            placeholder="Search by title, author, journal, or keywords..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
              endAdornment: searchTerm && (
                <IconButton size="small" onClick={() => onSearchChange('')}>
                  <Clear />
                </IconButton>
              )
            }}
          />

          {/* Filter Controls */}
          <Grid container spacing={2}>
            {Object.entries(filterOptions).map(([key, options]) => (
              <Grid item xs={12} sm={6} md={4} key={key}>
                <FormControl fullWidth>
                  <InputLabel>{key.charAt(0).toUpperCase() + key.slice(1)}</InputLabel>
                  <Select
                    value={filters[key as keyof typeof filters] || ''}
                    label={key.charAt(0).toUpperCase() + key.slice(1)}
                    onChange={(e) => onFilterChange(key, e.target.value || null)}
                  >
                    <MenuItem value="">All {key}s</MenuItem>
                    {options.map(option => (
                      <MenuItem key={option} value={option}>{option}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            ))}
          </Grid>

          {/* Active Filters Display */}
          {activeFiltersCount > 0 && (
            <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ mr: 1 }}>Active filters:</Typography>
              {searchTerm && (
                <Chip
                  label={`Search: "${searchTerm}"`}
                  onDelete={() => onSearchChange('')}
                  size="small"
                />
              )}
              {Object.entries(filters).map(([key, value]) => (
                value && (
                  <Chip
                    key={key}
                    label={`${key}: ${value}`}
                    onDelete={() => onFilterChange(key, null)}
                    size="small"
                  />
                )
              ))}
              <Button size="small" onClick={onClearFilters} sx={{ ml: 1 }}>
                Clear All
              </Button>
            </Box>
          )}
        </Box>
      </Collapse>
    </Paper>
  );
};

export default PublicationFilters; 
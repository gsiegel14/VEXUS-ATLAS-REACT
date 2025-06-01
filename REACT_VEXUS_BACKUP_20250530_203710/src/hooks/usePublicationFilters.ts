import { useState, useMemo, useCallback } from 'react';
import { Publication } from '../config/publicationsConfig';

interface Filters {
  year: string | null;
  journal: string | null;
  studyType: string | null;
}

export const usePublicationFilters = (publications: Publication[]) => {
  const [filters, setFilters] = useState<Filters>({
    year: null,
    journal: null,
    studyType: null
  });
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPublications = useMemo(() => {
    return publications.filter(publication => {
      // Search filter
      if (searchTerm) {
        const searchFields = [
          publication.title, 
          publication.authors, 
          publication.journal,
          publication.abstract,
          publication.keyFindings
        ].filter(Boolean).join(' ').toLowerCase();
        
        if (!searchFields.includes(searchTerm.toLowerCase())) {
          return false;
        }
      }

      // Property filters
      if (filters.year && publication.year.toString() !== filters.year) {
        return false;
      }
      
      if (filters.journal && publication.journal !== filters.journal) {
        return false;
      }
      
      if (filters.studyType && publication.studyType !== filters.studyType) {
        return false;
      }

      return true;
    });
  }, [publications, filters, searchTerm]);

  const updateFilter = useCallback((key: string, value: string | null) => {
    if (key in filters) {
      setFilters(prev => ({ ...prev, [key]: value }));
    }
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({ year: null, journal: null, studyType: null });
    setSearchTerm('');
  }, []);

  return {
    filters,
    filteredPublications,
    searchTerm,
    updateFilter,
    setSearchTerm,
    clearFilters
  };
}; 
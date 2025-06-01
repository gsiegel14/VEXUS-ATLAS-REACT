import { useState, useMemo, useCallback } from 'react';
import { VexusImageData } from '../services/airtableService';

export interface ImageFilters {
  quality: 'High' | 'Medium' | 'Low' | null;
  veinType: 'Hepatic Vein' | 'Portal Vein' | 'Renal Vein' | null;
  waveform: 'Normal' | 'Abnormal' | 'Reversal' | 'Pulsatile' | null;
  subtype: 'S-Wave' | 'D-Wave' | 'Continuous' | 'Biphasic' | null;
  vexusGrade: '0' | '1' | '2' | '3' | null;
}

export interface FilterOptions {
  qualities: ('High' | 'Medium' | 'Low')[];
  veinTypes: ('Hepatic Vein' | 'Portal Vein' | 'Renal Vein')[];
  waveforms: ('Normal' | 'Abnormal' | 'Reversal' | 'Pulsatile')[];
  subtypes: ('S-Wave' | 'D-Wave' | 'Continuous' | 'Biphasic')[];
  vexusGrades: ('0' | '1' | '2' | '3')[];
}

const defaultFilterOptions: FilterOptions = {
  qualities: ['High', 'Medium', 'Low'],
  veinTypes: ['Hepatic Vein', 'Portal Vein', 'Renal Vein'],
  waveforms: ['Normal', 'Abnormal', 'Reversal', 'Pulsatile'],
  subtypes: ['S-Wave', 'D-Wave', 'Continuous', 'Biphasic'],
  vexusGrades: ['0', '1', '2', '3'],
};

export const useImageFilters = (images: VexusImageData[], filterOptions: FilterOptions = defaultFilterOptions) => {
  const [filters, setFilters] = useState<ImageFilters>({
    quality: null,
    veinType: null,
    waveform: null,
    subtype: null,
    vexusGrade: null,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'title' | 'submissionDate' | 'quality' | 'vexusGrade'>('submissionDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Advanced search function
  const searchImages = useCallback((images: VexusImageData[], query: string): VexusImageData[] => {
    if (!query.trim()) return images;

    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
    
    return images.filter(image => {
      const searchableFields = [
        image.title,
        image.description,
        image.veinType,
        image.waveform,
        image.subtype,
        image.vexusGrade,
        image.clinicalContext,
        image.analysis,
        image.submittedBy,
        image.institution,
        ...(image.tags || [])
      ].filter(Boolean).join(' ').toLowerCase();

      // Check if all search terms are found in the searchable fields
      return searchTerms.every(term => searchableFields.includes(term));
    });
  }, []);

  // Apply filters function
  const applyFilters = useCallback((images: VexusImageData[]): VexusImageData[] => {
    return images.filter(image => {
      // Quality filter
      if (filters.quality && image.quality !== filters.quality) {
        return false;
      }

      // Vein type filter
      if (filters.veinType && image.veinType !== filters.veinType) {
        return false;
      }

      // Waveform filter
      if (filters.waveform && image.waveform !== filters.waveform) {
        return false;
      }

      // Subtype filter
      if (filters.subtype && image.subtype !== filters.subtype) {
        return false;
      }

      // VEXUS Grade filter
      if (filters.vexusGrade && image.vexusGrade !== filters.vexusGrade) {
        return false;
      }

      return true;
    });
  }, [filters]);

  // Sort images function
  const sortImages = useCallback((images: VexusImageData[]): VexusImageData[] => {
    return [...images].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'submissionDate':
          const dateA = a.submissionDate ? a.submissionDate.getTime() : 0;
          const dateB = b.submissionDate ? b.submissionDate.getTime() : 0;
          comparison = dateA - dateB;
          break;
        case 'quality':
          const qualityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
          comparison = qualityOrder[a.quality] - qualityOrder[b.quality];
          break;
        case 'vexusGrade':
          const gradeA = parseInt(a.vexusGrade || '0');
          const gradeB = parseInt(b.vexusGrade || '0');
          comparison = gradeA - gradeB;
          break;
        default:
          comparison = 0;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [sortBy, sortOrder]);

  // Main filtered and sorted images computation
  const filteredImages = useMemo(() => {
    let result = images;

    // Apply search
    if (searchTerm.trim()) {
      result = searchImages(result, searchTerm);
    }

    // Apply filters
    result = applyFilters(result);

    // Apply sorting
    result = sortImages(result);

    return result;
  }, [images, searchTerm, searchImages, applyFilters, sortImages]);

  // Categorized filtered images
  const categorizedFilteredImages = useMemo(() => {
    return {
      hepatic: filteredImages.filter(img => img.veinType.toLowerCase().includes('hepatic')),
      portal: filteredImages.filter(img => img.veinType.toLowerCase().includes('portal')),
      renal: filteredImages.filter(img => img.veinType.toLowerCase().includes('renal'))
    };
  }, [filteredImages]);

  // Filter update functions
  const updateFilter = useCallback(<K extends keyof ImageFilters>(
    key: K,
    value: ImageFilters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters({
      quality: null,
      veinType: null,
      waveform: null,
      subtype: null,
      vexusGrade: null,
    });
    setSearchTerm('');
  }, []);

  const clearFilter = useCallback(<K extends keyof ImageFilters>(key: K) => {
    setFilters(prev => ({ ...prev, [key]: null }));
  }, []);

  // Quick filter presets
  const applyQuickFilter = useCallback((preset: 'high-quality' | 'grade-3' | 'hepatic' | 'portal' | 'renal') => {
    clearAllFilters();
    
    switch (preset) {
      case 'high-quality':
        updateFilter('quality', 'High');
        break;
      case 'grade-3':
        updateFilter('vexusGrade', '3');
        break;
      case 'hepatic':
        updateFilter('veinType', 'Hepatic Vein');
        break;
      case 'portal':
        updateFilter('veinType', 'Portal Vein');
        break;
      case 'renal':
        updateFilter('veinType', 'Renal Vein');
        break;
    }
  }, [updateFilter, clearAllFilters]);

  // Statistics
  const filterStats = useMemo(() => {
    const activeFiltersCount = Object.values(filters).filter(Boolean).length + (searchTerm ? 1 : 0);
    
    return {
      totalImages: images.length,
      filteredImages: filteredImages.length,
      activeFiltersCount,
      hasActiveFilters: activeFiltersCount > 0,
      categoryCounts: {
        hepatic: categorizedFilteredImages.hepatic.length,
        portal: categorizedFilteredImages.portal.length,
        renal: categorizedFilteredImages.renal.length,
      }
    };
  }, [images.length, filteredImages.length, filters, searchTerm, categorizedFilteredImages]);

  // Get available filter options based on current data
  const availableOptions = useMemo(() => {
    const uniqueOptions = images.reduce(
      (acc, img) => {
        acc.qualities.add(img.quality);
        acc.veinTypes.add(img.veinType);
        acc.waveforms.add(img.waveform);
        if (img.subtype) acc.subtypes.add(img.subtype);
        if (img.vexusGrade) acc.vexusGrades.add(img.vexusGrade);
        return acc;
      },
      {
        qualities: new Set<string>(),
        veinTypes: new Set<string>(),
        waveforms: new Set<string>(),
        subtypes: new Set<string>(),
        vexusGrades: new Set<string>(),
      }
    );

    return {
      qualities: Array.from(uniqueOptions.qualities).sort(),
      veinTypes: Array.from(uniqueOptions.veinTypes).sort(),
      waveforms: Array.from(uniqueOptions.waveforms).sort(),
      subtypes: Array.from(uniqueOptions.subtypes).sort(),
      vexusGrades: Array.from(uniqueOptions.vexusGrades).sort(),
    };
  }, [images]);

  return {
    // State
    filters,
    searchTerm,
    sortBy,
    sortOrder,

    // Computed data
    filteredImages,
    categorizedFilteredImages,
    filterStats,
    availableOptions,

    // Actions
    updateFilter,
    clearFilter,
    clearAllFilters,
    setSearchTerm,
    setSortBy,
    setSortOrder,
    applyQuickFilter,

    // Utilities
    hasActiveFilters: filterStats.hasActiveFilters,
    activeFiltersCount: filterStats.activeFiltersCount,
  };
}; 
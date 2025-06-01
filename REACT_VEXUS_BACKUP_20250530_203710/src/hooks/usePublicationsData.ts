import { useState, useCallback, useEffect } from 'react';
import { Publication, publicationsData } from '../config/publicationsConfig';

export const usePublicationsData = () => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPublications = useCallback(async () => {
    try {
      setLoading(true);
      // For now, use static data from config
      // In the future, this could fetch from an API
      setPublications(publicationsData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load publications');
      setPublications(publicationsData); // Fallback to static data
    } finally {
      setLoading(false);
    }
  }, []);

  const submitContribution = useCallback(async (contribution: any) => {
    try {
      // This would typically submit to an API
      console.log('Contribution submitted:', contribution);
      return { success: true, message: 'Contribution submitted successfully' };
    } catch (err) {
      throw new Error(`Failed to submit contribution: ${err}`);
    }
  }, []);

  useEffect(() => {
    fetchPublications();
  }, [fetchPublications]);

  return {
    publications,
    loading,
    error,
    fetchPublications,
    submitContribution
  };
}; 
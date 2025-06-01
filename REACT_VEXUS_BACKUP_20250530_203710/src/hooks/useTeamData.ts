import { useState, useEffect } from 'react';
import { TeamMember, teamConfig } from '../config/teamConfig';

export const useTeamData = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        setLoading(true);
        // For now, use static data from config
        // In the future, this could fetch from an API
        setTeamMembers(teamConfig.members);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load team data');
        // Fallback to static data if service fails
        setTeamMembers(teamConfig.members);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, []);

  return {
    teamMembers,
    loading,
    error
  };
}; 
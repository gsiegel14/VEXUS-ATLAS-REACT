import { useState, useEffect, useCallback } from 'react';
import { waveformConfig, WaveformSectionData } from '../config/waveformConfig';

interface WaveformData {
  hepatic: WaveformSectionData;
  portal: WaveformSectionData;
  renal: WaveformSectionData;
}

interface UserProgress {
  [sectionId: string]: {
    [itemId: string]: any;
  };
}

export const useWaveformData = () => {
  const [waveformData, setWaveformData] = useState<WaveformData>({
    hepatic: waveformConfig.data.hepatic as WaveformSectionData,
    portal: waveformConfig.data.portal as WaveformSectionData,
    renal: waveformConfig.data.renal as WaveformSectionData,
  });
  
  const [userProgress, setUserProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('vexus-waveform-progress');
    return saved ? JSON.parse(saved) : {};
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In a real application, this would fetch data from an API
    const fetchWaveformData = async () => {
      try {
        setLoading(true);
        // Simulating API call - in real app this would fetch from backend
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // For now, use the static config data
        setWaveformData({
          hepatic: waveformConfig.data.hepatic as WaveformSectionData,
          portal: waveformConfig.data.portal as WaveformSectionData,
          renal: waveformConfig.data.renal as WaveformSectionData,
        });
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load waveform data');
        // Fallback to static data
        setWaveformData({
          hepatic: waveformConfig.data.hepatic as WaveformSectionData,
          portal: waveformConfig.data.portal as WaveformSectionData,
          renal: waveformConfig.data.renal as WaveformSectionData,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWaveformData();
  }, []);

  const updateProgress = useCallback((sectionId: string, itemId: string, data: any = true) => {
    setUserProgress(prev => {
      const updated = {
        ...prev,
        [sectionId]: {
          ...prev[sectionId],
          [itemId]: data
        }
      };
      localStorage.setItem('vexus-waveform-progress', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const resetProgress = useCallback(() => {
    setUserProgress({});
    localStorage.removeItem('vexus-waveform-progress');
  }, []);

  const getSectionProgress = useCallback((sectionId: string) => {
    const sectionData = userProgress[sectionId] || {};
    const totalModules = 5; // basics, normal, abnormal, grading, cases
    const completedModules = Object.keys(sectionData).length;
    return (completedModules / totalModules) * 100;
  }, [userProgress]);

  return {
    waveformData,
    userProgress,
    updateProgress,
    resetProgress,
    getSectionProgress,
    loading,
    error
  };
}; 
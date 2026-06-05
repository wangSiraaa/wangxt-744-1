import { useEffect } from 'react';
import { useCampStore } from '../store/campStore';

export function useOfflineDetection() {
  const setOffline = useCampStore((s) => s.setOffline);
  const saveSnapshot = useCampStore((s) => s.saveSnapshot);

  useEffect(() => {
    const goOffline = () => setOffline(true);
    const goOnline = () => {
      setOffline(false);
      saveSnapshot();
    };

    saveSnapshot();

    window.addEventListener('offline', goOffline);
    window.addEventListener('online', goOnline);

    return () => {
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('online', goOnline);
    };
  }, [setOffline, saveSnapshot]);
}

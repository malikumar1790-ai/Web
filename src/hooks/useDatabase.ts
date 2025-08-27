import { useState, useEffect, useCallback } from 'react';
import { supabase, testDatabaseConnection } from '../lib/supabase';

interface DatabaseStatus {
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  lastChecked: Date | null;
}

export const useDatabase = () => {
  const [status, setStatus] = useState<DatabaseStatus>({
    isConnected: false,
    isLoading: true,
    error: null,
    lastChecked: null
  });

  const checkConnection = useCallback(async () => {
    setStatus(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const isConnected = await testDatabaseConnection();
      setStatus({
        isConnected,
        isLoading: false,
        error: isConnected ? null : 'Database connection failed',
        lastChecked: new Date()
      });
      return isConnected;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown database error';
      setStatus({
        isConnected: false,
        isLoading: false,
        error: errorMessage,
        lastChecked: new Date()
      });
      return false;
    }
  }, []);

  useEffect(() => {
    checkConnection();
    
    // Check connection every 5 minutes
    const interval = setInterval(checkConnection, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [checkConnection]);

  const executeQuery = useCallback(async <T>(
    queryFn: () => Promise<T>,
    retries: number = 3
  ): Promise<T> => {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        return await queryFn();
      } catch (error) {
        lastError = error as Error;
        console.warn(`Database query attempt ${attempt}/${retries} failed:`, error);
        
        if (attempt < retries) {
          // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }
    
    throw lastError!;
  }, []);

  return {
    ...status,
    checkConnection,
    executeQuery,
    supabase
  };
};

export default useDatabase;
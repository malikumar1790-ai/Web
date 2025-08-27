import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Database, Mail, Wifi, WifiOff } from 'lucide-react';
import { testDatabaseConnection } from '../lib/supabase';
import { EmailService } from '../utils/emailService';

interface SystemStatus {
  database: boolean;
  email: boolean;
  environment: 'development' | 'production';
}

const FormDebugger: React.FC = () => {
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    database: false,
    email: false,
    environment: 'development'
  });
  const [isVisible, setIsVisible] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    // Only show in development
    const isDev = import.meta.env.DEV || 
                  window.location.hostname === 'localhost' || 
                  window.location.hostname === '127.0.0.1';
    
    setIsVisible(isDev);
    setSystemStatus(prev => ({
      ...prev,
      environment: isDev ? 'development' : 'production'
    }));

    if (isDev) {
      checkSystemStatus();
    }
  }, []);

  const checkSystemStatus = async () => {
    setIsChecking(true);
    
    try {
      // Test database connection
      const dbStatus = await testDatabaseConnection();
      
      // Test email connection
      const emailStatus = await EmailService.testEmailConnection();
      
      setSystemStatus(prev => ({
        ...prev,
        database: dbStatus,
        email: emailStatus
      }));
    } catch (error) {
      console.error('System status check failed:', error);
    } finally {
      setIsChecking(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg p-4 max-w-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-semibold text-sm">System Status</h3>
        <button
          onClick={checkSystemStatus}
          disabled={isChecking}
          className="text-blue-400 hover:text-blue-300 transition-colors"
        >
          {isChecking ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
          ) : (
            <Wifi className="h-4 w-4" />
          )}
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Database className="h-4 w-4 text-gray-400" />
            <span className="text-gray-300 text-sm">Database</span>
          </div>
          <div className="flex items-center space-x-1">
            {systemStatus.database ? (
              <CheckCircle className="h-4 w-4 text-green-400" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-red-400" />
            )}
            <span className={`text-xs ${systemStatus.database ? 'text-green-400' : 'text-red-400'}`}>
              {systemStatus.database ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Mail className="h-4 w-4 text-gray-400" />
            <span className="text-gray-300 text-sm">Email</span>
          </div>
          <div className="flex items-center space-x-1">
            {systemStatus.email ? (
              <CheckCircle className="h-4 w-4 text-green-400" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-red-400" />
            )}
            <span className={`text-xs ${systemStatus.email ? 'text-green-400' : 'text-red-400'}`}>
              {systemStatus.email ? 'Working' : 'Failed'}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <WifiOff className="h-4 w-4 text-gray-400" />
            <span className="text-gray-300 text-sm">Environment</span>
          </div>
          <span className={`text-xs px-2 py-1 rounded ${
            systemStatus.environment === 'development' 
              ? 'bg-yellow-600/20 text-yellow-400' 
              : 'bg-green-600/20 text-green-400'
          }`}>
            {systemStatus.environment}
          </span>
        </div>
      </div>

      {(!systemStatus.database || !systemStatus.email) && (
        <div className="mt-3 p-2 bg-red-900/20 border border-red-700/30 rounded text-xs text-red-300">
          <p className="font-semibold">Issues Detected:</p>
          {!systemStatus.database && <p>• Database connection failed</p>}
          {!systemStatus.email && <p>• Email service unavailable</p>}
        </div>
      )}

      <div className="mt-3 text-xs text-gray-400">
        Forms will work with fallback handling even if some services are unavailable.
      </div>
    </div>
  );
};

export default FormDebugger;
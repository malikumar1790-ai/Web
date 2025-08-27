import React, { useState, useEffect } from 'react';
import { Database, CheckCircle, AlertTriangle, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { useDatabase } from '../hooks/useDatabase';

interface DatabaseHealthCheckProps {
  showDetails?: boolean;
  className?: string;
}

const DatabaseHealthCheck: React.FC<DatabaseHealthCheckProps> = ({ 
  showDetails = false, 
  className = '' 
}) => {
  const { isConnected, isLoading, error, lastChecked, checkConnection } = useDatabase();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await checkConnection();
    setIsRefreshing(false);
  };

  const getStatusColor = () => {
    if (isLoading || isRefreshing) return 'text-yellow-400';
    return isConnected ? 'text-green-400' : 'text-red-400';
  };

  const getStatusIcon = () => {
    if (isLoading || isRefreshing) return RefreshCw;
    return isConnected ? CheckCircle : AlertTriangle;
  };

  const getStatusText = () => {
    if (isLoading || isRefreshing) return 'Checking...';
    return isConnected ? 'Connected' : 'Disconnected';
  };

  if (!showDetails) {
    const StatusIcon = getStatusIcon();
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Database className="h-4 w-4 text-gray-400" />
        <StatusIcon className={`h-4 w-4 ${getStatusColor()} ${(isLoading || isRefreshing) ? 'animate-spin' : ''}`} />
        <span className={`text-sm ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      </div>
    );
  }

  return (
    <div className={`bg-gray-800/50 rounded-xl p-4 border border-gray-700 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Database className="h-5 w-5 text-gray-400" />
          <h3 className="text-white font-semibold">Database Status</h3>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="p-1 text-gray-400 hover:text-white transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-gray-300 text-sm">Connection</span>
          <div className="flex items-center space-x-2">
            {isConnected ? (
              <Wifi className="h-4 w-4 text-green-400" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-400" />
            )}
            <span className={`text-sm ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>
        </div>

        {lastChecked && (
          <div className="flex items-center justify-between">
            <span className="text-gray-300 text-sm">Last Checked</span>
            <span className="text-gray-400 text-sm">
              {lastChecked.toLocaleTimeString()}
            </span>
          </div>
        )}

        {error && (
          <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-300 text-sm font-medium">Connection Error</p>
                <p className="text-red-200 text-xs mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {isConnected && (
          <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <p className="text-green-300 text-sm">All database operations functional</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DatabaseHealthCheck;
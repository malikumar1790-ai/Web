import React from 'react';
import { Loader2, Bot } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  type?: 'spinner' | 'dots' | 'pulse' | 'branded';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text, 
  type = 'spinner',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  if (type === 'branded') {
    return (
      <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center animate-pulse">
            <Bot className="h-8 w-8 text-white" />
          </div>
          <div className="absolute inset-0 rounded-xl border-4 border-blue-500 animate-ping opacity-20"></div>
        </div>
        {text && (
          <p className="text-gray-300 text-center font-medium animate-pulse">
            {text}
          </p>
        )}
      </div>
    );
  }

  if (type === 'dots') {
    return (
      <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
        {text && (
          <p className={`text-gray-300 text-center ${textSizeClasses[size]}`}>
            {text}
          </p>
        )}
      </div>
    );
  }

  if (type === 'pulse') {
    return (
      <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
        <div className={`${sizeClasses[size]} bg-blue-500 rounded-full animate-pulse`}></div>
        {text && (
          <p className={`text-gray-300 text-center ${textSizeClasses[size]}`}>
            {text}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} text-blue-500 animate-spin`} />
      {text && (
        <p className={`text-gray-300 text-center ${textSizeClasses[size]}`}>
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
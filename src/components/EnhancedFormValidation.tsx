import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

interface ValidationRule {
  test: (value: any) => boolean;
  message: string;
  type: 'error' | 'warning' | 'info';
}

interface EnhancedFormValidationProps {
  value: any;
  rules: ValidationRule[];
  showValidation?: boolean;
  className?: string;
}

const EnhancedFormValidation: React.FC<EnhancedFormValidationProps> = ({
  value,
  rules,
  showValidation = true,
  className = ''
}) => {
  const [validationResults, setValidationResults] = useState<{
    errors: string[];
    warnings: string[];
    info: string[];
    isValid: boolean;
  }>({
    errors: [],
    warnings: [],
    info: [],
    isValid: true
  });

  useEffect(() => {
    const errors: string[] = [];
    const warnings: string[] = [];
    const info: string[] = [];

    rules.forEach(rule => {
      if (!rule.test(value)) {
        switch (rule.type) {
          case 'error':
            errors.push(rule.message);
            break;
          case 'warning':
            warnings.push(rule.message);
            break;
          case 'info':
            info.push(rule.message);
            break;
        }
      }
    });

    setValidationResults({
      errors,
      warnings,
      info,
      isValid: errors.length === 0
    });
  }, [value, rules]);

  if (!showValidation || (validationResults.errors.length === 0 && 
                          validationResults.warnings.length === 0 && 
                          validationResults.info.length === 0)) {
    return null;
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {validationResults.errors.map((error, index) => (
        <div key={`error-${index}`} className="flex items-start space-x-2 text-red-400">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span className="text-sm">{error}</span>
        </div>
      ))}
      
      {validationResults.warnings.map((warning, index) => (
        <div key={`warning-${index}`} className="flex items-start space-x-2 text-yellow-400">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span className="text-sm">{warning}</span>
        </div>
      ))}
      
      {validationResults.info.map((infoMsg, index) => (
        <div key={`info-${index}`} className="flex items-start space-x-2 text-blue-400">
          <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span className="text-sm">{infoMsg}</span>
        </div>
      ))}
      
      {validationResults.isValid && value && (
        <div className="flex items-center space-x-2 text-green-400">
          <CheckCircle className="h-4 w-4" />
          <span className="text-sm">Valid input</span>
        </div>
      )}
    </div>
  );
};

// Common validation rules
export const ValidationRules = {
  required: (message = 'This field is required'): ValidationRule => ({
    test: (value) => value !== null && value !== undefined && value !== '',
    message,
    type: 'error'
  }),

  email: (message = 'Please enter a valid email address'): ValidationRule => ({
    test: (value) => {
      if (!value) return true; // Allow empty for optional fields
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    },
    message,
    type: 'error'
  }),

  minLength: (min: number, message?: string): ValidationRule => ({
    test: (value) => !value || value.length >= min,
    message: message || `Must be at least ${min} characters`,
    type: 'error'
  }),

  maxLength: (max: number, message?: string): ValidationRule => ({
    test: (value) => !value || value.length <= max,
    message: message || `Must be no more than ${max} characters`,
    type: 'error'
  }),

  phone: (message = 'Please enter a valid phone number'): ValidationRule => ({
    test: (value) => {
      if (!value) return true;
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      return phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''));
    },
    message,
    type: 'error'
  }),

  url: (message = 'Please enter a valid URL'): ValidationRule => ({
    test: (value) => {
      if (!value) return true;
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    },
    message,
    type: 'error'
  }),

  strongPassword: (message = 'Password should be at least 8 characters with uppercase, lowercase, and numbers'): ValidationRule => ({
    test: (value) => {
      if (!value) return true;
      const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
      return strongRegex.test(value);
    },
    message,
    type: 'warning'
  }),

  noSpecialChars: (message = 'Special characters are not allowed'): ValidationRule => ({
    test: (value) => {
      if (!value) return true;
      const specialCharsRegex = /[<>\"'&]/;
      return !specialCharsRegex.test(value);
    },
    message,
    type: 'error'
  })
};

export default EnhancedFormValidation;
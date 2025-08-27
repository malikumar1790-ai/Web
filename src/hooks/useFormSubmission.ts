import { useState, useCallback } from 'react';
import { FormValidator, FormSubmissionManager } from '../utils/formValidation';

interface SubmissionState {
  isSubmitting: boolean;
  isSuccess: boolean;
  error: string | null;
  data: any | null;
}

interface UseFormSubmissionOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  resetOnSuccess?: boolean;
  resetDelay?: number;
}

export const useFormSubmission = (options: UseFormSubmissionOptions = {}) => {
  const [state, setState] = useState<SubmissionState>({
    isSubmitting: false,
    isSuccess: false,
    error: null,
    data: null
  });

  const submit = useCallback(async (
    submitFunction: () => Promise<any>,
    validationFunction?: (data: any) => { isValid: boolean; errors: string[] }
  ) => {
    setState({
      isSubmitting: true,
      isSuccess: false,
      error: null,
      data: null
    });

    try {
      // Validate if validation function provided
      if (validationFunction) {
        const validation = validationFunction(null);
        if (!validation.isValid) {
          throw new Error(validation.errors.join(', '));
        }
      }

      // Submit with retry logic
      const result = await FormSubmissionManager.submitWithRetry(submitFunction);
      
      setState({
        isSubmitting: false,
        isSuccess: true,
        error: null,
        data: result
      });

      options.onSuccess?.(result);

      // Auto-reset success state
      if (options.resetOnSuccess !== false) {
        setTimeout(() => {
          setState(prev => ({ ...prev, isSuccess: false, data: null }));
        }, options.resetDelay || 5000);
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Submission failed';
      
      setState({
        isSubmitting: false,
        isSuccess: false,
        error: errorMessage,
        data: null
      });

      options.onError?.(error as Error);
      
      // Auto-clear error after 10 seconds
      setTimeout(() => {
        setState(prev => ({ ...prev, error: null }));
      }, 10000);

      throw error;
    }
  }, [options]);

  const reset = useCallback(() => {
    setState({
      isSubmitting: false,
      isSuccess: false,
      error: null,
      data: null
    });
  }, []);

  return {
    ...state,
    submit,
    reset
  };
};

export default useFormSubmission;
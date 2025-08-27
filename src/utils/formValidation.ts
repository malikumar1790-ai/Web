// Form validation utilities for all forms
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export class FormValidator {
  static validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email);
  }

  static validatePhone(phone: string): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  }

  static validateURL(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  static sanitizeInput(input: string, maxLength: number = 1000): string {
    return input.trim().substring(0, maxLength);
  }

  static validateContactForm(data: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields
    if (!data.name || data.name.trim().length === 0) {
      errors.push('Name is required');
    }

    if (!data.email || data.email.trim().length === 0) {
      errors.push('Email is required');
    } else if (!this.validateEmail(data.email)) {
      errors.push('Please enter a valid email address');
    }

    if (!data.message || data.message.trim().length === 0) {
      errors.push('Message is required');
    } else if (data.message.trim().length < 10) {
      errors.push('Message must be at least 10 characters long');
    } else if (data.message.trim().length > 2000) {
      errors.push('Message must be less than 2000 characters');
    }

    // Optional field validation
    if (data.company && data.company.length > 100) {
      warnings.push('Company name is very long');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  static validateProjectForm(data: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields
    if (!data.projectType) {
      errors.push('Project type is required');
    }

    if (!data.industry) {
      errors.push('Industry is required');
    }

    if (!data.budget) {
      errors.push('Budget range is required');
    }

    if (!data.timeline) {
      errors.push('Timeline is required');
    }

    if (!data.contactInfo?.name) {
      errors.push('Contact name is required');
    }

    if (!data.contactInfo?.email) {
      errors.push('Contact email is required');
    } else if (!this.validateEmail(data.contactInfo.email)) {
      errors.push('Please enter a valid contact email address');
    }

    // Optional validations
    if (data.description && data.description.length > 2000) {
      errors.push('Description must be less than 2000 characters');
    }

    if (data.features && data.features.length > 20) {
      warnings.push('Many features selected - this may increase project complexity');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  static validateJobApplication(data: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields
    if (!data.full_name || data.full_name.trim().length === 0) {
      errors.push('Full name is required');
    }

    if (!data.email || data.email.trim().length === 0) {
      errors.push('Email is required');
    } else if (!this.validateEmail(data.email)) {
      errors.push('Please enter a valid email address');
    }

    if (!data.cover_letter || data.cover_letter.trim().length === 0) {
      errors.push('Cover letter is required');
    } else if (data.cover_letter.trim().length < 50) {
      errors.push('Cover letter must be at least 50 characters long');
    } else if (data.cover_letter.trim().length > 2000) {
      errors.push('Cover letter must be less than 2000 characters');
    }

    // Optional field validation
    if (data.phone && !this.validatePhone(data.phone)) {
      warnings.push('Phone number format may be invalid');
    }

    if (data.linkedin_url && !this.validateURL(data.linkedin_url)) {
      errors.push('LinkedIn URL is not valid');
    }

    if (data.portfolio_url && !this.validateURL(data.portfolio_url)) {
      errors.push('Portfolio URL is not valid');
    }

    if (data.experience_years && (isNaN(data.experience_years) || data.experience_years < 0 || data.experience_years > 50)) {
      errors.push('Please enter a valid number of years of experience (0-50)');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  static validateFile(file: File, allowedTypes: string[], maxSizeMB: number): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!allowedTypes.includes(file.type)) {
      errors.push(`File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`);
    }

    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      errors.push(`File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds maximum of ${maxSizeMB}MB`);
    }

    if (file.size < 1024) {
      warnings.push('File seems very small - please ensure it contains your complete resume');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
}

// Form submission utilities
export class FormSubmissionManager {
  static async submitWithRetry<T>(
    submitFunction: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🔄 Submission attempt ${attempt}/${maxRetries}`);
        return await submitFunction();
      } catch (error) {
        lastError = error as Error;
        console.warn(`❌ Attempt ${attempt} failed:`, error);

        if (attempt < maxRetries) {
          console.log(`⏳ Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2; // Exponential backoff
        }
      }
    }

    throw lastError!;
  }

  static async submitFormWithFallback(
    primarySubmit: () => Promise<any>,
    fallbackSubmit: () => Promise<any>,
    formType: string
  ): Promise<any> {
    try {
      console.log(`📝 Attempting primary submission for ${formType}...`);
      return await primarySubmit();
    } catch (primaryError) {
      console.warn(`⚠️ Primary submission failed for ${formType}, trying fallback:`, primaryError);
      
      try {
        return await fallbackSubmit();
      } catch (fallbackError) {
        console.error(`❌ Both primary and fallback submissions failed for ${formType}:`, fallbackError);
        throw new Error(`Form submission failed: ${primaryError.message}. Fallback also failed: ${fallbackError.message}`);
      }
    }
  }
}
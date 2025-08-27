// Security utilities for input validation and protection
export class SecurityManager {
  // XSS Protection
  static sanitizeHTML(input: string): string {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  }

  // SQL Injection Protection (for client-side validation)
  static validateInput(input: string): boolean {
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/gi,
      /(--|\/\*|\*\/|;|'|"|`)/g,
      /(\b(OR|AND)\s+\d+\s*=\s*\d+)/gi
    ];

    return !sqlPatterns.some(pattern => pattern.test(input));
  }

  // Rate Limiting (client-side tracking)
  static rateLimiter = {
    attempts: new Map<string, { count: number; lastAttempt: number }>(),
    
    isAllowed(identifier: string, maxAttempts: number = 5, windowMs: number = 60000): boolean {
      const now = Date.now();
      const record = this.attempts.get(identifier);
      
      if (!record || now - record.lastAttempt > windowMs) {
        this.attempts.set(identifier, { count: 1, lastAttempt: now });
        return true;
      }
      
      if (record.count >= maxAttempts) {
        return false;
      }
      
      record.count++;
      record.lastAttempt = now;
      return true;
    },
    
    getRemainingTime(identifier: string, windowMs: number = 60000): number {
      const record = this.attempts.get(identifier);
      if (!record) return 0;
      
      const elapsed = Date.now() - record.lastAttempt;
      return Math.max(0, windowMs - elapsed);
    }
  };

  // Input Sanitization
  static sanitizeFormData(data: Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        sanitized[key] = this.sanitizeString(value);
      } else if (Array.isArray(value)) {
        sanitized[key] = value.map(item => 
          typeof item === 'string' ? this.sanitizeString(item) : item
        );
      } else {
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  }

  private static sanitizeString(input: string): string {
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocols
      .replace(/on\w+=/gi, '') // Remove event handlers
      .substring(0, 10000); // Limit length
  }

  // Email Validation (enhanced)
  static validateEmail(email: string): { isValid: boolean; reason?: string } {
    if (!email || email.length === 0) {
      return { isValid: false, reason: 'Email is required' };
    }

    if (email.length > 254) {
      return { isValid: false, reason: 'Email is too long' };
    }

    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    
    if (!emailRegex.test(email)) {
      return { isValid: false, reason: 'Invalid email format' };
    }

    // Check for common disposable email domains
    const disposableDomains = ['tempmail.org', '10minutemail.com', 'guerrillamail.com'];
    const domain = email.split('@')[1]?.toLowerCase();
    
    if (disposableDomains.includes(domain)) {
      return { isValid: false, reason: 'Disposable email addresses are not allowed' };
    }

    return { isValid: true };
  }

  // File Upload Validation
  static validateFileUpload(file: File, options: {
    maxSizeMB?: number;
    allowedTypes?: string[];
    allowedExtensions?: string[];
  } = {}): { isValid: boolean; reason?: string } {
    const {
      maxSizeMB = 5,
      allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      allowedExtensions = ['.pdf', '.doc', '.docx']
    } = options;

    if (!file) {
      return { isValid: false, reason: 'No file selected' };
    }

    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return { 
        isValid: false, 
        reason: `File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds maximum of ${maxSizeMB}MB` 
      };
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      return { 
        isValid: false, 
        reason: `File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}` 
      };
    }

    // Check file extension
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      return { 
        isValid: false, 
        reason: `File extension ${fileExtension} is not allowed. Allowed extensions: ${allowedExtensions.join(', ')}` 
      };
    }

    // Check for suspicious file names
    const suspiciousPatterns = [/script/i, /executable/i, /\.exe$/i, /\.bat$/i, /\.sh$/i];
    if (suspiciousPatterns.some(pattern => pattern.test(file.name))) {
      return { isValid: false, reason: 'File name contains suspicious content' };
    }

    return { isValid: true };
  }

  // CSRF Token Management
  static csrfToken = {
    generate(): string {
      return Math.random().toString(36).substring(2) + Date.now().toString(36);
    },
    
    store(token: string): void {
      sessionStorage.setItem('csrf_token', token);
    },
    
    get(): string | null {
      return sessionStorage.getItem('csrf_token');
    },
    
    validate(token: string): boolean {
      const storedToken = this.get();
      return storedToken === token;
    }
  };

  // Content Security Policy helpers
  static addSecurityHeaders(): void {
    // Add meta tags for security
    const securityMeta = [
      { name: 'X-Content-Type-Options', content: 'nosniff' },
      { name: 'X-Frame-Options', content: 'DENY' },
      { name: 'X-XSS-Protection', content: '1; mode=block' },
      { name: 'Referrer-Policy', content: 'strict-origin-when-cross-origin' }
    ];

    securityMeta.forEach(meta => {
      if (!document.querySelector(`meta[name="${meta.name}"]`)) {
        const element = document.createElement('meta');
        element.setAttribute('name', meta.name);
        element.setAttribute('content', meta.content);
        document.head.appendChild(element);
      }
    });
  }
}

// Initialize security measures
if (typeof window !== 'undefined') {
  SecurityManager.addSecurityHeaders();
}

export default SecurityManager;
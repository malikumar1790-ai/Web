// Enhanced API client with error handling and retry logic
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: string;
}

export class ApiClient {
  private static baseURL = '';
  private static defaultHeaders = {
    'Content-Type': 'application/json',
  };

  static async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
    };

    try {
      console.log(`📡 API Request: ${config.method || 'GET'} ${url}`);
      
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      console.log(`✅ API Success: ${endpoint}`, data);
      
      return {
        success: true,
        data: data.data || data,
        message: data.message,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error(`❌ API Error: ${endpoint}`, error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown API error',
        timestamp: new Date().toISOString()
      };
    }
  }

  static async get<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  static async post<T = any>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async put<T = any>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static async delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Enhanced form submission with retry logic
  static async submitForm<T = any>(
    endpoint: string,
    formData: any,
    options: {
      retries?: number;
      retryDelay?: number;
      validateBeforeSubmit?: boolean;
    } = {}
  ): Promise<ApiResponse<T>> {
    const { retries = 3, retryDelay = 1000, validateBeforeSubmit = true } = options;

    // Client-side validation if enabled
    if (validateBeforeSubmit) {
      const validation = this.validateFormData(formData);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.errors.join(', '),
          timestamp: new Date().toISOString()
        };
      }
    }

    let lastError: Error;
    
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(`📝 Form submission attempt ${attempt}/${retries}`);
        return await this.post<T>(endpoint, formData);
      } catch (error) {
        lastError = error as Error;
        console.warn(`❌ Attempt ${attempt} failed:`, error);
        
        if (attempt < retries) {
          console.log(`⏳ Retrying in ${retryDelay}ms...`);
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
      }
    }

    return {
      success: false,
      error: lastError!.message,
      timestamp: new Date().toISOString()
    };
  }

  private static validateFormData(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Basic validation
    if (!data || typeof data !== 'object') {
      errors.push('Invalid form data');
      return { isValid: false, errors };
    }

    // Check for required fields based on common patterns
    if (data.email && !this.isValidEmail(data.email)) {
      errors.push('Invalid email format');
    }

    if (data.name && (typeof data.name !== 'string' || data.name.trim().length === 0)) {
      errors.push('Name is required');
    }

    return { isValid: errors.length === 0, errors };
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // File upload with progress tracking
  static async uploadFile(
    endpoint: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<{ url: string }>> {
    return new Promise((resolve) => {
      const formData = new FormData();
      formData.append('file', file);

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable && onProgress) {
          const progress = (e.loaded / e.total) * 100;
          onProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve({
            success: xhr.status === 200,
            data: response.data || response,
            message: response.message,
            error: xhr.status !== 200 ? response.error || 'Upload failed' : undefined,
            timestamp: new Date().toISOString()
          });
        } catch (error) {
          resolve({
            success: false,
            error: 'Invalid response format',
            timestamp: new Date().toISOString()
          });
        }
      });

      xhr.addEventListener('error', () => {
        resolve({
          success: false,
          error: 'Network error during upload',
          timestamp: new Date().toISOString()
        });
      });

      xhr.open('POST', endpoint);
      xhr.send(formData);
    });
  }
}

export default ApiClient;
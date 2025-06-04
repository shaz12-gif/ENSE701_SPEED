// API utilities for making consistent API calls

// Get API URL from environment variables with fallback
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Enable/disable debug logging based on environment
const ENABLE_DEBUG_LOGGING = process.env.NEXT_PUBLIC_ENABLE_DEBUG_LOGGING === 'true';

/**
 * Make an API call with consistent error handling
 * @param endpoint API endpoint path (starting with /)
 * @param options Fetch API options
 * @returns Response with consistent success/error format
 */
export async function callApi<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; message?: string }> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Log API calls in development
    if (ENABLE_DEBUG_LOGGING) {
      console.log(`API Request: ${options.method || 'GET'} ${url}`);
    }
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    const data = await response.json().catch(() => ({}));
    
    if (ENABLE_DEBUG_LOGGING) {
      console.log(`API Response (${response.status}):`, data);
    }
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! Status: ${response.status}`);
    }
    
    return { 
      success: true, 
      data: data.data || data
    };
  } catch (error) {
    if (ENABLE_DEBUG_LOGGING) {
      console.error(`API Error (${endpoint}):`, error);
    }
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Helper for form data submissions (file uploads)
 */
export async function callApiWithFormData<T>(
  endpoint: string,
  formData: FormData,
): Promise<{ success: boolean; data?: T; message?: string }> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header - browser will set it with boundary
    });
    
    const data = await response.json().catch(() => ({}));
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! Status: ${response.status}`);
    }
    
    return { 
      success: true, 
      data: data.data || data
    };
  } catch (error) {
    if (ENABLE_DEBUG_LOGGING) {
      console.error(`API Form Data Error (${endpoint}):`, error);
    }
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
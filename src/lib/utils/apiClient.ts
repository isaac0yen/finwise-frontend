// src/lib/utils/apiClient.ts
// No React imports needed for this utility

/**
 * API client with authentication handling
 */

const API_BASE_URL = 'https://acad-celestia-backend.mygenius.ng/api';

// Custom error type for API errors
export class ApiError extends Error {
  status: number;
  isAuthError: boolean;

  constructor(message: string, status: number = 0, isAuthError: boolean = false) {
    super(message);
    this.status = status;
    this.isAuthError = isAuthError;
    this.name = 'ApiError';
  }
}

// Function to handle auth errors - can be called from anywhere
export function handleAuthError() {
  // Clear the token
  localStorage.removeItem('token');

  // Show alert
  alert('Your session has expired. Please log in again.');
  
  // Redirect to login
  window.location.href = '/login';
}

// Type for API response
interface ApiResponse<T = unknown> {
  status: boolean;
  message: string;
  data?: T;
  [key: string]: unknown; // For other fields like tokens, etc.
}

/**
 * Make an API request with authentication handling
 */
export async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    // Get the token
    const token = localStorage.getItem('token');
    
    // Build headers with auth token
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers,
    };
    
    // Make the request
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
    
    // Parse the response
    const data = await response.json();
    
    // Check for auth errors in the response
    if (!data.status && data.message.includes('Authentication required')) {
      // This is an auth error - handle it
      handleAuthError();
      throw new ApiError(data.message, response.status, true);
    }
    
    return data;
  } catch (error) {
    // If it's already an ApiError with auth error, just rethrow
    if (error instanceof ApiError && error.isAuthError) {
      throw error;
    }
    
    // Otherwise create a new error
    throw new ApiError(
      (error instanceof Error) ? error.message : 'An unknown error occurred',
      0,
      false
    );
  }
}

// Convenience methods for common HTTP methods
export const api = {
  get: <T = unknown>(endpoint: string, options?: RequestInit) => 
    apiRequest<T>(endpoint, { ...options, method: 'GET' }),
  
  post: <T = unknown>(endpoint: string, body?: Record<string, unknown>, options?: RequestInit) =>
    apiRequest<T>(endpoint, { 
      ...options, 
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),
  
  put: <T = unknown>(endpoint: string, body?: Record<string, unknown>, options?: RequestInit) =>
    apiRequest<T>(endpoint, { 
      ...options, 
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),
  
  delete: <T = unknown>(endpoint: string, options?: RequestInit) =>
    apiRequest<T>(endpoint, { ...options, method: 'DELETE' }),
};

export default api;

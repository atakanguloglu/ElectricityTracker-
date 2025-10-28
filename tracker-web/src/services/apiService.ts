import { apiClient } from './apiClient';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function apiRequest<T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  endpoint: string,
  data?: any,
  options?: {
    headers?: Record<string, string>;
    timeout?: number;
  }
): Promise<T> {
  try {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    
    const config: any = {
      method,
      url,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      timeout: options?.timeout || 30000,
    };

    if (data) {
      if (method === 'GET') {
        config.params = data;
      } else {
        config.data = data;
      }
    }

    const response = await apiClient(config);
    return response.data;
  } catch (error: any) {
    console.error(`API Request Error (${method} ${endpoint}):`, error);
    
    if (error.response) {
      // Server responded with error status
      throw new Error(error.response.data?.message || `HTTP ${error.response.status}: ${error.response.statusText}`);
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.');
    } else {
      // Something else happened
      throw new Error(error.message || 'Beklenmeyen bir hata oluştu.');
    }
  }
}

// Convenience methods
export const api = {
  get: <T>(endpoint: string, params?: any, options?: any) => 
    apiRequest<T>('GET', endpoint, params, options),
  
  post: <T>(endpoint: string, data?: any, options?: any) => 
    apiRequest<T>('POST', endpoint, data, options),
  
  put: <T>(endpoint: string, data?: any, options?: any) => 
    apiRequest<T>('PUT', endpoint, data, options),
  
  delete: <T>(endpoint: string, options?: any) => 
    apiRequest<T>('DELETE', endpoint, undefined, options),
  
  patch: <T>(endpoint: string, data?: any, options?: any) => 
    apiRequest<T>('PATCH', endpoint, data, options),
};

import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { API_CONFIG } from '@/config/api.config';
import { logger } from '@/utils/logger';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token AND LOG
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const startTime = Date.now();
    // @ts-ignore - custom property
    config.metadata = { startTime };

    // SSR-safe localStorage access
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 🔍 LOG REQUEST
    logger.apiRequest(
      config.method?.toUpperCase() || 'GET',
      `${config.baseURL}${config.url}`,
      config.data
    );

    return config;
  },
  (error: AxiosError) => {
    logger.error('❌ Request Interceptor Error', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors AND LOG
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // @ts-ignore
    const startTime = response.config.metadata?.startTime;
    const duration = startTime ? Date.now() - startTime : undefined;

    // 🔍 LOG RESPONSE
    logger.apiResponse(
      response.config.method?.toUpperCase() || 'GET',
      `${response.config.baseURL}${response.config.url}`,
      response.status,
      response.data,
      duration
    );

    return response;
  },
  (error: AxiosError) => {
    // @ts-ignore
    const startTime = error.config?.metadata?.startTime;
    const duration = startTime ? Date.now() - startTime : undefined;

    // 🔍 LOG ERROR RESPONSE
    if (error.response) {
      logger.apiResponse(
        error.config?.method?.toUpperCase() || 'GET',
        `${error.config?.baseURL}${error.config?.url}`,
        error.response.status,
        error.response.data,
        duration
      );
    } else {
      logger.error('❌ API Error (No Response)', error);
    }

    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      logger.warning('🔐 Unauthorized - Redirecting to login');
      // Token expired or invalid - SSR-safe handling
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export { apiClient }; 
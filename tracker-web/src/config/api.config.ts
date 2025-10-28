/**
 * API Configuration
 * 
 * Centralizes all API-related configuration.
 * Uses environment variables with fallback values for development.
 */

export const API_CONFIG = {
  /**
   * Base URL for the API
   * Set via NEXT_PUBLIC_API_URL environment variable
   */
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5143',
  
  /**
   * API timeout in milliseconds
   */
  TIMEOUT: 30000,
  
  /**
   * Debug mode
   */
  DEBUG: process.env.NEXT_PUBLIC_DEBUG === 'true',
  
  /**
   * Environment
   */
  ENV: process.env.NEXT_PUBLIC_ENV || 'development',
} as const;

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/tenant/register',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
  },
  
  // Dashboard
  DASHBOARD: {
    STATS: '/api/dashboard/stats',
    CONSUMPTION_CHART: '/api/dashboard/consumption-chart',
    FACILITY_DISTRIBUTION: '/api/dashboard/facility-distribution',
    RECENT_ALERTS: '/api/dashboard/recent-alerts',
  },
  
  // Core
  DEPARTMENTS: '/api/department',
  FACILITIES: '/api/facility',
  METERS: '/api/meter',
  CONSUMPTION: '/api/consumption',
  
  // Admin (Deprecated - use SUPER_ADMIN instead)
  ADMIN: {
    USERS: '/api/superadmin/users',
    TENANTS: '/api/superadmin/tenants',
    LOGS: '/api/superadmin/logs',
  },
  
  // Super Admin
  SUPER_ADMIN: {
    TENANTS: '/api/superadmin/tenants',
    BILLING: '/api/superadmin/billing',
    SECURITY: '/api/superadmin/security',
    MONITORING: '/api/superadmin/monitoring',
  },
} as const;

/**
 * Build full API URL
 */
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

/**
 * Log API configuration (only in debug mode)
 */
if (API_CONFIG.DEBUG && typeof window !== 'undefined') {
  console.log('[API Config]', {
    baseUrl: API_CONFIG.BASE_URL,
    environment: API_CONFIG.ENV,
    timeout: API_CONFIG.TIMEOUT,
  });
}


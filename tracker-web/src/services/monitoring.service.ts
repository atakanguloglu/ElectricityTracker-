import { apiClient } from './apiClient'
import type { SystemStats, SystemLog, LogFilters, PagedResult } from '@/types/api.types'

const BASE_URL = '/api/superadmin'

export const monitoringService = {
  /**
   * Get system health status
   */
  async getSystemHealth(): Promise<any> {
    const response = await apiClient.get(`${BASE_URL}/monitoring/health`)
    return response.data
  },

  /**
   * Get system resources (CPU, RAM, Disk)
   */
  async getSystemResources(): Promise<SystemStats> {
    const response = await apiClient.get<SystemStats>(`${BASE_URL}/monitoring/resources`)
    return response.data
  },

  /**
   * Get system logs
   */
  async getLogs(filters?: LogFilters): Promise<PagedResult<SystemLog>> {
    const params = new URLSearchParams()
    
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.pageSize) params.append('pageSize', filters.pageSize.toString())
    if (filters?.search) params.append('search', filters.search)
    if (filters?.level) params.append('level', filters.level)
    if (filters?.source) params.append('source', filters.source)
    if (filters?.startDate) params.append('startDate', filters.startDate)
    if (filters?.endDate) params.append('endDate', filters.endDate)
    if (filters?.tenantId) params.append('tenantId', filters.tenantId.toString())
    if (filters?.userId) params.append('userId', filters.userId.toString())

    const response = await apiClient.get<any>(
      `${BASE_URL}/logs?${params.toString()}`
    )
    
    // Transform PascalCase (backend) to camelCase (frontend)
    const data = response.data
    return {
      items: data.Items || data.items || [],
      totalCount: data.TotalCount || data.totalCount || 0,
      page: data.Page || data.page || 1,
      pageSize: data.PageSize || data.pageSize || 10,
      totalPages: data.TotalPages || data.totalPages || 0,
    }
  },

  /**
   * Get error logs
   */
  async getErrorLogs(limit: number = 50): Promise<SystemLog[]> {
    const response = await apiClient.get<any>(
      `${BASE_URL}/logs?level=Error&pageSize=${limit}`
    )
    // Transform PascalCase to camelCase
    const items = response.data.Items || response.data.items || []
    return items
  },

  /**
   * Get API metrics
   */
  async getApiMetrics(): Promise<any> {
    const response = await apiClient.get(`${BASE_URL}/monitoring/metrics`)
    return response.data
  },

  /**
   * Get database performance
   */
  async getDatabasePerformance(): Promise<any> {
    const response = await apiClient.get(`${BASE_URL}/monitoring/database`)
    return response.data
  },

  /**
   * Get active sessions
   */
  async getActiveSessions(): Promise<any[]> {
    const response = await apiClient.get(`${BASE_URL}/monitoring/sessions`)
    return response.data
  },
}


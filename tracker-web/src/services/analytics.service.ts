import { apiClient } from './apiClient'
import type { DashboardStats, TenantGrowth, RevenueData } from '@/types/api.types'

const BASE_URL = '/api/superadmin'

export const analyticsService = {
  /**
   * Get dashboard statistics
   */
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await apiClient.get<DashboardStats>(`${BASE_URL}/dashboard/stats`)
    return response.data
  },

  /**
   * Get tenant growth data
   */
  async getTenantGrowth(startDate: string, endDate: string): Promise<TenantGrowth[]> {
    const response = await apiClient.get<TenantGrowth[]>(
      `${BASE_URL}/analytics/tenant-growth?startDate=${startDate}&endDate=${endDate}`
    )
    return response.data
  },

  /**
   * Get revenue data
   */
  async getRevenueData(startDate: string, endDate: string): Promise<RevenueData[]> {
    const response = await apiClient.get<RevenueData[]>(
      `${BASE_URL}/analytics/revenue?startDate=${startDate}&endDate=${endDate}`
    )
    return response.data
  },

  /**
   * Get user activity statistics
   */
  async getUserActivityStats(): Promise<any> {
    const response = await apiClient.get(`${BASE_URL}/analytics/user-activity`)
    return response.data
  },

  /**
   * Get consumption trends
   */
  async getConsumptionTrends(tenantId?: number): Promise<any> {
    const url = tenantId 
      ? `${BASE_URL}/analytics/consumption?tenantId=${tenantId}`
      : `${BASE_URL}/analytics/consumption`
    const response = await apiClient.get(url)
    return response.data
  },

  /**
   * Get system performance metrics
   */
  async getPerformanceMetrics(): Promise<any> {
    const response = await apiClient.get(`${BASE_URL}/analytics/performance`)
    return response.data
  },
}


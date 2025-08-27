import { apiClient } from './apiClient';

export interface AnalyticsOverview {
  TotalUsers: number;
  ActiveUsers: number;
  TotalRevenue: number;
  AvgSessionTime: number;
}

export interface AnalyticsTrend {
  Date: string;
  Users: number;
  Revenue: number;
  Sessions: number;
}

export interface TopTenant {
  Id: number;
  Name: string;
  Consumption: number;
  Growth: number;
  Status: string;
}

export interface DeviceUsage {
  Device: string;
  Usage: number;
  Color: string;
}

class AnalyticsService {
  // Get analytics overview
  async getOverview(): Promise<AnalyticsOverview> {
    const response = await apiClient.get('/api/admin/analytics/overview');
    return response.data;
  }

  // Get analytics trends
  async getTrends(months: number = 6): Promise<AnalyticsTrend[]> {
    const response = await apiClient.get('/api/admin/analytics/trends', {
      params: { months }
    });
    return response.data;
  }

  // Get top tenants
  async getTopTenants(): Promise<TopTenant[]> {
    const response = await apiClient.get('/api/admin/analytics/top-tenants');
    return response.data;
  }

  // Get device usage
  async getDeviceUsage(): Promise<DeviceUsage[]> {
    const response = await apiClient.get('/api/admin/analytics/device-usage');
    return response.data;
  }
}

export const analyticsService = new AnalyticsService();
export default analyticsService;


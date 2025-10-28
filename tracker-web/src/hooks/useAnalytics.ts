import { useQuery } from '@tanstack/react-query'
import { analyticsService } from '@/services/analytics.service'

// Query Keys
export const analyticsKeys = {
  all: ['analytics'] as const,
  dashboard: () => [...analyticsKeys.all, 'dashboard'] as const,
  tenantGrowth: (startDate: string, endDate: string) => 
    [...analyticsKeys.all, 'tenant-growth', startDate, endDate] as const,
  revenue: (startDate: string, endDate: string) => 
    [...analyticsKeys.all, 'revenue', startDate, endDate] as const,
  userActivity: () => [...analyticsKeys.all, 'user-activity'] as const,
  consumption: (tenantId?: number) => 
    [...analyticsKeys.all, 'consumption', tenantId] as const,
  performance: () => [...analyticsKeys.all, 'performance'] as const,
}

/**
 * Hook to fetch dashboard statistics
 */
export function useDashboardStats() {
  return useQuery({
    queryKey: analyticsKeys.dashboard(),
    queryFn: () => analyticsService.getDashboardStats(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Hook to fetch tenant growth data
 */
export function useTenantGrowth(startDate: string, endDate: string) {
  return useQuery({
    queryKey: analyticsKeys.tenantGrowth(startDate, endDate),
    queryFn: () => analyticsService.getTenantGrowth(startDate, endDate),
    enabled: !!startDate && !!endDate,
  })
}

/**
 * Hook to fetch revenue data
 */
export function useRevenueData(startDate: string, endDate: string) {
  return useQuery({
    queryKey: analyticsKeys.revenue(startDate, endDate),
    queryFn: () => analyticsService.getRevenueData(startDate, endDate),
    enabled: !!startDate && !!endDate,
  })
}

/**
 * Hook to fetch user activity statistics
 */
export function useUserActivity() {
  return useQuery({
    queryKey: analyticsKeys.userActivity(),
    queryFn: () => analyticsService.getUserActivityStats(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Hook to fetch consumption trends
 */
export function useConsumptionTrends(tenantId?: number) {
  return useQuery({
    queryKey: analyticsKeys.consumption(tenantId),
    queryFn: () => analyticsService.getConsumptionTrends(tenantId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Hook to fetch system performance metrics
 */
export function usePerformanceMetrics() {
  return useQuery({
    queryKey: analyticsKeys.performance(),
    queryFn: () => analyticsService.getPerformanceMetrics(),
    refetchInterval: 30000, // Refetch every 30 seconds
  })
}


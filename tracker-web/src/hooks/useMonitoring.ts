import { useQuery } from '@tanstack/react-query'
import { monitoringService } from '@/services/monitoring.service'
import type { SystemStats, LogFilters } from '@/types/api.types'

// Query Keys
export const monitoringKeys = {
  all: ['monitoring'] as const,
  health: () => [...monitoringKeys.all, 'health'] as const,
  resources: () => [...monitoringKeys.all, 'resources'] as const,
  logs: () => [...monitoringKeys.all, 'logs'] as const,
  logList: (filters?: LogFilters) => [...monitoringKeys.logs(), filters] as const,
  errors: () => [...monitoringKeys.all, 'errors'] as const,
  metrics: () => [...monitoringKeys.all, 'metrics'] as const,
  database: () => [...monitoringKeys.all, 'database'] as const,
  sessions: () => [...monitoringKeys.all, 'sessions'] as const,
}

/**
 * Hook to fetch system health
 */
export function useSystemHealth() {
  return useQuery({
    queryKey: monitoringKeys.health(),
    queryFn: () => monitoringService.getSystemHealth(),
    refetchInterval: 30000, // Refetch every 30 seconds
  })
}

/**
 * Hook to fetch system resources
 */
export function useSystemResources() {
  return useQuery({
    queryKey: monitoringKeys.resources(),
    queryFn: () => monitoringService.getSystemResources(),
    refetchInterval: 5000, // Refetch every 5 seconds for real-time data
  })
}

/**
 * Hook to fetch system logs
 */
export function useLogs(filters?: LogFilters) {
  return useQuery({
    queryKey: monitoringKeys.logList(filters),
    queryFn: () => monitoringService.getLogs(filters),
    staleTime: 1000 * 60, // 1 minute
  })
}

/**
 * Hook to fetch error logs
 */
export function useErrorLogs(limit: number = 50) {
  return useQuery({
    queryKey: [...monitoringKeys.errors(), limit],
    queryFn: () => monitoringService.getErrorLogs(limit),
    refetchInterval: 10000, // Refetch every 10 seconds
  })
}

/**
 * Hook to fetch API metrics
 */
export function useApiMetrics() {
  return useQuery({
    queryKey: monitoringKeys.metrics(),
    queryFn: () => monitoringService.getApiMetrics(),
    refetchInterval: 15000, // Refetch every 15 seconds
  })
}

/**
 * Hook to fetch database performance
 */
export function useDatabasePerformance() {
  return useQuery({
    queryKey: monitoringKeys.database(),
    queryFn: () => monitoringService.getDatabasePerformance(),
    refetchInterval: 20000, // Refetch every 20 seconds
  })
}

/**
 * Hook to fetch active sessions
 */
export function useActiveSessions() {
  return useQuery({
    queryKey: monitoringKeys.sessions(),
    queryFn: () => monitoringService.getActiveSessions(),
    refetchInterval: 10000, // Refetch every 10 seconds
  })
}


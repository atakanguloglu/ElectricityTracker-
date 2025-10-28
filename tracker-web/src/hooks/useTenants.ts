import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'
import { tenantService } from '@/services/tenant.service'
import type {
  Tenant,
  CreateTenantDto,
  UpdateTenantDto,
  TenantFilters,
} from '@/types/api.types'

// Query Keys
export const tenantKeys = {
  all: ['tenants'] as const,
  lists: () => [...tenantKeys.all, 'list'] as const,
  list: (filters?: TenantFilters) => [...tenantKeys.lists(), filters] as const,
  details: () => [...tenantKeys.all, 'detail'] as const,
  detail: (id: number) => [...tenantKeys.details(), id] as const,
  stats: (id: number) => [...tenantKeys.all, 'stats', id] as const,
}

/**
 * Hook to fetch paginated tenants
 */
export function useTenants(filters?: TenantFilters) {
  return useQuery({
    queryKey: tenantKeys.list(filters),
    queryFn: () => tenantService.getTenants(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Hook to fetch single tenant
 */
export function useTenant(id: number, enabled = true) {
  return useQuery({
    queryKey: tenantKeys.detail(id),
    queryFn: () => tenantService.getTenant(id),
    enabled: enabled && id > 0,
  })
}

/**
 * Hook to create tenant
 */
export function useCreateTenant() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateTenantDto) => tenantService.createTenant(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.lists() })
      message.success('Tenant başarıyla oluşturuldu')
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Tenant oluşturulurken hata oluştu')
    },
  })
}

/**
 * Hook to update tenant
 */
export function useUpdateTenant() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTenantDto }) =>
      tenantService.updateTenant(id, data),
    onSuccess: (_: Tenant, variables: { id: number; data: UpdateTenantDto }) => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.lists() })
      queryClient.invalidateQueries({ queryKey: tenantKeys.detail(variables.id) })
      message.success('Tenant başarıyla güncellendi')
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Tenant güncellenirken hata oluştu')
    },
  })
}

/**
 * Hook to delete tenant
 */
export function useDeleteTenant() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => tenantService.deleteTenant(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.lists() })
      message.success('Tenant başarıyla silindi')
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Tenant silinirken hata oluştu')
    },
  })
}

/**
 * Hook to suspend tenant
 */
export function useSuspendTenant() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) =>
      tenantService.suspendTenant(id, reason),
    onSuccess: (_: void, variables: { id: number; reason: string }) => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.lists() })
      queryClient.invalidateQueries({ queryKey: tenantKeys.detail(variables.id) })
      message.success('Tenant askıya alındı')
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'İşlem sırasında hata oluştu')
    },
  })
}

/**
 * Hook to activate tenant
 */
export function useActivateTenant() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => tenantService.activateTenant(id),
    onSuccess: (_: void, id: number) => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.lists() })
      queryClient.invalidateQueries({ queryKey: tenantKeys.detail(id) })
      message.success('Tenant aktifleştirildi')
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'İşlem sırasında hata oluştu')
    },
  })
}


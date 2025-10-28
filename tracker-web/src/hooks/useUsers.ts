import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'
import { userService } from '@/services/user.service'
import type {
  User,
  CreateUserDto,
  UpdateUserDto,
  UserFilters,
} from '@/types/api.types'

// Query Keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters?: UserFilters) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
  activity: (id: number) => [...userKeys.all, 'activity', id] as const,
}

/**
 * Hook to fetch paginated users
 */
export function useUsers(filters?: UserFilters) {
  return useQuery({
    queryKey: userKeys.list(filters),
    queryFn: () => userService.getUsers(filters),
    staleTime: 1000 * 60 * 5,
  })
}

/**
 * Hook to fetch single user
 */
export function useUser(id: number, enabled = true) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => userService.getUser(id),
    enabled: enabled && id > 0,
  })
}

/**
 * Hook to create user
 */
export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateUserDto) => userService.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
      message.success('Kullanıcı başarıyla oluşturuldu')
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Kullanıcı oluşturulurken hata oluştu')
    },
  })
}

/**
 * Hook to update user
 */
export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserDto }) =>
      userService.updateUser(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) })
      message.success('Kullanıcı başarıyla güncellendi')
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Kullanıcı güncellenirken hata oluştu')
    },
  })
}

/**
 * Hook to delete user
 */
export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => userService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
      message.success('Kullanıcı başarıyla silindi')
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Kullanıcı silinirken hata oluştu')
    },
  })
}

/**
 * Hook to reset user password
 */
export function useResetPassword() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, newPassword }: { id: number; newPassword: string }) =>
      userService.resetPassword(id, newPassword),
    onSuccess: () => {
      message.success('Şifre başarıyla sıfırlandı')
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Şifre sıfırlama hatası')
    },
  })
}

/**
 * Hook to toggle user status
 */
export function useToggleUserStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      userService.toggleUserStatus(id, isActive),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) })
      message.success('Kullanıcı durumu güncellendi')
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'İşlem sırasında hata oluştu')
    },
  })
}


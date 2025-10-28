import { apiClient } from './apiClient'
import type {
  User,
  CreateUserDto,
  UpdateUserDto,
  UserFilters,
  PagedResult,
} from '@/types/api.types'

const BASE_URL = '/api/superadmin'

export const userService = {
  /**
   * Get paginated list of users
   */
  async getUsers(filters?: UserFilters): Promise<PagedResult<User>> {
    const params = new URLSearchParams()
    
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.pageSize) params.append('pageSize', filters.pageSize.toString())
    if (filters?.search) params.append('search', filters.search)
    if (filters?.tenantId) params.append('tenantId', filters.tenantId.toString())
    if (filters?.role) params.append('role', filters.role)
    if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString())

    const response = await apiClient.get<any>(
      `${BASE_URL}/users?${params.toString()}`
    )
    
    // Transform PascalCase (backend) to camelCase (frontend)
    const data = response.data
    const rawItems = data.Items || data.items || []
    
    // Transform each user object
    const transformedItems = rawItems.map((user: any) => ({
      id: user.Id || user.id,
      firstName: user.FirstName || user.firstName,
      lastName: user.LastName || user.lastName,
      fullName: user.FullName || user.fullName,
      username: user.Username || user.username,
      email: user.Email || user.email,
      role: user.Role || user.role,
      roleName: user.RoleName || user.roleName,
      tenantId: user.TenantId || user.tenantId,
      tenantName: user.TenantName || user.tenantName,
      isActive: user.IsActive ?? user.isActive,
      isLocked: user.IsLocked ?? user.isLocked,
      phone: user.Phone || user.phone,
      department: user.Department || user.department,
      position: user.Position || user.position,
      lastLoginAt: user.LastLoginAt || user.lastLoginAt,
      lastLogin: user.LastLogin || user.lastLogin,
      loginCount: user.LoginCount || user.loginCount,
      passwordHash: user.PasswordHash || user.passwordHash,
      createdAt: user.CreatedAt || user.createdAt,
    }))
    
    return {
      items: transformedItems,
      totalCount: data.TotalCount || data.totalCount || 0,
      page: data.Page || data.page || 1,
      pageSize: data.PageSize || data.pageSize || 10,
      totalPages: data.TotalPages || data.totalPages || 0,
    }
  },

  /**
   * Get single user by ID
   */
  async getUser(id: number): Promise<User> {
    const response = await apiClient.get<User>(`${BASE_URL}/users/${id}`)
    return response.data
  },

  /**
   * Create new user
   */
  async createUser(data: CreateUserDto): Promise<User> {
    const response = await apiClient.post<User>(`${BASE_URL}/users`, data)
    return response.data
  },

  /**
   * Update existing user
   */
  async updateUser(id: number, data: UpdateUserDto): Promise<User> {
    const response = await apiClient.put<User>(`${BASE_URL}/users/${id}`, data)
    return response.data
  },

  /**
   * Delete user
   */
  async deleteUser(id: number): Promise<void> {
    await apiClient.delete(`${BASE_URL}/users/${id}`)
  },

  /**
   * Reset user password
   */
  async resetPassword(id: number, newPassword: string): Promise<void> {
    await apiClient.post(`${BASE_URL}/users/${id}/reset-password`, { newPassword })
  },

  /**
   * Toggle user active status
   */
  async toggleUserStatus(id: number, isActive: boolean): Promise<void> {
    await apiClient.patch(`${BASE_URL}/users/${id}/status`, { isActive })
  },

  /**
   * Get user activity logs
   */
  async getUserActivity(id: number): Promise<any[]> {
    const response = await apiClient.get(`${BASE_URL}/users/${id}/activity`)
    return response.data
  },
}

